/**
 * @module {{}} author/models/template-comparator
 *
 * Provides functions that given a `key` and `direction` (`asc` or `desc`) will
 * generate a comparator function meant to be used to sort `Template.List` instances
 * through the sort plugin; the list will be sorted by the provided key and when
 * templates have the same value for the given key, `active` templates will be
 * sorted first.
 *
 * @option {function} number Sort by number attributes
 * @option {function} string Sort by string attributes
 * @option {function} moment Sort by momentjs attributes
 */
export default {
  number(key, direction) {
    return function(a, b) {
      if (direction === 'desc') {
        [a, b] = [b, a];
      }

      if (a.attr(key) === b.attr(key)) {
        return a.attr('active') ? -1 : (b.attr('active') ? -1 : 0);
      }

      return a.attr(key) - b.attr(key);
    };
  },

  string(key, direction) {
    return function(a, b) {
      if (direction === 'desc') {
        [a, b] = [b, a];
      }

      if (a.attr(key).localeCompare(b.attr(key)) === 0) {
        return a.attr('active') ? -1 : (b.attr('active') ? -1 : 0);
      }

      return a.attr(key).localeCompare(b.attr(key), {numberic: true});
    };
  },

  moment(key, direction) {
    return function(a, b) {
      if (direction === 'desc') {
        [a, b] = [b, a];
      }

      if (a.attr(key).isSame(b.attr(key))) {
        return a.attr('active') ? -1 : (b.attr('active') ? -1 : 0);
      }

      return a.attr(key).isAfter(b.attr(key)) ? -1 : 1;
    };
  }
};
