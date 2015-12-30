var loader = require('@loader');

// if this module is loaded, the `import` hook of the available loader will
// be overridden to make sure the fixtures module is loaded before the app's
// main module if the environment is not production.

if (loader.isPlatform('window') && !loader.isEnv('production')) {
  // 'import' is a reserved word.
  var _import = loader.import;

  loader.import = function(name) {
    if (name === 'author/app' || name == 'viewer/app') {
      var _this = this;

      var fixtures = (name === 'viewer/app') ?
        'viewer/models/fixtures/' :
        'author/models/fixtures/';

      return _this.import(fixtures).then(function() {
        return _import.call(_this, name);
      });
    }

    return _import.apply(this, arguments);
  };
}
