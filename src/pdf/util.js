const fs = require('fs')
const path = require('path')

const root = path.dirname(path.dirname(__dirname))

// TODO: expose as env var or use a well-known storage path
const pdfDir = path.join(root, 'pdf')
const tempDir = path.join(pdfDir, 'temp')

function ensureEmptyDir (filepath) {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
  fs.mkdirSync(filepath)
}

const paths = {
  tempDir,
  fontDir: path.join(pdfDir, 'assets', 'fonts'),
  fixtureDir: path.join(pdfDir, 'fixtures'),

  setup () {
    ensureEmptyDir(pdfDir)
  }
}

module.exports = paths
