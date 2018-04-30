const fs = require('fs')
const {Router} = require('express')
const {storage} = require('./storage')
const {overlayer} = require('./overlayer')
const {fonts} = require('./overlayer/fonts')
const {checks} = require('./overlayer/checks')
const multer = require('multer')
const upload = multer({dest: storage.getTemporaryDirectory()})
const user = require('../util/user')
const notFoundHtml = require('./not-found')

const promisify = require('util.promisify')
const unlink = promisify(fs.unlink)

const errorRes = (res, error) => {
  const statusCode = error.isClientError ? 400 : 500
  res.status(statusCode).json({
    ok: false,
    error: error.message
  })
}

function doesFileExist (filepath) {
  return new Promise(resolve => {
    fs.access(filepath, error => {
      resolve(!error)
    })
  })
}

const storageRouter = (new Router())
  .use(user.middleware)
  .get('/:comboId', async (req, res) => {
    const [ guideId, templateId ] = (req.params.comboId || '').split('-')
    if (!guideId || !templateId) {
      const error = new Error('A guide ID and template ID must be provided')
      return errorRes(res, error)
    }

    const {username} = req.user
    let pdfPath
    try {
      pdfPath = await storage.getTemplatePdfPath(username, guideId, templateId)
    } catch (error) {
      return errorRes(res, error)
    }

    const exists = await doesFileExist(pdfPath)
    if (!exists) {
      const error = new Error(`There is no PDF for template "${templateId}"`)
      return errorRes(res, error)
    }

    res.sendFile(pdfPath)
  })
  .post('/:comboId', upload.single('pdf'), (req, res) => {
    const [ guideId, templateId ] = (req.params.comboId || '').split('-')
    const {username} = req.user
    if (!templateId) {
      const error = new Error('A template ID must be provided')
      return errorRes(res, error)
    }
    const file = req.file
    if (!file) {
      const error = new Error('No PDF file was uploaded')
      error.isClientError = true
      return errorRes(res, error)
    }
    const filepath = file.path
    storage.saveTemplatePdf(username, guideId, templateId, filepath)
      .then(() => unlink(filepath))
      .then(() => res.json({ok: true}))
      .catch(error => errorRes(res, error))
  })
  .post('/:comboId/apply-overlay', async (req, res) => {
    const [ guideId, templateId ] = (req.params.comboId || '').split('-')
    const {overlay} = req.body
    if (!templateId) {
      const error = new Error('A template ID must be provided')
      return errorRes(res, error)
    }

    const {username} = req.user
    const pdfPath = await storage.getTemplatePdfPath(username, guideId, templateId)
    const pdfId = await storage.commitTemporaryFilepath(pdfPath)
    const newPdfPath = storage.getTemporaryFilepath(pdfId)
    await overlayer.forkWithOverlay(newPdfPath, overlay)

    res.json({ok: true, pdfId})
  })
  .get('/temp/:pdfId', (req, res) => {
    const {pdfId} = req.params
    if (!pdfId) {
      const error = new Error('A temporary ID must be provided')
      return errorRes(res, error)
    }

    res.sendFile(storage.getTemporaryFilepath(pdfId), error => {
      if (error) {
        const isNotFound = error.code === 'ENOENT'
        if (isNotFound) {
          return res.status(404).send(notFoundHtml)
        }

        return errorRes(res, error)
      }

      storage.deleteTemporaryFilepath(pdfId)
        .catch(error => console.error(error))
    })
  })

const overlayRouter = (new Router())
  .post('/apply', (req, res) => {
    const {pdfId, overlay} = req.body
    storage.getTemporaryFilepathForId(pdfId)
      .then(({filepath, pdfId: newPdfId}) => {
        return overlayer.forkWithOverlay(filepath, overlay)
          .then(() => res.json({ok: true, pdfId: newPdfId}))
      })
      .catch(error => errorRes(res, error))
  })
  .get('/supported-fonts', (req, res) => {
    res.json({
      ok: true,
      fonts: fonts.getSupportedFontNames()
    })
  })
  .get('/supported-checks', (req, res) => {
    res.json({
      ok: true,
      checks: checks.getSupportedChecks()
    })
  })

const router = (new Router())
  .use('/storage', storageRouter)
  .use('/overlay', overlayRouter)

module.exports = {
  router,
  testing: {
    storageRouter,
    overlayRouter
  }
}
