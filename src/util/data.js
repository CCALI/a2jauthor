const fs = require('fs')
const path = require('path')
const config = require('./config')

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
  const getUserDirectory = username => {
    const guidesDir = config.get('GUIDES_DIR')
    return path.join(guidesDir, username)
  }

  function getTemplatesIndexPath (username) {
    return path.join(getUserDirectory(username), 'templates.json')
  }

  function getGuidePath (username, guideId) {
    return path.join(getUserDirectory(username), 'guides', `Guide${guideId}`)
  }

  return {
    getGuideXml (username, guideId) {
      const guideDir = getGuidePath(username, guideId)
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

    async getTemplateJsonPath (username, templateId) {
      const toString = x => '' + x
      const templatesPath = getTemplatesIndexPath(username)
      const templateList = await readJson(templatesPath)
      const template = templateList.find(
        entry => toString(entry.templateId) === toString(templateId)
      )

      if (!template) {
        throw new Error(`Template "${templateId}" not found in "${templatesPath}"`)
      }

      const guideId = template.guideId
      if (!guideId) {
        throw new Error(`Template "${templateId}" is not associated to a guide ID`)
      }

      const guideDir = getGuidePath(username, guideId)
      return path.join(guideDir, `template${templateId}.json`)
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
