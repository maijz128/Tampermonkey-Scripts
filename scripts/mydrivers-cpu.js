// ==UserScript==
// @name         CPU性能天梯图
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://www.mydrivers.com/zhuanti/tianti/cpu/index.html
// @match        *://www.mydrivers.com/zhuanti/tianti/cpu/index_intel.html
// @match        *://www.mydrivers.com/zhuanti/tianti/cpu/index_amd.html
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==

var CPU_BENCHMARK_API = {
    cpu : "https://www.cpubenchmark.net/cpu.php?&id=%CPU_ID%",
    high_end_cpus: "https://www.cpubenchmark.net/high_end_cpus.html",
};

var CPU_BENCHMARK_ID = {

    /**********************************************************************/
    /** Intel Xeon **/
    2052 : [ "Intel Xeon E5-2630 v2", "E5-2630 v2", "E5-2630v2"],
    
    2584 : [ "Intel Xeon E5-2678 v3", "E5-2678 v3", "E5-2678v3"],

    /**********************************************************************/
    /** Intel 4代 LGA1150 **/  
    1942 : [ "Intel Xeon E3-1230 v3",      "E3-1230 v3"    ,"E3-1230v3"      ],
    2246 : [ "Intel Xeon E3-1231 v3",      "E3-1231 v3"    ,"E3-1231v3"      ],
    2284 : [ "Intel Core i5-4690K",      "i5-4690K"    ,"酷睿i5-4690K"      ],
    1907 : [ "Intel Core i7-4770",      "i7-4770"    ,"酷睿i7-4770"      ],
    1919 : [ "Intel Core i7-4770K",      "i7-4770K"    ,"酷睿i7-4770K"      ],
    2275 : [ "Intel Core i7-4790K",      "i7-4790K"    ,"酷睿i7-4790K"      ],

    /**********************************************************************/
    /** Intel 4、5、6代 LGA2011-3 **/  
    2340 : [ "Intel Core i7-5820K",      "i7-5820K"    ,"酷睿i7-5820K"      ],
    2336 : [ "Intel Core i7-5930K",      "i7-5930K"    ,"酷睿i7-5930K"      ],
    2332 : [ "Intel Core i7-5960X",      "i7-5960X"    ,"酷睿i7-5960X"      ],
    2785 : [ "Intel Core i7-6800K",      "i7-6800K"    ,"酷睿i7-6800K"      ],
    2800 : [ "Intel Core i7-6850K",      "i7-6850K"    ,"酷睿i7-6850K"      ],
    2794 : [ "Intel Core i7-6900K",      "i7-6900K"    ,"酷睿i7-6900K"      ],
    2792 : [ "Intel Core i7-6950X",      "i7-6950X"    ,"酷睿i7-6950X"      ],
    
    /**********************************************************************/
    /** Intel 7、8、9代 LGA1151 **/  
    2693 : [ "Intel Xeon E3-1230 v5",      "E3-1230 v5"    ,"E3-1230v5"      ],
    3032 : [ "Intel Xeon E3-1230 v6",      "E3-1230 v6"    ,"E3-1230v6"      ],
    3282 : [ "Intel Xeon E3-1285 v4",      "E3-1285 v4"    ,"E3-1285v4"      ],
    3158 : [ "Intel Xeon E3-1285 v6",      "E3-1285 v6"    ,"E3-1285v6"      ],
    3479 : [ "Intel Core i3-9100",      "i3-9100"    ,"酷睿i3-9100"      ],
    3461 : [ "Intel Core i3-9100F",     "i3-9100F"   ,"酷睿i3-9100F"    ],
    3414 : [ "Intel Core i5-9400",      "i5-9400"    ,"酷睿i5-9400"      ],
    3397 : [ "Intel Core i5-9400F",     "i5-9400F"   ,"酷睿i5-9400F"    ],
    3554 : [ "Intel Core i5-9600",      "i5-9600"    ,"酷睿i5-9600"      ],
    3337 : [ "Intel Core i5-9600K",     "i5-9600K"   ,"酷睿i5-9600K"    ],
    3443 : [ "Intel Core i5-9600KF",    "i5-9600KF"  ,"酷睿i5-9600KF"  ],

    /**********************************************************************/
    /** Intel 10代 LGA1200 **/  
    /** 英特尔后缀字母是 K=可以超频 KF=可以超频无核显 F=无核显不支持超频 */

    3717 : [ "Intel Core i3-10100",     "i3-10100"      ,"酷睿i3-10100"      ],
    3737 : [ "Intel Core i5-10400",     "i5-10400"      ,"酷睿i5-10400"      ],
    3767 : [ "Intel Core i5-10400F",    "i5-10400F"     ,"酷睿i5-10400F"     ],
    3749 : [ "Intel Core i5-10500",     "i5-10500"      ,"酷睿i5-10500"      ],
    3735 : [ "Intel Core i5-10600K",    "i5-10600K"     ,"酷睿i5-10600K"     ],
    3810 : [ "Intel Core i5-10600KF",   "i5-10600KF"    ,"酷睿i5-10600KF"    ],
    3747 : [ "Intel Core i7-10700",     "i7-10700"      ,"酷睿i7-10700"      ],
    3806 : [ "Intel Core i7-10700F",    "i7-10700F"     ,"酷睿i7-10700F"     ],
    3733 : [ "Intel Core i7-10700K",    "i7-10700K"     ,"酷睿i7-10700K"     ],
    3757 : [ "Intel Core i7-10700KF",   "i7-10700KF"    ,"酷睿i7-10700KF"    ],
    3745 : [ "Intel Core i9-10900",     "i9-10900"      ,"酷睿i9-10900"      ],
    3798 : [ "Intel Core i9-10900F",    "i9-10900F"     ,"酷睿i9-10900F"     ],
    3730 : [ "Intel Core i9-10900K",    "i9-10900K"     ,"酷睿i9-10900K"     ],
    3754 : [ "Intel Core i9-10900KF",   "i9-10900KF"    ,"酷睿i9-10900KF"    ],

    /**********************************************************************/
    /** AMD Ryzen **/

    2984 : [ "AMD Ryzen 5 1600", "R5 1600", "锐龙5 1600"],
    2970 : [ "AMD Ryzen 7 1700", "R7 1700", "锐龙7 1700"],

    3183 : [ "AMD Ryzen 5 2400G", "R5 2400G", "锐龙5 2400G"],
    3243 : [ "AMD Ryzen 5 2600", "R5 2600", "锐龙5 2600"],
    3235 : [ "AMD Ryzen 5 2600X", "R5 2600X", "锐龙5 2600X"],
    3240 : [ "AMD Ryzen 7 2700", "R7 2700", "锐龙7 2700"],
    3238 : [ "AMD Ryzen 7 2700X", "R7 2700X", "锐龙7 2700X"],

    3497 : [ "AMD Ryzen 3 3200G", "R3 3200G", "锐龙3 3200G"],
    3498 : [ "AMD Ryzen 5 3400G", "R5 3400G", "锐龙5 3400G"],
    3715 : [ "AMD Ryzen 3 3100", "R3 3100", "锐龙3 3100"],
    3716 : [ "AMD Ryzen 3 3300X", "R3 3300X", "锐龙3 3300X"],
    3592 : [ "AMD Ryzen 5 3500X", "R5 3500X", "锐龙5 3500X"],
    3481 : [ "AMD Ryzen 5 3600", "R5 3600", "锐龙5 3600"],
    3494 : [ "AMD Ryzen 5 3600X", "R5 3600X", "锐龙5 3600X"],
    3781 : [ "AMD Ryzen 5 3600XT", "R5 3600XT", "锐龙5 3600XT"],
    // 3495 : [ "AMD Ryzen 5 PRO 3600", "R5 3600X", "锐龙5 3600X"],
    3485 : [ "AMD Ryzen 7 3700X", "R7 3700X", "锐龙7 3700X"],
    3499 : [ "AMD Ryzen 7 3800X", "R7 3800X", "锐龙7 3800X"],
    3797 : [ "AMD Ryzen 7 3800XT", "R7 3800XT", "锐龙7 3800XT"],
    3575 : [ "AMD Ryzen 9 3900", "R9 3900", "锐龙9 3900"],
    3493 : [ "AMD Ryzen 9 3900X", "R9 3900X", "锐龙9 3900X"],
    3778 : [ "AMD Ryzen 9 3900XT", "R9 3900XT", "锐龙9 3900XT"],
    3598 : [ "AMD Ryzen 9 3950X", "R9 3950X", "锐龙9 3950X"],
    3617 : [ "AMD Ryzen Threadripper 3960X", "Threadripper 3960X", "线程撕裂者3960X"],
    3623 : [ "AMD Ryzen Threadripper 3970X", "Threadripper 3970X", "线程撕裂者3970X"],
    3674 : [ "AMD Ryzen Threadripper 3990X", "Threadripper 3990X", "线程撕裂者3990X"],

    /**********************************************************************/

};

var CPU_BENCHMARK_SCORE = 
{"1907":{"rating":"7023","rating_st":"2171"},"1919":{"rating":"7031","rating_st":"2142"},"1942":{"rating":"6805","rating_st":"2076"},"2052":{"rating":"7455","rating_st":"1569"},"2246":{"rating":"7026","rating_st":"2158"},"2275":{"rating":"8059","rating_st":"2469"},"2284":{"rating":"5549","rating_st":"2180"},"2332":{"rating":"12692","rating_st":"1987"},"2336":{"rating":"10230","rating_st":"2050"},"2340":{"rating":"9759","rating_st":"2010"},"2584":{"rating":"14854","rating_st":"1743"},"2693":{"rating":"7609","rating_st":"2220"},"2785":{"rating":"10499","rating_st":"2254"},"2792":{"rating":"17454","rating_st":"2412"},"2794":{"rating":"13402","rating_st":"2351"},"2800":{"rating":"11266","rating_st":"2438"},"2970":{"rating":"14628","rating_st":"1995"},"2984":{"rating":"12441","rating_st":"2095"},"3032":{"rating":"8167","rating_st":"2272"},"3158":{"rating":"9276","rating_st":"2692"},"3183":{"rating":"8788","rating_st":"2178"},"3235":{"rating":"14091","rating_st":"2412"},"3238":{"rating":"17578","rating_st":"2437"},"3240":{"rating":"15724","rating_st":"2220"},"3243":{"rating":"13221","rating_st":"2262"},"3282":{"rating":"7533","rating_st":"2255"},"3337":{"rating":"10899","rating_st":"2790"},"3397":{"rating":"9598","rating_st":"2492"},"3414":{"rating":"9595","rating_st":"2511"},"3443":{"rating":"10898","rating_st":"2806"},"3461":{"rating":"6835","rating_st":"2537"},"3479":{"rating":"6667","rating_st":"2533"},"3481":{"rating":"17854","rating_st":"2583"},"3485":{"rating":"22797","rating_st":"2687"},"3493":{"rating":"32858","rating_st":"2731"},"3494":{"rating":"18312","rating_st":"2675"},"3497":{"rating":"7247","rating_st":"2232"},"3498":{"rating":"9423","rating_st":"2386"},"3499":{"rating":"23333","rating_st":"2744"},"3554":{"rating":"10741","rating_st":"2784"},"3575":{"rating":"30949","rating_st":"2653"},"3592":{"rating":"13365","rating_st":"2517"},"3598":{"rating":"39250","rating_st":"2745"},"3617":{"rating":"55543","rating_st":"2707"},"3623":{"rating":"64255","rating_st":"2707"},"3674":{"rating":"79930","rating_st":"2534"},"3715":{"rating":"11758","rating_st":"2440"},"3716":{"rating":"12796","rating_st":"2691"},"3717":{"rating":"8865","rating_st":"2647"},"3730":{"rating":"24163","rating_st":"3172"},"3733":{"rating":"19649","rating_st":"3081"},"3735":{"rating":"14577","rating_st":"2921"},"3737":{"rating":"12702","rating_st":"2609"},"3745":{"rating":"21289","rating_st":"3117"},"3747":{"rating":"17474","rating_st":"2923"},"3749":{"rating":"13419","rating_st":"2756"},"3754":{"rating":"23539","rating_st":"3121"},"3757":{"rating":"19747","rating_st":"3081"},"3767":{"rating":"12694","rating_st":"2599"},"3778":{"rating":"33197","rating_st":"2801"},"3781":{"rating":"19019","rating_st":"2834"},"3797":{"rating":"24204","rating_st":"2896"},"3798":{"rating":"21228","rating_st":"3148"},"3806":{"rating":"17251","rating_st":"2893"},"3810":{"rating":"14900","rating_st":"2781"}};
/**************************************************************************/


(function () {
    setTimeout(function(){
        main();
    },10);
})();

function main() {
    FetchAllCpuScore();
    HoverShowScore();
    ClickToCpuBenchmark();
}

// 设置Cpu链接
function ClickToCpuBenchmark(){
    if (Mjztool.matchURL("index_amd") || Mjztool.matchURL("index_intel")) {

        /*
        $("a.jgjd").each(function(){
            $(this).text("￥");
        });
        */

        $("tr td:first-child").each(function(){
            var name = $(this).text();
            name = name.replace(" 价格>>", "");
            // console.log(name);

            $(this).find('a.jgjd').text("￥");

            var id = FindIdByName(name);
            if (id) {
                var url = CPU_BENCHMARK_API.cpu.replace("%CPU_ID%", id);
                var link = '<a class="jgjd" target="_blank" href="%URL%">%TEXT%</a>';
                link = link.replace("%URL%", url);
                link = link.replace("%TEXT%", " INFO ");
                $(this).append(link);
            }

        });
    }
}

// 悬停显示分数
function HoverShowScore(){
    $("a").hover(function(){
        var name = $(this).text();
        // console.log(name);
        var id = FindIdByName(name);
        if(id){
            ShowScoreById(id, $(this));
        }
    },function(){
        $(this).text();
    });
}

function FindIdByName(name){
    for (var id in CPU_BENCHMARK_ID) {
        if (CPU_BENCHMARK_ID.hasOwnProperty(id)) {
            var names = CPU_BENCHMARK_ID[id];
            if(IsMatchName(name, names)){
                return id;
            }
        }
    }
}

function IsMatchName(text, names){
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        if (name.trim().toLowerCase() == text.trim().toLowerCase()) {
            return true;
        }
    }
}

function ShowScoreById(id, jqElement){
    var score = -1;
    var data = CPU_BENCHMARK_SCORE[id];
    if (data) {
        score = data.rating;
    }
    jqElement.attr("title", "跑分：" + score);
}

function FetchAllCpuScore(){
    for (var id in CPU_BENCHMARK_ID) {
        if(CPU_BENCHMARK_SCORE[id] == undefined){
            FetchScoreById(id);
        }
    } 
}

function FetchScoreById(id){
    var url = CPU_BENCHMARK_API.cpu.replace("%CPU_ID%", id);
    /*
    fetch(link)
    .then(function(response) {
        return response.text(); //response.json(); 
    })
    .then(function(text) {
        console.log(text);
    });
    */
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "text", //'json'
        onload: SearchScoreFromHtml,
    });
}

function SearchScoreFromHtml(r){
    // console.log(r);
    var res = r.response;
    var url = r.finalUrl;

    var id = url.split("=")[1];
    id = parseInt(id);

    var data = {
        rating      : 0,    
        rating_st   : 0,    //Single Thread Rating
    };

    // console.log(res);
    var keyRat = "#F48A18;\">";
    var keyStr = "Single Thread Rating: </strong>";

    var ratIndex = res.indexOf(keyRat);
    if (ratIndex > -1) {
        var ot = res.substr(ratIndex + keyRat.length, 10);
        // console.log(ot);
        var score = ot.split("<")[0];
        data.rating = score;
    }

    var strIndex = res.indexOf(keyStr);
    if (strIndex > -1) {
        var str = res.substr(strIndex + keyStr.length, 10);
        // console.log(ot);
        var v = str.split("<")[0];
        data.rating_st = v;
    }

    console.log(id, data);
    CPU_BENCHMARK_SCORE[id] = data;
    ShowAllScoreData();
}

function ShowAllScoreData(){

    var textID = "cpu_score_data";
    var el = document.getElementById(textID);
    if (el == null) {
        var elText = '<textarea id="cpu_score_data" rows="10" cols="30"></textarea>';
        $("body").append(elText);

        el = document.getElementById(textID);
    }

    var json = JSON.stringify(CPU_BENCHMARK_SCORE);
    // console.log(json);
    el.value = json;
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
