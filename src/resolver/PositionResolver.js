class PositionResolver {

  constructor(positionBasedDependency) {
    this.positionBasedDependency = positionBasedDependency;
  }

  resolve(dependencies) {
    for (let pos = 0; pos < this.positionBasedDependency.length; pos++) {
      dependencies[pos].module = this.positionBasedDependency[pos] || dependencies[pos].module;
    }
    return dependencies;
  }

}

module.exports = PositionResolver;