// ==UserScript==
// @name         Goto StoreTorrents
// @namespace    https://github.com/maijz128
// @version      0.3.0
// @description  Goto StoreTorrents; 支持BtKitty、CiLiSoBa
// @author       MaiJZ
// @match        *://*.cnbtkitty.com/*
// @match        *://*.cnbtkitty.net/*
// @match        *://*.cnbtkitty.org/*
// @match        *://*.cilisoba.net/h/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==



const URL_StoreTorrents = "http://storetorrents.com/hash/";

(function () {
    main();
})();


function main() {

    if (matchURL("btkitty")) {
        btKitty();
    } else if (matchURL("cilisoba")) {
        cilisoba();
    }
}

function getURL(hash) {
    return URL_StoreTorrents + hash;
}

function searchMagnetHash(str) {
    const matchResult = str.match(/btih:(.*?)&/);
    if (matchResult) {
        return matchResult[1];
    } else {
        return null;
    }
}


function btKitty() {
    if (matchURL("/search/")) {
        btkitty_search();
    } else if (matchURL("/item/")) {
        btkitty_item();
    }

    function btkitty_search() {

        const elBT_List = document.querySelectorAll(".list-con");
        elBT_List.forEach(function (element) {

            const list_con_html = element.innerHTML;
            const magnet_hash = searchMagnetHash(list_con_html);

            if (magnet_hash) {
                const elOption = element.querySelector(".option");
                if (elOption) {
                    const href = ' href="' + getURL(magnet_hash) + '" ';
                    const gotoStoreTorrents_html = '<span><a target="_blank" ' + href + "> [StoreTorrents] </a></span> ";

                    var option_html = elOption.innerHTML;
                    option_html = gotoStoreTorrents_html + option_html;
                    elOption.innerHTML = option_html;
                } else {
                    console.error("StoreTorrents：找不到 .option 元素！");
                }
            } else {
                console.error("StoreTorrents：匹配不到 hash 值！");
            }
        });
    }

    function btkitty_item() {
        var infohash = $('.infohash:first').text();
        var magnet = $('.magnet a:first').text();

        // jump to StoreTorrents
        if (infohash && matchURL("#download")) {
            window.location.href = URL_StoreTorrents + infohash;
        }

        // auto copy magnet
        if (magnet && matchURL("#magnetlink")) {
            copyToClipboard(magnet);
            window.close();
        }

    }
}


function cilisoba() {
    const elBT_List = document.querySelectorAll(".tr-magnet-link");
    const elBT2 = elBT_List[1];
    if (elBT2) {
        const elHtml = elBT2.innerHTML;
        const magnet_hash = searchMagnetHash(elHtml);

        if (magnet_hash) {
            const elTd = elBT2.querySelector("td");
            if (elTd) {
                const href = ' href="' + getURL(magnet_hash) + '" ';
                const gotoStoreTorrents_html = '<a target="_blank" ' + href + "> [StoreTorrents] </a> ";

                var elTd_html = elTd.innerHTML;
                elTd_html = gotoStoreTorrents_html + elTd_html;
                elTd.innerHTML = elTd_html;
            }
        } else {
            console.error("StoreTorrents：匹配不到 hash 值！");
            setTimeout(function () {
                cilisoba();
            }, 1000);
        }
    }
}

function copyToClipboard(content) {
    GM_setClipboard(content);
}

function matchURL(url) {
    const URL = window.location.href;
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

