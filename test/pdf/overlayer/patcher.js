const test = require('ava')
const {
  testing: {
    patchText
  }
} = require('../../../lib/pdf/overlayer/patcher')

const mockFonts = (t, fontName, fontPath) => ({
  getPathForFont (name) {
    t.is(name, fontName, 'Font name should be passed')
    return fontPath
  }
})

test('patchText should call pdf.writePageText correctly', t => {
  const fontName = 'Arial'
  const fontPath = './arial.ttf'
  const fontSize = 10
  const textColor = '000000'
  const fonts = mockFonts(t, fontName, fontPath)
  const pdf = {
    getMaximumLine (path, size, width, text) {
      t.is(text, 'Hello world')
      return {text: 'Yellow', textWidth: 72, textHeight: size}
    },
    writePageText (page, options) {
      t.is(page, 0)
      t.deepEqual(options, {
        text: 'Yellow',
        top: 35, // is adjusted
        left: 20,
        fontPath,
        fontSize,
        textColor
      })
    }
  }

  const patch = {
    content: 'Hello world',
    page: 0,
    area: {
      top: 20,
      left: 20,
      width: 70,
      height: 40
    },
    text: {
      fontSize: 10,
      fontName,
      textColor,
      textAlign: 'left'
    }
  }

  patchText(pdf, patch, {fonts})
})
