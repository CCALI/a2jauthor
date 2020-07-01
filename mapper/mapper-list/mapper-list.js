import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './mapper-list.stache'

export const MapperListVM = DefineMap.extend('MapperListVM', {
  // passed in via mapper.stache
  guide: {},
  onSelectPageName: {},
  scrollToSelectedNode: {},
  selectedPageName: {},
  openQDE: {},
  addPage: {},
  addPopup: {},
  pagesAndPopups: {},

  selectListPageName (pageName) {
    this.onSelectPageName(pageName)
    // passed from mapper-canvas.js
    this.scrollToSelectedNode()
  }
})

export default Component.extend('MapperListComponent', {
  view: template,
  tag: 'mapper-list',
  ViewModel: MapperListVM,
  leakScope: false
})
