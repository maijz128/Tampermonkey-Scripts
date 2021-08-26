// ==UserScript==
// @name         hitomi.la
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.hitomi.la/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.4/jquery.min.js
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
    setTimeout(function () {
        main();
    }, 10);
})();

function main() {
    
    setTimeout(function(){
        $(".lillie a").each(obj, function(k, v){
            $(this).attr("target", "_blank");
        });
    }, 1000);

    if (Mjztool.matchURL("/reader/")) {
        Mjztool.addStyle("#comicImages picture img {margin-bottom: 14px;}");
        Mjztool.addStyle("#comicImages {padding: 0 14px;}");
        Mjztool.addStyle(".navbar {opacity: 0;position: absolute;} .navbar:hover {opacity: 1;}");
        
        setTimeout(function(){
            $("#comicImages").removeClass("fitHorizontal");
        }, 1000);

        setTimeout(function(){
            AutoLoadPage();
        }, 1000);
    }
}

function AutoLoadPage() {
    var pageCount = $("#single-page-select option").length;
    var currentPage = 1;
    var hArr = window.location.href.split("#");
    if (hArr.length > 1) {
        currentPage = parseInt(hArr[1]);
    }
    console.log("page count: " + pageCount);
    console.log("page current: " + currentPage);

    for (var i = currentPage + 1; i < pageCount; i++) {
        AppendPicture(i);
    }

}

function AppendPicture(i) {
    var pic = make_image_element2(galleryinfo['id'], our_galleryinfo[i], no_webp);
    document.getElementById('comicImages').appendChild(pic);
}

function make_image_element2(galleryid, file, no_webp, onclickfunc, onmouseoverfunc, name) {
    var img = document.createElement('img');
    
    if (onclickfunc) {
            img.onclick = onclickfunc;
    }
    if (onmouseoverfunc) {
            img.onmouseover = onmouseoverfunc;
    }
    
    if (no_webp || (!file['haswebp'] && !file['hasavif'])) {
            if (name) {
                    img.name = name;
            }
            
            img.setAttribute('src', url_from_url_from_hash(galleryid, file)); //have to wait until now to set src or mobile safari will load it as well
            
            return img;
    }
    
    var picture = document.createElement('picture');
    // if (file['hasavif']) {
    //         picture.appendChild(make_source_element(galleryid, file, 'avif'));
    // }
    // if (file['haswebp']) {
    //         picture.appendChild(make_source_element(galleryid, file, 'webp'));
    // }
    picture.appendChild(img);
    
    if (name) {
            picture.name = name;
    }
    
    img.setAttribute('src', url_from_url_from_hash(galleryid, file)); //have to wait until now to set src or mobile safari will load it as well
    img.setAttribute("loading", "lazy");

    return picture;
}


function FetchPage(pageNumber) {
    var href = window.location.href;
    var hArr = window.location.href.split("#");
    if (hArr.length > 1) {
        href = hArr[0];
    }
    var url = href + "#" + pageNumber;

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "text", //'json'
        onload: SearchPictureFromHtml,
    });
}

function SearchPictureFromHtml(r) {
    var res = r.response;
    var url = r.finalUrl;

    console.log(res);

    var id = url.split("#")[1];

    // console.log(res);
    var key1 = "<picture>";
    var key2 = "</picture>";

    var ratIndex = res.indexOf(key1);
    var ratIndex2 = res.indexOf(key2);
    if (ratIndex > -1) {
        var ot = res.substr(ratIndex + keyRat.length, ratIndex2 - (ratIndex + keyRat.length));
        console.log(ot);
    }

    // console.log(id, data);
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