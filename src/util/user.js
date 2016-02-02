var Q = require('q');

/**
 * @module {Module} /util/user user
 * @parent api
 *
 * Module containing utilities for retrieving
 * information about the user.
 *
 */
module.exports = {
  /**
   * @property {Function} user.getCurrentUser
   * @parent user
   *
   * Get the current user based on the PHP session.
   */
  getCurrentUser() {
    var deferred = Q.defer();

    deferred.resolve('dev');

    return deferred.promise;
  }
};
