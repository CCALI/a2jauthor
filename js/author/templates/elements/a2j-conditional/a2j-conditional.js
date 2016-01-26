import Component from 'can/component/';
import template from './a2j-conditional.stache!';
import ConditionalVM from './a2j-conditional-vm';
import conditionalOptionsTpl from './conditional-options.stache!';

can.view.preload('conditional-options-tpl', conditionalOptionsTpl);

const operatorTextMap = {
  'is-true': 'IS TRUE',
  'is-false': 'IS FALSE',
  'is-equal': 'EQUALS',
  'is-not-equal': 'DOES NOT EQUAL',
  'is-less-than': 'IS LESS THAN',
  'is-greater-than': 'IS GREATER THAN'
};

/**
 * @module {Module} author/templates/elements/a2j-conditional/ <a2j-conditional>
 * @parent api-components
 *
 * This component represents and if-else element used to conditionally render
 * pieces of the document based on some condition defined by the user.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-conditional left-operand="5" operator="is-greater-than" right-operand="3"  />
 * @codeend
 */
export default Component.extend({
  template,
  tag: 'a2j-conditional',
  viewModel: ConditionalVM,

  helpers: {
    formatOperator(operator) {
      return operatorTextMap[operator];
    }
  },

  events: {
    '{viewModel} leftOperandType': function() {
      this.viewModel.attr('leftOperand', '');
    },

    '{viewModel} rightOperandType': function() {
      this.viewModel.attr('rightOperand', '');
    },

    // TODO: Find a viewModel oriented way to solve the selection of nested nodes.
    '{viewModel} addToIfSelected': function() {
      const vm = this.viewModel;
      const addToIfSelected = vm.attr('addToIfSelected');

      if (addToIfSelected) {
        vm.attr('addToElseSelected', false);
        this.toggleSelectedNode();
      }
    },

    '{viewModel} addToElseSelected': function() {
      const vm = this.viewModel;
      const addToElseSelected = vm.attr('addToElseSelected');

      if (addToElseSelected) {
        vm.attr('addToIfSelected', false);
        this.toggleSelectedNode();
      }
    },

    'a2j-template node-selected': function(el, evt, selectedNode) {
      if (selectedNode) {
        const vm = this.viewModel;

        vm.attr('addToIfSelected', false);
        vm.attr('addToElseSelected', false);

        this.toggleSelectedNode(selectedNode.attr('id'));
      }
    },

    toggleSelectedNode(nodeId) {
      const vm = this.viewModel;
      const toggleEditActiveNode = vm.attr('toggleEditActiveNode');
      toggleEditActiveNode(nodeId);
    }
  }
});
