import Map from 'can/map/';
import Component from 'can/component/';
import template from './a2j-page-break.stache!';

import 'can/map/define/';

/**
 * @module {Module} author/templates/elements/a2j-page-break/ <a2j-page-break>
 * @parent api-components
 *
 * This component represents a page break in the final PDF document.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-page-break {state}="state" />
 * @codeend
 */

let PageBreakVM = Map.extend({
  define: {
    editEnabled: {
      value: false
    },

    editActive: {
      value: false
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-page-break',
  viewModel: PageBreakVM
});
