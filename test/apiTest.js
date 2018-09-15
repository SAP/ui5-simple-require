/* eslint-env mocha */
"use strict";

const chai = require("chai");
const expect = chai.expect;
const API = require("../index.js");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const ui5require = API.ui5require;

context("API Test", () => {

  describe.only(".require new api", () => {

    it("Should import library without dependencies", () => {
      let m = ui5require('/test/example/UI5ModuleExample')
        .resolve();
      expect(m).to.be.an("object");
    });

    it("Should import library without dependencies", () => {
      let m = ui5require('/test/example/UI5ModuleExample')
        .resolve();
      expect(m).to.be.an("object");
    });

    it("Should import module with behavior", () => {
      let m = ui5require('/test/example/UI5ModuleWithBehavior')
        .resolve();
      expect(m).to.be.an("object");
      expect(m.behavior()).to.equal("result");
    });

    it("Should import library and inject dependency values", () => {
      let m = ui5require('/test/example/UI5InjectionExample')
        .inject('/path/to/dependency', { injectedValue: "abc" })
        .resolve();
      expect(m).to.be.an("object");
      expect(m.dep).to.be.equal("abc");
    });

    it("Should import multiple dependencies", () => {
      let m = ui5require('/test/example/UI5MultipleInjectionExample')
        .inject('/path/to/dependency1', { injectedValue: "abc" })
        .inject('/path/to/dependency2', { injectedValue: "cba" })
        .resolve()
      expect(m).to.be.an("object");
      expect(m.depOne).to.be.equal("abc");
      expect(m.depTwo).to.be.equal("cba");
    });

    it("Should inject global context object using global", () => {
      let m = ui5require('/test/example/UI5GlobalSAPExample')
        .global({ value: "abc" })
        .resolve();
      expect(m).to.be.an("object");
      expect(m.value).to.be.equal("abc");
    });

  })

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
      expect(m.resource).to.be.a("function");
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
