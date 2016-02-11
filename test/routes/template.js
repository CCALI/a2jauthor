var assert = require('assert');
var sinon = require('sinon');
var Q = require('q');
var _ = require('lodash');

var template = require('../../src/routes/template');
var files = require('../../src/util/files');
var user = require('../../src/util/user');
var config = require('../../src/util/config');
var paths = require('../../src/util/paths');
var templates = require('../../src/routes/templates');

var templatesData = require('../data/templates-data');
var template2112Data = require('../data/template-2112-data');
var template2113Data = require('../data/template-2113-data');

var debug = require('debug')('A2J:test');

describe('lib/routes/template', function() {
  let getCurrentUserStub,
      getTemplatesPathStub,
      getTemplatePathStub,
      mockTemplatesPathDeferred,
      mockTemplatePathDeferred,
      currentUserName,
      params,
      guidesDir;

  beforeEach(function() {
    let mockCurrentUserDeferred = Q.defer();

    mockTemplatesPathDeferred = Q.defer();
    mockTemplatePathDeferred = Q.defer();

    currentUserName = 'DEV';
    params = {};
    guidesDir = '/foo/userfiles/';
    paths.guidesDir = guidesDir;

    getCurrentUserStub = sinon.stub(user, 'getCurrentUser');
    getTemplatesPathStub = sinon.stub(paths, 'getTemplatesPath');
    getTemplatePathStub = sinon.stub(paths, 'getTemplatePath');

    getCurrentUserStub.returns(mockCurrentUserDeferred.promise);
    getTemplatesPathStub.returns(mockTemplatesPathDeferred.promise);
    getTemplatePathStub.returns(mockTemplatePathDeferred.promise);
    mockCurrentUserDeferred.resolve(currentUserName);
  });

  afterEach(function() {
    getCurrentUserStub.restore();
    getTemplatesPathStub.restore();
    getTemplatePathStub.restore();
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
      mockTemplatePathDeferred.resolve('path/to/template2112.json');

      template.get(2112, params, function(err, data) {
        assert.deepEqual(data, template2112Data);
        done();
      });
    });

    it('should return an error when template does not have data', function(done) {
      mockTemplatePathDeferred.resolve('path/to/template2113.json');

      template.get(2113, params, function(err, data) {
        assert(err);
        done();
      });
    });
  });

  describe('update', function() {
    var readJSONStub,
        mergeJSONStub,
        writeJSONStub,
        dateNowStub,
        mockReadDeferred,
        mockMergeDeferred,
        mockWriteDeferred,
        mockCreatedTime,
        mockCurrentTime;

    beforeEach(function() {
      mockReadDeferred = Q.defer();
      mockMergeDeferred = Q.defer();
      mockWriteDeferred = Q.defer();
      mockCreatedTime = 1455044906872;
      mockCurrentTime = 1455555555555;

      readJSONStub = sinon.stub(files, 'readJSON');
      mergeJSONStub = sinon.stub(files, 'mergeJSON');
      writeJSONStub = sinon.stub(files, 'writeJSON');

      readJSONStub.returns(mockReadDeferred.promise);
      mergeJSONStub.returns(mockMergeDeferred.promise);
      writeJSONStub.returns(mockWriteDeferred.promise);
      dateNowStub = sinon.stub(Date, 'now');

      mockReadDeferred.resolve(templatesData);
      mockMergeDeferred.resolve(JSON.stringify(templatesData));
      mockWriteDeferred.resolve(JSON.stringify(template2112Data));
      dateNowStub.returns(mockCurrentTime);
    });

    afterEach(function() {
      readJSONStub.restore();
      mergeJSONStub.restore();
      writeJSONStub.restore();
      dateNowStub.restore();
    });

    it('should write updated data to file', function(done) {
      let inputData = _.assign(_.omit(template2112Data, 'templateId'), {
        createdAt: mockCreatedTime,
        updatedAt: mockCreatedTime
      });

      let newData = _.assign({}, template2112Data, {
        createdAt: mockCreatedTime,
        updatedAt: mockCurrentTime
      });

      mockTemplatesPathDeferred.resolve('path/to/templates.json');
      mockTemplatePathDeferred.resolve('path/to/template2112.json');

      template.update(2112, inputData, params, function(err, data) {
        let fileName = writeJSONStub.getCall(0).args[0].path;
        fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

        assert.equal(fileName, 'template2112.json', 'should write template file');
        assert.deepEqual(writeJSONStub.getCall(0).args[0].data, newData,
          'should write template file with template data');

        let mergeFileName = mergeJSONStub.getCall(0).args[0].path;
        mergeFileName = mergeFileName.substring(mergeFileName.lastIndexOf('/') + 1);

        assert.equal(mergeFileName, 'templates.json', 'should write summary file');
        assert.deepEqual(mergeJSONStub.getCall(0).args[0].data,
          _.pick(inputData, template.summaryFields), 'with correct summary data');
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
        dateNowStub,
        getTemplatesJSONDeferred,
        mockWriteDeferred,
        mockMergeDeferred,
        mockCurrentTime;

    beforeEach(function() {
      getTemplatesJSONDeferred = Q.defer();
      mockWriteDeferred = Q.defer();
      mockMergeDeferred = Q.defer();
      mockCurrentTime = 1455044906872;

      getTemplatesJSONStub = sinon.stub(templates, 'getTemplatesJSON');
      writeJSONStub = sinon.stub(files, 'writeJSON');
      mergeJSONStub = sinon.stub(files, 'mergeJSON');
      dateNowStub = sinon.stub(Date, 'now');

      getTemplatesJSONStub.returns(getTemplatesJSONDeferred.promise);
      writeJSONStub.returns(mockWriteDeferred.promise);
      mergeJSONStub.returns(mockMergeDeferred.promise);
      dateNowStub.returns(mockCurrentTime);
    });

    afterEach(function() {
      getTemplatesJSONStub.restore();
      writeJSONStub.restore();
      mergeJSONStub.restore();
      dateNowStub.restore();
    });

    it('should write data to next template file', function(done) {
      let inputData = _.omit(template2112Data, [ 'templateId' ]);

      let newData = _.assign({}, template2112Data, {
        templateId: 2115,
        createdAt: mockCurrentTime,
        updatedAt: mockCurrentTime
      });

      mockTemplatesPathDeferred.resolve('path/to/templates.json');
      mockTemplatePathDeferred.resolve('path/to/template2115.json');

      getTemplatesJSONDeferred.resolve(templatesData);
      mockWriteDeferred.resolve(JSON.stringify(newData));
      mockMergeDeferred.resolve(JSON.stringify(templatesData));

      template.create(inputData, params, function(err, data) {
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
      let inputData = _.omit(template2112Data, [ 'templateId' ]);

      let newData = _.assign({}, template2112Data, {
        templateId: 1,
        createdAt: mockCurrentTime,
        updatedAt: mockCurrentTime
      });

      mockTemplatesPathDeferred.resolve('path/to/templates.json');
      mockTemplatePathDeferred.resolve('path/to/template1.json');

      getTemplatesJSONDeferred.resolve([]);
      mockWriteDeferred.resolve(JSON.stringify(newData));
      mockMergeDeferred.resolve(JSON.stringify(templatesData));

      template.create(inputData, params, function() {
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
});
