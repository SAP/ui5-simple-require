const SAPRecursiveMock = require("../SAPRecursiveMock");

const isSAPDependency = (path) => path.startsWith("sap");

class InjectionResolver {

  constructor(lookupTable, loader) {
    this.lookupTable = lookupTable;
    this.loader = loader;
    this.recursiveSAPMock = new SAPRecursiveMock();
  }

  resolve(dependencies) {
    return dependencies.map((dependency) => {
      const { path } = dependency;
      if (dependency.module == null && this.lookupTable[path]) {
        return { path, module: this.lookupTable[path] };
      } else if (isSAPDependency(path)) {
        return {
          path,
          module: () => {
            const mockedObject = this.recursiveSAPMock.generateMockRecursively(path, "/");
            return mockedObject.sap;
          }
        };
      }
      return dependency;
    });
  }

}

module.exports = InjectionResolver;
