import $ from 'jquery';
import F from 'funcunit';
import Map from 'can/map/';
import assert from 'assert';
import { ModalVM } from './modal';
import stache from 'can/view/stache/';

describe('<a2j-modal> ', function() {
  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new ModalVM();
    });

    it('computes currentPage properly', function() {
      const interview = {
        getPageByName(name) {
          const pages = { foo: 'bar' };
          return pages[name];
        }
      };

      const rState = new can.Map({ page: 'foo' });

      vm.attr('interview', interview);
      vm.attr('rState', rState);

      assert.equal(vm.attr('currentPage'), 'bar');
    });
  });

  describe('Component', function() {
    let vm;

    beforeEach(function() {
      const interview = {
        getPageByName() {
          return new Map();
        }
      };

      const rState = new Map({ page: 'foo' });
      const mState = new Map({ fileDataURL: '/js/images/' });
      const logic = new Map({ eval() {} });

      const frag = stache(
        `<a2j-modal
          {logic}="logic"
          {m-state}="mState"
          {r-state}="rState"
          {interview}="interview" />`
      );

      $('#test-area').html(frag({ interview, rState, logic, mState }));
      vm = $('a2j-modal').viewModel();
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('renders image tag if pages includes helpImageURL', function(done) {
      const interview = {
        getPageByName() {
          return new Map({ helpImageURL: 'ui-icons_ffffff_256x240.png' });
        }
      };

      vm.attr('interview', interview);

      F('img.help-image').exists();
      F('img.help-image').attr('src', '/js/images/ui-icons_ffffff_256x240.png');

      F(done);
    });

    it('renders audio tag if page includes helpAudioURL', function(done) {
      const interview = {
        getPageByName() {
          return new Map({ helpAudioURL: 'foo.mp3' });
        }
      };

      vm.attr('interview', interview);

      F('audio.help-audio').exists();
      F('audio.help-audio').attr('src', '/js/images/foo.mp3');

      F(done);
    });

    it('renders image tag if page includes helpVideoURL (gif)', function(done) {
      const interview = {
        getPageByName() {
          return new Map({ helpVideoURL: 'foo.gif' });
        }
      };

      vm.attr('interview', interview);

      F('img.help-video').exists();
      F('img.help-video').attr('src', '/js/images/foo.gif');

      F(done);
    });

    it('renders video tag if page includes helpVideoURL (other)', function(done) {
      const interview = {
        getPageByName() {
          return new Map({ helpVideoURL: 'foo.ogg' });
        }
      };

      vm.attr('interview', interview);

      F('video.help-video').exists();
      F('video.help-video').attr('src', '/js/images/foo.ogg');

      F(done);
    });
  });
});
