class InjectionResolver {

  constructor(dependencies, lookupTable) {
    this.dependencies = dependencies;
    this.lookupTable = lookupTable;
  }

  resolve() {
    return this.dependencies.map((d) => {
      if (d.module == null && this.lookupTable[d.path]) {
        return {
          path: d.path,
          module: this.lookupTable[d.path]
        }
      }
      return d;
    });
  }

}

module.exports = InjectionResolver;