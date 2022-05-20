// ==UserScript==
// @name         MJZ-Youtube助手
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
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
    OpenInNewTab();

    setTimeout(function () {
        main();
    }, 100);
})();

function main() {
    // 隐藏频道水印
    addStyle(".iv-branding{display: none;}");
}

// Youtube 新标签页打开
function OpenInNewTab() {   
    "use strict";
    const updateAEle = function (selector) {
        const aEle = [...document.querySelectorAll(selector)];

        aEle.forEach((ele) => {
            ele.setAttribute("target", "_blank");
            const href = ele.getAttribute("href");
            ele.onclick = (e) => {
                if (ele.getAttribute("id") != "thumbnail") {// 跳过略缩图
                    e.stopPropagation();
                    window.open(href, "_blank");
                    return false;
                }
                return true;
            };

            ele.setAttribute("href", "#");
        });
    };

    const updateAEleBatch = function (aEleList) {
        if (intervalTimes !== intervalDefaultTimes) return; // 避免重复更新

        aEleList.forEach((curSelector) => {
            updateAEle(curSelector);
        });
    };

    const getCurPath = () => {
        const {
            pathname
        } = window.location;
        const secondIndex = pathname.indexOf("/", 2);
        const path =
            secondIndex === -1 ? pathname : pathname.substr(0, secondIndex);
        return path;
    };

    const getSelectorAtCurPath = function () {
        const path = getCurPath();

        return (
            selectorPathMap[path] || {
                observeEle: "#page-manager",
                aEle: ['#dismissible a[href^="/"]'],
            }
        );
    };

    const initObserver = function (selector) {
        const observeEle = document.querySelector(selector.observeEle);
        if (!observeEle) return;

        new MutationObserver(() => {
            updateAEleBatch(selector.aEle);
        }).observe(observeEle, {
            childList: true,
            subtree: true, // 监视子孙节点
        });
    };

    const watchPathChange = function (cb = () => {}) {
        setInterval(() => {
            const path = window.location.pathname;
            if (intervalTimes === 0) {
                initPath = path;
                intervalTimes = intervalDefaultTimes;
            }

            if (initPath !== path) {
                intervalTimes--;
                cb();
            }
        }, 250);
    };


    // init
    const selectorPathMap = {
        "/": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a[href^="/"]'],
        },
        "/results": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a[href^="/"]'],
        },
        "/channel": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a[href^="/"]', 'ytd-grid-playlist-renderer a[href^="/"]', '#channel a[href^="/"]'],
        },
        "/watch": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a[href^="/"]', 'ytd-video-owner-renderer a[href^="/"]'],
        },
        "/playlist": {
            observeEle: "#page-manager",
            aEle: ['#content a[href^="/"]'],
        },
        "/user": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a[href^="/"]'],
        },
        "/c": {
            observeEle: "#page-manager",
            aEle: ['ytd-grid-playlist-renderer a[href^="/"]', '#dismissible a[href^="/"]'],
        },
        "/feed": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a[href^="/"]'],
        },
    };

    const selector = getSelectorAtCurPath();
    let initPath = window.location.pathname;
    let intervalDefaultTimes = 50;
    let intervalTimes = intervalDefaultTimes;

    window.onload = () => {
        initObserver(selector);
        updateAEleBatch(selector.aEle);
    };

    watchPathChange(() => {
        initObserver(selector);
        updateAEleBatch(selector.aEle);
    });
}

function backOpenVideo() {
    $('a.ytd-thumbnail').each(function (index, element) {
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

function matchURLAbsolute(url) {
    const href = window.location.href;
    const len = href.length;
    return href.indexOf(url) > -1 && url.length == len;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}