import $ from 'jquery'
import CanMap from 'can-map'
import TraceMessage from 'caja/author/models/trace-message'
import stache from 'can-stache'
import { assert } from 'chai'
import PagesVM from './pages-vm'
import sinon from 'sinon'
import AppState from 'caja/viewer/models/app-state'
import Infinite from 'caja/viewer/mobile/util/infinite'
import constants from 'caja/viewer/models/constants'
import './pages'
import 'steal-mocha'

describe('<a2j-pages>', () => {
  let vm
  let logicStub
  let nextPageStub
  let interview
  let defaults
  let traceMessage

  beforeEach(() => {
    logicStub = new CanMap({
      infinite: new Infinite(),
      exec: $.noop,
      eval: $.noop,
      gotoPage: false,
      varExists: sinon.spy(),
      varCreate: sinon.spy(),
      varGet: sinon.stub(),
      varSet: sinon.spy()
    })

    nextPageStub = new CanMap({
      name: 'Next',
      fields: []
    })

    interview = {
      answers: new CanMap(),
      getPageByName: function () {
        return nextPageStub
      },
      pages: {
        find () {
          return nextPageStub
        }
      }
    }
    // normally passed in via stache
    traceMessage = new TraceMessage()

    defaults = {
      currentPage: new CanMap({
        name: 'Intro',
        fields: [],
        repeatVar: '',
        text: '',
        textAudioURL: null,
        learn: null,
        buttons: null,
        step: { number: undefined, text: '' } }
      ),
      logic: logicStub,
      rState: new AppState({ interview, logic: logicStub, traceMessage }),
      mState: { },
      interview
    }
  })

  describe('viewModel', () => {
    let appStateTeardown
    beforeEach(() => {
      vm = new PagesVM(defaults)
      vm.connectedCallback()
      appStateTeardown = vm.attr('rState').connectedCallback()
    })

    afterEach(() => {
      appStateTeardown()
    })

    describe('navigate', () => {
      it('saves answer when button has a value', () => {
        let answers = defaults.interview.answers

        let kidstf = new CanMap({
          comment: '',
          name: 'KidsTF',
          repeating: true,
          type: 'TF',
          values: [null]
        })

        answers.attr('kidstf', kidstf)

        const button = new CanMap({
          label: 'Go!',
          next: 'Next',
          name: 'KidsTF',
          value: 'true'
        })

        vm.navigate(button)

        assert.deepEqual(answers.attr('kidstf.values.1'), true,
          'first saved value should be true')
      })

      it('saves answer when button can hold mutilple values', () => {
        let answers = defaults.interview.answers
        let page = defaults.currentPage

        let agesnu = new CanMap({
          comment: '',
          name: 'AgesNU',
          repeating: true,
          type: 'Number',
          values: [null, 14, 12]
        })

        answers.attr('agesnu', agesnu)

        const button = new CanMap({
          label: 'Go!',
          next: 'Next',
          name: 'AgesNU',
          value: '42'
        })

        // required to trigger mutli-value save
        page.attr('repeatVar', 'AgeCount')
        logicStub.varGet.returns(3)

        vm.navigate(button)

        assert.deepEqual(answers.attr('agesnu.values.3'), 42,
          'adds mutli value to index 3')
      })

      it('sets a2j interview incomplete tf to false when special buttons fired', () => {
        const answers = defaults.interview.answers
        const incompleteTF = constants.vnInterviewIncompleteTF.toLowerCase()

        const incomplete = new CanMap({
          comment: '',
          name: incompleteTF,
          repeating: false,
          type: 'TF',
          values: [null, true]
        })

        const specialButton = new CanMap({
          label: 'Special!',
          next: constants.qIDSUCCESS
        })

        answers.attr(incompleteTF, incomplete)
        vm.navigate(specialButton)
        assert.equal(answers.attr(`${incompleteTF}.values.1`), false, 'success button should complete interview')
      })
    })

    it('setFieldAnswers with repeatVar', () => {
      const answers = defaults.interview.answers
      const salaryCount = new CanMap({
        comment: '',
        name: 'salaryCount',
        repeating: false,
        type: 'NU',
        values: [null, 2]
      })

      const salary = new CanMap({
        comment: '',
        name: 'salary',
        repeating: true,
        type: 'NU',
        values: [null, 101, 202]
      })

      answers.attr('salary', salary)
      answers.attr('salaryCount', salaryCount)
      vm.attr('currentPage.repeatVar', 'salaryCount')

      const fields = vm.attr('currentPage.fields')
      fields.push({ name: 'salary', type: 'number' })
      logicStub.varGet.returns(2)

      vm.setFieldAnswers(fields)
      const field = vm.attr('currentPage.fields.0')
      const answerValues = field.attr('_answer.answer.values')

      assert.deepEqual(answerValues.attr(), [null, 101, 202], 'should set repeatVarValues')
    })

    describe('default values', () => {
      it('sets default value', () => {
        let field = new CanMap({
          name: 'StateTE',
          label: 'Enter State:',
          type: 'text',
          value: 'Texas'
        })

        let answerVar = new CanMap({
          name: 'statete',
          type: 'text',
          values: [null]
        })

        vm.attr('interview.answers.statete', answerVar)

        vm.attr('currentPage.fields').push(field)
        vm.attr('rState').page = 'Next' // page find() always returns nextPageStub

        vm.setCurrentPage()

        assert.equal(vm.attr('interview.answers.statete.values.1'), 'Texas', 'Default values override empty answers')
      })

      it('ignores default value if previous answer exists', () => {
        let field = new CanMap({
          name: 'StateTE',
          label: 'Enter State:',
          type: 'text',
          value: 'Texas'
        })

        let answerVar = new CanMap({
          name: 'statete',
          type: 'text',
          values: [null, 'Illinois']
        })

        vm.attr('interview.answers.statete', answerVar)

        nextPageStub.fields.push(field)
        vm.attr('rState').page = 'Next' // page find() always returns nextPageStub

        vm.setCurrentPage()

        assert.equal(vm.attr('interview.answers.statete.values.1'), 'Illinois', 'Saved answers trump Default Values')
      })
    })
  })

  describe('Component', () => {
    let rStateTeardown
    beforeEach(() => {
      let frag = stache(
        '<a2j-pages rState:bind="rState"></a2j-pages>'
      )
      $('#test-area').html(frag({ rState: defaults.rState }))
      vm = $('a2j-pages')[0].viewModel

      vm.attr(defaults)
      vm.connectedCallback()
      rStateTeardown = vm.attr('rState').connectedCallback()
    })

    afterEach(() => {
      rStateTeardown()
      $('#test-area').empty()
    })
  })
})
