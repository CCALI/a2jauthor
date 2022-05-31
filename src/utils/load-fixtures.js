const loader = require('@loader')
const _import = loader.import
const isWindow = loader.isPlatform('window')
const isProduction = loader.isEnv('production')

// if this module is loaded, the `import` hook of the available loader will
// be overridden to make sure the fixtures module is loaded before the app's
// main module if the environment is not production.

if (isWindow && !isProduction) {
  loader.import = function (name) {
    if (name === 'a2jauthor/app' || name === 'a2jviewer/app') {
      const _this = this

      const fixtures = name === 'a2jviewer/app'
        ? '@caliorg/a2jdeps/models/fixtures/'
        : 'a2jauthor/src/models/fixtures/'

      return _this.import(fixtures).then(function () {
        return _import.call(_this, name)
      })
    }

    return _import.apply(this, arguments)
  }
}
