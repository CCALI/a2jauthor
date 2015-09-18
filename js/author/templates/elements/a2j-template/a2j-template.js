import Map from 'can/map/';
import Component from 'can/component/';
import stache from 'can/view/stache/';
import dragula from 'dragula/dist/dragula';

import 'can/map/define/';
import './a2j-template.less!';
import 'dragula/dist/dragula.css!';
import 'author/templates/elements/free-form/';
import 'author/templates/elements/a2j-variable/';
import 'author/templates/elements/section-title/';

export let A2JTemplateVM = Map.extend({
  define: {
    /**
     * @property {A2JTemplate} template
     */
    template: {
      value: ''
    },
    /**
     * @property {A2JNode} rootNode
     */
    rootNode: {
      get: function() {
        let template = this.attr('template');

        return template.attr('rootNode');
      }
    }
  }
});

export default Component.extend({
  tag: 'a2j-template',
  viewModel: A2JTemplateVM,
  events: {
    inserted($element) {
      let viewModel = this.viewModel;

      viewModel.attr('rootNode').attr('children').map((node) => {
        let renderer = stache(node.attr('component'));
        $element.append(renderer(node.attr('state')));
      });

      // add drag & drop support to the templates view
      dragula([$element.get(0)]);
    }
  }
});
