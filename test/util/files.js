var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');
var Q = require('q');

var files = require('../../src/util/files');

var templatesData = require('../data/templates-data');

var debug = require('debug')('A2J:tests');

describe('lib/util/files', function() {
  describe('readJSON', function() {
    var readFileStub;

    beforeEach(function() {
      readFileStub = sinon.stub(fs, 'readFile');
    });

    afterEach(function() {
      fs.readFile.restore();
    });

    it('should correctly read JSON', function(done) {
      readFileStub.callsArgWith(2, null, JSON.stringify(templatesData));

      files.readJSON()
        .then(function(data) {
          assert.deepEqual(data, templatesData);
          done();
        });
    });

    it('should fail when data is non-JSON', function(done) {
      readFileStub.callsArgWith(2, null, templatesData);

      files.readJSON()
        .catch(function(err) {
          assert(err);
          done();
        });
    });

    it('should fail when file cannot be read', function(done) {
      readFileStub.callsArgWith(2, "Some Error");

      files.readJSON()
        .catch(function(err) {
          assert(err);
          done();
        });
    });
  });

  describe('writeJSON', function() {
    var writeFileStub;

    beforeEach(function() {
      writeFileStub = sinon.stub(fs, 'writeFile');
    });

    afterEach(function() {
      fs.writeFile.restore();
    });

    it('should write', function(done) {
      writeFileStub.callsArgWith(2, null);

      files.writeJSON('foo.json', templatesData)
        .then(function(data) {
          var jsonData = JSON.stringify(templatesData, null, '\t');
          assert.equal(writeFileStub.getCall(0).args[0], 'foo.json', 'to correct file');
          assert.deepEqual(writeFileStub.getCall(0).args[1], jsonData, 'with correct data');
          assert.deepEqual(data, templatesData, 'and return the raw data');
          done();
        });
    });

    it('should fail when file cannot be written', function(done) {
      writeFileStub.callsArgWith(2, "Some Error");

      files.writeJSON('foo.json', templatesData)
        .catch(function(err) {
          assert(err);
          done();
        });
    });
  });

  describe('mergeJSON', function() {
    var mockReadJSONDeferred, mockReadJSON, mockWriteJSONDeferred, mockWriteJSON;

    beforeEach(function() {
      mockReadJSONDeferred = Q.defer();
      mockReadJSON = sinon.stub(files, 'readJSON');
      mockReadJSON.returns(mockReadJSONDeferred.promise);

      mockWriteJSONDeferred = Q.defer();
      mockWriteJSON = sinon.stub(files, 'writeJSON');
      mockWriteJSON.returns(mockWriteJSONDeferred.promise);
    });

    afterEach(function() {
      files.readJSON.restore();
      files.writeJSON.restore();
      mockReadJSONDeferred = null;
      mockWriteJSONDeferred = null;
    });

    it('should merge object into array in JSON file', function(done) {
      var fileInputData = [{ foo: "bar" }];
      var userInputData = { baz: "xyz" };
      var expectedData = [{ foo: "bar" }, { baz: "xyz" }];

      mockReadJSONDeferred.resolve(fileInputData);
      mockWriteJSONDeferred.resolve(JSON.stringify(expectedData));

      files.mergeJSON('foo.json', userInputData)
        .then(function(data) {
          assert.equal(mockWriteJSON.getCall(0).args[0], 'foo.json', 'should write to JSON file');
          assert.deepEqual(mockWriteJSON.getCall(0).args[1], expectedData, 'with correct data');
          done();
        });
    });

    it('should merge object into array in JSON file and overwrite data with same unique key value', function(done) {
      var fileInputData = [{
        templateId: 1,
        title: "template 1"
      }, {
        templateId: 2,
        title: 'template 2'
      }];

      var userInputData = {
        templateId: 1,
        title: "updated template 1"
      };

      var expectedData = [{
        templateId: 1,
        title: "updated template 1"
      }, {
        templateId: 2,
        title: 'template 2'
      }];

      mockReadJSONDeferred.resolve(fileInputData);
      mockWriteJSONDeferred.resolve(JSON.stringify(expectedData));

      files.mergeJSON('foo.json', userInputData, 'templateId')
        .then(function(data) {
          let writtenData = mockWriteJSON.getCall(0).args[1];

          assert.equal(mockWriteJSON.getCall(0).args[0], 'foo.json', 'should write to JSON file');
          assert.deepEqual(writtenData, expectedData, 'with correct data');
          done();
        });
    });
  });

  describe('spliceJSON', function() {
    var mockReadJSONDeferred, mockReadJSON, mockWriteJSONDeferred, mockWriteJSON;

    beforeEach(function() {
      mockReadJSONDeferred = Q.defer();
      mockReadJSON = sinon.stub(files, 'readJSON');
      mockReadJSON.returns(mockReadJSONDeferred.promise);

      mockWriteJSONDeferred = Q.defer();
      mockWriteJSON = sinon.stub(files, 'writeJSON');
      mockWriteJSON.returns(mockWriteJSONDeferred.promise);
    });

    afterEach(function() {
      files.readJSON.restore();
      files.writeJSON.restore();
      mockReadJSONDeferred = null;
      mockWriteJSONDeferred = null;
    });

    it('should splice object out of array in JSON file', function(done) {
      var fileInputData = [{ foo: "bar" }, { baz: "xyz" }];
      var userInputData = { baz: "xyz" };
      var expectedData = [{ foo: "bar" }];

      mockReadJSONDeferred.resolve(fileInputData);
      mockWriteJSONDeferred.resolve(JSON.stringify(expectedData));

      files.spliceJSON('foo.json', userInputData)
        .then(function(data) {
          assert.equal(mockWriteJSON.getCall(0).args[0], 'foo.json', 'should write to JSON file');
          assert.deepEqual(mockWriteJSON.getCall(0).args[1], expectedData, 'with correct data');
          done();
        });
      });
  });
});
