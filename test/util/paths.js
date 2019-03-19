const path = require('path')
const sinon = require('sinon')
const assert = require('assert')

const paths = require('../../src/util/paths')
const config = require('../../src/util/config')

describe('lib/util/paths', function () {
  let guidesDir
  let currentUser
  let configGetStub

  // The test will fail if 'app/' directory name changes
  const projectDirname = function () {
    return __dirname.substring(0, __dirname.lastIndexOf('CAJA/') + 5)
  }

  beforeEach(function () {
    guidesDir = '/foo/userfiles/'

    configGetStub = sinon.stub(config, 'get')
    configGetStub.withArgs('GUIDES_DIR').returns(guidesDir)

    currentUser = 'DEV'
  })

  afterEach(function () {
    configGetStub.restore()
  })

  describe('getTemplatesPath', function () {
    it('is correct when username and guideId provided', function () {
      const promise = paths.getTemplatesPath({ username: currentUser, guideId: '1261' })

      return promise.then(templatesPath => {
        const expected = path.join(guidesDir, currentUser, 'guides/Guide1261/templates.json')
        assert.equal(templatesPath, expected)
      })
    })

    it('is correct when a relative fileDataURL path is provided', function () {
      const fileDataURL = 'path/to/file/data'
      const promise = paths.getTemplatesPath({ fileDataURL })

      return promise.then(templatesPath => {
        const expected = path.join(projectDirname(), `js/viewer/${fileDataURL}`)
        assert.ok(templatesPath, expected)
      })
    })

    it('is correct when an absolute fileDataURL path is provided', function () {
      const fileDataURL = '/path/to/files'
      const promise = paths.getTemplatesPath({ fileDataURL })

      return promise.then(templatesPath => {
        const expected = path.join(fileDataURL, 'templates.json')
        assert.equal(templatesPath, expected, 'absolute fileDataURL should be used as-is')
      })
    })

    it('is correct when an actual fileDataURL url is provided', function () {
      const fileDataURL = 'http://my.awesome.server/path/to/files'
      const promise = paths.getTemplatesPath({ fileDataURL })

      return promise.then(templatesPath => {
        const expected = path.join(fileDataURL, 'templates.json')
        assert.equal(templatesPath, expected, 'absolute fileDataURL should be used as-is')
      })
    })
  })

  describe('getTemplatePath', function () {
    it('is correct when username provided', function () {
      const promise = paths.getTemplatePath({
        guideId: 20,
        templateId: 20,
        username: currentUser
      })

      return promise.then(templatePath => {
        const expected = path.join(guidesDir, currentUser, 'guides/Guide20/template20.json')
        assert.equal(templatePath, expected)
      })
    })

    it('is correct when a relative fileDataURL path is provided', function () {
      const fileDataURL = 'path/to/file/data'

      const promise = paths.getTemplatePath({
        fileDataURL,
        templateId: 20
      })

      return promise.then(templatePath => {
        const expected = path.join(projectDirname(), 'js/viewer', fileDataURL, `template20.json`)
        assert.equal(templatePath, expected)
      })
    })

    it('is correct when an absolute fileDataURL path is provided', function () {
      const fileDataURL = '/path/to/file/data'

      const promise = paths.getTemplatePath({
        fileDataURL,
        templateId: 20
      })

      return promise.then(templatesPath => {
        const expected = path.join(fileDataURL, 'template20.json')
        assert.equal(templatesPath, expected)
      })
    })

    it('is correct when an actual fileDataURL url is provided', function () {
      const fileDataURL = 'http://my.awesome.server/path/to/files'

      const promise = paths.getTemplatePath({
        fileDataURL,
        templateId: 20
      })

      return promise.then(templatesPath => {
        const expected = path.join(fileDataURL, 'template20.json')
        assert.equal(templatesPath, expected)
      })
    })
  })
})
