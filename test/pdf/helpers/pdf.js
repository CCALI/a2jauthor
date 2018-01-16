const fs = require('fs-extra')
const path = require('path')
const promisify = require('util.promisify')
const fixtureDir = require('../../../lib/pdf/util').fixtureDir

const basicPdf = path.join(fixtureDir, 'Basic.pdf')

async function withPdf (basename, callback) {
  const filepath = path.join(fixtureDir, 'tmp-' + basename + '.pdf')
  await promisify(fs.copy)(basicPdf, filepath)

  let subError
  return Promise.resolve()
    .then(() => callback(filepath))
    .catch(error => {
      subError = error
    })
    .then(() => new Promise((resolve, reject) => {
      fs.unlink(filepath, error => error ? reject(error) : resolve())
    }))
    .then(() => {
      if (subError) throw subError
    })
}

function stripRandom (text) {
  return text
    .replace(/\/ModDate \(*\)/g, '/ModDate (...)')
    .replace(/\/ID \[*\]/g, '/ID (...)')
}

async function comparePdf (t, actualFile, expectedName) {
  const expectedFile = path.join(fixtureDir, expectedName + '.pdf')
  const actualText = await promisify(fs.readFile)(actualFile).toString()
  const expectedText = await promisify(fs.readFile)(expectedFile).toString()
  t.is(stripRandom(actualText), stripRandom(expectedText), `"${actualFile}" !== "${expectedFile}"`)
}

module.exports = {
  testFontFilepath: path.join(fixtureDir, 'TestFont.ttf'),
  testImageFilepath: path.join(fixtureDir, 'TestImage.jpg'),
  comparePdf,

  basic: {
    withPdf,
    lastPageWidth: 612,
    lastPageHeight: 792
  }
}
