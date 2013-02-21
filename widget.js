"use strict";

require("jquery");

var $ = jQuery,
	util = require("./util"),
    widgetKey = "__widget";

// Called on function.extend
var Widget = module.exports = util.extender({
    // TODO: Widget.data function with redraw when data changed
    // TODO: Proxy all function
    // $(initElement)
    initElement: "<div>Widget</div>"
    // initialize
    , initialize: function() { }
    // signals description {"click .btn" : clicked}
    //, TODO: signals: {} // if need
    // events description {"click .btn" : clicked}
    , events: {}
    // default object
    , defaults:{}
    // render element 
    , render: function() {
        return this;
    }
    // TODO: var listregexp = listregexp || [];
    , dataChanged: function(e, data) {
        //console.log("dataChanged", data, this);
        for (var key in data) {
            data.hasOwnProperty(key) && this.triggerHandler("data:" + key, [data[key]]); //FIXME:  this.data(key)
        }
        this.triggerHandler("data", [data]);
        //TODO: (_render === false) flag
        
        return false;
    }
    // return proxy function
    , proxy: function(func) {
        typeof(func) === "string" && ( func = this[func] );
        return $.proxy(func, this);
    }
    // apply element with id to this.id
    , applyNamesById: function() {
        var self = this;
        this.find('[id]').each(function(idx, element) {
            var $el = $(element);
            var id = $el.attr("id");
            self[id] = self[id] || $el;
        })
    }
    // proxy to this all own functions
    , applyProxy: function() {
        for (var key in this) {
            var func = this[key];
            // proxy only own functions
            if ( !( this.hasOwnProperty(key) && typeof(func) === "function" ) )
                continue;

            this[key] = $.proxy(func, this);
        }
    }
    // process events map
    , applyEvents: function() {
        var events = this.events || {};
        for (var key in events) {
            if (!events.hasOwnProperty(key))
                continue;
            var func = events[key];
            typeof(func) !== "function" && (func = this[func]);
            typeof(func) !== "function" && console.log("error function: ", func);
            var match = key.match( /^(\S+)\s*(.*)$/);
            var event = match[1], selector = match[2];
            selector ? this.on(event, selector, this.proxy(func)) : this.on(event, this.proxy(func))
        }
    }
}, function(data, el) {
    
    // FIXME: fix when called as function
    el = $(el || ((typeof(this.initElement) === "function") ? this.initElement() : this.initElement));

    var ctor = function() {};
    ctor.prototype = el;
    var widget = new ctor();

    // extend data 
    data = util.extend({}, this.defaults, widget.data(), data || {});
    data[widgetKey] = widget;
    widget.data(data);

    util.extend(widget, this);

// Some extra init
    Widget.applyNamesById && widget.applyNamesById();
    Widget.applyProxy && widget.applyProxy();
    Widget.applyEvents && widget.applyEvents();
    widget.on("dataChanged", widget.proxy(widget.dataChanged))
    widget.on("data", widget.proxy(widget.render));
    
    widget.initialize();
    
    widget.triggerHandler("dataChanged", [widget.data()]);
    return widget;
});

//----------------------------------------------------------------
// FIXME: or fix jquery - $(elem)data(obj) trigger changeData event
$.fn.data = (function() {
    var $data = $.fn.data;
    return function (key, value) {
        var res = $data.apply(this, arguments);

        // trigger only if set data
        if ( !( !arguments.length || ( arguments.length === 1 && typeof(key) === "string" ) ) ) {
            var data = {};
            typeof(key) === "string" ? data[key] = value : data = key;
            this.triggerHandler("dataChanged", data);
        }
        return res;
    };
})();
//----------------------------------------------------------------
// apply element with id to this.id
$.fn.widgets = function(func, data) {
    return this.map(function(index, element) {
        return $.data(element, widgetKey) || func(data || {}, element);
    });
};
//----------------------------------------------------------------
// apply element with id to this.id
$.fn.widget = function(func, data) {
    var $this = $(this);
    return $this.data(widgetKey) || func && (func || Widget)(data || {}, $this);
};

Widget.applyNamesById = true;
Widget.applyEvents = true;
Widget.applyProxy = false;