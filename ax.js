var ax = module.exports = {};

//ax.jquery = require("jquery");
require("sockjs");

console.log("In ax", ax, ax.jquery)

ax.util = require("./util");
ax.widget = require("./widget");
ax.servicerpc = require("./servicerpc");
ax.loader = require("./loader");
