// ==UserScript==
// @name         豆瓣 FM - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://fm.douban.com/
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==

const KEYS = {
    ENTER: 13, SPACE: 32, ESC: 27,
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
    A: 65, D: 68, E: 69, F: 70, R: 82, S: 83, W: 87, Z: 90, Q: 81
};

const G = {
    UpVolume: KEYS.E, DownVolume: KEYS.D, PrevSong: KEYS.S, NextSong: KEYS.F, 
    Pause: KEYS.SPACE, ToggleUI: KEYS.Q, ToggleList: KEYS.R
};


(function () {
    setTimeout(function(){
        main();
    },10);
})();

function main() {

    // init
    var timeout = 1000;
    setTimeout(function () {
        onKeyDown();
    }, timeout);

    function isShortcutKey() {
        return true;
    }

    function notPressControlKey(e){
       return !(e.altKey || e.ctrlKey || e.shiftKey);        
    }

    function onKeyDown() {
        
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && isShortcutKey() && notPressControlKey(e)) {
                handleKeyDown(e.keyCode);
            }
        };
    }

    function handleKeyDown(keyCode) {
        // var player_main = document.querySelector(".page-container .player");
        // var player_audio = document.querySelector('.page-container .player audio');

        // if(!(player_main && player_audio)){
        //     console.error('not found player');
        //     return;
        // }

        var volume = null;
        switch (keyCode) {
            case G.UpVolume:
                // fireKeyEvent(player_main, "keydown", KEYS.UP);
                volume = player_audio.volume + 0.1;
                if(volume > 1) { volume = 1; }
                player_audio.volume = volume;
                console.log(keyCode + ": UpVolume = " + volume);
                break;

            case G.DownVolume:
                // fireKeyEvent(player_main, "keydown", KEYS.DOWN);
                volume = player_audio.volume - 0.1;
                if(volume < 0) { volume = 0; }
                player_audio.volume = volume;
                console.log(keyCode + ": DownVolume = " + volume);
                break;

            case G.PrevSong:
                console.log(keyCode + ": PrevSong");
                // fireKeyEvent(player_main, "keydown", KEYS.LEFT);
                var btn = document.querySelector('.main-control-wrapper .main-control .prev');
                if(btn){
                    eventFire(btn, 'click');
                }
                break;

            case G.NextSong:
                console.log(keyCode + ": NextSong");
                fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
                // var btn = document.querySelector('.main-control-wrapper .main-control .next');
                // if(btn){
                //     eventFire(btn, 'click');
                // }
                break;

            case G.Pause:
                console.log(keyCode + ": PauseSong");
                // fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
                var btn = document.querySelector('.main-control-wrapper .main-control .play-btn');
                if(btn){
                    eventFire(btn, 'click');
                }
                break;

            case G.ToggleUI:
                console.log(keyCode + ": ToggleUI");
                self.togglePlayerUI();
                break;

            case G.ToggleList:
                console.log(keyCode + ": ToggleList");
                var play_list_control = document.querySelector('.play-list-control');
                if(play_list_control){
                    eventFire(play_list_control, 'click');
                }
                break;
            default:
                break;
        }
    }

}

// Usage: fireKeyEvent(input元素, 'keydown', 13);  
// http://blog.csdn.net/lovelyelfpop/article/details/52471878
function fireKeyEvent(el, evtType, keyCode) {
    var doc = el.ownerDocument;
    var win = doc.defaultView || doc.parentWindow,
        evtObj;
    if (doc.createEvent) {
        if (win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
        }
        else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
                get : function () { return this.keyCodeVal; }
            });
            Object.defineProperty(evtObj, 'which', {
                get : function () { return this.keyCodeVal; }
            });
            evtObj.initUIEvent( evtType, true, true, win, 1 );
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    }
    else if (doc.createEventObject) {
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}

function eventFire(el, eType){
    if (el.fireEvent) {
      el.fireEvent('on' + eType);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(eType, true, false);
      el.dispatchEvent(evObj);
    }
}



// toolkit
function Mjztool(){}
Mjztool.bytesToSize = function(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
};
Mjztool.matchURL = function(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
};
Mjztool.matchURLAbsolute = function(url) {
    const href = window.location.href;
    const len = href.length;
    return href.indexOf(url) > -1 && url.length == len;
};
Mjztool.addStyle = function(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
};
Mjztool.addFunction = function(func, name) {
    name = name || func.name;
    document[name] = func;
};
Mjztool.GM_setClipboard = function(content) {
	// @grant        GM_setClipboard
    GM_setClipboard(content);
};
Mjztool.appendScriptLink = function(src) {
    var f = document.createElement('script');
    f.src = src;
    document.body.appendChild(f);
};
Mjztool.appendStyleLink = function(src) {
    var elStyle = document.createElement("link");
    elStyle.rel="stylesheet";
    elStyle.type="text/css";
    elStyle.href = src;
    document.head.appendChild(elStyle);
};
Mjztool.randomSelect = function(list) {
    var rStart = 0;
    var rEnd = list.length;
    var randomIndex = Math.floor(Math.random() * rEnd + rStart);
    return list[randomIndex];
};
Mjztool.filterList = function(list, filter, constructor){
    if(!(list instanceof Array)) console.error('param "list" is not Array');
    if(typeof(filter) !== 'function') console.error('param "filter" is not Function');

    var result = [];
    for (var index = 0; index < list.length; index++) {
        var element = list[index];
        if (filter(element, index)) {
            if(typeof(constructor) === 'function'){
                result.push(constructor(element, index));
            }else{
                result.push(element);
            }
        }
    }
    return result;
};
Mjztool.printIt = function (printThis) {
	var win = window.open();
	win.document.open();
	win.document.write('<html><body style="white-space: pre;">');
	win.document.write(printThis);
	win.document.write('</body></html>');
	win.document.close();
	win.print();
	win.close();
};
