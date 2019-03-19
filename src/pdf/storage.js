const fs = require('fs-extra')
const path = require('path')
const uuid = require('uuid')
const promisify = require('util.promisify')
const {data} = require('../util/data')
const {tempDir} = require('./util')

const storage = ({fs, uuid, data}) => {
  const copy = promisify(fs.copy)
  const unlink = promisify(fs.unlink)
  const extension = '.pdf'

  async function getTemplatePdfPath (username, guideId, templateId, fileDataURL) {
    const templatePath = await data.getTemplateJsonPath(username, guideId, templateId, fileDataURL)
    return templatePath.replace('.json', extension)
  }

  function getTemporaryFilepath (pdfId) {
    return path.join(tempDir, pdfId + extension)
  }

  async function commitTemporaryFilepath (sourceFilepath) {
    const pdfId = uuid.v4()
    const filepath = getTemporaryFilepath(pdfId)
    await copy(sourceFilepath, filepath)
    return pdfId
  }

  // TODO: make this interval a config.json option?
  // check every 30 min for old temp files and remove
  setInterval(cleanupTempDir, 1800000)

  function cleanupTempDir () {
    return fs.readdir(tempDir).then(files => {
      files.forEach(file => {
        return fs.stat(path.join(tempDir, file)).then(stat => {
          var endTime, now
          now = new Date().getTime()
          // remove temp files created 15+ min ago
          endTime = new Date(stat.ctime).getTime() + 900000
          if (now > endTime) {
            return fs.unlink(path.join(tempDir, file))
          }
        })
      })
    })
    .catch(error => console.error(error))
  }

  return {
    getTemporaryDirectory () {
      return tempDir
    },

    getTemplatePdfPath,
    async saveTemplatePdf (username, guideId, templateId, sourceFilepath) {
      const pdfPath = await getTemplatePdfPath(username, guideId, templateId)
      await copy(sourceFilepath, pdfPath)
    },

    async copyTemplatePdf (username, guideId, templateId, destinationFilepath) {
      const pdfPath = await getTemplatePdfPath(username, guideId, templateId)
      await copy(pdfPath, destinationFilepath)
    },

    async duplicateTemplatePdf (username, guideId, templateId, fileDataURL) {
      const pdfPath = await getTemplatePdfPath(username, guideId, templateId, fileDataURL)
      const pdfId = await commitTemporaryFilepath(pdfPath)
      const copiedPdfPath = getTemporaryFilepath(pdfId)
      return copiedPdfPath
    },

    getTemporaryFilepath,
    commitTemporaryFilepath,
    deleteTemporaryFilepath (pdfId) {
      const filepath = getTemporaryFilepath(pdfId)
      return unlink(filepath)
    }
  }
}

module.exports = {
  storage: storage({fs, uuid, data}),
  testing: {
    storage
  }
}
