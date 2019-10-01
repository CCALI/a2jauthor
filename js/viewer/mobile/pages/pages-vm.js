import $ from 'jquery'
import CanMap from 'can-map'
import _some from 'lodash/some'
import _isString from 'lodash/isString'
import _forEach from 'lodash/forEach'
import queues from 'can-queues'
import AnswerVM from 'caja/viewer/models/answervm'
import Parser from 'caja/viewer/mobile/util/parser'
import { Analytics } from 'caja/viewer/util/analytics'
import constants from 'caja/viewer/models/constants'

import 'can-map-define'
import 'bootstrap/js/modal'

/**
 * @property {can.Map} pages.ViewModel
 * @parent viewer/mobile/pages/
 *
 * `<a2j-pages>` viewModel.
 */
export default CanMap.extend('PagesVM', {
  define: {
    // passed in via steps.stache or mobile.stache
    currentPage: {},
    resumeInterview: {},
    lang: {},
    logic: {},
    rState: {},
    pState: {},
    mState: {},
    interview: {},
    modalContent: {},

    /**
     * @property {String} pages.ViewModel.prototype.backButton backButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that sends the user back to the most
     * recently visited page.
     */
    backButton: {
      value: constants.qIDBACK
    },

    /**
     * @property {String} pages.ViewModel.prototype.saveAnswersButton saveAnswersButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that saves the answers to the server
     * and replaces the viewer with the server's response.
     */
    saveAnswersButton: {
      value: constants.qIDSUCCESS
    },

    /**
     * @property {String} pages.ViewModel.prototype.exitButton exitButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that saves the answers to the server
     * when the interview is only partially complete.
     */
    exitButton: {
      value: constants.qIDEXIT
    },

    /**
     * @property {String} pages.ViewModel.prototype.resumeButton resumeButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that resumes the interview rather than Exit.
     */
    resumeButton: {
      value: constants.qIDRESUME
    },

    /**
     * @property {String} pages.ViewModel.prototype.assembleButton assembleButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that generates a PDF document.
     */
    assembleButton: {
      value: constants.qIDASSEMBLE
    },

    /**
     * @property {String} pages.ViewModel.prototype.assembleAndSaveButton assembleAndSaveButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that generates a PDF document and also
     * saves the answers to the server.
     */
    assembleAndSaveButton: {
      value: constants.qIDASSEMBLESUCCESS
    },

    /**
     * @property {String} pages.ViewModel.prototype.guideId guideId
     * @parent pages.ViewModel
     *
     * Id of the guided interview being "previewed" by the author.
     *
     * This property is not available (it's undefined) when the viewer runs
     * in standalone mode. It's used during document assembly to filter the
     * templates used to generate the final document.
     */
    guideId: {
      get () {
        return window.gGuideID
      }
    },

    /**
     * @property {String} pages.ViewModel.prototype.answersString answersString
     * @parent pages.ViewModel
     *
     * JSON representation of the `answers` entered by the user.
     *
     * This is used during document assembly to fill in the variables added by
     * the author to any of the templates.
     */
    answersString: {
      get () {
        const answers = this.attr('pState.answers')
        return JSON.stringify(answers.serialize())
      }
    },

    /**
     * @property {String} pages.ViewModel.prototype.answersString answersString
     * @parent pages.ViewModel
     *
     * XML version of the `answers` entered by the user.
     *
     * This is POSTed to `setDataURL` when user finishes the interview,
     * and populated when a user loads saved answers.
     */
    answersANX: {
      get () {
        const answers = this.attr('interview.answers')
        const parsed = Parser.parseANX(answers.serialize())
        return parsed
      }
    },

    answersJSON: {
      get () {
        const answers = this.attr('interview.answers')
        const parsed = JSON.stringify(answers.serialize())
        return parsed
      }
    }
  },

  connectedCallback () {
    const vm = this
    vm.setCurrentPage()

    return () => { vm.stopListening() }
  },

  parseText (html) {
    // re-eval if answer values have updated via beforeCode
    const answersChanged = this.attr('interview.answers').serialize() // eslint-disable-line
    return this.attr('logic').eval(html)
  },

  returnHome () {
    this.attr('rState').attr({}, true)
  },

  validateAllFields () {
    const fields = this.attr('currentPage.fields')

    _forEach(fields, function (field) {
      const hasError = !!field.attr('_answer.errors')
      field.attr('hasError', hasError)
    })
  },

  traceButtonClicked (buttonLabel) {
    this.attr('rState.traceMessage').addMessage({
      key: 'button',
      fragments: [
        { format: '', msg: 'You pressed' },
        { format: 'ui', msg: buttonLabel }
      ]
    })
  },

  traceMessageAfterQuestion () {
    this.attr('rState.traceMessage').addMessage({
      key: 'codeAfter',
      fragments: [{ format: 'info', msg: 'Logic After Question' }]
    })
  },

  navigate (button, el, ev) {
    this.traceButtonClicked(button.attr('label'))

    const page = this.attr('currentPage')
    const fields = page.attr('fields')
    const rState = this.attr('rState')

    // invalid fields stop all navigate logic (ex: required answer not answered, or min/max out of range)
    this.validateAllFields()
    const anyFieldWithError = _some(fields, f => f.attr('hasError'))

    if (anyFieldWithError) {
      // do nothing if there are field(s) with error(s)
      // don't submit answers or assemble document
      ev && ev.preventDefault()
      return false
    } else {
      // Author Preview Mode changes handling of special buttons, and does not post answers
      if (rState.previewActive &&
        (button.next === constants.qIDFAIL ||
        button.next === constants.qIDEXIT ||
        button.next === constants.qIDSUCCESS ||
        button.next === constants.qIDASSEMBLESUCCESS ||
        button.next === constants.qIDASSEMBLE)
      ) {
        // stop default submit actions in preview
        ev && ev.preventDefault()
        this.previewActiveResponses(button)
      }

      // resumeInterview function passed from NavigationVM via stache
      if (button.next === constants.qIDRESUME) {
        this.resumeInterview()
        // special destination dIDRESUME button skips rest of navigate
        return
      }

      // special destination qIDFAIL button skips rest of navigate
      // Author can provide an external URL to explain why user did not qualify
      if (button.next === constants.qIDFAIL) {
        this.setInterviewAsComplete()
        let failURL = button.url.toLowerCase()
        let hasProtocol = failURL.indexOf('http') === 0
        failURL = hasProtocol ? failURL : 'http://' + failURL
        if (failURL === 'http://') {
          // If Empty, standard message
          this.attr('modalContent', {
            title: 'You did not Qualify',
            text: 'Unfortunately, you did not qualify to use this A2J Guided Interview. Please close your browser window or tab to exit the interview.'
          })
        } else {
          // track the external link
          if (window._paq) {
            Analytics.trackExitLink(failURL, 'link')
          }
          window.open(failURL, '_blank')
        }
        return
      }

      // Set answers for buttons with values
      if (button.name) {
        const logic = this.attr('logic')
        const buttonAnswer = this.__ensureFieldAnswer(button)
        let buttonAnswerIndex = 1

        if (page.attr('repeatVar')) {
          const repeatVar = page.attr('repeatVar')
          const repeatVarCount = logic.varGet(repeatVar)

          buttonAnswerIndex = (repeatVarCount != null) ? repeatVarCount : buttonAnswerIndex
        }

        let buttonValue = button.value

        if (buttonAnswer.type === 'TF') {
          buttonValue = buttonValue.toLowerCase() === 'true'
        } else if (buttonAnswer.type === 'Number') {
          buttonValue = parseInt(buttonValue)
        }

        buttonAnswer.attr('values.' + buttonAnswerIndex, buttonValue)
      }

      // handle afterLogic
      const logic = this.attr('logic')
      const codeAfter = page.attr('codeAfter')
      const repeatVar = button.attr('repeatVar')
      const repeatVarSet = button.attr('repeatVarSet')

      // default next page is derived from the button pressed.
      // might be overridden by the After logic or special
      // back to prior question button.
      logic.attr('gotoPage', button.next)

      // execute After logic only if not going to a prior question
      if (codeAfter && button.next !== constants.qIDBACK) {
        this.traceMessageAfterQuestion()

        // parsing codeAfter causes several re-renders, batching for performance
        // TODO: might not need this once afterLogic parsing is refactored to canjs
        queues.batch.start()
        logic.exec(codeAfter)
        queues.batch.stop()
      }

      // repeatVar holds the name of the variable that acts as the total count
      // of a repeating variable; and repeatVarSet indicates whether that
      // variable should be set to `1` or increased, `setRepeatVariable` takes
      // care of setting `repeatVar` properly.
      if (repeatVar && repeatVarSet) {
        this.setRepeatVariable(repeatVar, repeatVarSet)
      }

      // Don't post to the server in Author Preview aka previewActive
      if (!rState.previewActive && (button.next === constants.qIDASSEMBLESUCCESS || button.next === constants.qIDSUCCESS || button.next === constants.qIDEXIT)) {
        // This disable is for LHI/HotDocs issue taking too long to process
        // prompting users to repeatedly press submit, crashing HotDocs
        // Matches A2J4 functionality, but should really be handled better on LHI's server
        this.attr('modalContent', {
          title: 'Answers Submitted :',
          text: 'Page will redirect shortly'
        })

        this.dispatch('post-answers-to-server')

        // qIDASSEMBLESUCCESS requires the default event to trigger the assemble post
        // and the manual submit below to trigger the answer save
        // TODO: the way final answer forms are created and submitted needs a refactor
        if (button.next !== constants.qIDASSEMBLESUCCESS) {
          ev && ev.preventDefault()
        }
        this.setInterviewAsComplete()

        // disable the previously clicked button
        setTimeout(() => {
          $('button:contains(' + button.label + ')').prop('disabled', true)
        })
      }

      // user has selected to navigate to a prior question
      if (button.next === constants.qIDBACK) {
        // last visited page always at index 1
        const priorQuestionName = rState.visitedPages[1].name
        // override with new gotoPage
        logic.attr('gotoPage', priorQuestionName)
        button.attr('next', priorQuestionName)
      }

      const gotoPage = logic.attr('gotoPage')
      const logicPageisNotEmpty = _isString(gotoPage) && gotoPage.length

      // this means the logic After has overriden the destination page, we
      // should navigate to this page instead of the page set by `button.next`.
      if (logicPageisNotEmpty && gotoPage !== button.next) {
        logic.attr('gotoPage', null)
        rState.page = gotoPage

      // only navigate to the `button.next` page if the button clicked is not
      // any of the buttons with "special" behavior.
      } else if (button.next !== constants.qIDEXIT &&
        button.next !== constants.qIDSUCCESS &&
        button.next !== constants.qIDASSEMBLE &&
        button.next !== constants.qIDASSEMBLESUCCESS &&
        button.next !== constants.qIDFAIL) {
        rState.page = button.next
      }

      // if these special buttons are used, the interview is complete (incomplete is false)
      if (button.next === constants.qIDFAIL ||
        button.next === constants.qIDSUCCESS ||
        button.next === constants.qIDASSEMBLE ||
        button.next === constants.qIDASSEMBLESUCCESS) {
        this.setInterviewAsComplete()
      }

      return
    }
  },

  setInterviewAsComplete () {
    const answers = this.attr('interview.answers')
    answers.attr(`${constants.vnInterviewIncompleteTF.toLowerCase()}.values`, [null, false])
  },

  previewActiveResponses (button) {
    switch (button.next) {
      case constants.qIDFAIL:
        this.attr('modalContent', {
          title: 'Author note:',
          text: 'User would be redirected to \n(' + button.url + ')'
        })
        break

      case constants.qIDEXIT:
        this.attr('modalContent', {
          title: 'Author note:',
          text: "User's INCOMPLETE data would upload to the server."
        })
        break

      case constants.qIDASSEMBLE:
        this.attr('modalContent', {
          title: 'Author note:',
          text: 'Document Assembly would happen here.  Use Test Assemble under the Templates tab to assemble in A2J Author'
        })
        break

      case constants.qIDSUCCESS:
        this.attr('modalContent', {
          title: 'Author note:',
          text: "User's data would upload to the server."
        })
        break
      case constants.qIDASSEMBLESUCCESS:
        this.attr('modalContent', {
          title: 'Author note:',
          text: "User's data would upload to the server, then assemble their document.  Use Test Assemble under the Templates tab to assemble in A2J Author"
        })
        break
    }
  },

  setCurrentPage () {
    const currentPage = this.attr('currentPage')

    if (currentPage && currentPage.name !== constants.qIDFAIL) {
      if (!currentPage) {
        console.warn(`Unknown page: ${currentPage.name}`)
        return
      }

      queues.batch.start()

      this.setFieldAnswers(currentPage.attr('fields'))
      this.attr('mState.header', currentPage.attr('step.text'))
      this.attr('mState.step', currentPage.attr('step.number'))

      queues.batch.stop()
    }
  },

  /**
   * @function pages.ViewModel.prototype.__ensureFieldAnswer __ensureFieldAnswer
   * @parent pages.ViewModel
   *
   * Returns an Answer instance of the given field name.
   *
   * This method takes a `field` model instance and checks if there is an
   * `answer` object already set in the `interview.answers` list, if that's
   * the case the object is returned, otherwise an empty answer is created
   * using the `field` data, that answer is set to the answers list and returned.
   *
   * ** This is doing too many things, it probably does not belong here either.
   */
  __ensureFieldAnswer (field) {
    const name = field.attr('name').toLowerCase()
    const answers = this.attr('interview.answers')

    let answer = answers.attr(name)

    if (answer) {
      return answer
    } else {
      answer = field.attr('emptyAnswer')
      answers.attr(name, answer)
      return answer
    }
  },

  setFieldAnswers (fields) {
    const logic = this.attr('logic')

    if (logic && fields.length) {
      const rState = this.attr('rState')
      const mState = this.attr('mState')
      const answerIndex = rState.answerIndex

      fields.forEach(field => {
        const answer = this.__ensureFieldAnswer(field)
        const avm = new AnswerVM({ field, answerIndex, answer, fields })

        if (field.attr('type') === 'textpick') {
          field.getOptions(mState.attr('fileDataURL'))
        }

        // Assign default value if it exists and no previous answer
        if (field.value && !avm.attr('answer.values.' + answerIndex)) {
          this.setDefaultValue(field, avm, answer, answerIndex)
        }

        field.attr('_answer', avm)
        // if repeating true, show var#count in debug-panel
        this.logVarMessage(field.attr('_answer'), answer.repeating, answerIndex)
      })
    }
  },

  setDefaultValue (field, avm, answer, answerIndex) {
    const fieldIsNumber = (
      field.type === constants.ftNumber ||
      field.type === constants.ftNumberDollar ||
      field.type === constants.ftNumberPick
    )

    // Default values used differently or not at all for these field types
    const defaultAllowed = (
      field.type !== constants.ftRadioButton &&
      field.type !== constants.ftCheckBox &&
      field.type !== constants.ftCheckBoxNOTA &&
      field.type !== constants.ftGender
    )

    if (defaultAllowed) {
      if (fieldIsNumber) {
        avm.attr('answer.values.' + answerIndex, parseFloat(field.value, 10))
      } else {
        avm.attr('answer.values.' + answerIndex, field.value)
      }
    }

    return avm
  },

  logVarMessage (fieldAnswerVM, isRepeating, answerIndex) {
    const answerName = fieldAnswerVM.attr('answer.name')
    const answerValue = fieldAnswerVM.attr('values')
    const answerIndexDisplay = isRepeating ? `#${answerIndex}` : ''

    this.attr('rState.traceMessage').addMessage({
      key: answerName,
      fragments: [
        { format: 'var', msg: answerName + answerIndexDisplay },
        { format: '', msg: ' = ' },
        { format: 'val', msg: answerValue }
      ]
    })
  },

  setRepeatVariable (repeatVar, repeatVarSet) {
    const logic = this.attr('logic')
    const traceMessage = this.attr('rState.traceMessage')

    let traceMsg = {}

    if (!logic.varExists('repeatVar')) {
      logic.varCreate('repeatVar', 'Text', false, 'Repeat variable name')
    }

    logic.varSet('repeatVar', repeatVar)

    switch (repeatVarSet) {
      case constants.RepeatVarSetOne:
        if (!logic.varExists(repeatVar)) {
          logic.varCreate(repeatVar, 'Number', false, 'Repeat variable index')
        }

        logic.varSet(repeatVar, 1)
        traceMsg.key = repeatVar + '-0'
        traceMsg.fragments = [{ format: '', msg: 'Setting [' + repeatVar + '] to 1' }]
        traceMessage.addMessage(traceMsg)
        break

      case constants.RepeatVarSetPlusOne:
        const value = logic.varGet(repeatVar)

        logic.varSet(repeatVar, value + 1)
        traceMsg.key = repeatVar + '-' + value
        traceMsg.fragments = [{ format: '', msg: 'Incrementing [' + repeatVar + '] to ' + (value + 1) }]
        traceMessage.addMessage(traceMsg)
        break
    }
  }
})
