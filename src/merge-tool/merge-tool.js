import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import naturalCompare from 'string-natural-compare/'
import template from './merge-tool.stache'
import Guide from '~/src/models/app-state-guide'
import cString from '@caliorg/a2jdeps/utils/string'
import A2JTemplate from '@caliorg/a2jdeps/models/a2j-template'
import Media from '~/src/models/media'

const formatPageTextCell = val => { // report.js helpers
  if (val) {
    // this preserves hard returns from interview while keeping text shorter
    val = val.replace(/(<br\s?\/>)/gi, '|').replace(/(<\/option>)/gi, ' | ').replace(/(<\/p>)/gi, ' | ')
  }
  return cString.decodeEntities(val)
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// guide wrapper that adds functionality for use in the merge tool such as converting to/from the generic recursive accordion data
export const MergeToolGuide = DefineMap.extend('MergeToolGuide', {
  gid: {
    default: undefined
  },
  guide: {
    default: undefined,
    value ({ lastSet, listenTo, resolve }) {
      listenTo('loadPromise', (ev, newVal) => {
        newVal && newVal.then(data => {
          const copy = new Guide(data.guide)
          // TODO: delete id because this should be a clone?
          resolve(copy)
        }) // todo: catch
      })

      listenTo(lastSet, resolve)
      resolve(lastSet.get())
    }
  },
  mediaPromise: {
    default: undefined,
    get () {
      const gid = this.gid
      if (gid && gid !== 'a2j') {
        return Media.findAll(gid)
      }
    }
  },
  media: {
    default: undefined,
    get (lastSet, resolve) {
      if (lastSet) {
        return lastSet
      }

      this.mediaPromise && this.mediaPromise.then(resolve)
    }
  },

  templatesPromise: {
    default: undefined,
    get () {
      const guideId = this.gid
      if (guideId && guideId !== 'a2j') {
        return A2JTemplate.findAll({ guideId })
      }
    }
  },

  templates: {
    default: undefined,
    get (lastSet, resolve) {
      if (lastSet) {
        return lastSet
      }

      this.templatesPromise && this.templatesPromise.then(resolve)
    }
  },
  loadPromise: {
    type: 'any'
  },
  load (gid) {
    // openSelectedGuide(gid) // legacy/A2J_Guides.js
    // -> calls: ws({ cmd: 'guide', gid: gid }, guideLoaded) // legacy/A2J_AuthorApp.js
    // guideLoaded is a callback that recieves xml version of the guide from the web service
    // then it parses it into json via parseXML_Auto_to_CAJA and sets a global 'gGuide'
    // TODO: similar path to what the main app does, as described in the comments above. ^
    // then return a promise that resolves to the guide pojo like the following (temporary mock) line
    // const loadPromise = fetch(new Request('./resources/' + gid + '.json')).then(response => response.json())

    let loadPromise

    if (gid === 'a2j') {
      const a2jGuide = window.blankGuide()
      loadPromise = Promise.resolve({ guide: a2jGuide })
    } else {
      this.gid = gid

      loadPromise = window.fetch('CAJA_WS.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: `cmd=guideandfiles&gid=${gid}`
      })
        .then(response => response.json())
        .then(data => {
          return {
            guide: window.parseXML_Auto_to_CAJA($(jQuery.parseXML(data.guide))),
            media: data.media,
            guideRoot: data.guideRoot
          }
        })
        .catch(err => console.error(err))
    }

    this.loadPromise = loadPromise
    return loadPromise
  },

  /**
   * @property {Function} mergeTool.ViewModel.prototype.guidePartToSortedArray guidePartToSortedArray
   * @parent mergeTool.ViewModel
   *
   * builds a list in natural sort order from a var or pages object on a guide
   */
  guidePartToSortedArray (guidePart, sortByProp = 'name') {
    const sortedList = []

    Object.keys(guidePart).forEach((partKey) => {
      sortedList.push(guidePart[partKey])
    })

    return sortedList.sort((a, b) => naturalCompare.caseInsensitive(a[sortByProp], b[sortByProp]))
  },

  /**
   * @property {Array} mergeTool.ViewModel.prototype.define.sortedVariableList sortedVariableList
   * @parent mergeTool.ViewModel
   *
   * sorted variable list for display
   */
  sortedVariableList: {
    get () {
      const guide = this.guide
      if (guide && guide.vars) {
        return this.guidePartToSortedArray(guide.vars)
      }
    }
  },

  sortedPages: {
    get () {
      const guide = this.guide
      if (guide && guide.pages) {
        return this.guidePartToSortedArray(guide.pages)
      }
    }
  },

  // converts a guide into a generic recursive structure that the checkbox accordion can render
  get accordionFromGuide () {
    const accordion = [
      {
        label: 'Interview Variables',
        expanded: true,
        details: [],
        children: [], // children are each objects in the same shape as this one
        value: undefined // value can be anything, it's just data to associate with the item
      },
      {
        label: 'Interview Steps and Pages',
        expanded: true,
        details: [],
        children: [],
        value: undefined
      },
      {
        label: 'PopUp Pages',
        expanded: true,
        details: [],
        children: [],
        value: undefined
      },
      {
        label: 'Media Files',
        expanded: true,
        details: [],
        children: [],
        value: undefined
      },
      {
        label: 'Templates',
        expanded: true,
        details: [],
        children: [],
        value: undefined
      }
    ]
    // first guide parts
    const guide = this.guide
    if (guide) {
      const vars = this.sortedVariableList
      accordion[0].children = vars.map(v => {
        return {
          label: v.name,
          details: [{
            label: `
              <b>Type</b> ${v.type}<br>
              <b>Repeating</b> ${v.repeating}<br>
              <b>Comment</b> ${v.comment}<br>
            `
          }],
          // children: [],
          value: {
            which: 'vars',
            key: v.name.toLowerCase(),
            value: v
          }
        }
      })

      const popupPages = []
      // loop through the sorted pages once
      const stepChildren = this.sortedPages.reduce((sc, page) => {
        // capture popup pages into its own list
        if (page.type === 'Popup') {
          popupPages.push({
            label: page.name,
            details: [{
              label: `
                <b>Notes:</b> ${formatPageTextCell(page.notes)}<br>
                <b>Text:</b> ${formatPageTextCell(page.text)}<br>
              `
            }],
            // children: [],
            value: {
              which: 'pages',
              key: page.name,
              value: page
            }
          })
          return sc
        }
        // else split the current page into its own array
        if (!sc[page.step]) {
          sc[page.step] = []
        }
        const fieldsDetail = {
          label: 'Fields',
          details: (page.fields || []).map(f => {
            return {
              label: `
                <b>Type:</b> ${f.type}<br>
                <b>Label:</b> ${f.label}<br>
                <b>Variable:</b> ${f.name}<br>
                <b>Invalid Prompt:</b> ${f.invalidPrompt}
              `
            }
          })
        }
        const buttonsDetail = {
          label: 'Buttons',
          details: (page.buttons || []).map(b => {
            return {
              label: `
                <b>Label:</b> ${b.label}<br>
                <b>Next:</b> ${b.next}
              `
            }
          })
        }
        const details = [{
          label: `
            <b>Notes:</b> ${formatPageTextCell(page.notes)}<br>
            <b>Text:</b> ${formatPageTextCell(page.text)}<br>
            <b>Learn More Prompt:</b> ${page.learn}<br>
            <b>Help Text:</b> ${formatPageTextCell(page.help)}<br>
            <b>Before Logic:</b> ${formatPageTextCell(page.codeBefore)}<br>
            <b>After Logic:</b> ${formatPageTextCell(page.codeAfter)}<br>
            <b>Logic Citation:</b> ${formatPageTextCell(page.codeCitation)}
          `
        }]
        if (fieldsDetail.details.length) { details.push(fieldsDetail) }
        if (buttonsDetail.details.length) { details.push(buttonsDetail) }
        sc[page.step].push({
          label: `Page ${page.name}`,
          details,
          // children: [],
          value: {
            which: 'pages',
            key: page.name,
            value: page
          }
        })
        return sc
      }, [])

      accordion[1].children = guide.steps.map(s => {
        const num = parseInt(s.number, 10)
        return {
          label: `Step ${num} - ${s.text}`,
          details: [],
          children: stepChildren[num],
          value: {
            which: 'steps',
            key: num,
            value: s
          }
        }
      })

      accordion[2].children = popupPages
    }
    // then media files
    const media = this.media
    if (media) {
      accordion[3].children = media.map(file => {
        return {
          label: `${file.name}`,
          details: [{
            label: `
            <b>Filename</b> ${file.filename}<br>
            <b>Extension</b> ${file.extension}<br>
            <b>Modified</b> ${file.modified}<br>
            <b>Size</b> ${formatBytes(file.size)}<br>
            `
          }],
          value: {
            which: 'media',
            key: file.filename,
            value: file
          }
        }
      })
    }
    // then template files
    const templates = this.templates
    if (templates) {
      accordion[4].children = templates.map(template => {
        const type = template.rootNode.tag === 'a2j-pdf' ? 'PDF' : 'Text'
        const filename = `template${template.templateId}`
        const status = template.active ? 'Active' : 'Deleted'

        return {
          label: `${template.title}`,
          details: [{
            label: `
            <b>Filename</b> ${filename}.json<br>
            <b>Type</b> ${type}<br>
            <b>Template Id</b> ${template.templateId}<br>
            <b>Status</b> ${status}<br>
            `
          }],
          value: {
            which: 'templates',
            key: filename,
            value: template
          }
        }
      })
    }

    return accordion
  },

  accordionValuesToGuidePartial (children, partial) {
    children.forEach(checkedValueChildrenObj => {
      // the 'value' from each item in accordionFromSourceGuide that was passed into the accordion
      const checkedValue = checkedValueChildrenObj.value
      // if we provided that value (the checkbox at the roots don't have values themselves in our case)
      if (checkedValue) {
        // destructure the 'value'
        const { which, key, value } = checkedValue
        // use the data from it to build up the partial guide
        partial[which][key] = value // this 'value' is the actual (===) variable/step/page from the source guide
      }
      // if there are children here, recursively destructure their values and merge them into the partial too
      if (checkedValueChildrenObj.children && checkedValueChildrenObj.children.length) {
        this.accordionValuesToGuidePartial(checkedValueChildrenObj.children, partial)
      }
    })
    // this partial will be merged into the target partial 1:1, depending on conflict resolutions
    return partial
  },

  // convert the generic [{value, children[]}] output from the checkbox accordion back into a (partial) guide
  guidePartialFromCheckedValues (checkedAccordionData) {
    return this.accordionValuesToGuidePartial(checkedAccordionData, {
      steps: {},
      vars: {},
      pages: {},
      media: {},
      templates: {}
    })
  }
})

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
  target: { default: () => new MergeToolGuide() },
  // on the right, a list of source guides to show if one isn't selected yet
  sources: {
    default: () => [],
    set: canModelGuideListToPOJOArraySetter
  },
  // search string that filters sources list
  sourcesFilter: 'string',
  // on the right, the selected guide from which we are checking boxes to bring its stuff into targetGuide
  source: { default: () => new MergeToolGuide() },
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
    const partials = this.mergeStack
    if (partials.length && target) {
      partials.forEach(p => {
        Object.assign(target.steps, p.steps)
        Object.assign(target.vars, p.vars)
        Object.assign(target.pages, p.pages)
      })
    }
    target.title = this.mergeTitle || target.title
    return new MergeToolGuide({ guide: new Guide(target) })
  },
  mergeTitle: {
    type: 'string',
    default: '',
    get (lsv) {
      const today = window.jsDate2mdy(window.today2jsDate())
      return lsv || `Merged Interview (${today})`
    }
  },

  // merge the selected values into the the target guide without any checks
  simpleMerge () {
    const sourceGuidePartial = this.sourceGuidePartial
    this.mergeStack.push(sourceGuidePartial)
    // this.interviewsPromise = undefined
    this.cancelMerge()
  },

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

    // Non-Overwriting Merge
    // update the sourceGuideParial so merging resolves as intended:
    // 1) var conflicts create a new var with 'zzz' prefix
    Object.keys(vars).forEach(k => {
      if (mergedTarget.guide.vars[k]) {
        let prefix = 'zz'
        let prefixk = ''
        do {
          prefix += 'z'
          prefixk = `${prefix} ${k}`
        } while (mergedTarget.guide.vars[prefixk] || vars[prefixk])
        vars[prefixk] = vars[k]
        vars[k].name = `${prefix} ${vars[k].name}`
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

    let newGuideUrl
    window.ws(saveNewGuideParams, function (data) {
      if (data.error !== undefined) {
        // TODO: setProgress(data.error)
        errors.push(data.error)
        console.error(data.error)
      } else {
        const newgid = data.gid // new guide id
        newGuideUrl = data.url // location of new guide for file copying
        guide.id = newgid
        if (typeof vm.reloadInterviews === 'function') {
          vm.reloadInterviews()
        }

        // TODO: successful merge process should be promise chain?
        const list = []
        vm.mergeStack.forEach(stackItem => {
          const media = stackItem.media
          const keys = media && Object.keys(media)
          if (keys.length) {
            keys.forEach(key => {
              const fileToCopy = media[key]
              const filePath = fileToCopy.path
              const fileName = fileToCopy.name
              if (filePath) {
                list.push({ fileName, filePath })
              }
            })
          }
        })

        // copy the list of files
        window.ws({
          cmd: 'copyfiles',
          fileList: list,
          targetPath: newGuideUrl
        }, function (data) {
          console.log(data)
        })

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
    formatPageTextCell
  }
})
