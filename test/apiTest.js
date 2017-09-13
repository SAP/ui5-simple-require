'use strct';

const expect = require('chai').expect;
const API = require('../index.js');

context("API Test", () => {

  describe(".import function", () => {

    it("Should import library without dependencies", () => {
      let m = API.import('/test/example/UI5ModuleExample');
      expect(m).to.be.an('object');
    });

    it("Should import library with dependencies but pass none", () => {
      let m = API.import('/test/example/UI5DependencyExample');
      expect(m).to.be.an('object');
    });

    it("Should import library with dependencies and pass an object as dependency", () => {
      let m = API.import('/test/example/UI5DependencyExample', [ {} ]);
      expect(m).to.be.an('object');
    });

    it("Should import library and inject dependency values", () => {
      let m = API.import('/test/example/UI5InjectionExample', [ { injectedValue: 'abc' } ]);
      expect(m).to.be.an('object');
      expect(m.dep).to.be.equal('abc');
    });

    it("Should inject global sap variable when importing modules", () => {
      let m = API.import('/test/example/UI5GlobalSAPExample', [], { value: 'abc' });
      expect(m).to.be.an('object');
      expect(m.value).to.be.equal('abc');
    });

  });

});
