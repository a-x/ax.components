"use strict";

var util = module.exports = {};

util.extend = function(destination, source) {
    var i = arguments.length,
        source;
    while ( --i ) {
        source = arguments[i];
        for (var property in source) {
            destination[property] = source[property];
        }
    }
    return destination;
}

util.clone = function(object) {
    return util.extend({}, object);
}

util.create = function (object, proto) {
    var F = function () {};
    F.prototype = object;
    return proto ? util.extend(new F(), proto) : new F();
}

util.inherits = function(child, parent) {
    child.prototype = util.create(parent.prototype, {
        constructor: child
    });
    child.superclass = parent.prototype;
    child.extend = function(proto) {
        return function () {
            
        }
    } 

//        var F = function() { };
//        F.prototype = parent.prototype;
//        child.prototype = new F();
//        child.prototype.constructor = child;
//        child.superclass = parent.prototype;
};
    
util.extender = function(proto, func) {
    var extend = function(proto) {
        var child = function() {

//                if (!(this instanceof child)) {
//                    return new child(arguments[0], arguments[1], arguments[2],
//                    arguments[3], arguments[4], arguments[5],
//                    arguments[6], arguments[7], arguments[8]);
//                }

            var self = (this instanceof child) ? this : $.extend({}, child.prototype);
            return func ? func.apply(self, arguments) || self : self;
        };
        // TODO: extend without $
        util.extend(child.prototype, this.prototype, proto || {});
        child.extend = extend;
        child.parent = this;
        //                child.constructor = child;
        return child;
    }
    return extend.call((function() {}), proto);
}
