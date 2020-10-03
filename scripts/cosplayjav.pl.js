// ==UserScript==
// @name  cosplayjav.pl - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://cosplayjav.pl/thumbnails/*
// @match        *://cosplayjav.pl/download/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL("cosplayjav.pl/thumbnails")) {
        showThumbnails();
    }else if (matchURL("cosplayjav.pl/download")) {
        showRealDownloadURL();
    }
}

function showThumbnails() {
    // $(".hidden").removeClass("hidden");

    $(".btn-thumbnails").hide();
   
    var style = '.hidden { display: block !important; '; 
    style += 'visibility: visible !important; max-width: 100% !important;}';
    addStyle(style);
}

function showRealDownloadURL(params) {
    var btnDownload = document.querySelector(".text-center .btn-download");
    if (btnDownload) {
        
    }
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