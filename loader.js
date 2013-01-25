(function(global) {

    var ls = global.localStorage
        , scripts = document.scripts
        , globalEval = global.execScript || global.eval // IE<9
        , createRequestObject = function() {
            if(typeof XMLHttpRequest === 'undefined') {
                XMLHttpRequest = function() {
                    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
                    catch(e) { }
                    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
                    catch(e) { }
                    try { return new ActiveXObject("Msxml2.XMLHTTP"); }
                    catch(e) { }
                    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
                    catch(e) { }
                    throw new Error("This browser does not support XMLHttpRequest.");
                };
            }
            return new XMLHttpRequest();
        }
        , get = function(url, callback) {
            var req = createRequestObject();
            req.open("GET", url);
            //req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
            req.onreadystatechange = function() {
                if(req.readyState == 4 && req.status == 200) {
                    callback(req.responseText);
                }
            }
            req.send(null);
        }

    // FIXME:Test 
    /*globalEval = function(code) {
        var s=document.getElementsByTagName('script')[0];
        var ga=document.createElement('script');
        ga.type='text/javascript';
        ga.async=true;
//        ga.src='http://www.google-analytics.com/ga.js';
        ga.text = code;
        s.parentNode.insertBefore(ga,s);
    };*/
            
    for(var i = 0, l = scripts.length; i < l; ++i) {
        var el = scripts[i]
            , src = el.getAttribute("data-src") || ""
            , version = el.getAttribute("data-version") // src.substring(src.lastIndexOf("#") + 1) //
            , key = src;

        // ... data-src="/js/script.js#0.0.1" ...
        var idx = src.lastIndexOf("#");
        if(idx > 0) {
            version = src.substring(idx + 1) //
            src = src.substring(0, idx);
            key = src;
        }
        console.log(src, version);

        // check data
        if(!src)
            continue;

        if(ls) {
            var script = ls[key] || "";
            var scriptVersion = script.substring(script.lastIndexOf("//") + 2);
            
            if(version && scriptVersion == version) { 
                globalEval(script);
            } else {
                // reload when not version;
                (function(key, version) {
                    get(src, function(script) {
                        ls[key] = script + "//" + version;
                        //document.write('<script>'+script+'<\/script>')
                        globalEval(script);
                    });
                })(key, version);
            }
        } else {
            //document.write('<script src="' + src +'"><\/script>')
            get(src, function(script) { globalEval(script); });
        }
    };
})(this)
        
        
/* $ version 
(function (global) { // $ version
    var ls = global.localStorage;
    $("script").each( function (index, element) {//TODO: selector for script
        var $el = $(element)
            , src = $el.data("src")
            , version = $el.data("version")
            , key = src //$el.data("key")
        // check data
        if (!src || !version)
            return;

        if (ls) {
            var script = ls[key] || "";
            var scriptVersion = script.substring(script.lastIndexOf("//")+2);
            if (scriptVersion == version) {
                    $.globalEval(script);
            } else {
                $.get(src, function(script) {
                    ls[key] = script + "//" + version;
                    $.globalEval(script);
                });
            }
        } else {
            $.getScript(src);
        }
    });
})(this)
*/
