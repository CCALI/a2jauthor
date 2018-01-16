const fs = require('fs')
const path = require('path')
const {fontDir} = require('../util')

const fontAsset = filename => {
  const fontPath = path.join(fontDir, filename)
  if (!fs.existsSync(fontPath)) {
    throw new Error(`"${filename}" does not exist in "${fontDir}"`)
  }
  return fontPath
}

const fontLibrary = [{
  name: 'Arial',
  path: fontAsset('Arial.ttf')
}, {
  name: 'Courier New',
  path: fontAsset('Courier New.ttf')
}, {
  name: 'Lato',
  path: fontAsset('Lato.ttf')
}, {
  name: 'Lucida Grande',
  path: fontAsset('Lucida Grande.ttc')
}, {
  name: 'Roboto',
  path: fontAsset('Roboto.ttf')
}, {
  name: 'Times New Roman',
  path: fontAsset('Times New Roman.ttf')
}]

const fonts = {
  getSupportedFontNames () {
    return fontLibrary.map(font => font.name)
  },
  getPathForFont (name) {
    const font = fontLibrary.find(font => font.name === name)
    return font && font.path
  }
}

module.exports = {
  fonts
}
