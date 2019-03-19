const fs = require('fs')
const path = require('path')
const config = require('./config')
const paths = require('./paths')

function readJson (filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, {encoding: 'utf8'}, (error, text) => {
      if (error) {
        return reject(error)
      }

      let json
      try {
        json = JSON.parse(text)
      } catch (error) {
        reject(error)
      }

      resolve(json)
    })
  })
}

function dataLayer (config) {
  function getGuidePath (username, guideId, fileDataURL) {
    return paths.getGuideDirPath(username, guideId, fileDataURL)
  }

  return {
    getGuideXml (username, guideId, fileDataURL) {
      const guideDir = getGuidePath(username, guideId, fileDataURL)
      const filepath = path.join(guideDir, 'Guide.xml')
      return new Promise((resolve, reject) => {
        fs.readFile(filepath, {encoding: 'utf8'}, (error, text) => {
          if (error) {
            const isFileNotFound = error.code === 'ENOENT'
            if (isFileNotFound) {
              return resolve('')
            }
            return reject(error)
          }

          resolve(text)
        })
      })
    },

    async getTemplateJsonPath (username, guideId, templateId, fileDataURL) {
      return paths.getTemplatePath({ username, guideId, templateId, fileDataURL })
    }
  }
}

module.exports = {
  data: dataLayer(config),
  __testing: {
    dataLayer,
    readJson
  }
}
