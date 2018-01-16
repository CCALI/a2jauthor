var assert = require('assert')
var sinon = require('sinon')
var request = require('request')

var config = require('../../src/util/config')
var user = require('../../src/util/user')

describe('lib/util/user', function () {
  let requestPostStub,
    configGetStub,
    currentUsername,
    cookieHeader

  beforeEach(function () {
    requestPostStub = sinon.stub(request, 'post')
    configGetStub = sinon.stub(config, 'get')

    currentUsername = 'A2J_User'
    cookieHeader = 'one=1; two=2;'
  })

  afterEach(function () {
    requestPostStub.restore()
    configGetStub.restore()
  })

  describe('getCurrentUser', function () {
    let handleErrorStub

    beforeEach(function () {
      handleErrorStub = sinon.stub(user, 'handleError')
    })

    afterEach(function () {
      handleErrorStub.restore()
    })

    it('when request.post returns a username', function (done) {
      requestPostStub.callsArgWith(2, null, {
        statusCode: 200
      }, JSON.stringify({
        username: currentUsername
      }))

      user.getCurrentUser({ cookieHeader })
        .then(function (username) {
          let headers = requestPostStub.getCall(0).args[1].headers

          assert.deepEqual(headers, { Cookie: cookieHeader }, 'should pass cookies HTTP header to request.post')
          assert.equal(username, currentUsername, 'should resolve with username')
          done()
        })
    })

    it('when request.post fails', function () {
      requestPostStub.callsArgWith(2, 'Error!', {
        statusCode: 200
      })

      user.getCurrentUser({ cookieHeader })

      assert.equal(handleErrorStub.callCount, 1, 'should call handleError')
    })

    it('when request.post fails (HTTP)', function () {
      requestPostStub.callsArgWith(2, null, {
        statusCode: 404
      })

      user.getCurrentUser({ cookieHeader })

      assert.equal(handleErrorStub.callCount, 1, 'should call handleError')
    })

    it('when response is not valid JSON', function () {
      requestPostStub.callsArgWith(2, null, {
        statusCode: 200
      }, 'foo')

      user.getCurrentUser({ cookieHeader })

      assert.equal(handleErrorStub.callCount, 1, 'should call handleError')
    })
  })

  describe('handleError, serverUrl=', function () {
    let deferred,
      serverURL

    beforeEach(function () {
      deferred = {
        resolve: sinon.spy(),
        reject: sinon.spy()
      }
    })

    it('http://localhost', function () {
      serverURL = 'http://localhost'

      user.handleError({ serverURL, deferred })

      assert.equal(deferred.resolve.callCount, 1, 'should resolve deferred')
      assert.equal(deferred.resolve.firstCall.args[0], 'dev', 'should hardcode user to dev')
    })

    it('http://localhost:3000', function () {
      serverURL = 'http://localhost:3000'

      user.handleError({ serverURL, deferred })

      assert.equal(deferred.resolve.callCount, 1, 'should resolve deferred')
      assert.equal(deferred.resolve.firstCall.args[0], 'dev', 'should hardcode user to dev')
    })

    it('http://localhost.evilsite.com', function () {
      serverURL = 'http://localhost:3000'

      user.handleError({ serverURL, deferred })

      assert.equal(deferred.reject.callCount, 1, 'should reject deferred')
    })

    it('http://bitovi.a2jauthor.org/', function () {
      serverURL = 'http://bitovi.a2jauthor.org/'

      user.handleError({ serverURL, deferred })

      assert.equal(deferred.reject.callCount, 1, 'should reject deferred')
    })
  })
})
