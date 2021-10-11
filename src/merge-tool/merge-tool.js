import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './merge-tool.stache'

export const MergeToolVM = DefineMap.extend('MergeToolVM', {
  // on the right, we are checking these boxes to bring stuff in
  sourceGuide: {},
  // on the left, where the imported items are merging
  targetGuide: {},

  connectedCallback () {
    const vm = this
    // do weird stuff

    return () => {
      // cleanup
      vm.stopListening()
    }
  }
})

export default Component.extend({
  tag: 'merge-tool',
  view: template,
  leakScope: false,
  ViewModel: MergeToolVM
})
