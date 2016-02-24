const path = require('path');
const sinon = require('sinon');
const assert = require('assert');
const _includes = require('lodash/includes');

const paths = require('../../src/util/paths');
const config = require('../../src/util/config');

describe('lib/util/paths', function() {
  let guidesDir;
  let currentUser;
  let configGetStub;

  beforeEach(function() {
    guidesDir = '/foo/userfiles/';

    configGetStub = sinon.stub(config, 'get');
    configGetStub.returns(guidesDir);

    currentUser = 'DEV';
  });

  afterEach(function() {
    configGetStub.restore();
  });

  describe('getTemplatesPath', function() {
    it('builds the right path when username provided', function() {
      const promise = paths.getTemplatesPath({ username: currentUser });

      return promise.then((templatesPath) => {
        const expected = path.join(guidesDir, currentUser, 'templates.json');
        assert.equal(templatesPath, expected);
      });
    });

    it('builds the right path when fileDataUrl provided', function() {
      const fileDataUrl = 'path/to/file/data';
      const promise = paths.getTemplatesPath({ fileDataUrl });

      return promise.then((templatesPath) => {
        assert.ok(_includes(templatesPath, `CAJA/js/viewer/${fileDataUrl}`));
      });
    });
  });

  describe('getTemplatePath', function() {
    it('builds the right path when username provided', function() {
      const promise = paths.getTemplatePath({
        guideId: 20,
        templateId: 20,
        username: currentUser
      });

      return promise.then((templatesPath) => {
        const expected = path.join(guidesDir, currentUser, 'guides/Guide20/template20.json');
        assert.equal(templatesPath, expected);
      });
    });

    it('builds the right path when fileDataUrl provided', function() {
      const promise = paths.getTemplatePath({
        templateId: 20,
        fileDataUrl: 'path/to/file/data'
      });

      return promise.then((templatesPath) => {
        const expected = 'CAJA/js/viewer/path/to/file/data/template20.json';
        assert.ok(_includes(templatesPath, expected));
      });
    });

  });
});
