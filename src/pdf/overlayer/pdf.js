const fs = require('fs')
const hummus = require('hummus')
const {getMaximumLine} = require('./wrap')

class Pdf {
  constructor (pdfFilepath) {
    this.pdfFilepath = pdfFilepath
    this.pageModifiers = {}
    this.pageModifierUsers = {}
    this.pageContexts = {}
  }

  _withWriter (callback) {
    if (!this.writer) {
      this.writer = hummus.createWriterToModify(this.pdfFilepath)
      this.writerUsers = 0
    }
    this.writerUsers++

    const ret = callback(this.writer)

    this.writerUsers--
    if (this.writerUsers === 0) {
      this.writer.end()
      delete this.writer
    }

    return ret
  }

  _withReader (callback) {
    if (!this.reader) {
      this.reader = hummus.createReader(this.pdfFilepath)
      this.readerUsers = 0
    }
    this.readerUsers++

    const ret = callback(this.reader)

    this.readerUsers--
    if (this.readerUsers === 0) {
      // this.reader.end()
      delete this.reader
    }

    return ret
  }

  _withPageModifier (pageNumber, callback) {
    return this._withWriter(writer => {
      if (!this.pageModifiers[pageNumber]) {
        const hasIndependentGraphicState = true
        const modifier = new hummus.PDFPageModifier(writer, pageNumber, hasIndependentGraphicState)
        this.pageModifiers[pageNumber] = modifier
        this.pageModifierUsers[pageNumber] = 0
      }
      this.pageModifierUsers[pageNumber]++

      const ret = callback(this.pageModifiers[pageNumber])

      this.pageModifierUsers[pageNumber]--
      if (this.pageModifierUsers[pageNumber] === 0) {
        this.pageModifiers[pageNumber].writePage()
        delete this.pageModifiers[pageNumber]
        delete this.pageModifierUsers[pageNumber]
      }

      return ret
    })
  }

  _withPageContext (pageNumber, callback) {
    return this._withPageModifier(pageNumber, modifier => {
      if (!this.pageContexts[pageNumber]) {
        modifier.startContext()
        this.pageContexts[pageNumber] = 0
      }
      this.pageContexts[pageNumber]++

      const ret = callback(modifier.getContext())

      this.pageContexts[pageNumber]--
      if (this.pageContexts[pageNumber] === 0) {
        modifier.endContext()
      }

      return ret
    })
  }

  _ensureFontPath (fontPath) {
    if (!fs.existsSync(fontPath)) {
      throw new Error(`Font not found at "${fontPath}"`)
    }
  }

  _ensureImagePath (imagePath) {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image not found at "${imagePath}"`)
    }
  }

  _getCoordinates (pageIndex, left, top) {
    return this._withReader(reader => {
      const pageInfo = reader.parsePage(pageIndex)
      const [,,, height] = pageInfo.getMediaBox()
      return {
        x: left,
        y: height - top
      }
    })
  }

  getMaximumLine (fontPath, fontSize, availableWidth, content, minOneWord) {
    this._ensureFontPath(fontPath)
    return this._withWriter(writer => {
      const font = writer.getFontForFile(fontPath)
      const getTextWidth = text => {
        return font.calculateTextDimensions(text, fontSize).width
      }

      const text = getMaximumLine(getTextWidth, availableWidth, content, minOneWord)
      const dimensions = font.calculateTextDimensions(text, fontSize)
      const {
        width: textWidth,
        height: textHeight
      } = dimensions
      const overflowText = content.slice(text.length).trimLeft()
      return {
        text,
        textWidth,
        textHeight,
        overflowText
      }
    })
  }

  writePageText (pageIndex, {text, top, left, fontPath, fontSize, textColor}) {
    this._ensureFontPath(fontPath)
    this._withWriter(writer => {
      this._withPageContext(pageIndex, context => {
        // since fonts are written from the bottom left origin,
        //  the `top` must also factor in the font size
        const {x, y} = this._getCoordinates(pageIndex, left, top + fontSize)
        const options = {
          font: writer.getFontForFile(fontPath),
          size: fontSize,
          color: parseInt(textColor, 16),
          colorspace: 'rgb'
        }

        context.writeText(text, x, y, options)
      })
    })
  }

  drawPageImage (pageIndex, imagePath, rect) {
    this._ensureImagePath(imagePath)
    this._withPageContext(pageIndex, context => {
      const {left, top, width, height} = rect
      const {x, y} = this._getCoordinates(pageIndex, left, top)
      const options = {
        transformation: {
          width,
          height,
          proportional: true
        }
      }

      // https://github.com/galkahana/HummusJS/wiki/Show-images
      context.drawImage(x, y - height, imagePath, options)
    })
  }

  appendBlankPage (pageSize) {
    return this._withWriter(writer => {
      const copyingContext = writer.createPDFCopyingContextForModifiedFile()
      const copyingReader = copyingContext.getSourceDocumentParser()
      const lastPageIndex = copyingReader.getPagesCount() - 1
      if (!pageSize) {
        const lastPageData = copyingReader.parsePage(lastPageIndex)
        const [,, right, top] = lastPageData.getMediaBox()
        pageSize = {width: right, height: top}
      }

      const newPage = writer.createPage(0, 0, pageSize.width, pageSize.height)
      writer.writePage(newPage)

      return {
        width: pageSize.width,
        height: pageSize.height,
        pageNumber: lastPageIndex + 1
      }
    })
  }
}

module.exports = {Pdf}
