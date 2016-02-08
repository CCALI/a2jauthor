var assert = require('assert');
var sinon = require('sinon');
var Q = require('q');
var path = require('path');

var paths = require('../../src/util/paths');

var debug = require('debug')('A2J:tests');

describe('lib/util/paths', function() {
  let guidesDir, currentUser;

  beforeEach(function() {
    guidesDir = '/foo/userfiles/';
    paths.guidesDir = guidesDir;

    currentUser = 'DEV';
  });

  it('getTemplatesPath', function(done) {
    paths.getTemplatesPath({ username: currentUser })
      .then((templatesPath) => {
        assert.equal(templatesPath,
                    path.join(guidesDir, currentUser, 'templates.json'));
        done();
      });
  });

  it('getTemplatePath', function(done) {
    paths.getTemplatePath({ username: currentUser, guideId: 'Guide20', templateId: 20 })
      .then((templatesPath) => {
        assert.equal(templatesPath,
                    path.join(guidesDir, currentUser, 'guides', 'Guide20', 'template20.json'));
        done();
      });
  });
});
