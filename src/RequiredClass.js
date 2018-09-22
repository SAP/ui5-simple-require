"use strict";

const SAPDefine = require("./sapDefine");
const loader = require("./UI5ModuleLoader");
const path = require("path");

const getBasePathFromFile = (file) => {
  let parts = file.split('/');
  return parts.slice(0, parts.length - 1).join('/');
}


class RequiredClass {
  constructor(path) {
    this.path = path;
    this.dependencies = {};
    this.globalContext = {};
    this.sap = {};
    this.importedModule = null;

    this.dependencyLookup = {};
  }

  inject(path, dep) {
    this.dependencyLookup[path] = dep;
    return this;
  }

  global(context) {
    this.globalContext = context;
    return this;
  }

  globalSAP(context) {
    this.sap = context;
    return this;
  }

  dissolve() {
    loader.unloadUI5Module(this.path);
    delete global["sap"];
  }

  resolve() {
    this.importedModule = loader.loadUI5Module(this.path);
    let basePath = getBasePathFromFile(this.path);
    let dependencies = this.importedModule.parameters
      .map((p) => this.dependencyLookup[p] || new RequiredClass(basePath + '/' + p).resolve());
    global.sap = this.sap;
    return this.importedModule.fn.apply(this, dependencies);
  }

  onResolve(callback) {
    callback(this.resolve());
    this.dissolve();
  }

}


module.exports = RequiredClass;
