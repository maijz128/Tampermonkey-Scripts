// ==UserScript==
// @name  ScriptTemplate - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==


(function () {
    main();
})();

function main() {

}

    var randomNumber = Math.floor(Math.random() * 10240000);
    var divID = "div_temp_" + randomNumber;
    var buttonID = "btn_temp_" + randomNumber;
    var elModuel = '<div id="' + divID + '" ><input id="input_' + randomNumber + '" type="text" value="' + content + '">';
    elModuel += '<button class="btn" id="' + buttonID + '" data-clipboard-action="copy" data-clipboard-target="#input_' + randomNumber + '">Copy</button></div>';
    $("body").append(elModuel);

    var clipboard = new Clipboard('.btn');
    clipboard.on('success', function (e) {
        console.log("copy To Clipboard ...");
        console.log(e);
    });
    setTimeout(function () {
        //自动点击
        //$('#' + buttonID).trigger("click");
        $('#' + buttonID).click();
        //删除
        //clipboard = null;
        //$(divID).remove();
    }, 500);

}
function copyToClipboard(content) {
    GM_setClipboard(content);
}

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function matchURLAbsolute(url){
    const href = window.location.href;
    const len = href.length;
    return href.indexOf(url) > -1 && url.length == len;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}