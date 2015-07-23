/**
 * @module {{}} author/utils/sort-comparator
 *
 * Provides functions that given a `key` and `direction` (`asc` or `desc`) will
 * generate a comparator function meant to be used to sort `can.List` instances
 * through the sort plugin. There are different functions based on the type of
 * the attribute to be sorted, e.g. `comparator.string` uses `String#localeCompare`
 * for the string comparison, there is also a `comparator.moment` which compares
 * momentjs objects. You'd use it like this:
 *
 * @codestart
 *   import List from 'can/list/';
 *   import comparator from 'author/utils/sort-comparator';
 *
 *   import 'can/list/sort/';
 *
 *   let posts = new List({title: 'foo bar', order: 5}, ....);
 *   post.attr('comparator', comparator.number('order', 'desc'));
 *
 *   // at this point posts should be sort desc by title
 * @codeend
 *
 * @option {function} number Sort by number attributes
 * @option {function} string Sort by string attributes
 * @option {function} moment Sort by momentjs attributes
 */
export default {

  number: function(key, direction) {
    if (direction === 'desc') {
      return function(a, b) {
        return b.attr(key) - a.attr(key);
      };
    } else {
      return function(a, b) {
        return a.attr(key) - b.attr(key);
      };
    }
  },

  string: function(key, direction) {
    if (direction === 'desc') {
      return function(a, b) {
        return b.attr(key).localeCompare(a.attr(key), {numberic: true});
      };
    } else {
      return function(a, b) {
        return a.attr(key).localeCompare(b.attr(key), {numberic: true});
      };
    }
  },

  moment: function(key, direction) {
    if (direction === 'desc') {
      return function(a, b) {
        return a.attr(key).isBefore(b.attr(key)) ? -1 : 1;
      };
    } else {
      return function(a, b) {
        return a.attr(key).isAfter(b.attr(key)) ? -1 : 1;
      };
    }
  }

};
