import $ from 'jquery';
import _trunc from 'lodash/string/trunc';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './sign-text.stache!';

import 'can/map/define/';
import 'jquery-textfill';

export let SignTextVM = Map.extend({
  define: {
    displayText: {
      get() {
        return _trunc(this.attr('text'), {
          length: this.attr('maxChars') + this.attr('overflowText').length,
          separator: ' ',
          omission: this.attr('overflowText')
        });
      }
    }
  },
  maxChars: 50,
  overflowText: '...'
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-viewer-sign-text',
  viewModel: SignTextVM,

  events: {
    inserted() {
      let $p = this.element.find('div p');

      let resizeText = function() {
        // remove inline line-height set by updateLineHeight function
        // otherwise the next sizing calculation will not work correctly
        $p.css('line-height', '');

        let updateLineHeight = function() {
          // calculate how many lines of text there are
          let height = $p.height();
          let lineHeight = $p.css('line-height');
          lineHeight = Math.ceil(lineHeight.substr(0, lineHeight.indexOf('px')));
          let numLines = Math.ceil(height / lineHeight);

          // set line-height to evenly space lines
          let parentHeight = $p.parent().height();
          let newLineHight = Math.floor(parentHeight / numLines);
          $p.css('line-height', newLineHight + 'px');
        };

        $p.parent().textfill({
          innerTag: 'p',
          success: updateLineHeight
        });
      };

      resizeText();
      $(window).on('resize', resizeText);
    }
  }
});
