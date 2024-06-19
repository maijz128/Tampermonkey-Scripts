// ==UserScript==
// @name         MJZ-Youtube助手
// @namespace    https://github.com/maijz128
// @version      24.05.22
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



console.log("MJZ-Youtube助手 is loading");
(async () => // onStart
{
    let tryTimes = 0;
    while(true)
    {
        // console.log("try load");
        if(document.querySelector("#start")!=null)
        {
            main();
            return;
        }
        if(++tryTimes>10) return;
        await delay(300);
    }
})();


function delay(ms = 0){return new Promise((r)=>{setTimeout(r, ms)})}


function main() {
    OpenInNewTab();

    if (matchURL('/watch?')) {
        // 隐藏频道水印
        addStyle(".iv-branding{display: none;}");

        // 全屏时隐藏UI
        OnFullscreenHideUI();
        
        // 按钮，滚动至顶部
        OnClickButtonToTop();

        // 自动隐藏滚动条
        OnAutoHideScrollBar();
    }
}

// Youtube 新标签页打开
function OpenInNewTab() {   
    "use strict";
    const updateAEle = function (selector) {
        const aEle = [...document.querySelectorAll(selector)];

        aEle.forEach((ele) => {
            if (ele.getAttribute("id") == "thumbnail") {// 跳过略缩图
                return true;
            }
            
            ele.setAttribute("target", "_blank");
            // ele.setAttribute("hrefold", ele.getAttribute("href"));
            ele.onclick = (e) => {
                e.stopPropagation();
                var href = ele.getAttribute("href");
                window.open(href, "_blank");
                return false;
            };

            // ele.setAttribute("href", "#");
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
                aEle: ['#dismissible a:not([target])'],
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
        }, 200);
    };


    // init
    const selectorPathMap_old = {
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

    const selectorPathMap = {
        "/": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a:not([target])'],
        },
        "/results": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a:not([target])'],
        },
        "/channel": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a:not([target])', 'ytd-grid-playlist-renderer a:not([target])', '#channel a:not([target])'],
        },
        "/watch": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a:not([target])', 'ytd-video-owner-renderer a:not([target])'],
        },
        "/playlist": {
            observeEle: "#page-manager",
            aEle: ['#content a:not([target])'],
        },
        "/user": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a:not([target])'],
        },
        "/c": {
            observeEle: "#page-manager",
            aEle: ['ytd-grid-playlist-renderer a:not([target])', '#dismissible a:not([target])'],
        },
        "/feed": {
            observeEle: "#page-manager",
            aEle: ['#dismissible a:not([target])'],
        },
    };

    const selector = getSelectorAtCurPath();
    let initPath = window.location.pathname;
    let intervalDefaultTimes = 100;
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

// 全屏时隐藏UI
function OnFullscreenHideUI(){
    var css = "";
    css += ".ytp-gradient-top, .ytp-gradient-bottom {opacity: 0;}";
    // css += ".ytp-fullscreen .ytp-chrome-top {opacity: 0;}";
    // css += ".ytp-fullscreen .ytp-chrome-bottom {opacity: 0;}";
    // css += ".ytp-fullscreen .ytp-chrome-bottom:Hover {opacity: 1;}";
    css += ".ytp-chrome-top {opacity: 0;}";
    css += ".ytp-chrome-bottom {opacity: 0;}";
    css += ".ytp-chrome-bottom:Hover {opacity: 1;}";
    addStyle(css);
}

// 按钮，滚动至顶部
function OnClickButtonToTop() {
 
    (async () => // onStart
    {
        let tryTimes = 0;
        while(true)
        {
            // console.log("try load");
            var btnToTopID = 'btnGoToTop';
            if(document.querySelector("#top-level-buttons-computed") != null 
            && document.querySelector(`#${btnToTopID}`) == null)
            {
                var btnToTop = `<button id="${btnToTopID}" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading" aria-label="To Top" title="To Top" onclick="window.scrollTo(0, 0);">Top</button>`;
                $("#top-level-buttons-computed").append(btnToTop);
                // return;
            }
            // if(++tryTimes>10000) return;
            await delay(1000);
        }
    })();
    
}

// 自动隐藏滚动条
function OnAutoHideScrollBar() {
    var css = "";
    css += "body { overflow: hidden !important; }";
    css += "body:hover { overflow: auto !important; }";
    css += "html:hover body { overflow: auto !important; }";
    addStyle(css);
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