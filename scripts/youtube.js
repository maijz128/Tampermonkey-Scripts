// ==UserScript==
// @name         mYoutube助手
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.youtube.com/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==


(function () {
    main();
})();

function main() {
    // setInterval(function () {
        if (matchURL("/watch")) {
            // 新页面刷新一次
            if (matchURL("#mjz_re") == false) {
                //  setTimeout(function(){
                    var url = window.location.href;
                    window.location.href = url + "#mjz_re";
                    window.location.reload();
                // }, 1000);
            }
        }
    // }, 500);


}

function backOpenVideo(){
    $('a.ytd-thumbnail').each(function(index, element){
        $(this).attr('target', '_blank');
    });
}

function copyToClipboard(content) {
    GM_setClipboard(content);
}

function matchURL(url) {
    var URL = window.location.href;
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