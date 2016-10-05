import Map from 'can/map/';
import Component from 'can/component/';
import template from './a2j-page-break.stache!';

import 'can/map/define/';

/**
 * @module {Module} A2JPageBreakVM
 * @parent A2JPageBreak
 *
 * <a2j-page-break /> viewmodel
 */
const PageBreakVM = Map.extend({
  define: {
    editEnabled: {
      value: false
    },

    editActive: {
      value: false
    },

    /**
     * @property {String} notes
     *
     * The notes added by the author using the element options panel
     */
    notes: {
      value: ''
    }
  }
});

/**
 * @module A2JPageBreak
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
export default Component.extend({
  template,
  tag: 'a2j-page-break',
  viewModel: PageBreakVM
});
