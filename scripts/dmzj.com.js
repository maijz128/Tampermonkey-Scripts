// ==UserScript==
// @name         动漫之家
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://manhua.dmzj.com/*
// @require https://greasyfork.org/scripts/39499-back-to-top/code/Back%20to%20Top.js?version=259015
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {

    hideElement();
}


function hideElement(){

    // 隐藏吐槽
    $('#hd').remove();

    // 隐藏热门推荐
    $('.hotrmbox').remove();

    // 隐藏动漫之家客户端浮动图
    $('#floatCode').remove();

    // 未登录提示
    $('.login_tip.out').remove();
}

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function matchURLAbsolute(url){
    const href = window.location.href;
    const len = href.length;
    return href.indexOf(url) > -1 && url.length == len;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}