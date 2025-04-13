// ==UserScript==
// @name         MJZ - BitTorrents
// @namespace    https://github.com/maijz128
// @version      24.12.23
// @description  描述
// @author       MaiJZ
// @match        *://sukebei.nyaa.si/*
// @match        *://*.btdig.com/*
// @match        *://*.pkmp4.com/*
// @match        *://anybt.eth.limo/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.webstatic.cn/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==

const iTorrents_Favicon = 'https://itorrents.org/favicon.ico';


(function () {
    setTimeout(function(){
        main();
    },1000);
})();

function main() {
    if(Mjztool.matchURL("sukebei.nyaa.si"))
    {
        iTorrents_Nyaa();
    }
    if(Mjztool.matchURL("btdig.com"))
    {
        iTorrents_BTDig();
    }
    if(Mjztool.matchURL("pkmp4.com"))
    {
        setTimeout(function(){
            iTorrents_pkmp4();
        },500);
    }

    if(Mjztool.matchURL("anybt.eth.limo"))
    {
        var count = 0;
        var anybt_Int = setInterval(function(){
            if(count < 10){
                count++;
                anybt();
            }else{
                clearInterval(anybt_Int);
            }
        }, 1000);
    
    }
    
}

function iTorrents_Nyaa(){
    var favicon = iTorrents_Favicon;
    if(Mjztool.matchURL("/view/"))
    {
        var panel_footer = $('.panel-footer:first');
        if(panel_footer){
            var hash = $('kbd:first').text();
            var href = 'https://itorrents.org/torrent/' + hash + '.torrent';
            var elA = `<a href="${href}" target="_blank" class="card-footer-item">
                <img src="${favicon}" width="14px" height="14px"> iTorrents </a>`;
            panel_footer.append(elA);
        }
    }
}

function iTorrents_BTDig(){
    var favicon = iTorrents_Favicon;

    Mjztool.addStyle('.torrent_size {color: magenta !important;}');


    if(Mjztool.matchURL("/search?"))
    {
        $(".one_result .torrent_magnet a").each(function(){
            var magnet = $(this).attr("href");
            var hash = magnet.replace("magnet:?xt=urn:btih:", "");
            hash = hash.split("&")[0];
            var href = 'https://itorrents.org/torrent/' + hash + '.torrent';

            var elA = `<a href="${href}" target="_blank" class="card-footer-item">
            <img src="${favicon}" width="14px" height="14px"> iTorrents </a>`;

            $(this).parent().parent().parent().parent().append(elA);
        });
        return;
    }

    var magnet_a = $(".fa-magnet a");
    if(magnet_a)
    {
        var magnet = magnet_a.attr("href");
        var hash = magnet.replace("magnet:?xt=urn:btih:", "");
        hash = hash.split("&")[0];
        var href = 'https://itorrents.org/torrent/' + hash + '.torrent';

        var elA = `<a href="${href}" target="_blank" class="card-footer-item">
        <img src="${favicon}" width="14px" height="14px"> iTorrents </a>`;

        magnet_a.parent().parent().append(elA);
    }
}


function iTorrents_pkmp4(){
    var favicon = iTorrents_Favicon;
    if(Mjztool.matchURL("/mv/"))
    {
        $(".down-list2 span a").each(function(){
            var magnet = $(this).attr("href");
            var hash = magnet.replace("magnet:?xt=urn:btih:", "");
            hash = hash.split("&")[0];
            var href = 'https://itorrents.org/torrent/' + hash + '.torrent';

            console.log(hash);

            var elA = `<a href="${href}" target="_blank" class="card-footer-item">
            <img src="${favicon}" width="14px" height="14px">iTorrents</a>`;

            $(this).parent().append(elA);
        });

        var css = "";
        css += ".down-list2 span { display: table; margin-left: 82%;}";
        css += ".down-list3>a { font-size: 14px; max-width: 780px !important; }";
        css += ".down-list2 {padding: 6px !important;} ";
        css += ".down-list .gdt { max-height: 300px !important; }";
        css += "";
        Mjztool.addStyle(css);
    }
}


function gotoStoreTorrents(){
    
    var panel_footer = $('.panel-footer:first');
    if(panel_footer){
        var favicon = 'https://storetorrents.com/uploads/images/favicon.ico';
        var hash = $('kbd:first').text();
        var href = 'https://storetorrents.com/hash/' + hash;
        var elA = `<a href="${href}" target="_blank" class="card-footer-item">
            <img src="${favicon}" width="14px" height="14px">StoreTorrents</a>`;
        panel_footer.append(elA);
    }
}



function anybt(){
    if(Mjztool.matchURL("/search?"))
    {
        console.log('try anybt');

        // $(".search-result-item").each(function(){
        $(".copy-container").each(function(){
            var magnet = $(this).text();
            var href = magnet;
            var elA = `<a href="${href}" class="magnet-item"> 磁力链接 </a>`;

            if($(this).hasClass('added-magnet')){
                
            }else{
                $(this).addClass('added-magnet');
                $(this).parent().append(elA);
                // $(this).append(elA);
            }
            
        });
        return;
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
