// ==UserScript==
// @name  mods.factorio.com
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://mods.factorio.com/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL('/mod/') || matchURL('/mods/')) {
        formatName();
        addCopyButton();
    }
}

function formatName(){
    var authorName = $('.mod-card-author a:first').text();

    var modName_el =  $('.mod-card-title a:first');
   
    var modName = modName_el.text();
    modName_el.text('[' + authorName + '] ' + modName);
}

// 添加复制按键，复制种子名字至粘帖板
function addCopyButton() {
    const el_title = document.querySelector(".mod-card-title a");
    if (el_title) {
        const btnCopy = document.createElement("input");
        btnCopy.setAttribute("type", "button");
        var style = 'color: #333; background: #ff9f1c; border-bottom: 1px solid #b56800; cursor: pointer; ';
        style += 'padding: 0 .5em; font-size: 12px; font-weight: 600;'
        btnCopy.setAttribute("style", style);
        btnCopy.value = "COPY TITLE";
        btnCopy.setAttribute("data-clipboard-text", el_title.innerHTML);
        btnCopy.setAttribute("class", "btn-clipboard");
        var clipboard = new Clipboard(".btn-clipboard");

        const el_title_parent = el_title.parentNode;
        const el_br = document.createElement("br");
        el_title_parent.appendChild(el_br);
        el_title_parent.appendChild(btnCopy);
    }
}

//////////  Utils  

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}


function copyToClipboard(txt) {
    if (window.clipboardData) {
        window.clipboardData.clearData();
        clipboardData.setData("Text", txt);
        alert("复制成功！");

    } else if (navigator.userAgent.indexOf("Opera") != -1) {
        window.location = txt;
    } else if (window.netscape) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
            alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
        }
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip)
            return;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans)
            return;
        trans.addDataFlavor("text/unicode");
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = txt;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip)
            return false;
        clip.setData(trans, null, clipid.kGlobalClipboard);
        alert("复制成功！");
    }
}
