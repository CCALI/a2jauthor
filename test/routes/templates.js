const Q = require('q');
const sinon = require('sinon');
const assert = require('assert');

const app = require('../../src/app');
const request = require('supertest');

const templates = require('../../src/routes/templates');
const files = require('../../src/util/files');
const paths = require('../../src/util/paths');
const user = require('../../src/util/user');

const templatesData = require('../data/templates-data');
const template2112Data = require('../data/template-2112-data');
const template2113Data = require('../data/template-2113-data');
const template2114Data = require('../data/template-2114-data');

describe.only('lib/routes/templates', function() {

  describe('with mocks', function() {
    let getTemplatesPathStub;
    let templatesJSONPath;
    let currentUserName;
    let params;

    beforeEach(function() {
      let mockTemplatesPathDeferred = Q.defer();

      templatesJSONPath = 'path/to/templates/templates.json';
      currentUserName = 'DEV';
      params = {};

      getTemplatesPathStub = sinon.stub(paths, 'getTemplatesPath');

      getTemplatesPathStub.returns(mockTemplatesPathDeferred.promise);

      mockTemplatesPathDeferred.resolve(templatesJSONPath);
    });

    afterEach(function() {
      getTemplatesPathStub.restore();
    });

    describe('getTemplatesJSON', function() {
      let readFileStub;
      let writeFileStub;

      beforeEach(function() {
        readFileStub = sinon.stub(files, 'readJSON');
        writeFileStub = sinon.stub(files, 'writeJSON');
      });

      afterEach(function() {
        readFileStub.restore();
        writeFileStub.restore();
      });

      it('should return data from templates JSON file when it exists', function(done) {
        let mockTemplatesDeferred = Q.defer();

        readFileStub.returns(mockTemplatesDeferred.promise);
        mockTemplatesDeferred.resolve(templatesData);

        templates.getTemplatesJSON({ username: currentUserName })
          .then(data => {
            assert.deepEqual(data, templatesData);
            done();
          });
      });

      it('should write empty templates JSON file when it does not exist and return the empty array', function(done) {
        readFileStub.throws(`Error: ENOENT: no such file or directory, open '../templates.json'`);
        writeFileStub.returns([]);

        templates.getTemplatesJSON({ username: currentUserName })
          .then(data => {
            assert.equal(writeFileStub.getCall(0).args[0].path, templatesJSONPath, 'should write file');
            assert.deepEqual(writeFileStub.getCall(0).args[0].data, [], 'with empty array');
            assert.deepEqual(data, []);
            done();
          });
      });
    });

    describe('GET /api/templates/{guideId}', function() {
      let getTemplatesJSONStub;
      let getTemplatePathStub;
      let getCurrentUserStub;
      let readFileStub;

      beforeEach(function() {
        let mockCurrentUserDeferred = Q.defer();
        let mockTemplatesJSONDeferred = Q.defer();

        getTemplatesJSONStub = sinon.stub(templates, 'getTemplatesJSON');
        getTemplatePathStub = sinon.stub(paths, 'getTemplatePath');
        getCurrentUserStub = sinon.stub(user, 'getCurrentUser');

        readFileStub = sinon.stub(files, 'readJSON', ({ path }) => {
          if (path.indexOf('template2112.json') >= 0) {
            return template2112Data;
          }

          if (path.indexOf('template2113.json') >= 0) {
            return template2113Data;
          }

          if (path.indexOf('template2114.json') >= 0) {
            return template2114Data;
          }
        });

        getTemplatesJSONStub.returns(mockTemplatesJSONDeferred.promise);
        getCurrentUserStub.returns(mockCurrentUserDeferred.promise);

        mockTemplatesJSONDeferred.resolve(templatesData);
        mockCurrentUserDeferred.resolve(currentUserName);
      });

      afterEach(function() {
        getTemplatesJSONStub.restore();
        getTemplatePathStub.restore();
        getCurrentUserStub.restore();
        readFileStub.restore();
      });

      it('should return templates data for a guide', function(done) {
        let deferredOne = Q.defer();
        let deferredTwo = Q.defer();

        getTemplatePathStub.onFirstCall().returns(deferredOne.promise);
        getTemplatePathStub.onSecondCall().returns(deferredTwo.promise);

        deferredOne.resolve('path/to/template2112.json');
        deferredTwo.resolve('path/to/template2113.json');

        templates.get('Guide1261', params, function(err, data) {
          assert.equal(data.length, 2, 'should get 2 templates');
          assert.deepEqual(data[0], template2112Data, 'should get full data for first template');
          assert.deepEqual(data[1], template2113Data, 'should get full data for second template');
          done();
        });
      });

      it('should return templates data for a different guide', function(done) {
        let deferredOne = Q.defer();

        getTemplatePathStub.onFirstCall().returns(deferredOne.promise);

        deferredOne.resolve('path/to/template2114.json');

        templates.get('Guide1262', params, function(err, data) {
          assert.equal(data.length, 1, 'should return template data for another guide');
          assert.deepEqual(data[0], template2114Data, 'should get full data for first template');
          done();
        });
      });

      it('should return an error when guide does have templates data', function(done) {
        templates.get('Guide1337', params, function(err, data) {
          assert.deepEqual(data, []);
          done();
        });
      });

      it('should filter templates to active=true', function(done) {
        let deferredOne = Q.defer();
        let deferredTwo = Q.defer();

        getTemplatePathStub.onFirstCall().returns(deferredOne.promise);
        getTemplatePathStub.onSecondCall().returns(deferredTwo.promise);

        deferredOne.resolve('path/to/template2112.json');
        deferredTwo.resolve('path/to/template2113.json');

        params = { query: { active: 'true' } };

        templates.get('Guide1261', params, function(err, data) {
          assert.equal(data.length, 1, 'should get 1 templates');
          assert.deepEqual(data[0], template2112Data, 'should get full data for first template');
          done();
        });
      });

      it('should filter templates to active=false', function(done) {
        let deferredOne = Q.defer();
        let deferredTwo = Q.defer();

        getTemplatePathStub.onFirstCall().returns(deferredOne.promise);
        getTemplatePathStub.onSecondCall().returns(deferredTwo.promise);

        deferredOne.resolve('path/to/template2112.json');
        deferredTwo.resolve('path/to/template2113.json');

        params = { query: { active: 'false' } };

        templates.get('Guide1261', params, function(err, data) {
          assert.equal(data.length, 1, 'should get 1 templates');
          assert.deepEqual(data[0], template2113Data, 'should get full data for first template');
          done();
        });
      });
    });
  });

  describe('GET /api/templates?filterDataUrl=', function() {
    it('fails if fileDataUrl query param missing', function(done) {
      request(app)
        .get('/api/templates')
        .expect(500, 'You must provide fileDataUrl\n')
        .end(function(err) {
          if (err) return done(err);
          done();
        });
    });

    it('works', function(done) {
      request(app)
        .get('/api/templates?fileDataUrl=/test/data')
        .expect(200, [template2114Data])
        .end(function(err) {
          if (err) return done(err);
          done();
        });
    });
  });

});
