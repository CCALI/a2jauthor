import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './merge-tool.stache'
import Guide from '~/src/models/app-state-guide'
import { formatPageTextCell, formatBytes, pageVarString, renameVars } from './helpers/helpers'
import _findIndex from 'lodash/findIndex'

// guide wrapper that adds functionality for use in the merge tool such as converting to/from the generic recursive accordion data
import MergeToolGuideVM from './mege-tool-guide-vm'

const canModelGuideListToPOJOArraySetter = v => {
  // targets and sources lists are set from app.stache, It's currently an old can-model type list
  // TODO: remove this setter when GuideModel is upgraded
  if (v && v.length && v[0] && (typeof (v[v.length - 1].attr)) === 'function') {
    v = Array.prototype.map.call(v, g => {
      return ['id', 'owned', 'title', 'details', 'fileSize', 'lastModified'].reduce((pojo, key) => {
        pojo[key] = g.attr(key)
        return pojo
      }, {})
    })
  }
  return v
}

export const MergeToolVM = DefineMap.extend('MergeToolVM', {
  // set to false and it will close from app.stache binding
  open: {},
  // passed in from app.stache (source is in interviews-page), a function to reload interviews
  reloadInterviews: {},
  // set to undefined to refresh the interviews list
  // interviewsPromise: {},
  // on the left, a list of target guides to show if one isn't selected yet
  targets: {
    default: () => [],
    set: canModelGuideListToPOJOArraySetter
  },
  get blankAndTargets () {
    return [{ title: 'Blank Interview', id: 'a2j', fileSize: 2000, lastModified: '-' }, ...this.targets]
  },
  // search string that filters targets list
  targetsFilter: 'string',
  // on the left, clone of the target guide where the imported items are merging into
  target: { default: () => new MergeToolGuideVM() },
  // on the right, a list of source guides to show if one isn't selected yet
  sources: {
    default: () => [],
    set: canModelGuideListToPOJOArraySetter
  },
  // search string that filters sources list
  sourcesFilter: 'string',

  pageDependancyAutoChecker (page) {
    const mediaNames = {
      [page.helpImageURL]: true,
      [page.helpVideoURL]: true,
      [page.helpAudioURL]: true,
      [page.textAudioURL]: true
    }
    const savm = this.sourceAccordionVM
    const mediaAccordionList = savm && savm.children[3] && savm.children[3].children
    if (mediaAccordionList && mediaAccordionList.length) {
      mediaAccordionList.forEach(ma => {
        const name = ma && ma.value && ma.value.value && ma.value.value.name
        name && mediaNames[name] && ma.checkAll()
      })
    }

    const pageVars = pageVarString(page)
    const varAccordionList = savm && savm.children[0] && savm.children[0].children
    if (varAccordionList && varAccordionList.length) {
      varAccordionList.forEach(va => {
        const name = va && va.value && va.value.value && va.value.value.name
        name && pageVars.indexOf('%' + name.toLowerCase() + '%') !== -1 && va.checkAll()
      })
    }
  },

  // on the right, the selected guide from which we are checking boxes to bring its stuff into targetGuide
  source: {
    default: function () {
      return new MergeToolGuideVM({ pageCheckedCallback: this.pageDependancyAutoChecker.bind(this) })
    }
  },
  // root of the recursive viewmodel pulled up from the accordion-checkbox component in this component's stache template
  sourceAccordionVM: 'any',
  // convert the generic [{value, children[]}] output from the checkbox accordion back into a (partial) guide
  get sourceGuidePartial () {
    const sourceAccordionVM = this.sourceAccordionVM
    if (!sourceAccordionVM) {
      return undefined
    }
    return this.source.guidePartialFromCheckedValues(sourceAccordionVM.getCheckedValues())
  },

  cancelTarget () {
    this.target.assign({
      guide: undefined,
      loadPromise: undefined
    })
  },

  cancelMerge () {
    this.source.assign({
      guide: undefined,
      loadPromise: undefined
    })
  },

  // array of guidePartials that were merged onto the base target, in order
  mergeStack: { default: () => [] },
  get mergedTarget () {
    const target = this.target && this.target.guide && this.target.guide.serialize()
    let guideFiles = new DefineMap((this.target && this.target.guideFiles) || { media: [], templates: [] })
    guideFiles = guideFiles.serialize()

    const partials = this.mergeStack
    if (partials.length && target) {
      partials.forEach(p => {
        Object.assign(target.steps, p.steps)
        Object.assign(target.vars, p.vars)
        Object.assign(target.pages, p.pages)

        ;['media', 'templates'].forEach(mt => {
          const files = p[mt]
          files && Object.keys(files).forEach(key => {
            const file = (new DefineMap(files[key])).serialize()
            const override = _findIndex(guideFiles[mt], f => (f.rename || f.filename) === (file.rename || file.filename))
            if (override > -1) {
              guideFiles[mt][override] = file
            } else {
              guideFiles[mt].push(file)
            }
          })
        })
      })
    }
    target.title = this.mergeTitle || target.title
    return new MergeToolGuideVM({ guide: new Guide(target), guideFiles })
  },
  mergeTitle: {
    type: 'string',
    default: '',
    get (lsv) {
      const today = window.jsDate2mdy(window.today2jsDate())
      return lsv || `Merged Interview (${today})`
    }
  },

  // merge the selected values into the the target guide with minimal checks (overrides target)
  mergeSelected () {
    const sourceGuidePartial = this.sourceGuidePartial
    const { steps, pages } = sourceGuidePartial
    const mergedTarget = this.mergedTarget

    // Overwriting Non-Step-Gap Merge
    // update the sourceGuideParial so merging resolves as intended:
    // 1) var conflicts overwrite (name/etc)
    // 2) step conflicts overwrite (name/etc)
    // 3) new steps must be manipulated so the number/index doesn't leave a gap
    let safeMergeStepIndex = mergedTarget.guide.steps.length
    let safeMergeStepNumber = (parseInt(safeMergeStepIndex ? mergedTarget.guide.steps[safeMergeStepIndex - 1].number : -1, 10) + 1).toString(10)
    const safeSteps = {}
    const safePages = {}
    Object.keys(steps).forEach(k => {
      if (parseInt(k, 10) >= safeMergeStepIndex) {
        safeSteps[safeMergeStepIndex] = steps[k]
        const oldNumber = parseInt(steps[k].number, 10)
        // This step is getting a new number. Any pages we're merging in tied to this step need to be updated with the new 'step' value
        Object.keys(pages).forEach(p => {
          if (pages[p].step === oldNumber) {
            pages[p].step = parseInt(safeMergeStepNumber, 10)
            // keep a copy in a safe place
            safePages[p] = pages[p]
            // and don't check this page again for step value updates
            delete pages[p]
          }
        })
        safeSteps[safeMergeStepIndex].number = safeMergeStepNumber
        delete steps[k]
        // update the lowest index/number values so if another step comes in beyond range, it will be pulled down to a lower index too
        safeMergeStepIndex++
        safeMergeStepNumber = (parseInt(safeMergeStepNumber, 10) + 1).toString(10)
      } else {
        safeSteps[k] = steps[k]
      }
    })
    // put the pages with updated step values back onto the partial's pages object so they'll be merged
    Object.assign(pages, safePages)
    // replace the steps with only the verified non-gap set
    sourceGuidePartial.steps = safeSteps
    // 4) page conflicts overwrite (name/etc)

    this.mergeStack.push(sourceGuidePartial)

    // show list of sources again
    // this.interviewsPromise = undefined
    this.cancelMerge()
  },

  safeMergeSelected () {
    const sourceGuidePartial = this.sourceGuidePartial
    const { vars, steps, pages } = sourceGuidePartial
    const mergedTarget = this.mergedTarget
    const guideFiles = mergedTarget.guideFiles || { media: [], templates: [] }

    // provide a safe 'rename' property on the file obj if the incoming filename collides
    ;['media', 'templates'].forEach(mt => {
      const importFiles = sourceGuidePartial[mt]
      const importFilesList = importFiles && Object.keys(importFiles).map(key => importFiles[key])
      const combinedList = guideFiles[mt].concat(importFilesList)
      importFilesList.forEach(file => {
        const fileNameOnly = file.filename.replace(/\d/g, '')
        let fileNum = parseInt(file.filename.replace(/[^\d]/g, ''), 10) || 0
        while (
          _findIndex(
            combinedList,
            f => f !== file && (f.rename || f.filename) === (file.rename || file.filename)
          ) > -1
        ) {
          file.rename = fileNameOnly + (fileNum++)
        }
      })
    })

    // Non-Overwriting Merge
    // update the sourceGuideParial so merging resolves as intended:
    // 1) var conflicts create a new var with 'zzz' prefix
    const varRenameMap = {}
    Object.keys(vars).forEach(k => {
      if (mergedTarget.guide.vars[k]) {
        let prefix = 'zz'
        let prefixk = ''
        do {
          prefix += 'z'
          prefixk = `${prefix} ${k}`
        } while (mergedTarget.guide.vars[prefixk] || vars[prefixk])
        vars[prefixk] = vars[k]
        const newname = `${prefix} ${vars[k].name}`
        varRenameMap[vars[k].name] = newname
        vars[k].name = newname
        delete vars[k]
      }
    })
    // 2) steps are not copied over, instead a single new step is added and all pages go there
    const safeMergeStepIndex = mergedTarget.guide.steps.length
    const safeMergeStepNumber = (parseInt(safeMergeStepIndex ? mergedTarget.guide.steps[safeMergeStepIndex - 1].number : -1, 10) + 1).toString(10)
    const safeStep = { number: safeMergeStepNumber, text: 'zzz Merged' }
    Object.keys(steps).forEach(k => { delete steps[k] })
    steps[safeMergeStepIndex] = safeStep
    Object.keys(pages).forEach(k => {
      renameVars(pages[k], varRenameMap)
      pages[k].step = parseInt(safeMergeStepNumber, 10)
      // 3) page conflicts create a new page with 'zzz' prefix
      if (mergedTarget.guide.pages[k]) {
        let prefix = 'zz'
        let prefixk = ''
        do {
          prefix += 'z'
          prefixk = `${prefix} ${k}`
        } while (mergedTarget.guide.pages[prefixk] || pages[prefixk])
        pages[prefixk] = pages[k]
        pages[k].name = `${prefix} ${pages[k].name}`
        delete pages[k]
      }
    })

    this.mergeStack.push(sourceGuidePartial)

    // show list of sources again
    // this.interviewsPromise = undefined
    this.cancelMerge()
  },

  undoPreviousMerge () {
    this.mergeStack.pop()
  },

  saveMerged (mergedTarget) {
    const vm = this
    const errors = []
    const guide = mergedTarget.guide.serialize()
    delete guide.authorId
    const today = window.jsDate2mdy(window.today2jsDate())
    guide.title = this.mergeTitle || `Merged Interview (${today})`
    guide.version = today
    guide.notes = today + ' interview created.'
    // included JSON form of guide XML
    const guideJsonStr = window.guide2JSON_Mobile(guide)

    const saveNewGuideParams = {
      gid: 0,
      cmd: 'guidesavenew',
      title: guide.title,
      guide: window.exportXML_CAJA_from_CAJA(guide),
      json: guideJsonStr
    }

    let fileList = []
    const templateIds = []
    const gf = mergedTarget.guideFiles
    if (gf) {
      fileList = gf.media.concat(gf.templates).map(f => ({
        filename: f.filename,
        rename: f.rename || '',
        extension: f.extension,
        sourceGid: f.gid,
        ownerfolder: f.ownerfolder
      }))
      gf.templates.forEach(t => templateIds.push((t.rename || t.filename).replace(/.*(\d+)$/, '$1')))
    }

    // return console.log(templateIds, fileList)

    return window.ws(saveNewGuideParams, function (data) {
      if (data.error !== undefined) {
        // TODO: setProgress(data.error)
        errors.push(data.error)
        console.error(data.error)
      } else {
        const newgid = data.gid // new guide id
        // const newGuideUrl = data.url // location of new guide for file copying
        guide.id = newgid
        if (typeof vm.reloadInterviews === 'function') {
          vm.reloadInterviews()
        }

        if (fileList.length) {
          // copy the list of files
          // TODO: promise chain return, block UI while saving
          window.ws({
            cmd: 'copyfiles',
            gid: newgid,
            fileList,
            templateIds
          }, function (data) {
            console.log(newgid, data)
          })
        }

        // return to merge view
        vm.open = false
      }
    })
  }
})

export default Component.extend({
  tag: 'merge-tool',
  view: template,
  leakScope: false,
  ViewModel: MergeToolVM,
  helpers: {
    setSearchFilter (key, value) {
      this[key] = value
    },
    getSearchFilter (key) {
      return this[key]
    },
    samples(list)
    {
      return (list.guides || list).filter(guide => !guide.owned)
    },
    scrollTo(selector){

      const uploadedGuidePosition = $(selector).offset().top
      const navBarHeight = 140
      const scrollTo = uploadedGuidePosition - navBarHeight

      $('html,body').animate({ scrollTop: scrollTo }, 300)
    },
    filterGuideList (list = [], filter = '') {
      if (!filter) {
        return list
      }
      return (list.guides || list).filter(g => ((g.title || '').toLowerCase().includes(filter.toLowerCase()) || g.lastModified.includes(filter)))
    },
    parseInt (val, b = 10) {
      return parseInt(val, b)
    },
    formatVariableCell (val) {
      if (typeof val === 'boolean') {
        val = val.toString()
      }
      return val || '-'
    },
    formatFileSize: function (sizeInBytes) {
      sizeInBytes = sizeInBytes()
      const sizeInKB = Math.ceil(sizeInBytes / 1024)
      return sizeInKB ? `${sizeInKB}K` : ''
    },
    formatPageTextCell,
    formatBytes
  }
})
