const app = require('../../src/app')
const request = require('supertest')

describe('POST /api/assemble', function () {
  it('fails if guideId and fileDataURL are missing', function (done) {
    request(app)
      .post('/api/assemble')
      .send({ guideId: null, fileDataURL: null })
      .expect(400, 'You must provide either guideId or fileDataURL')
      .end(function (err) {
        if (err) return done(err)
        done()
      })
  })
})
