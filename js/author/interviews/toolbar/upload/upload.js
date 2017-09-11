import $ from 'jquery';
import 'blueimp-file-upload/js/jquery.fileupload';

import Map from 'can/map/';
import Component from 'can/component/';
import template from './upload.stache!';
import Guide from 'author/models/guide';

export const UploadVM = Map.extend('UploadVM', {
  define: {
    interviews: {
      serialize: false
    }
  },

  scrollToUploadedFile(gid) {
    if (gid) {
      var $el = $('a[gid="'+gid+'"]');

      if ($el) {
        $('a.guide').removeClass('active');
        $el.addClass('active');

        var scrollTo = $el.offset().top - 140;
        $('html body').scrollTop(scrollTo);
      }
    }
  }

});

export default Component.extend('UploadComponent', {
  template,
  leakScope: false,
  tag: 'a2j-upload',
  viewModel: UploadVM,

  events: {
    inserted: function (){
      let vm = this.viewModel;

        let $el = $('input.a2j-guideupload');

        $el.fileupload({
          dataType: 'json',
          url: 'CAJA_WS.php?cmd=uploadguide',
          done: function(el, data) {
            let response = data.response();
            if (response.textStatus === 'success') {
              // refresh owned interviews
              Guide.findAll()
                .then(function(interviews) {
                  vm.attr('interviews', interviews);
                  vm.scrollToUploadedFile(response.result.gid);
                });
            }
          },
          progressall(e, data) {
            let progress = parseInt(data.loaded / data.total * 100, 10);
              $('#guideuploadprogress').addClass('darken-div-anim');
              $('#guideuploadprogress .bar').css('width', progress + '%');
            if (progress === 100) {
              $('#guideuploadprogress').removeClass('darken-div-anim');
              $('#guideuploadprogress .bar').css('width', '0%');
            }
          }
        });
    }
  }
});
