// ==UserScript==
// @name         ourocg - 游戏王卡片在线查询
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.ourocg.cn/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL("/card/")) {
        setTitleFormat();
    }
}

function setTitleFormat() {



    var elTitle = $('.title:first');
    if (elTitle) {

        // 移动副标题
        var elSpan = $('.title:first span');
        if (elSpan) {
            elTitle.after(elSpan);
        }

        var cardName = elTitle.text();
        var url = location.href;

        var el_a = document.createElement("a");
        el_a.setAttribute('href', url);
        //el_a.innerHTML = "[" + cardName + "]" + "(" + url + ")";
        el_a.innerHTML = cardName;

        elTitle.text("");
        elTitle.append(el_a);
    }
}

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function matchURLAbsolute(url) {
    const href = window.location.href;
    const len = href.length;
    return href.indexOf(url) > -1 && url.length == len;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}