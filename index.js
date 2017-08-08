'use strict';

module.exports = {
  importUI5Module : function(path) {
    let importObject;
    global.sap = {
      ui: {
        define: function(arr, fn) {
          importObject = fn();
        }
      }
    };

    require(path);
    return importObject;
  }
}
