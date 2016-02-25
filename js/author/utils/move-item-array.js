import _inRange from 'lodash/inRange';

/**
 * @function move
 * @description
 *
 * Moves the item at the `from` index to the `to` index, it does not mutate
 * the provided array, it returns a new reference.
 *
 * Usage:
 *   @codestart
 *   let a = [1, 2, 3];
 *   let b = move(a, 0, 2);
 *
 *   assert.deepEqual(a, [1, 2, 3]);
 *   assert.deepEqual(b, [2, 3, 1]);
 *   @codeend
 *
 * @param {Array} array An array object
 * @param {Number} from Index of the element that will be moved
 * @param {Number} to Index at which element will be moved
 * @return {Array} The modified array
 */
export default function moveItem(array, from, to) {
  array = array || [];

  const length = array.length;

  from = parseInt(from, 10);
  to = parseInt(to, 10);

  if (_inRange(from, 0, length) && _inRange(to, 0, length)) {
    const copy = array.slice(0);
    const item = copy.splice(from, 1)[0];
    copy.splice(to, 0, item);
    return copy;
  } else {
    console.error('Indexes out of bound');
  }
}
