"use strict";

require("jquery");

var $ = jQuery,
    _ = require("underscore"),
    Widget = require("./widget");

_.templateSettings = $.extend({}, _.templateSettings, {
    //        interpolatec: /\{\{=(.+?)\}\}/g,
    //        evaluate    : /\{\{(.+?)\}\}/g,
    //        escape      : /\{\{-(.+?)\}\}/g,
    variable: 'data'
});
var Widget = module.exports= Widget.extend({
    template: "Template{{ <%a%> }}",
    render: function() {
        this.html(this.templ(this.data()));
    },
    initialize: function() {
        this.templ = _.template(this.template);
        //            console.log(this.templ.source);
    }
});
