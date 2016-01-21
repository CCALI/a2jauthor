import Map from 'can/map/';
import Component from 'can/component/';
import template from './tabs.stache!';
import createEmptyNode from 'author/utils/create-empty-node';
import _capitalize from 'lodash/string/capitalize';

import 'can/map/define/';

let TemplateEditTabsVm = Map.extend({
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
    let a2jTemplate = this.attr('a2jTemplate');
    a2jTemplate.addNode(createEmptyNode(elementName));
  },
  editElement(elementName) {
    this.attr('editing' + _capitalize(elementName), true);
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'template-edit-tabs',
  viewModel: TemplateEditTabsVm
});
