// ==UserScript==
// @name         百度盘皮肤
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://pan.baidu.com/*
// @grant        none
// ==/UserScript==


const SKIN = {
    Dark : {
        header: "#2f2f2f",
        
    },
}


(function () {
    main();
})();

function main() {

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