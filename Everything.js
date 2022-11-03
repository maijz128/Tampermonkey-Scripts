// ==UserScript==
// @name         MaiJZ-Everything（本地文件查找）
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://steamcommunity.com/sharedfiles/filedetails/*
// @match        *://steamcommunity.com/workshop/browse/*
// @match        *://steamcommunity.com/profiles/*/myworkshopfiles/*
// @match        *://steamcommunity.com/id/*/myworkshopfiles/*
// @match        *://bangumi.tv/subject/*
// @match        *://bangumi.tv/anime/browser/*
// @match        *://illusioncards.booru.org/*
// @match        *://chan.sankakucomplex.com/*
// @match        *://rule34.xxx/*
// @match        *://render-state.to/*
// @match        *://jable.tv/*
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
// @connect      127.0.0.1
// @connect      127.0.0.1:8022
// ==/UserScript==

var Everything = "http://127.0.0.1:8022/";
var Everything_Query = "?search=%search%&json=1&count=10&path_column=1&size_column=1&date_modified_column=1&date_created_column=1&attributes_column=1&sort=name&ascending=1";

(function () {
    setTimeout(function(){
        main();
    },10);
})();

function main() {
    if (matchURL("steamcommunity.com/sharedfiles")) { steamcommunity_sharedfiles(); }
    if (matchURL("steamcommunity.com/workshop/browse")) { steamcommunity_workshop(); }
    if (matchURL("steamcommunity.com") && matchURL("myworkshopfiles")) { steamcommunity_workshop(); }
    if (matchURL("bangumi.tv/subject")) { bangumi_subject(); }
    if (matchURL("bangumi.tv/anime/browser")) { bangumi_anime_browser(); }
    if (matchURL("illusioncards.booru.org")) { illusioncards_booru_org(); }
    if (matchURL("chan.sankakucomplex.com")) { sankakucomplex(); }
    if (matchURL("rule34.xxx")) { rule34_xxx(); }
    if (matchURL("render-state.to")) { render_state(); }
    if (matchURL("jable.tv")) { jable_tv(); }
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

/*
async function EverythingGetJSON(searchText){
    var url = EverythingHttpRequest(searchText);
    try {
        var response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log('Request Failed', error);
    }
}
*/
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



// Steam 创意工坊
function steamcommunity_sharedfiles(){
    var params = getQueryParams();
    var searchText = params["id"];
    EverythingGetJSON(searchText, function(json){
        if (json) {
            if (json["totalResults"] > 0) {
                Mjztool.addStyle(".workshopItemTitle{ color: green !important; }");
                
                var href = EverythingHttpWeb(searchText);
                var button = `<a href="${href}" class="sectionTab "><span>Everything</span></a>`;
                var sectionTabs = document.querySelector(".sectionTabs");
                jQuery(sectionTabs).append(button);
            }
        }
    });

}
function steamcommunity_workshop(){
    Mjztool.addStyle(".workshopBrowseItems_green { background: green !important; }");

    jQuery(".workshopBrowseItems > div > a:nth-child(5)").each(function(){
        var thisElem = jQuery(this);
        // console.log(thisElem);
        var searchText = thisElem.attr("href").split("id=");
        searchText = searchText[1].split("&")[0];

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass("workshopBrowseItems_green");
                }
            }
        });
    });
}

function bangumi_subject(){
    var id = window.location.href.split("/")[4];
    var searchText = id + ".bangumi";
    EverythingGetJSON(searchText, function(json){
        if (json) {
            if (json["totalResults"] > 0) {
                Mjztool.addStyle(".nameSingle a{ color: green !important; }");

                var href = EverythingHttpWeb(searchText);
                var button = `<li><a href="${href}">Everything</a></li>`;
                var sectionTabs = document.querySelector(".navTabs");
                jQuery(sectionTabs).append(button);
            }
        }
    });
}
function bangumi_anime_browser(){
    Mjztool.addStyle(".workshopBrowseItems_green h3 a { color: green !important; }");

    jQuery("#browserItemList .item").each(function(){
        var thisElem = jQuery(this);
        // console.log(thisElem);
        var searchText = thisElem.attr("id").replace("item_", "");
        searchText = searchText + ".bangumi";

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass("workshopBrowseItems_green");
                }
            }
        });
    });
}

function illusioncards_booru_org(){
    Mjztool.addStyle(".thumb_img_green { border: 1px solid green; }");

    jQuery(".thumb img").each(function(){
        var thisElem = jQuery(this);
        var searchText = thisElem.attr("src");
        if (searchText.indexOf("thumbnail_") > 0) {
            searchText = searchText.split("thumbnail_")[1];
            console.log(searchText);

            EverythingGetJSON(searchText, function(json){
                if (json) {
                    if (json["totalResults"] > 0) {
                        thisElem.addClass("thumb_img_green");
                    }
                }
            });
        }
    });
}

function sankakucomplex(){
    Mjztool.addStyle(".thumb_img_local { border-bottom: 4px solid #FF761C !important; }");
    setTimeout(() => {
        sankakucomplex_check();
    }, 1000);
    // sankakucomplex_check();
    sankakucomplex_bind();
}
function sankakucomplex_bind() {
    // DOMNodeInserted
    $("#content").bind('DOMNodeInserted', function (e) {
        setTimeout(function () {
            sankakucomplex_check();
        }, 200);
    });

    jQuery(".thumb img").hover(function(){
        var img = jQuery(this);
        sankakucomplex_func(img);
    });
}
function sankakucomplex_check(){

    jQuery(".thumb img").each(function(){
        var img = jQuery(this);
        sankakucomplex_func(img);
    });

    if (matchURL("/post/show/")) {
        var highres = jQuery("#highres");
        if (highres) {
            sankakucomplex_func(highres);
        }
    }
    
}

function sankakucomplex_func(thisElem){
    var searchText = thisElem.attr("src") || thisElem.attr("href");
    var ss = searchText.split("/");
    searchText = ss[ss.length - 1];
    searchText = searchText.split(".")[0];
    console.log(searchText);

    EverythingGetJSON2(searchText, thisElem, function(elem, json){
        if (json) {
            if (json["totalResults"] > 0) {
                console.log("has " + searchText);
                // console.log(elem)
                elem.addClass("thumb_img_local");
                // elem.css("border-bottom", "4px solid #FF761C");
            }
        }
    });
}


function rule34_xxx(){
    Mjztool.addStyle(".thumb_img_local { border-bottom: 4px solid #FF761C !important; }");
    setTimeout(() => {
        rule34_xxx_check();
    }, 1000);
    rule34_xxx_bind();
}
function rule34_xxx_bind() {
    // DOMNodeInserted
    $("#content").bind('DOMNodeInserted', function (e) {
        setTimeout(function () {
            rule34_xxx_check();
        }, 200);
    });

    jQuery(".thumb img").hover(function(){
        var img = jQuery(this);
        rule34_xxx_func(img);
    });
}
function rule34_xxx_check(){
    jQuery(".thumb img").each(function(){
        var img = jQuery(this);
        rule34_xxx_func(img);
    });

    if (matchURL("page=post&s=view")) {
        var image = jQuery("#image");
        if (image) {
            rule34_xxx_func(image);
        }
    }
    
}
function rule34_xxx_func(thisElem){
    var searchText = thisElem.attr("src") || thisElem.attr("href");
    var ss = searchText.split("/");
    searchText = ss[ss.length - 1];
    searchText = searchText.split(".")[0];
    searchText = searchText.replace("thumbnail_", "");
    searchText = searchText.replace("sample_", "");
    console.log(searchText);

    EverythingGetJSON2(searchText, thisElem, function(elem, json){
        if (json) {
            if (json["totalResults"] > 0) {
                console.log("has " + searchText);
                // console.log(elem)
                elem.addClass("thumb_img_local");
            }
        }
    });
}


function render_state(){
    Mjztool.addStyle(".front-view-title-a { color: green !important; }");

    var func = function(thisElem){
        var searchText = thisElem.text(); // thisElem.attr("src") || thisElem.attr("href");
        // var ss = searchText.split("/");
        // searchText = ss[ss.length - 1];
        // searchText = searchText.split(".")[0];
        console.log(searchText);

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass("front-view-title-a");
                }
            }
        });
    };

    jQuery(".front-view-title a").each(function(){
        var thisElem = jQuery(this);
        func(thisElem);
    });

    jQuery(".entry-title").each(function(){
        var thisElem = jQuery(this);
        func(thisElem);
    });

    // var highres = jQuery("#highres");
    // if (highres) {
    //     func(highres);
    // }
}

function jable_tv(){
    var cssName = "exist_in_local";
    Mjztool.addStyle(`.${cssName} { color: green !important; }`);

    var func = function(thisElem){
        var searchText = thisElem.attr("href"); //thisElem.text(); // thisElem.attr("src") || 
        // var ss = searchText.split("/");
        // searchText = ss[ss.length - 1];
        // searchText = searchText.split(".")[0];
        searchText = searchText.replace("https://jable.tv/videos/", "");
        searchText = searchText.replace("/", "");
        console.log(searchText);

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    jQuery(".title a").each(function(){
        var thisElem = jQuery(this);
        func(thisElem);
    });

    var header_title = jQuery(".header-left h4");
    if (header_title) {
        var searchText = header_title.text();
        var ss = searchText.split(" ");
        searchText = ss[0];
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    header_title.addClass(cssName);
                }
            }
        });
    }
}





/*******************************************************************************/



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
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    i = Math.floor(Math.log(bytes) / Math.log(k));
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
