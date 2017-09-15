/* global module */
"use strict";

class ExtendableStub {

  constructor(mockMethods) {
    this.mockMethods = mockMethods;
  }

  extend(name, proto) {
    return Object.assign(proto, this.mockMethods);
  }
}

module.exports = ExtendableStub;
