// ==UserScript==
// @name  ZiMuZu.tv - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.1
// @description  ZiMuZu.tv个人助手
// @author       MaiJZ
// @match        *://www.zimuzu.tv/*
// @match        *://www.zimuzu.io/*
// @grant        none
// ==/UserScript==



(function () {
    main();
})();



function main() {
    addUserFavToHeader();

    if(matchURL("/user/fav")){

    }
}

function addUserFavToHeader() {
    var el_top_login_after = document.querySelector(".top-login-after");
    if (el_top_login_after) {
        var el_Fav = document.createElement("div");
        el_Fav.setAttribute("style", "float: left; margin-top: 15px; margin-left: 5px;");
        el_Fav.innerHTML = '<h2><a href="/user/fav" style="color: #fff;">我的收藏</a></h2>';
            
        el_top_login_after.appendChild(el_Fav);
    }
}

// 记录观看进度
function myReadStatus(){

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