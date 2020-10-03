// ==UserScript==
// @name         DevScript
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  开发用脚本
// @author       MaiJZ
// @match        *://bangumi.tv/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==
// @require      http://localhost:3006/bangumi.tv.js
// @require      https://greasyfork.org/scripts/369596-fileobserver/code/FileObserver.js

/**
 * 说明：  FileObserver.js 功能： 自动刷新脚本，配合本地FileObserver.jar使用
 *        用@require 引用本地正在开发的脚本，配合使用 VSCode Browser Sync 扩展
 */


(function () {
    appendScriptLink('https://greasyfork.org/scripts/369596-fileobserver/code/FileObserver.js');
    appendScriptLink('https://cdn.bootcss.com/vue/2.5.16/vue.min.js');
    appendScriptLink('https://greasyfork.org/scripts/369588-imageviewer/code/ImageViewer.js');
    appendStyleLink('http://localhost:8193/file/bangumi.tv.css');
    setTimeout(function () {
        var fo = new FileObserver();
        fo.canDebug(true);
        fo.connect();

        appendScriptLink('http://localhost:8193/file/bangumi.tv.js');
    }, 1000);

})();


function appendScriptLink(src) {
    var f = document.createElement('script');
    f.src = src;
    document.body.appendChild(f);
}
function appendStyleLink(src) {
    var elStyle = document.createElement("link");
    elStyle.rel="stylesheet";
    elStyle.type="text/css";
    elStyle.href = src;
    document.head.appendChild(elStyle);
}
function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}
