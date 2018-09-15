"use strict";

const path = require("path");
const deepmerge = require("deepmerge");

module.exports = {
  importFactory : function(module_path, globalContext) {
    globalContext = globalContext || {};

    let importObject = {
      fn: null,
      parameters: []
    };

    let currentContext = deepmerge(global.sap || {}, {
      ui: {
        define: function(arr, fn) {
          importObject.fn = fn;
          importObject.parameters = arr;
        },
        resource: function() {}
      }
    });

    global.sap = deepmerge(currentContext, globalContext);

    require(path.resolve(".") + module_path);
    return importObject;
  }
};
