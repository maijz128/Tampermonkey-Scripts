// ==UserScript==
// @name  百度贴吧 - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://tieba.baidu.com/photo/*
// @grant        none
// ==/UserScript==



(function () {
    main();
})();

function main() {
    if (matchURL("tieba.baidu.com/photo/")) {
        photo();
    }
}

function photo() {
    // 播放按钮 样式
    var style = ".image_original_prev, .image_original_next, .af_nav_head, .af_ppt_contorl { opacity: 0.1 !important; } ";
    style += " .af_ppt_contorl { bottom: 10px !important; left: 95% !important; }";
    const el_style = document.createElement("style");
    el_style.innerHTML = style;
    document.head.appendChild(el_style);

    setTimeout(() => {
        const af_right = document.querySelector(".af_right");
        af_right.setAttribute("style", "right: -275px;"); 
    }, 500);

}



function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}