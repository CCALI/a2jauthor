const {fonts} = require('./fonts')
const {checks} = require('./checks')
const {Pdf} = require('./pdf')

function patchText (pdf, patch, {fonts}) {
  const {
    content,
    page,
    area: {
      top,
      left,
      width,
      height
    },
    text: {
      fontSize,
      fontName,
      textColor,
      textAlign
    }
  } = patch

  const fontPath = fonts.getPathForFont(fontName)
  const {
    text,
    textWidth,
    textHeight
  } = pdf.getMaximumLine(fontPath, fontSize, width, content)
  let alignedLeft = left
  if (textAlign === 'right') {
    alignedLeft = left + width - textWidth
  }

  let bumpUp = 2 // so text is not too flesh with underline
  if (height > textHeight) {
    bumpUp = Math.floor((height - textHeight) / 2)
  }
  const alignedTop = top + height - textHeight - bumpUp
  pdf.writePageText(page, {
    text,
    top: alignedTop,
    left: alignedLeft,
    fontPath,
    fontSize,
    textColor
  })
}

function patchMultilineText (pdf, patch, {fonts}) {
  const {
    content,
    lines,
    addendumText,
    overflow: {
      style,
      addendumLabel
    }
  } = patch

  const textNodes = []
  let remainingText = content
  for (const line of lines) {
    const {
      page,
      area: {top, left, width, height},
      text: {fontName, fontSize, textAlign, textColor}
    } = line
    const fontPath = fonts.getPathForFont(fontName)
    const {
      text,
      textWidth,
      textHeight,
      overflowText
    } = pdf.getMaximumLine(fontPath, fontSize, width, remainingText)

    let alignedLeft = left
    if (textAlign === 'right') {
      alignedLeft = left + width - textWidth
    }

    let bumpUp = 2 // so text is not too flesh with underline
    if (height > textHeight) {
      bumpUp = Math.floor((height - textHeight) / 2)
    }
    const alignedTop = top + height - textHeight - bumpUp
    textNodes.push({
      page,
      options: {
        text,
        top: alignedTop,
        left: alignedLeft,
        fontPath,
        fontSize,
        textColor
      }
    })

    remainingText = overflowText
    if (!remainingText) {
      break
    }
  }

  const hasOverflowText = remainingText.length > 0
  const writeAddendumOnly = style === 'everything-to-addendum'
  if (hasOverflowText && writeAddendumOnly) {
    return [{
      type: 'addendum-text-block',
      addendumLabel,
      content,
      text: addendumText
    }]
  }

  textNodes.forEach(({page, options}) => {
    pdf.writePageText(page, options)
  })

  const shouldWriteAddendumOverflow = style === 'overflow-to-addendum'
  if (hasOverflowText && shouldWriteAddendumOverflow) {
    return [{
      type: 'addendum-text-block',
      addendumLabel,
      content: remainingText,
      text: addendumText
    }]
  }
}

function patchTableText (pdf, patch, {fonts}) {
  const {
    columns,
    addendumLabel,
    addendumColumns
  } = patch

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]
    for (let j = 0; j < column.length; j++) {
      const textPatch = column[j]
      patchText(pdf, textPatch, {fonts})
    }
  }

  if (addendumColumns.length) {
    return [{
      type: 'addendum-table-block',
      addendumLabel,
      addendumColumns
    }]
  }
}

function patchCheckmark (pdf, patch) {
  const {
    icon,
    page,
    area: {
      top,
      left,
      height
    }
  } = patch
  const options = {
    top,
    left,
    text: checks.getTextForCheck(icon),
    fontPath: checks.getFontPath(),
    fontSize: height,
    textColor: '000000'
  }

  pdf.writePageText(page, options)
}

const patcherTypeMap = {
  text: patchText,
  'multiline-text': patchMultilineText,
  'table-text': patchTableText,
  checkmark: patchCheckmark
}

function getPatcherForType (type) {
  return patcherTypeMap[type]
}

const lineSpacing = textHeight => Math.floor(textHeight * 1.4)

function getAddendumLabel (pdf, addendumLabel, labelStyle, maxPageWidth) {
  const {fontName, fontSize} = labelStyle
  const fontPath = fonts.getPathForFont(fontName)
  const {
    text,
    textHeight
  } = pdf.getMaximumLine(fontPath, fontSize, maxPageWidth, addendumLabel)
  const height = lineSpacing(textHeight)
  const textNode = {
    type: 'text',
    content: text,
    area: {
      top: 0,
      left: 0,
      width: maxPageWidth,
      height
    },
    text: labelStyle
  }
  return {textNode, height}
}

function patchAddendumText (pdf, patch, options) {
  const {
    addendumLabel,
    content,
    text: contentStyle
  } = patch

  const {
    maxPageWidth,
    maxPageHeight,
    labelStyle
  } = options
  let {remainingPageHeight} = options

  const firstSection = {textNodes: [], height: 0}
  const sections = [firstSection]
  {
    const {
      textNode,
      height
    } = getAddendumLabel(pdf, addendumLabel, labelStyle, maxPageWidth)
    firstSection.height += height
    firstSection.textNodes.push(textNode)
  }

  const {fontName, fontSize} = contentStyle
  const fontPath = fonts.getPathForFont(fontName)
  let remainingText = content
  while (remainingText) {
    let section = sections[sections.length - 1]
    const {
      text,
      textHeight,
      overflowText
    } = pdf.getMaximumLine(fontPath, fontSize, maxPageWidth, remainingText)
    const height = lineSpacing(textHeight)
    const textNode = {
      type: 'text',
      content: text,
      area: {
        top: section.height,
        left: 0,
        width: maxPageWidth,
        height
      },
      text: contentStyle
    }

    const newHeight = section.height + height
    const overflowsCurrentPage = newHeight > remainingPageHeight
    if (overflowsCurrentPage) {
      const newSection = {textNodes: [], height: 0}
      sections.push(newSection)
      section = newSection
      remainingPageHeight = maxPageHeight
    }

    section.textNodes.push(textNode)
    section.height += height
    remainingText = overflowText
  }

  return sections
}

function patchAddendumTable (pdf, patch, options) {
  const {
    addendumLabel,
    addendumColumns: columns
  } = patch

  const {
    maxPageWidth,
    maxPageHeight,
    labelStyle
  } = options
  let {remainingPageHeight} = options

  const firstSection = {textNodes: [], height: 0}
  const sections = [firstSection]
  {
    const {
      textNode,
      height
    } = getAddendumLabel(pdf, addendumLabel, labelStyle, maxPageWidth)
    firstSection.height += height
    firstSection.textNodes.push(textNode)
  }

  const rowCount = columns[0].length
  for (let i = 0; i < rowCount; i++) {
    let section = sections[sections.length - 1]
    const rowCells = []
    let maxRowHeight = 0
    for (let j = 0; j < columns.length; j++) {
      const rowCell = columns[j][i]
      rowCells.push(rowCell)
      const rowCellHeight = rowCell.area.height
      maxRowHeight = Math.max(maxRowHeight, rowCellHeight)
    }

    const newHeight = section.height + maxRowHeight
    const overflowsCurrentPage = newHeight > remainingPageHeight
    if (overflowsCurrentPage) {
      const newSection = {textNodes: [], height: 0}
      sections.push(newSection)
      section = newSection
      remainingPageHeight = maxPageHeight
    }

    const minCellTop = rowCells.reduce((min, row) => (
      Math.min(min, row.area.top)
    ), Infinity)
    const relativeRowCells = rowCells.map(row => {
      row.area.top = section.height + (row.area.top - minCellTop)
      return row
    })

    section.textNodes.push(...relativeRowCells)
    section.height += maxRowHeight
  }

  return sections
}

const addendumPatcherTypeMap = {
  'addendum-text-block': patchAddendumText,
  'addendum-table-block': patchAddendumTable
}

function getAddendumPatcherForType (type) {
  return addendumPatcherTypeMap[type]
}

function patchAddendum (pdf, patches, options) {
  const {
    margins: {
      top,
      left,
      right,
      bottom
    },
    labelStyle
  } = options

  const {
    width,
    height,
    pageNumber: initialPageNumber
  } = pdf.appendBlankPage(options.pageSize)
  let pageNumber = initialPageNumber

  const maxPageWidth = width - left - right
  const maxPageHeight = height - top - bottom
  const bottomBound = height - bottom
  let topBound = top
  patches.forEach(patch => {
    const patcher = getAddendumPatcherForType(patch.type)
    const remainingPageHeight = bottomBound - topBound
    const sections = patcher(pdf, patch, {
      maxPageWidth,
      maxPageHeight,
      remainingPageHeight,
      labelStyle
    })
    sections.forEach(section => {
      const {textNodes, height} = section
      const overflowsCurrentPage = height + topBound > bottomBound
      if (overflowsCurrentPage) {
        pageNumber = pdf.appendBlankPage(options.pageSize).pageNumber
        topBound = top
      }

      const shiftedTextNodes = textNodes.map(node => {
        node.page = pageNumber
        node.area.top = node.area.top + topBound
        node.area.left = node.area.left + left
        return node
      })

      shiftedTextNodes.forEach(text => {
        patchText(pdf, text, {fonts, checks})
      })

      topBound = topBound + height
    })
  })
}

function patch (inputFilepath, overlay) {
  const {patches, addendum} = overlay
  const pdf = new Pdf(inputFilepath)
  let addendumPatches = []
  patches.forEach(patch => {
    const patcher = getPatcherForType(patch.type)
    addendumPatches = [
      ...addendumPatches,
      ...(patcher(pdf, patch, {fonts, checks}) || [])
    ]
  })

  if (addendumPatches.length) {
    patchAddendum(pdf, addendumPatches, addendum)
  }
}

module.exports = {
  patch,
  testing: {
    getPatcherForType,
    getAddendumPatcherForType,

    patchText,
    patchMultilineText,
    patchTableText,
    patchCheckmark,
    patchAddendum,
    patchAddendumText,
    patchAddendumTable
  }
}
