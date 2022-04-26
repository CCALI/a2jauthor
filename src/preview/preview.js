import CanMap from 'can-map'
import Component from 'can-component'
import template from './preview.stache'

import 'can-map-define'

/**
 * @module {Module} author/preview <author-preview>
 * @parent api-components
 *
 * This component is rendered when user visits the preview tab, it checks the
 * global `window` object, if `gGuide` is available (meaning an interview has
 * been selected) it sets `appState.previewMode` to `true` causing the viewer
 * app to be rendered. If a guide has not been selected it display a dummy text.
 *
 * ## Use
 *
 * @codestart
 *   <author-preview {(preview-mode)}="appState.previewMode" />
 * @codeend
 */

const AuthorPreviewVM = CanMap.extend({
  define: {
    previewMode: {
      value: false
    }
  },

  lockScrolling (enable) {
    if (enable) {
      // ie11 and Edge require scrollTop reset
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      // document.body.style.overflow = 'hidden' // a2jauthor#199
      // whatever old problems might be re-caused by removing the
      // above line, it should be fixed without disabling scroll.
    } else {
      document.body.style.overflow = 'auto'
    }
  }
})

export default Component.extend({
  view: template,
  tag: 'author-preview',
  ViewModel: AuthorPreviewVM,
  leakScope: true,

  events: {
    inserted () {
      if (window.gGuide) {
        this.viewModel.attr('previewMode', true)
      }
      this.viewModel.lockScrolling(true)
    },
    '{element} beforeremove' () {
      this.viewModel.lockScrolling(false)
    }
  }
})
