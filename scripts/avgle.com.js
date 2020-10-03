// ==UserScript==
// @name  avgle.com
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.avgle.com/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL("/video/")) {
        changeVideoPlayerSize();
    }
}
function changeVideoPlayerSize(){
    var style = '.video-player { width: 1000px !important; max-width: 1000px !important; height: 650px !important; max-height: 650px !important;';
    style += 'position: relative !important; z-index: 99 !important;}';
    addStyle(style);

    $('video:first').parent().addClass('video-player');
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