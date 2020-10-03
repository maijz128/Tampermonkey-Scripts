// ==UserScript==
// @name  mooc.study.163.com
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://mooc.study.163.com/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL("/learn/content")) {
        switchQuality();
        onChangeLocationHref([switchQuality]);
    }
}


function onChangeLocationHref(callbacks) {
    var href = window.location.href;
    setInterval(function () {
        if (window.location.href !== href) {
            if (callbacks) {
                for (let index = 0; index < callbacks.length; index++) {
                    const func = callbacks[index];
                    func();
                }
            }
            href = window.location.href;
        }
    }, 1000);
}

// 切换画质
function switchQuality() {
    var inter = setInterval(function () {
        var qualityList = $(".m-popover-quality .item");
        var len = qualityList.length;
        if (len > 0) {
            console.log(len);
            qualityList[len - 1].click();
            clearInterval(inter);
        }
    }, 500);
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