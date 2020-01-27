class LoaderResolver {

  constructor(currentPath, loadModule) {
    this.currentPath = currentPath;
    this.loadModule = loadModule;
  }

  resolve(dependencies) {
    const basePath = this.getBasePathFromFile(this.currentPath);
    return dependencies.map((d) => {
      if (d.module == null) {
        const module = this.loadModule(basePath + "/" + d.path);
        return { path: d.path, module };
      }
      return d;
    });

  }

  getBasePathFromFile(file) {
    const parts = file.split("/");
    return parts.slice(0, parts.length - 1).join("/");
  }

}

module.exports = LoaderResolver;
