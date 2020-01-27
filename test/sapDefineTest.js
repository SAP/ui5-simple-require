/* global sap */

"use strict";

let expect = require("chai").expect;
let SAPDefine = require("../src/sapDefine");

context("Test SAP define global override", function() {

  describe("Override sap global", function() {
    it("Should add .testKey to sap variable", function() {

      SAPDefine.importFactory("/test/example/UI5ModuleExample", { testKey: "test_value" } );
      expect(sap.testKey).to.be.equal("test_value");
    });
    it("Should add .ui.comp.smartthing.SmartThingy to sap global variable", function() {
      SAPDefine.importFactory("/test/example/UI5ModuleExample", {ui: { comp: { smartthing:{ SmartThingy: "test_value" } } }} );
      expect(sap.ui.comp.smartthing.SmartThingy).to.be.equal("test_value");
    });
  });

});
