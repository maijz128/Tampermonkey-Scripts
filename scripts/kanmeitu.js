    // ==UserScript==
    // @name         MaiJZ - 看图妹
    // @namespace    https://github.com/maijz128
    // @version      0.1.0
    // @description  描述
    // @author       MaiJZ
    // @match        *://*.kanmeitu1.cc/*
    // @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.2.4.js
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @grant        GM_cookie
    // @grant        GM.cookie
    // @grant        GM_setClipboard
    // @grant        GM_xmlhttpRequest
    // @grant        unsafeWindow
    // @grant        window.close
    // @grant        window.focus
    // ==/UserScript==


    (function () {
        setTimeout(function(){
            main();
        },10);
    })();

    function main() {
        // $(".th_header").removeClass("th_fixed");
        addStyle(".th_fixed {position: initial !important;}");

        $("iframe").remove();
    }


    /*******************************************************************************/

    function addStyle(styleContent) {
        var elStyle = document.createElement("style");
        elStyle.innerHTML = styleContent;
        document.head.appendChild(elStyle);
    }


    function getQueryParams(){  // 当前网页查询参数。?id=xxxxx
        var urlSearchParams = new URLSearchParams(window.location.search);
        var params = Object.fromEntries(urlSearchParams.entries());
        return params;
    }


    function forceDownload(url, fileName){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function(){
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(this.response);
            var tag = document.createElement('a');
            tag.href = imageUrl;
            tag.download = fileName;
            document.body.appendChild(tag);
            tag.click();
            document.body.removeChild(tag);
        };
        xhr.send();
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function setCookie(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
            "" :
            ";expires="+exdate.toUTCString() + ";path=/");
    }

    function deleteCookie( name ) {
        document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }


    // Usage: fireKeyEvent(input元素, 'keydown', 13);  
    // http://blog.csdn.net/lovelyelfpop/article/details/52471878
    function fireKeyEvent(el, evtType, keyCode) {
        var doc = el.ownerDocument;
        var win = doc.defaultView || doc.parentWindow,
            evtObj;
        if (doc.createEvent) {
            if (win.KeyEvent) {
                evtObj = doc.createEvent('KeyEvents');
                evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
            }
            else {
                evtObj = doc.createEvent('UIEvents');
                Object.defineProperty(evtObj, 'keyCode', {
                    get : function () { return this.keyCodeVal; }
                });
                Object.defineProperty(evtObj, 'which', {
                    get : function () { return this.keyCodeVal; }
                });
                evtObj.initUIEvent( evtType, true, true, win, 1 );
                evtObj.keyCodeVal = keyCode;
                if (evtObj.keyCode !== keyCode) {
                    console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
                }
            }
            el.dispatchEvent(evtObj);
        }
        else if (doc.createEventObject) {
            evtObj = doc.createEventObject();
            evtObj.keyCode = keyCode;
            el.fireEvent('on' + evtType, evtObj);
        }
    }
    function eventFire(el, eType){
        if (el.fireEvent) {
        el.fireEvent('on' + eType);
        } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(eType, true, false);
        el.dispatchEvent(evObj);
        }
    }

    function matchURL(url) {
        var URL = window.location.href;
        return URL.indexOf(url) > -1;
    }

    // toolkit
    function Mjztool(){}
    Mjztool.bytesToSize = function(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
    };
    Mjztool.matchURL = function(url) {
        const URL = window.location.href;
        return URL.indexOf(url) > -1;
    };
    Mjztool.matchUrlList = function(list) {
        var URL = window.location.href;
        for (var index = 0; index < list.length; index++) {
            var url = list[index];
            if (URL.indexOf(url) > -1) {
                return true;
            }
        }
        return false;
    };
    Mjztool.matchURLAbsolute = function(url) {
        const href = window.location.href;
        const len = href.length;
        return href.indexOf(url) > -1 && url.length == len;
    };
    Mjztool.addStyle = function(styleContent) {
        var elStyle = document.createElement("style");
        elStyle.innerHTML = styleContent;
        document.head.appendChild(elStyle);
    };
    Mjztool.addFunction = function(func, name) {
        name = name || func.name;
        document[name] = func;
    };
    Mjztool.GM_setClipboard = function(content) {
        // @grant        GM_setClipboard
        GM_setClipboard(content);
    };
    Mjztool.appendScriptLink = function(src) {
        var f = document.createElement('script');
        f.src = src;
        document.body.appendChild(f);
    };
    Mjztool.appendStyleLink = function(src) {
        var elStyle = document.createElement("link");
        elStyle.rel="stylesheet";
        elStyle.type="text/css";
        elStyle.href = src;
        document.head.appendChild(elStyle);
    };
    Mjztool.randomSelect = function(list) {
        var rStart = 0;
        var rEnd = list.length;
        var randomIndex = Math.floor(Math.random() * rEnd + rStart);
        return list[randomIndex];
    };
    Mjztool.filterList = function(list, filter, constructor){
        if(!(list instanceof Array)) console.error('param "list" is not Array');
        if(typeof(filter) !== 'function') console.error('param "filter" is not Function');

        var result = [];
        for (var index = 0; index < list.length; index++) {
            var element = list[index];
            if (filter(element, index)) {
                if(typeof(constructor) === 'function'){
                    result.push(constructor(element, index));
                }else{
                    result.push(element);
                }
            }
        }
        return result;
    };
    Mjztool.printIt = function (printThis) {
        var win = window.open();
        win.document.open();
        win.document.write('<html><body style="white-space: pre;">');
        win.document.write(printThis);
        win.document.write('</body></html>');
        win.document.close();
        win.print();
        win.close();
    };
