'use strict';

const path = require('path');

module.exports = {

  importUI5Module : function(module_path, dependencies) {
    let importObject;
    global.sap = {
      ui: {
        define: function(arr, fn) {
          importObject = fn.apply(this, dependencies);
        }
      }
    };

    require(path.resolve('.') + module_path);
    return importObject;
  }
}
