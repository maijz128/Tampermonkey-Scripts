// ==UserScript==
// @name         nicotv.me
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.nicotv.me/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
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
    setTimeout(function(){
        Dplayer();
        RemoveLimits();
    },500);
}

function Dplayer() {
    if (Mjztool.matchURL('/video/play/')) {
        var d1 = document.querySelector("body > div.container > div.row > div.col-md-8");
        var d2 = document.querySelector("body > div.container > div.row > div.col-md-4");
    
        removeClass(d1, "col-md-8");
        addClass(d1, "col-md-11");
    
        removeClass(d2, "col-md-4");
        addClass(d2, "col-md-1"); 
    }
}

function RemoveLimits(){
    (function(){style=document.createElement('style');style.innerHTML='html,*{-webkit-user-select:text!important; -moz-user-select:text!important;}';document.head.appendChild(style);document.onselectstart=document.oncontextmenu=document.oncopy=document.onpaste=document.onmousedown=document.onmouseup=document.onmousemove=document.onkeydown=document.ondragstart=document.body.onselectstart=document.body.oncontextmenu=document.body.oncopy=document.body.onpaste=document.body.onmousedown=document.body.onmouseup=document.body.onmousemove=document.body.onkeydown=document.body.ondragstart=function(){return true}})()&jQuery(document).unbind()&jQuery('html').unbind()&jQuery('body').unbind();
}

// toolkit
function Mjztool(){}
Mjztool.bytesToSize = function(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
};
Mjztool.matchURL = function(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
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


function hasClass(elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
  }
   
  function addClass(elem, cls) {
    if (!hasClass(elem, cls)) {
        elem.className = elem.className == '' ? cls : elem.className + ' ' + cls;
    }
  }
   
  function removeClass(elem, cls) {
    if (hasClass(elem, cls)) {
      var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
      while (newClass.indexOf(' ' + cls + ' ') >= 0) {
        newClass = newClass.replace(' ' + cls + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  }