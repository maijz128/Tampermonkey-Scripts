// ==UserScript==
// @name         MaiJZ - mytvsuper
// @namespace    https://github.com/maijz128
// @version      23.09.07
// @description  描述
// @author       MaiJZ
// @match        *://*.mytvsuper.com/*
// @require        https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
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
    },20);
})();

function main() {
    setTimeout(function(){
        AllSite();
        SiteLink();
    },2000);

    if (Mjztool.matchURL('/programme/')) {
        setTimeout(function(){
            programme();
            
        },2000);
    }

    if (Mjztool.matchURL('/search/')) {
        setTimeout(function(){
            SiteSearch();
        },2000);
    }
}

function AllSite(){
    // textarea: srcText
    $('.main-wrap').append('<textarea id="srcText" class="srcText" rows="4"></textarea>');

    var css = '';
    css += '.srcText { position: fixed; bottom: 0; left: 10px; opacity: 0.1;}';
    css += '.srcText:hover { position: fixed; bottom: 0; left: 10px; opacity: 1;}';
    // css += '.mix-item-hover { display: none !important; }';

    Mjztool.addStyle(css);

    // new window open item
    setInterval(() => {
    
        $('.mpm-track-item.mix-item-hover').each(function(){
            var elA = $(this).find('a');
            // elA.removeClass('hidden');
            elA.attr('target', '_blank');
        });

        $(".mpm-track-item.mix-item-hover").click(function(event){
            // 阻止 click 事件冒泡到父元素
            event.stopPropagation();
            // 阻止剩下的事件处理程序被执行
            event.stopImmediatePropagation();
    
            var elA = $(this).find('a');
            var url = elA.attr('href');
            
            console.log("被点击了：" + url);
            window.open(url, "_blank");
        });

    }, 1000);
}

function SiteSearch(){

    var funShowName = function(){
        $('.mpm-track-item > div > div:nth-child(2)').each(function(){
            var cssDisplay = $(this).css('display');
            if(cssDisplay == 'none'){
                $(this).css('display', 'block');
            }
        });
    };

    funShowName();
    setInterval(() => {
        funShowName();
    }, 4000);






    
}


function SiteLink(){
    var title = document.title;
    var thisLink = '<a herf="' + window.location.href + '">' + title + '</a>';
    var thisLinkMD = '[' + title + ']'  + '(' + window.location.href + ')';

    var btn = document.createElement("button");
    btn.textContent = "复制链接（Markdown）";
    btn.onclick = function(){
        GM_setClipboard(thisLinkMD);
    };

    if (Mjztool.matchURL('/programme/')) {
        $('h1').after(btn);
    }else{
        $('.children-container').prepend(btn);
    }
    
}



function programme() {
    var imglist = [];
    var msgs = '';


    // hide item lock mask
    Mjztool.addStyle('[class^=Row_lock__] {display: none;}');

    // a new window
    $('a.hidden').attr('target', '_blank');
    $('a.hidden').removeClass('hidden');

    $('div').each((function(){
        var thisClass = $(this).attr('class');

        if(thisClass){
            if (thisClass.indexOf('Programme_programme_desc') > -1) {
                $(this).css('overflow', 'auto');
                $(this).css('min-height', '60px');
            }
        }

    }));


    var thisLinkMD = '[' + document.title + ']'  + '(' + window.location.href + ')';
    var bgMD = '';
    var programmeName = '';
    var programmeTrackCount = 1;
    var programmeDesc = '';
    var trackItemMD = '';

    // banner img
    $('div.content-wrap > main > div > div > div').each(function(){
        var divStyle = $(this).attr('style');
        var divBG = $(this).css('background-image');
        // console.log('banner img: ' + divStyle);
        
        if(divBG.indexOf('img') > -1){
            console.log('banner img: ' + divBG);

            divBG = divBG.replace('url("', '');
            divBG = divBG.replace('")', '');

            bgMD = '![](' + divBG + ')' + '\n\n';
            msgs += bgMD;
        }
    });

    // name & count
    ppTitle = $('[class*=Programme_programme_title__]');
    programmeName = '**' + $(ppTitle[0]).text() + '**';
    programmeTrackCount = $(ppTitle[1]).text();

    // programme Desc
    programmeDesc = $('[class*=Programme_programme_desc__]').text();


    // 集數
    var funcFindTrackItem = function(){
        trackItemMD = '## 集數';
        trackItemMD += '\n\n';

        $('div.content-wrap > main > div > div:nth-child(2) .mpm-track-item').each(function(){
            var imgSrc = $(this).find('img').attr('src');
            var imgAlt = $(this).find('p').attr('alt');

            if (imgSrc.indexOf('/image/') > -1 || imgSrc.indexOf('img') > -1) {
                var p1 = $($(this).find('p')[0]);
                var p2 = $($(this).find('p')[1]);
                var rd = $(this).find('[class^=Row_duration]');
                var sTitle = '### ' + p1.text();
                var sInfo = '' + p2.text();
                var sImgSrc = '![](' + imgSrc + ')';
                var sDuration = '*时长：' + rd.text() + '*';

                sTitle = sTitle.replace('集\n', '集 ');

                trackItemMD += sTitle + '\n';
                trackItemMD += sImgSrc + '\n';
                trackItemMD += sDuration + '\n\n';
                trackItemMD += sInfo + '\n';

                trackItemMD += '\n';
            }
        });
    };

    var funcShowMD = function(){
        msgs = '';
        msgs += thisLinkMD + '\n\n';
        msgs += bgMD + '\n\n';
        msgs += programmeName + '\n';
        msgs += programmeTrackCount + '\n\n';
        msgs += programmeDesc + '\n\n';
        msgs += trackItemMD + '\n\n';

        // console.log ('剧集：');
        // console.dir (msgs);
        $('#srcText').text(msgs);
    };

    funcFindTrackItem();
    setTimeout(function(){
        funcShowMD();
    },2000);

    setInterval(function(){
        funcFindTrackItem();
        setTimeout(function(){
            funcShowMD();
        },2000);
    }, 4000);

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
