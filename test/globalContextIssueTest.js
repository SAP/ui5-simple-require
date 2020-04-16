"use strict";

const expect = require("chai").expect;
const API = require("../index.js");

const ui5require = API.ui5require;

/* This test shows an error we have with global state + node context */
context("", function() {

  afterEach(() => {
    API.clearGlobalContext();
    API.clearInjection();
  });

  it("Import with global context", function() {
    API.globalContext({ sap: { value: "abc" } });
    const m = ui5require("./example/UI5GlobalSAPExample");
    expect(m.value).to.be.equal("abc");
  });

  it("Import another global context", function() {
    API.globalContext({ sap: { value: "cba" } });
    const m = ui5require("./example/UI5GlobalSAPExample");
    expect(m.value).to.be.equal("cba");
  });
});
