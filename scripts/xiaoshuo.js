// ==UserScript==
// @name         MJZ-小说网
// @namespace    https://github.com/maijz128
// @version      24.10.20
// @description  描述
// @author       MaiJZ
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
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
// @match        *://*.biquge40.com/*
// @match        *://*.beqege.cc/*
// @match        *://*.yanqingshu.com/*
// @match        *://*.biqiudu.com/*
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
// @match        *://*.uukanshu.com/*
// @match        *://*.aixdzs.com/*
// @match        *://*.uuxs.tw/*
// @match        *://m.feiszw.com/*
// @match        *://qbtr.cc/*
// @match        *://*.fansg.cc/*
// @match        *://*.xqb5.org/*
// @match        *://*.sis001.com/*
// @match        *://*.siluke.com/*
// @match        *://*.shuquzw.com/*
// @match        *://*.ddxs.com/*
// @match        *://*.dwxdwx.com/*
// @match        *://*.vodtw.com/*
// @match        *://*.shuyyw.cc/*
// @match        *://*.sto520.com/*
// @match        *://*.mayiwxw.com/*
// @match        *://*.sp90.org/*
// @match        *://*.neat-reader.cn/*
// @match        *://*.zhaikangpei.com/*
// @match        *://*.23qb.net/*
// @match        *://*.ranwen.la/*
// @match        *://*.45xs.com/*
// @match        *://*.penghe.net/*
// @match        *://*.sjks88.com/*
// @match        *://*.xbyuan.com/*
// @match        *://*.xn--fiq228cu93a4kh.com/*
// @match        *://*.shuhaige.net/*
// @match        *://*.38xs.com/*
// @match        *://*.51eshu.com/*
// ==/UserScript==

var KEYS = { ENTER: 13, SPACE: 32, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, A: 65, D: 68, E: 69, F: 70, R: 82, S: 83, W: 87, Z: 90, Q: 81 };
var G = { UpVolume: KEYS.E, DownVolume: KEYS.D, PrevSong: KEYS.S, NextSong: KEYS.F, Pause: KEYS.SPACE, ToggleUI: KEYS.Q, ToggleList: KEYS.R, NextPage: KEYS.F };

var KeyDownHandle = function (keyCode) {return;};
var ShortcutKeys = {Next : null};  // {Next: "body > div.container > div > div.page1 > a:nth-child(4)"}
var Font_Color_Style = "color: #3C3C3C !important; font-size: 28px !important; line-height: 1.8 !important; font-family: 微软雅黑, 宋体 !important; letter-spacing: 0.05em !important; text-align: justify !important; text-shadow: 0 0 1.15px #fcf6ecd9, 0 0 1px #7b7b7b, 0 0 0.75px #65625e57 !important;";
// Font_Color_Style += "text-indent: 2em !important;";
var Background_Color_Style = "background-color: rgb(228, 235, 241) !important;";


(function () {
    window.clearTimeout = window.clearTimeout.bind(window);
    window.clearInterval = window.clearInterval.bind(window);
    window.setTimeout = window.setTimeout.bind(window);
    window.setInterval = window.setInterval.bind(window);
    setTimeout(function(){ main(); }, 10);
})();

function main() {
    // init
    var timeout = 1000;
    ShortcutKeys = null;
    setTimeout(function () {
        onKeyDown();
    }, timeout);

    if (Mjztool.matchURL('m.') && Mjztool.matchURL('.html')) {
        var css = '';
        css += '#info .tui a {   font-size: 16px !important;     margin: 0 6px !important;     line-height: 1.5em !important; }';
        css += '';
        Mjztool.addStyle(css);
    }

    if (Mjztool.matchUrlList(["shouda88.com", "shouda8.com", "shouda88.net"])) {
        shouda8();
    }
    if (Mjztool.matchUrlList(["yanqingshu.com", "sp90.org", "mayiwxw.com", "biqiudu.com", "biquge.com.cn", "xbiquge.so", "xdingdian.com", "sizhicn.com", "230book.com", "uuxs.tw", "beqege.cc"])) {
        biquge();
    }

    if (Mjztool.matchURL("soshuba.com")) { soshuba(); }
    if (Mjztool.matchURL("soshuwu.com")) { soshuwu(); }
    if (Mjztool.matchURL("guishuji.cc")) { guishuji(); }
    if (Mjztool.matchURL("ptwxz.com")) { ptwxz(); }
    if (Mjztool.matchURL("biquduu.com")) { biquduu(); }
    if (Mjztool.matchURL("m.tsnwb.org")) { tsnwb(); }
    if (Mjztool.matchURL("kandashuw")) { kandashuw(); }
    // if (Mjztool.matchURL("22pq")) { // pq22(); }
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
    if (Mjztool.matchURL("uukanshu.com")) { uukanshu(); }    // UU看书网
    if (Mjztool.matchURL("aixdzs.com")) { aixdzs(); }       // 爱下电子书
    if (Mjztool.matchURL("feiszw.com")) { feiszw(); }       // 飞速中文网
    if (Mjztool.matchURL("qbtr.cc")) { qbtr(); }       // 全本同人小说
    if (Mjztool.matchURL("fansg.cc")) { fansg(); }       // 翻书阁
    if (Mjztool.matchURL("xqb5.org")) { xqb5(); }       // 全本小说网
    if (Mjztool.matchURL("sis001.com")) { sis001(); }    
    if (Mjztool.matchUrlList(["siluke.com", "shuquzw.com"])) { siluke(); }    
    if (Mjztool.matchUrlList(["ddxs.com"])) { ddxs(); }       //顶点小说网
    if (Mjztool.matchUrlList(["dwxdwx.com"])) { dwxdwx(); }       
    if (Mjztool.matchUrlList(["vodtw.com"])) { vodtw(); }       // 品书小说网
    if (Mjztool.matchUrlList(["shuyyw.cc"])) { shuyyw(); }       // 丫丫电子书
    if (Mjztool.matchUrlList(["sto520.com"])) { sto520(); }       // 思兔阅读
    if (Mjztool.matchUrlList(["zhaikangpei.com"])) { zhaikangpei(); }       
    // if (Mjztool.matchUrlList(["neat-reader.cn"])) { NeatReader(); }      
    if (Mjztool.matchUrlList(["23qb.net"])) { net_23qb(); }       
    if (Mjztool.matchUrlList(["ranwen.la"])) { ranwen(); }       
    if (Mjztool.matchUrlList(["45xs.com"])) { com_45xs(); }       
    if (Mjztool.matchUrlList(["penghe.net"])) { penghe(); }       
    if (Mjztool.matchUrlList(["sjks88.com"])) { sjks88(); }       
    if (Mjztool.matchUrlList(["xbyuan.com"])) { xbyuan(); }       
    if (Mjztool.matchUrlList(["xn--fiq228cu93a4kh.com"])) { feixs(); }       
    if (Mjztool.matchUrlList(["shuhaige.net"])) { shuhaige(); }       
    if (Mjztool.matchUrlList(["38xs.com", '51eshu.com'])) { com_38xs(); }       
   
    
}

function onKeyDown() {
    function isShortcutKey() {
        return true;
    }

    function notPressControlKey(e){
       return !(e.altKey || e.ctrlKey || e.shiftKey);        
    }

    window.addEventListener('keydown', function(event){
         var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && isShortcutKey() && notPressControlKey(e)) {
            handleKeyDown(e.keyCode);
        }
    }, false);
}

function handleKeyDown(keyCode) {
    KeyDownHandle(keyCode);

    if (ShortcutKeys) {
        if (keyCode == KEYS.D || keyCode == KEYS.RIGHT || keyCode == G.NextPage) {
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
    css += ".side_btn{left: 90%;}";
    css += "#totop, .side_btn{opacity: 0.1; }";
    css += "#totop:hover, .side_btn:hover{opacity: 1;}";
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
    Mjztool.addStyle(".bottem2, .bottem{  margin-top: 40px !important; }");
    Mjztool.addStyle(".bottem2 a, .bottem a {  font-size: 16px !important; }");
    // Mjztool.addStyle("#content { font-size: 30px !important;  letter-spacing: 2px !important; line-height: 2em; }");
    Mjztool.addStyle(".reader_mark0, .reader_mark1 {  display: none !important; }");
    Mjztool.addStyle(".box_con, #box_con {  border: initial !important; }");
    Mjztool.addStyle("#book, .listmain {  border: initial !important; }");
    Mjztool.addStyle(".book, .listmain {  border: initial !important; }");
    Mjztool.addStyle("#tbox { opacity: 0 !important; }");
    Mjztool.addStyle("#tbox:hover { opacity: 1 !important; }");

    var css1 = "";
    // css1 += "#content a, .content a {  display: none !important;  } ";
    css1 += "#content, .content { " + Font_Color_Style +  Background_Color_Style +" } ";
    css1 += "#content p, .content p { " + Font_Color_Style +  Background_Color_Style +" } ";
    css1 += "html, body { " +  Background_Color_Style +" } ";

   
    var selector = "#content";
    var text = $("#content").html();
    var wordsReplace = {
        "收藏(www.shumil.com)": "",
    };
    var wordsRemove = ["一秒记住ｍ．biqiudu．com", "书趣阁_笔趣阁手机版阅读网址：m.sizhicn.com", "请记住本书首发域名：www.sizhicn.com。", "笔趣阁 www.xbiquge.so，最快更新夺舍之停不下来 ！", "天才一秒记住本站地址：www.xdingdian.com。新顶点小说手机版阅读网址：m.xdingdian.com", "【收集免费好书】关注v", "x【书友大本营】推荐你喜欢的小说", "领现金红包！"];
    wordsRemove.push(window.location.href);


    if (Mjztool.matchURL("biqiudu.com")) {
        ShortcutKeys= {Next : "#box_con > div:nth-child(6) > a.next"};
    }else if(Mjztool.matchURL("mayiwxw.com")){
        ShortcutKeys= {Next : "div.content_read div.bottem2 > a:nth-child(4)"};
    }else if(Mjztool.matchURL("sp90.org")){
        ShortcutKeys= {Next : "#pb_next"};
        css1 += ".Readpage a {  display: inline !important;  } ";
        css1 += "#chaptercontent { " + Font_Color_Style +  Background_Color_Style +" } ";
        selector = "#chaptercontent";
        wordsRemove.push("请收藏本站：https://www.sp90.org。笔趣阁手机版：https://m.sp90.org");
    }else if(Mjztool.matchURL("yanqingshu.com")){
        ShortcutKeys= {Next : "#book > div.content > div.page_chapter > ul > li:nth-child(3) > a"};
        selector = "#content";
        css1 +=  ".content h1 {font-size: 22px !important; color: initial !important;}";
        wordsReplace["        "] = " 　　";
        wordsReplace["    "] = " 　　";
        
    }


    Mjztool.addStyle(css1);
    ContentChnage(selector, wordsRemove, wordsReplace);


    AD_Checker();

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

    if (Mjztool.matchURL("/html/")) {
        Mjztool.addStyle(css);
    }
}

//  69shu.com
function shu69() {
    ShortcutKeys = {Next: "div.page1 > a:nth-child(4)"};

    var css = "#content{ " + Font_Color_Style +"}";
    css += "body, .mybox {" + Background_Color_Style + "}";
    Mjztool.addStyle(css);

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

function uukanshu() {
    if (Mjztool.matchURL("tw.uukanshu.com")) {
        var url = window.location.href;
        url = url.replace("tw.", "");
        window.location.href = url;
        return;
    }

    var css1 = ".contentbox p { " + Font_Color_Style + " } ";
    Mjztool.addStyle(css1);

    var wordsReplace = {
        "尽在UU看书！": "",
    };
    var wordsRemove = ["点击下载本站APP,海量小说，免费畅读！"];
    ContentChnage("#content", wordsRemove, wordsReplace);

    var jieshao_title = $(".jieshao_content h1 a");
    if (jieshao_title) {
        jieshao_title.text(jieshao_title.text().replace("最新章节", ""));
    }

    AD_Checker();
}

// 爱下电子书
function aixdzs() {
    var css1 = ".content p { " + Font_Color_Style + " } ";
    css1 += ".content { width: 800px !important; } ";
    css1 += ".content p {margin-block-start: 0.5em !important; margin-block-end: 0.5em !important;} ";

    css1 += ".b_name, .b_info, .b_intro { font-size: 14px !important;}";
    css1 += ".link { border: initial !important; background: initial !important; }";
    css1 += ".chapter a { color: #337ab7 !important; } .chapter a:visited { color: #999 !important; }";
    css1 += "#back-to-top { opacity: 0 !important; } #back-to-top:hover { opacity: 1 !important; }";

    Mjztool.addStyle(css1);

    var wordsReplace = {
        "long": "龙",  "chuang": "床", "zui": "嘴", "xiong": "胸", "蓝**法阵": "蓝色魔法阵", "蓝**力": "蓝色魔力",
    };
    var wordsRemove = ["言情小说网", "小书亭", "热门推荐：", "番茄免费阅读小说", "新笔趣阁", "笔趣阁"
                    ,"UU看书欢迎广大书友光临阅读，最新、最快、最火的连载作品尽在UU看书！手机用户请到阅读。"
                    ,"https://", "天才一秒记住本站地址：。手机版阅读网址：", "，更多好看小说免费阅读。"
                    ,"书阅屋"
                ];

    ContentChnage(".content", wordsRemove, wordsReplace);

    ShortcutKeys= {Next : "#syno-nsc-ext-gen3 > div:nth-child(3) > a:nth-child(3)"};

    AD_Checker();
}

// 飞速中文网
function feiszw() {
    var css1 = "#nr p { " + Font_Color_Style + " } ";
    css1 += "body, #nr, #crumb {" + Background_Color_Style + "}";
    css1 += "body { background: initial; }";
    css1 += "#nr {width: 80%; margin: auto; }";
    css1 += "#crumb {position: initial !important;     width: 96% !important;}";
    css1 += "#nr_body > div:nth-child(4) {display: none;}";
    Mjztool.addStyle(css1);

    document.body.style = "";
    document.getElementById("crumb").style = "";

    var text = $("#nr").html();
    var wordsReplace = {
        "收藏()": "",
    };
    if (document.title.indexOf("漫威DC之混蛋英雄") > -1) {
        wordsReplace = { "‘": "“", "’": "”"};
    }

    var wordsRemove = ["内容不全？请换个浏览器试试(推荐使用谷歌浏览器)~"];
    text = removeText(text, wordsRemove);
    text = replaceText(text, wordsReplace);
    $("#nr").html(text);

    ShortcutKeys= {Next : "#nr_botton > div > a:nth-child(4)"};
}

// 全本同人小说
function qbtr() {
    var css1 = ".read_chapterDetail p { " + Font_Color_Style + " } ";
    css1 += ".read_chapterDetail {width: 80%; margin: auto;}";
    css1 += "#readContent_set {" + Background_Color_Style + "}";
    Mjztool.addStyle(css1);

    var text = $(".read_chapterDetail").html();
    var wordsReplace = {
        "收藏()": "",
    };
    var wordsRemove = [ "╱╲速╲╱文╲"];
    text = removeText(text, wordsRemove);
    text = replaceText(text, wordsReplace);
    $(".read_chapterDetail").html(text);

    ShortcutKeys= {Next : "#readContent_set > div.readDetail > div.pageNav > a:nth-child(3)"};
}

// 翻书阁
function fansg() {
    var css1 = "#BookText p { " + Font_Color_Style + " } ";
    css1 += ".articlebtn a {    color: #ccc !important;}";
    css1 += ".clg {display: none !important;}";
    css1 += ".gobacktop {opacity: 0 !important;} .gobacktop:hover {opacity: 0.6 !important;}";
    Mjztool.addStyle(css1);

    var text = $("#BookText").html();
    var wordsReplace = {
        "收藏()": "",
    };
    var wordsRemove = [ "╱╲速╲╱文╲"];
    text = removeText(text, wordsRemove);
    text = replaceText(text, wordsReplace);
    $("#BookText").html(text);

    ShortcutKeys= {Next : "#syno-nsc-ext-gen3 > div.auto.wrapper > div:nth-child(1) > div:nth-child(5) > a:nth-child(4)"};
}

// 全本小说网
function xqb5() {
    var css1 = "#booktxt p { " + Font_Color_Style + " } ";
    css1 += "html {" + Background_Color_Style + "}";
    css1 += ".box_con, .bottem1, .bottem2  { border: none !important; background-color: initial !important;}";
    css1 += "#headset {display: none !important;}";
    css1 += ".bottem1 a, .bottem2 a {border: none; color: inherit !important;}";
    css1 += "#syno-nsc-ext-gen3 > article > div:nth-child(6) > a:nth-child(1), #syno-nsc-ext-gen3 > article > div:nth-child(6) > a:nth-child(2), #syno-nsc-ext-gen3 > article > div:nth-child(4) > a {color: darkgray !important; font-size: 10px  !important;}";
    css1 += ".gotop {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    Mjztool.addStyle(css1);

    var text = $("#booktxt").html();
    var wordsReplace = {
        "收藏()": "",
    };
    var wordsRemove = ["╱╲速╲╱文╲"];
    text = removeText(text, wordsRemove);
    text = replaceText(text, wordsReplace);
    $("#booktxt").html(text);

    ShortcutKeys= {Next : "#next_url"};
}


// sis001
function sis001() {
    var css1 = ".t_msgfont, .t_msgfont td { font-size: 24px !important; } ";
    // css1 += "html {" + Background_Color_Style + "}";
    // css1 += ".bottem1 a, .bottem2 a {border: none; color: inherit !important;}";
    // css1 += ".gotop {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    Mjztool.addStyle(css1);

    // var text = $("#booktxt").html();
    // var wordsReplace = {
    //     "收藏()": "",
    // };
    // var wordsRemove = ["╱╲速╲╱文╲"];
    // text = removeText(text, wordsRemove);
    // text = replaceText(text, wordsReplace);
    // $("#booktxt").html(text);

    // ShortcutKeys= {Next : "#next_url"};
}

// 思路客
function siluke() {
    var css1 = "#content, #content p { " + Font_Color_Style + " } ";
    css1 += "html {" + Background_Color_Style + "}";
    // css1 += ".box_con, .bottem1, .bottem2  { border: none !important; background-color: initial !important;}";
    css1 += "#wzsy {display: none !important;}";
    css1 += "#link > a:nth-child(3) {margin-left: 120px !important; margin-right: 60px !important;}";
    // css1 += ".bottem1 a, .bottem2 a {border: none; color: inherit !important;}";
    // css1 += "#syno-nsc-ext-gen3 > article > div:nth-child(6) > a:nth-child(1), #syno-nsc-ext-gen3 > article > div:nth-child(6) > a:nth-child(2), #syno-nsc-ext-gen3 > article > div:nth-child(4) > a {color: darkgray !important; font-size: 10px  !important;}";
    // css1 += ".gotop {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    Mjztool.addStyle(css1);

    if (Mjztool.matchURL("/quanben/")) {
        $('#content .grid a').attr('target', '_blank');
        Mjztool.addStyle("#content .grid a {font-size: 14px !important;}");
        Mjztool.addStyle("table.grid td {padding: 4px !important;}");
    }

    var text = $("#content").html();
    var wordsReplace = {
        "siluke.com": "",
    };
    var wordsRemove = ["siluke.com"];
    text = removeText(text, wordsRemove);
    text = replaceText(text, wordsReplace);
    $("#content").html(text);

    if (Mjztool.matchURL("shuquzw.com")) {
        ShortcutKeys= {Next : "#link > a:nth-child(4)"};
    }else{
        ShortcutKeys= {Next : "#link > a:nth-child(3)"};
    }
    
}

// 顶点小说网
function ddxs() {
    var css1 = "#contents p { " + Font_Color_Style + " } ";
    // css1 += "html {" + Background_Color_Style + "}";
    css1 += ".bdsub  { border: none !important; background-color: initial !important;}";
    css1 += "#contents p a {display: none !important;}";
    css1 += ".hot a{color: rgb(102, 102, 102) !important; font-size: 10px  !important;}";
    css1 += "#tbox {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    css1 += "#content dd {width: 260px !important;} .bdsub dl dd a  { font-size: 14px !important;}";

    Mjztool.addStyle(css1);

    if (Mjztool.matchURL("html") == false) {
        open_in_new_tab(".bdsub dl dd a");
    }

    var text = $("#contents").html();
    var wordsReplace = {
        "点击下载本站APP,海量小说，免费畅读！": "",
    };
    var wordsRemove = ["点击下载本站APP,海量小说，免费畅读！"];
    text = removeText(text, wordsRemove);
    text = replaceText(text, wordsReplace);
    $("#contents").html(text);

    ShortcutKeys= {Next : "#footlink > a:nth-child(3)"};
}

function dwxdwx() {
    var css1 = "#content, #content p { " + Font_Color_Style + "  padding: 10px 0;} ";
    css1 += "html, body  {" + Background_Color_Style + "}";
    css1 += ".box_con {border: none; color: inherit !important;}";
    css1 += "#content p a {display: none !important;}";
    css1 += ".hot a{color: rgb(102, 102, 102) !important; font-size: 10px  !important;}";
    css1 += "#tbox {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    css1 += "#content_read div.bottem2 > a:nth-child(3) { font-size: 18px !important;   margin: 0 330px !important;}";

    Mjztool.addStyle(css1);

    var text = $("#content").html();
    var wordsReplace = {
        "点击下载本站APP,海量小说，免费畅读！": "",
    };
    var wordsRemove = ["点击下载本站APP,海量小说，免费畅读！"];
    text = removeText(text, wordsRemove);
    text = replaceText(text, wordsReplace);
    $("#content").html(text);

    ShortcutKeys= {Next : "#content_read div.bottem2 > a:nth-child(3)"};
}


 // 品书小说网
function vodtw() {
    var css1 = "#content, #content p { " + Font_Color_Style + " } ";
    css1 += "#content  {text-indent: 0em !important; padding-top: 32px !important;}";
    css1 += "html, body  {" + Background_Color_Style + "}";
    css1 += "#book {border: none; color: inherit !important;}";
    css1 += "#content p a {display: none !important;}";
    // css1 += ".hot a{color: rgb(102, 102, 102) !important; font-size: 10px  !important;}";
    css1 += "#tbox {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    css1 += ".page_chapter li {background: inherit !important;} .page_chapter li a{color: initial !important;}";
    css1 += ".page_chapter li {background: inherit !important;} .page_chapter li a{color: initial !important;}";
    css1 += "#footer p {display: none !important;}";

    Mjztool.addStyle(css1);

    var text = $("#content").html();
    var wordsReplace = {
        "    ": " 　　",
    };
    var wordsRemove = ["点击下载本站APP,海量小说，免费畅读！"];
    text = removeText(text, wordsRemove);
    text = replaceText(text, wordsReplace);
    $("#content").html(text);

    ShortcutKeys= {Next : "#book > div.content > div.page_chapter > ul > li:nth-child(3) > a"};
}

    // 丫丫电子书
function shuyyw() {
    var css1 = "#content, #content p { " + Font_Color_Style + " } ";
    css1 += "#content  {text-indent: 0em !important; padding-top: 32px !important;}";
    // css1 += "html, body  {" + Background_Color_Style + "}";
    // css1 += "#book {border: none; color: inherit !important;}";
    // css1 += "#content p a {display: none !important;}";
    // css1 += ".hot a{color: rgb(102, 102, 102) !important; font-size: 10px  !important;}";
    // css1 += "#tbox {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    Mjztool.addStyle(css1);

    var wordsReplace = {
        "    ": " 　　",
    };
    var wordsRemove = ["点击下载本站APP,海量小说，免费畅读！"];
    ContentChnage("#content", wordsRemove, wordsReplace);

    ShortcutKeys= {Next : "#content > div.readbutton > div.readdown > a"};
}


 // 思兔阅读
function sto520() {
    var css1 = ".readcotent, .readcotent p { " + Font_Color_Style + " } ";
    // css1 += "#readcotent  {text-indent: 0em !important; padding-top: 32px !important;}";
    css1 += "html, body, .book {" + Background_Color_Style + "}";
    // css1 += "#book {border: none; color: inherit !important;}";
    css1 += ".readcotent a {display: none !important;}";
    // css1 += ".hot a{color: rgb(102, 102, 102) !important; font-size: 10px  !important;}";
    // css1 += "#tbox {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    css1 += ".container, .footer p, .container01 {width: 68% !important;}";
    Mjztool.addStyle(css1);

    var wordsReplace = {
        // "    ": " 　　",
    };
    var wordsRemove = ["思兔阅读", "思兔閱讀", "520官網", "520官网", "ＳＴＯ５２０．ＣＯＭ", "思兔sto520.com", "�"];

    ContentChnage(".readcotent", wordsRemove, wordsReplace);

    ShortcutKeys= {Next : "#linkNext"};
}


function NeatReader() {
    var css1 = ".Body, .Body p { " + Font_Color_Style + " } ";
    // css1 += "#readcotent  {text-indent: 0em !important; padding-top: 32px !important;}";
    css1 += "html, body, .view-content {" + Background_Color_Style + "}";
    // css1 += "#book {border: none; color: inherit !important;}";
    // css1 += ".hot a{color: rgb(102, 102, 102) !important; font-size: 10px  !important;}";
    // css1 += "#tbox {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    Mjztool.addStyle(css1);

    var wordsReplace = {
        "    ": " 　　",
    };
    var wordsRemove = ["思兔阅读", ];

    ContentChnage(".Body", wordsRemove, wordsReplace);

    ShortcutKeys= {Next : "#next-btn"};
}

 function zhaikangpei() {
    var css1 = "#booktxt, #booktxt p { " + Font_Color_Style + " } ";
    // css1 += "#readcotent  {text-indent: 0em !important; padding-top: 32px !important;}";
    css1 += "html, body, #booktxt {" + Background_Color_Style + "}";
    css1 += "#chaptercontent > p {display: none !important;}";
    css1 += ".panel-default {border: none !important;}";
    // css1 += "#tbox {opacity: 0 !important;} .gotop:hover {opacity: 0.6 !important;}";
    Mjztool.addStyle(css1);

    var wordsReplace = { };
    var wordsRemove = ["落日余晖提示您：看后求收藏(归云文学网)，接着再看更方便。", ];

    ContentChnage("#booktxt", wordsRemove, wordsReplace);

    ShortcutKeys= {Next : "#next_url"};
}

function net_23qb() {
    var css1 = "#TextContent, #TextContent p { " + Font_Color_Style + " } ";
    // css1 += "html, body, #booktxt {" + Background_Color_Style + "}";
    Mjztool.addStyle(css1);

    var wordsReplace = { "铅笔小说" : ""};
    var wordsRemove = ["铅笔小说 23qb.net"];

    ShortcutKeys= {Next : "#readbg > p > a:nth-child(5)"};

    ContentChnage("#TextContent", wordsRemove, wordsReplace);
}


function ranwen() {
    if(Mjztool.matchURL("m.ranwen")) {
        window.location.href = window.location.href.replace("m.", "");
        return;
    }
    if (Mjztool.matchURL("/article/")) {
        AD_Checker();
    }
}

function com_45xs(){
    if(Mjztool.matchURL("/book/") == false) return;

    var css1 = "#chaptercontent, #chaptercontent p { " + Font_Color_Style + " } ";
    // css1 += "html, body, #booktxt {" + Background_Color_Style + "}";
    Mjztool.addStyle(css1);

    var adList = [ /【.*换源.*】/ig, /【.*看书追更.*】/ig, /【.*听书.*】/ig, /【.*追书.*】/ig, /.*45小说网.*/ig, ];
    AD_Hider(adList);
}

function penghe(){
    if(Mjztool.matchURL("/book/") == false) return;

    var css1 = "#article, #article p { " + Font_Color_Style + " } ";
    css1 += "html, body, #article, .read_bg, .container, .section_style {" + Background_Color_Style + "}";
    Mjztool.addStyle(css1);

    var adList = [ /【.*换源.*】/ig, /【.*看书追更.*】/ig, /【.*听书.*】/ig, /【.*追书.*】/ig, /.*45小说网.*/ig, ];
    AD_Hider(adList);
}

function sjks88(){
    var css1 = ".content, .content p { " + Font_Color_Style + " } ";
    // css1 += "html, body, .content {" + Background_Color_Style + "}";
    css1 += ".box-artic {width: 80% !important;}";
    Mjztool.addStyle(css1);

    var adList = [ /【.*换源.*】/ig, /【.*看书追更.*】/ig, /【.*听书.*】/ig, /【.*追书.*】/ig, /.*45小说网.*/ig, ];
    AD_Hider(adList);
}

function xbyuan(){
    var MIN_WORD_COUNT = 50 * 10000;
    var css1 = ".content, .content p { " + Font_Color_Style + " } ";
    // css1 += "html, body, .content {" + Background_Color_Style + "}";
    // css1 += ".box-artic {width: 80% !important;}";
    css1 += ".little_book, .little_book a, .little_book p {color: gray !important;}";
    Mjztool.addStyle(css1);

    if (Mjztool.matchURL("/search.html")) {
        console.log("/search.html");
        $("li p.p4").each(function(){
            var wordCount = parseInt($(this).text());
            if (wordCount < MIN_WORD_COUNT) {
                console.log("little_book");
                $(this).parent().addClass("little_book");
            }

        });
    }
    
}

function feixs(){
    var css1 = '';
    css1 += "";
    css1 += "body { font-family: 微软雅黑, 宋体 !important; font-size: 16px !important; }";
    css1 += ".book a { font-size: 16px; } ";
    css1 += ".book .tab3 { width: 300px; } ";
    css1 += ".book .tab4 { width: 200px; } ";
    css1 += ".book_woman .tab3 a { color: gray !important; } ";
    Mjztool.addStyle(css1);

    if (Mjztool.matchURL("/index.html")) {
        var author = $('#main > div.bookinfo > div.info > p:nth-child(2) > span');
        var newText = author.text().replace('文 / ', '\n 作者：');
        author.text(newText);

        $('.recbooks a').each(function(){
            var ahref = $(this).attr('href');
            var host = window.location.origin;
            var newhref = ahref.replace(/http.*com/g, host);
            $(this).attr('href', newhref);
        });
    }

    if (Mjztool.matchURL("/book/")) {
        var clist = ['职场婚恋', '霸总', '豪门爽文', '豪门世家', '女频衍生', '古代言情', '快穿', '豪门总裁', '双男主', '青春甜宠', '宫斗宅斗', '宫闱宅斗', '现言', '现言脑洞', '现代言情', '星光璀璨', '幻想言情', '女生小说', '古装言情', '古言脑洞', '古代情缘', '玄幻言情', '年代', '浪漫青春'];
    
        $('.book li a').each(function(){
            var atext = $(this).text();
            if (clist.indexOf(atext) > -1) {
                $(this).parent().parent().parent().addClass('book_woman');
            }
        });
    }
    
}




function shuhaige(){
    var css1 = '';
    css1 += "";
    css1 += "body { font-family: 微软雅黑, 宋体 !important; font-size: 16px !important; }";
    // Mjztool.addStyle(css1);

    if (Mjztool.matchURL(".html") && Mjztool.matchURL("/list_")) {
        var href = window.location.href;
        href = href.replace('/list_', '/');
        window.location.href = href;
    }
    
}



function com_38xs(){
    var css1 = '';
    css1 += "";
    css1 += "#bookintro { overflow: auto !important; width: 100%}";
    // css1 += "body { font-family: 微软雅黑, 宋体 !important; font-size: 16px !important; }";
    Mjztool.addStyle(css1);

    if (Mjztool.matchURL(".html") ) {
    }
    
}







/*****************************************************************************************/
/*****************************************************************************************/
/*****************************************************************************************/

var AD_CheckerInterval = 5000;

function AD_Checker(){
    AD_replaceText();
}

function AD_Checker2(func){
    setInterval(function(){
        $("p[class!='ad_checked']").each(function(){
            var text = $(this).text();
            text = text.replaceAll(/【.*换源.*】/ig, "");
            text = text.replaceAll(/【.*看书追更.*】/ig, "");
            text = text.replaceAll(/【.*听书.*】/ig, "");
            text = text.replaceAll(/【.*追书.*】/ig, "");

            if (func) {
                text = func(text);
            }

            $(this).text(text);
            $(this).addClass("ad_checked");
        });
    }, 5000);
}

function AD_replaceText(){
    console.log("AD_Checker...");
    var removeWords = ["仟韆仦哾", "仟仟尛哾"];
    $("p[class!='ad_checked']").each(function(){
        var text = $(this).text();
        text = text.replaceAll(/【.*换源.*】/ig, "");
        text = text.replaceAll(/【.*看书追更.*】/ig, "");
        text = text.replaceAll(/【.*听书.*】/ig, "");
        text = text.replaceAll(/【.*追书.*】/ig, "");
        
        for (let i = 0; i < removeWords.length; i++) {
            const word = removeWords[i];
            text = text.replaceAll(word, "");
        }

        $(this).text(text);
        $(this).addClass("ad_checked");
    });
    var timerVar = setTimeout(AD_replaceText, AD_CheckerInterval);
}

function AD_Hider(adList){
    Mjztool.addStyle(".ad_hide {display: none !important;}");
    setInterval(function(){
        $("p[class!='ad_checked']").each(function(){
            $(this).addClass("ad_checked");

            var text = $(this).text();
        
            adList.forEach(element => {
                if (text.match(element)){
                    $(this).addClass("ad_hide");
                    return;
                }
            }); 
        });
    }, 5000);
}

function ContentChnage(selector, wordsRemove, wordsReplace) {
    if ($(selector)) {
        var text = $(selector).html();
        text = removeText(text, wordsRemove);
        text = replaceText(text, wordsReplace);
        $(selector).html(text); 
    }
    
}

function open_in_new_tab(selector){
    // $('a').attr('target', '_blank');
    $(selector).attr('target', '_blank');
}


function replaceNodeText(content, words){
    for (var i = 0; i < content.childNodes.length; i++) {
        var element = content.childNodes[i];
        if (element.nodeName == "#text") {
            element.nodeValue = replaceText(element.nodeValue, words);
        }
    }
}

function replaceText(text, words) {
    if (text == null) return null;
    for (var key in words) {
        text = text.replaceAll(key, words[key]);
    }
    return text;
}

function removeText(text, words) {
    if (text == null) return null;
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