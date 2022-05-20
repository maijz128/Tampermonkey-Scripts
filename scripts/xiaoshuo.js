// ==UserScript==
// @name         MJZ-小说网
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.shouda8.com/*
// @match        *://*.shouda88.com/*
// @match        *://*.shouda88.net/*
// @match        *://*.soshuba.com/*
// @match        *://*.soshuwu.com/*
// @match        *://*.guishuji.cc/*
// @match        *://*.ptwxz.com/*
// @match        *://*.kandashuw.com/*
// @match        *://*.22pq.com/*
// @match        *://*.biquduu.com/*
// @match        *://*.biquwx.la/*
// @match        *://*.biquge.com.cn/*
// @match        *://*.shuhuangge.org/*
// @match        *://m.tsnwb.org/*
// @match        *://*.xxbook.cc/*
// @match        *://*.shumil.co/*
// @match        *://*.xbiquge.so/*
// @match        *://*.xdingdian.com/*
// @match        *://*.kanmaoxian.com/*
// @match        *://*.kutun.net/*
// @match        *://*.sizhicn.com/*
// @match        *://*.230book.com/*
// @match        *://*.wubenshu.com/*
// @match        *://*.ggdownxs.cc/*
// @match        *://*.fun8.i-gamer.net/*
// @match        *://*.69shu.com/*
// @match        *://*.sinodan.cc/view/*
// @match        *://*.aabook.cc/*
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

var KEYS = { ENTER: 13, SPACE: 32, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, A: 65, D: 68, E: 69, F: 70, R: 82, S: 83, W: 87, Z: 90, Q: 81 };
var G = { UpVolume: KEYS.E, DownVolume: KEYS.D, PrevSong: KEYS.S, NextSong: KEYS.F, Pause: KEYS.SPACE, ToggleUI: KEYS.Q, ToggleList: KEYS.R };

var KeyDownHandle = function (keyCode) {return;};
var ShortcutKeys = {Next : null};  // {Next: "body > div.container > div > div.page1 > a:nth-child(4)"}


(function () {
    setTimeout(function () {
        main();
    }, 10);
})();

function main() {
    // init
    var timeout = 1000;
    ShortcutKeys = null;
    setTimeout(function () {
        onKeyDown();
    }, timeout);


    if (Mjztool.matchUrlList(["shouda88.com", "shouda8.com", "shouda88.net"])) {
        shouda8();
    }
    if (Mjztool.matchUrlList(["biquge.com.cn", "xbiquge.so", "xdingdian.com", "sizhicn.com", "230book.com"])) {
        biquge();
    }

    if (Mjztool.matchURL("soshuba.com")) { soshuba(); }
    if (Mjztool.matchURL("soshuwu.com")) {
        soshuwu();
    }
    if (Mjztool.matchURL("guishuji.cc")) {
        guishuji();
    }
    if (Mjztool.matchURL("ptwxz.com")) { ptwxz(); }
    if (Mjztool.matchURL("biquduu.com")) { biquduu(); }
    if (Mjztool.matchURL("m.tsnwb.org")) { tsnwb(); }
    if (Mjztool.matchURL("kandashuw")) {
        kandashuw();
    }
    if (Mjztool.matchURL("22pq")) {
        // pq22();
    }
    if (Mjztool.matchURL("biquwx.la")) { biquwx(); }
    if (Mjztool.matchURL("shuhuangge.org")) { shuhuangge(); }



    if (Mjztool.matchURL("xxbook.cc")) { xxbook(); }
    if (Mjztool.matchURL("shumil.co")) { shumil(); }
    if (Mjztool.matchURL("kanmaoxian.com")) { kanmaoxian(); }
    if (Mjztool.matchURL("kutun.net")) { kutun(); }
    if (Mjztool.matchURL("wubenshu.com")) { wubenshu(); }
    if (Mjztool.matchURL("ggdownxs.cc")) { ggdownxs(); }
    if (Mjztool.matchURL("fun8.i-gamer.net")) { i_gamer(); }
    if (Mjztool.matchURL("69shu.com")) { shu69(); }
    if (Mjztool.matchURL("sinodan.cc")) { sinodan(); }
    if (Mjztool.matchURL("aabook.cc")) { aabook(); }

}

function onKeyDown() {
    function isShortcutKey() {
        return true;
    }

    function notPressControlKey(e){
       return !(e.altKey || e.ctrlKey || e.shiftKey);        
    }

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && isShortcutKey() && notPressControlKey(e)) {
            handleKeyDown(e.keyCode);
        }
    };
}

function handleKeyDown(keyCode) {
    KeyDownHandle(keyCode);

    if (ShortcutKeys) {
        if (keyCode == KEYS.D || keyCode == KEYS.RIGHT) {
            console.log(keyCode + ": Next");
            // var seletor = "div.page1 > a:nth-child(4)";
            var selector = ShortcutKeys.Next;
            var btn = document.querySelector(selector);
            if (btn) {
                // eventFire(btn, 'click');
                btn.click();
            }
        }
    }else {
        console.log("ShortcutKeys == null");
    }
    

    switch (keyCode) {
        case G.UpVolume:
            // fireKeyEvent(player_main, "keydown", KEYS.UP);
            break;

        case G.DownVolume:
            // fireKeyEvent(player_main, "keydown", KEYS.DOWN);
            break;

        case G.PrevSong:
            // fireKeyEvent(player_main, "keydown", KEYS.LEFT);
            break;

        case G.NextSong:
            //console.log(keyCode + ": NextSong");
            //fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
            // var btn = document.querySelector('.main-control-wrapper .main-control .next');
            // if(btn){
            //     eventFire(btn, 'click');
            // }
            break;

        case G.Pause:
            console.log(keyCode + ": PauseSong");
            // fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
            // var btn = document.querySelector('.main-control-wrapper .main-control .play-btn');
            // if(btn){
            //     eventFire(btn, 'click');
            // }
            break;
        default:
            break;
    }
}

/***************************************************************************/



function aabook() {
    var css = ".page_main{ font-family: 微软雅黑, 宋体;  FONT-SIZE: 26px;  line-height: 2em; text-indent: 2em;}";
    css += "#wrap{ background-color: rgb(230, 230, 221) !important; width: 70%;}";
    css += ".chapter_con p{font-family: 微软雅黑, 宋体 !important;  FONT-SIZE: 26px !important; }";
    css += "#totop, .side_btn{opacity: .1;}";
    css += ".page_main img{ display: none; }";
  
    Mjztool.addStyle(css);
}

function sinodan() {
    // ShortcutKeys = {Next: "div.page1 > a:nth-child(4)"};

    var css = "#nr1{ font-family: 微软雅黑, 宋体;  FONT-SIZE: 26px;  line-height: 2em; text-indent: 2em;}";
    css += "#nr1 {padding: 20px; margin: 0 auto; width: 800px; color: #333;}";
    css += ".chapter .mod-page .page-content p{color:#666 !important; font-size: 10px !important;}";
    css += "#nr1 > font {color: #666 !important; font-size: 10px !important;}";
    Mjztool.addStyle(css);

    var words = {
        "本章未完": "", 
    };
    var content = $("#nr1")[0];
    replaceNodeText(content, words);
    // var words2 = ["本章未完", ];
    // text = removeText(text, words2);
}

// 笔趣阁
function biquge() {
    Mjztool.addStyle(".bottem2 a, .bottem a {  font-size: 28px !important; }");
    Mjztool.addStyle("#content { font-size: 30px !important;  letter-spacing: 2px !important; line-height: 2em; }");
    Mjztool.addStyle(".reader_mark0, .reader_mark1 {  display: none !important; }");
    Mjztool.addStyle(".box_con, #box_con {  border: initial !important; }");
    Mjztool.addStyle("#book, .listmain {  border: initial !important; }");
    Mjztool.addStyle(".book, .listmain {  border: initial !important; }");


    var text = $("#content").html();
    var words = {
        "收藏(www.shumil.com)": "",
    };
    var words2 = ["书趣阁_笔趣阁手机版阅读网址：m.sizhicn.com", "请记住本书首发域名：www.sizhicn.com。", "笔趣阁 www.xbiquge.so，最快更新夺舍之停不下来 ！", "天才一秒记住本站地址：www.xdingdian.com。新顶点小说手机版阅读网址：m.xdingdian.com", "【收集免费好书】关注v", "x【书友大本营】推荐你喜欢的小说", "领现金红包！"];
    words2.push(window.location.href);
    text = removeText(text, words2);
    text = replaceText(text, words);
    $("#content").html(text);
}



// 搜书吧
function shouda8() {
    var css1 = ".toolbar .tbox{background: gray;} .toolbar{opacity: 0.05;} .toolbar:hover{opacity: 1;}";
    Mjztool.addStyle(css1);

    //Mjztool.addStyle(".kfyd, .bread-crumb-nav{background: #cedce0;}");
    Mjztool.addStyle(".kfyd, .bread-crumb-nav{background-color: rgb(204, 232, 207);}");

    Mjztool.addStyle("#content p:nth-last-child(1){display: none;}");

    var text = $("#content").html();
    var words = {
        "张志平": "张平",
        "ｒｕ": "乳",
        "ＮＶ": "女",
        "ｌｕｏ": "裸",
        "ｙｕ": "欲",
        "ｘｉｏｎｇ": "胸",
        "ｃｈｕａｎｇ": "床",
        "ｓｅ": "色",
        "ai昧": "暧昧",
        "大xiong": "大胸",
        "cao之国": "草之国",
        "cao忍": "草忍",
        "酥xiong": "酥胸",
        "胸bu": "胸部",
        "绿sei": "绿色"
    };
    text = replaceText(text, words);
    $("#content").html(text);
}

// 搜书吧
function soshuba() {

}

function soshuwu() {
    Mjztool.addStyle(".content p{display: none;}");

    var text = $(".content").html();
    var words = "查找最新章节！";
    var index = text.indexOf(words);
    text = text.slice(index + words.length);
    $(".content").html(text);
}

//  鬼书集
function guishuji() {
    Mjztool.addStyle(".article #BookText{ font-size: 24px; line-height: 200%;}");

}

//  飘天文学
function ptwxz() {
    ShortcutKeys = {Next:  "#main > div.bottomlink > a:nth-child(6)"};

    var css = "#content{ font-family: 微软雅黑, 宋体;  FONT-SIZE: 26px;  line-height: 2em; text-indent: 2em;}"
    css+= "#content > table{display: none;}";
    css += ".toplink a{color: #666 !important;}";
    Mjztool.addStyle(css);
    
    // var content = $(".txtnav")[0];
    // replaceNodeText(content, words);
    
    /*
    KeyDownHandle = function (keyCode) {
        if (keyCode == KEYS.D || keyCode == KEYS.RIGHT) {
            console.log(keyCode + ": Next");
            var seletor = "#main > div.bottomlink > a:nth-child(6)";
            var btn = document.querySelector(seletor);
            if (btn) {
                // eventFire(btn, 'click');
                btn.click();
            }
            // fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
        }
    };
    */
}

//  69shu.com
function shu69() {
    ShortcutKeys = {Next: "div.page1 > a:nth-child(4)"};

    var css = "#content{ font-family: 微软雅黑, 宋体;  FONT-SIZE: 26px;  line-height: 2em; text-indent: 2em;}"
    //Mjztool.addStyle(css);

    var words = {
        "露.胸": "露胸", "性.感": "性感", "偷.看": "偷看", "胸.脯": "胸脯","色-鬼": "色鬼", "屁.gu": "屁股",
        "丰.满": "丰满", "性-感": "性感", "禽-兽": "禽兽", "肉-感": "肉感", "饱-满": "饱满", "屁-股": "屁股", 
        "刺-激": "刺激", "挑-逗": "挑逗", "艳-妇": "艳妇", "后-庭": "后庭", 
    };
    var content = $(".txtnav")[0];
    replaceNodeText(content, words);

    // var words2 = ["＋杂∽志∽虫＋", ];
    // text = removeText(text, words2);

}

//  图书鸟
function tsnwb() {
    Mjztool.addStyle("#novelcontent { padding: 0 10px; font-size: 26px !important; line-height: 2em; text-indent: 2em;}");
    // Mjztool.addStyle("#main #content{ font-family: 微软雅黑, 宋体;  FONT-SIZE: 26px;  line-height: 2em; text-indent: 2em;}");

    var text = $("#novelcontent").html();
    var words = {
        "龙腾小说网提供": "",
    };
    text = replaceText(text, words);
    $("#novelcontent").html(text);
}

function kandashuw() {
    Mjztool.addStyle("#content { font-size: 26px !important; letter-spacing: 0.1em !important; line-height: 2em; text-indent: 2em;}");
    // Mjztool.addStyle("#main #content{ font-family: 微软雅黑, 宋体;  FONT-SIZE: 26px;  line-height: 2em; text-indent: 2em;}");

    var text = $("#content").html();
    var words = {
        "本章未完，点击[ 下一页 ]继续阅读--&gt;&gt;": "",
    };
    text = replaceText(text, words);
    text = text.replace(/\｀/g, "");
    $("#content").html(text);
}

function pq22() {
    Mjztool.addStyle("#content { font-size: 26px !important; letter-spacing: 0.1em !important; line-height: 2em; }");
    // Mjztool.addStyle("#content { font-size: 26px !important; letter-spacing: 0.1em !important; line-height: 2em; text-indent: 2em;}");
    // Mjztool.addStyle("#main #content{ font-family: 微软雅黑, 宋体;  FONT-SIZE: 26px;  line-height: 2em; text-indent: 2em;}");

    var text = $("#content").html();
    var words = {
        "本章未完，点击[ 下一页 ]继续阅读--&gt;&gt;": "",
    };
    text = replaceText(text, words);
    text = text.replace(/\｀/g, "");
    $("#content").html(text);
}


function biquwx() {

    Mjztool.addStyle("div.content_read > div > div:nth-child(4) {  display: none; }");
    Mjztool.addStyle(".bottem a {  font-size: 28px !important; }");
    Mjztool.addStyle(".reader_mark1 a, .reader_mark0 a {  display: none !important; }");
    Mjztool.addStyle(".box_con {  border: initial !important; }");
    Mjztool.addStyle("#center_tip {  color: initial !important; }");

    Mjztool.addStyle("#content {  letter-spacing: 0.1em !important; line-height: 2em; }");

    var text = $("#content").html();
    var words = {
        "本章未完，点击[ 下一页 ]继续阅读--&gt;&gt;": "",
    };
    text = replaceText(text, words);
    $("#content").html(text);
}



function shuhuangge() {

    Mjztool.addStyle(".bottem2 a {  font-size: 28px !important; }");
    Mjztool.addStyle("#content {  letter-spacing: 0.1em !important; line-height: 2em; }");

    var text = $("#content").html();
    var words = {
        "本章未完，点击[ 下一页 ]继续阅读--&gt;&gt;": "",
    };
    text = replaceText(text, words);

    var n = text.lastIndexOf("<br>");
    text = text.slice(0, n);
    $("#content").html(text);
}

function biquduu() {

    Mjztool.addStyle(".bottem2 a {  font-size: 28px !important; }");
    Mjztool.addStyle("#content {  letter-spacing: 0.1em !important; line-height: 2em; }");

    var text = $("#content").html();
    var words = {
        "最新全本：、、、、、、、、、、": "",
    };
    text = replaceText(text, words);

    var n = text.lastIndexOf("<br>");
    text = text.slice(0, n);
    $("#content").html(text);
}


function xxbook() {
    var css1 = ".entry-content p{font-size: 28px !important; line-height: 2em; } ";
    // css1 += "letter-spacing: 0.1em !important; ";
    Mjztool.addStyle(css1);

    var text = $(".entry-content").html();
    var words = {
        "(xxxnovel.com)】": "",
        "【本文转载自": "",
        "超爽文学网": "",
        "(xxxnovel.com)】乳头也不给你吃！”然后发出酣息的声音。": "",
    };
    text = replaceText(text, words);
    $(".entry-content").html(text);
}


function shumil() {
    var css1 = "#content p{font-size: 30px !important; line-height: 2em !important; } ";
    // css1 += "letter-spacing: 0.1em !important; ";
    css1 += "#content center {display: none !important;}";
    css1 += "#content p a {display: none !important;}";
    css1 += "#content .title a {font-size: 20px;     margin: 0 4px;}";
    Mjztool.addStyle(css1);

    var text = $("#content").html();
    var words = {
        "收藏(www.shumil.com)": "",
        "收藏(www.shumil.com)": "",
        "最快更新，无弹窗阅读请": "",
        "书迷楼": "",
        "书迷楼最快更新，无弹窗阅读请": "",
        "收藏书迷楼(www.shumil.com)": "",
    };
    var words2 = ["（）", "请大家搜索（书迷楼）看最全！更新最快的小说", "收藏(www.shumil.com)", "收藏(www.shumil.com)", "最快更新，无弹窗阅读请", "书迷楼", "书迷楼最快更新，无弹窗阅读请", "收藏书迷楼(www.shumil.com)"];
    text = removeText(text, words2);
    text = replaceText(text, words);
    $("#content").html(text);
}

// 看毛线
function kanmaoxian() {
    var css1 = ".yd_text2 {font-size: 30px !important; line-height: 2em !important; } ";
    // css1 += "letter-spacing: 0.1em !important; ";
    Mjztool.addStyle(css1);

    var text = $(".yd_text2").html();
    var words = {
        "收藏(www.shumil.com)": "",
    };
    var words2 = ["塵?緣?文?學?網", "看.毛.线.中.文.网", "看1毛线3中文网", "看‘毛.线、中.文、网", "看。毛线、中文网", "www.kanmaoxian.com", "wap.kanmaoxian.com", "kanmaoxian.com", "看1毛2线3中文网"];
    text = removeText(text, words2);
    text = replaceText(text, words);
    $(".yd_text2").html(text);
}

// 酷豚小说
function kutun() {
    var css1 = "#chapter_content {font-size: 30px !important; line-height: 2em !important; } ";
    css1 += "#chapter_content { font-family: 微软雅黑, 宋体 !important; } ";
    // css1 += "letter-spacing: 0.1em !important; ";
    css1 += ".layui-main {width: auto !important;}";
    css1 += ".search, .header {opacity: 0 !important;}";
    css1 += ".search:hover, .header:hover {opacity: 1 !important;}";
    Mjztool.addStyle(css1);

    var text = $("#chapter_content").html();
    var words = {
        "收藏()": "",
    };
    var words2 = ["＋杂∽志∽虫＋", ];
    text = removeText(text, words2);
    text = replaceText(text, words);
    $("#chapter_content").html(text);
}

// 五本书
function wubenshu() {
    var css1 = "#content {font-size: 28px !important; line-height: 2em !important; } ";
    css1 += "#content { font-family: 微软雅黑, 宋体 !important; } ";
    Mjztool.addStyle(css1);

    var text = $("#content").html();
    var words = {
        "收藏()": "",
    };
    var words2 = ["＋杂∽志∽虫＋", ];
    text = removeText(text, words2);
    text = replaceText(text, words);
    $("#content").html(text);
}

// 炼金手记-小鸽哥新书-格格党-萌妹子最喜欢的小说网！
function ggdownxs() {
    var css1 = "#mlfy_main_text {font-size: 28px !important; line-height: 2em !important; } ";
    // css1 += "#mlfy_main_text { font-family: 微软雅黑, 宋体 !important; } ";
    Mjztool.addStyle(css1);

    var text = $("#mlfy_main_text").html();
    var words = {
        "收藏()": "",
    };
    var words2 = ["＋杂∽志∽虫＋", ];
    text = removeText(text, words2);
    text = replaceText(text, words);
    $("#mlfy_main_text").html(text);
}

function i_gamer() {
    var css1 = "#ChSize {font-size: 28px !important; line-height: 2em !important; } ";
    // css1 += "#mlfy_main_text { font-family: 微软雅黑, 宋体 !important; } ";
    css1 += "body > table > tbody > tr:nth-child(2) > td:nth-child(1) { margin-left: 150px; position: absolute; } ";
    Mjztool.addStyle(css1);

    var text = $("#ChSize").html();
    var words = {
        "收藏()": "",
    };
    var words2 = ["＋杂∽志∽虫＋", ];
    text = removeText(text, words2);
    text = replaceText(text, words);
    $("#ChSize").html(text);
}




/*****************************************************************************************/

function replaceNodeText(content, words){
    for (var i = 0; i < content.childNodes.length; i++) {
        var element = content.childNodes[i];
        if (element.nodeName == "#text") {
            element.nodeValue = replaceText(element.nodeValue, words);
        }
    }
}

function replaceText(text, words) {
    for (var key in words) {
        text = text.replaceAll(key, words[key]);
    }
    return text;
}

function removeText(text, words) {
    for (var key in words) {
        text = text.replaceAll(words[key], "");
    }
    return text;
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

// Usage: fireKeyEvent(input元素, 'keydown', 13);  
// http://blog.csdn.net/lovelyelfpop/article/details/52471878
function fireKeyEvent(el, evtType, keyCode) {
    var doc = el.ownerDocument;
    var win = doc.defaultView || doc.parentWindow,
        evtObj;
    if (doc.createEvent) {
        if (win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent(evtType, true, true, win, false, false, false, false, keyCode, 0);
        } else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
                get: function () {
                    return this.keyCodeVal;
                }
            });
            Object.defineProperty(evtObj, 'which', {
                get: function () {
                    return this.keyCodeVal;
                }
            });
            evtObj.initUIEvent(evtType, true, true, win, 1);
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    } else if (doc.createEventObject) {
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}

function eventFire(el, eType) {
    if (el.fireEvent) {
        el.fireEvent('on' + eType);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(eType, true, false);
        el.dispatchEvent(evObj);
    }
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
Mjztool.matchUrlList = function (list) {
    var URL = window.location.href;
    for (var index = 0; index < list.length; index++) {
        var url = list[index];
        if (URL.indexOf(url) > -1) {
            return true;
        }
    }
    return false;
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