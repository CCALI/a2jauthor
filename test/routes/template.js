var assert = require('assert');
var sinon = require('sinon');
var Q = require('q');
var _ = require('lodash');

var template = require('../../src/routes/template');
var files = require('../../src/util/files');
var user = require('../../src/util/user');
var templates = require('../../src/routes/templates');

var templatesData = require('../data/templates-data');
var template2112Data = require('../data/template-2112-data');
var template2113Data = require('../data/template-2113-data');

var debug = require('debug')('A2J:test');

describe('lib/routes/template', function() {
  let getCurrentUserStub,
      currentUserName;

  beforeEach(function() {
    let mockCurrentUserDeferred = Q.defer();
    currentUserName = 'DEV';
    getCurrentUserStub = sinon.stub(user, 'getCurrentUser');
    getCurrentUserStub.returns(mockCurrentUserDeferred.promise);
    mockCurrentUserDeferred.resolve(currentUserName);
  });

  afterEach(function() {
    getCurrentUserStub.restore();
  });

  describe('get', function() {
    var getTemplatesJSONStub,
        readJSONStub,
        getTemplatesJSONDeferred,
        readFileStub;

    beforeEach(function() {
      getTemplatesJSONDeferred = Q.defer();
      readFileStub = Q.defer();

      getTemplatesJSONStub = sinon.stub(templates, 'getTemplatesJSON');
      readJSONStub = sinon.stub(files, 'readJSON');

      getTemplatesJSONStub.returns(getTemplatesJSONDeferred.promise);
      readJSONStub.returns(readFileStub.promise);

      getTemplatesJSONDeferred.resolve(templatesData);
      readFileStub.resolve(template2112Data);
    });

    afterEach(function() {
      readJSONStub.restore();
      getTemplatesJSONStub.restore();
    });

    it('should return data for a template', function(done) {
      template.get(2112, null, function(err, data) {
        assert.deepEqual(data, template2112Data);
        done();
      });
    });

    it('should return an error when template does not have data', function(done) {
      template.get(2113, null, function(err, data) {
        assert(err);
        done();
      });
    });
  });

  describe('update', function() {
    var readJSONStub,
        mergeJSONStub,
        writeJSONStub,
        mockReadDeferred,
        mockMergeDeferred,
        mockWriteDeferred;

    beforeEach(function() {
      mockReadDeferred = Q.defer();
      mockMergeDeferred = Q.defer();
      mockWriteDeferred = Q.defer();

      readJSONStub = sinon.stub(files, 'readJSON');
      mergeJSONStub = sinon.stub(files, 'mergeJSON');
      writeJSONStub = sinon.stub(files, 'writeJSON');

      readJSONStub.returns(mockReadDeferred.promise);
      mergeJSONStub.returns(mockMergeDeferred.promise);
      writeJSONStub.returns(mockWriteDeferred.promise);

      mockReadDeferred.resolve(templatesData);
      mockMergeDeferred.resolve(JSON.stringify(templatesData));
      mockWriteDeferred.resolve(JSON.stringify(template2112Data));
    });

    afterEach(function() {
      readJSONStub.restore();
      mergeJSONStub.restore();
      writeJSONStub.restore();
    });

    it('should write updated data to file', function(done) {
      template.update(2112, _.omit(template2112Data, 'templateId'), null, function(err, data) {
        let fileName = writeJSONStub.getCall(0).args[0].path;
        fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

        assert.equal(fileName, 'template2112.json');
        assert.deepEqual(writeJSONStub.getCall(0).args[0].data, template2112Data);

        let mergeFileName = mergeJSONStub.getCall(0).args[0].path;
        mergeFileName = mergeFileName.substring(mergeFileName.lastIndexOf('/') + 1);

        assert.equal(mergeFileName, 'templates.json',
          'should write summary file');
        assert.deepEqual(mergeJSONStub.getCall(0).args[0].data,
          _.pick(template2112Data, template.summaryFields),
          'with correct summary data');
        assert.deepEqual(mergeJSONStub.getCall(0).args[0].replaceKey, 'templateId', 'with correct unique id')

        assert.deepEqual(data, JSON.stringify(template2112Data),
          'http response should only contain updated template data');

        done();
      });
    });
  });

  describe('create', function() {
    var getTemplatesJSONStub,
        writeJSONStub,
        mergeJSONStub,
        getTemplatesJSONDeferred,
        mockWriteDeferred,
        mockMergeDeferred;

    beforeEach(function() {
      getTemplatesJSONDeferred = Q.defer();
      mockWriteDeferred = Q.defer();
      mockMergeDeferred = Q.defer();

      getTemplatesJSONStub = sinon.stub(templates, 'getTemplatesJSON');
      writeJSONStub = sinon.stub(files, 'writeJSON');
      mergeJSONStub = sinon.stub(files, 'mergeJSON');

      getTemplatesJSONStub.returns(getTemplatesJSONDeferred.promise);
      writeJSONStub.returns(mockWriteDeferred.promise);
      mergeJSONStub.returns(mockMergeDeferred.promise);
    });

    afterEach(function() {
      getTemplatesJSONStub.restore();
      writeJSONStub.restore();
      mergeJSONStub.restore();
    });

    it('should write data to next template file', function(done) {
      let newData = _.assign({}, template2112Data, { templateId: 2115 });

      getTemplatesJSONDeferred.resolve(templatesData);
      mockWriteDeferred.resolve(JSON.stringify(newData));
      mockMergeDeferred.resolve(JSON.stringify(templatesData));

      template.create(_.omit(template2112Data, [ 'templateId' ]), null, function(err, data) {
        var writeFileName = writeJSONStub.getCall(0).args[0].path;
        writeFileName = writeFileName.substring(writeFileName.lastIndexOf('/') + 1);

        assert.equal(writeFileName, 'template2115.json',
          'should write template file');
        assert.deepEqual(writeJSONStub.getCall(0).args[0].data, newData,
          'should write template file with template data');

        var mergeFileName = mergeJSONStub.getCall(0).args[0].path;
        mergeFileName = mergeFileName.substring(mergeFileName.lastIndexOf('/') + 1);

        assert.equal(mergeFileName, 'templates.json',
          'should write summary file');
        assert.deepEqual(mergeJSONStub.getCall(0).args[0].data,
          _.pick(newData, template.summaryFields),
          'with correct summary data');

        assert.deepEqual(data, JSON.stringify(newData),
          'http response should only contain new template data');

        done();
      });
    });

    it('should write data to template1 when no templates exist', function(done) {
      let newData = _.assign({}, template2112Data, { templateId: 2115 });

      getTemplatesJSONDeferred.resolve([]);
      mockWriteDeferred.resolve(JSON.stringify(newData));
      mockMergeDeferred.resolve(JSON.stringify(templatesData));

      template.create(_.omit(template2112Data, [ 'templateId' ]), null, function() {
        var newData = _.assign({}, template2112Data, { templateId: 1 });
        var writeFileName = writeJSONStub.getCall(0).args[0].path;
        writeFileName = writeFileName.substring(writeFileName.lastIndexOf('/') + 1);

        assert.equal(writeFileName, 'template1.json',
          'should write template file');
        assert.deepEqual(writeJSONStub.getCall(0).args[0].data, newData,
          'should write template file with template data');

        var mergeFileName = mergeJSONStub.getCall(0).args[0].path;
        mergeFileName = mergeFileName.substring(mergeFileName.lastIndexOf('/') + 1);

        assert.equal(mergeFileName, 'templates.json',
          'should write summary file');
        assert.deepEqual(mergeJSONStub.getCall(0).args[0].data,
          _.pick(newData, template.summaryFields),
          'with correct summary data');

        done();
      });
    });
  });

  describe('remove', function() {
    var readJSONStub,
        spliceJSONStub,
        deleteStub,
        mockReadDeferred,
        mockSpliceDeferred,
        mockDeleteDeferred;

    beforeEach(function() {
      mockReadDeferred = Q.defer();
      mockSpliceDeferred = Q.defer();
      mockDeleteDeferred = Q.defer();

      readJSONStub = sinon.stub(files, 'readJSON');
      spliceJSONStub = sinon.stub(files, 'spliceJSON');
      deleteStub = sinon.stub(files, 'delete');

      readJSONStub.returns(mockReadDeferred.promise);
      spliceJSONStub.returns(mockSpliceDeferred.promise);
      deleteStub.returns(mockDeleteDeferred.promise);

      mockReadDeferred.resolve(templatesData);
      mockSpliceDeferred.resolve(templatesData);
      mockDeleteDeferred.resolve('foo/bar/baz/template2112.json');
    });

    afterEach(function() {
      readJSONStub.restore();
      spliceJSONStub.restore();
      deleteStub.restore();
    });

    it('should delete file', function(done) {
      template.remove(2112, null, function() {
        var deletedFile = deleteStub.getCall(0).args[0].path;
        deletedFile = deletedFile.substring(deletedFile.lastIndexOf('/') + 1);

        assert.equal(deletedFile, 'template2112.json');

        var splicedFile = spliceJSONStub.getCall(0).args[0].path;
        splicedFile = splicedFile.substring(splicedFile.lastIndexOf('/') + 1);

        assert.equal(splicedFile, 'templates.json');
        assert.deepEqual(spliceJSONStub.getCall(0).args[0].data,
          _.pick(template2112Data, template.summaryFields));

        done();
      });
    });
  });
});
