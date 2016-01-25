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
    '{viewModel} selectedNode': function() {
      let $el = this.element;
      let vm = this.viewModel;
      let selectedNode = vm.attr('selectedNode');

      if (selectedNode) {
        $el.trigger('nested-node-selected', selectedNode);
      }
    },

    '{viewModel} leftOperandType': function() {
      this.viewModel.attr('leftOperand', '');
    },

    '{viewModel} rightOperandType': function() {
      this.viewModel.attr('rightOperand', '');
    }
  }
});
