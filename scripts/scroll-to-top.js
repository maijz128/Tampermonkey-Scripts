// ==UserScript==
// @name         Go to Top
// @namespace    https://github.com/maijz128
// @version      0.1
// @description  Scroll Back To Top Button
// @author       MaiJZ
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    const BUTTON_ID = "btnScrollToTop";
    const TOP_FUNCTION_NAME = "btnScrollToTop_TopFunction";

    addButtonStyle();
    addFunction();
    addButton();

    function addButtonStyle() {
        var style = '#' + BUTTON_ID + '{';
        style += 'display:none; position:fixed; bottom:20px; right:30px; z-index:99; ';
        style += 'font-size:15px; border:0; outline:0; background-color:lightgrey; color:#8590a6; ';
        style += 'cursor:pointer; padding:10px; border-radius:4px; box-shadow:0 1px 3px rgba(26,26,26,.1); ';
        style += '}';

        style += '#' + BUTTON_ID + ':hover { background-color: #555;  }';

        addStyle(style);
    }

    function addFunction() {
        window.addEventListener("scroll", function () {
            var minScrollTop = 50;
            if (document.body.scrollTop > minScrollTop || document.documentElement.scrollTop > minScrollTop) {
                document.getElementById(BUTTON_ID).style.display = "block";
            } else {
                document.getElementById(BUTTON_ID).style.display = "none";
            }
        });

        var strFun = 'function ' + TOP_FUNCTION_NAME + '()';
        // strFun += '{ document.body.scrollTop = 0; document.documentElement.scrollTop = 0;}';
        strFun += '{ var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight';
        strFun += 'var increment = scrollHeight / 100;';
        strFun += 'var gotoTop= function(){ var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;';
        strFun += 'currentPosition -= increment; if(currentPosition>0){window.scrollTo(0,currentPosition)}else{window.scrollTo(0,0);clearInterval(timer);timer = null}}; ';
        strFun += 'var timer=setInterval(gotoTop,1); }';

        var elScript = document.createElement("script");
        elScript.innerHTML = strFun;
        document.head.appendChild(elScript);
    }

    function addButton() {
        var elButton = document.createElement("button");
        elButton.setAttribute('id', BUTTON_ID);
        elButton.setAttribute("onclick", TOP_FUNCTION_NAME + '()');
        elButton.setAttribute('title', "Go To Top");
        elButton.innerHTML = "Top";

        document.body.appendChild(elButton);
    }


    function addStyle(styleContent) {
        var elStyle = document.createElement("style");
        elStyle.innerHTML = styleContent;
        document.head.appendChild(elStyle);
    }
})(); 