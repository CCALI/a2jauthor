import Map from 'can/map/';
import Component from 'can/component/';
import template from './preview.stache!';

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

let AuthorPreviewVM = Map.extend({
  define: {
    previewMode: {
      value: false
    }
  }
});

export default Component.extend({
  template,
  tag: 'author-preview',
  viewModel: AuthorPreviewVM,

  events: {
    inserted() {
      if (window.gGuide) {
        this.viewModel.attr('previewMode', true);
      }
    }
  }
});
