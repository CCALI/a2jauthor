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

  async function getTemplatePdfPath (username, guideId, templateId, fileDataUrl) {
    const templatePath = await data.getTemplateJsonPath(username, guideId, templateId, fileDataUrl)
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

    async duplicateTemplatePdf (username, guideId, templateId, fileDataUrl) {
      const pdfPath = await getTemplatePdfPath(username, guideId, templateId, fileDataUrl)
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
