// ==UserScript==
// @name  hongfire.com - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.hongfire.com/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();



function main() {
    formatAllTime();
}

function formatAllTime() {
    const elTimeList = document.querySelectorAll("time");
    for (let index = 0; index < elTimeList.length; index++) {
        const element = elTimeList[index];
        const el_datetime = element.getAttribute("datetime");
        element.innerHTML = formatTime(el_datetime);
    }
}

function formatTime(params) {
    // 2016-09-26T18:10:01
    if (params) {
        var head = params.substring(0, 10);
        var end = params.substring(10);
        return " [" + head + "] " + end;
    }
}


function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}