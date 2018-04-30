const assert = require('assert')
const sinon = require('sinon')
const fs = require('fs-extra')
const Q = require('q')

const files = require('../../src/util/files')

const templates2112Data = require('../data/template-2112-data')

describe('lib/util/files', function () {
  describe('readJSON', function () {
    var readFileStub

    beforeEach(function () {
      readFileStub = sinon.stub(fs, 'readFile')
    })

    afterEach(function () {
      fs.readFile.restore()
    })

    it('should correctly read JSON', function (done) {
      readFileStub.callsArgWith(2, null, JSON.stringify(templates2112Data))

      files.readJSON({ path: '../data/DEV/guides/Guide1261/template2112.json' })
        .then(function (data) {
          assert.deepEqual(data, templates2112Data)
          done()
        })
    })

    it('should fail when data is non-JSON', function (done) {
      readFileStub.callsArgWith(2, null, templates2112Data)

      files.readJSON({ path: '../data/DEV/guides/Guide1261/template2112.json' })
        .catch(function (err) {
          assert(err)
          done()
        })
    })

    it('should fail when file cannot be read', function (done) {
      readFileStub.callsArgWith(2, 'Some Error')

      files.readJSON({ path: '../data/DEV/guides/Guide1261/template2112.json' })
        .catch(function (err) {
          assert(err)
          done()
        })
    })
  })

  describe('writeJSON', function () {
    var writeFileStub,
      ensureFileStub

    beforeEach(function () {
      writeFileStub = sinon.stub(fs, 'writeFile')
      ensureFileStub = sinon.stub(fs, 'ensureFile')
    })

    afterEach(function () {
      writeFileStub.restore()
      ensureFileStub.restore()
    })

    it('should ensure file exists before writing', function (done) {
      writeFileStub.callsArgWith(2, null)
      ensureFileStub.callsArgWith(1, null)

      files.writeJSON({ path: 'foo.json', data: templates2112Data })
        .then(function (data) {
          assert.equal(ensureFileStub.getCall(0).args[0], 'foo.json')
          done()
        })
    })

    it('should write', function (done) {
      writeFileStub.callsArgWith(2, null)
      ensureFileStub.callsArgWith(1, null)

      files.writeJSON({ path: 'foo.json', data: templates2112Data })
        .then(function (data) {
          var jsonData = JSON.stringify(templates2112Data, null, '\t')
          assert.equal(writeFileStub.getCall(0).args[0], 'foo.json', 'to correct file')
          assert.deepEqual(writeFileStub.getCall(0).args[1], jsonData, 'with correct data')
          assert.deepEqual(data, templates2112Data, 'and then return the raw data')
          done()
        })
    })

    it('should fail when file cannot be written', function (done) {
      writeFileStub.callsArgWith(2, 'Some Error')
      ensureFileStub.callsArgWith(1, null)

      files.writeJSON({ path: 'foo.json', data: templates2112Data })
        .catch(function (err) {
          assert(err)
          done()
        })
    })
  })

  describe('mergeJSON', function () {
    var mockReadJSONDeferred, mockReadJSON, mockWriteJSONDeferred, mockWriteJSON

    beforeEach(function () {
      mockReadJSONDeferred = Q.defer()
      mockReadJSON = sinon.stub(files, 'readJSON')
      mockReadJSON.returns(mockReadJSONDeferred.promise)

      mockWriteJSONDeferred = Q.defer()
      mockWriteJSON = sinon.stub(files, 'writeJSON')
      mockWriteJSON.returns(mockWriteJSONDeferred.promise)
    })

    afterEach(function () {
      files.readJSON.restore()
      files.writeJSON.restore()
      mockReadJSONDeferred = null
      mockWriteJSONDeferred = null
    })

    it('should add a new templateId to the templateIds array', function (done) {
      let fileInputData = { guideId: '1261', templateIds: [1, 2] }
      let userInputData = { templateId: 3 }
      let expectedData = { guideId: '1261', templateIds: [1, 2, 3] }

      mockReadJSONDeferred.resolve(fileInputData)
      mockWriteJSONDeferred.resolve(JSON.stringify(expectedData))

      files.mergeJSON({ path: 'foo.json', data: userInputData })
        .then(function (data) {
          assert.equal(mockWriteJSON.getCall(0).args[0].path, 'foo.json', 'should write to JSON file')
          assert.deepEqual(mockWriteJSON.getCall(0).args[0].data, expectedData, 'with correct data')
          done()
        })
    })

    it('should merge object into array in JSON file and overwrite data with same unique key value', function (done) {
      let fileInputData = [{
        templateId: 1,
        title: 'template 1'
      }, {
        templateId: 2,
        title: 'template 2'
      }]

      let userInputData = {
        templateId: 1,
        title: 'updated template 1'
      }

      let expectedData = [{
        templateId: 1,
        title: 'updated template 1'
      }, {
        templateId: 2,
        title: 'template 2'
      }]

      mockReadJSONDeferred.resolve(fileInputData)
      mockWriteJSONDeferred.resolve(JSON.stringify(expectedData))

      files.mergeJSON({ path: 'foo.json', data: userInputData, replaceKey: 'templateId' })
        .then(function (data) {
          let writtenData = mockWriteJSON.getCall(0).args[0].data

          assert.equal(mockWriteJSON.getCall(0).args[0].path, 'foo.json', 'should write to JSON file')
          assert.deepEqual(writtenData, expectedData, 'with correct data')
          done()
        })
    })
  })
})
