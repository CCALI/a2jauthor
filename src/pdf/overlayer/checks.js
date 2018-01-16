const fs = require('fs')
const path = require('path')
const {fontDir} = require('../util')

const fontPath = path.join(fontDir, 'Checkmark.ttf')
if (!fs.existsSync(fontPath)) {
  throw new Error(`Font "${fontPath}" does not exist`)
}

// See "assets/checkmark-font-demo" for the glyph map
const icon = (name, text) => ({name, text})
const checkLibrary = [
  icon('normal-check', ''),
  icon('normal-cross', ''),
  icon('hollow-circle', ''),
  icon('check-circle', ''),
  icon('solid-circle', ''),
  icon('hollow-square', ''),
  icon('check-square', ''),
  icon('solid-square', '')
]

const checks = {
  getSupportedChecks () {
    return checkLibrary
  },
  getSupportedCheckNames () {
    return checkLibrary.map(check => check.name)
  },
  getFontPath () {
    return fontPath
  },
  getTextForCheck (name) {
    const check = checkLibrary.find(check => check.name === name)
    return check && check.text
  }
}

module.exports = {
  checks
}
