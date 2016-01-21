import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';
import ConditionalVM from './a2j-conditional-vm';
import createEmptyNode from 'author/utils/create-empty-node';

import 'steal-mocha';
import './a2j-conditional';
import 'author/templates/elements/a2j-template/';

describe('<a2j-conditional>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new ConditionalVM();
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

    describe('evalCondition', function() {
      beforeEach(function() {
        let answers = {
          'contracts amount over 5k mc': {
            repeating: false,
            values: [null, true],
            name: 'Contracts amount over 5k MC'
          },

          'mother monthly income': {
            repeating: false,
            values: [null, '100'],
            name: 'Mother Monthly Income'
          },

          'father monthly income': {
            repeating: false,
            values: [null, '100'],
            name: 'Father Monthly Income'
          }
        };

        vm.attr('answers', answers);
      });

      // !!leftOperand
      it('is-true operator with text operand', function() {
        vm.attr({
          leftOperand: '5',
          operator: 'is-true',
          leftOperandType: 'text'
        });

        assert.isTrue(vm.evalCondition());

        vm.attr('leftOperand', '');
        assert.isFalse(vm.evalCondition());
      });

      // !leftOperand
      it('is-false operator with text operand', function() {
        vm.attr({
          leftOperand: '',
          operator: 'is-true',
          leftOperandType: 'text'
        });

        assert.isFalse(vm.evalCondition());

        vm.attr('leftOperand', 'true');
        assert.isTrue(vm.evalCondition());
      });

      // !!leftOperand
      it('is-true operator with variable operand', function() {
        vm.attr({
          operator: 'is-true',
          leftOperandType: 'variable',
          leftOperand: 'Contracts amount over 5k MC'
        });

        assert.isTrue(vm.evalCondition());
      });

      // !leftOperand
      it('is-false operator with variable operand', function() {
        vm.attr({
          operator: 'is-false',
          leftOperandType: 'variable',
          leftOperand: 'Contracts amount over 5k MC'
        });

        assert.isFalse(vm.evalCondition());
      });

      // leftOperand === rightOperand
      it('is-equal operator with text operands', function() {
        vm.attr({
          leftOperand: 'foo',
          rightOperand: 'foo',
          operator: 'is-equal',
          leftOperandType: 'text',
          rightOperandType: 'text'
        });

        assert.isTrue(vm.evalCondition());

        vm.attr('leftOperand', 'bar');
        assert.isFalse(vm.evalCondition());
      });

      // leftOperand !== rightOperand
      it('is-not-equal operator with text operands', function() {
        vm.attr({
          leftOperand: 'foo',
          rightOperand: 'foo',
          leftOperandType: 'text',
          rightOperandType: 'text',
          operator: 'is-not-equal'
        });

        assert.isFalse(vm.evalCondition());

        vm.attr('leftOperand', 'bar');
        assert.isTrue(vm.evalCondition());
      });

      // leftOperand === rightOperand
      it('is-equal operator with variable operands', function() {
        vm.attr({
          operator: 'is-equal',
          leftOperandType: 'variable',
          rightOperandType: 'variable',
          leftOperand: 'mother monthly income',
          rightOperand: 'father monthly income',
        });

        assert.isTrue(vm.evalCondition());
      });

      // leftOperand === rightOperand
      it('is-not-equal operator with variable operands', function() {
        vm.attr({
          operator: 'is-not-equal',
          leftOperandType: 'variable',
          rightOperandType: 'variable',
          leftOperand: 'mother monthly income',
          rightOperand: 'father monthly income',
        });

        assert.isFalse(vm.evalCondition());
      });
    });
  });

  describe('Component', function() {
    let vm;

    beforeEach(function() {
      let frag = stache('<a2j-conditional />');

      $('#test-area').html(frag({
        editEnabled: true,
        editActive: true
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

    it('only one element can be selected at a time', function() {
      vm.attr('elseClause', true);
      vm.attr('ifBody').addNode(createEmptyNode('section-title'));
      vm.attr('elseBody').addNode(createEmptyNode('section-title'));

      let $firstIfElement = $('element-container').eq(1);
      let $firstElseElement = $('element-container').eq(2);
      let $addElementToIf = $('conditional-add-element').eq(0);
      let $addElementToElse = $('conditional-add-element').eq(0);

      $firstIfElement.find('.wrapper').click();
      assert.isTrue($firstIfElement.viewModel().attr('selected'));
      assert.isFalse($firstElseElement.viewModel().attr('selected'));
      assert.isFalse($addElementToIf.viewModel().attr('editActive'));
      assert.isFalse($addElementToElse.viewModel().attr('editActive'));
      assert.lengthOf($('element-options-pane'), 1);

      $firstElseElement.find('.wrapper').click();
      assert.isTrue($firstElseElement.viewModel().attr('selected'));
      assert.isFalse($firstIfElement.viewModel().attr('selected'));
      assert.isFalse($addElementToIf.viewModel().attr('editActive'));
      assert.isFalse($addElementToElse.viewModel().attr('editActive'));
      assert.lengthOf($('element-options-pane'), 1);
    });

    describe('element options pane', function() {
      beforeEach(function() {
        vm.attr('editActive', true);
        vm.attr('editEnabled', true);
      });

      it('options pane is toggled based on [editActive] value', function() {
        vm.attr('editActive', true);
        assert.isTrue($('element-options-pane').is(':visible'));

        vm.attr('editActive', false);
        assert.isFalse($('element-options-pane').is(':visible'));
      });

      it('toggles right operand form group based on [unaryOperation] value', function() {
        vm.attr('operator', 'is-true');
        assert.isTrue($('.right-operand').css('visibility') === 'hidden');

        vm.attr('operator', 'is-greater-than');
        assert.isFalse($('.right-operand').css('visibility') === 'hidden');
      });
    });
  });

});
