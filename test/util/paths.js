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
    configGetStub.returns(guidesDir)

    currentUser = 'DEV'
  })

  afterEach(function () {
    configGetStub.restore()
  })

  describe('getTemplatesPath', function () {
    it('is correct when username provided', function () {
      const promise = paths.getTemplatesPath({ username: currentUser })

      return promise.then(templatesPath => {
        const expected = path.join(guidesDir, currentUser, 'templates.json')
        assert.equal(templatesPath, expected)
      })
    })

    it('is correct when a relative fileDataUrl path is provided', function () {
      const fileDataUrl = 'path/to/file/data'
      const promise = paths.getTemplatesPath({ fileDataUrl })

      return promise.then(templatesPath => {
        const expected = path.join(projectDirname(), `js/viewer/${fileDataUrl}`)
        assert.ok(templatesPath, expected)
      })
    })

    it('is correct when an absolute fileDataUrl path is provided', function () {
      const fileDataUrl = '/path/to/files'
      const promise = paths.getTemplatesPath({ fileDataUrl })

      return promise.then(templatesPath => {
        const expected = path.join(fileDataUrl, 'templates.json')
        assert.equal(templatesPath, expected, 'absolute fileDataUrl should be used as-is')
      })
    })

    it('is correct when an actual fileDataUrl url is provided', function () {
      const fileDataUrl = 'http://my.awesome.server/path/to/files'
      const promise = paths.getTemplatesPath({ fileDataUrl })

      return promise.then(templatesPath => {
        const expected = path.join(fileDataUrl, 'templates.json')
        assert.equal(templatesPath, expected, 'absolute fileDataUrl should be used as-is')
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

    it('is correct when a relative fileDataUrl path is provided', function () {
      const fileDataUrl = 'path/to/file/data'

      const promise = paths.getTemplatePath({
        fileDataUrl,
        templateId: 20
      })

      return promise.then(templatePath => {
        const expected = path.join(projectDirname(), 'js/viewer', fileDataUrl, `template20.json`)
        assert.equal(templatePath, expected)
      })
    })

    it('is correct when an absolute fileDataUrl path is provided', function () {
      const fileDataUrl = '/path/to/file/data'

      const promise = paths.getTemplatePath({
        fileDataUrl,
        templateId: 20
      })

      return promise.then(templatesPath => {
        const expected = path.join(fileDataUrl, 'template20.json')
        assert.equal(templatesPath, expected)
      })
    })

    it('is correct when an actual fileDataUrl url is provided', function () {
      const fileDataUrl = 'http://my.awesome.server/path/to/files'

      const promise = paths.getTemplatePath({
        fileDataUrl,
        templateId: 20
      })

      return promise.then(templatesPath => {
        const expected = path.join(fileDataUrl, 'template20.json')
        assert.equal(templatesPath, expected)
      })
    })
  })
})
