"use strict";

const {expect} = require("chai")
  .use(require("sinon-chai"));
const API = require("../index.js");
const sinon = require("sinon");

const ui5require = API.ui5require;

context("API Test", () => {

  describe(".ui5require new api", () => {
    it("Should import library without dependencies", () => {
      const UI5ModuleExample = ui5require("./example/UI5ModuleExample");
      expect(UI5ModuleExample).to.be.an("object");
    });

    it("Should import same library in a different test", () => {
      const UI5ModuleExample = ui5require("./example/UI5ModuleExample");
      expect(UI5ModuleExample).to.be.an("object");
    });

    it("Should import library with absolute path", () => {
      const UI5ModuleExample = ui5require(require.resolve("./example/UI5ModuleExample"));
      expect(UI5ModuleExample).to.be.an("object");
    });

    it("Should import module with behavior", () => {
      const m = ui5require("./example/UI5ModuleWithBehavior");
      expect(m).to.be.an("object");
      expect(m.behavior()).to.equal("result");
    });

    it("Should import library and inject dependency values", () => {
      API.inject("/path/to/dependency", { injectedValue: "abc" });
      const m = ui5require("./example/UI5InjectionExample");
      expect(m).to.be.an("object");
      expect(m.dep).to.be.equal("abc");
    });

    it("COMPATIBILITY: Should import library and inject dependency via position parameter", () => {
      const m = ui5require("./example/UI5InjectionExample", [{ injectedValue: "cba" }]);
      expect(m).to.be.an("object");
      expect(m.dep).to.be.equal("cba");
    });

    it("Should import multiple dependencies", () => {
      API.inject("/path/to/dependency1", { injectedValue: "abc" });
      API.inject("/path/to/dependency2", { injectedValue: "cba" });
      const m = ui5require("./example/UI5MultipleInjectionExample");
      expect(m).to.be.an("object");
      expect(m.depOne).to.be.equal("abc");
      expect(m.depTwo).to.be.equal("cba");
    });

    it("Should import module with global context", () => {
      API.globalContext({ sap: { value: "abc" } });
      let m = ui5require("./example/UI5GlobalSAPExample");
      expect(m).to.be.an("object");
      expect(m.value).to.be.equal("abc");
    });

    it("COMPATIBILITY: Should import module with global context", () => {
      let m = ui5require("./example/UI5GlobalSAPExample", [], { sap: { value: "cba" } });
      expect(m).to.be.an("object");
      expect(m.value).to.be.equal("cba");
    });

    it("Should load nested module dependency", () => {
      let m = ui5require("./example/UI5NestedDependencyExample");
      expect(m).to.be.an("object");
      expect(m.getNestedBehavior()).to.be.equal("result");
    });

    it("Should be able to load two level's nested dependencies", () => {
      let m = ui5require("./example/UI5TwoLevelNestedDependency");
      expect(m).to.be.an("object");
      expect(m.getNestedBehavior()).to.be.equal("result");
    });

    it("Should execute script in sap.ui.require", () => {
      const Stub = class Dependency {};
      let spy = sinon.spy();
      Stub.spiedCall = spy;
      API.inject("/path/to/dependency", Stub);
      ui5require("./example/UI5SapUiRequireExample");
      expect(spy).to.have.been.calledOnce;
    });

  });
  describe(".importLib", () => {
    it("Should be able to import UI5 style library", () => {
      const ui5Library = API.importLib(
        "./example/mockLib",
        "com/sap/mockLib",
        "com.sap.mockLib.namespace"
      );
      expect(ui5Library).to.be.equal("loaded");
    });
  });
});

context("Old API Test", () => {
  describe(".import function", () => {

    it("Should import library without dependencies", () => {
      let m = API.import("/test/example/UI5ModuleExample");
      expect(m).to.be.an("object");
    });

    it("Should import library with dependencies but pass none", () => {
      let m = API.import("/test/example/UI5DependencyExample");
      expect(m).to.be.an("object");
    });

    it("Should import library with dependencies and pass an object as dependency", () => {
      let m = API.import("/test/example/UI5DependencyExample", [ {} ]);
      expect(m).to.be.an("object");
    });

    it("Should import library and inject dependency values", () => {
      let m = API.import("/test/example/UI5InjectionExample", [ { injectedValue: "abc" } ]);
      expect(m).to.be.an("object");
      expect(m.dep).to.be.equal("abc");
    });

    it("Should inject global sap variable when importing modules", () => {
      let m = API.import("/test/example/UI5GlobalSAPExample", [], { value: "abc" });
      expect(m).to.be.an("object");
      expect(m.value).to.be.equal("abc");
    });

  });

  describe(".createExtendableFromObj function", function () {
    it("should return a extendable object", function () {
      let spy = sinon.spy();
      let extendable = API.createExtendableFromObj({
        fn: spy
      });
      let instance = new extendable();
      instance.fn();
      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledOn(instance);
    });
  });

  describe(".createExtendableFromPrototype function", function () {
    it("should return an prototype extended", function () {
      let spy = sinon.spy();
      function ProtoDouble() {}
      ProtoDouble.prototype.fn = function() {};
      let Extendable = API.createExtendableFromPrototype(ProtoDouble);
      let Extended = Extendable.extend("", { func: spy });
      let extendedInstance = new Extended();
      extendedInstance.func();
      expect(spy).to.have.been.calledOnce;
    });

    it("should not allow an ES6 class to be passed as prototype", function () {
      class ProtoDouble { fn() { } }
      expect(() => API.createExtendableFromPrototype(ProtoDouble)).to.throw(Error);
    });
  });

  describe(".getExtendableStub function", function () {
    it("Should create an extendable object when empty parameters", function () {
      let extendable = API.getExtendableStub();
      expect(extendable.extend).to.be.a("function");
    });

    it("Should add the prototypes passed to the api in the object", function () {
      let spy = sinon.spy();
      let extendable = API.getExtendableStub({
        fn: spy
      });
      let instance = new extendable();
      instance.fn();
      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledOn(instance);
    });

    it("Should not have objects not passed to it", function () {
      let extendable = API.getExtendableStub({});
      let instance = new extendable();
      expect(() =>  instance.fn()).to.throw(TypeError);
    });

    it("Should add the prototypes passed to the api in the first object, but called on the second", function () {
      let spy = sinon.spy();
      let extendable = API.getExtendableStub({
        fn: spy
      });
      let secondExtendable = extendable.extend("", {});
      let instance = new secondExtendable();
      instance.fn();
      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledOn(instance);
    });

    it("should accept only the name of the class as a parameter", function () {
      let extendable = API.getExtendableStub("className");
      expect(extendable.extend).to.be.a("function");
    });

    it("should set the parent constructor", function () {
      let spy = sinon.spy();
      let extendable = API.getExtendableStub({
        constructor: function () {
          spy();
        }
      });
      expect(spy).to.have.not.been.calledOnce;
      // eslint-disable-next-line no-unused-vars
      let instance = new extendable();
      expect(spy).to.have.been.calledOnce;
    });

    it("should pass functions  and values to the resulting prototype", function () {
      let extendable = API.getExtendableStub({
        value: 1,
        fn: function () {}
      });
      let instance = new extendable();
      expect(instance.value).to.be.equal(1);
      expect(instance.fn).to.be.a("function");
      expect(() => instance.fn()).to.not.throw();
    });
    it("should add objects saved on the child to the resulting object's this", function () {
      let Extendable = API.getExtendableStub();
      let Extended = Extendable.extend("", {
        someData: {
          theData: "data"
        }
      });
      let instance = new Extended();
      expect(instance.someData.theData).to.be.equal("data");
    });
  });
});
