"use strict";

require("jQuery");
require("_");

var $ = jQuery",
    Widget = require("ax/widget").Widget;

_.templateSettings = $.extend({}, _.templateSettings, {
    //        interpolatec: /\{\{=(.+?)\}\}/g,
    //        evaluate    : /\{\{(.+?)\}\}/g,
    //        escape      : /\{\{-(.+?)\}\}/g,
    variable: 'data'
});
exports._Widget = Widget.extend({
    template: "Template",
    render: function() {
        this.html(this.templ(this.data()));
    },
    initialize: function() {
        this.templ = _.template(this.template);
        //            console.log(this.templ.source);
    }
});
