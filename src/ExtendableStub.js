//borrowing the excellent Typescript extender function
var __extends = function (d, b) {
  Object.setPrototypeOf(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

function ExtendableStub() {

}

ExtendableStub.extend = function (name, proto) {
  //this is a refernce to the prototype already
  //e.g. Controller.extend() , this === Controller
  var that = this;
  var NewClass = (function (superClass) {
    __extends(NewClass, superClass);
    function NewClass () {
      proto.constructor && proto.constructor();
      return superClass.apply(this, arguments) || this;
    }
    NewClass.extend = that.extend;
    for (var fn in proto) {
      // eslint-disable-next-line no-prototype-builtins
      if (proto.hasOwnProperty(fn)){
        NewClass.prototype[fn] = proto[fn];
      }
    }
    return NewClass;
  })(that);
  return NewClass;
};

module.exports = ExtendableStub;
