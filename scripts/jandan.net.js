// ==UserScript==
// @name  jandan.net - 煎蛋网
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  鼠标悬浮至GIF自动播放。
// @author       MaiJZ
// @match        *://*.jandan.net/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    GIF();
}

function GIF() {

    setTimeout(function () {
        $(".gif-mask").hover(function () { // mouseenter event
            $(this).click();

            var el_acv_comment = $(this).parent().parent() ;
            el_acv_comment.click();
        }, function () {   // mouseleave event
            // do some thing...
        });
    }, 1000);

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