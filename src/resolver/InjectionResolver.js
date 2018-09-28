class InjectionResolver {

  constructor(lookupTable) {
    this.lookupTable = lookupTable;
  }

  resolve(dependencies) {
    return dependencies.map((d) => {
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