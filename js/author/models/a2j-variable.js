import List from 'can/list/';
import Model from 'can/model/';
import _values from 'lodash/object/values';

import 'can/map/define/';

/**
 * @module A2JVariable
 * @parent api-models
 *
 * An A2J variable is an answer, or list of answers, to a guided interview
 * question. They are used when generating documents.
 */
let A2JVariable = Model.extend({
  id: 'name',

  makeFindOne() {
    return function(params, success, error) {
      let deferred = new can.Deferred();
      let gGuide = window.gGuide || {};
      let vars = gGuide.vars || {};
      let name = params.name || '';

      deferred.resolve(this.model(vars[name.toLowerCase()] || { }));

      return deferred.then(success, error);
    };
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
  fromGuideVars(vars) {
    let list = new A2JVariable.List();

    // sort list using "natural string" sort.
    list.attr('comparator', function(a, b) {
      let an = a.attr('name');
      let bn = b.attr('name');

      return an.localeCompare(bn, {numeric: true});
    });

    list.replace(_values(vars));
    return list;
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
      get: function() {
        let name = this.attr('name') || '';

        return name.toLowerCase();
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
      value: List
    }
  }
});

export default A2JVariable;
