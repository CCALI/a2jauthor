import $ from 'jquery';
import Map from 'can/map/';
import assert from 'assert';
import stache from 'can/view/stache/';
import AppState from 'viewer/models/app-state';
import Interview from 'viewer/models/interview';

import 'steal-mocha';
import 'viewer/desktop/steps/';

describe('<a2j-viewer-steps>', function() {

  describe('Component', function() {
    let vm;
    let interview;

    beforeEach(function(done) {
      let promise = Interview.findOne({url: '/interview.json'});

      promise.then(function(_interview) {
        interview = _interview;

        let mState = new Map();
        let rState = new AppState({
          page: interview.attr('firstPage')
        });

        let frag = stache(
          `<a2j-viewer-steps
            r-state="{rState}"
            m-state="{mState}"
            interview="{interview}" />`
        );

        $('#test-area').html(frag({rState, interview, mState}));
        vm = $('a2j-viewer-steps').viewModel();
        done();
      });
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('renders arrow when step number is zero', function() {
      let firstStepNumber = interview.attr('steps.0.number');

      assert.equal(parseInt(firstStepNumber, 10), 0);
      assert.equal($('.glyphicon-step-zero').length, 1, 'should be one arrow');
    });

    it('renders only guide avatar if "userGender" is unknown', function() {
      let answers = interview.attr('answers');

      // user has not set their gender
      answers.attr('user gender', {
        name: 'user gender',
        values: [null]
      });
      assert.isUndefined(interview.attr('userGender'));
      assert.equal($('a2j-viewer-avatar').length, 1);
    });

    it('renders both client and guide avatars if "userGender" is known', function() {
      let answers = interview.attr('answers');

      // user set her gender.
      answers.attr('user gender', {
        name: 'user gender',
        values: [null, 'f']
      });

      assert.equal(interview.attr('userGender'), 'female');
      assert.equal($('a2j-viewer-avatar').length, 2);
    });
  });

});
