var assert = require('assert');
var sinon = require('sinon');
var Q = require('q');
var request = require('request');

var user = require('../../src/util/user');

var debug = require('debug')('A2J:tests');

describe('lib/util/user', function() {
  let requestPostStub,
      currentUsername,
      cookieHeader;

  beforeEach(function() {
    requestPostStub = sinon.stub(request, 'post');
    currentUsername = 'A2J_User';
    cookieHeader = 'one=1; two=2;';
  });

  afterEach(function() {
    requestPostStub.restore();
  });

  describe('getCurrentUser', function() {
    it('should succeed when request.post returns a username', function(done) {
      requestPostStub.callsArgWith(2, null, {
        statusCode: 200
      }, JSON.stringify({
        username: currentUsername
      }));

      user.getCurrentUser({ cookieHeader })
        .then(function(username) {
          let headers = requestPostStub.getCall(0).args[1].headers;

          assert.deepEqual(headers, { Cookie: cookieHeader }, 'should pass cookies HTTP header to request.post');

          assert.equal(username, currentUsername, 'should resolve with username');
          done();
        });
    });

    describe('when NODE_ENV !== "production"', function() {
      it('should return "dev" when request.post fails', function(done) {
        requestPostStub.callsArgWith(2, 'Error!', {
          statusCode: 200
        });

        user.getCurrentUser({ cookieHeader })
          .then(function(username) {
            assert.equal(username, 'dev');
            done();
          });
      });

      it('should return "dev" when request.post fails (HTTP)', function(done) {
        requestPostStub.callsArgWith(2, null, {
          statusCode: 404
        });

        user.getCurrentUser({ cookieHeader })
          .then(function(username) {
            assert.equal(username, 'dev');
            done();
          });
      });

      it('should return "dev" when response is not valid JSON', function(done) {
        requestPostStub.callsArgWith(2, null, {
          statusCode: 200
        }, 'foo');

        user.getCurrentUser({ cookieHeader })
          .then(function(username) {
            assert.equal(username, 'dev');
            done();
          });
      });
    });

    describe('when NODE_ENV === "production"', function() {
      it('should fail when request.post fails', function(done) {
        requestPostStub.callsArgWith(2, 'Error!', {
          statusCode: 200
        });
        user.nodeEnv = 'production';

        user.getCurrentUser({ cookieHeader })
          .catch(function(error) {
            assert(error);
            done();
          });
      });

      it('should fail when request.post fails (HTTP)', function(done) {
        requestPostStub.callsArgWith(2, null, {
          statusCode: 404
        });
        user.nodeEnv = 'production';

        user.getCurrentUser({ cookieHeader })
          .catch(function(error) {
            assert(error);
            done();
          });
      });

      it('should fail when response is not valid JSON', function(done) {
        requestPostStub.callsArgWith(2, null, {
          statusCode: 200
        }, 'foo');
        user.nodeEnv = 'production';

        user.getCurrentUser({ cookieHeader })
          .catch(function(error) {
            assert(error);
            done();
          });
      });
    });
  });
});
