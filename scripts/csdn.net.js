// ==UserScript==
// @name         csdn.net
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://blog.csdn.net/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL("/article/")) {

        setTimeout(function () {
            readMoreArticle();

            old_style(); 
        }, 1000);
        
    }
}

function readMoreArticle(){
    $('.read_more_btn:first').click();
}

// 旧版样式
function old_style(){
    // 阅读更多
    $('#btn-readmore-zk').click();
   
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