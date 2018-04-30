const assert = require('assert')
const sinon = require('sinon')
const Q = require('q')
const _ = require('lodash')

const template = require('../../src/routes/template')
const files = require('../../src/util/files')
const user = require('../../src/util/user')
// const paths = require('../../src/util/paths')
const templates = require('../../src/routes/templates')
const config = require('../../src/util/config')

const templates1261Data = require('../data/templates1261-data')
const templates1262Data = require('../data/templates1262-data')

const template2112Data = require('../data/template-2112-data')
const template2114Data = require('../data/template-2114-data')

describe('lib/routes/template', function () {
  let getCurrentUserStub,
    configGetStub,
    currentUserName,
    params

  beforeEach(function () {
    configGetStub = sinon.stub(config, 'get')
    configGetStub.withArgs('GUIDES_DIR').returns('test/data')
    let mockCurrentUserDeferred = Q.defer()
    currentUserName = 'DEV'
    params = {}

    getCurrentUserStub = sinon.stub(user, 'getCurrentUser')
    getCurrentUserStub.returns(mockCurrentUserDeferred.promise)
    mockCurrentUserDeferred.resolve(currentUserName)
  })

  afterEach(function () {
    getCurrentUserStub.restore()
    configGetStub.restore()
  })

  describe('get', function () {
    var readJSONStub,
      readFileStub

    beforeEach(function () {
      readFileStub = Q.defer()
      readJSONStub = sinon.stub(files, 'readJSON')
      readJSONStub.returns(readFileStub.promise)
      readFileStub.resolve(template2112Data)
    })

    afterEach(function () {
      readJSONStub.restore()
    })

    it('should return data for a template', function (done) {
      template.get('1261-2112', params, function (err, data) {
        if (err) {
          return done(err)
        }
        assert.deepEqual(data, template2112Data)
        done()
      })
    })

    it('should return an error when template does not have data', function (done) {
      template.get('1261-2113', params, function (err, data) {
        assert(err)
        done()
      })
    })
  })

  describe('update', function () {
    var readJSONStub,
      mergeJSONStub,
      writeJSONStub,
      dateNowStub,
      mockReadDeferred,
      mockMergeDeferred,
      mockWriteDeferred,
      mockCreatedTime,
      mockCurrentTime

    beforeEach(function () {
      mockReadDeferred = Q.defer()
      mockMergeDeferred = Q.defer()
      mockWriteDeferred = Q.defer()
      mockCreatedTime = 1455044906872
      mockCurrentTime = 1455555555555

      readJSONStub = sinon.stub(files, 'readJSON')
      mergeJSONStub = sinon.stub(files, 'mergeJSON')
      writeJSONStub = sinon.stub(files, 'writeJSON')

      readJSONStub.returns(mockReadDeferred.promise)
      mergeJSONStub.returns(mockMergeDeferred.promise)
      writeJSONStub.returns(mockWriteDeferred.promise)
      dateNowStub = sinon.stub(Date, 'now')

      mockReadDeferred.resolve(templates1261Data)
      mockMergeDeferred.resolve(JSON.stringify(templates1261Data))
      mockWriteDeferred.resolve(JSON.stringify(template2112Data))
      dateNowStub.returns(mockCurrentTime)
    })

    afterEach(function () {
      readJSONStub.restore()
      mergeJSONStub.restore()
      writeJSONStub.restore()
      dateNowStub.restore()
    })

    it('should write updated data to file', function (done) {
      let inputData = _.assign(_.omit(template2112Data, 'templateId'), {
        createdAt: mockCreatedTime,
        updatedAt: mockCreatedTime
      })

      let newData = _.assign({}, template2112Data, {
        createdAt: mockCreatedTime,
        updatedAt: mockCurrentTime
      })

      template.update('1261-2112', inputData, params, function (err, data) {
        if (err) {
          return done(err)
        }
        let fileName = writeJSONStub.getCall(0).args[0].path
        fileName = fileName.substring(fileName.lastIndexOf('/') + 1)

        assert.equal(fileName, 'template2112.json', 'should write template file')
        assert.deepEqual(writeJSONStub.getCall(0).args[0].data, newData,
          'should write template file with template data')

        assert.deepEqual(data, JSON.stringify(template2112Data),
          'http response should only contain updated template data')

        done()
      })
    })
  })

  describe('create', function () {
    var getTemplatesJSONStub,
      writeJSONStub,
      mergeJSONStub,
      dateNowStub,
      getTemplatesJSONDeferred,
      mockWriteDeferred,
      mockMergeDeferred,
      mockCurrentTime

    beforeEach(function () {
      getTemplatesJSONDeferred = Q.defer()
      mockWriteDeferred = Q.defer()
      mockMergeDeferred = Q.defer()
      mockCurrentTime = 1455044906872

      getTemplatesJSONStub = sinon.stub(templates, 'getTemplatesJSON')
      writeJSONStub = sinon.stub(files, 'writeJSON')
      mergeJSONStub = sinon.stub(files, 'mergeJSON')
      dateNowStub = sinon.stub(Date, 'now')

      getTemplatesJSONStub.returns(getTemplatesJSONDeferred.promise)
      writeJSONStub.returns(mockWriteDeferred.promise)
      mergeJSONStub.returns(mockMergeDeferred.promise)
      dateNowStub.returns(mockCurrentTime)
    })

    afterEach(function () {
      getTemplatesJSONStub.restore()
      writeJSONStub.restore()
      mergeJSONStub.restore()
      dateNowStub.restore()
    })

    it('should write data to template1 when no templates exist', function (done) {
      let inputData = _.omit(template2112Data, [ 'templateId' ])

      let newData = _.assign({}, template2112Data, {
        templateId: 1,
        createdAt: mockCurrentTime,
        updatedAt: mockCurrentTime
      })

      getTemplatesJSONDeferred.resolve([])
      mockWriteDeferred.resolve(JSON.stringify(newData))
      mockMergeDeferred.resolve(JSON.stringify(templates1261Data))

      template.create(inputData, params, function () {
        var writeFileName = writeJSONStub.getCall(0).args[0].path
        writeFileName = writeFileName.substring(writeFileName.lastIndexOf('/') + 1)

        assert.equal(writeFileName, 'template1.json',
          'should write template file')
        assert.deepEqual(writeJSONStub.getCall(0).args[0].data, newData,
          'should write template file with template data')

        done()
      })
    })

    it('should write data to next template file', function (done) {
      let inputData = _.omit(template2114Data, [ 'templateId' ])

      let newData = _.assign({}, template2114Data, {
        templateId: 2115,
        createdAt: mockCurrentTime,
        updatedAt: mockCurrentTime
      })

      getTemplatesJSONDeferred.resolve(templates1262Data)
      mockWriteDeferred.resolve(JSON.stringify(newData))
      mockMergeDeferred.resolve(JSON.stringify(templates1262Data))

      template.create(inputData, params, function (err, data) {
        if (err) {
          return done(err)
        }
        var writeFileName = writeJSONStub.getCall(0).args[0].path
        writeFileName = writeFileName.substring(writeFileName.lastIndexOf('/') + 1)

        assert.equal(writeFileName, 'template2115.json',
          'should write template file')
        assert.deepEqual(writeJSONStub.getCall(0).args[0].data, newData,
          'should write template file with template data')

        assert.deepEqual(data, JSON.stringify(newData),
          'http response should only contain new template data')

        done()
      })
    })
  })
})
