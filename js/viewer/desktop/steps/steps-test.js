import $ from 'jquery';
import Map from 'can/map/';
import assert from 'assert';
import stache from 'can/view/stache/';
import AppState from 'viewer/models/app-state';
import Interview from 'viewer/models/interview';
import { ViewerStepsVM } from 'viewer/desktop/steps/';
import _round from 'lodash/round';

import 'steal-mocha';

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

  describe('ViewModel', () => {
    let vm;

    beforeEach(() => {
      vm = new ViewerStepsVM({});
    });

    it('should correctly set nextSteps & remainingSteps based on current step number', () => {
      let currentPage = new Map({
        step: {
          number: '0'
        }
      });

      let interview = {
        getPageByName() {
          return currentPage;
        },
        steps: [ {}, {}, {} ]
      };

      vm.attr({ interview });

      assert.equal(vm.attr('nextSteps.length'), 2, 'nextSteps.length');
      assert.equal(vm.attr('remainingSteps'), 2, 'remainingSteps');
    });

    it('maxDisplayedSteps', () => {
      vm.attr({
        interview: {
          steps: new Array(5)
        },
        sidewalkHeight: 50
      });

      assert.equal(vm.attr('maxDisplayedSteps'), 1, 'show 1 step when sidewalk < 100px');

      vm.attr('sidewalkHeight', 100);
      assert.equal(vm.attr('maxDisplayedSteps'), 2, 'show 2 steps when sidewalk is 100-450px');
      vm.attr('sidewalkHeight', 449);
      assert.equal(vm.attr('maxDisplayedSteps'), 2, 'show 2 steps when sidewalk is 100-449px');

      vm.attr('sidewalkHeight', 450);
      assert.equal(vm.attr('maxDisplayedSteps'), 3, 'show 3 steps when sidewalk is 450-549');
      vm.attr('sidewalkHeight', 549);
      assert.equal(vm.attr('maxDisplayedSteps'), 3, 'show 3 steps when sidewalk is 450-549');

      vm.attr('sidewalkHeight', 550);
      assert.equal(vm.attr('maxDisplayedSteps'), 4, 'show 4 steps when sidewalk is 550-749');
      vm.attr('sidewalkHeight', 749);
      assert.equal(vm.attr('maxDisplayedSteps'), 4, 'show 4 steps when sidewalk is 550-749');

      vm.attr('sidewalkHeight', 750);
      assert.equal(vm.attr('maxDisplayedSteps'), 5, 'show 5 steps when sidewalk is 750px or above');

      vm.attr('interview.steps.length', 4);
      assert.equal(vm.attr('maxDisplayedSteps'), 4, 'never show more steps than interview has');
    });

    it('avatarSkinTone', () => {
      vm.attr({
        interview: {},
        mState: {}
      });

      vm.attr('interview.avatarSkinTone', 'avatar');
      assert.equal(vm.attr('avatarSkinTone'), 'avatar', 'should use interview skin tone if set');

      vm.attr('interview.avatarSkinTone', '');
      vm.attr('mState.avatarSkinTone', 'global');
      assert.equal(vm.attr('avatarSkinTone'), 'global', 'should use global skin tone if set');

      vm.attr('interview.avatarSkinTone', 'avatar');
      assert.equal(vm.attr('avatarSkinTone'), 'global', 'should use global skin tone if both are set');
    });

    it('showClientAvatar / guideAvatarFacingDirection', () => {
      let currentPage = new Map();

      vm.attr({
        interview: {
          userGender: '',
          getPageByName() {
            return currentPage;
          }
        }
      });

      assert.ok(!vm.attr('showClientAvatar'), 'should not show client avatar');
      assert.equal(
        vm.attr('guideAvatarFacingDirection'),
        'front',
        'should show guide avatar facing front'
      );

      vm.attr('interview.userGender', 'gender');
      currentPage.attr('hasUserGenderField', true);
      assert.ok(!vm.attr('showClientAvatar'), 'should not show client avatar when current page has the user gender field');
      assert.equal(
        vm.attr('guideAvatarFacingDirection'),
        'front',
        'should still show guide avatar facing front'
      );

      currentPage.attr('hasUserGenderField', false);
      assert.ok(!!vm.attr('showClientAvatar'), 'should show client avatar when user has a gender');
      assert.equal(
        vm.attr('guideAvatarFacingDirection'),
        'right',
        'should show guide avatar facing right'
      );
    });

    it('sidewalkLength', () => {
      vm.attr('sidewalkHeight', 4);
      vm.attr('sidewalkWidth', 3);
      assert.equal(vm.attr('sidewalkLength'), 5);
    });

    it('sidewalkAngleA', () => {
      vm.attr('sidewalkHeight', 600);

      // set sidewalkLength to 1200 by doing 1200^2 - 600^2 = sidewalkWidth^2
      vm.attr('sidewalkWidth', Math.pow(Math.pow(1200, 2) - Math.pow(600, 2), 0.5));

      // angle A is then PI/6 radians (30 degrees)
      assert.equal(_round(vm.attr('sidewalkAngleA'), 5), _round(Math.PI / 6, 5));
    });

    it('guideBubbleTallerThanAvatar', () => {
      vm.attr('guideBubbleHeight', 100);
      vm.attr('avatarHeight', 100);
      assert.equal(vm.attr('guideBubbleTallerThanAvatar'), false, 'false');

      vm.attr('avatarHeight', 99);
      assert.equal(vm.attr('guideBubbleTallerThanAvatar'), true, 'true');
    });

    it('clientBubbleTallerThanAvatar', () => {
      vm.attr('clientBubbleHeight', 100);
      vm.attr('avatarHeight', 100);
      assert.equal(vm.attr('clientBubbleTallerThanAvatar'), false, 'false');

      vm.attr('avatarHeight', 99);
      assert.equal(vm.attr('clientBubbleTallerThanAvatar'), true, 'true');
    });

    it('minusHeader', () => {
      vm.attr('bodyHeight', 100);
      vm.attr('sidewalkHeight', 50);
      assert.equal(vm.attr('minusHeader'), 25);
    });

    it('getStepWidth()', () => {
      vm.attr('avatarOffsetTop', 211);
      vm.attr('minusHeader', 98);
      vm.attr('bodyHeight', 768);
      vm.attr('sidewalkHeight', 573);
      vm.attr('sidewalkWidth', 512);
      vm.attr('stepNextCssBottom', [378.156, 524.078]);

      assert.equal(Math.ceil(vm.getStepWidth(true)), 303);
      assert.equal(Math.ceil(vm.getStepWidth(false, 0)), 195);
      assert.equal(Math.ceil(vm.getStepWidth(false, 1)), 98);
    });

    it('formatStepStyles()', () => {
      assert.equal(vm.formatStepStyles(303), 'margin-right: -31px;width: calc(0% + 394px);');
      assert.equal(vm.formatStepStyles(195), 'margin-right: -20px;width: calc(0% + 254px);');
      assert.equal(vm.formatStepStyles(98), 'margin-right: -10px;width: calc(0% + 128px);');
    });
  });
});
