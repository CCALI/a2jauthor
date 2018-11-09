import CanMap from 'can-map'
import Component from 'can-component'
import template from './demo.stache'
import A2JVariable from 'caja/author/models/a2j-variable'

import 'can-map-define'

const guideVars = {
  'user gender': {
    name: 'User Gender',
    type: 'Text',
    repeating: false,
    values: [null]
  },
  'user avatar': {
    name: 'User Avatar',
    type: 'Text',
    repeating: false,
    values: [null]
  },
  'client first name te': {
    name: 'Client first name TE',
    type: 'Text',
    repeating: false,
    values: [null]
  },
  'client middle name te': {
    name: 'Client middle name TE',
    type: 'Text',
    repeating: false,
    values: [null]
  },
  'client last name te': {
    name: 'Client last name TE',
    type: 'Text',
    repeating: false,
    values: [null]
  },
  'a2j version': {
    name: 'A2J Version',
    type: 'Text',
    comment: 'A2J Author Version',
    repeating: false,
    values: [null]
  }
}

let VarPickerDemoVM = CanMap.extend({
  define: {
    variables: {
      value () {
        return A2JVariable.fromGuideVars(guideVars)
      }
    }
  }
})

export default Component.extend({
  view: template,
  tag: 'varpicker-demo',
  ViewModel: VarPickerDemoVM,
  leakScope: true
})
