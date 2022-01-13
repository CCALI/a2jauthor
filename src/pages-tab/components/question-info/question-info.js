import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './question-info.stache'

export const QuestionInfoVM = DefineMap.extend('QuestionInfoVM', {
  page: {},
  appState: {},

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
