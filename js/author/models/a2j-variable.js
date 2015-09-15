import Model from 'can/model/';
import List from 'can/list/';
import 'can/map/define/';

/**
 * @module A2JVariable
 * @parent api-models
 *
 * An A2J variable is an answer, or list of answers, to a guided interview
 * question. They are used when generating documents.
 */
export default Model.extend({
  id: 'name',

  makeFindOne: function() {
    return function(params, success, error) {
      let deferred = new can.Deferred();
      let gGuide = window.gGuide || {};
      let vars = gGuide.vars || {};
      let name = params.name || '';

      deferred.resolve(this.model(vars[name.toLowerCase()] || { }));

      return deferred.then(success, error);
    };
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
