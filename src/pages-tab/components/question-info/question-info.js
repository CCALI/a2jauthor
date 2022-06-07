// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './question-info.stache'
import { ckeFactory } from '../../helpers/helpers'

export const QuestionInfoVM = DefineMap.extend('QuestionInfoVM', {
  page: {},
  appState: {},
  guideFiles: {},

  get ckeText () {
    return ckeFactory(this.page, 'text', 'Text:')
  },

  get ckeCitation () {
    return ckeFactory(this.page, 'textCitation', 'Citation:')
  },

  get legacySection () {
    return window.buildQuestionFieldSet(this.page)
  }
})

export default Component.extend({
  tag: 'question-info',
  view: template,
  leakScope: false,
  ViewModel: QuestionInfoVM
})
