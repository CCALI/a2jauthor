import CanList from 'can-list'
import Model from 'can-model'
import _values from 'lodash/values'
import _toPlainObject from 'lodash/toPlainObject'

import 'can-map-define'

/**
 * @module A2JVariable
 * @parent api-models
 *
 * An A2J variable is an answer, or list of answers, to a guided interview
 * question. They are used when generating documents.
 */
let A2JVariable = Model.extend({
  id: 'name',

  makeFindOne () {
    return function (params, success, error) {
      let deferred = new can.Deferred()
      let gGuide = window.gGuide || {}
      let vars = gGuide.vars || {}
      let name = params.name || ''

      deferred.resolve(this.model(vars[name.toLowerCase()] || { }))

      return deferred.then(success, error)
    }
  },

  /**
   * @property {function} A2JVariable.fromGuideVars fromGuideVars
   * @param {Object} vars The raw vars object from `gGuide`
   * @return {A2JVariable.List} A variables list
   *
   * The guide (`window.gGuide`) object used in the author app, models the
   * variables as a key/value record where the key is the lowercase variable
   * name and the value is an object with variables properties (`name`,
   * `repeating` and `values`). This static method takes this object and
   * generates a collection where each item is an instance of `A2JVariable`.
   */
  fromGuideVars (vars) {
    // convert the array to TVariable objects to an array of raw Object,
    // otherwise the can.List constructor won't convert the TVariable objects
    // to Map instances.
    let values = _values(vars).map(_toPlainObject)
    return new A2JVariable.List(values)
  }
}, {

  define: {
    /**
     * @property {String} name
     *
     * The name of the variable. e.g. 'Client first name TE'
     */
    name: {
      value: ''
    },

    /**
     * @property {String} propertyName
     *
     * The object property name that the variable is stored under in
     * window.gGuide.vars
     */
    propertyName: {
      get () {
        let name = this.attr('name') || ''

        return name.toLowerCase()
      }
    },

    /**
     * @property {Boolean} repeating
     *
     * Whether the values contain multiple answers.
     */
    repeating: {
      value: false
    },

    /**
     * @property {can.List} values
     *
     * A one-based array of responses.
     */
    values: {
      value: CanList
    }
  }
})

export default A2JVariable
