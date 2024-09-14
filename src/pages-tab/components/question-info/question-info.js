import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './question-info.stache'
import { ckeFactory } from '../../helpers/helpers'

export const QuestionInfoVM = DefineMap.extend('QuestionInfoVM', {
  page: {},
  appState: {},
  guideFiles: {},
  get vars () {
    return this.appState.guide.vars
  },

  get showCountingVariableWarning () {
    const repeatVarName = this.page && this.page.repeatVar && this.page.repeatVar.toLowerCase()
    return !!repeatVarName && this.vars[repeatVarName].type !== 'Number'
  },

  get showOuterLoopVariableWarning () {
    const outerLoopVarName = this.page && this.page.outerLoopVar && this.page.outerLoopVar.toLowerCase()
    return !!outerLoopVarName && this.vars[outerLoopVarName].type !== 'Number'
  },

  healthMessage: {
    default: () => 'Counting Variables require Variable Type (Number)'
  },

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
