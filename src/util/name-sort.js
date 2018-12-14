/**
 * @module {Module} /util/name-sort nameSort
 * @parent api
 *
 * Module containing utility functions to sort by name
 *
 */
module.exports = (a, b) => {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}
