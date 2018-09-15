"use strict";

const ExtendableStub = require("./src/ExtendableStub");
const SAPDefine = require("./src/sapDefine");
const deepmerge = require("deepmerge");
const RequiredClass = require("./src/RequiredClass");

module.exports = {

  loaded_factories: {},

  createExtendableFromPrototype: function (proto) {
    try {
      //eslint-disable-next-line no-unused-vars
      let instance = proto();
    } catch (e) {
      if (e instanceof TypeError) {
        throw new Error("Illegal argument: only ES5 prototype accepted");
      }
      throw e;
    }
    proto.extend = ExtendableStub.extend;
    return proto;
  },

  createExtendableFromObj: function (proto) {
    return this.getExtendableStub(proto);
  },

  getExtendableStub: function(name, obj) {
    if (typeof name === "object" && !obj) {
      obj = name;
      name = null;
    }
    return ExtendableStub.extend(name || "", obj || {});
  },

  ui5require: function(module_path) {
    // TODO: check path
    return new RequiredClass(module_path);
  },

  import: function(module_path, dependencies, globalContext) {
    let importedObject;

    dependencies = dependencies || [];
    globalContext = globalContext || {};

    if (this.loaded_factories[module_path]) {
      const loaded = this.loaded_factories[module_path];
      global.sap = loaded.sap;
      importedObject = loaded.fn;
    } else {
      importedObject = SAPDefine.importFactory(module_path, globalContext).fn;
      this.loaded_factories[module_path] = {
        fn: importedObject,
        sap: global.sap
      };
    }

    return importedObject.apply(this, dependencies);
  }
};
