// ==UserScript==
// @name         MJZ-SankakuComplex助手
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://chan.sankakucomplex.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==


(function () {
    setTimeout(function () {
        main();
    }, 100);
})();

function main() {
    Mjztool.addStyle(".thumb a[href=\"https://get.sankaku.plus/\"] {visibility: hidden; height: 0};");
    Mjztool.addStyle(".sound-icon, .video-icon {width: 16px; height: 16px};");
    Mjztool.addStyle("#news-ticker {display: none;}");
    Mjztool.addStyle("div.content { padding-left: 250px; }");
    Mjztool.addStyle("div.has-mail { padding: 6px; margin: 6px; }");
    Mjztool.addStyle("#subnavbar { height: 2em !important;}");
    // Mjztool.addStyle(".content .thumb { width: 216px; height: 120px; }");
    // Mjztool.addStyle(".content .thumb img.preview { width: 180px; height: 100px; }");
    // Mjztool.addStyle(".content .popular-preview-post { width: 204px; height: 150px; }");
    

    if (Mjztool.matchURL("/post/")) {

        // 改用插件实现
        funcVideo();
        
        setTimeout(function () {
            PostVideo();

            jQuery("#search-form").after($("#stats"));
        }, 1000);
        
    }

    setTimeout(function () {
        content();
        content_bind();

        open_in_new_tab();
    }, 1000);
    
}

function funcVideo() {
    if (Mjztool.matchURL("/post/")) {
        // $("Video").removeAttr("autoplay");
        // $("Video").attr("preload", "none");

		var video = document.getElementById("image"); 

        if (video.nodeName.toLowerCase() != "video") {
            return false;
        }

        var src = video.getAttribute("src");
        video.removeAttribute("src");

        /*  none: 表示不应该预加载视频。
            metadata: 表示仅预先获取视频的元数据（例如长度）。
            auto: 表示可以下载整个视频文件，计时用户不希望使用它。
        */
        video.setAttribute("preload", "metadata");

        video.removeAttribute("autoplay");

        var source = document.createElement("source");
        source.setAttribute("src", src);
        source.setAttribute("type", "video/mp4");
        video.appendChild(source);
	}
}

function open_in_new_tab(){
    $('#post-list .thumb a').attr('target', '_blank');
    $('#post-list .thumb a').attr('onclick', 'javascript;');
    // $('#post-list .thumb a').click(function(){ });
}

function imgPreview(img){
    var title = img.attr("title");
    if (title) {
        var strHas = function(str, target){
            return str.indexOf(target) > -1;
        };

        if (strHas(title, "mp4")) {
            // img.css("border-top", "4px solid green");
            img.addClass("video_mp4");
        }else if (strHas(title, "webm")) {
            img.addClass("video_webm");
        }
        if (strHas(title, "3840") || strHas(title, "2160") ) {
            img.addClass("video_4k");
        }else if (strHas(title, "2560") || strHas(title, "1440")) {
            img.addClass("video_2k");
        }else if (strHas(title, "1920") || strHas(title, "1080")) {
            img.addClass("video_1080p");
        }

    }
}

function content() {
    var style = "";
    style += ".video_mp4  {border-top: 4px solid green !important;}";
    style += ".video_webm  {border-top: 4px solid yellow !important;}";
    style += ".video_4k { border-left: 3px solid firebrick !important;}";
    style += ".video_2k  { border-left: 3px solid turquoise !important;}";
    style += ".video_1080p  {border-left: 3px solid hotpink !important;}";
    style += "";
    Mjztool.addStyle(style);

    
    content_check();
}

function content_check(){
    jQuery("img").each(function () {
        imgPreview(jQuery(this));
    });
    if (Mjztool.matchURL("/post/show/") == false) {
        jQuery("img").hover(function () {
            imgPreview(jQuery(this));
        });
    }
    
}

function content_bind() {
    // DOMNodeInserted
    $("#content").bind('DOMNodeInserted', function (e) {
        setTimeout(function () {
            content_check();
        }, 200);
    });
}

function PostVideo(){
    /*** 隐藏Header, 移除广告并支持网站 */
    Mjztool.addStyle('#headerlogo, #has-mail-notice{display: none;}');

    var btn = document.createElement("button");
    btn.textContent = "复制视频地址";
    btn.style = "";
    btn.addEventListener("click", function () {
        var imgBooth = document.getElementById("image");
        var imgLink = imgBooth.getAttribute("src");
        // imgLink = imgLink.replace("", "");
        imgLink = "https:" + imgLink;
        Mjztool.GM_setClipboard(imgLink);
    }, false);
    jQuery("#post-content").prepend("<div></div>");
    jQuery("#post-content").prepend(btn);


    btnDownload();

    
   
}

function btnDownload() {
    var btnDownload = document.createElement("button");
    btnDownload.textContent = "下载源图";
    btnDownload.addEventListener("click", function () {
        onBtnClick();
    }, false);

    jQuery("#post-content").prepend(btnDownload);
    
    var btnDownload2 = document.createElement("button");
    btnDownload2.textContent = "下载源图然后关闭窗口";
    btnDownload2.addEventListener("click", function () {
        onBtnClick(true);
    }, false);

    jQuery("#post-content").prepend(btnDownload2);

    /*
    var btnDownload = document.createElement("a");
    btnDownload.textContent = "下载源图";

    var highres = document.getElementById("highres");
    var imgLink = highres.getAttribute("src") || highres.getAttribute("href");

    imgLink = "https:" + imgLink;

    btnDownload.setAttribute("href", imgLink);
    btnDownload.setAttribute("download", imgLink);

    $("#post-content").prepend(btnDownload);
    */
}

function onBtnClick(delayCloseWindow){
    var highres = document.getElementById("highres");
    var imgLink = highres.getAttribute("src") || highres.getAttribute("href");

    imgLink = "https:" + imgLink;
    console.log("imgLink: " + imgLink);

    var filename = imgLink.split("/");
    filename = filename[filename.length - 1];

    forceDownload(imgLink, filename); 
    
    if (delayCloseWindow) {
        setTimeout(function () {
            window.close();
        }, 60000);
    }
}


///////////////////////////////////////////////////////

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
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ?
        "" :
        ";expires=" + exdate.toUTCString() + ";path=/");
}

function deleteCookie(name) {
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// toolkit
function Mjztool() {}
Mjztool.bytesToSize = function (bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
};
Mjztool.matchURL = function (url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
};
Mjztool.matchURLAbsolute = function (url) {
    const href = window.location.href;
    const len = href.length;
    return href.indexOf(url) > -1 && url.length == len;
};
Mjztool.addStyle = function (styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
};
Mjztool.addFunction = function (func, name) {
    name = name || func.name;
    document[name] = func;
};
Mjztool.GM_setClipboard = function (content) {
    // @grant        GM_setClipboard
    GM_setClipboard(content);
};
Mjztool.appendScriptLink = function (src) {
    var f = document.createElement('script');
    f.src = src;
    document.body.appendChild(f);
};
Mjztool.appendStyleLink = function (src) {
    var elStyle = document.createElement("link");
    elStyle.rel = "stylesheet";
    elStyle.type = "text/css";
    elStyle.href = src;
    document.head.appendChild(elStyle);
};
Mjztool.randomSelect = function (list) {
    var rStart = 0;
    var rEnd = list.length;
    var randomIndex = Math.floor(Math.random() * rEnd + rStart);
    return list[randomIndex];
};
Mjztool.filterList = function (list, filter, constructor) {
    if (!(list instanceof Array)) console.error('param "list" is not Array');
    if (typeof (filter) !== 'function') console.error('param "filter" is not Function');

    var result = [];
    for (var index = 0; index < list.length; index++) {
        var element = list[index];
        if (filter(element, index)) {
            if (typeof (constructor) === 'function') {
                result.push(constructor(element, index));
            } else {
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