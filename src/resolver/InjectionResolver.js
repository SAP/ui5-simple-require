class InjectionResolver {

  constructor(lookupTable) {
    this.lookupTable = lookupTable;
  }

  resolve(dependencies) {
    return dependencies.map((dependency) => {
      const { path } = dependency;
      if (dependency.module == null && this.lookupTable[path]) {
        return { path, module: this.lookupTable[path] };
      }
      return dependency;
    });
  }

}

module.exports = InjectionResolver;
