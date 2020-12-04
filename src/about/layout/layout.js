import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './layout.stache'
import constants from 'a2jauthor/src/models/constants'
import 'blueimp-file-upload/js/jquery.fileupload'

export const AboutLayoutVm = DefineMap.extend('AboutLayoutVm', {
  // passed in via app.stache
  guide: {},
  guideId: {},
  // string
  attachBlueImpUploader (targetClassName, progressBarId, guideProp) {
    const $el = $(targetClassName)
    const vm = this

    if (vm.guideId !== 0) {
      $el.fileupload({
        dataType: 'json',
        url: `${constants.uploadURL}${vm.guideId}`,
        done: function (el, data) {
          const response = data.response()
          if (response.textStatus === 'success') {
            const fileName = data.files[0].name.trim()
            vm.guide.attr(guideProp, fileName)
          }
        },
        fail: function (el, data) {
          console.error('upload error for', data.files[0].name)
        },
        progressall (e, data) {
          const progress = parseInt(data.loaded / data.total * 100, 10)
          $(progressBarId).addClass('darken-div-anim')
          $(`${progressBarId} .bar`).css('width', progress + '%')
          if (progress === 100) {
            $(progressBarId).removeClass('darken-div-anim')
            $(`${progressBarId} .bar`).css('width', '0%')
          }
        }
      })
    }
  },

  connectedCallback (el) {
    const vm = this
    vm.attachBlueImpUploader('.logo-image-fileupload', '#logo-image-progress', 'logoImage')
    vm.attachBlueImpUploader('.end-image-fileupload', '#end-image-progress', 'endImage')
  }
})

export default Component.extend({
  tag: 'about-layout',
  view: template,
  leakScope: false,
  ViewModel: AboutLayoutVm
})
