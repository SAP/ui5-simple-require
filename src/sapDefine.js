'use strict';

const path = require('path');

module.exports = {
	importFactory : function(module_path, globalContext) {
		globalContext = globalContext || {};
		let importObject;
		global.sap = Object.assign(globalContext, {
			ui: {
        define: function(arr, fn) {
          importObject = fn;
        }
      }
		});

    require(path.resolve('.') + module_path);
    return importObject;
	}
}
