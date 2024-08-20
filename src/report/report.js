import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import stache from 'can-stache'
import template from './report.stache'
import pagePartial from './page-partial.stache'
import popupPartial from './popup-partial.stache'
import naturalCompare from 'string-natural-compare/'
import cString from '@caliorg/a2jdeps/utils/string'
import TextStatistics from '~/src/utils/text-statistics'

stache.registerPartial('page-partial', pagePartial)
stache.registerPartial('popup-partial', popupPartial)

const textStats = new TextStatistics()

/**
 * @property {can.Map} report.ViewModel
 * @parent `<report-page>`
 *
 * `<report-page>`'s viewModel.
 *
 */
export const ReportVM = DefineMap.extend('ReportVM', {
  parentGuide: {
    set (parentGuide) {
      if (parentGuide && !this.cloneMade) {
        const clonedGuide = new DefineMap()
        clonedGuide.updateDeep(parentGuide)
        this.guide = clonedGuide
        this.cloneMade = true
      }
      return parentGuide
    }
  },

  cloneMade: {
    type: 'boolean',
    default: false
  },

  /**
     * @property {Map} report.ViewModel.prototype.define.guide guide
     * @parent report.ViewModel
     *
     * local deep copy of the current guide from the app-state
     * this prevents the auto save from updating the report while it is being viewed
     */
  guide: {},

  /**
     * @property {String} report.ViewModel.prototype.define.selectedReport selectedReport
     * @parent report.ViewModel
     *
     * tracks and receives the selected report type from the `<report-toolbar>` component
     */
  selectedReport: {
    default: 'fullReport'
  },

  /**
     * @property {Boolean} report.ViewModel.prototype.define.buildingReport buildingReport
     * @parent report.ViewModel
     *
     * used to activate the 'building report' spinner
     * initial value function prevents spinner when no guide loaded
     */
  buildingReport: {
    default: function () {
      return !!window.gGuide
    }
  },

  /**
     * @property {Boolean} report.ViewModel.prototype.define.hideDefault hideDefault
     * @parent report.ViewModel
     *
     * whether to hide the default page properties based on report type
     */
  hideDefault: {
    get () {
      return this.selectedReport === 'textReport' || this.selectedReport === 'citationReport'
    }
  },

  /**
     * @property {Boolean} report.ViewModel.prototype.define.hideText hideText
     * @parent report.ViewModel
     *
     * whether to hide the page text properties, generally for translation
     */
  hideText: {
    get () {
      return this.selectedReport === 'citationReport'
    }
  },

  /**
     * @property {Boolean} report.ViewModel.prototype.define.hideCitation hideCitation
     * @parent report.ViewModel
     *
     * whether to hide the page citation properties, generally for yearly citation updates
     */
  hideCitation: {
    get () {
      return this.selectedReport === 'textReport'
    }
  },

  /**
     * @property {Promise} report.ViewModel.prototype.define.pagesPromise pagesPromise
     * @parent report.ViewModel
     *
     * used to resolve the building of report data and end the 'building report' spinner
     */
  pagesPromise: {
    get () {
      return new Promise((resolve) => {
        const guide = this.guide
        if (guide) {
          // TODO: figure out why building this blocks rendering of the initial stache
          // and remove the setTimeout
          setTimeout(() => {
            const pagesAndPopups = this.buildPagesByStep(guide.sortedPages, guide.steps)
            resolve(pagesAndPopups)
            this.buildingReport = false
          })
        }
      })
    }
  },

  /**
     * @property {Array} report.ViewModel.prototype.define.pagesAndPopups pagesAndPopups
     * @parent report.ViewModel
     *
     * a 2 element array containing an array of a2j pages, and an array of popup pages for display
     */
  pagesAndPopups: {
    get (last, resolve) {
      return this.pagesPromise
        .then(resolve)
    }
  },

  /**
     * @property {Array} report.ViewModel.prototype.define.pagesByStep pagesByStep
     * @parent report.ViewModel
     *
     * an array of steps containing naturally sorted pages by step number.
     */
  pagesByStep: {
    get () {
      const pagesAndPopups = this.pagesAndPopups
      return pagesAndPopups && pagesAndPopups[0]
    }
  },

  /**
     * @property {Array} report.ViewModel.prototype.define.popupPages popupPages
     * @parent report.ViewModel
     *
     * an array of naturally sorted popup pages.
     */
  popupPages: {
    get () {
      const pagesAndPopups = this.pagesAndPopups
      return pagesAndPopups && pagesAndPopups[1]
    }
  },

  /**
     * @property {Array} report.ViewModel.prototype.define.sortedVariableList sortedVariableList
     * @parent report.ViewModel
     *
     * sorted variable list for display
     */
  sortedVariableList: {
    get () {
      const guide = this.guide
      if (guide && guide.vars) {
        return this.getVariableList(guide.vars)
      }
    }
  },

  /**
     * @property {String} report.ViewModel.prototype.define.displayLanguage displayLanguage
     * @parent report.ViewModel
     *
     * current language formatted for display
     */
  displayLanguage: {
    get () {
      const locale = this.guide.language
      const languages = window.Languages ? window.Languages.regional : null
      if (locale && languages) {
        return `${languages[locale].Language} (${languages[locale].LanguageEN}) {${locale}}`
      }
    }
  },

  /**
     * @property {Array} report.ViewModel.prototype.define.fkGradeList fkGradeList
     * @parent report.ViewModel
     *
     * list of grades used to get overall interview reading grade level
     */
  fkGradeList: {
    Type: DefineList,
    default: () => new DefineList()
  },

  /**
     * @property {Number} report.ViewModel.prototype.define.fkOverallGrade fkOverallGrade
     * @parent report.ViewModel
     *
     * average of all interview text scores from the above list
     */
  fkOverallGrade: {

  },

  /**
     * @property {Boolean} report.ViewModel.prototype.define.hideAllGrades hideAllGrades
     * @parent report.ViewModel
     *
     * show fk text grades only when bad, or author selects hide grades from toolbar
     */
  hideAllGrades: {
    default: false
  },

  /**
   * @property {Function} report.ViewModel.prototype.hideGrade hideGrade
   * @parent report.ViewModel
   *
   * whether to hide the grading results
   */
  hideGrade (fkGrade) {
    return !fkGrade || this.hideAllGrades
  },

  /**
   * @property {Function} report.ViewModel.prototype.getOverallGrade getOverallGrade
   * @parent report.ViewModel
   *
   * computes and formats the overall interview reading grade level
   */
  getOverallGrade () {
    const fkGradeList = this.fkGradeList
    if (fkGradeList.length) {
      let gradeTotal = 0
      fkGradeList.forEach(function (grade) {
        gradeTotal += grade
      })
      return (gradeTotal / fkGradeList.length).toFixed(1)
    }
  },

  /**
   * @property {Function} report.ViewModel.prototype.getTextAlertClass getTextAlertClass
   * @parent report.ViewModel
   *
   * sets the background color based on the reading grade level
   */
  getTextAlertClass (fkGrade) {
    if (fkGrade) {
      return (fkGrade < 6
        ? 'alert-success'
        : (fkGrade < 9
            ? 'alert-warning'
            : 'alert-danger'))
    }
  },

  /**
   * @property {Function} report.ViewModel.prototype.getVariableList getVariableList
   * @parent report.ViewModel
   *
   * builds variable list in natural sort order
   */
  getVariableList (guideVariables) {
    const sortedList = []

    Object.keys(guideVariables).forEach((varName) => {
      sortedList.push(guideVariables[varName])
    })

    return sortedList.sort(function (a, b) { return naturalCompare.caseInsensitive(a.name, b.name) })
  },

  /**
   * @property {Function} report.ViewModel.prototype.getTextStats getTextStats
   * @parent report.ViewModel
   *
   *  reading grade stats for display
   *  uses https://www.npmjs.com/package/text-statistics
   */
  getTextStats (text) {
    const cleanText = textStats.cleanText(text) // removes html tags, double spaces, etc
    const fkGrade = textStats.fleschKincaidGradeLevel(cleanText)
    const colemanLiauIndex = textStats.colemanLiauIndex(cleanText)
    const wordCount = textStats.wordCount(cleanText)
    const averageWordsPerSentence = Math.round((textStats.averageWordsPerSentence(cleanText) * 10)) / 10 // one decimal place
    const alertClass = this.getTextAlertClass(fkGrade)

    // add this grade to the overall list of scores
    this.fkGradeList.push(fkGrade)

    return {
      fkGrade,
      colemanLiauIndex,
      wordCount,
      averageWordsPerSentence,
      alertClass
    }
  },

  /**
   * @property {Function} report.ViewModel.prototype.buildPagesByStep buildPagesByStep
   * @parent report.ViewModel
   *
   * builds 2 sorted arrays, pages and popups, from the existing sortedPages and steps Maps
   */
  buildPagesByStep (sortedPages, guideSteps) {
    const vm = this

    const pagesByStep = []
    const popupPages = []

    guideSteps.forEach(function (step) {
      pagesByStep.push({
        text: step.text,
        number: step.number,
        pages: []
      })
    })

    sortedPages.forEach(function (page) {
      page.textStats = page.text ? vm.getTextStats(page.text) : null
      page.learnStats = page.learn ? vm.getTextStats(page.learn) : null
      page.helpStats = page.help ? vm.getTextStats(page.help) : null

      if (page.type === 'Popup') {
        popupPages.push(page)
      } else {
        const stepNumber = parseInt(page.step)
        pagesByStep[stepNumber].pages.push(page)
      }
    })

    return [pagesByStep, popupPages]
  }
})

/**
 * @module {Module} viewer/author/report/ <report-page>
 * @parent api-components
 *
 * This component is rendered when user visits the report tab. For larger interviews
 * it shows a 'building report' spinner, then allows the user to select between the
 * default full report, text report, and citation report. The print button opens the
 * interview in a new tab, formatted for printing for translation tasks and troubleshooting.
 *
 * ## Use
 *
 * @codestart
 *   <report-page {guide}="guide" {(hide-all-grades)}="hideAllGrades" {(selected-report)}="selectedReport"></report-page>
 * @codeend
 */
export default Component.extend({
  view: template,
  ViewModel: ReportVM,
  tag: 'report-page',

  events: {
    '{fkGradeList} length': function () {
      const interviewGradeLevel = this.viewModel.getOverallGrade()
      this.viewModel.fkOverallGrade = interviewGradeLevel
    }
  },

  helpers: {
    formatVariableCell (val) {
      if (typeof val === 'boolean') {
        val = val.toString()
      }
      return val || '-'
    },

    formatPageTextCell (val) {
      if (val) {
        // this preserves hard returns from interview while keeping text shorter
        val = val.replace(/(<br\s?\/>)/gi, '|').replace(/(<\/option>)/gi, ' | ').replace(/(<\/p>)/gi, ' | ')
      }
      return cString.decodeEntities(val)
    },

    formatDefaultPrompt (val) {
      return (val === '') ? '<default invalid prompt>' : val
    },

    addOne (val) {
      return parseInt(val) + 1
    },

    alertGlyph (alertClass) {
      if (alertClass === 'alert-danger') {
        return 'glyphicon-attention'
      } else if (alertClass === 'alert-warning') {
        return 'glyphicon-info-circled'
      } else {
        return ''
      }
    }
  },

  leakScope: true
})
