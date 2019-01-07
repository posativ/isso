# -*- encoding: utf-8 -*-

from __future__ import unicode_literals

import sys
import io
import time
import json
import os.path

import socket
import smtplib

from email.utils import formatdate
from email.header import Header
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader
import jinja2.exceptions as jinja2_exceptions

try:
    from urllib.parse import quote
except ImportError:
    from urllib import quote

import logging
logger = logging.getLogger("isso")

try:
    import uwsgi
except ImportError:
    uwsgi = None

from isso.compat import PY2K
from isso import local

if PY2K:
    from thread import start_new_thread
else:
    from _thread import start_new_thread


class SMTPConnection(object):

    def __init__(self, conf):
        self.conf = conf

    def __enter__(self):
        klass = (smtplib.SMTP_SSL if self.conf.get(
            'security') == 'ssl' else smtplib.SMTP)
        self.client = klass(host=self.conf.get('host'),
                            port=self.conf.getint('port'),
                            timeout=self.conf.getint('timeout'))

        if self.conf.get('security') == 'starttls':
            if sys.version_info >= (3, 4):
                import ssl
                self.client.starttls(context=ssl.create_default_context())
            else:
                self.client.starttls()

        username = self.conf.get('username')
        password = self.conf.get('password')
        if username and password:
            if PY2K:
                username = username.encode('ascii')
                password = password.encode('ascii')

            self.client.login(username, password)

        return self.client

    def __exit__(self, exc_type, exc_value, traceback):
        self.client.quit()


class SMTP(object):

    def __init__(self, isso):

        self.isso = isso
        self.conf = isso.conf.section("smtp")
        self.public_endpoint = isso.conf.get("server", "public-endpoint") or local("host")
        self.admin_notify = any((n in ("smtp", "SMTP")) for n in isso.conf.getlist("general", "notify"))
        self.reply_notify = isso.conf.getboolean("general", "reply-notifications")
        self.mail_lang = self.isso.conf.get("smtp", "mail_language")
        self.mail_format = self.isso.conf.get("smtp", "mail_format")
        
        try:
            self.no_name = self.isso.conf.get("smtp", "anonymous_%s" % self.mail_lang)
        except:
            logger.warn('[smtp] No anonymous for such language: %s. Anonymous fell back to the default "Anonymous".' % self.mail_lang)
            self.no_name = "Anonymous"
        logger.info("[smtp] You are now using language {0}. To change anonymous from {1} to your desired string in the current language, set 'anonymous_{0} = your desired string' in the [smtp] section of the server conf.".format(self.mail_lang,self.no_name))
        
        # test SMTP connectivity
        try:
            with SMTPConnection(self.conf):
                logger.info("connected to SMTP server")
        except (socket.error, smtplib.SMTPException):
            logger.exception("unable to connect to SMTP server")

        if uwsgi:
            def spooler(args):
                try:
                    self._sendmail(args[b"subject"].decode("utf-8"),
                                   args["body"].decode("utf-8"),
                                   args[b"to"].decode("utf-8"))
                except smtplib.SMTPConnectError:
                    return uwsgi.SPOOL_RETRY
                else:
                    return uwsgi.SPOOL_OK

            uwsgi.spooler = spooler

    def __iter__(self):
        yield "comments.new:after-save", self.notify_new
        yield "comments.activate", self.notify_activated

    def format(self, thread, comment, parent_comment, recipient=None, admin=False):
        
        jinjaenv=Environment(loader=FileSystemLoader("/"))
        
        temp_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "templates/")  
        com_ori_admin = com_ori_user = "comment.%s" % self.mail_format
        
        if self.mail_lang != "en":
            com_ori = os.path.join(temp_path, "comment_%s.%s" % (self.mail_lang, self.mail_format))
            try:
                jinjaenv.get_template(com_ori)
            except jinja2_exceptions.TemplateSyntaxError as err:
                logger.warn("[smtp] Wrong format. %s"%err)
                logger.warn("[smtp] Default template fell back to the one for en.")
            except jinja2_exceptions.TemplateNotFound:
                logger.warn("[smtp] No default template for such language: %s. Default template fell back to the one for en." % self.mail_lang)
            except Exception as err:
                logger.warn("[smtp] Some error about jinja2. %s"  % type(err))
                for er in err.args:
                    logger.warn(      "%s" % er)
                logger.warn("[smtp] Default template fell back to the one for en.")
            else:
                com_ori_admin = com_ori_user = os.path.basename(com_ori)

        if self.isso.conf.get("smtp", "mail_template"):
            com_ori = self.isso.conf.get("smtp", "mail_template")
            if os.path.isfile(com_ori):
                try:
                    jinjaenv.get_template(com_ori)
                except jinja2_exceptions.TemplateSyntaxError as err:
                    logger.warn("[smtp] Wrong format. %s"%err)
                    logger.warn("[smtp] The template fell back to the default")
                except Exception as err:
                    logger.warn("[smtp] %s"  % type(err))
                    for er in err.args:
                        logger.warn(      "%s" % er)
                    logger.warn("[smtp] The template fell back to the default")
                else:
                    logger.info("[smtp] You are now using your customized templates in {0}".format(com_ori))
                    com_ori_admin = com_ori_user = os.path.basename(com_ori)
                    temp_path = os.path.dirname(com_ori)
            elif os.path.isdir(com_ori):
                try:
                    jinjaenv.get_template(os.path.join(com_ori, "admin.%s"%self.mail_format))
                    jinjaenv.get_template(os.path.join(com_ori, "user.%s"%self.mail_format))
                except jinja2_exceptions.TemplateSyntaxError as err:
                    logger.warn("[smtp] Wrong format. %s" % err)
                    logger.warn("[smtp] The template fell back to the default")
                except jinja2_exceptions.TemplateNotFound:
                    logger.warn("[smtp] No usable templates found in {c_path}, the template used for email notification sent to admin should be named 'admin.{format}', and the template for reply notification to the subcribed users should be named 'user.{format}'.".format(c_path=com_ori,format=self.mail_format)
                                )
                    logger.warn("[smtp] The template fell back to the default")
                except Exception as err:
                    logger.warn("[smtp] Some error about jinja2. %s"  % type(err))
                    for er in err.args:
                        logger.warn(      "%s" % er)
                    logger.warn("[smtp] The template fell back to the default")
                else:
                    logger.info("[smtp] You are now using your customized templates in {0}, 'admin.{1}' for admin notification, 'user.{1}' for reply notication to the subcribers".format(com_ori,self.mail_format))
                    com_ori_admin = "admin.%s" % self.mail_format
                    com_ori_user = "user.%s"% self.mail_format
                    temp_path = com_ori
            else:
                logger.warn("[smtp] %s does not exist. Fell back to the default template."%com_ori)
        else:
            logger.info("[smtp] You are now using the default template.")

        jinjaenv=Environment(loader=FileSystemLoader(temp_path))

        if admin:
            uri = self.public_endpoint + "/id/%i" % comment["id"]
            key = self.isso.sign(comment["id"])
            com_temp = jinjaenv.get_template(com_ori_admin).render(author = comment["author"] or self.no_name,
                                                                   email = comment["email"],
                                                                   admin = admin,
                                                                   mode = comment["mode"],
                                                                   comment = comment["text"],
                                                                   website = comment["website"],
                                                                   ip = comment["remote_addr"],
                                                                   com_link = local("origin") + thread["uri"] + "#isso-%i" % comment["id"],
                                                                   del_link = uri + "/delete/" + key,
                                                                   act_link = uri + "/activate/" + key,
                                                                   thread_link = local("origin") + thread["uri"],
                                                                   thread_title = thread["title"]
                                                                   )
        else:
            uri = self.public_endpoint + "/id/%i" % parent_comment["id"]
            key = self.isso.sign(('unsubscribe', recipient))
            com_temp = jinjaenv.get_template(com_ori_user).render(author = comment["author"] or self.no_name,
                                                                  email = comment["email"],
                                                                  admin = admin,
                                                                  comment = comment["text"],
                                                                  website = comment["website"],
                                                                  ip = comment["remote_addr"],
                                                                  parent_link = local("origin") + thread["uri"] + "#isso-%i" % parent_comment["id"],
                                                                  com_link = local("origin") + thread["uri"] + "#isso-%i" % comment["id"],
                                                                  unsubscribe = uri + "/unsubscribe/" + quote(recipient) + "/" + key,
                                                                  thread_link = local("origin") + thread["uri"],
                                                                  thread_title = thread["title"]
                                                                  )

        return com_temp

    def notify_new(self, thread, comment):
        if self.admin_notify:
            body = self.format(thread, comment, None, admin=True)
            mailtitle_admin = self.isso.conf.get("smtp", "mail_title_admin").format(title = thread["title"],
                                                                                    replier = comment["author"] or self.no_name)
            self.sendmail(mailtitle_admin, body, thread, comment)
            logger.info("[smtp] Sending notification mail titled '{0}' to the admin".format(mailtitle_admin))

        if comment["mode"] == 1:
            self.notify_users(thread, comment)

    def notify_activated(self, thread, comment):
        self.notify_users(thread, comment)

    def notify_users(self, thread, comment):
        if self.reply_notify and "parent" in comment and comment["parent"] is not None:
            # Notify interested authors that a new comment is posted
            notified = []
            parent_comment = self.isso.db.comments.get(comment["parent"])
            comments_to_notify = [parent_comment] if parent_comment is not None else []
            comments_to_notify += self.isso.db.comments.fetch(thread["uri"], mode=1, parent=comment["parent"])
            for comment_to_notify in comments_to_notify:
                email = comment_to_notify["email"]
                if "email" in comment_to_notify and comment_to_notify["notification"] and email not in notified \
                        and comment_to_notify["id"] != comment["id"] and email != comment["email"]:
                    body = self.format(thread, comment, parent_comment, email, admin=False)
                    subject = self.isso.conf.get("smtp", "mail_title_user").format(title = thread["title"],
                                                                                   receiver = parent_comment["author"] or self.no_name,
                                                                                   replier = comment["author"] or self.no_name)
                    self.sendmail(subject, body, thread, comment, to=email)
                    logger.info("[smtp] Sending notification mail titled '{0}' to {1}".format(subject,email))
                    notified.append(email)

    def sendmail(self, subject, body, thread, comment, to=None):
        to = to or self.conf.get("to")
        if uwsgi:
            uwsgi.spool({b"subject": subject.encode("utf-8"),
                         b"body": body.encode("utf-8"),
                         b"to": to.encode("utf-8")})
        else:
            start_new_thread(self._retry, (subject, body, to))

    def _sendmail(self, subject, body, to_addr):

        from_addr = self.conf.get("from")

        msg = MIMEText(body, self.mail_format, 'utf-8')
        msg['From'] = from_addr
        msg['To'] = to_addr
        msg['Date'] = formatdate(localtime=True)
        msg['Subject'] = Header(subject, 'utf-8')

        with SMTPConnection(self.conf) as con:
            con.sendmail(from_addr, to_addr, msg.as_string())

    def _retry(self, subject, body, to):
        for x in range(5):
            try:
                self._sendmail(subject, body, to)
            except smtplib.SMTPConnectError:
                logger.info("[smtp] The notification mail hasn't been sent to %s due to SMTPConnectError, trying in 1 minute unless no tries left. (Tries so far: %d / 5)" % (to, x+1))
                time.sleep(60)
            else:
                logger.info("[smtp] The notification mail has been sent to %s successfully." % to)
                break


class Stdout(object):

    def __init__(self, conf):
        pass

    def __iter__(self):

        yield "comments.new:new-thread", self._new_thread
        yield "comments.new:finish", self._new_comment
        yield "comments.edit", self._edit_comment
        yield "comments.delete", self._delete_comment
        yield "comments.activate", self._activate_comment

    def _new_thread(self, thread):
        logger.info("new thread %(id)s: %(title)s" % thread)

    def _new_comment(self, thread, comment):
        logger.info("comment created: %s", json.dumps(comment))

    def _edit_comment(self, comment):
        logger.info('comment %i edited: %s',
                    comment["id"], json.dumps(comment))

    def _delete_comment(self, id):
        logger.info('comment %i deleted', id)

    def _activate_comment(self, thread, comment):
        logger.info("comment %(id)s activated" % thread)
