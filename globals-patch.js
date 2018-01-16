var loader = require("@loader");

var globalsHelper = loader.get("@@global-helpers");

var prepareGlobal = globalsHelper.prepareGlobal;
var retrieveGlobal = globalsHelper.retrieveGlobal;

loader.set("@@global-helpers", loader.newModule({
  prepareGlobal: function(moduleName, deps, exportName) {
    if(arguments.length === 1 && typeof moduleName === "object") {
      var options = moduleName;
      moduleName = options.name;
      deps = options.deps;
      exportName = options.exports;
    }

    prepareGlobal(moduleName, deps, exportName);
  },

  retrieveGlobal: retrieveGlobal
}));
