// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './logic-editor.stache'
import _unescape from 'lodash/unescape'

export const LogicEditor = DefineMap.extend('LogicEditor', {
  page: {},
  appState: {},

  get varList () {
    const vars = this.appState.guide.vars || {}
    return Object.keys(vars).map(k => vars[k].name)
  },

  get gotoList () {
    const pages = this.appState.guide.pages || {}
    return Object.keys(pages).map(k => pages[k].name)
  },

  label: {}, // "After"
  key: {}, // "codeAfter"

  displayedValue: {
    value (prop) {
      const { lastSet, listenTo, resolve } = prop
      prop.resolver = prop.resolver || ((val, md) => {
        val = this.codeFix(val)
        if (md && md.errors.length > 0) {
          const result = $('<div>').html(val)
          for (const e in md.errors) {
            const err = md.errors[e]
            $('BR:eq(' + (err.line) + ')', result).before(
              '<span class="text-danger"><span class="glyphicon-attention" aria-hidden="true"></span>' + err.text + '</span></span>'
            )
          }
          val = result.html()
        }
        resolve(val)
      })

      listenTo(lastSet, val => prop.resolver(val, this.metaData))
      listenTo('metaData', (ev, md) => prop.resolver(lastSet.value, md))
      prop.resolver(this.savedValue, this.metaData)
    }
  },

  savedValue: {
    value ({ listenTo, resolve }) {
      listenTo('displayedValue', function (ev, val) {
        val = this.codeFix(val).trim()
        this.page[this.key] = val
        resolve(val)
      })
      resolve(this.page[this.key])
    }
  },

  metaData: {
    value ({ listenTo, resolve }) {
      listenTo('savedValue', function (ev, val) {
        resolve(window.gLogic.translateCAJAtoJS(val))
      })
      resolve(window.gLogic.translateCAJAtoJS(this.savedValue)) // { js: [], errors: [] }
    }
  },

  showJS: {
    default: !!(window.gPrefs && window.gPrefs.showJS)
  },
  transpiled: {
    value (prop) {
      prop.resolver = prop.resolver || (md => prop.resolve('<BLOCKQUOTE class=Script>JS:<BR>' + md.js.join('<BR>') + '</BLOCKQUOTE>'))
      prop.listenTo('metaData', (ev, md) => prop.resolver(md))
      prop.resolver(this.metaData)
    }
  },

  plaintextPaste (ev) {
    if (document.execCommand) {
      ev.preventDefault()
      const text = ev.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
    }
  },

  // copied from legacy
  pasteFix: function (srchtml, ALLOWED_TAGS) { // 2014-11-06 Strip out HTML comments and any other unapproved code that Word usually adds.
    // TODO strip out other irrelevant code
    const jq = $('<div>' + (srchtml) + '</div>')
    $('SPAN', jq).remove()
    let html = jq.html() // ensure valid HTML tags
    html = ' ' + html.replace(/<!--(.|\s)*?-->/g, '') + ' ' // strip HTML comments
    const parts = html.split('<')
    html = parts[0] || ''
    for (const p in parts) {
      const part2 = parts[p].split('>')
      const ta = part2[0].toUpperCase()
      for (const t in ALLOWED_TAGS) {
        const tag = ALLOWED_TAGS[t]
        if (ta === tag || ta === '/' + tag) {
          html += '<' + ta + '>'
        } else if (ta.indexOf(tag + ' ') === 0) {
          if (tag === 'A') {
            // Only Anchor tags will allow attributes
            html += '<' + tag + part2[0].substr(1) + '>'
          } else {
            html += '<' + tag + '>'
          }
        }
      }
      html += part2[1] || ''
    }
    html = jQuery.trim(html.replace(/<BR>/gi, '<BR/>')) // Matched tags fix.
    // if (html!=srchtml) {trace(srchtml);trace(html);}
    return html
  },

  quoteFix: function (html) {
    if (RegExp.prototype.hasOwnProperty('unicode')) { // eslint-disable-line
      html = html.replace(new RegExp('[“”«»„“‟”❝❞〝〞〟＂]', 'gu'), '"') // eslint-disable-line
    }
    return html
  },

  // copied from legacy
  codeFix: function (html) { // Convert HTML into correctly formatted/line broken code.
    // Remove extraneous DIV markup due to copy/paste.
    // trace('codefix before',html);
    html = html.replace(/<BR/gi, '\n<BR').replace(/<DIV/gi, '\n<DIV')// preserve line breaks
    html = this.pasteFix(html, ['A'])
    html = this.quoteFix(html)
    html = html.replace(/[\n]/gi, '<BR/>')
    // always add trailing <br> for inline error message target
    html = html ? html = html + '<BR/>' : html
    // trace('codefix after',html);
    return html
  },

  cursorInNode: {},
  activeLine: { default: '' },
  cursorStartPos: { default: 0 },

  get unescapedActiveLine () {
    // converts things like "&gt;=" to ">=" so it matches what's rendered (so cursor position is accurate)
    return _unescape(this.activeLine || '')
  },

  get gotoActive () {
    return this.unescapedActiveLine.toLowerCase().indexOf('goto') === 0
  },

  get gotoFilterText () {
    return this.gotoActive ? this.unescapedActiveLine.replace(/^[^"]*"([^"<]*).*$/, '$1') : ''
  },

  updateGotoReference (newPageName) {
    const node = this.cursorInNode
    if (this.gotoActive && node) {
      if (node.nodeType === 3) { // text node
        node.data = `GOTO "${newPageName}"`
      }
    }
  },

  get varStart () {
    const varStart = this.unescapedActiveLine.substr(0, this.cursorStartPos).lastIndexOf('[')
    return (varStart === -1) ? -1 : (varStart + 1)
  },

  get varLen () {
    const subline = this.varStart > -1 ? this.unescapedActiveLine.substr(this.varStart) : ''
    const len = subline.indexOf(']')
    return len === -1 ? subline.length : len
  },

  get varActive () {
    return this.varStart > -1 && ((this.varStart + this.varLen) >= this.cursorStartPos)
  },

  get varFilterText () {
    return this.varActive ? this.unescapedActiveLine.substr(this.varStart, this.varLen) : ''
  },

  updateVarReference (newVarName) {
    const node = this.cursorInNode
    if (this.varActive && node) {
      if (node.nodeType === 3) { // text node
        const newLine = this.unescapedActiveLine.substr(0, this.varStart) + newVarName + this.unescapedActiveLine.substr(this.varStart + this.varLen)
        node.data = newLine
      }
    }
  },

  get matchedItems () {
    if (this.gotoFilterText) {
      return this.gotoList.filter(i => i.toLowerCase().indexOf(this.gotoFilterText.toLowerCase()) !== -1)
    } else if (this.varFilterText) {
      return this.varList.filter(i => i.toLowerCase().indexOf(this.varFilterText.toLowerCase()) !== -1)
    }
    return []
  },

  get unmatchedItems () {
    if (this.gotoActive) {
      return this.gotoFilterText ? this.gotoList.filter(i => i.toLowerCase().indexOf(this.gotoFilterText.toLowerCase()) === -1) : this.gotoList
    } else if (this.varActive) {
      return this.varFilterText ? this.varList.filter(i => i.toLowerCase().indexOf(this.varFilterText.toLowerCase()) === -1) : this.varList
    }
    return []
  },

  delayTimeout: { default: 0 },
  updateDisplayedValueASAP (el, waitThisTime) {
    // on blur of [contenteditable] element, set displayedValue after a delay in case suggestion interaction caused the blur
    clearTimeout(this.delayTimeout)
    if (waitThisTime || (document.activeElement && document.activeElement.parentElement.className === 'suggestions')) {
      // active element check allows user to tab through suggestions without finalizing editing state yet
      this.delayTimeout = setTimeout(() => this.updateDisplayedValueASAP(el), 250)
    } else if (!(document.activeElement && document.activeElement.hasAttribute('contenteditable'))) {
      // skip updating displayedValue if we re-focused the editor already, as it will blur again when author is done editing
      this.displayedValue = el.innerHTML
    }
  },

  // move the cursor to the end of our new insertion after it was updated
  setCursorPosition (newValueLength) {
    if (this.cursorInNode && this.cursorInNode.parentElement && this.cursorInNode.parentElement.closest('logic-editor')) {
      let pos = 0
      if (this.varActive) {
        pos = this.varStart + newValueLength
      } else if (this.gotoActive) {
        pos = 7 + newValueLength // `GOTO "`.length + newValueLength + `"`.length
      }
      const range = document.createRange()
      const sel = window.getSelection()

      range.setStart(this.cursorInNode, pos)
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
    }
  },

  updateReference (newValue) {
    if (this.varActive) {
      this.updateVarReference(newValue)
    } else if (this.gotoActive) {
      this.updateGotoReference(newValue)
    }
    if (document.activeElement) {
      const thisComponentEl = document.activeElement.closest('logic-editor')
      const contentEditableEl = thisComponentEl && thisComponentEl.querySelector('[contenteditable]')
      contentEditableEl && contentEditableEl.focus()
      this.setCursorPosition(newValue.length)
    }
    this.activeLine = ''
  },

  // update our tracking of where the cursor is
  updateCursorPosition (ev) {
    const { anchorOffset, anchorNode } = document.getSelection()
    if (anchorNode) {
      this.cursorInNode = anchorNode
      this.activeLine = anchorNode.textContent
      this.cursorStartPos = anchorOffset
    }
  }
})

export default Component.extend({
  tag: 'logic-editor',
  view: template,
  leakScope: false,
  ViewModel: LogicEditor
})
