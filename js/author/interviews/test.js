import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';

import 'steal-mocha';
import './interviews';

describe('<interviews-page>', function() {

  describe('Component', function() {
    let vm;
    const activeClass = 'ui-state-active';

    beforeEach(function() {
      let frag = stache('<interviews-page></interviews-page>');
      $('#test-area').html(frag());
      vm = $('interviews-page').viewModel();
      return vm.attr('interviews');
    });

    afterEach(() => $('#test-area').empty());

    it('lists interviews fetched from the server', function() {
      assert.isTrue($('.guide').length > 0, 'interviews should be listed');
    });

    it('interviews are set as active when clicked', function() {
      let interview = $('.guide').eq(0);

      assert.isFalse(interview.hasClass(activeClass));
      interview.click();
      assert.isTrue(interview.hasClass(activeClass));
    });

    it('only one interview can be active', function() {
      let interviews = $('.guide');

      assert.isFalse(interviews.hasClass(activeClass));

      interviews.eq(0).click();
      assert.equal($(`.${activeClass}`).length, 1);
      assert.isTrue(interviews.eq(0).hasClass(activeClass));

      interviews.eq(1).click();
      assert.equal($(`.${activeClass}`).length, 1);
      assert.isTrue(interviews.eq(1).hasClass(activeClass));
    });
  });

});
