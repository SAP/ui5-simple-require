sap.ui.define(['./UI5FakeDependency'], function(FakeDependency) {

  return {
    getNestedBehavior: function() {
      return FakeDependency.nestedBehavior();
    }
  };

});
