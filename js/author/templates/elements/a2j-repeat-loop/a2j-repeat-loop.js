import Component from 'can/component/';
import RepeatLoopVM from './a2j-repeat-loop-vm';
import template from './a2j-repeat-loop.stache!';
import displayTableTpl from './repeat-table.stache!';
import repeatLoopOptionsTpl from './repeat-loop-options.stache!';

import 'can/view/';

can.view.preload('display-table-tpl', displayTableTpl);
can.view.preload('repeat-loop-options-tpl', repeatLoopOptionsTpl);

/**
 * @module {Module} author/templates/elements/a2j-repeat-loop/ <a2j-repeat-loop>
 * @parent api-components
 *
 * This component allows the loop over `repeating` variables and create tables/
 * lists with those values.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-repeat-loop {state}="state" />
 * @codeend
 */
export default Component.extend({
  template,
  tag: 'a2j-repeat-loop',

  viewModel(attrs) {
    return new RepeatLoopVM(attrs.state);
  },

  events: {
    'input[name="displayType"] change': function($el) {
      this.viewModel.attr('displayType', $el.val());
    }
  },

  helpers: {
    getValue(varName, index) {
      return this.getAnswerAtIndex(varName, index);
    }
  }
});
