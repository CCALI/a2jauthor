import DefineMap from 'can-define/map/map'
import Guide from '~/src/models/app-state-guide'
// import A2JTemplate from '@caliorg/a2jdeps/models/a2j-template'
import GuideFiles from '~/src/models/guide-files'
import naturalCompare from 'string-natural-compare/'
import { formatPageTextCell, formatBytes } from './helpers/helpers'

// guide wrapper that adds functionality for use in the merge tool such as converting to/from the generic recursive accordion data
export const MergeToolGuideVM = DefineMap.extend('MergeToolGuideVM', {
  gid: {
    default: undefined
  },
  guide: {
    default: undefined,
    value ({ lastSet, listenTo, resolve }) {
      listenTo('loadPromise', (ev, newVal) => {
        newVal && newVal.then(guide => {
          const copy = new Guide(guide)
          // TODO: delete id because this should be a clone?
          resolve(copy)
        }) // todo: catch
      })

      listenTo(lastSet, resolve)
      resolve(lastSet.get())
    }
  },
  guideFilesPromise: {
    get () {
      const gid = this.gid
      if (gid && gid !== 'a2j') {
        return GuideFiles.findAll(gid)
      }
    }
  },
  guideFiles: {
    type: 'any'
  },
  loadPromise: {
    type: 'any'
  },
  load (gid) {
    this.gid = gid
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
      loadPromise = Promise.resolve(a2jGuide)
    } else {
      let gfProm = this.guideFilesPromise || Promise.resolve({ media: [], templates: [] })

      loadPromise = gfProm.then(gf => {
        this.guideFiles = gf
        return window.fetch('CAJA_WS.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: `cmd=guide&gid=${gid}`
        })
      })
        .then(response => response.json())
        .then(data => window.parseXML_Auto_to_CAJA($(jQuery.parseXML(data.guide))))
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
    const media = this.guideFiles && this.guideFiles.media
    if (media) {
      accordion[3].children = media.map(file => {
        const sourceIndicator = file.gid == this.gid ? '' : ` from #${file.gid}`
        return {
          label: `${file.name}${sourceIndicator}`,
          details: [{
            label: `
              <b>Filename</b> ${file.filename}<br>
              ${file.rename ? `<b>Renamed</b> ${file.rename}<br>` : ''}
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
    const templates = this.guideFiles && this.guideFiles.templates
    if (templates) {
      accordion[4].children = templates.map(template => {
        const sourceIndicator = template.gid == this.gid ? '' : ` from #${template.gid}`
        return {
          label: `${template.name}${sourceIndicator}`,
          details: [{
            label: `
              <b>Filename</b> ${template.filename}<br>
              ${template.rename ? `<b>Renamed</b> ${template.rename}<br>` : ''}
              <b>Extension</b> ${template.extension}<br>
              <b>Modified</b> ${template.modified}<br>
              <b>Size</b> ${formatBytes(template.size)}<br>
              <b>PDF</b> ${template.pdf ? 'Yes' : 'No'}<br>
            `
          }],
          value: {
            which: 'templates',
            key: template.filename,
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

export default MergeToolGuideVM
