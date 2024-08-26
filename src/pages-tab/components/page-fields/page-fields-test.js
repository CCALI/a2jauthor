import { assert } from 'chai'
import { FieldVM, PageFieldsVM } from './page-fields'
import DefineMap from 'can-define/map/map'

import 'steal-mocha'

// ViewModel unit tests
describe('<page-fields>', () => {
  describe('viewModel', () => {
    let vm
    let originalGuide

    beforeEach(() => {
      vm = new FieldVM()
      originalGuide = window.gGuide
      window.gGuide = undefined
      window.gGuide = originalGuide
    })

    afterEach(() => {
      window.gGuide = undefined
      window.gGuide = originalGuide
    })

    it('hasValidType', () => {})

  })
})