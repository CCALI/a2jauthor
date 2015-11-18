import Map from 'can/map/';
import Component from 'can/component/';
import template from './tabs.stache!';
import createEmptyNode from 'author/utils/create-empty-node';

let TemplateEditTabsVm = Map.extend({
  addElement(elementName) {
    let a2jTemplate = this.attr('a2jTemplate');
    a2jTemplate.addNode(createEmptyNode(elementName));
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'template-edit-tabs',
  viewModel: TemplateEditTabsVm
});
