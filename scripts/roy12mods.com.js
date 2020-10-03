// ==UserScript==
// @name  roy12mods.com - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.roy12mods.com/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();



function main() {
    // 匹配文章
    if (matchURL("roy12mods.com/wp/201")) {
        formatAllTime();
    }
    // AutoUnlock
    else if (matchURL("roy12mods.com/download-test.php") && matchURL("download_region=1")) {
        autoUnlock();
    }
}

function autoUnlock() {
    const el_baiduKey = document.querySelector("p");
    const baiduKey = el_baiduKey.innerHTML;
    const el_baiduLink = document.querySelector("a");
    const baiduLink = el_baiduLink.getAttribute("href");

    const baiduLink_format = formatBaiduLink(baiduLink);
    const targetURL = baiduLink_format + "&password=" + baiduKey;
    console.log(targetURL);
    window.location.href = targetURL;
}

function formatBaiduLink(link) {
    // link : https://pan.baidu.com/s/1kUM8Lt9
    // return : https://pan.baidu.com/share/init?surl=kUM8Lt9
    const tokenList = link.split("/");
    var key = tokenList[tokenList.length - 1];
    // 去掉前面一位字符
    key = key.substring(1);
    return "https://pan.baidu.com/share/init?surl=" + key;
}

function formatAllTime() {
    const URL = window.location.href;
    const time = formatTime(URL);

    const entry_title = document.querySelector(".entry-title");
    const title = time + entry_title.innerHTML;
    entry_title.innerHTML = title;

    // 添加链接
    const elA = document.createElement("a");
    elA.setAttribute("class", entry_title.getAttribute("class"));
    elA.setAttribute("href", window.location.href);
    elA.innerHTML = title;

    const entry_header = entry_title.parentNode;
    entry_header.removeChild(entry_title);
    // elA.appendChild(entry_title);
    entry_header.appendChild(elA);
}

function formatTime(url) {
    // https://roy12mods.com/wp/2018/01/18/hsrequest-captain-marvels-warbird-outfit/
    if (url) {
        const tokenList = url.split("/");
        if (tokenList.length > 6) {
            const year = tokenList[4];
            const month = tokenList[5];
            const day = tokenList[6];
            return "[" + year + month + day + "]";
        }

    }
}


function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}