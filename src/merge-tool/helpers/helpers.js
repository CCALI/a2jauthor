import cString from '@caliorg/a2jdeps/utils/string'

export const formatPageTextCell = val => { // report.js helpers
  if (val) {
    // this preserves hard returns from interview while keeping text shorter
    val = val.replace(/(<br\s?\/>)/gi, '|').replace(/(<\/option>)/gi, ' | ').replace(/(<\/p>)/gi, ' | ')
  }
  return cString.decodeEntities(val)
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const pageVarString = (page) => {
  return (`
    ${page.name || ''}
    ${page.text || ''}
    %${page.repeatVar || ''}%
    %${page.outerLoopVar || ''}%
    ${page.learn || ''}
    ${page.help || ''}
    ${page.helpReader || ''}
    %${(page.codeBefore || '').replace(/ /g, '% %')}%
    %${(page.codeAfter || '').replace(/ /g, '% %')}%
    ${page.fields.map(f => `
      ${f.label || ''}
      %${f.name || ''}%
      ${f.value || ''}
      ${f.invalidPrompt || ''}
      ${f.sample || ''}
    `).join('')}
    ${page.buttons.map(b => `
      ${b.label || ''}
      %${b.name || ''}%
      ${b.value || ''}
      %${b.repeatVar || ''}%
      ${b.url || ''}
    `).join('')}
  `).toLowerCase().replace(/\[\]\(\)/g, '%').replace(/%\s*(.*?)\s*%/g, '%$1%')
  // all vars possibly on the page ^ are now wrapped in % if they exist,
  // so now we can do a much faster indexOf search for every single var.
}

export const renameVars = (page, varRenameMap) => {
  Object.keys(varRenameMap).forEach(oldname => {
    const newname = varRenameMap[oldname]
    const rx = new RegExp(oldname, 'gi')
    page.name = page.name && page.name.replace(rx, newname)
    page.text = page.text && page.text.replace(rx, newname)
    page.repeatVar = page.repeatVar && page.repeatVar.replace(rx, newname)
    page.outerLoopVar = page.outerLoopVar && page.outerLoopVar.replace(rx, newname)
    page.learn = page.learn && page.learn.replace(rx, newname)
    page.help = page.help && page.help.replace(rx, newname)
    page.helpReader = page.helpReader && page.helpReader.replace(rx, newname)
    page.codeBefore = page.codeBefore && page.codeBefore.replace(rx, newname)
    page.codeAfter = page.codeAfter && page.codeAfter.replace(rx, newname)
    page.fields.forEach(f => {
      f.label = f.label && f.label.replace(rx, newname)
      f.name = f.name && f.name.replace(rx, newname)
      f.value = f.value && f.value.replace(rx, newname)
      f.invalidPrompt = f.invalidPrompt && f.invalidPrompt.replace(rx, newname)
      f.sample = f.sample && f.sample.replace(rx, newname)
    })
    page.buttons.forEach(b => {
      b.label = b.label && b.label.replace(rx, newname)
      b.name = b.name && b.name.replace(rx, newname)
      b.value = b.value && b.value.replace(rx, newname)
      b.repeatVar = b.repeatVar && b.repeatVar.replace(rx, newname)
      b.url = b.url && b.url.replace(rx, newname)
    })
  })
}
