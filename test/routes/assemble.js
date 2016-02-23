const app = require('../../src/app');
const request = require('supertest');

describe('POST /api/assemble', function() {
  it('fails if guideId and fileDataUrl are missing', function(done) {
    request(app)
      .post('/api/assemble')
      .send({ guideId: null, fileDataUrl: null })
      .expect(400, 'You must provide either guideId or fileDataUrl')
      .end(function(err) {
        if (err) return done(err);
        done();
      });
  });
});
