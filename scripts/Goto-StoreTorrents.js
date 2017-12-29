// ==UserScript==
// @name         Goto StoreTorrents
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  Goto StoreTorrents; 支持BtKitty、CiLiSoBa
// @author       MaiJZ
// @match        *://*.cnbtkitty.com/search/*
// @match        *://*.cilisoba.net/h/*
// @grant        none
// ==/UserScript==



const URL_StoreTorrents = "http://storetorrents.com/hash/";

(function () {

    main();
})();



function main() {

    if (isBtKitty()) {
        btKitty();
    } else if (isCiLiSoBa()) {
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

function isBtKitty() {
    const URL = "cnbtkitty.com";
    return location.href.indexOf(URL) > -1;
}

function btKitty() {
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

function isCiLiSoBa() {
    const URL = "cilisoba.net";
    return location.href.indexOf(URL) > -1;
}

function cilisoba() {
    const elBT_List = document.querySelectorAll(".tr-magnet-link");
    const elBT2 = elBT_List[1];
    if(elBT2){
        const elHtml = elBT2.innerHTML;
        const magnet_hash = searchMagnetHash(elHtml);

        if(magnet_hash){
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
            setTimeout(function() {
                cilisoba();
            }, 1000);
        }
    }
}