import assert from 'assert';
import fixture from 'can/util/fixture/';
import Interview from 'viewer/models/interview';

describe('Interview model', function() {

  it('parseModels', function(done) {
    let dfd = Interview.findOne({url: '/parse-model-interview.json'});

    dfd.then(function(interview) {
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

      done();
    });
  });

  describe('avatarSkinTone', function() {
    let interview;

    beforeEach(function() {
      interview = new Interview();
    });

    it('is not serialized', function() {
      let serialized = interview.serialize();
      assert.notProperty(serialized, 'avatarSkinTone');
    });

    it('computes its value from "avatar"', function() {
      interview.attr('avatar', 'blank');
      assert.equal(interview.attr('avatarSkinTone'), 'lighter');

      interview.attr('avatar', 'avatar3');
      assert.equal(interview.attr('avatarSkinTone'), 'darker');
    });
  });

  describe('guideAvatarGender', function() {
    let interview;

    beforeEach(function() {
      interview = new Interview();
    });

    it('is not serialized', function() {
      let serialized = interview.serialize();
      assert.notProperty(serialized, 'guideAvatarGender');
    });

    it('defaults to "female"', function() {
      assert.equal(interview.attr('guideAvatarGender'), 'female');
    });

    it('computes its value from "guideGender"', function() {
      interview.attr('guideGender', 'Male');
      assert.equal(interview.attr('guideAvatarGender'), 'male');

      interview.attr('guideGender', 'fEmaLe');
      assert.equal(interview.attr('guideAvatarGender'), 'female');
    });
  });

  describe('userGender', function() {
    let interview;

    beforeEach(function() {
      interview = new Interview();
    });

    it('is not serialized', function() {
      let serialized = interview.serialize();
      assert.notProperty(serialized, 'userGender');
    });

    it('computes its value from the answer of the "user gender" variable', function() {
      let answers = interview.attr('answers');

      assert.notProperty(answers.attr(), 'user gender',
        'interview has no "user gender" variable');
      assert.isUndefined(interview.attr('userGender'));

      answers.attr('user gender', {
        name: 'user gender',
        values: [null]
      });
      assert.property(answers.attr(), 'user gender');
      assert.isUndefined(interview.attr('userGender'), 'variable has no value');

      answers.attr('user gender').attr('values').push('m');
      assert.equal(interview.attr('userGender'), 'male');

      answers.attr('user gender').attr('values').push('female');
      assert.equal(interview.attr('userGender'), 'female');
    });
  });

});
