var Q = require('q');
var fs = require('fs');
var _ = require('lodash');
var del = require('del');

/**
 * @module {Module} /util/files files
 * @parent api
 *
 * Module containing utility functions for working
 * with JSON files.
 *
 */
module.exports = {
  /**
   * @property {Function} files.readJSON
   * @parent files
   *
   * Read a file as JSON.
   *
   * @param {String} path - the path to the file to be read.
   * @return {Promise} a Promise that will resolve to
   * the `JSON.parse`d content of the file.
   *
   * ## Use
   *
   * @codestart
   * files.readJSON({ path: 'foo.json' })
   *   .then(data => console.log(data));
   * @codeend
   */
  readJSON: function({ path }) {
    var deferred = Q.defer();

    fs.readFile(path, 'UTF-8', function(err, data) {
      if (!err) {
        try {
          deferred.resolve(JSON.parse(data));
        } catch(e) {
          deferred.reject(e);
        }
      } else {
        deferred.reject(err);
      }
    });

    return deferred.promise;
  },

  /**
   * @property {Function} files.writeJSON
   * @parent files
   *
   * Write data to a file with after converting it to JSON.
   *
   * @param {String} path - the path to the file.
   * @param {Object} data - the data to be written.
   * @return {Promise} a Promise that will resolve to
   * the content that was written to the file.
   *
   * ## Use
   *
   * @codestart
   * files.writeJSON({ path: 'foo.json', data: { hello: 'world' } })
   *   .then(data => console.log(data));
   * @codeend
   */
  writeJSON: function({ path, data }) {
    var deferred = Q.defer();

    fs.writeFile(path, JSON.stringify(data, null, '\t'), function(err) {
      if (!err) {
        try {
          deferred.resolve(data);
        } catch(e) {
          deferred.reject(e);
        }
      } else {
        deferred.reject(err);
      }
    });

    return deferred.promise;
  },

  /**
   * @property {Function} files.mergeJSON
   * @parent files
   *
   * Merge data with content of a JSON file and write
   * it back to the file. Optionally, replace an
   * entry in the JSON file based on a unique `replaceKey`.
   *
   * @param {String} path - the path to the file to be read/written.
   * @param {Object} data - the data to be merged in.
   * @param {String} replaceKey - a unique key used to overwrite
   * an object in the JSON file whose key value matches the input data.
   * If left undefined, data will be appended to data in file.
   * @return {Promise} a Promise that will resolve to
   * the content that was written to the file.
   *
   * ## Use
   *
   * @codestart
   * // foo.json -> [{"id":1},{"id":2,"foo":"bar"}]
   * files.mergeJSON({
   *     path: 'foo.json',
   *     data: { id: 3 }
   *   })
   *   .then(data => console.log(data));
   * // [{"id":1},{"id":2,"foo":"bar"},{"id":3}]
   * files.mergeJSON({
   *     path: 'foo.json',
   *     data: { id: 2, bar: 'baz' },
   *     replaceKey: 'id'
   *   })
   *   .then(data => console.log(data));
   * // [{"id":1},{"id":2,"bar":"baz"},{"id":3}]
   * @codeend
   */
  mergeJSON: function({ path, data, replaceKey }) {
    var deferred = Q.defer();

    this.readJSON({ path })
      .then(fileData => {
        if (!replaceKey) {
          return fileData.concat(data)
        } else {
          return _.map(fileData, o => {
            return (o[replaceKey] === data[replaceKey]) ? data : o;
          });
        }
      })
      .then(mergedData => this.writeJSON({ path, data: mergedData }))
      .then(data => deferred.resolve(data))
      .catch(err => deferred.reject(err));

    return deferred.promise;
  }
};