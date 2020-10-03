// ==UserScript==
// @name         bangumi.tv
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  功能：替换封面、显示预览
// @author       MaiJZ
// @match        *://*.bangumi.tv/*
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

    if (matchURL('/subject_search/')) {
        showSubjectID();
        addCopySubjectIdButton();
    }
}

function showSubjectID() {

    $('#browserItemList .item').each(function () {
        var itemID = $(this).attr('id');
        console.log(itemID);
    });
}

// 添加复制按键，复制SubjectID至粘帖板
function addCopySubjectIdButton() {
    $('#browserItemList .item').each(function () {
        var itemID = $(this).attr('id');
        var text = itemID.replace('item_', '');

        var style = 'right: 5px; position: absolute; cursor: pointer; padding: 2px;';

        const btnCopy = document.createElement("input");
        btnCopy.setAttribute("type", "button");
        btnCopy.setAttribute("style", style);
        btnCopy.value = "copy ID";
        btnCopy.setAttribute("data-clipboard-text", text);
        btnCopy.setAttribute("class", "btn-clipboard");
        var clipboard = new Clipboard(".btn-clipboard");

        $(this).find('.inner:first').append(btnCopy);
    });
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