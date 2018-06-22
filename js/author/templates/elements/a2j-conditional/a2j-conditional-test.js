import $ from 'jquery';
import F from 'funcunit';
import assert from 'assert';
import stache from "can-stache";
import ConditionalVM from './a2j-conditional-vm';

import 'steal-mocha';
import './a2j-conditional';
import 'caja/author/templates/elements/a2j-template/';

describe('<a2j-conditional>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new ConditionalVM({
        children: []
      });
    });

    it('unaryOperation - whether only one operand is needed', function() {
      let items = [
        { operator: 'is-true', expected: true },
        { operator: 'is-false', expected: true },
        { operator: 'is-equal', expected: false },
        { operator: 'is-not-equal', expected: false },
        { operator: 'is-less-than', expected: false },
        { operator: 'is-greater-than', expected: false }
      ];

      items.forEach(function(item) {
        vm.attr('operator', item.operator);

        assert.equal(vm.attr('unaryOperation'), item.expected,
          `incorrect value for ${item.operator}`);
      });
    });
  });

  describe('Component', function() {
    let vm;

    beforeEach(function() {
      let frag = stache(
        '<a2j-conditional vm:children:bind="children" />'
      );

      $('#test-area').html(frag({
        editEnabled: true,
        editActive: true,
        children: []
      }));

      vm = $('a2j-conditional').viewModel();
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('toggles "else panel" based on [elseClause] value', function() {
      vm.attr('elseClause', false);
      assert.isFalse($('.panel-else').is(':visible'));
      assert.lengthOf($('.panel-body'), 1, 'only if body should be rendered');

      vm.attr('elseClause', true);
      assert.isTrue($('.panel-else').is(':visible'));
      assert.lengthOf($('.panel-body'), 2, 'if and else body should be rendered');
    });

    describe.skip('element options pane', function() {
      beforeEach(function() {
        vm.attr('editActive', true);
        vm.attr('editEnabled', true);
      });

      it('options pane is toggled based on [editActive] value', function(done) {
        vm.attr('editActive', true);
        F('element-options-pane').visible('options pane should be visible');

        F(() => vm.attr('editActive', false));
        F('element-options-pane').missing('options pane should be gone');

        F(done);
      });

      it('toggles right operand form group based on [unaryOperation] value', function(done) {
        vm.attr('operator', 'is-true');
        F('.right-operand').css('visibility', 'hidden', 'visibility should be hidden');

        F(() => vm.attr('operator', 'is-greater-than'));
        F('.right-operand').css('visibility', 'visible', 'visibility should be visible');

        F(done);
      });
    });
  });

});
