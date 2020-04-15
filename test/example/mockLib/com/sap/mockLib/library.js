sap.ui.define([], function() {
  // eslint-disable-next-line no-undef
  com.sap.mockLib.namespace; // should be populated with mock object
  sap.ui.getCore().initLibrary({
    name: "com.sap.mockLib.namespace",
    version: "2.0",
    dependencies: ["sap.ui.core"],
    types: [],
    interfaces: [],
    controls: [],
    elements: []
  });
  return "loaded";
});