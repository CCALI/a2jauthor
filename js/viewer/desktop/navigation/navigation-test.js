import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';
import AppState from 'viewer/models/app-state';
import Interview from 'viewer/models/interview';
import constants from 'viewer/models/constants';
import {ViewerNavigationVM} from 'viewer/desktop/navigation/';

import 'steal-mocha';

describe('<a2j-viewer-navigation>', function() {

  describe('viewModel', function() {
    let vm;
    let pages;
    let visited;
    let appState;
    let interview;

    beforeEach(function(done) {
      let promise = Interview.findOne({url: '/interview.json'});

      promise.then(function(_interview) {
        interview = _interview;
        appState = new AppState();

        pages = interview.attr('pages');
        visited = appState.attr('visitedPages');
        vm = new ViewerNavigationVM({appState, interview});

        done();
      });
    });

    it('selectedPageName', function() {
      // navigate to first page
      visited.unshift(pages.attr(0));
      assert.equal(vm.attr('selectedPageName'), pages.attr(0).attr('name'),
        'should return most recently visited page name');

      // navigate to second page
      visited.unshift(pages.attr(1));
      assert.equal(vm.attr('selectedPageName'), pages.attr(1).attr('name'),
        'should return second page name');
    });

    it('collects feedback form data', function() {
      // simulate user is on interview second page.
      let secondPage = pages.attr(1);
      vm.attr('selectedPageName', secondPage.attr('name'));

      assert.deepEqual(vm.attr('feedbackData'), {
        questionid: secondPage.attr('name'),
        questiontext: secondPage.attr('text'),
        interviewid: interview.attr('version'),
        viewerversion: constants.A2JVersionNum,
        emailto: interview.attr('emailContact'),
        interviewtitle: interview.attr('title')
      });
    });

    it('canSaveAndExit - whether save and exit button should be enabled', function() {
      interview.attr('exitPage', constants.qIDNOWHERE);
      appState.attr('saveAndExitActive', false);
      assert.isFalse(vm.attr('canSaveAndExit'));

      // it is false in this case because saveAndExitActive flag is true
      interview.attr('exitPage', 'success-page');
      appState.attr('saveAndExitActive', true);
      assert.isFalse(vm.attr('canSaveAndExit'));

      // it is only true when exitPage is a valid string and
      // appState.canSaveAndExit is false
      interview.attr('exitPage', 'success-page');
      appState.attr('saveAndExitActive', false);
      assert.isTrue(vm.attr('canSaveAndExit'));
    });

    it('canNavigateBack - whether back button should be enabled', function() {
      // navigate to first page
      visited.unshift(pages.attr(0));
      assert.isFalse(vm.attr('canNavigateBack'), 'false if only one page visited');

      // navigate to second page
      visited.unshift(pages.attr(1));
      assert.isTrue(vm.attr('canNavigateBack'), 'user can go back to first page');

      // go back to first page
      vm.attr('selectedPageName', pages.attr(0).attr('name'));
      assert.isFalse(vm.attr('canNavigateBack'), 'in first page, can not go back');
    });

    it('canNavigateForward - whether next button should be enabled', function() {
      // navigate to first page
      visited.unshift(pages.attr(0));
      assert.isFalse(vm.attr('canNavigateForward'),
        'false if only one page visited');

      // navigate to second page
      visited.unshift(pages.attr(1));
      assert.isFalse(vm.attr('canNavigateForward'),
        'user can not go next the last visited page');

      // go back to first page
      vm.attr('selectedPageName', pages.attr(0).attr('name'));
      assert.isFalse(vm.attr('canNavigateBack'),
        'in first page, user can go to second page');
    });
  });

  describe('Component', function() {
    let pages;
    let visited;
    let interview;

    beforeEach(function(done) {
      let promise = Interview.findOne({url: '/interview.json'});

      promise.then(function(_interview) {
        interview = _interview;
        let appState = new AppState();

        pages = interview.attr('pages');
        visited = appState.attr('visitedPages');

        let frag = stache(
          '<a2j-viewer-navigation interview="{interview}" app-state="{appState}" />'
        );

        $('#test-area').html(frag({appState, interview}));
        done();
      });
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('renders pages history dropdown', function() {
      // navigate to first page
      visited.unshift(pages.attr(0));

      assert.equal($('select option').length, 1, 'just one page visited');
      assert.equal($('option:selected').val(), pages.attr(0).attr('name'),
        'most recent page should be the selected option');

      // navigate to second page
      visited.unshift(pages.attr(1));

      assert.equal($('select option').length, 2, 'two pages visited');
      assert.equal($('option:selected').val(), pages.attr(1).attr('name'),
        'most recent page should be the selected option');
    });

    it('truncates dropdown text so it fits properly', function() {
      let firstPage = pages.attr(0);

      visited.unshift(firstPage);
      assert.isTrue(firstPage.attr('text').length > 40, 'very long text');

      // making sure the firstPage is selected
      let $selectedOption = $('option:selected');
      assert.equal($('option:selected').val(), firstPage.attr('name'));

      let optionText = $selectedOption.text().trim();
      assert.isTrue(optionText.length <= 40, 'should be truncated');
    });

    it('shows/hides feedback button based on interview.sendfeedback', function() {
      // turn off feedback
      interview.attr('sendfeedback', false);
      assert.equal($('.send-feedback').length, 0, 'button should not be rendered');

      // turn on feedback
      interview.attr('sendfeedback', true);
      assert.isTrue($('.send-feedback').is(':visible'), 'button should be rendered');
    });

    it('shows custom courthouse image if provided', function() {
      let vm = $('a2j-viewer-navigation').viewModel();
      vm.attr('courthouseImage', 'my-custom-courthouse.jpg');

      let courthouseSrc = $('img.courthouse').attr('src');
      assert.equal(courthouseSrc, 'my-custom-courthouse.jpg');
    });

    it('uses default courthouse image when custom not provided', function() {
      let vm = $('a2j-viewer-navigation').viewModel();
      vm.attr('courthouseImage', null);

      let courthouseSrc = $('img.courthouse').attr('src');
      assert.isTrue(courthouseSrc.indexOf('A2J5_CourtHouse.svg') !== -1);
    });
  });

});
