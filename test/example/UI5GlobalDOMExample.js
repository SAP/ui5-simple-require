sap.ui.define([], function() {
  return {
    getHTML: function() {
      return document.body.innerHTML;
    },
    changeTitle: function(newTitle) {
      document.title = newTitle;
    }
  };
});
