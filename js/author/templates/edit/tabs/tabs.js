import Map from 'can/map/';
import Component from 'can/component/';
import template from './tabs.stache!';
import _capitalize from 'lodash/capitalize';
import createEmptyNode from 'author/utils/create-empty-node';

import 'can/map/define/';

let TemplateEditTabsVM = Map.extend({
  define: {
    editingHeader: {
      type: 'boolean',
      value: false
    },

    editingFooter: {
      type: 'boolean',
      value: false
    }
  },

  addElement(elementName) {
    const template = this.attr('template');
    const newNode = createEmptyNode(elementName);

    template.addNode(newNode);
  },

  editElement(elementName) {
    this.attr('editing' + _capitalize(elementName), true);
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'template-edit-tabs',
  viewModel: TemplateEditTabsVM
});
