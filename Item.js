/**
 * @fileOverview
 * Implementation of signal function
 * @author Alex Wencel <alex.wencel@gmail.com>
 * @license LGPL 2.1 license.
 * @copyright Copyright (c) 2009-2011 Alex Wencel <alex.wencel@gmail.com>
 */
///----------------------------------------------------------------------------
///----------------------------------------------------------------------------
var Signal = function() {
    if (this.constructor === arguments.callee) {
        throw Error("Signal must call as function (without new Signal()).");
        return;
    }

    var signalFunc = function() {
        if (arguments.callee.isBlocked) return false;

        //TODO: add sender - this
        var args = Array.prototype.slice.call(arguments);
        for (var i = 0; i < arguments.callee.listConnected.length; ++i) {
            var connectArgs = arguments.callee.listConnected[i];
            var thisObject = connectArgs['thisObject'];
            var func = connectArgs['func'];
            //            debug(thisObject, args, func);
            func.apply(thisObject, args);
        }
    }

    signalFunc.listConnected = [];
    signalFunc.isBlocked = false;

    signalFunc.parseArgs = Signal.parseArgs;
    signalFunc.connect = Signal.connect;
    signalFunc.disconnect = Signal.disconnect;
    signalFunc.blockSignal = Signal.blockSignal;

    return signalFunc;
}
Signal.parseArgs = function(args) {
    if (args.length < 1 || args.length > 3) return false;

    var thisObject;
    var func;
    var typeConnect;

    // Signal to Function Connections
    if (typeof(args[0]) == 'function') {
        thisObject = Signal.globalObject;
        func = args[0];
        typeConnect = args[1];
    }
    else if (typeof(args[0]) == 'object') {
        thisObject = args[0];

        // Signal to Member Function Connections
        if (typeof(args[1]) == 'function') func = args[1];
        // Signal to Named Member Function Connections
        else if (typeof(args[1]) == 'string' && typeof(thisObject[args[1]]) == 'function') func = thisObject[args[1]];
        else return false;

        typeConnect = args[2];
    }
    else {
        return false;
    }

    return {
        'thisObject': thisObject,
        'func': func,
        'typeConnect': typeConnect
    };
}
Signal.connect = function() {
    var args = this.parseArgs(arguments);
    if (!args) return false;

    if (args.func === this) // Can't connect on itself
    return false;

    for (var i = 0; i < this.listConnected.length; ++i) {
        var connectArgs = this.listConnected[i];
        if (args.thisObject === connectArgs['thisObject'] && args.func === connectArgs['func']) // Already connected
        return true;
    }

    this.listConnected.push(args);
    return true;
}
Signal.disconnect = function() {
    var args = this.parseArgs(arguments);
    var length = this.listConnected.length;

    for (var i = length - 1; i >= 0; --i) {
        var connectArgs = this.listConnected[i];
        if (!arguments.length || (args.thisObject === connectArgs['thisObject'] && args.func === connectArgs['func'])) {
            delete this.listConnected[i];
            this.listConnected.splice(i, 1);
        }
    }

    return true;
}
Signal.blockSignal = function(block) {
    if (typeof(block) == 'undefined') block = true;
    this.isBlocked = !! block;
    return this.isBlocked;
}
Signal.disconnectObject = function(obj) {
    var keys = Object.keys(obj);
    for (var i = keys.length - 1; i >= 0; --i) {
        var signal = this[keys[i]];
        if (!signal || (typeof(signal) !== "function") || !signal.connect) {
            continue;
        }
        signal.disconnect();
    }
}

Signal.globalObject = (typeof(global) !== "undefined") ? global : this;
if (typeof(module) !== "undefined") {
    module.exports = Signal;
}
///----------------------------------------------------------------------------


var util = {};
util.extend = function(destination, source) {
    for (var i = 1; i < arguments.length; i++)
    for (var key in arguments[i])
    if (arguments[i].hasOwnProperty(key)) arguments[0][key] = arguments[i][key];
    return arguments[0];
};

var gets = [];
function Item(obj) {
    if (this instanceof Item) {
        this.processObj(obj);
    }
    else {
        return new Item(obj);
    }
}

function data(obj, keyOrValue, value) {
    if (aruments.length === 2) {
        // get
    }
    if (aruments.length === 2) {
        // set,
    }
}
Item.extend = function (data) {
    var parent = this;
    var constructor = function (obj) {
        if (this instanceof constructor) {
            return parent.call(this, obj);
        }
        else {
            return new constructor(obj);
        }
    }
    constructor.extend = parent.extend;
    constructor.prototype = new parent(data); // this.as constuctor
    constructor.prototype.constructor = constructor;
    return constructor;
};

Item.prototype = {
    processFunction: function(key, value) {
        console.log("key function", key);
        var that = this

        that._slots[key] = value;

        var recalc = function() {
            this[key];
        }

        Object.defineProperty(that, key, {
            get: function() {
                var oldValue = that._values[key];

                gets = [];

                console.log("get func", key, oldValue);
                var newValue = that._slots[key].call(that);
                console.log("get func", key, oldValue, newValue);
                //TODO: clear old connects;
                for (var i = gets.length - 1; i >= 0; --i) {
                    var sender = gets[i].sender,
                        property = gets[i].key;
                    if (sender !== that || property !== key) 
                        sender[property + "Changed"].connect(that, recalc)
                    console.log("  gets", gets[i].key);

                }

                gets = null;

                gets && gets.push({
                    sender: that,
                    key: key
                });

                if (oldValue !== newValue) {
                    that._values[key] = newValue;
                    that[key + "Changed"](newValue, oldValue);
                }
                return newValue;
            },
            set: function(newValue) {
                console.log("! set function value ", key, newValue);
                var oldValue = that._values[key];
                that._values[key] = newValue;
                console.log("function set value", key, newValue);
                if (oldValue !== newValue)
                    that[key + "Changed"](newValue, oldValue);
                // this.processValue(key, value);
            },
            enumerable: true,
            configurable: true
        });
    },

    processValue: function(key, value) {
        console.log("key", key);
        var that = this
        
        //store values
        that._values[key] = value;

        //Other types
        Object.defineProperty(that, key, {
            get: function() {
                console.log("get", key, that._values[key]);
                gets && gets.push({
                    sender: that,
                    key: key
                });
                return that._values[key];
            },
            set: function(newValue) {
                console.log("set", key, that._values[key], newValue);
                if (that._values[key] === newValue) 
                    return;

                that._values[key] = newValue;
                that[key + "Changed"](newValue);
            },
            enumerable: true,
            configurable: true
        });
    },

    processObj: function(obj) {
        this._values = {};
        this._slots = {};

        var key, value
        , keysFunctions = []
        , keysValues = [];
        
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) continue;

            value = obj[key];

            //skip signals
            if (typeof(value) === "function" && value.connect) continue;
            //FIXME: skip *Changed
            if (typeof(value) === "function" && key.substring(key.length-7) === "Changed") continue;

            if (typeof(value) === "function") {
                keysFunctions.push(key);
            } else {
                keysValues.push(key);
            }
            
        }

        keysValues = keysValues.concat(keysFunctions)
        for (var i=0, l=keysValues.length; i<l; ++i) {
            key = keysValues[i];

            // process key+"Change" signal
            var slot = obj[key + "Changed"],
                value = obj[key];
            //FIXME: aplly parent value
            if (typeof(this[key]) !== "undefined") {
                this[key] = value;
                continue;
            }
            
            this[key + "Changed"] = Signal();

            if (typeof(slot) === "function") {
                this[key + "Changed"].connect(this, slot);
            }
            
            if (typeof(value) === "function") {
                this.processFunction(key, value);
            }   else {
                this.processValue(key, value);  
            }
        }
        //init values;
        for (var i=0, l=keysValues.length; i<l; ++i) {
            // need Init value ?
            // key = keysValues[i];
            // this[key+"Changed"](this[key])
        }
    }
}


! function() {
    var obj = {
        x: 1
        , xChanged: function() {
            console.log("xChanged" ,this.x, this.y);
        }
        , y: function () {return this.x*2}
        , yChanged: function() {
            console.log("yChanged" ,this.x, this.y);
        }
    }
    var d0 = +new Date
    var Obj = Item.extend(obj);
    var item = new Obj(obj);
    console.log("y=", item.y, (+new Date) - d0);
    item.x++;
    item.x+=10;
    item.x = 5

    // item.x = 100;
    console.log("y=", item.y, item.zz, (+new Date) - d0, item.width, item.width);
    item.y + item.y
    //////////////////
    console.log("---------------------------------------");
    var Point = Item.extend({
        x:0,
        xChanged : function() {this.y = this.x+20},
        y:0
    })
    var Point3D = Point.extend({
        z: 0,
        sum: function() {return this.x+this.y+this.z;}
    })
    var point = new Point3D({
        x: 100,
        p1 : Point3D(),
        p2 : Point3D({x:300}),
        })
    point.x++
    // point.y++
    console.log("point:", point.x, point.y, point.z, point.sum, point.p2.x);
}()


var Func = function (args) {
    Func.prototype.call(this, {});
    console.log("F"+JSON.stringify(this, 0,2));
}
Func.prototype = function() {
    this.$ = 22;
    console.log(JSON.stringify(this, 0,2));
}

new Func({})
this.call(0)
// model [] interface
// data.name = "ax"
// data.onChanged(key, value)
// arr.push, slice othe command interface

// сервер для components Для node