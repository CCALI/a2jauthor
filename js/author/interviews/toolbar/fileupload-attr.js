import $ from 'jquery';

import 'can/view/';
import 'author/src/A2J_AuthorApp';

/**
 * @module FileUploadAttr
 * @parent api-components
 *
 * This can.view.attr attaches fileupload to the element
 *
 * It's not very re-usable now, we have a problem where the fileupload input
 * in the interviews tab toolbar will stop working when user visits a different
 * tab and then goes back to the interviews tab.
 *
 * The problem is, the fileupload handler was set in a file that gets imported
 * once, then when the element is removed from the page the fileupload reference
 * is lost, with this can.view.attr we ensure fileupload is called again when
 * the element is inserted back to the DOM.
 */
can.view.attr('fileupload', function(el) {
  let $el = $(el);

  $el.on('inserted', function() {
    $el.fileupload({
      dataType: 'json',
      url: CONST.uploadGuideURL,
      done() {
        setTimeout(signin, 500);
      },
      progressall(e, data) {
        let progress = parseInt(data.loaded / data.total * 100, 10);
        $('#guideuploadprogress .bar').css('width', progress + '%');
      }
    });
  });
});
