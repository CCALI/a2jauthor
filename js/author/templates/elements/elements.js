import Map from 'can/map/';
import Component from 'can/component/';
import template from './elements.stache!';
import A2JNode from 'author/models/a2j-node';

import './blank/';
import 'can/map/define/';
import './elements.less!';
import './element-container/';

export let Elements = Map.extend({
  define: {
    rootNode: {
      Value: A2JNode
    },
    showEmpty: {
      get() {
        let rootNode = this.attr('rootNode');

        return rootNode.attr('children').attr('length') === 0;
      }
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  viewModel: Elements,
  tag: 'template-elements'
});
