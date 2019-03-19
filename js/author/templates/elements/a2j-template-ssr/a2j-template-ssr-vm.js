import CanMap from 'can-map'
import CanList from 'can-list'
import Answers from 'caja/author/models/answers'
import A2JTemplate from 'caja/author/models/a2j-template'
import evalAuthorCondition from 'caja/author/utils/eval-author-condition'

/**
 * @module {can.Map} A2jTemplateSsrVM
 * @parent A2jTemplateSsr
 *
 * <a2j-template-ssr>'s viewModel.
 */
export default CanMap.extend({
  define: {
    // passed in from server.stache
    guideId: {},
    templateId: {},
    templateIds: {
      type: '*'
    },
    fileDataURL: {},
    /**
     * @property {Promise} templatesPromise
     *
     * Asynchronous request to retrieve the template(s) needed to generate
     * the PDF if `templateId` is provided, it'll fetch that specific template
     * otherwise it will retrieve the list of templates matching `guideId`.
     */
    templatesPromise: {
      get () {
        const active = true
        const guideId = this.attr('guideId')
        const templateId = this.attr('templateId')
        const templateIds = this.attr('templateIds')
        const fileDataURL = this.attr('fileDataURL')

        if (templateIds && templateIds.length) {
          return Promise.all(
            templateIds.map(templateId => A2JTemplate.findOne({ guideId, templateId }))
          ).then(templates => new CanList(templates))
        }
        if (templateId) {
          return this.findOneAndMakeList(guideId, templateId, fileDataURL).then((val) => {
            return val
          })
        }

        return A2JTemplate.findAll({ guideId, fileDataURL, active })
      }
    },

    /**
     * @property {A2JTemplate.List} templates
     *
     * List of A2JTemplate instance(s).
     */
    templates: {
      get (last, set) {
        this.attr('templatesPromise').then(set, error => {
          console.log('Failed to get templates from server: ', error)
        })
      }
    },

    /**
     * @property {Answers} answers
     *
     * Key/value map of interview's variable values.
     */
    answers: {
      set (json) {
        const answers = this.parseAnswers(json)
        return new Answers(answers)
      }
    }
  },

  /**
   * @function findOneAndMakeList
   *
   * Calls `A2JTemplate.findOne` with the guideId and templateId values passed
   * as a parameter and returns an `A2JTemplate.List` with the template instance
   * retrieved from the server.
   */
  findOneAndMakeList (guideId, templateId, fileDataURL) {
    const promise = A2JTemplate.findOne({ guideId, templateId, fileDataURL })
    return promise.then(template => new CanList([template]))
  },

  /**
   * @function parseAnswers
   *
   * Parses the JSON string coming from the client and returns the resulting
   * object (returns an empty object if invalid json is passed).
   */
  parseAnswers (json) {
    let answers = {}

    try {
      answers = JSON.parse(json)
    } catch (e) {
      console.error('Invalid JSON', e)
    }

    return answers
  },

  /**
   * @function canRenderTemplate
   *
   * Determines whether the template passed to the function can be rendered
   */
  canRenderTemplate (template) {
    const state = template.attr('rootNode.state')
    const hasConditionalLogic = state.attr('hasConditionalLogic') === 'true'

    return (
      !hasConditionalLogic ||
      evalAuthorCondition({
        answers: this.attr('answers'),
        operator: state.attr('operator'),
        leftOperand: state.attr('leftOperand'),
        rightOperand: state.attr('rightOperand'),
        rightOperandType: state.attr('rightOperandType')
      })
    )
  }
})
