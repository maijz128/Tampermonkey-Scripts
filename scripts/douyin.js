// ==UserScript==
// @name         MaiJZ - 抖音优化
// @namespace    https://github.com/maijz128
// @version      25.07.27
// @description  描述
// @author       MaiJZ
// @match        *://*.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @require      https://code.jquery.com/jquery-2.2.4.min.js
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

    if (Mjztool.matchURL('live.douyin.com')){
        DouYin_Live();
    }else{
        DouYin();
        DouYin_Video();
    }
}

function DouYin(){
    var css = '';

    {
        // 隐藏点击进入直播间按钮
        css += 'a.DXIZeYGy {display: none !important;}';
        css += 'div.Jk65uwWm {display: none !important;}';

        // 隐藏直播用户信息
        css += '#room_info_bar {opacity: 0 !important;} #room_info_bar:hover {opacity: 1 !important;}';
        css += '.dXl06fc1 {opacity: 0 !important;} .dXl06fc1:hover {opacity: 1 !important;}';

        // 隐藏直播用户控制栏
        css += '.xgplayer-controls {opacity: 0 !important;} .xgplayer-controls:hover {opacity: 1 !important;}';

        // /follow/live/
        // 隐藏直播间顶部信息栏
        css += '#live_outer_container .RTEOroU7 {opacity: 0 !important;} #live_outer_container .RTEOroU7:hover {opacity: 1 !important;}';
        // 隐藏直播间底部礼物栏
        css += '.GDP2iTsQ {display: none !important;}';
    }

    addStyle(css);

    // 删除下载抖音精选
    // $('#douyin-navigation div').each(function(){
    //     if ($(this).text() == '下载抖音精选'){
    //         $(this).parent().remove();
    //     }
    // });

}

function DouYin_Video(){
    var css = '';

    // 自动隐藏 右侧工具栏
    css += '.I6U7FiE8 {opacity: 0 !important;}';
    css += '.I6U7FiE8:hover {opacity: 1 !important;}';
    // 自动隐藏 底部信息栏
    css += '#video-info-wrap {opacity: 0 !important;}';
    css += '#video-info-wrap:hover {opacity: 1 !important;}';

    // 视频全高度显示
    css += '.xg-video-container {bottom: 0px !important;}';

    addStyle(css);
}


function DouYin_Live(){
    var css = '';

    // 视频区域内 - 顶栏信息 - 自动隐藏
    css += '#live_outer_container #island_4264f > div:hover {opacity: 1 !important;}';
    css += '#live_outer_container #island_4264f > div {opacity: 0 !important;}';
    
    addStyle(css);
}

/*******************************************************************************/

function open_in_new_tab(selector){
    // $('a').attr('target', '_blank');
    $(selector).attr('target', '_blank');
}


// How to fix TrustedHTML assignment error with Angular [innerHTML]
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy('default', {
      createHTML: (string, sink) => string
    });
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


function downloadText(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
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
Mjztool.isMatchUrl = function(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
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
Mjztool.GM_downloadImg = function(pic_url, filename) {
	// @grant        GM_xmlhttpRequest
    GM_xmlhttpRequest ( {
        method:         'GET',
        url:            pic_url,
        responseType:   'blob',
        onload:         function (resp) {
            var blob = resp.response;
            var link = document.createElement("a");
            link.download = filename;
            link.href = window.URL.createObjectURL(blob); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }
    } );
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
