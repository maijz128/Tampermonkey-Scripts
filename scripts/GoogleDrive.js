// ==UserScript==
// @name         MaiJZ - GoogleDrive
// @namespace    https://github.com/maijz128
// @version      26.01.15
// @description  描述
// @author       MaiJZ
// @match        *://drive.google.com/*
// @icon         data:image/png;base64,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
// @require      https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
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
    
    // jump to download page
    if (matchURL('drive.google.com/file/d/')) {
        var url = location.href;
        var newUrl = url.replace('drive.google.com/file/d/', 'drive.usercontent.google.com/download?id=');
        newUrl = newUrl.replace('/view?usp=drive_link', '&export=download&authuser=0');
        newUrl = newUrl.replace('/view', '');
        location.href = newUrl; 
    }
}


/*******************************************************************************/

function open_in_new_tab(selector){
    // $('a').attr('target', '_blank');
    $(selector).attr('target', '_blank');
}


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

/**
 * 图片下载
 * @param {*} pic_url  图片链接
 * @param {*} filename  文件名
 */
 function downloadImg(pic_url, filename) {
    var x = new XMLHttpRequest();
    x.open("GET", pic_url, true);
    x.responseType = 'blob';
    x.onload = function (e) {
        var url = window.URL.createObjectURL(x.response);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };
    x.send();
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
