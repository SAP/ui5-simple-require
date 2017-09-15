/* eslint-env mocha */
"use strict";

const chai = require("chai");
const expect = chai.expect;
const API = require("../index.js");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

context("API Test", () => {

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

  describe(".createExtendable function", function () {
    it("should return a extendable object", function () {
      let spy = sinon.spy();
      let extendable = API.createExtendable({
        fn: spy
      });
      let instance = new extendable();
      instance.fn();
      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledOn(instance);
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
      // eslint-disable-next-line no-unused-vars
      let instance = new extendable();
      expect(spy).to.have.been.calledOnce;
    });

    it("should only pass functions to the resulting prototype", function () {
      let extendable = API.getExtendableStub({
        value: 1,
        fn: function () {}
      });
      expect(extendable.prototype.value).to.be.a("undefined");
      expect(extendable.prototype.fn).to.be.a("function");
    });
  });
});
