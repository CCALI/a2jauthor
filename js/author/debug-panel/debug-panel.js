import CanMap from 'can-map'
import CanList from 'can-list'
import Component from 'can-component'
import template from './debug-panel.stache'

import 'can-map-define'

/**
 * @property {can.Map} authorDebugPanel.ViewModel
 * @parent <author-debug-panel>
 *
 * `<author-debug-panel>`'s viewModel.
 */
export let DebugPanelVM = CanMap.extend({
  define: {
    // passed in via viewer-preview-layout.stache bindings
    interview: {},
    previewPageName: {},
    traceMessage: {},

    /**
     * @property {can.List} authorDebugPanel.ViewModel.prototype.variables variables
     * @parent authorDebugPanel.ViewModel
     *
     * list of variables used in the interview and their values
     */
    variables: {
      get () {
        let interview = this.attr('interview')

        return interview
          ? interview.attr('variablesList')
          : new CanList([])
      }
    }
  },

  /**
   * @function authorDebugPanel.ViewModel.prototype.cleartraceLog cleartraceLog
   * @parent authorDebugPanel.ViewModel
   *
   * clear messages from the trace logic list
   *
   * Remove all message from the list, but leave a single entry for the current page.
   * This allows new messages to be added before the user navigates to a new page.
   */
  clearMessageLog () {
    this.attr('traceMessage').clearMessageLog()
  }
})

/**
 * @module {Module} author/debug-panel/ <author-debug-panel>
 * @parent api-components
 *
 * this component displays the debug-panel for the author view
 *
 * ## Use
 *
 * @codestart
 *   <author-debug-panel
 *     {interview}="viewerInterview" />
 * @codeend
 */
export default Component.extend({
  view: template,
  ViewModel: DebugPanelVM,
  tag: 'author-debug-panel',

  helpers: {
    /**
     * @function authorDebugPanel.prototype.traceMessageFormat traceMessageFormat
     * @parent authorDebugPanel
     *
     * helper used to get the class name to format each message fragment's span
     */
    traceMessageFormat (format, msg) {
      if (format === 'val') {
        format = (!msg) ? 'valBlank'
          : ((msg === true || msg === 'true') ? 'valT'
            : ((msg === false || msg === 'false') ? 'valF' : format.toLowerCase()))
      }

      return format
    },
    /**
     * @function authorDebugPanel.prototype.blankValFormat blankValFormat
     * @parent authorDebugPanel
     *
     * Format a message - used for providing "blank" for empty values set by the user
     */
    blankValFormat (format, msg) {
      return (format === 'val' && !msg) ? 'blank' : msg
    }
  },

  leakScope: true
})
