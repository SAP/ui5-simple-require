"use strict";

const expect = require("chai").expect;
const API = require("../index.js");

/* This test shows an error we have with global state + node context */
context.skip("", function() {

  it("Import with global context", function() {
    let m = API.import("/test/example/UI5GlobalSAPExample", [], { value: "abc" });
    expect(m.value).to.be.equal("abc");
  });

  it("Import another global context", function() {
    let m = API.import("/test/example/UI5GlobalSAPExample", [], { value: "cba" });
    expect(m.value).to.be.equal("cba");
  });
});
