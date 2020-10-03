// ==UserScript==
// @name  微博助手
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.weibo.com/*
// @match        *://m.weibo.cn/u/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {

    if (matchURL("weibo.com/u/")) {

    } else if (matchURL('m.weibo.cn/u/')) {
        gotoPCpage();
     } else {
        setTimeout(function () {
           // OnekeyLikeAndForward();
        }, 3000);
    }
}

// 一键转发、点赞
function OnekeyLikeAndForward() {
    var btn = '<li><button onclick="toggleIntroduction()">一键转发、点赞</button></li>';
    $('.WB_row_line').append(btn);
}

// m.weibo.cn/u/ -> weibo.com/u/ 自动转为PC页面
function gotoPCpage() {
    var show_all = '?profile_ftype=1&is_all=1#_0';
    var href = window.location.href;
    href = href.replace("m.weibo.cn", 'weibo.com');
    href = href.split('?')[0] + show_all;
    window.location.href = href;
}

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}