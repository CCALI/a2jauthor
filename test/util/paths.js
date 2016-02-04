var assert = require('assert');
var sinon = require('sinon');
var Q = require('q');
var path = require('path');

var paths = require('../../src/util/paths');
var user = require('../../src/util/user');

var debug = require('debug')('A2J:tests');

describe('lib/util/paths', function() {
  let guidesDir, currentUser, getCurrentUserStub;

  beforeEach(function() {
    let mockDeferred = Q.defer();

    guidesDir = '/foo/userfiles/';
    currentUser = 'DEV';

    getCurrentUserStub = sinon.stub(user, 'getCurrentUser');
    getCurrentUserStub.returns(mockDeferred.promise);

    paths.guidesDir = guidesDir;
    mockDeferred.resolve(currentUser);
  });

  afterEach(function() {
    getCurrentUserStub.restore();
  });

  it('getTemplatesPath', function(done) {
    paths.getTemplatesPath()
      .then((templatesPath) => {
        assert.equal(templatesPath,
                    path.join(guidesDir, currentUser, 'templates.json'));
        done();
      });
  });

  it('getTemplatePath', function(done) {
    paths.getTemplatePath({ guideId: 'Guide20', templateId: 20 })
      .then((templatesPath) => {
        assert.equal(templatesPath,
                    path.join(guidesDir, currentUser, 'guides', 'Guide20', 'template20.json'));
        done();
      });
  });
});
