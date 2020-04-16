const set = require("lodash.set");

class SAPRecursiveMock {
  generateMockRecursively(path, delimiter) {
    const pathArray = path.split(delimiter);
    const objectDeepStructure = pathArray.map(text => `[${text}]`).join("");
    return set({}, objectDeepStructure, {});
  }
}

module.exports = SAPRecursiveMock;
