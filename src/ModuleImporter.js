const loader = require("./UI5ModuleLoader");
const PositionResolver = require("./resolver/PositionResolver");
const InjectionResolver = require('./resolver/InjectionResolver');
const LoaderResolver = require('./resolver/LoaderResolver');

class ModuleImporter {
  constructor(path) {
    this.path = path;
    this.globalContext = {};
    this.importedModule = null;
    this.dependencyLookup = {};
    this.resolvers = [];
  }

  resolve(global_context, dependencyLookup, positionDependencies) {
    this.globalContext = global_context;
    this.dependencyLookup = dependencyLookup;
    this.importedModule = loader.loadUI5Module(this.path);

    let dependencies = this.importedModule
      .parameters.map((d) => { return { path: d, module: null }});

    dependencies = new PositionResolver(dependencies, positionDependencies).resolve();
    dependencies = new InjectionResolver(dependencies, this.dependencyLookup).resolve();
    dependencies = new LoaderResolver(dependencies, this.path, (path) => {
      return new ModuleImporter(path).resolve(
        this.globalContext,
        this.dependencyLookup,
        []
      );
    }).resolve();

    global["sap"] = global_context;
    return this.importedModule.fn.apply(this, dependencies.map((d) => d.module));
  }

}

module.exports = ModuleImporter;
