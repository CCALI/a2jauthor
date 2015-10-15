import assert from 'assert';
import fixture from 'can/util/fixture/';
import Interview from 'viewer/models/interview';

describe('Interview model', function() {

  it('parseModels', function() {
    fixture('GET /interview.json', function(req, res) {
      res(200, {
        pages: {
          '1-Introduction': {
            name: '1-Introduction',
            fields: [{
              name: 'user gender',
              type: 'text'
            }]
          }
        }
      });
    });

    let dfd = Interview.findOne({url: '/interview.json'});

    return dfd.then(function(interview) {
      assert.deepEqual(interview.serialize(), {
        pages: [{
          fields: [{
            name: 'user gender',
            type: 'text',
            options: ''
          }],
          name: '1-Introduction'
        }],
        _pages: {
          '1-Introduction': {
            name: '1-Introduction',
            fields: [{
              name: 'user gender',
              type: 'text',
              options: ''
            }]
          }
        },
        answers: {}
      });

      can.fixture.overwrites = [];
    });
  });

});
