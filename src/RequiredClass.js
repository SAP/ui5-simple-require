"use strict";

const SAPDefine = require("./sapDefine");

const NODE_CONTEXT = {};

const getBasePathFromFile = (file) => {
  let parts = file.split('/');
  return parts.slice(0, parts.length - 1).join('/');
}


class RequiredClass {
  constructor(path) {
    this.path = path;
    this.dependencies = {};
    this.globalContext = {};
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

  resolve() {
    if (NODE_CONTEXT[this.path]) {
      let loadedModule = NODE_CONTEXT[this.path];
      this.importedModule = loadedModule.module;
    } else {
      this.importedModule = SAPDefine.importFactory(this.path, this.globalContext);
      NODE_CONTEXT[this.path] = {
        module : this.importedModule
      }
    }

    let basePath = getBasePathFromFile(this.path);

    let dependencies = this.importedModule.parameters
      .map((p) => this.dependencyLookup[p] || new RequiredClass(basePath + '/' + p).resolve());
    return this.importedModule.fn.apply(this, dependencies);
  }

}


module.exports = RequiredClass;
