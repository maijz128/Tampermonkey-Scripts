// ==UserScript==
// @name         虾米网页播放器-快捷键
// @namespace    https://github.com/maijz128
// @version      0.1.1
// @description  给虾米网页播放器添加快捷键：音量（E-上调；D-下调）、下一首（F）、上一首（S）
// @author       MaiJZ
// @match        *://www.xiami.com/play*
// @grant        none
// ==/UserScript==



const KEYS = {
    ENTER: 13, SPACE: 32, ESC: 27,
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
    A: 65, D: 68, E: 69, F: 70, S: 83, W: 87, Z: 90
};

const G = {
    UpVolume: KEYS.E, DownVolume: KEYS.D, PrevSong: KEYS.S, NextSong: KEYS.F
};

(function () {
    main();
})();

function main() {
    playerHQ();
    addShortcutKeySwitch();
    onKeyDown();
}

function playerHQ() {
    var timeout = 3000;
    setTimeout(function () {
        const elHQ = document.getElementById("J_playerHQ");
        if (elHQ) {
            elHQ.click();
        }
    }, timeout);
}


function addShortcutKeySwitch() {
    var timeout = 1000;
    setTimeout(function () {
        const el = document.querySelector(".player-controls");
        if (el) {
            const elCheckbox = document.createElement("lable");
            elCheckbox.innerHTML = 
            '<input type="checkbox" name="shortchut_key" id="mjz_shortcutkeyswitch" checked="true">快捷键';

            el.appendChild(elCheckbox);
        }
    }, timeout);
}
function isShortcutKey() {
    const elSwitch = document.getElementById("mjz_shortcutkeyswitch");
    if (elSwitch) {
        return elSwitch.checked;
    }
    return true;
}

function onKeyDown() {
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && isShortcutKey()) {
            handleKeyDown(e.keyCode);
        }
    };
}

function handleKeyDown(keyCode) {
    const player_main = document.getElementById("player-main");
    switch (keyCode) {
        case G.UpVolume:
            console.log(keyCode + ": UpVolume");
            fireKeyEvent(player_main, "keydown", KEYS.UP);
            break;

        case G.DownVolume:
            console.log(keyCode + ": DownVolume");
            fireKeyEvent(player_main, "keydown", KEYS.DOWN);
            break;

        case G.PrevSong:
            console.log(keyCode + ": PrevSong");
            fireKeyEvent(player_main, "keydown", KEYS.LEFT);
            break;

        case G.NextSong:
            console.log(keyCode + ": NextSong");
            fireKeyEvent(player_main, "keydown", KEYS.RIGHT);
            break;

        default:
            break;
    }
}

// http://blog.csdn.net/lovelyelfpop/article/details/52471878
// Usage: fireKeyEvent(input元素, 'keydown', 13);  
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
