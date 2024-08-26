import DefineMap from 'can-define/map/map'
import A2JVariable from '@caliorg/a2jdeps/models/a2j-variable'
import { Gender, Hair, Skin } from '@caliorg/a2jdeps/avatar/colors'

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
  }
})
