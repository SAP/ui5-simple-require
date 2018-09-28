// const ModuleImporter = require("../ModuleImporter.js");
const ModuleImporter = require("../ModuleImporter");

class LoaderResolver {

  constructor(dependencies, currentPath, loadModule) {
    this.dependencies = dependencies;
    this.currentPath = currentPath;
    this.loadModule = loadModule;
  }

  resolve() {
    let basePath = this.getBasePathFromFile(this.currentPath);
    return this.dependencies.map((d) => {
      if (d.module == null) {
        const module = this.loadModule(basePath + '/' + d.path);
        return {
          path: d.path,
          module
        }
      }
      return d;
    });
   
  }

  getBasePathFromFile(file) {
    let parts = file.split('/');
    return parts.slice(0, parts.length - 1).join('/');
  }

}

module.exports = LoaderResolver;