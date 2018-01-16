const path = require('path')

module.exports = function () {
  const rootPath = path.join(__dirname, '..', '..')

  return path.join(rootPath, 'dist', 'bundles', 'caja', 'server.css')
}
