import CanMap from 'can-map'
import Answers from 'caja/author/models/answers'

import 'can-map-define'

/**
 * @module {can.Map} A2jTemplateVM
 * @parent A2JTemplate
 *
 * <a2j-variable>'s viewModel.
 */
export default CanMap.extend('A2JVariableVM', {
  define: {
    // passed in via stache
    useAnswers: {},
    name: {},

    /**
     * @property {Answers} answers
     *
     * Answers object available when user uploads an ANX file during document
     * assembly.
     */
    answers: {
      Type: Answers
    },

    /**
     * @property {Answer} variable
     *
     * This component has access to the `answers` object, which is a map where
     * each key is a variable name (lowercase) and it's value is an object with
     * a few properties, like `name`, `repeating` and `values`. This property
     * looks up the variable name in `answers` and returns its value if found.
     */
    variable: {
      get () {
        let name = this.attr('name')
        let answers = this.attr('answers')

        if (name && answers) {
          return answers.getVariable(name)
        }
      }
    },

    /**
     * @property {Number} varIndex
     *
     * The index used to access a specific value of a `repeating` variable.
     *
     * E.g: if [varIndex] is set to `2`, `variable.attr('values.2')` will be
     * returned if `variable` is `repeating`.
     */
    varIndex: {
      value: null
    },

    /**
     * @property {String} value
     *
     * The effective variable value.
     */
    value: {
      get () {
        let variable = this.attr('variable')

        if (variable) {
          let name = this.attr('name')
          let answers = this.attr('answers')
          let index = this.attr('varIndex')

          return answers.getValue(name, index)
        }
      }
    },

    /**
     * @property {Boolean} canShowAnswer
     *
     * Whether to show the variable value in the answers object instead of the
     * variable name passed to the component through its attributes.
     */
    canShowAnswer: {
      get () {
        let value = this.attr('value')
        let useAnswers = this.attr('useAnswers')

        return value != null && useAnswers
      }
    },

    /**
     * @property {Boolean} isUnanswered
     *
     * Whether there is an answer available for the variable when the flag
     * to interpolate the answers is `true`.
     */
    isUnanswered: {
      get () {
        let value = this.attr('value')
        let useAnswers = this.attr('useAnswers')

        return useAnswers && value == null
      }
    }
  }
})
