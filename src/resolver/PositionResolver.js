class PositionResolver {

  constructor(dependencies, positionBasedDependency) {
    this.dependencies = dependencies;
    this.positionBasedDependency = positionBasedDependency;
  }

  resolve() {
    for (let pos = 0; pos < this.positionBasedDependency.length; pos++) {
      this.dependencies[pos].module = this.positionBasedDependency[pos] || this.dependencies[pos].module;
    }
    return this.dependencies;
  }

}

module.exports = PositionResolver;