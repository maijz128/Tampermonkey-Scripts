// ==UserScript==
// @name        MJZ - bilibili 自动网页全屏
// @author      MaiJZ
// @license     MIT
// @namespace   MaiJZ
// @description 自动网页全屏
// @version     25.04.23
// @include     http://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/av*
// @include     http://bangumi.bilibili.com/anime/v/*
// @include     https://bangumi.bilibili.com/anime/v/*
// @include     https://www.bilibili.com/bangumi/play/*
// @include     https://www.bilibili.com/medialist/*
// @include     https://tv.cctv.com/live/*
// @include     https://www.bilibili.com/list/*
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant              GM_registerMenuCommand
// @grant              GM.registerMenuCommand
// @grant              GM_unregisterMenuCommand
// ==/UserScript==

(function () {
    setTimeout(function (){
        Main();
    }, 100);
})();

const gmFunctions = {
    setValue: typeof GM_setValue !== "undefined" ? GM_setValue : GM?.setValue ?? storage.local?.setItem.bind(storage.local),
    getValue: typeof GM_getValue !== "undefined" ? GM_getValue : GM?.getValue ?? storage.local?.getItem.bind(storage.local),
    deleteValue: typeof GM_deleteValue !== "undefined" ? GM_deleteValue : GM?.deleteValue ?? storage.local?.removeItem.bind(storage.local),
    // listValues: typeof GM_listValues !== "undefined" ? GM_listValues : GM?.listValues ?? (() => []),
    // openInTab: typeof GM_openInTab !== "undefined" ? GM_openInTab : GM?.openInTab ?? open.bind(global),
    // addElement: typeof GM_addElement !== "undefined" ? safeAddElement : (p, t, o) => appendNode(p, cE(t, o)),
    registerMenuCommand: typeof GM_registerMenuCommand !== "undefined" ? GM_registerMenuCommand : GM?.registerMenuCommand,
    unregisterMenuCommand: typeof GM_unregisterMenuCommand !== "undefined" ? GM_unregisterMenuCommand : GM?.unregisterMenuCommand,
    // contextMode: GMinfo.injectInto === "content" || GMinfo.script["inject-into"] === "content" || ["dom", "js"].includes(GMinfo.sandboxMode),
    // unsafeWindow: typeof unsafeWindow !== "undefined" ? unsafeWindow : global,
};


function Main(){
    regMenu();

    let url = GM_getValue('url');
    GM_deleteValue('url');
    if (location.hostname == 'bangumi.bilibili.com') {
        if(url === location.href){
            return;
        }
        GM_setValue('url', location.href);
        document.addEventListener('DOMContentLoaded', function () {
            window.stop();
            location.href = document.querySelector('.v-av-link').href;
        });
    } else {
        try{
            //localStorage.setItem('bilibililover', 'YESYESYES');
            //localStorage.setItem('defaulth5', '1');
        }catch(e){}
        window.addEventListener('load', function () {
            console.log("load success");
            this.$ = unsafeWindow.jQuery;
            if (window._af_load_once) {
                return;
            }else {
                window._af_load_once = true;
            }
            enterFullscreen();
        });

        document.addEventListener("visibilitychange", function() {
            if (document.hidden){
                console.log("Browser tab is hidden");
            } else {
                console.log("Browser tab is visible");
                if (window._af_visibilitychange_once) {
                    return;
                }else {
                    window._af_visibilitychange_once = true;
                }
                setTimeout(function () {
                    enterFullscreen();
                }, 2000);
            }
        });
    }


}

function regMenu(){
    // 宽屏？
    let wideMode = GM_getValue('wide-enter-mode');

    GM_unregisterMenuCommand(window._webMode_menu_command_id);
    GM_unregisterMenuCommand(window._wideMode_menu_command_id);

    var webMode_menu_name = wideMode ? "❌网页全屏" : "🟢网页全屏";
    var wideMode_menu_name = wideMode ? "🟢网页宽屏" : "❌网页宽屏";

    window._webMode_menu_command_id = GM_registerMenuCommand(webMode_menu_name, function(event) {
        GM_setValue('wide-enter-mode', false);
        regMenu();
    }, "l");
    window._wideMode_menu_command_id = GM_registerMenuCommand(wideMode_menu_name, function(event) {
        GM_setValue('wide-enter-mode', true);
        regMenu();
    }, "l");
}

function enterFullscreen() {
    if (window._enterFullscreen_once) {
        return;
    }

    if (playerStateEntered()) return;

    // window._enterFullscreen_once = true;

    let elementNames = [];


    // 宽屏？
    let wideMode = GM_getValue('wide-enter-mode');
    if (wideMode) {
        // 宽屏
        elementNames = ["bpx-player-ctrl-wide-enter"];
        var element = document.querySelector('.bpx-player-ctrl-wide.bpx-state-entered');
        if (element) {
            return;
        }
    }else{
        // 网页全屏
        elementNames = ["bpx-player-ctrl-web-enter", "bilibili-player-iconfont-web-fullscreen-off", "player_pagefullscreen_player", "squirtle-pagefullscreen-inactive"];
        var element = document.querySelector('.bpx-player-ctrl-web.bpx-state-entered');
        if (element) {
            return;
        }
    }

    for(var i = 0; i < elementNames.length; i++) {
        waitElement(elementNames[i]);
    }
}

function playerStateEntered(){
    // 宽屏？
    let wideMode = GM_getValue('wide-enter-mode');
    if (wideMode) {
        // 宽屏
        var element = document.querySelector('.bpx-player-ctrl-wide.bpx-state-entered');
        if (element) {
            return true;
        }
    }else{
        // 网页全屏
        var element = document.querySelector('.bpx-player-ctrl-web.bpx-state-entered');
        if (element) {
            return true;
        }
    }
    return false;
}

function waitElement(elementName) {
    this.$ = unsafeWindow.jQuery;
    var _times = 20,
        _interval = 1000,
        _self = document.getElementsByClassName(elementName)[0],
        _iIntervalID;
    if( _self != undefined){
        if (playerStateEntered() == false) {
            _self.click();
        }
    } else {
        _iIntervalID = setInterval(function() {
            if(!_times) {
                clearInterval(_iIntervalID);
            }
            _times <= 0 || _times--;
            _self = document.getElementsByClassName(elementName)[0];
            if(_self == undefined) {
               _self = document.getElementById(elementName);
            }
            if(_self != undefined){
                if (playerStateEntered() == false) {
                    _self.click();
                }
                clearInterval(_iIntervalID);
            }
        }, _interval);
    }
    return this;
}