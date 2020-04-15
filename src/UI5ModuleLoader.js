"use strict";

const path = require("path");
const getCaller = require("parent-module");

module.exports = {
  _removeFromCacheIfExists: function(modulePath) {
    if (require.cache[modulePath])
      delete require.cache[modulePath];
  },

  loadUI5Module: function(file) {
    const importedModule = {
      fn: null,
      parameters: []
    };

    global.sap = {
      ui: {
        define: function(dep, fn) {
          importedModule.parameters = dep;
          importedModule.fn = fn;
        },
        require: function(dep, fn) {
          importedModule.parameters = dep;
          importedModule.fn = fn;
        }
      }
    };

    const mainScript = require.resolve("../index.js");
    const callerDir = path.dirname(getCaller(mainScript));
    const requirePath = require.resolve(file, {paths: [callerDir]});
    this._removeFromCacheIfExists(requirePath);
    require(requirePath);
    delete global["sap"];
    this._removeFromCacheIfExists(requirePath);
    return importedModule;
  }
};
