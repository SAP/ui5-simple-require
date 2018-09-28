"use strict";
const loader = require("./UI5ModuleLoader");

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
    let basepath = getBasePathFromFile(this.path);
    let dependencies = this.importedModule.parameter.map((p) => basepath + '/' + p);
    loader.unloadUI5Module(this.path, dependencies);
    delete global["sap"];
  }

  _makeDependency(p, m) {
    return {
      path: p,
      module: m
    }
  }

  _resolvePositionDependencies(dependencies, positionDependencies) {
    for (let pos = 0; pos < positionDependencies.length; pos++) {
      dependencies[pos].module = positionDependencies[pos] || dependencies[pos].module;
    }
    return dependencies;
  }

  _resolveInjectedDependencies(dependencies) {
    return dependencies.map((d) => {
      if (d.module == null && this.dependencyLookup[d.path])
        return this._makeDependency(d.path, this.dependencyLookup[d.path])
      return d;
    });
  }

  _resolveNestedDependencies(dependencies) {
    let basePath = getBasePathFromFile(this.path);
    return dependencies.map((d) => {
      if (d.module == null)
        return this._makeDependency(d.path, new RequiredClass(basePath + '/' + d.path)
          .resolve(this.globalContext, this.dependencyLookup, []));
      return d;
    });
  }

  resolve(global_context, dependencyLookup, positionDependencies) {
    this.globalContext = global_context;
    this.dependencyLookup = dependencyLookup;

    this.importedModule = loader.loadUI5Module(this.path);

    let dependencies = this.importedModule
      .parameters.map((d) => this._makeDependency(d, null));

    dependencies = this._resolvePositionDependencies(dependencies, positionDependencies);
    dependencies = this._resolveInjectedDependencies(dependencies);
    dependencies = this._resolveNestedDependencies(dependencies);

    global["sap"] = global_context;
    return this.importedModule.fn.apply(this, dependencies.map((d) => d.module));
  }

  onResolve(callback) {
    callback(this.resolve());
    this.dissolve();
  }

}

module.exports = RequiredClass;
