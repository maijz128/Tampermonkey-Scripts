// ==UserScript==
// @name  storetorrents.com - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.3.1
// @description  描述
// @author       MaiJZ
// @match        *://storetorrents.com/*
// @match        *://storetorrents.xyz/*
// @grant        none
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js
// ==/UserScript==


(function () {

    main();
})();


function main() {

    if (matchURL("/download")) {
        autoRetrun();
    } else if (matchURL("/hash") || matchURL("/torrent")) {
        autoEnter();
        addCopyButton();
    }
}

// 当输入4位验证码时，自动提交
function autoEnter() {
    const el_captcha = document.getElementById("captcha");
    const el_downloadform = document.getElementById("downloadform");
    el_captcha.oninput = function () {
        console.log("captcha onchage.");
        const captcha = el_captcha.value;
        if (captcha && captcha.length >= 4) {
            el_downloadform.submit();

            autoCloseSite();
        }
    };
}

// 添加复制按键，复制种子名字至粘帖板
function addCopyButton() {
    const el_file_name = document.querySelector(".file_name");
    if (el_file_name) {
        const btnCopy = document.createElement("input");
        btnCopy.setAttribute("type", "button");
        btnCopy.setAttribute("style", "color: #fff; background: #036; cursor: pointer; font-size: 1em; height: 40px; padding: 5px;");
        btnCopy.value = "copy torrent name";
        btnCopy.setAttribute("data-clipboard-text", el_file_name.innerHTML);
        btnCopy.setAttribute("class", "btn-clipboard");
        var clipboard = new Clipboard(".btn-clipboard");

        const el_file_name_parent = el_file_name.parentNode;
        const el_br = document.createElement("br");
        el_file_name_parent.appendChild(el_br);
        el_file_name_parent.appendChild(btnCopy);
    }
}

// 当输入错误的验证码时，自动返回
function autoRetrun() {
    window.history.go(-1);
}

// 当下载BT一段时间后自动关闭网页

function autoCloseSite() {
    setTimeout(() => {
        window.close();
    }, 30 * 1000);
}



function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
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