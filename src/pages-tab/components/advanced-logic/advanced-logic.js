// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './advanced-logic.stache'
import { ckeFactory } from '../../helpers/helpers'

export const AdvancedLogic = DefineMap.extend('AdvancedLogic', {
  page: {},
  appState: {},

  ckeFactory,

  codeCheck: function (elt) {
    const $a2jLogicDiv = $(elt)

    // remove error state and previous messages
    $a2jLogicDiv.parent().removeClass('has-error')
    $('SPAN', $a2jLogicDiv).remove()

    const code = this.codeFix($a2jLogicDiv.html())
    $a2jLogicDiv.html(code)
    // trace('codeCheck',code);
    // TODO remove markup
    const script = window.gLogic.translateCAJAtoJS(code)
    if (script.errors.length > 0) {
      $a2jLogicDiv.parent().addClass('has-error')
      let e
      for (e in script.errors) {
        const err = script.errors[e]
        $('BR:eq(' + (err.line) + ')', $a2jLogicDiv).before(
          '<span class="text-danger"><span class="glyphicon-attention" aria-hidden="true"></span>' + err.text + '</span></span>'
        )
      }
    }
    let tt = ''
    let t = []
    if (window.gPrefs.showJS) { // print JavaScript
      t = []
      t.push('JS:')
      let l
      for (l = 0; l < script.js.length; l++) {
        t.push(script.js[l])
      }
      tt += ('<BLOCKQUOTE class=Script>' + t.join('<BR>') + '</BLOCKQUOTE>')
    }
    $('.errors', $a2jLogicDiv.closest('.editspan')).html(tt)
  },

  pasteFix: function (srchtml, ALLOWED_TAGS) { // 2014-11-06 Strip out HTML comments and any other unapproved code that Word usually adds.
    // TODO strip out other irrelevant code
    let html = $('<div>' + (srchtml) + '</div>').html() // ensure valid HTML tags
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

  codeFix: function (html) { // Convert HTML into correctly formatted/line broken code.
    // Remove extraneous DIV markup due to copy/paste.
    // trace('codefix before',html);
    html = html.replace(/<BR/gi, '\n<BR').replace(/<DIV/gi, '\n<DIV')// preserve line breaks
    html = this.pasteFix(html, ['A'])
    html = html.replace(/[\n]/gi, '<BR/>')
    // always add trailing <br> for inline error message target
    html = html ? html = html + '<BR/>' : html
    // trace('codefix after',html);
    return html
  },

  get legacySection () {
    return window.buildLogicFieldSet(this.page)
  }
})

export default Component.extend({
  tag: 'advanced-logic',
  view: template,
  leakScope: false,
  ViewModel: AdvancedLogic
})
