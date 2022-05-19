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
