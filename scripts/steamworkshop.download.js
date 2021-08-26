// ==UserScript==
// @name         steamworkshop.download
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.steamcommunity.com/sharedfiles/filedetails/?id=*
// @match        *://*.steamcommunity.com/workshop/filedetails/?id=*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==


const arrow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEHklEQVRYR8WX/U9aVxjHH1QEX2O2mUXv5W4xVhHkVdDq1rk2KfWFJSbdzLa/ZO+/tNvav6BLuiyZ+6X7wUXFJV2XtNsPa6uiKIoIiLQCviUkRgP3KupZHghNq3B52izZ+YWE+z3f7+c85zkn9yrgfx4Kan4wtBqVJImn6NVqdazlXLOGoiUDLHgX2VuCACpVOQDgNHbKP/vfweEhPH26DiajgeRNEmHS/IKXtbacA7VaLbswSZIgEAyB2WQkeZNEmOiZX2Da1hYSwEogCBazieRNEiHAnGeeaVtboaKieAX8KwGwWswkb5IIAWbnPKxNiwAVslsgShL4/SvQYbWQvEkiTHTPzjFdm7Y4gCjCsn8FbB1WkjdJhAAz7lmm17WRAHzLfrDbOkjeJBECTM+4WbteRwJY8i1Dp91G8iaJMgDTM0zfrofKIj2QSong8/mgs9NO8iaJEGBqapq1I0BlpWwTpkQRlhaXoKurk+RNEmHi46lpZqAApFKwuOSD8/81wKNHj5nRaChegVQKvN5F6O4+T1ocSYQV+OfhQ2Y0GKGysgIUivzTGGOAPeBd9MI7PT0kb5IIAR789TezmE2kU+CZX4CL7/eSvEkiBLh3709msViKXsWiKIHH4wGH4zLJmyRCANfk78zWYQWVSiV7Cg4ODvDWhA+cgyTvMyKXa3IrnU6/mS/FbreBUqmU7YHDdBrcM+68kEqlUnI6B99WKBTbOcEZgNGxMfGN115X81xjRpNtOAXgD74LHB0dATZboYGA+E6QlbBn2lh8A7a2tmBwoN9UXV3tLQiQSCQu37//wNXY2KASBAHS6fQzE4Q5OTmRBSgtLX1Bj0Dr6+sQiTyBnp7ua01NTd88D593nxKJhOPu3T8mOI5TaTQ84L5icKHjd7oaWKGSkpJMv0SjMViLROC9C+9ea25ufiE8U+FCpUQI1+TkBNeYhRBFEY6Pj2UbMPcQw/HKzoSvRaC398J1rVb7db7Jsp26vb19ZWLCNc7znIrneUgmk0UhcAuqqqogFotBOLwGly5dvK7T6fKGy1YgR4sQo6O/jfM8r+K4RlmIXHg8vgHhcBgcDse3er3uK7mykc4qQty58+uERsOXcxwH+/v7ZyqB4TU1NRCPxyG0GoaB/r7vDAbDl8X2jASAJjs7O30jI7+MazSacqzE3t5e5kjiKCsrg9raWsCVr66GwOl0fm8ymb4oFk7agudNNjZ2+n4e+WlcyEBwsLu7m3lcV1eXXXkoBENDQzfMZvPnlPCXBsAJm5ub/bdv/zgmCEKmEjhw5YFgED768OoNq9VKDn8lgBzErVs/jAmCBr/TIBAIwvDw8E273fYZdeUFb0KqQTQaHUAIURSVH3/6yc0uu/2lw1+5AjnIZDLZkEqlGurr6+eo4Kd1/wLmE60w0vLGGQAAAABJRU5ErkJggg==";

function getIframeAnchor()
{
    return getPageType() === 'item' ? jQuery("div.workshopItemPreviewArea") : jQuery("div.collectionControls");
}

function getButtonAnchor() {
    return getPageType() === 'item' ? jQuery("#SubscribeItemBtn") : (
        jQuery("div.subscribeCollection:contains('Subscribe')").find('> span').last().length
            ? jQuery("div.subscribeCollection:contains('Subscribe')").find('> span').last() // Has a subscribe collection box, use that.
            : jQuery("div.workshopItemDescriptionTitle:contains('Items')").find("> span") // Use the defailt items count title.
    );
}

/**
 * Determine the type of page based on the elements displayed on it.
 */
function getPageType() {
    if (jQuery("div.game_area_purchase_game").length && jQuery("span.subscribeText").length) {
        return 'item';
    } else if (jQuery("#mainContentsCollection").length) {
        return 'collection';
    }

    return null;
}


/**
 * When the download button is pressed, insert an iframe with the download page into the site.
 */
function onDownloadWorkshopItem() {
    // Hide the iframe in case it already exists- a toggle
    const downloadButton = jQuery('#downloadSteamWorkshopButton');
    const existingItemPanel = jQuery('#downloadWorkshopItemIframe');
    if (existingItemPanel.length) {
        existingItemPanel.remove();
        downloadButton.find('img').first().css('transform', '');
        return;
    }

    // Button was pressed, invert its icon, then insert the iframe.
    downloadButton.find('img').first().css('transform', 'rotate(180deg)');

    getIframeAnchor().after(`<iframe
            allowtransparency='true'
            onload="window.parent.postMessage(['steamdownloaderFrameLoaded', true], '*')"
            style="height: 0; margin: 0; padding: 0; border: 0; width: 100%;"
            scrolling="no"
            id="downloadWorkshopItemIframe"
            src="//steamworkshopdownloader.io/extension/embedded/${new URLSearchParams(window.location.search).get('id')}"/>`);
}

function onDownloadWorkshopItem2() {
    // Hide the iframe in case it already exists- a toggle
    const downloadButton = jQuery('#downloadSteamWorkshopButton');
   
    var src=`http://steamworkshop.download/download/view/${new URLSearchParams(window.location.search).get('id')}`;
    window.open(src);
}


/**
 * Add window events.
 */
function addWindowEvents() {
    /**
     * The plugin loads an iframe with the download site on it.
     * We are able to make the iframe access its outside frame using messages.
     * We use this functionality to push the scroll height to the parent window, resize the iframe to fit its content using a script and to close the iframe.
     */
    window.addEventListener('message', function (e) {
        const frame = jQuery("#downloadWorkshopItemIframe");
        const button = jQuery('#downloadSteamWorkshopButton');

        //
        const eventName = e.data[0];
        const data = e.data[1];

        switch (eventName) {
            case 'downloadSteamWorkshopButtonPressed':
                onDownloadWorkshopItem2();
                break;
            // case 'steamdownloaderFrameLoaded':
            //     getIframeAnchor().css("margin-bottom", "8px");
            //     break;
            // case 'steamdownloaderResizeIframe':
            //     frame.css('height', `${data}px`);
            //     break;
            // case 'steamdownloaderScrollToFrame':
            //     jQuery([document.documentElement, document.body]).animate({
            //         scrollTop: frame.offset().top - 100
            //     }, 100);
            //     break;
            // case 'steamdownloaderClose':
            //     button.trigger('click');
            //     break;
        }
    }, false);
}

/**
 * Add a download button into the page on the specific anchor element.
 */
function addButton() {
    const downloadButton = getPageType() === 'item' ?
        `<a id="downloadSteamWorkshopButton" class="btn_darkblue_white_innerfade btn_medium" style="margin: 2px; float: right;" onclick="window.parent.postMessage(['downloadSteamWorkshopButtonPressed', true], '*')"> 
        <img style="position: absolute; margin-left: 6px; margin-top: 6px;" width="16px" height="16px" src="${arrow}"/> 
        <span style="padding-left: 32px; padding-right: 32px;"> 
            steamworkshop.download
        </span> 
    </a>` : `<a id="downloadSteamWorkshopButton" class="btn_darkblue_white_innerfade btn_medium" style="height: 26px; float: right;" onclick="window.parent.postMessage(['downloadSteamWorkshopButtonPressed', true], '*')"> 
        <img style="position: absolute; margin-left: 6px; margin-top: 4px;" width="14px" height="14px" src="${arrow}"/> 
        <span style="padding-left: 32px; padding-right: 32px; line-height: 22px;"> 
            Download all
        </span> 
    </a>`;

    if (getPageType() === 'item') {
        getButtonAnchor().css('float', 'right');
    }

    getButtonAnchor().after(downloadButton);
}

(() => {
    const load = () => {
        // Only neccesary when ran as a userscript: keep retrying until jQuery is available from the page headers.
        if(typeof jQuery === 'undefined') {
            setTimeout(load, 50);
        }

        if (getPageType() == null) {
            return;
        }

        addWindowEvents();
        addButton();
    };

    load();
})();



function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
        "" :
        ";expires="+exdate.toUTCString() + ";path=/");
}

function deleteCookie( name ) {
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
