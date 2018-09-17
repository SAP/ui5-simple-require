"use strict";

const expect = require("chai").expect;
const API = require("../index.js");

const ui5require = API.ui5require;

/* This test shows an error we have with global state + node context */
context("", function() {

  it("Import with global context", function(done) {
    ui5require('/test/example/UI5ModuleExample')
      .onResolve((m) => {
        expect(m).to.be.an("object");
        done();
      });

/*
    ui5require("/test/example/UI5GlobalSAPExample")
      .globalSAP({ value: "abc" })
      .onResolve((m) => {
        console.debug(`Module is ${m}`);
        expect(m.value).to.be.equal("abc");
        done();
      });
      */
  });

  it("Import another global context", function(done) {
    ui5require("/test/example/UI5GlobalSAPExample")
      .globalSAP({ value: "cba" })
      .onResolve((m) => {
        expect(m.value).to.be.equal("cba");
        done();
      });
  });
});
