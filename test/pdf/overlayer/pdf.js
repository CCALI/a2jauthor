const test = require('ava')
const {
  testFontFilepath,
  testImageFilepath,
  comparePdf,

  basic: {
    withPdf,
    lastPageWidth,
    lastPageHeight
  }
} = require('../helpers/pdf')
const {Pdf} = require('../../../lib/pdf/overlayer/pdf')

test('appendBlankPage should add new page to pdf', t => {
  return withPdf('append', pdfFilepath => {
    const pdf = new Pdf(pdfFilepath)

    const {
      pageNumber,
      width,
      height
    } = pdf.appendBlankPage()

    t.is(pageNumber, 1)
    t.is(width, lastPageWidth)
    t.is(height, lastPageHeight)

    return comparePdf(t, pdfFilepath, 'Basic--append-test')
  })
})

test('writePageText should write text to the pdf', t => {
  return withPdf('text', pdfFilepath => {
    const pdf = new Pdf(pdfFilepath)

    pdf.writePageText(0, {
      text: 'Hello world',
      top: 20,
      left: 20,
      fontPath: testFontFilepath,
      fontSize: 16,
      textColor: '000000'
    })

    return comparePdf(t, pdfFilepath, 'Basic--text-test')
  })
})

test('drawPageImage should draw an image to the pdf', t => {
  return withPdf('image', pdfFilepath => {
    const pdf = new Pdf(pdfFilepath)

    pdf.drawPageImage(0, testImageFilepath, {
      top: 40,
      left: 40,
      width: 200,
      height: 200
    })

    return comparePdf(t, pdfFilepath, 'Basic--image-test')
  })
})

test('_getCoordinates should remap top-left to bottom-left', t => {
  return withPdf('coord', pdfFilepath => {
    const pdf = new Pdf(pdfFilepath)

    {
      const {x, y} = pdf._getCoordinates(0, 20, 40)
      t.is(x, 20, 'x should not need remapping')
      t.is(y, lastPageHeight - 40, 'y should be height from bottom')
    }
  })
})
