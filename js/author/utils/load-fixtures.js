var loader = require('@loader');
var _import = loader.import;
var isWindow = loader.isPlatform('window');
var isProduction = loader.isEnv('production');

// if this module is loaded, the `import` hook of the available loader will
// be overridden to make sure the fixtures module is loaded before the app's
// main module if the environment is not production, or if the environment is
// production it will load the [templates] endpoint fixtures for the author app,
// this should be removed as soon as https://github.com/CCALI/CAJA/issues/820 is
// completed.

if (isWindow && !isProduction) {
  loader.import = function(name) {
    if (name === 'author/app' || name == 'viewer/app') {
      var _this = this;

      var fixtures = name === 'viewer/app' ?
        'viewer/models/fixtures/' :
        'author/models/fixtures/';

      return _this.import(fixtures).then(function() {
        return _import.call(_this, name);
      });
    }

    return _import.apply(this, arguments);
  };
} else if (isProduction) {
  loader.import = function(name) {
    if (name === 'author/app') {
      var _this = this;
      var fixtures = 'author/models/fixtures/only-templates-fixtures';

      return _this.import(fixtures).then(function() {
        return _import.call(_this, name);
      });
    }

    return _import.apply(this, arguments);
  };
}
