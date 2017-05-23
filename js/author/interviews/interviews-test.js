import $ from 'jquery';
import F from 'funcunit';
import assert from 'assert';
import stache from 'can/view/stache/';
import List from 'can/list/';
import { InterviewsVM } from './interviews';

import 'steal-mocha';

describe('<interviews-page>', function() {

  describe('viewModel', function() {
    let vm = null;

    beforeEach(function() {
      vm = new InterviewsVM();
    });

    it('deleteInterview works', function() {
      vm.attr('interviews', [
        { id: 1, title: 'foo', owned: true },
        { id: 2, title: 'bar', owned: true }
      ]);

      assert.equal(vm.attr('interviews.length'), 2,
        'there should be 2 interviews');

      // delete interview with id 1
      vm.deleteInterview(1);

      assert.equal(vm.attr('interviews.length'), 1,
        'interview with id 1 should have been deleted');

      // delete interview with id 5
      vm.deleteInterview(5);

      assert.equal(vm.attr('interviews.length'), 1,
        'should still be 1 since there is no interview with given id');
    });

    it('clears preview tracelogic messages', function() {
        let previewTraceList = new List({ pageName: "Intro", messages: ["These", "are", "usually", "Maps"] });
        vm.attr('traceLogicList', previewTraceList);

        vm.clearPreviewState();

        assert.equal(vm.attr('traceLogicList.length'), 0,'there should be an empty list');
      });
  });



  describe('Component', function() {
    let vm;
    const activeClass = 'active';

    beforeEach(function(done) {
      let frag = stache('<interviews-page></interviews-page>');
      $('#test-area').html(frag());
      vm = $('interviews-page').viewModel();

      F('.guide').size(n => n > 0);
      F(done);
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('lists interviews fetched from the server', function() {
      assert.isTrue($('.guide').length > 0, 'interviews should be listed');
    });

    it('interviews are set as active when clicked', function() {
      let interview = $('.guide').eq(0);

      assert.isFalse(interview.hasClass(activeClass));
      interview.click();
      assert.isTrue(interview.hasClass(activeClass));
    });

    it('only one interview can be active', function(done) {
      F('.guide').hasClass(activeClass, false, 'there should be no active interview');

      // select first interview of the list
      F('.guide:eq(0)').click();

      F('.guide:eq(0)').hasClass(activeClass, true, 'should be active');
      F('.' + activeClass).size(1, 'there should be one active interview');

      // select second interview of the list
      F('.guide:eq(1)').click();

      F('.guide:eq(1)').hasClass(activeClass, true, 'should be active');
      F('.' + activeClass).size(1, 'there should be one active interview');

      F(done);
    });
  });

});
