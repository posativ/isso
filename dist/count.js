/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

!function(){var e,n,t;!function(o){function a(e,n){return x.call(e,n)}function i(e,n){var t,o,a,i,m,r,s,c,u,d,l,p=n&&n.split("/"),f=y.map,h=f&&f["*"]||{};if(e&&"."===e.charAt(0))if(n){for(e=e.split("/"),m=e.length-1,y.nodeIdCompat&&k.test(e[m])&&(e[m]=e[m].replace(k,"")),e=p.slice(0,p.length-1).concat(e),u=0;u<e.length;u+=1)if(l=e[u],"."===l)e.splice(u,1),u-=1;else if(".."===l){if(1===u&&(".."===e[2]||".."===e[0]))break;u>0&&(e.splice(u-1,2),u-=2)}e=e.join("/")}else 0===e.indexOf("./")&&(e=e.substring(2));if((p||h)&&f){for(t=e.split("/"),u=t.length;u>0;u-=1){if(o=t.slice(0,u).join("/"),p)for(d=p.length;d>0;d-=1)if(a=f[p.slice(0,d).join("/")],a&&(a=a[o])){i=a,r=u;break}if(i)break;!s&&h&&h[o]&&(s=h[o],c=u)}!i&&s&&(i=s,r=c),i&&(t.splice(0,r,i),e=t.join("/"))}return e}function m(e,n){return function(){var t=w.call(arguments,0);return"string"!=typeof t[0]&&1===t.length&&t.push(null),p.apply(o,t.concat([e,n]))}}function r(e){return function(n){return i(n,e)}}function s(e){return function(n){b[e]=n}}function c(e){if(a(v,e)){var n=v[e];delete v[e],g[e]=!0,l.apply(o,n)}if(!a(b,e)&&!a(g,e))throw new Error("No "+e);return b[e]}function u(e){var n,t=e?e.indexOf("!"):-1;return t>-1&&(n=e.substring(0,t),e=e.substring(t+1,e.length)),[n,e]}function d(e){return function(){return y&&y.config&&y.config[e]||{}}}var l,p,f,h,b={},v={},y={},g={},x=Object.prototype.hasOwnProperty,w=[].slice,k=/\.js$/;f=function(e,n){var t,o=u(e),a=o[0];return e=o[1],a&&(a=i(a,n),t=c(a)),a?e=t&&t.normalize?t.normalize(e,r(n)):i(e,n):(e=i(e,n),o=u(e),a=o[0],e=o[1],a&&(t=c(a))),{f:a?a+"!"+e:e,n:e,pr:a,p:t}},h={require:function(e){return m(e)},exports:function(e){var n=b[e];return"undefined"!=typeof n?n:b[e]={}},module:function(e){return{id:e,uri:"",exports:b[e],config:d(e)}}},l=function(e,n,t,i){var r,u,d,l,p,y,x=[],w=typeof t;if(i=i||e,"undefined"===w||"function"===w){for(n=!n.length&&t.length?["require","exports","module"]:n,p=0;p<n.length;p+=1)if(l=f(n[p],i),u=l.f,"require"===u)x[p]=h.require(e);else if("exports"===u)x[p]=h.exports(e),y=!0;else if("module"===u)r=x[p]=h.module(e);else if(a(b,u)||a(v,u)||a(g,u))x[p]=c(u);else{if(!l.p)throw new Error(e+" missing "+u);l.p.load(l.n,m(i,!0),s(u),{}),x[p]=b[u]}d=t?t.apply(b[e],x):void 0,e&&(r&&r.exports!==o&&r.exports!==b[e]?b[e]=r.exports:d===o&&y||(b[e]=d))}else e&&(b[e]=t)},e=n=p=function(e,n,t,a,i){if("string"==typeof e)return h[e]?h[e](n):c(f(e,n).f);if(!e.splice){if(y=e,y.deps&&p(y.deps,y.callback),!n)return;n.splice?(e=n,n=t,t=null):e=o}return n=n||function(){},"function"==typeof t&&(t=a,a=i),a?l(o,e,n,t):setTimeout(function(){l(o,e,n,t)},4),p},p.config=function(e){return p(e)},e._defined=b,t=function(e,n,t){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");n.splice||(t=n,n=[]),a(b,e)||a(v,e)||(v[e]=[e,n,t])},t.amd={jQuery:!0}}(),t("components/almond/almond",function(){}),t("app/lib/ready",[],function(){"use strict";var e=!1,n=function(n){e||(e=!0,n())},t=function(e){document.addEventListener("DOMContentLoaded",function(){n(e)}),("interactive"===document.readyState||"complete"===document.readyState)&&n(e)};return t}),t("app/lib/promise",[],function(){"use strict";var e=function(e){console.log(e)},n=function(){this.success=[],this.errors=[]};n.prototype.then=function(n,t){this.success.push(n),t?this.errors.push(t):this.errors.push(e)};var t=function(){this.promise=new n};t.prototype={promise:n,resolve:function(e){this.promise.success.forEach(function(n){window.setTimeout(function(){n(e)},0)})},reject:function(e){this.promise.errors.forEach(function(n){window.setTimeout(function(){n(e)},0)})}};var o=function(e,t){return e instanceof n?e.then(t):t(e)};return{defer:function(){return new t},when:o}}),t("app/globals",[],function(){"use strict";var e=function(){this.values=[]};return e.prototype.update=function(e){this.values.push((new Date).getTime()-e.getTime())},e.prototype.localTime=function(){return new Date((new Date).getTime()-this.values.reduce(function(e,n){return e+n})/this.values.length)},{offset:new e}}),t("app/api",["app/lib/promise","app/globals"],function(e,n){"use strict";for(var t,o,a="Eech7co8Ohloopo9Ol6baimi",i=window.location.pathname,m=document.getElementsByTagName("script"),r=0;r<m.length;r++)if(m[r].hasAttribute("data-isso")){o=m[r].getAttribute("data-isso");break}if(!o){for(r=0;r<m.length;r++)if(m[r].getAttribute("async")||m[r].getAttribute("defer"))throw"Isso's automatic configuration detection failed, please refer to https://github.com/posativ/isso#client-configuration and add a custom `data-isso` attribute.";t=m[m.length-1],o=t.src.substring(0,t.src.length-"/js/embed.min.js".length)}"/"===o[o.length-1]&&(o=o.substring(0,o.length-1));var s=function(e,t,o,a,i){function m(){var e=r.getResponseHeader("Date");null!==e&&n.offset.update(new Date(e));var t=r.getResponseHeader("X-Set-Cookie");t&&t.match(/^isso-/)&&(document.cookie=t),r.status>=500?i&&i(r.body):a({status:r.status,body:r.responseText})}var r=new XMLHttpRequest;try{r.open(e,t,!0),r.withCredentials=!0,r.setRequestHeader("Content-Type","application/json"),r.onreadystatechange=function(){4===r.readyState&&m()}}catch(s){(i||console.log)(s.message)}r.send(o)},c=function(e){var n="";for(var t in e)e.hasOwnProperty(t)&&null!==e[t]&&"undefined"!=typeof e[t]&&(n+=t+"="+encodeURIComponent(e[t])+"&");return n.substring(0,n.length-1)},u=function(n,t){var a=e.defer();return s("POST",o+"/new?"+c({uri:n||i}),JSON.stringify(t),function(e){201===e.status||202===e.status?a.resolve(JSON.parse(e.body)):a.reject(e.body)}),a.promise},d=function(n,t){var a=e.defer();return s("PUT",o+"/id/"+n,JSON.stringify(t),function(e){403===e.status?a.reject("Not authorized to modify this comment!"):200===e.status?a.resolve(JSON.parse(e.body)):a.reject(e.body)}),a.promise},l=function(n){var t=e.defer();return s("DELETE",o+"/id/"+n,null,function(e){403===e.status?t.reject("Not authorized to remove this comment!"):200===e.status?t.resolve(null===JSON.parse(e.body)):t.reject(e.body)}),t.promise},p=function(n,t){var a=e.defer();return s("GET",o+"/id/"+n+"?"+c({plain:t}),null,function(e){a.resolve(JSON.parse(e.body))}),a.promise},f=function(n,t,a,m,r){"undefined"==typeof t&&(t="inf"),"undefined"==typeof a&&(a="inf"),"undefined"==typeof m&&(m=null);var u={uri:n||i,after:r,parent:m};"inf"!==t&&(u.limit=t),"inf"!==a&&(u.nested_limit=a);var d=e.defer();return s("GET",o+"/?"+c(u),null,function(e){200===e.status?d.resolve(JSON.parse(e.body)):404===e.status?d.resolve({total_replies:0}):d.reject(e.body)}),d.promise},h=function(n){var t=e.defer();return s("POST",o+"/count",JSON.stringify(n),function(e){200===e.status?t.resolve(JSON.parse(e.body)):t.reject(e.body)}),t.promise},b=function(n){var t=e.defer();return s("POST",o+"/id/"+n+"/like",null,function(e){t.resolve(JSON.parse(e.body))}),t.promise},v=function(n){var t=e.defer();return s("POST",o+"/id/"+n+"/dislike",null,function(e){t.resolve(JSON.parse(e.body))}),t.promise};return{endpoint:o,salt:a,create:u,modify:d,remove:l,view:p,fetch:f,count:h,like:b,dislike:v}}),t("app/dom",[],function(){"use strict";function e(e){this.obj=e,this.replace=function(n){var o=t.htmlify(n);return e.parentNode.replaceChild(o.obj,e),o},this.prepend=function(n){var o=t.htmlify(n);return e.insertBefore(o.obj,e.firstChild),o},this.append=function(n){var o=t.htmlify(n);return e.appendChild(o.obj),o},this.insertAfter=function(n){var o=t.htmlify(n);return e.parentNode.insertBefore(o.obj,e.nextSibling),o},this.on=function(n,t,o){e.addEventListener(n,function(e){t(e),(void 0===o||o)&&e.preventDefault()})},this.toggle=function(e,t,o){var a=new n(t,o);this.on(e,function(){a.next()})},this.detach=function(){return e.parentNode.removeChild(this.obj),this},this.remove=function(){e.parentNode.removeChild(this.obj)},this.show=function(){e.style.display="block"},this.hide=function(){e.style.display="none"},this.setText=function(n){e.textContent=n},this.setHtml=function(n){e.innerHTML=n},this.blur=function(){e.blur()},this.focus=function(){e.focus()},this.scrollIntoView=function(n){e.scrollIntoView(n)},this.setAttribute=function(n,t){e.setAttribute(n,t)},this.getAttribute=function(n){return e.getAttribute(n)},this.classList=e.classList,Object.defineProperties(this,{textContent:{get:function(){return e.textContent},set:function(n){e.textContent=n}},innerHTML:{get:function(){return e.innerHTML},set:function(n){e.innerHTML=n}},value:{get:function(){return e.value},set:function(n){e.value=n}},placeholder:{get:function(){return e.placeholder},set:function(n){e.placeholder=n}}})}var n=function(e,n){this.state=!1,this.next=function(){this.state?(this.state=!1,n(this)):(this.state=!0,e(this))},this.wait=function(){this.state=!this.state}},t=function(n,t,o){"undefined"==typeof o&&(o=!0),t||(t=window.document),t instanceof e&&(t=t.obj);var a=[].slice.call(t.querySelectorAll(n),0);return 0===a.length?null:1===a.length&&o?new e(a[0]):(a=[].slice.call(a,0),a.map(function(n){return new e(n)}))};return t.htmlify=function(n){if(n instanceof e)return n;if(n instanceof window.Element)return new e(n);var o=t["new"]("div");return o.innerHTML=n,new e(o.firstChild)},t["new"]=function(e,n){var t=document.createElement(e.split(".")[0]);return e.split(".").slice(1).forEach(function(e){t.classList.add(e)}),["A","LINK"].indexOf(t.nodeName)>-1&&(t.href="#"),n||0===n||(n=""),["TEXTAREA","INPUT"].indexOf(t.nodeName)>-1?t.value=n:t.textContent=n,t},t.each=function(e,n){Array.prototype.forEach.call(document.getElementsByTagName(e),n)},t}),t("app/config",[],function(){"use strict";for(var e={css:!0,lang:(navigator.language||navigator.userLanguage).split("-")[0],"reply-to-self":!1,"require-email":!1,"require-author":!1,"max-comments-top":"inf","max-comments-nested":5,"reveal-on-click":5,avatar:!0,"avatar-bg":"#f0f0f0","avatar-fg":["#9abf88","#5698c4","#e279a3","#9163b6","#be5168","#f19670","#e4bf80","#447c69"].join(" "),vote:!0,"vote-levels":null},n=document.getElementsByTagName("script"),t=0;t<n.length;t++)for(var o=0;o<n[t].attributes.length;o++){var a=n[t].attributes[o];if(/^data-isso-/.test(a.name))try{e[a.name.substring(10)]=JSON.parse(a.value)}catch(i){e[a.name.substring(10)]=a.value}}return e["avatar-fg"]=e["avatar-fg"].split(" "),e}),t("app/i18n/bg",{"postbox-text":"Въведете коментара си тук (поне 3 знака)","postbox-author":"Име/псевдоним (незадължително)","postbox-email":"Ел. поща (незадължително)","postbox-website":"Уебсайт (незадължително)","postbox-submit":"Публикуване","num-comments":"1 коментар\n{{ n }} коментара","no-comments":"Все още няма коментари","comment-reply":"Отговор","comment-edit":"Редактиране","comment-save":"Запис","comment-delete":"Изтриване","comment-confirm":"Потвърждение","comment-close":"Затваряне","comment-cancel":"Отказ","comment-deleted":"Коментарът е изтрит.","comment-queued":"Коментарът чака на опашката за модериране.","comment-anonymous":"анонимен","comment-hidden":"{{ n }} скрити","date-now":"сега","date-minute":"преди 1 минута\nпреди {{ n }} минути","date-hour":"преди 1 час\nпреди {{ n }} часа","date-day":"вчера\nпреди {{ n }} дни","date-week":"миналата седмица\nпреди {{ n }} седмици","date-month":"миналия месец\nпреди {{ n }} месеца","date-year":"миналата година\nпреди {{ n }} години"}),t("app/i18n/cs",{"postbox-text":"Sem napiště svůj komentář (nejméně 3 znaky)","postbox-author":"Jméno (nepovinné)","postbox-email":"E-mail (nepovinný)","postbox-website":"Web (nepovinný)","postbox-submit":"Publikovat","num-comments":"Jeden komentář\n{{ n }} Komentářů","no-comments":"Zatím bez komentářů","comment-reply":"Odpovědět","comment-edit":"Upravit","comment-save":"Uložit","comment-delete":"Smazat","comment-confirm":"Potvrdit","comment-close":"Zavřít","comment-cancel":"Zrušit","comment-deleted":"Komentář smazán","comment-queued":"Komentář ve frontě na schválení","comment-anonymous":"Anonym","comment-hidden":"{{ n }} skryto","date-now":"právě teď","date-minute":"před minutou\npřed {{ n }} minutami","date-hour":"před hodinou\npřed {{ n }} hodinami","date-day":"včera\npřed {{ n }} dny","date-week":"minulý týden\npřed {{ n }} týdny","date-month":"minulý měsíc\npřed {{ n }} měsíci","date-year":"minulý rok\npřed {{ n }} lety"}),t("app/i18n/de",{"postbox-text":"Kommentar hier eintippen (mindestens 3 Zeichen)","postbox-author":"Name (optional)","postbox-email":"Email (optional)","postbox-website":"Website (optional)","postbox-submit":"Abschicken","num-comments":"1 Kommentar\n{{ n }} Kommentare","no-comments":"Keine Kommentare bis jetzt","comment-reply":"Antworten","comment-edit":"Bearbeiten","comment-save":"Speichern","comment-delete":"Löschen","comment-confirm":"Bestätigen","comment-close":"Schließen","comment-cancel":"Abbrechen","comment-deleted":"Kommentar gelöscht.","comment-queued":"Kommentar muss noch freigeschaltet werden.","comment-anonymous":"Anonym","comment-hidden":"{{ n }} versteckt","date-now":"eben jetzt","date-minute":"vor einer Minute\nvor {{ n }} Minuten","date-hour":"vor einer Stunde\nvor {{ n }} Stunden","date-day":"Gestern\nvor {{ n }} Tagen","date-week":"letzte Woche\nvor {{ n }} Wochen","date-month":"letzten Monat\nvor {{ n }} Monaten","date-year":"letztes Jahr\nvor {{ n }} Jahren"}),t("app/i18n/en",{"postbox-text":"Type Comment Here (at least 3 chars)","postbox-author":"Name (optional)","postbox-email":"E-mail (optional)","postbox-website":"Website (optional)","postbox-submit":"Submit","num-comments":"One Comment\n{{ n }} Comments","no-comments":"No Comments Yet","comment-reply":"Reply","comment-edit":"Edit","comment-save":"Save","comment-delete":"Delete","comment-confirm":"Confirm","comment-close":"Close","comment-cancel":"Cancel","comment-deleted":"Comment deleted.","comment-queued":"Comment in queue for moderation.","comment-anonymous":"Anonymous","comment-hidden":"{{ n }} Hidden","date-now":"right now","date-minute":"a minute ago\n{{ n }} minutes ago","date-hour":"an hour ago\n{{ n }} hours ago","date-day":"Yesterday\n{{ n }} days ago","date-week":"last week\n{{ n }} weeks ago","date-month":"last month\n{{ n }} months ago","date-year":"last year\n{{ n }} years ago"}),t("app/i18n/fi",{"postbox-text":"Kirjoita kommentti tähän (vähintään 3 merkkiä)","postbox-author":"Nimi (valinnainen)","postbox-email":"Sähköposti (valinnainen)","postbox-website":"Web-sivu (valinnainen)","postbox-submit":"Lähetä","num-comments":"Yksi kommentti\n{{ n }} kommenttia","no-comments":"Ei vielä kommentteja","comment-reply":"Vastaa","comment-edit":"Muokkaa","comment-save":"Tallenna","comment-delete":"Poista","comment-confirm":"Vahvista","comment-close":"Sulje","comment-cancel":"Peru","comment-deleted":"Kommentti on poistettu.","comment-queued":"Kommentti on laitettu jonoon odottamaan moderointia.","comment-anonymous":"Nimetön","comment-hidden":"{{ n }} piilotettua","date-now":"hetki sitten","date-minute":"minuutti sitten\n{{ n }} minuuttia sitten","date-hour":"tunti sitten\n{{ n }} tuntia sitten","date-day":"eilen\n{{ n }} päivää sitten","date-week":"viime viikolla\n{{ n }} viikkoa sitten","date-month":"viime kuussa\n{{ n }} kuukautta sitten","date-year":"viime vuonna\n{{ n }} vuotta sitten"}),t("app/i18n/fr",{"postbox-text":"Insérez votre commentaire ici (au moins 3 lettres)","postbox-author":"Nom (optionnel)","postbox-email":"Courriel (optionnel)","postbox-website":"Site web (optionnel)","postbox-submit":"Soumettre","num-comments":"{{ n }} commentaire\n{{ n }} commentaires","no-comments":"Aucun commentaire pour l'instant","comment-reply":"Répondre","comment-edit":"Éditer","comment-save":"Enregistrer","comment-delete":"Supprimer","comment-confirm":"Confirmer","comment-close":"Fermer","comment-cancel":"Annuler","comment-deleted":"Commentaire supprimé.","comment-queued":"Commentaire en attente de modération.","comment-anonymous":"Anonyme","comment-hidden":"1 caché\n{{ n }} cachés","date-now":"À l'instant","date-minute":"Il y a une minute\nIl y a {{ n }} minutes","date-hour":"Il y a une heure\nIl y a {{ n }} heures ","date-day":"Hier\nIl y a {{ n }} jours","date-week":"Il y a une semaine\nIl y a {{ n }} semaines","date-month":"Il y a un mois\nIl y a {{ n }} mois","date-year":"Il y a un an\nIl y a {{ n }} ans"}),t("app/i18n/hr",{"postbox-text":"Napiši komentar ovdje (najmanje 3 znaka)","postbox-author":"Ime (neobavezno)","postbox-email":"E-mail (neobavezno)","postbox-website":"Web stranica (neobavezno)","postbox-submit":"Pošalji","num-comments":"Jedan komentar\n{{ n }} komentara","no-comments":"Još nema komentara","comment-reply":"Odgovori","comment-edit":"Uredi","comment-save":"Spremi","comment-delete":"Obriši","comment-confirm":"Potvrdi","comment-close":"Zatvori","comment-cancel":"Odustani","comment-deleted":"Komentar obrisan","comment-queued":"Komentar u redu za provjeru.","comment-anonymous":"Anonimno","comment-hidden":"{{ n }} Skrivenih","date-now":"upravo","date-minute":"prije minutu\nprije {{ n }} minuta","date-hour":"prije sat vremena\nprije {{ n }} sati","date-day":"jučer\nprije {{ n }} dana","date-week":"prošli tjedan\nprije {{ n }} tjedana","date-month":"prošli mjesec\nprije {{ n }} mjeseci","date-year":"prošle godine\nprije {{ n }} godina"}),t("app/i18n/ru",{"postbox-text":"Оставить комментарий (минимум 3 символа)","postbox-author":"Имя (необязательно)","postbox-email":"Email (необязательно)","postbox-website":"Сайт (необязательно)","postbox-submit":"Отправить","num-comments":"{{ n }} комментарий\n{{ n }} комментария\n{{ n }} комментариев","no-comments":"Пока нет комментариев","comment-reply":"Ответить","comment-edit":"Правка","comment-save":"Сохранить","comment-delete":"Удалить","comment-confirm":"Подтвердить удаление","comment-close":"Закрыть","comment-cancel":"Отменить","comment-deleted":"Комментарий удалён","comment-queued":"Комментарий будет проверен модератором","comment-anonymous":"Аноним","comment-hidden":"Скрыт {{ n }} комментарий\nСкрыто {{ n }} комментария\nСкрыто {{ n }} комментариев","date-now":"Только что","date-minute":"{{ n }} минуту назад\n{{ n }} минуты назад\n{{ n }} минут назад","date-hour":"{{ n }} час назад\n{{ n }} часа назад\n{{ n }} часов назад","date-day":"{{ n }} день назад\n{{ n }} дня назад\n{{ n }} дней назад","date-week":"{{ n }} неделю назад\n{{ n }} недели назад\n{{ n }} недель назад","date-month":"{{ n }} месяц назад\n{{ n }} месяца назад\n{{ n }} месяцев назад","date-year":"{{ n }} год назад\n{{ n }} года назад\n{{ n }} лет назад"}),t("app/i18n/it",{"postbox-text":"Scrivi un commento qui (minimo 3 caratteri)","postbox-author":"Nome (opzionale)","postbox-email":"E-mail (opzionale)","postbox-website":"Sito web (opzionale)","postbox-submit":"Invia","num-comments":"Un Commento\n{{ n }} Commenti","no-comments":"Ancora Nessun Commento","comment-reply":"Rispondi","comment-edit":"Modifica","comment-save":"Salva","comment-delete":"Elimina","comment-confirm":"Conferma","comment-close":"Chiudi","comment-cancel":"Cancella","comment-deleted":"Commento eliminato.","comment-queued":"Commento in coda per moderazione.","comment-anonymous":"Anonimo","comment-hidden":"{{ n }} Nascosto","date-now":"poco fa","date-minute":"un minuto fa\n{{ n }} minuti fa","date-hour":"un ora fa\n{{ n }} ore fa","date-day":"Ieri\n{{ n }} giorni fa","date-week":"questa settimana\n{{ n }} settimane fa","date-month":"questo mese\n{{ n }} mesi fa","date-year":"quest'anno\n{{ n }} anni fa"}),t("app/i18n/eo",{"postbox-text":"Tajpu komenton ĉi-tie (almenaŭ 3 signoj)","postbox-author":"Nomo (malnepra)","postbox-email":"Retadreso (malnepra)","postbox-website":"Retejo (malnepra)","postbox-submit":"Sendu","num-comments":"{{ n }} komento\n{{ n }} komentoj","no-comments":"Neniu komento ankoraŭ","comment-reply":"Respondu","comment-edit":"Redaktu","comment-save":"Savu","comment-delete":"Forviŝu","comment-confirm":"Konfirmu","comment-close":"Fermu","comment-cancel":"Malfaru","comment-deleted":"Komento forviŝita","comment-queued":"Komento en atendovico por kontrolo.","comment-anonymous":"Sennoma","comment-hidden":"{{ n }} kaŝitaj","date-now":"ĵus nun","date-minute":"antaŭ unu minuto\nantaŭ {{ n }} minutoj","date-hour":"antaŭ unu horo\nantaŭ {{ n }} horoj","date-day":"hieraŭ\nantaŭ {{ n }} tagoj","date-week":"lasta semajno\nantaŭ {{ n }} semajnoj","date-month":"lasta monato\nantaŭ {{ n }} monatoj","date-year":"lasta jaro\nantaŭ {{ n }} jaroj"}),t("app/i18n/sv",{"postbox-text":"Skriv din kommentar här (minst 3 tecken)","postbox-author":"Namn (frivilligt)","postbox-email":"E-mail (frivilligt)","postbox-website":"Hemsida (frivilligt)","postbox-submit":"Skicka","num-comments":"En kommentar\n{{ n }} kommentarer","no-comments":"Inga kommentarer än","comment-reply":"Svara","comment-edit":"Redigera","comment-save":"Spara","comment-delete":"Radera","comment-confirm":"Bekräfta","comment-close":"Stäng","comment-cancel":"Avbryt","comment-deleted":"Kommentar raderad.","comment-queued":"Kommentaren inväntar granskning.","comment-anonymous":"Anonym","comment-hidden":"{{ n }} Gömd","date-now":"just nu","date-minute":"en minut sedan\n{{ n }} minuter sedan","date-hour":"en timme sedan\n{{ n }} timmar sedan","date-day":"igår\n{{ n }} dagar sedan","date-week":"förra veckan\n{{ n }} veckor sedan","date-month":"förra månaden\n{{ n }} månader sedan","date-year":"förra året\n{{ n }} år sedan"}),t("app/i18n/nl",{"postbox-text":"Typ reactie hier (minstens 3 karakters)","postbox-author":"Naam (optioneel)","postbox-email":"E-mail (optioneel)","postbox-website":"Website (optioneel)","postbox-submit":"Versturen","num-comments":"Één reactie\n{{ n }} reacties","no-comments":"Nog geen reacties","comment-reply":"Beantwoorden","comment-edit":"Bewerken","comment-save":"Opslaan","comment-delete":"Verwijderen","comment-confirm":"Bevestigen","comment-close":"Sluiten","comment-cancel":"Annuleren","comment-deleted":"Reactie verwijderd.","comment-queued":"Reactie staat in de wachtrij voor goedkeuring.","comment-anonymous":"Anoniem","comment-hidden":"{{ n }} verborgen","date-now":"zojuist","date-minute":"een minuut geleden\n{{ n }} minuten geleden","date-hour":"een uur geleden\n{{ n }} uur geleden","date-day":"gisteren\n{{ n }} dagen geleden","date-week":"vorige week\n{{ n }} weken geleden","date-month":"vorige maand\n{{ n }} maanden geleden","date-year":"vorig jaar\n{{ n }} jaar geleden"}),t("app/i18n/el_GR",{"postbox-text":"Γράψτε το σχόλιο εδώ (τουλάχιστον 3 χαρακτήρες)","postbox-author":"Όνομα (προαιρετικό)","postbox-email":"E-mail (προαιρετικό)","postbox-website":"Ιστοσελίδα (προαιρετικό)","postbox-submit":"Υποβολή","num-comments":"Ένα σχόλιο\n{{ n }} σχόλια","no-comments":"Δεν υπάρχουν σχόλια","comment-reply":"Απάντηση","comment-edit":"Επεξεργασία","comment-save":"Αποθήκευση","comment-delete":"Διαγραφή","comment-confirm":"Επιβεβαίωση","comment-close":"Κλείσιμο","comment-cancel":"Ακύρωση","comment-deleted":"Διαγραμμένο σχόλιο ","comment-queued":"Το σχόλιο αναμένει έγκριση","comment-anonymous":"Ανώνυμος","comment-hidden":"{{ n }} Κρυμμένα","date-now":"τώρα","date-minute":"πριν ένα λεπτό\nπριν {{ n }} λεπτά","date-hour":"πριν μία ώρα\nπριν {{ n }} ώρες","date-day":"Χτες\nπριν {{ n }} μέρες","date-week":"την προηγούμενη εβδομάδα\nπριν {{ n }} εβδομάδες","date-month":"τον προηγούμενο μήνα\nπριν {{ n }} μήνες","date-year":"πέρυσι\nπριν {{ n }} χρόνια"}),t("app/i18n/es",{"postbox-text":"Escriba su comentario aquí (al menos 3 caracteres)","postbox-author":"Nombre (opcional)","postbox-email":"E-mail (opcional)","postbox-website":"Sitio web (opcional)","postbox-submit":"Enviar","num-comments":"Un Comentario\n{{ n }} Comentarios","no-comments":"Sin Comentarios Todavía","comment-reply":"Responder","comment-edit":"Editar","comment-save":"Guardar","comment-delete":"Eliminar","comment-confirm":"Confirmar","comment-close":"Cerrar","comment-cancel":"Cancelar","comment-deleted":"Comentario eliminado.","comment-queued":"Comentario en espera para moderación.","comment-anonymous":"Anónimo","comment-hidden":"{{ n }} Oculto(s)","date-now":"ahora","date-minute":"hace un minuto\nhace {{ n }} minutos","date-hour":"hace una hora\nhace {{ n }} horas","date-day":"ayer\nHace {{ n }} días","date-week":"la semana pasada\nhace {{ n }} semanas","date-month":"el mes pasado\nhace {{ n }} meses","date-year":"el año pasado\nhace {{ n }} años"}),t("app/i18n/vi",{"postbox-text":"Nhập bình luận tại đây (tối thiểu 3 ký tự)","postbox-author":"Tên (tùy chọn)","postbox-email":"E-mail (tùy chọn)","postbox-website":"Website (tùy chọn)","postbox-submit":"Gửi","num-comments":"Một bình luận\n{{ n }} bình luận","no-comments":"Chưa có bình luận nào","comment-reply":"Trả lời","comment-edit":"Sửa","comment-save":"Lưu","comment-delete":"Xóa","comment-confirm":"Xác nhận","comment-close":"Đóng","comment-cancel":"Hủy","comment-deleted":"Đã xóa bình luận.","comment-queued":"Bình luận đang chờ duyệt","comment-anonymous":"Nặc danh","comment-hidden":"{{ n }} đã ẩn","date-now":"vừa mới","date-minute":"một phút trước\n{{ n }} phút trước","date-hour":"một giờ trước\n{{ n }} giờ trước","date-day":"Hôm qua\n{{ n }} ngày trước","date-week":"Tuần qua\n{{ n }} tuần trước","date-month":"Tháng trước\n{{ n }} tháng trước","date-year":"Năm trước\n{{ n }} năm trước"}),t("app/i18n/zh_CN",{"postbox-text":"在此输入评论 (最少3个字符)","postbox-author":"名字 (可选)","postbox-email":"E-mail (可选)","postbox-website":"网站 (可选)","postbox-submit":"提交","num-comments":"1条评论\n{{ n }}条评论","no-comments":"还没有评论","comment-reply":"回复","comment-edit":"编辑","comment-save":"保存","comment-delete":"删除","comment-confirm":"确认","comment-close":"关闭","comment-cancel":"取消","comment-deleted":"评论已删除.","comment-queued":"评论待审核.","comment-anonymous":"匿名","comment-hidden":"{{ n }} 条评论已隐藏","date-now":"刚刚","date-minute":"1分钟前\n{{ n }}分钟前","date-hour":"1小时前\n{{ n }}小时前","date-day":"昨天\n{{ n }}天前","date-week":"上周\n{{ n }}周前","date-month":"上个月\n{{ n }}个月前","date-year":"去年\n{{ n }}年前"}),t("app/i18n",["app/config","app/i18n/bg","app/i18n/cs","app/i18n/de","app/i18n/en","app/i18n/fi","app/i18n/fr","app/i18n/hr","app/i18n/ru","app/i18n/it","app/i18n/eo","app/i18n/sv","app/i18n/nl","app/i18n/el_GR","app/i18n/es","app/i18n/vi","app/i18n/zh_CN"],function(e,n,t,o,a,i,m,r,s,c,u,d,l,p,f,h,b){"use strict";var v=function(e){switch(e){case"bg":case"cs":case"de":case"el":case"en":case"es":case"eo":case"fi":case"hr":case"it":case"sv":case"nl":case"vi":case"zh":return function(e,n){return e[1===n?0:1]};case"fr":return function(e,n){return e[n>1?1:0]};case"ru":return function(e,n){return n%10===1&&n%100!==11?e[0]:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?e[1]:"undefined"!=typeof e[2]?e[2]:e[1]};default:return null}},y=e.lang;v(y)||(y="en");var g={cs:t,de:o,el:p,en:a,eo:u,es:f,fi:i,fr:m,it:c,hr:r,ru:s,sv:d,nl:l,vi:h,zh:b},x=v(y),w=function(e){return g[y][e]||a[e]||"???"},k=function(e,n){var t;return t=w(e),t.indexOf("\n")>-1&&(t=x(t.split("\n"),+n)),t?t.replace("{{ n }}",+n):t};return{lang:y,translate:w,pluralize:k}}),t("app/count",["app/api","app/dom","app/i18n"],function(e,n,t){return function(){var o={};n.each("a",function(e){if(e.href.match(/#isso-thread$/)){var n=e.getAttribute("data-isso-id")||e.href.match(/^(.+)#isso-thread$/)[1].replace(/^.*\/\/[^\/]+/,"");n in o?o[n].push(e):o[n]=[e]}});var a=Object.keys(o);e.count(a).then(function(e){for(var n in o)if(o.hasOwnProperty(n))for(var i=a.indexOf(n),m=0;m<o[n].length;m++)o[n][m].textContent=t.pluralize("num-comments",e[i])})}}),n(["app/lib/ready","app/count"],function(e,n){e(function(){n()})}),t("count",function(){})}();