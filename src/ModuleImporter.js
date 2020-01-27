const loader = require("./UI5ModuleLoader");
const PositionResolver = require("./resolver/PositionResolver");
const InjectionResolver = require("./resolver/InjectionResolver");
const LoaderResolver = require("./resolver/LoaderResolver");
const toPairs = require("lodash.topairs");
const deepmerge = require("deepmerge");

class ModuleImporter {
  constructor(path) {
    this.path = path;
    this.importedModule = null;
    this.resolvers = [];
  }

  createDependencyTree() {
    return this.importedModule
      .parameters.map((d) => { return { path: d, module: null }; });
  }

  createResolvers(dependencyLookup, positionDependencies, globalContext) {
    if (positionDependencies.length > 0)
      this.resolvers.push(new PositionResolver(positionDependencies));
    if (Object.keys(dependencyLookup).length > 0)
      this.resolvers.push(new InjectionResolver(dependencyLookup));
    this.resolvers.push(new LoaderResolver(this.path, (path) => {
      return new ModuleImporter(path).resolve(
        globalContext,
        dependencyLookup,
        []
      );
    }));
  }

  loadModule() {
    this.importedModule = loader.loadUI5Module(this.path);
  }

  resolve(globalContext, dependencyLookup, positionDependencies) {
    this.loadModule();
    this.createResolvers(dependencyLookup, positionDependencies, globalContext);

    let dependencies = this.createDependencyTree();

    this.resolvers.forEach((resolver) =>
      dependencies = resolver.resolve(dependencies));

    toPairs(globalContext).forEach(([key, value]) =>
      global[key] = global[key] ? deepmerge(global[key], value) : value
    );

    return this.importedModule.fn.apply(this, dependencies.map((d) => d.module));
  }

}

module.exports = ModuleImporter;
