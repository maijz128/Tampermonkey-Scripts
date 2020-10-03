// ==UserScript==
// @name  FT中文网 - 个人设置
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.ftchinese.com/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL('/story/') && !matchURL('?full=y')) {
        restPage();
    }
}

function restPage(){
    window.location.href = window.location.href + '?full=y';
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