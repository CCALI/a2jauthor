import CanMap from 'can-map'
import Component from 'can-component'
import template from './modal.stache'
import $ from 'jquery'

import 'can-map-define'

export const ModalVM = CanMap.extend('Author Modal', {
  define: {
    modalTitle: {},
    isLarge: {},
    leftButtonText: {},
    leftButtonIcon: {},
    cancelText: {},
    submitText: {}
    /*
      modalTitle: String
      isLarge: Boolean

      leftButtonText: String
      leftButtonIcon: String
      onLeftButtonClick: Function ()

      cancelText: String
      onCancel: Function ({
        usedCancelButton: Boolean
      })

      submitText: String
      onSubmit: Function ()
    */
  },

  fireCancel (usedCancelButton = false) {
    const onCancel = this.attr('onCancel')
    if (!onCancel) {
      return
    }

    onCancel({ usedCancelButton })
  },

  fireSubmit () {
    const onSubmit = this.attr('onSubmit')
    if (!onSubmit) {
      return
    }

    onSubmit()
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: ModalVM,
  tag: 'author-modal',
  events: {
    '.author-modal click' (target, event) {
      const isBackgroundClick = $(event.target).is('.author-modal')
      if (isBackgroundClick) {
        this.viewModel.fireCancel()
      }
    }
  }
})
