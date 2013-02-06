"use strict";

var util = module.exports = {};

util.extend = function(destination, source) {
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
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

            var self = (this instanceof child) ? this : util.extend({}, child.prototype);
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
