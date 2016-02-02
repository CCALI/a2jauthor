var assert = require('assert');
var sinon = require('sinon');
var Q = require('q');

var templates = require('../../src/routes/templates');
var files = require('../../src/util/files');
var paths = require('../../src/util/paths');

var templatesData = require('../data/templates-data');

var debug = require('debug')('A2J:tests/routes/templates');

describe('lib/routes/templates', function() {
  let getTemplatesPathStub, templatesJSONPath;

  beforeEach(function() {
    let mockTemplatesPathDeferred = Q.defer();
    templatesJSONPath = '.../templates.json';
    getTemplatesPathStub = sinon.stub(paths, 'getTemplatesPath');
    getTemplatesPathStub.returns(mockTemplatesPathDeferred.promise);
    mockTemplatesPathDeferred.resolve(templatesJSONPath);
  });

  afterEach(function() {
    getTemplatesPathStub.restore();
  });

  describe('getTemplatesJSON', function() {
    let readFileStub, writeFileStub;

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

      templates.getTemplatesJSON()
        .then(data => {
          assert.deepEqual(data, templatesData);
          done();
        });
    });

    it('should write empty templates JSON file when it does not exist and return the empty array', function(done) {
      readFileStub.throws("Error: ENOENT: no such file or directory, open '.../templates.json'");
      writeFileStub.returns([]);

      templates.getTemplatesJSON()
        .then(data => {
          assert.equal(writeFileStub.getCall(0).args[0], templatesJSONPath, 'should write file');
          assert.deepEqual(writeFileStub.getCall(0).args[1], [], 'with empty array');
          assert.deepEqual(data, []);
          done();
        });
    });
  });

  describe('get', function(done) {
    let getTemplatesJSONStub, mockTemplatesJSONDeferred;

    beforeEach(function() {
      mockTemplatesJSONDeferred = Q.defer();

      getTemplatesJSONStub = sinon.stub(templates, 'getTemplatesJSON');
      getTemplatesJSONStub.returns(mockTemplatesJSONDeferred.promise);

      mockTemplatesJSONDeferred.resolve(templatesData);
    });

    afterEach(function() {
      templates.getTemplatesJSON.restore();
    });

    it('should return templates data for a guide', function(done) {
      templates.get('Guide1261', null, function(err, data) {
        assert.equal(data.length, 2);
        done();
      });
    });

    it('should return templates data for a different guide', function(done) {
      templates.get('Guide1262', null, function(err, data) {
        assert.equal(data.length, 1, 'should return template data for another guide');
        done();
      });
    });

    it('should return an error when guide does have templates data', function(done) {
      templates.get('Guide1337', null, function(err, data) {
        assert.deepEqual(data, []);
        done();
      });
    });
  });
});
