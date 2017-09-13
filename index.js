'use strict';

const ExtendableStub = require('./src/ExtendableStub');
const SAPDefine = require('./src/sapDefine');

module.exports = {

	loaded_factories: {},

	createExtendable: function(mockMethods) {
		return new ExtendableStub(mockMethods);
	},

	import : function(module_path, dependencies, globalContext) {
		let importedObject;

		dependencies = dependencies || [];
		globalContext = globalContext || {};

		if (this.loaded_factories[module_path]) {
			importedObject = this.loaded_factories[module_path];
		} else {
			importedObject = SAPDefine.importFactory(module_path, globalContext);
			this.loaded_factories[module_path] = importedObject;
		}

		return importedObject.apply(this, dependencies);
	}
};
