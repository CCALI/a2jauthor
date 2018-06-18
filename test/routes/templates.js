const Q = require('q')
const sinon = require('sinon')
const assert = require('assert')

const app = require('../../src/app')
const request = require('supertest')

const templates = require('../../src/routes/templates')
const files = require('../../src/util/files')
const user = require('../../src/util/user')
const config = require('../../src/util/config')

const templates1261Data = require('../data/templates1261-data')
const template2112Data = require('../data/template-2112-data')
const template2113Data = require('../data/template-2113-data')
const template2114Data = require('../data/template-2114-data')

describe('lib/routes/templates', function () {
  describe('with mocks', function () {
    let currentUserName
    let params
    let configGetStub

    beforeEach(function () {
      configGetStub = sinon.stub(config, 'get')
      // GUIDES_DIR sets the base data folder for all paths
      configGetStub.withArgs('GUIDES_DIR').returns('test/data')
      currentUserName = 'DEV'
      params = {}
    })

    afterEach(function () {
      configGetStub.restore()
    })

    describe('getTemplatesJSON', function () {
      let writeFileStub

      beforeEach(function () {
        writeFileStub = sinon.stub(files, 'writeJSON')
      })

      afterEach(function () {
        writeFileStub.restore()
      })

      it('should return data from templates JSON file when it exists', function (done) {
        templates.getTemplatesJSON({ username: currentUserName, guideId: '1261' })
        .then(data => {
          assert.deepEqual(data, templates1261Data)
          done()
        })
      })

      it('should write empty templates JSON file when it does not exist and return the empty templateIds array', function (done) {
        // force read error
        let readFileStub = sinon.stub(files, 'readJSON')
        readFileStub.throws(`Error: ENOENT: no such file or directory, open '../templates.json'`)
        writeFileStub.returns([])

        templates.getTemplatesJSON({ username: currentUserName, guideId: '600' })
        .then(data => {
          assert.deepEqual(writeFileStub.getCall(0).args[0].data.templateIds, [], 'with empty templateIds array')
          assert.deepEqual(writeFileStub.getCall(0).args[0].data, {guideId: '600', templateIds: []}, 'with full data structure')
          done()
        })
        readFileStub.restore()
      })
    })

    describe('GET /api/templates/{guideId}', function () {
      let getCurrentUserStub
      let mockCurrentUserDeferred = Q.defer()

      beforeEach(function () {
        getCurrentUserStub = sinon.stub(user, 'getCurrentUser')
        getCurrentUserStub.returns(mockCurrentUserDeferred.promise)
        mockCurrentUserDeferred.resolve(currentUserName)
      })

      afterEach(function () {
        getCurrentUserStub.restore()
      })

      it('should return templates data for a guide', function (done) {
        templates.get('1261', params, function (err, data) {
          if (err) {
            return done(err)
          }
          assert.equal(data.length, 2, 'should get 2 templates')
          assert.deepEqual(data[0], template2112Data, 'should get full data for first template')
          assert.deepEqual(data[1], template2113Data, 'should get full data for second template')
          done()
        })
      })

      it('should return templates data for a different guide', function (done) {
        templates.get('1262', params, function (err, data) {
          if (err) {
            return done(err)
          }
          assert.equal(data.length, 1, 'should return template data for another guide')
          assert.deepEqual(data[0], template2114Data, 'should get full data for first template')
          done()
        })
      })

      it('should return an error when guide does not have templates data', function (done) {
        templates.get('1337', params, function (err, data) {
          if (err) {
            return done(err)
          }
          assert.deepEqual(data, [])
          done()
        })
      })
    })
  })

  describe('GET /api/templates?filterDataUrl=', function () {
    it('fails if fileDataUrl query param missing', function (done) {
      request(app)
        .get('/api/templates')
        .expect(500, function (res) {
          assert(res.body.indexOf('You must provide fileDataUrl') !== -1)
        })
        .end(function (err) {
          if (err) return done(err)
          done()
        })
    })

    it.skip('works with relative fileDataUrl', function (done) {
      // TODO: this test does not work on Travis - need better way to test
      // fileDataUrl with relative and absolute paths that work on Travis
      // default config.VIEWER_PATH is approot/js/viewer
      // test data in approot/test/data
      request(app)
        .get('/api/templates?fileDataUrl=../../test/data/DEV/guides/Guide1262/')
        .expect(200, [template2114Data])
        .end(function (err) {
          if (err) return done(err)
          done()
        })
    })
  })
})
