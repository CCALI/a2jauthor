var loader = require('@loader');
var isProduction = loader.env === 'production';

if (!isProduction) {
  // 'import' is a reserved word.
  var _import = loader.import;

  loader.import = function(name) {
    if (name === 'author/main') {
      var loader = this;
      return loader.import('author/models/fixtures/').then(function(){
        return _import.call(loader, name);
      });
    }
    return _import.apply(this, arguments);
  }
}
