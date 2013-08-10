/**
* @fileOverview
* Implementation of signal function
* @author Alex Wencel <alex.wencel@gmail.com>
* @license LGPL 2.1 license.
* @copyright Copyright (c) 2009-2011 Alex Wencel <alex.wencel@gmail.com>
*/
///----------------------------------------------------------------------------
///----------------------------------------------------------------------------
var Signal = function () {
    if (this.constructor === arguments.callee) {
        throw Error("Signal must call as function (without new Signal()).");
        return;
    }

    var signalFunc = function () {
        if (arguments.callee.isBlocked)
            return false;

        //TODO: add sender - this
        var args = Array.prototype.slice.call(arguments);
        for(var i=0; i<arguments.callee.listConnected.length; ++i) {
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
    if (args.length < 1 || args.length > 3)
        return false;

    var thisObject;
    var func;
    var typeConnect;

    // Signal to Function Connections
    if (typeof(args[0]) == 'function') {
        thisObject = Signal.globalObject;
        func = args[0];
        typeConnect = args[1];
    } else if (typeof(args[0]) == 'object') {
        thisObject = args[0];

        // Signal to Member Function Connections
        if (typeof(args[1]) == 'function')
            func = args[1];
        // Signal to Named Member Function Connections
        else if (typeof(args[1]) == 'string' &&
                 typeof(thisObject[ args[1] ]) == 'function')
            func = thisObject[ args[1] ];
        else
            return false;

        typeConnect = args[2];
    } else {
        return false;
    }

    return {
            'thisObject'    : thisObject
            , 'func'        : func
            , 'typeConnect' : typeConnect
};
}
Signal.connect = function() {
    var args = this.parseArgs(arguments);
    if (!args)
        return false;

    if (args.func === this) // Can't connect on itself
        return false;

    for(var i=0; i<this.listConnected.length; ++i) {
        var connectArgs = this.listConnected[i];
        if (args.thisObject === connectArgs['thisObject']
                && args.func === connectArgs['func']) // Already connected
            return true;
    }

    this.listConnected.push( args );
    return true;
}
Signal.disconnect = function() {
    var args = this.parseArgs(arguments);
    var length = this.listConnected.length;

    for(var i=length-1; i>=0; --i) {
        var connectArgs = this.listConnected[i];
        if (!arguments.length || (args.thisObject === connectArgs['thisObject']
                                  && args.func === connectArgs['func'])) {
            delete this.listConnected[i];
            this.listConnected.splice(i, 1);
        }
    }

    return true;
}
Signal.blockSignal = function(block) {
    if (typeof(block) == 'undefined')
        block = true;
    this.isBlocked = !!block;
    return this.isBlocked;
}
Signal.disconnectObject = function(obj) {
    var keys = Object.keys(obj);
    for (var i=keys.length-1; i>=0; --i) {
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

Item.prototype = {
    processProperty: function(key, value) {
        console.log("key", key);
        var that = this;
        
        that._changedSignals[key] = Signal();
        var slot = that._obj[key + "Changed"];
        if (typeof(slot) === "function") {
            that._changedSignals[key].connect(that, slot);
        }

        if (typeof(value) === "function") {
            that._slots[key] = value;
            
            var recalc = function () {
                                this[key];
                            }

            Object.defineProperty(that, key, {
                get: function() {
                    var oldValue = that._obj[key];

                    that._gets = [];

                    var newValue = that._slots[key].call(that);
                    console.log("get func", key, oldValue, newValue);
                    //TODO: clear old connects;
                    for (var i= that._gets.length-1; i>=0; --i) {
                        var sender = that._gets[i].sender,
                            property = that._gets[i].key;
                        if (sender !== that || property !== key)    
                            sender._changedSignals[property].connect(that, recalc)    
                         console.log("  gets", that._gets[i].key);
                         
                    }
                    
                    that._gets = 0;
                    
                    // that._gets && that._gets.push({
                    //     sender: that,
                    //     key: key
                    // });

                    if (oldValue !== newValue) {
                        that._obj[key] = newValue;
                        that._changedSignals[key](newValue, oldValue);
                        // var slot = that[key + "Changed"];
                        // if (typeof(slot) === "function") {
                        //     console.log(key + "Changed", that._obj[key], newValue);
                        //     slot.call(that, newValue);
                        // }
                    }
                    return newValue;
                },
                set: function(newValue) {
                    console.log("ignore function set", key);
                    // this.processValue(key, value);
                },
                enumerable: true,
                configurable: true
            });
            that[key];
        } else {
            //Other types
            Object.defineProperty(that, key, {
                get: function() {
                    console.log("get", key, that._obj[key]);
                    that._gets && that._gets.push({
                        sender: that,
                        key: key
                    });
                    return that._obj[key];
                },
                set: function(newValue) {
                    console.log("set", key, that._obj[key], newValue);
                    if (that._obj[key] === newValue) return;

                    that._obj[key] = newValue;
                    that._changedSignals[key](newValue);
                    // var slot = that._obj[key + "Changed"];
                    // console.log("slot", key + "Changed", typeof(slot) === "function");
                    // if (typeof(slot) === "function") {
                    //     console.log(key + "Changed", that._obj[key], newValue);
                    //     slot.call(that, newValue);
                    // }
                },
                enumerable: true,
                configurable: true
            });
        }

    },

    processObj: function(obj) {
        this._obj = obj;
        this._slots = {};
        this._changedSignals = {};

        var key, value;
        for (key in obj) {

            if (!obj.hasOwnProperty(key)) continue;

            value = obj[key];

            //skip signals
            if (typeof(value) === "function" && value.connect)  continue;
            //skip *Changed slots 
            //TODO: fix slots detection
            if (typeof(value) === "function" && key.substring(key.length-7) === "Changed")  continue;

            this.processProperty(key, value);
        }

    }
}


! function() {
    var obj = {
        x: 1,
        xChanged: function() {
            console.log("xChanged", this.x, this.y);
        },
        y: function() {
            var y = this.x*2
            return y;
        },
        z: function() {
            var z = this.y*2
            console.log("z =",z)
            return z;
        },
        zz: function() {
            var z = this.z-1
            return z;
        },
        zzChanged: function() {
            console.log("zzChanged", this.zz);
        },
        width: function() {
            console.log("width", this.width);
        },
        signal: Signal(),
        "anchors.left": -50
    };
    var d0 = +new Date
    var item = Item(obj);
    // item.x++;
    
    // item.x = 100;
    console.log("z=", item.z, item.zz, (+new Date) - d0);
}()


// model [] interface
// data.name = "ax"
// data.onChanged(key, value)
// arr.push, slice othe command interface