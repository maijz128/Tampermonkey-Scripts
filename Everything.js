// ==UserScript==
// @name         MaiJZ-Everything（本地文件查找）
// @namespace    https://github.com/maijz128
// @version      24.05.16
// @description  描述
// @author       MaiJZ
// @match        *://steamcommunity.com/sharedfiles/filedetails/*
// @match        *://steamcommunity.com/workshop/browse/*
// @match        *://steamcommunity.com/workshop/filedetails/*
// @match        *://steamcommunity.com/profiles/*
// @match        *://steamcommunity.com/id/*
// @match        *://steamcommunity.com/app/*
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://illusioncards.booru.org/*
// @match        *://chan.sankakucomplex.com/*
// @match        *://rule34.xxx/*
// @match        *://e-hentai.org/*
// @match        *://exhentai.org/*
// @match        *://render-state.to/*
// @match        *://*.cool18.com/*
// @match        *://*.34king.life/*
// @match        *://*.laowang.vip/*
// @match        *://*.jable.tv/*
// @match        *://*.javdb.com/*
// @match        *://*.javlibrary.com/*
// @match        *://*.pornhub.com/*
// @match        *://*.civitai.com/*
// @match        *://*.douban.com/*
// @match        *://*.youtube.com/*
// @match        *://*.lcsd.gov.hk/*
// @match        *://*.1bt0.com/*
// @match        *://*.2bt0.com/*
// @match        *://*.3bt0.com/*
// @match        *://*.4bt0.com/*
// @match        *://*.5bt0.com/*
// @match        *://*.6bt0.com/*
// @match        *://*.7bt0.com/*
// @match        *://*.8bt0.com/*
// @match        *://*.wnacg.com/*
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
var EverythingHttpRequest_LOG = true;

(function () {
    setTimeout(function(){
        main();
    },10);
})();

function main() {
    Styles();
    if (matchURL("steamcommunity.com/sharedfiles")) { steamcommunity_sharedfiles(); }
    if (matchURL("steamcommunity.com")) { steamcommunity_workshop(); }
    
    if (Mjztool.matchUrlList(["bangumi.tv", 'bgm.tv'])) { Bangumi(); }
    if (matchURL("illusioncards.booru.org")) { illusioncards_booru_org(); }
    if (matchURL("chan.sankakucomplex.com")) { sankakucomplex(); }
    if (matchURL("rule34.xxx")) { rule34_xxx(); }
    if (matchURL("render-state.to")) { render_state(); }
    if (matchURL("jable.tv")) { setTimeout(jable_tv, 2000); }
    if (matchURL("javdb.com")) { setTimeout(javdb_com, 2000); }
    if (matchURL("javlibrary.com")) { setTimeout(javlibrary, 2000); }
    if (matchURL("pornhub.com")) { setTimeout(pornhub, 1000); }
    if (matchURL("civitai.com")) { setTimeout(civitai, 2000); }
    if (matchURL("douban.com")) { setTimeout(DouBan, 2000); }
    if (matchURL("youtube.com")) { setTimeout(youtube, 5000); }
    if (matchURL("lcsd.gov.hk")) { setTimeout(lcsd_gov_hk, 5000); }
    if (matchURL("cool18.com")) { setTimeout(cool18, 5000); }
    // 绅次元
    if (Mjztool.matchUrlList(["34king.life"])) { setTimeout(Home34, 3000); }
    // 老王论坛
    if (Mjztool.matchUrlList(["laowang.vip"])) { setTimeout(laowang_vip, 3000); }
    if (Mjztool.matchUrlList(["exhentai.org", 'e-hentai.org'])) 
        { setTimeout(EHentai, 3000); }

    if (Mjztool.matchUrlList(["wnacg.com",])) 
        { setTimeout(WNACG, 3000); }

    if (document.title.indexOf("不太灵影视") > -1) 
    { setTimeout(butailing, 2000); }
}

function Styles(){
    var css ="";
    css +=".ExistsLocal_GreenBackground { background: green !important; }";
    css +=".ExistsLocal_child_GreenColor, .ExistsLocal_child_GreenColor > * { color: green !important; }";
    css +=".ExistsLocal_GreenColor { color: green !important; }";
    css +="";
    Mjztool.addStyle(css);
}

function EverythingHttpRequest(searchText){
    var req = Everything + Everything_Query;
    searchText = searchText.replace(" ", "+");
    req = req.replace("%search%", searchText);
    if(EverythingHttpRequest_LOG)
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
    if(searchText == null) return;
    var url = EverythingHttpRequest(searchText);

    GM_xmlhttpRequest({
        url: url,
        method :"GET",
        headers: {
            "Content-Type": "application/json"
        },
        responseType: "json",
        onload:function(response){
            // console.log(response.responseText);
            if(callback) { callback(response.response);}
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

    var funcTitleEl = function(ahref, thisElem){
        var searchText = ahref.split("id=");
        searchText = searchText[1].split("&")[0];
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass("ExistsLocal_child_GreenColor");
                }
            }
        });
    };

    if (matchURL("myworkshopfiles") || matchURL('/workshop/browse')) {
        jQuery(".workshopBrowseItems > div > a:nth-child(5)").each(function(){
            var thisElem = jQuery(this);
            var ahref = thisElem.attr("href");
            funcTitleEl(ahref, thisElem);
        });
    }
    
    if (matchURL("/workshop/filedetails/")) {
        jQuery(".collectionItemDetails > a").each(function(){
            var thisElem = jQuery(this);
            var ahref = thisElem.attr("href");
            funcTitleEl(ahref, thisElem);
        });
    }
    

}

function Bangumi(){
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} span, .${cssName} div { color: green !important; }`;
    Mjztool.addStyle(css);

    if (matchURL("/subject")) { bangumi_subject(); }

    bangumi_browserItemList(); 
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
function bangumi_browserItemList(){
    Mjztool.addStyle(".workshopBrowseItems_green h3 a { color: green !important; }");

    jQuery("#browserItemList .item").each(function(){
        var thisElem = jQuery(this);
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

    if (matchURL("/post/show/") || matchURL("/posts/")) {
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


function javdb_com(){
    var cssName = "ExistsLocal_GreenColor";

    var func = function(thisElem){
        var searchText = thisElem.text(); //thisElem.attr("href"); // thisElem.attr("src")
        console.log(searchText);

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.parent().addClass(cssName);
                }
            }
        });
    };

    jQuery(".item .video-title strong").each(function(){
        var thisElem = jQuery(this);
        func(thisElem);
    });

    jQuery(".tile-item .video-number").each(function(){
        var thisElem = jQuery(this);
        var searchText = thisElem.text();
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    });

    var title_id = jQuery(".video-detail > .title > strong:nth-child(1)");
    if (title_id) {
        var searchText = title_id.text();
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    title_id.parent().addClass(cssName);
                }
            }
        });
    }

}

function javlibrary(){
    var cssName = "ExistsLocal_GreenColor";

    var func = function(searchText, thisElem){
        console.log(searchText);

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };



    if (Mjztool.matchURL('/?v=')) {
        var avid = jQuery('#avid').attr('avid');
        var elem = jQuery('#video_title');
        func(avid, elem);
    }



    jQuery(".videos .video").each(function(){
        var avidElem = jQuery(this).find('.id');
        var avid = avidElem.text().split(' ')[0];
        func(avid, avidElem);
    });

}

function pornhub(){
    var cssName = "ExistsLocal_GreenColor";

    var func = function(thisElem){
        var searchText = thisElem.attr("href"); // thisElem.text();  thisElem.attr("src")
        searchText = searchText.replace("/view_video.php?viewkey=", "");
        console.log(searchText);

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    var selector_list = [
        ".pcVideoListItem .title a", 
    ];
    selector_list.forEach(selector => {
        jQuery(selector).each(function(){
            var thisElem = jQuery(this);
            func(thisElem);
        });
    });

    
    if (Mjztool.matchURL("view_video.php")) {
        var viewkey = getQueryParams()["viewkey"];
        var searchText = viewkey;
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    var title = jQuery(".title-container > h1.title");
                    title.addClass(cssName);
                }
            }
        });
        
    }


}


function civitai(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} div.mantine-Stack-root > div.mantine-Stack-root > div.mantine-Group-root > .mantine-Text-root { color: green !important; }`;
    Mjztool.addStyle(css);

    var funcCard = function(thisElem){
        var searchText = null;
        var href = thisElem.attr("href"); // thisElem.text();  thisElem.attr("src")
        var modelId = href.match(/\d+/);
        if (modelId) {
            searchText = modelId + '.models.civitai';
        }
        // console.log(searchText);

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };
    
    if (Mjztool.matchURL("/models/")) {
        var modelId = window.location.href.match(/\d+/);
        var searchText = modelId + '.models.civitai';
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    var title = jQuery("h1.mantine-Title-root");
                    title.addClass(cssName);
                }
            }
        });
    }else{
        setInterval(() => {
            var selector =  ".mantine-Card-root > a:nth-of-type(1)";
            jQuery(selector).each(function(){
                var thisElem = jQuery(this);
                if (thisElem.hasClass(cssName) == false) {
                    funcCard(thisElem);
                }
            });  
        }, 2000);
    }


}

function DouBan(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} > span { color: green !important; }`;
    Mjztool.addStyle(css);

    var href = window.location.href;
    var hs = href.split('/');
    var local_filename = hs[4] + '.' + hs[3] + '.douban';


    var funcTitle = function(searchText){
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    var title = jQuery("#content h1");
                    title.addClass(cssName);
                }
            }
        });
    };

    var funcHref = function(href, elem){
        if (href.indexOf('subject/') >= 0) {
            var id = href.split('/')[4];
            var searchText = id;
            if (href.indexOf('movie.douban') >= 0){
                searchText = id + '.movie.douban';
            }
            console.log(searchText);
            EverythingGetJSON(searchText, function(json){
                if (json) {
                    if (json["totalResults"] > 0) {
                        elem.addClass(cssName);
                    }
                }
            });
        }

    };

    if (Mjztool.matchUrlList(["/subject/"])) {
        var searchText = hs[4] + '.movie.douban';
        funcTitle(searchText);
        funcTitle(local_filename);
    }
    if (Mjztool.matchUrlList(["/celebrity/"])) {
        funcTitle(local_filename);
    }

    var selector_list = ["#recommendations a", ".info a", ".article li a" ];


    selector_list.forEach(function(selector){
        jQuery(selector).each(function(){
            var href = jQuery(this).attr('href');
            if (href && href.indexOf('subject') >= 0) {
                funcHref(href, jQuery(this));
            }
        });
    });

    

}

function youtube(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} > span { color: green !important; }`;
    Mjztool.addStyle(css);

    var funcLocalButton = function() {
        var btnId = 'btnLocal';
        var baseBtnText = 'Local💾';
        var buttonMarginLeft = '20';
        var container = document.querySelector('ytd-watch-metadata');
        var h1 = container.querySelector('h1');
        var title = h1.querySelector('yt-formatted-string');
        // h1.style.position = 'relative'

        if (document.querySelector(`#${btnId}`) != null) {
            return;
        }

        var button = document.createElement('button');
        button.innerText = baseBtnText;
        button.style.color = 'green';
        button.addEventListener('click', function() {
            if (isInitReady) {
                // changeVideo();
            }
            else {
                alert('please wait for the video ready');
            }
        });
        title.after(button);
        // button.style.position = 'absolute'
        button.style.marginLeft = buttonMarginLeft + 'px';
        button.setAttribute('id', btnId);
    };

    var funcSearch = function(searchText, thisElem){
        console.log('search: ' + searchText);
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    console.log('search: ' + searchText + '\n    exists local.');
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    var funcTitle = function(searchText){
        console.log('search: ' + searchText);
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    console.log('search: ' + searchText + '\n    exists local.');
                    funcLocalButton();
                }
            }
        });
    };

    

    var checkVideoItem = function(){ 
        jQuery('ytd-rich-item-renderer').each(function(){
            var thisElem = jQuery(this);

            if (thisElem.attr('local-check') != 'checked') {

                var elMetadataLine = thisElem.find('#metadata-line');
                var elVideoTitleLink = thisElem.find('a#video-title-link');
                var videoLink = elVideoTitleLink.attr('href');
                var vid = videoLink.split('=')[1];
        
                var searchText1 = vid;
                var searchText2 = 'Watch-v=' + vid + '.youtube';
                var searchText = searchText1;
                EverythingGetJSON(searchText, function(json){
                    if (json) {
                        if (json["totalResults"] > 0) {
                            console.log('search: ' + searchText + '\n    exists local.');
                            thisElem.attr('local-check', 'checked');
                            elMetadataLine.addClass(cssName);
                            elMetadataLine.append(`<span class="inline-metadata-item style-scope ytd-video-meta-block ${cssName}">Local</span>`);

                        }
                    }
                });
            }
        });
    };

    var lastHref = '';


    if (Mjztool.matchUrlList(["/watch?"])) {

        setInterval(function(){
            if (lastHref != window.location.href) {
                lastHref = window.location.href;

                setTimeout(checkVideoItem, 3000);

                var qParams = getQueryParams();
                var vid = qParams['v'];
        
                var searchText1 =  vid;
                var searchText2 = 'Watch-v=' + vid + '.youtube';
        
                var titleEl = jQuery("#title");
        
                funcTitle(searchText1);
                funcTitle(searchText2);
            }
        }, 2000);

    }else{
        setInterval(checkVideoItem, 3000);
    }


    if (Mjztool.matchUrlList(["/watch?"])) {

    }


}



function butailing(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} span, .${cssName} h5 { color: green !important; }`;
    Mjztool.addStyle(css);

    var href = window.location.href;
    var hs = href.split('/');

    var funcTitle = function(doubanID, thisElem){
        var searchText = doubanID + '.movie.douban';
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    if (Mjztool.matchUrlList(["/mv/"])) {
        var doubanID = hs[4].replace('.html', '');
        var thisElem = jQuery(".info-title");
        funcTitle(doubanID, thisElem);

    }else if (Mjztool.matchUrlList(["/search.php", "/movie/"])) {
        setInterval(() => {
            var selector =  ".masonry_item > a";
            jQuery(selector).each(function(){
                var thisElem = jQuery(this);
                var aHref = thisElem.attr("href");
                var doubanID = aHref.split('/')[2].replace('.html', '');
                if (thisElem.hasClass(cssName) == false) {
                    funcTitle(doubanID, thisElem.parent());
                }
            });  
        }, 2000);

    }else{
        
    }
}

function lcsd_gov_hk(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} span, .${cssName} h5 { color: green !important; }`;
    Mjztool.addStyle(css);

    var href = window.location.href;
    var hs = href.split('/');

    var funcTitle = function(newspaperAndDate, thisElem){
        var searchText = newspaperAndDate;
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    var funcTitleEl = function(el, thisElem){
        var newspaperAndDate = el.text().trim();
        var searchText = newspaperAndDate;
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    if (Mjztool.matchUrlList(["/coverpage/"])) {
        var headerTitle = jQuery(".header-title");
        funcTitleEl(headerTitle, headerTitle);
        
        jQuery('.recommended_text_link').each(function(){
            var thisElem = jQuery(this);
            funcTitleEl(thisElem, thisElem);
        });  

    }else if (Mjztool.matchUrlList(["/search-result?"])) {
        setInterval(() => {
            var selector =  ".result-title > a";
            jQuery(selector).each(function(){
                var thisElem = jQuery(this);
                var newspaperAndDate = thisElem.text();
                if (thisElem.hasClass(cssName) == false) {
                    funcTitle(newspaperAndDate, thisElem);
                }
            });  
        }, 2000);

    }else{
        
    }
}


function cool18(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} span, .${cssName} h5 { color: green !important; }`;
    Mjztool.addStyle(css);

    var href = window.location.href;
    var hs = href.split('/');

    var params = getQueryParams();

    var funcTitle = function(searchText, thisElem){
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    var funcTitleEl = function(ahref, thisElem){
        var tid = ahref.split('tid=')[1];
        var searchText = tid + '.article.cool18';
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    if(Mjztool.matchURL('/bbs4/')){
        if (Mjztool.matchUrlList(["act=threadview"])) {
            var tid = params["tid"];
            var searchText = tid + '.article.cool18';
            var headerTitle = jQuery("body > table:nth-child(4) > tbody > tr:nth-child(2) > td > center > font > b");
            funcTitle(searchText, headerTitle);
            

        }else {
            setTimeout(() => {
                var selector =  "a";
                jQuery(selector).each(function(){
                    var thisElem = jQuery(this);
                    var ahref = thisElem.attr('href');
                    if (ahref.indexOf('tid=')  > 0) {
                        funcTitleEl(ahref, thisElem);
                    }
                });  
            }, 1000);

        }
    }
}

function Home34(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} span, .${cssName} h5 { color: green !important; }`;
    Mjztool.addStyle(css);

    var href = window.location.href;
    var hs = href.split('/');
    var params = getQueryParams();

    var funcTitleEl = function(bookTitle, thisElem){
        var bookName = bookTitle;
        bookName = bookName.replaceAll(/【.{2,5}】/g, '');
        bookName = bookName.replaceAll(/\[.{2,5}\]/g, '');
        bookName = bookName.replaceAll(/\(.*\)/g, '');
        bookName = bookName.replaceAll(/（.*）/g, '');
        bookName = bookName.replaceAll(/1.*篇.*/g, '');
        bookName = bookName.replaceAll(/1.*章.*/g, '');
        bookName = bookName.replaceAll(/1.*集.*/g, '');
        bookName = bookName.replaceAll(/1.*完.*/g, '');
        bookName = bookName.replaceAll(/1.*全.*/g, '');
        bookName = bookName.replaceAll(/全本/g, '');
        var searchText = bookName;
        console.log(searchText);

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    if (Mjztool.matchUrlList(["&tid="])) {
        var bookTitle = jQuery('#thread_subject').text();
        var headerTitle = jQuery("#postlist h1");
        funcTitleEl(bookTitle, headerTitle);
        
    }else {
        setTimeout(() => {
            var selector =  ".new a";
            jQuery(selector).each(function(){
                var thisElem = jQuery(this);
                var ahref = thisElem.attr('href');
                if (ahref && ahref.indexOf('&tid=')  > 0) {
                    var bookTitle = thisElem.text();
                    funcTitleEl(bookTitle, thisElem);
                }
            });  
        }, 1000);
    }
}

function laowang_vip(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} span, .${cssName} h5 { color: green !important; }`;
    css += '.jammer {    display: none !important;}';
    Mjztool.addStyle(css);

    var href = window.location.href;
    var hs = href.split('/');
    var params = getQueryParams();

    var funcTitleEl = function(bookTitle, thisElem){
        var bookName = bookTitle;
        bookName = bookName.replaceAll(/【.{2,5}】/g, '');
        bookName = bookName.replaceAll(/\[.{2,6}\]/g, '');
        bookName = bookName.replaceAll(/\(.*\)/g, '');
        bookName = bookName.replaceAll(/（.*）/g, '');
        bookName = bookName.replaceAll(/《/g, '');
        bookName = bookName.replaceAll(/》/g, '');
        bookName = bookName.replaceAll(/作者.*/g, '');
        bookName = bookName.replaceAll(/1.*篇.*/g, '');
        bookName = bookName.replaceAll(/1.*章.*/g, '');
        bookName = bookName.replaceAll(/1.*集.*/g, '');
        bookName = bookName.replaceAll(/1.*完.*/g, '');
        bookName = bookName.replaceAll(/1.*全.*/g, '');
        bookName = bookName.replaceAll(/全本/g, '');
        bookName = bookName.trim().split(' ')[0];
        var searchText = bookName.trim();
        console.log(searchText);

        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    if (Mjztool.matchUrlList(["&tid="])) {
        var bookTitle = jQuery('#thread_subject').text();
        var headerTitle = jQuery("#postlist h1");
        funcTitleEl(bookTitle, headerTitle);
        
    }else if (Mjztool.matchUrlList(["/search/"])) {
        setTimeout(() => {
            var selector =  "a";
            jQuery(selector).each(function(){
                var thisElem = jQuery(this);
                var ahref = thisElem.attr('href');
                if (ahref && ahref.indexOf('&tid=')  > 0) {
                    var bookTitle = thisElem.text();
                    bookTitle = bookTitle.trim().split(' ')[1];
                    funcTitleEl(bookTitle, thisElem);
                }
            });  
        }, 1000);

    }else {
        setTimeout(() => {
            var selector =  "a";
            jQuery(selector).each(function(){
                var thisElem = jQuery(this);
                var ahref = thisElem.attr('href');
                if (ahref && ahref.indexOf('&tid=')  > 0) {
                    var bookTitle = thisElem.text();
                    funcTitleEl(bookTitle, thisElem);
                }
            });  
        }, 1000);
    }
}

function EHentai(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} span, .${cssName} div { color: green !important; }`;
    Mjztool.addStyle(css);

    var href = window.location.href;

    var params = getQueryParams();

    var funcTitle = function(searchText, thisElem){
        EverythingGetJSON(searchText, function(json){
            if (json) {
                if (json["totalResults"] > 0) {
                    thisElem.addClass(cssName);
                }
            }
        });
    };

    var funcTitleEl = function(ahref, thisElem){
        ahref = ahref.replace('https://', '');
        var urlPaths = ahref.split('/');
        var searchText = '';
        if (ahref.indexOf('/g/')  > -1) {
            searchText = urlPaths[2] + '.' + urlPaths[3] + '.g.e-hentai';
        }
        
        if (searchText != '') { 
            console.log('search local file:' + searchText);
            EverythingGetJSON(searchText, function(json){
                if (json) {
                    if (json["totalResults"] > 0) {
                        thisElem.addClass(cssName);
                    }
                }
            });
        }

    };

    if (Mjztool.matchURL('/g/')) {
        var headerTitle = jQuery("#gd2 #gn");
        funcTitleEl(href, headerTitle);

    }else {
        setTimeout(() => {
            var selector =  "a";
            jQuery(selector).each(function(){
                var thisElem = jQuery(this);
                var ahref = thisElem.attr('href');
                if (ahref.indexOf('/g/')  > -1) {
                    funcTitleEl(ahref, thisElem);
                }
            });  
        }, 1000);

    }
}

function WNACG(){
    EverythingHttpRequest_LOG = false;
    var cssName = "Model_ExistsLocal_GreenColor";
    var css = `.${cssName}, .${cssName} span, .${cssName} div { color: green !important; }`;
    Mjztool.addStyle(css);

    var href = window.location.href;

    var params = getQueryParams();

    var funcTitleEl = function(ahref, thisElem){
        ahref = ahref.replace('https://', '');
        // var urlPaths = ahref.split('/');
        var searchText = '';
        
        var pID = ahref.match('/photos-index-aid-(.*).html');
        if (pID) {
            var photosID = pID[1];
            searchText = photosID + '.photos.wnacg';
        } 
        
        if (searchText != '') { 
            console.log('search local file:' + searchText);
            EverythingGetJSON(searchText, function(json){
                if (json) {
                    if (json["totalResults"] > 0) {
                        thisElem.addClass(cssName);
                    }
                }
            });
        }

    };

    if (Mjztool.matchURL('/photos-index-aid-')) {

        var headerTitle = jQuery("h2");
        funcTitleEl(href, headerTitle);

    }else {
        setTimeout(() => {
            var selector =  "a";
            jQuery(selector).each(function(){
                var thisElem = jQuery(this);
                var ahref = thisElem.attr('href');
                if (ahref.indexOf('.html')  > -1) {
                    funcTitleEl(ahref, thisElem);
                }
            });  
        }, 1000);
        
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
