var Q = require('q');
var request = require('request');
var config = require('./config');

var debug = require('debug')('A2J:util/user');

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
   * @property {Function} user.nodeEnv
   * @parent user
   *
   * Process' NODE_ENV environment variable made available
   * to be overwritten for testing.
   */
  nodeEnv: process.env.NODE_ENV,

  /**
   * @property {Function} user.getCurrentUser
   * @parent user
   *
   * Get the current user based on the PHP session.
   */
  getCurrentUser({ cookieHeader }) {
    let deferred = Q.defer();
    let serverUrl = config.get('SERVER_URL');

    debug('getCurrentUser request', cookieHeader);

    let handleError = (msg) => {
      debug(msg);

      if (this.nodeEnv !== 'production') {
        debug('getCurrentUser hardcoding to dev');
        deferred.resolve('dev');
      }

      deferred.reject('Cannot authenticate current user');
    };

    request.post(serverUrl + '/js/author/CAJA_WS.php', {
      headers: {
        Cookie: cookieHeader
      },
      form: { cmd: "currentuser" }
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        try {
          body = JSON.parse(body);
          debug(`currentuser response ${body.username}`);
          deferred.resolve(body.username);
        } catch(err) {
          handleError(`getCurrentUser error ${err}`);
        }
      } else {
        let statusCode = response && response.statusCode;
        handleError(`getCurrentUser error (${statusCode}): ${error} `);
      }
    });

    return deferred.promise;
  }
};
