// ==UserScript==
// @name         MJZ-Youtube助手
// @namespace    https://github.com/maijz128
// @version      25.01.23
// @description  描述
// @author       MaiJZ
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @match        *://*.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==



setTimeout(() => {
    console.log("MJZ-Youtube助手 is loading");
    // waitElementLoad("#start", 1, 10, 300).then(main);
    waitElementLoad2("#start", 1, 10, 300, main);

    if (matchURL('/watch?')) {
        // 自动隐藏滚动条
        OnAutoHideScrollBar();
    }

}, 10);

const delay = (ms = 0) => {return new Promise((r)=>{setTimeout(r, ms)})};

const waitElementLoad = (elementSelector, selectCount = 1, tryTimes = 1, interval = 0) =>
{
    return new Promise(async (resolve, reject)=>
    {
        let t = 1, result;
        while(true)
        {
            if(selectCount != 1) {if((result = document.querySelectorAll(elementSelector)).length >= selectCount) break;}
            else {if(result = document.querySelector(elementSelector)) break;}

            if(tryTimes>0 && ++t>tryTimes) return reject(new Error("Wait Timeout"));
            await delay(interval);
        }
        resolve(result);
    })
};


function waitElementLoad2 (elementSelector, selectCount = 1, tryTimes = 1, interval = 0, func) {
    let tryCount = 0;
    let inter = setInterval(() => {
        var done = false;
        if(selectCount != 1) {
            if((result = document.querySelectorAll(elementSelector)).length >= selectCount) 
            done = true;
        }
        else {
            if(result = document.querySelector(elementSelector)) 
            done = true;
        }

        if(tryTimes > 0 && ++tryCount > tryTimes) {
            done = true;
        }

        if (done) {
            if(func) func();
            clearInterval(inter);
        }

    }, interval);
}




const main = () =>
{
    OpenInNewTab();

    if (matchURL('/watch?')) {
        // 隐藏频道水印
        addStyle(".iv-branding{display: none;}");

        // 全屏时隐藏UI
        OnFullscreenHideUI();
        
        // 按钮，滚动至顶部
        OnClickButtonToTop();

        // 自动隐藏滚动条
        // OnAutoHideScrollBar();
    }

    console.log("MJZ-Youtube助手 is done");
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
    console.log('全屏时隐藏UI');
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
    console.log('按钮，滚动至顶部');
    (async () => // onStart
    {
        let tryTimes = 0;
        while(true)
        {
            var btnToTopID = 'btnGoToTop';
            var buttons = document.querySelector("#top-level-buttons-computed");
            if(buttons != null 
            && document.querySelector(`#${btnToTopID}`) == null)
            {
                var btnToTop = `<button id="${btnToTopID}" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading" aria-label="To Top" title="To Top" onclick="window.scrollTo(0, 0);">Top</button>`;

                var elDiv = document.createElement("div");
                elDiv.innerHTML = btnToTop;
                buttons.appendChild(elDiv);

                // return;
            }
            // if(++tryTimes>10000) return;
            await delay(1000);
        }
    })();
    
}

// 自动隐藏滚动条
function OnAutoHideScrollBar() {
    console.log('自动隐藏滚动条');
    var css = "";

    css += "body { overflow-x: hidden !important;  overflow-y: hidden !important; }";
    css += "body:hover { overflow-y: auto !important; }";
    css += "html:hover body { overflow-y: auto !important; }";

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


// How to fix TrustedHTML assignment error with Angular [innerHTML]
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy('default', {
      createHTML: (string, sink) => string
    });
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}