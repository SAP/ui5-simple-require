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

    global.sap = deepmerge(globalContext, {
      ui: {
        define: function(arr, fn) {
          importObject.fn = fn;
          importObject.parameters = arr;
        },
        resource: function() {}
      }
    });

    require(path.resolve(".") + module_path);
    return importObject;
  }
};
