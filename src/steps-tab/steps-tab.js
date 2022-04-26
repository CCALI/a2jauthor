import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './steps-tab.stache'
import constants from '~/src/models/constants'
import { TStep } from '~/legacy/viewer/A2J_Types'

const BoundObservableProxy = DefineMap.extend('ObservableProxy', {
  obj: {},
  key: {},
  bindTo: {},
  value: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.obj[this.key] = val
        resolve(val)
      })
      listenTo('bindTo', function (val) {
        resolve(this.obj[this.key])
      })
      resolve(this.obj[this.key])
    }
  }
})

export const StepsTabVM = DefineMap.extend('StepsTabVM', {
  // passed in via app.stache
  guide: {},
  appState: {},

  startAtValue: { // is the first step 1 or 0?
    type: 'number',
    default: function () {
      const step1 = (this.guide && this.guide.steps && this.guide.steps[0]) || {}
      return parseInt(step1.number || 0, 10)
    }
  },

  newBoundObservableProxy (obj, key, bindTo) {
    return new BoundObservableProxy({ obj, key, bindTo })
  },

  get startsAt0 () {
    return this.startAtValue === 0
  },

  toggleIntroStep (checked) {
    const startAtValue = checked ? 0 : 1
    this.updateAllStepNumbers(startAtValue)
    this.startAtValue = startAtValue
  },

  maxSteps: { type: 'number', default: constants.MAXSTEPS },

  numSteps: {
    default: '1',
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (numSteps) {
        numSteps = Math.min(Math.max(numSteps, 1), this.maxSteps)
        while (this.guide.steps.length < numSteps) {
          this.guide.steps.push(new TStep())
        }
        this.guide.steps.length = numSteps
        this.updateAllStepNumbers(this.startAtValue)
        resolve(numSteps + '')
      })
      this.updateAllStepNumbers(this.startAtValue)
      resolve((this.guide.steps.length || 1) + '')
    }
  },

  updateAllStepNumbers (startAtValue) { // sync legacy guide steps, the page step references, and save too
    const steps = this.guide.steps
    steps.forEach((s, i) => {
      const newValue = (i + startAtValue)
      s.number = newValue + ''
      window.gGuide.steps[i] = s
    })
    window.gGuide.steps.length = steps.length

    window.guideSave()
  },

  updateAllPageSteps (i1, i2) { // i1 and i2 are what indexes got swapped from rearranging
    // ... page.step is the index of steps array for what step it matches
    // PageStep = steps[page.step] ::: page.step != step.number
    const guide = this.guide
    const stepIndexs = guide.steps.map((s, i) => i)
    stepIndexs[i1] = i2
    stepIndexs[i2] = i1

    // all of the global pages and the local pages are the same (===) TPage
    // instances so we only have to update the step value in one list/array
    // they are also === instances between .pages and .sortedPages in both.
    guide.sortedPages.forEach(p => {
      if (p.type !== 'Popup') {
        p.step = stepIndexs[p.step]
      }
    })
  },

  startExitIsCollapsed: { type: 'boolean', default: false },
  toggleStartExitCollapse (legendEl) {
    $(legendEl).next('.row').slideToggle(300)
    this.startExitIsCollapsed = !this.startExitIsCollapsed
  },

  stepsIsCollapsed: { type: 'boolean', default: false },
  toggleStepsCollapse (legendEl) {
    $(legendEl).next('div').slideToggle(300)
    this.stepsIsCollapsed = !this.stepsIsCollapsed
  },

  canMoveStepUp (step) {
    this.numSteps // eslint-disable-line
    const si = this.guide.steps.indexOf(step)
    return si > 0
  },

  canMoveStepDown (step) {
    const si = this.guide.steps.indexOf(step)
    return si < (parseInt(this.numSteps) - 1)
  },

  moveStepUp (step) {
    if (this.canMoveStepUp(step)) {
      const si = this.guide.steps.indexOf(step)
      this.guide.steps.splice(si, 1)
      this.guide.steps.splice(si - 1, 0, step)
      this.updateAllStepNumbers(this.startAtValue)
      this.updateAllPageSteps(si, si - 1)
      this.startAtValue ^= 1
      this.startAtValue ^= 1
    }
  },

  moveStepDown (step) {
    if (this.canMoveStepDown(step)) {
      const si = this.guide.steps.indexOf(step)
      this.guide.steps.splice(si, 1)
      this.guide.steps.splice(si + 1, 0, step)
      this.updateAllStepNumbers(this.startAtValue)
      this.updateAllPageSteps(si, si + 1)
      this.startAtValue ^= 1
      this.startAtValue ^= 1
    }
  },

  // weakmap where keys are step objects from guide.steps array and the value is an array of pages assigned to that step
  stepPagesWeakMap: {},
  stepPagesLoaded: { type: 'boolean', default: false },

  stepPages (step) {
    const wm = this.stepPagesWeakMap || new WeakMap()
    const stepPages = wm.get(step) || []
    return stepPages
  },

  stepHasPages (step) {
    return this.stepPages(step).length > 0
  },

  stepDeleteLabel (step) {
    const stepPages = this.stepPages(step)
    if (stepPages.length) {
      return `Cannot Delete Step, Step has ${stepPages.length} Pages assigned`
    } else if (this.guide.steps.length <= 1) {
      return 'Cannot Delete, There must be at least one step'
    }
    return 'Delete Step'
  },

  canDeleteStep (step) {
    return this.guide.steps.length > 1 && !this.stepHasPages(step)
  },

  deleteStep (step) {
    if (this.canDeleteStep(step)) {
      const si = this.guide.steps.indexOf(step)
      this.guide.steps.splice(si, 1)
      this.numSteps = this.guide.steps.length + ''
      this.startAtValue ^= 1
      this.startAtValue ^= 1
    }
  },

  pickPageDialog (buttonEl, data) {
    window.form.pickPageDialog($(buttonEl), data)
  },

  startPPD (buttonEl) {
    const vm = this
    vm.pickPageDialog(buttonEl, {
      value: window.gGuide.firstPage,
      label: 'Starting Point: ',
      buttonText: 'Set Start Point',
      change: function (val) {
        window.gGuide.firstPage = val
        vm.guide.firstPage = val
      }
    })
  },

  exitPPD (buttonEl) {
    const vm = this
    vm.pickPageDialog(buttonEl, {
      value: window.gGuide.exitPage,
      label: 'Exit Point: ',
      buttonText: 'Set Exit Point',
      change: function (val) {
        window.gGuide.exitPage = val
        vm.guide.exitPage = val
      }
    })
  },

  connectedCallback () {
    const guide = this.guide
    if (guide) {
      const wm = new WeakMap()
      this.stepPagesWeakMap = wm
      guide.steps.forEach(s => wm.set(s, []))
      const pages = guide.sortedPages
      for (let i = 0; i < pages.length; i++) {
        const p = pages[i]
        if (p.type !== 'Popup') {
          wm.get(guide.steps[p.step]).push(p)
        }
      }
      this.stepPagesLoaded = true
    }
  }
})

export default Component.extend({
  tag: 'steps-tab',
  view: template,
  leakScope: false,
  ViewModel: StepsTabVM
})
