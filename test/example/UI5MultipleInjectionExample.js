sap.ui.define(['/path/to/dependency1', '/path/to/dependency2'], function(DepOne, DepTwo) {
  return {
    depOne: DepOne.injectedValue,
    depTwo: DepTwo.injectedValue
  };
});
