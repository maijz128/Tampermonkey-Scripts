// ==UserScript==
// @name         MaiJZ - Stable Diffusion Web UI
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        http://127.0.0.1:7860/
// @icon         http://127.0.0.1:7860/favicon.ico
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

    var app = document.querySelector('gradio-app');
    var appRoot = app.shadowRoot;
    var footer = appRoot.querySelector('#footer');
    var inter = setInterval(function(){
        if (footer) {
            clearInterval(inter);
            app_styles();
            // app_txt2img();
        }else{
            footer = appRoot.querySelector('#footer');
        }
    }, 1000);
}


function app_styles(){
    var baseStyles = `
        :is(:not(i,head *):not([class*='glyph']):not([class*='icon']):not([class*='fa-']):not([class*='vjs-'])) {
            font-family: 'Microsoft YaHei',system-ui,-apple-system,BlinkMacSystemFont,sans-serif,'iconfont','icomoon','FontAwesome','Font Awesome 5 Pro','Font Awesome 6 Pro','IcoFont','fontello','themify','Material Icons','Material Icons Extended','bootstrap-icons','Segoe Fluent Icons','Material-Design-Iconic-Font','office365icons','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji','Android Emoji','EmojiSymbols','emojione mozilla','twemoji mozilla';
            text-shadow: 0 0 0.86px #b1ada6d9, 0 0 0.75px #7C7C7CDD, 0 0 0.56px #302f2d4b;
            -webkit-text-stroke: 0.015px currentcolor;
            font-feature-settings: "liga" 0,"zero";
            font-variant: normal;
            font-optical-sizing: auto;
            font-kerning: auto;
            text-rendering: optimizeLegibility!important;
        }

        /* 去除datalist的下拉图标 */
        input::-webkit-calendar-picker-indicator{
            display: none;
            -webkit-appearance: none;
            opacity: 0;
        }
        #setting_eta_noise_seed_delta span{
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis; width: 100%;
        }
    `;
    var styles01 = `
        #txt2img_column_size.flex-wrap:first-child, #img2img_column_size.flex-wrap:first-child{
            margin: 0.6em 0em 0em 0 !important;
        }
        #txt2img_column_batch .flex-wrap:first-child,  #txt2img_column_size .flex-wrap:first-child,
        #img2img_column_batch .flex-wrap:first-child,  #img2img_column_size .flex-wrap:first-child
        {
            flex-direction: row !important;
        }
        #txt2img_batch_count, #txt2img_batch_size, #img2img_batch_count, #img2img_batch_size {
            display: inline !important;
            width: 48% !important;
        }
        #txt2img_width, #img2img_width {
            display: inline !important;
            width: 54% !important;
        }
        #txt2img_height, #img2img_height{
            display: inline !important;
            width: 44% !important;
        }
    `;
    var styles02 = `
        #txt2img_column_size, #img2img_column_size{
            display: inline!important;
            min-width: 45%!important;
            width: 45% !important;
            margin-left: 45% !important;
        }
        #txt2img_column_batch,#img2img_column_batch
        {
            float: left !important;
            position: absolute !important;
            width: 45% !important;
        }
        #setting_CLIP_stop_at_last_layers{
            min-width: 14em !important; max-width: 14em !important;
        }
        #setting_eta_noise_seed_delta{
            min-width: 12em !important; max-width: 12em !important;
        }
    `;
    app_addStyle(baseStyles);
    app_addStyle(styles02);
}

function app_txt2img(){
    // 添加候选词
    var app = document.querySelector('gradio-app');
    var appRoot = app.shadowRoot;
    var txt2img_column_size = appRoot.querySelector('#txt2img_column_size');
    var txt2img_width_input = appRoot.querySelector('#txt2img_width > div.w-full.flex.flex-col > div > input');
    var txt2img_height_input = appRoot.querySelector('#txt2img_height > div.w-full.flex.flex-col > div > input');
    if (txt2img_width_input) {
        txt2img_width_input.setAttribute("list", "txt2img-size");
    }
    if (txt2img_height_input) {
        txt2img_height_input.setAttribute("list", "txt2img-size");
    }
    var datalist_imgSize = `
        <datalist id="txt2img-size">
            <option value="512">
            <option value="768">
            <option value="1024">
        </datalist>
    `;
    txt2img_column_size.insertAdjacentHTML( 'beforeend', datalist_imgSize);
}


function app_addStyle(styleContent) {
    var app = document.querySelector('gradio-app');
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    app.shadowRoot.appendChild(elStyle);
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
