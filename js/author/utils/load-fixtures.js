var loader = require('@loader');
var _import = loader.import;
var isWindow = loader.isPlatform('window');
var isProduction = loader.isEnv('production');

// if this module is loaded, the `import` hook of the available loader will
// be overridden to make sure the fixtures module is loaded before the app's
// main module if the environment is not production.

if (isWindow && !isProduction) {
  loader.import = function(name) {
    if (name === 'caja/author/app' || name == 'caja/viewer/app') {
      var _this = this;

      var fixtures = name === 'caja/viewer/app' ?
        'caja/viewer/models/fixtures/' :
        'caja/author/models/fixtures/';

      return _this.import(fixtures).then(function() {
        return _import.call(_this, name);
      });
    }

    return _import.apply(this, arguments);
  };
}
