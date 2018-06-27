import $ from 'jquery'
import F from 'funcunit'
import CanMap from 'can-map'
import { ModalVM } from './modal'
import stache from 'can-stache'

import 'caja/viewer/styles.less'

describe('<a2j-modal> ', function () {
  describe('Component', function () {
    let vm = new ModalVM()

    beforeEach(function () {
      const interview = {
        getPageByName () {
          return new CanMap()
        }
      }

      const rState = new CanMap({ page: 'foo' })
      const mState = new CanMap({ fileDataURL: '/CAJA/js/images/' })
      const logic = new CanMap({ eval () {} })
      const modalContent = new CanMap({})

      const frag = stache(
        `<a2j-modal class="bootstrap-styles"
          vm:logic:from="logic"
          vm:mState:from="mState"
          vm:rState:from="rState"
          vm:interview:from="interview"
          vm:modalContent:from="modalContent" />`
      )

      $('#test-area').html(frag({ interview, rState, logic, mState, modalContent }))
      vm = $('a2j-modal').viewModel()
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    it('renders image tag if modalContent includes imageURL', function (done) {
      const helpImageURL = 'ui-icons_ffffff_256x240.png'

      vm.attr('modalContent', { imageURL: helpImageURL })

      F('img.modal-image').exists()
      F('img.modal-image').attr('src', '/CAJA/js/images/ui-icons_ffffff_256x240.png')

      F(done)
    })

    it('renders audio tag if page includes helpAudioURL', function (done) {
      const helpAudioURL = 'pings.ogg'

      vm.attr('modalContent', { audioURL: helpAudioURL })

      F('audio-player').exists()

      F(done)
    })

    it('renders image tag if page includes helpVideoURL (gif)', function (done) {
      const helpVideoURL = 'panda.gif'

      vm.attr('modalContent', { videoURL: helpVideoURL })
      F('img.modal-video').exists()
      F('img.modal-video').attr('src', '/CAJA/js/images/panda.gif')

      F(done)
    })

    it('renders video tag if page includes helpVideoURL (other)', function (done) {
      const helpVideoURL = 'pings.ogg'

      vm.attr('modalContent', { videoURL: helpVideoURL })
      F('video.modal-video').exists()
      F('video.modal-video').attr('src', '/CAJA/js/images/pings.ogg')

      F(done)
    })

    it('renders an expanded text area if page includes answerName (a2j variable name)', function (done) {
      vm.attr('modalContent', { answerName: 'longAnswerTE' })
      F('textarea.expanded-textarea').exists()

      F(done)
    })
  })
})
