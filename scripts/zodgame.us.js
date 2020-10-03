// ==UserScript==
// @name  zodgame.us - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.zodgame.us/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL("&tid=")) {
        ForumPost();
    }
}

// 帖子

function ForumPost() {
    
    // 转换百度分享链接为AutoUnlock
    
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