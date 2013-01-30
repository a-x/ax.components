// context 'this'
//
// MODULE("module.name", function(require, exports, module) {
//    "use strict";
//
//    var util = require('util')
//    module.export = {
//        a: 'a',
//        b: 2 ,
//        sum: function () {return this.a + this.b; }
//        }
//    /**   MODULE  **/
// })
   

var MODULE=(function(w,e,s,r){r=function(n,m,c){c=s+n;return r[c]?(m={},m[e]={},r[c].call(w,r,m[e],m),r[c]=0,r[s][n]=m[e]):r[s][n]||w[n]};r[s]={};
    return function(n,f){return f?(r[s+n]=f,function(d){return r(n)}):r(n)}})(this,"exports","modules");
