// ==UserScript==
// @name  ScriptTemplate - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

const v = {};

(function () {
    initVar();
    main();
})();

function initVar() {
    v.Scripts = [
        'https://www.*.com/script.js?time=' + new Date().getTime()
    ];
}

function main() {
    const CONTAINER_ID = 'script-container';
    const elContainer = document.createElement('div');
    elContainer.setAttribute('id', CONTAINER_ID);
    document.body.appendChild(elContainer);


    for (let index = 0; index < v.Scripts.length; index++) {
        const scriptURL = v.Scripts[index];

        const elScript = document.createElement('script');
        elScript.src = scriptURL;
        elContainer.appendChild(elScript);
    }
}