/* global module */
"use strict";


class ExtendableStub {

  static extend(name, proto) {
    var fnClass = proto.constructor.name !== "Object" ? proto.constructor : function () { };
    fnClass.extend = ExtendableStub.extend;
    fnClass.prototype = Object.create(this.prototype);
    for (var fnName in proto) {
      if (proto.hasOwnProperty(fnName)) {
        fnClass.prototype[fnName] = proto[fnName];
      }
    }
    fnClass.prototype.constructor = fnClass;
    return fnClass;
  }
}

module.exports = ExtendableStub;
