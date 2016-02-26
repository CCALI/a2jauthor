import $ from 'jquery';
import F from 'funcunit';
import Map from 'can/map/';
import assert from 'assert';
import stache from 'can/view/stache/';

import './header';
import 'steal-mocha';

describe('a2j-header', function() {
  let vm;

  beforeEach(function() {
    const mState = new Map();
    const pState = new Map();

    const frag = stache(
      '<a2j-header {m-state}="mState" {p-state}="pState" />'
    );

    $('#test-area').html(frag({ mState, pState }));
    vm = $('a2j-header').viewModel();
  });

  afterEach(function() {
    // $('#test-area').empty();
  });

  it('shows save button if autoSetDataURL is set', function() {
    vm.attr('mState.autoSetDataURL', '/ajax-save.php');
    assert.equal(vm.attr('mState.autoSetDataURL'), '/ajax-save.php');
    assert($('.btn.save').is(':visible'), 'save button should be visible');
  });

  it('does not show save button if autoSetDataURL not set', function() {
    assert.isUndefined(vm.attr('mState.autoSetDataURL'));
    assert(!$('.btn.save').length, 'save button should not be in the DOM');
  });

  it('save button is disabled while ajax is pending and succeds', function(done) {
    let called = false;
    const button = '.btn.save';
    const deferred = $.Deferred();
    const pState = vm.attr('pState');

    // mock the save method
    pState.save = () => {
      called = true;
      return deferred;
    };

    // show save button
    vm.attr('mState.autoSetDataURL', '/ajax-save.php');

    F(button).visible(true);
    F(button).click();

    F(() => assert.isTrue(called, 'mock should have been called'));

    F(function() {
      assert.isTrue($(button).is(':disabled'), 'should be disabled');
    });

    F(() => deferred.resolve());

    F(function() {
      assert.isFalse($(button).is(':disabled'), 'should not be disabled');
    });

    F(done);
  });

  it('save button is disabled while ajax is pending and fails', function(done) {
    let called = false;
    const button = '.btn.save';
    const deferred = $.Deferred();
    const pState = vm.attr('pState');

    // mock the save method
    pState.save = () => {
      called = true;
      return deferred;
    };

    // show save button
    vm.attr('mState.autoSetDataURL', '/ajax-save.php');

    F(button).visible(true);
    F(button).click();

    F(() => assert.isTrue(called, 'mock should have been called'));

    F(function() {
      assert.isTrue($(button).is(':disabled'), 'should be disabled');
    });

    F(() => deferred.reject());

    F(function() {
      assert.isFalse($(button).is(':disabled'), 'should not be disabled');
    });

    F(done);
  });
});
