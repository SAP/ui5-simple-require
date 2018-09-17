"use strict";

const path = require("path");

module.exports = {
  unloadUI5Module: function(file) {
    Object.keys(require.cache).filter((k) =>
      require.cache[k] &&
        require.cache[k].parent &&
        require.cache[k].parent.id === path.resolve(".") + file)
      .forEach((dep) => unloadUI5Module(dep));
    delete require.cache[path.resolve(".") + file + ".js"];
  },

  loadUI5Module: function(file) {
    this.unloadUI5Module(file);
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
    require(path.resolve(".") + file);
    delete global["sap"];
    return importedModule;
  }
}
