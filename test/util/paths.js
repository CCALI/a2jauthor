const path = require('path');
const sinon = require('sinon');
const assert = require('assert');

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

  it('getTemplatesPath', function() {
    const promise = paths.getTemplatesPath({ username: currentUser });

    return promise.then((templatesPath) => {
      const expected = path.join(guidesDir, currentUser, 'templates.json');
      assert.equal(templatesPath, expected);
    });
  });

  it('getTemplatePath', function() {
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
});
