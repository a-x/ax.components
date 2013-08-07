"use strict";

require("jquery");

var $ = jQuery,
    util = require("./util");

var __ = "__",
    __gets = []


    function defineProperty(obj, name, getter, setter) {
        var defaultGet = function() {
            return obj[__ + name];
        }
        var defaultSet = function(value) {
            obj[__ + name] = value;
        }

        Object.defineProperty(obj, name, {
            get: function() {
                var caller = __gets[name];
                caller = caller || []
                __gets[name]

                return bValue;
            },
            set: function(newValue) {
                bValue = newValue;
            },
            enumerable: true,
            configurable: true
        });
    }

var div = {};

defineProperty(div, "width",

function get() {
    return this._width;
},

function set(value) {
    value = +value || 0;
    if (+value < 100 && +value > 0) {
        this._width = value;
        return true;
    }
    else {
        return false;
    }
})

div({
    id: "div",
    x: 100,
    y: 100,
    w: 400,
    h: function() {
        return this.w / 2
    },
    children: [
    div({
        id: 'child1',
        w: function() {
            return this.parent.h / 2
        }
    }),
    div({
        id: 'child2'
    })]
})

/*
1. Init all function();
2. save 
*/

function Item(obj) {
    if (this instanceof Item) {
        this.processObj(obj);
    }
    else {
        return new Item(obj);
    }
}

Item.prototype = {
    processValue: function(key, value) {
        if (typeof(value) === "function") {
            Object.defineProperty(this, key, {
                get: function() {
                    var slot = key+"Changed";
                    if (typeof(slot) === "function") {
                        slot(value);
                    }
                    return value();
                },
                set: function(newValue) {
                    this.processValue(key, value);
                },
                enumerable: true,
                configurable: true
            });
        }
        else {
            this[key] = value;
        }
    },

    processObj: function(obj) {
        this.__obj = {}
        util.extend(this.__obj, obj);
        var key, value;
        for (key in obj) {

            if (!obj.hasOwnProperty(key)) continue;

            value = obj[key];

            this.processValue("key", value);
        }

    }
}
