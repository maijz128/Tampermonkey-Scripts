// ==UserScript==
// @name  jav321.com - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://www.jav321.com/video/*
// @grant        none
// ==/UserScript==

const VOLUME = 0.3;
const id = "vjs_sample_player_html5_api";

(function () {
    main();
})();



function main() {
    lowerVolume();
    setPlayerStyle();
}

function lowerVolume() {
    // document.getElementById(id).volume = volume;
    var videos = document.querySelectorAll("video");
    for (let index = 0; index < videos.length; index++) {
        const element = videos[index];
        element.volume = VOLUME;
    }
}

function addSearch() {

}


function setPlayerStyle() {
    // var styleContent = "#player_3x2_close { font-size: 15em; } ";
    // addStyle(styleContent);

    var player_iframe = document.querySelector("iframe");
    if (player_iframe) {
        // player_iframe.setAttribute("width", "800");
        // player_iframe.setAttribute("height", "600");
        player_iframe.setAttribute("scrolling", "no");        
        player_iframe.setAttribute("id", "player_iframe");
        var styleContent = "#player_iframe { width: 1000px; height: 650px; position: relative; z-index: 99;}";
        addStyle(styleContent);
    }
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}