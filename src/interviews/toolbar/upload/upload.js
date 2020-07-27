import $ from 'jquery'
import 'blueimp-file-upload/js/jquery.fileupload'
import Guide from 'a2jauthor/models/guide'
import CanMap from 'can-map'
import Component from 'can-component'
import template from './upload.stache'

import 'can-map-define'

export const UploadVM = CanMap.extend('UploadVM', {
  define: {
    interviews: {}
  },

  scrollToUploadedFile (gid) {
    if (gid) {
      var $el = $('a[gid="' + gid + '"]')

      if ($el) {
        $('a.guide').removeClass('guide-uploaded')
        $el.addClass('guide-uploaded')

        var uploadedGuidePosition = $('.guide-uploaded').offset().top
        var navBarHeight = 140
        var scrollTo = uploadedGuidePosition - navBarHeight

        $('html,body').animate({ scrollTop: scrollTo }, 300)
      }
    }
  },

  connectedCallback (el) {
    const vm = this
    const $el = $('input.a2j-guideupload')

    $el.fileupload({
      dataType: 'json',
      url: 'CAJA_WS.php?cmd=uploadguide',
      done: function (el, data) {
        const response = data.response()
        if (response.textStatus === 'success') {
          const gid = response.result.gid
          // refresh owned interviews and scroll to uploaded GI
          Guide.findAll()
            .then(function (interviews) {
              vm.attr('interviews', interviews)
              vm.scrollToUploadedFile(gid)
            })
        }
      },
      progressall (e, data) {
        const progress = parseInt(data.loaded / data.total * 100, 10)
        $('#guideuploadprogress').addClass('darken-div-anim')
        $('#guideuploadprogress .bar').css('width', progress + '%')
        if (progress === 100) {
          $('#guideuploadprogress').removeClass('darken-div-anim')
          $('#guideuploadprogress .bar').css('width', '0%')
        }
      }
    })
  }
})

export default Component.extend('UploadComponent', {
  view: template,
  leakScope: false,
  tag: 'a2j-upload',
  ViewModel: UploadVM
})
