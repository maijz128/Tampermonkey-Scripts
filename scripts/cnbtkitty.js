// ==UserScript==
// @name  BtKitty - 快捷搜索
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.cnblogs.com/*
// @grant        GM_xmlhttpRequest
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    $.post('https://cnbtkitty.net/', {'keyword': 'abcdef'}, function(response){console.log(response);});

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