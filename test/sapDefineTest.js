'use strict';

let expect = require('chai').expect;
let SAPDefine = require('../src/sapDefine');

context("Test SAP define global override", function() {

	describe("Override sap global", function() {
		it("Should add .uou to sap variable", function() {
			SAPDefine.importFactory("/test/UI5ModuleExample", { uou: "pourra" } );
			expect(sap.uou).to.be.equal("pourra");
		});
	});

});
