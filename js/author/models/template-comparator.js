import moment from 'moment';
import _isNaN from 'lodash/isNaN';
import _isString from 'lodash/isString';

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

function tiebreaker(a, b) {
  if (a.attr('active') && !b.attr('active')) {
    return -1;
  } else if (b.attr('active') && !a.attr('active')) {
    return 1;
  } else {
    return 0;
  }
}

export default {
  number(key, direction) {
    return function(a, b) {
      let numberA = parseInt(a.attr(key), 10);
      let numberB = parseInt(b.attr(key), 10);

      // swap properties if sorted `desc`
      if (direction === 'desc') {
        [numberA, numberB] = [numberB, numberA];
      }

      // do nothing if properties are not valid numbers
      if (_isNaN(numberA) || _isNaN(numberB)) {
        return;
      }

      if (numberA === numberB) {
        return tiebreaker(a, b);
      } else {
        return numberA - numberB;
      }
    };
  },

  string(key, direction) {
    return function(a, b) {
      let stringA = a.attr(key);
      let stringB = b.attr(key);

      // swap properties if sorted `desc`
      if (direction === 'desc') {
        [stringA, stringB] = [stringB, stringA];
      }

      // do nothing if properties are not valid strings
      if (!_isString(stringA) || !_isString(stringB)) {
        return;
      }

      if (stringA.localeCompare(stringB, {numeric: true}) === 0) {
        return tiebreaker(a, b);
      } else {
        return stringA.localeCompare(stringB, {numeric: true});
      }
    };
  },

  moment(key, direction) {
    return function(a, b) {
      let momentA = a.attr(key);
      let momentB = b.attr(key);

      // swap properties if sorted `desc`
      if (direction === 'desc') {
        [momentA, momentB] = [momentB, momentA];
      }

      // do nothing if properties are not valid moment instances
      if (!moment.isMoment(momentA) || !moment.isMoment(momentB)) {
        return;
      }

      if (momentA.isSame(momentB)) {
        return tiebreaker(a, b);
      } else {
        return momentA.isAfter(momentB) ? -1 : 1;
      }
    };
  }
};
