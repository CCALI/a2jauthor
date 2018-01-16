var assert = require('assert')
var sinon = require('sinon')
var fs = require('fs-extra')
var Q = require('q')

var files = require('../../src/util/files')

var templatesData = require('../data/templates-data')

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
      readFileStub.callsArgWith(2, null, JSON.stringify(templatesData))

      files.readJSON({ path: 'foo.json' })
        .then(function (data) {
          assert.deepEqual(data, templatesData)
          done()
        })
    })

    it('should fail when data is non-JSON', function (done) {
      readFileStub.callsArgWith(2, null, templatesData)

      files.readJSON({ path: 'foo.json' })
        .catch(function (err) {
          assert(err)
          done()
        })
    })

    it('should fail when file cannot be read', function (done) {
      readFileStub.callsArgWith(2, 'Some Error')

      files.readJSON({ path: 'foo.json' })
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

      files.writeJSON({ path: 'foo.json', data: templatesData })
        .then(function (data) {
          assert.equal(ensureFileStub.getCall(0).args[0], 'foo.json')
          done()
        })
    })

    it('should write', function (done) {
      writeFileStub.callsArgWith(2, null)
      ensureFileStub.callsArgWith(1, null)

      files.writeJSON({ path: 'foo.json', data: templatesData })
        .then(function (data) {
          var jsonData = JSON.stringify(templatesData, null, '\t')
          assert.equal(writeFileStub.getCall(0).args[0], 'foo.json', 'to correct file')
          assert.deepEqual(writeFileStub.getCall(0).args[1], jsonData, 'with correct data')
          assert.deepEqual(data, templatesData, 'and then return the raw data')
          done()
        })
    })

    it('should fail when file cannot be written', function (done) {
      writeFileStub.callsArgWith(2, 'Some Error')
      ensureFileStub.callsArgWith(1, null)

      files.writeJSON({ path: 'foo.json', data: templatesData })
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

    it('should merge object into array in JSON file', function (done) {
      let fileInputData = [{ foo: 'bar' }]
      let userInputData = { baz: 'xyz' }
      let expectedData = [{ foo: 'bar' }, { baz: 'xyz' }]

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
