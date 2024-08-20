import DefineMap from 'can-define/map/map'
import A2JVariable from '@caliorg/a2jdeps/models/a2j-variable'
import { Gender, Hair, Skin } from '@caliorg/a2jdeps/avatar/colors'
import { hasValidVarType, getExpectedVarType } from '../pages-tab/components/page-fields/page-fields-helpers'

// with the existing Guide model that works with a different data structure.
export default DefineMap.extend('AppStateGuide', {
  variablesList: {
    get () {
      const vars = this.vars
      return A2JVariable.fromGuideVars(vars.serialize())
    }
  },

  guideGender: {
    type: Gender,
    default: Gender.defaultValue
  },

  avatarSkinTone: {
    type: Skin,
    default: Skin.defaultValue
  },

  avatarHairColor: {
    type: Hair,
    default: Hair.defaultValue
  },

  runHealthCheck () {
    for (const page of this.sortedPages) {
      for (const field of page.fields) {
        const variable = this.vars[field.name.toLowerCase()]
        const variableType = variable && variable.type.toLowerCase()
        const fieldHasProblem = !hasValidVarType(field.type, variableType)
        if (fieldHasProblem) {
          field.problem = `Field Type: (${field.type}) requires Variable Type: (${getExpectedVarType(field.type)})`
        }
      }
    }
  }
})
