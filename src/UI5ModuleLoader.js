"use strict";

const path = require("path");

module.exports = {
  unloadUI5Module: function(file, dependencies) {
    dependencies.forEach((d) => delete require.cache[path.resolve(".") + d + ".js"]);
    delete require.cache[path.resolve(".") + file + ".js"];
  },

  _removeFromCacheIfExists: function(modulePath) {
    if (require.cache[modulePath])
      delete require.cache[modulePath];
  },

  loadUI5Module: function(file) {
    // this.unloadUI5Module(file, []);
    const importedModule = {
      fn: null,
      parameters: []
    };

    global.sap = {
      ui: {
        define: function(dep, fn) {
          importedModule.parameters = dep;
          importedModule.fn = fn;
        }
      }
    }

    const requirePath = path.resolve(".") + path.normalize(file + ".js");
    this._removeFromCacheIfExists(requirePath);
    require(path.resolve(".") + file);
    delete global["sap"];
    this._removeFromCacheIfExists(requirePath);
    return importedModule;
  }
}
