var util = {};
util.extend = function(destination, source) {
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
};
// ------
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
        var that = this;
        Object.defineProperty(this, key, {
            get: function() {
                return that._obj[key];
                // if (typeof(this[key]) === "function") {
                //     return value.call(that, this[key]);
                // } else {
                    
                // }
            },
            set: function(newValue) {
                if (this[key] !== newValue) {
                    console.log(key + "Changed", that._obj[key] , newValue);
                    var slot = that[key + "Changed"];
                    if (typeof(slot) === "function") {
                        slot.call(that, newValue);
                    }
                }
                that._obj[key] = newValue;
                // this.processValue(key, value);
            },
            enumerable: true,
            configurable: true
        });
        
    },

    processObj: function(obj) {
        this._obj = {}
        util.extend(this._obj, obj);
        var key, value;
        for (key in obj) {

            if (!obj.hasOwnProperty(key)) 
                continue;

            value = obj[key];

            this.processValue(key, value);
        }

    }
}


!function() {
    var obj = {
        x: 1,
        xChanged : function () {
            console.log(this.y);
        },
        y: "s",
        f:function () {
            console.log(this.x);
        }
    };
    var item = Item(obj);    
    item.f();
    item.x++
}()


