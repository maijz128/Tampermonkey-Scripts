// ==UserScript==
// @name         MaiJZ - 2048核基地
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*/2048/thread.php*
// @match        *://*/2048/state/p/*.html
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

var Everything = "http://127.0.0.1:8022/";
var Everything_Query = "?search=%search%&json=1&count=10&path_column=1&size_column=1&date_modified_column=1&date_created_column=1&attributes_column=1&sort=name&ascending=1";

(function () {
    setTimeout(function(){
        main();
    },10);
})();

function main() {
    addStyle(".tac{  height: 0.1px !important; visibility: hidden !important;}");
    addStyle(".found_local {color: green;}");

    if (matchURL("/2048/thread.php")) {     // post list
        CheckNovelsFoundLocal();
    }
    if (matchURL("/2048/state/p/")) {       // post
        CheckNovelFoundLocal();
    }
}

function CheckNovelsFoundLocal(){
    jQuery("#ajaxtable .tal a.subject").each(function(){
        var aElem = jQuery(this);
        var thisElem = aElem;
        var title = aElem.text();
        var name = FindNovelName(title);
        var searchText = name;
        // console.log('a :>> ', aElem);
        EverythingGetJSON2(searchText, thisElem, function(elem, json){
            if (json) {
                if (json["totalResults"] > 0) {
                    console.log("has " + searchText);
                    elem.addClass("found_local");
                    // elem.css("border-bottom", "4px solid #FF761C");
                }
            }
        });
    });
}


function CheckNovelFoundLocal() {
    var title = document.title;
    var name = FindNovelName(title);
    console.log('name :>> ', name);

    var thisElem = jQuery(".t .tal");
    var searchText = name;
    EverythingGetJSON2(searchText, thisElem, function(elem, json){
        if (json) {
            if (json["totalResults"] > 0) {
                console.log("has " + searchText);
                elem.addClass("found_local");
                // elem.css("border-bottom", "4px solid #FF761C");
            }
        }
    });
}

function FindNovelName(str){
    var name = str;
    var arr = null;
    if (str.indexOf("》") > 0) {
        arr = str.match(/《(.*)》/i);
        if(arr != null){
            return arr[1];
        }
    }
    else if (str.indexOf("】") > 0) {
        arr = str.match(/【(.*)】/i);
        if(arr != null){
            return arr[1];
        }
    }
    return name;
}




function EverythingGetJSON(searchText, callback){
    var url = EverythingHttpRequest(searchText);

    GM_xmlhttpRequest({
        url: url,
        method :"GET",
        responseType: "json",
        onload:function(xhr){
            // console.log(xhr.responseText);
            if(callback) { callback(xhr.response);}
        }
    });
}

function EverythingGetJSON2(searchText, thisElem, callback){
    var url = EverythingHttpRequest(searchText);

    GM_xmlhttpRequest({
        url: url,
        method :"GET",
        responseType: "json",
        onload:function(xhr){
            // console.log(xhr.responseText);
            if(callback) { callback(thisElem, xhr.response);}
        }
    });
}

function EverythingHttpRequest(searchText){
    var req = Everything + Everything_Query;
    searchText = searchText.replace(" ", "+");
    req = req.replace("%search%", searchText);
    console.log("EverythingHttpRequest: " + req);
    return req;
}
function EverythingHttpWeb(searchText){
    var req = EverythingHttpRequest(searchText);
    req = req.replace("json=1", "json=0");
    return req;
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
