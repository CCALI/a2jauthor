var Q = require('q');
var request = require('request');
var config = require('./config');
var url = require('url');

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
   * @property {Function} user.handleError
   * @parent user
   *
   * Error Handler.
   */
   handleError({ msg, serverURL, deferred }) {
    let hostname = url.parse(serverURL).hostname;

    if (hostname === 'localhost') {
      debug('getCurrentUser hardcoding to dev');
      deferred.resolve('dev');
    }

    deferred.reject('Cannot authenticate current user');
  },

  /**
   * @property {Function} user.getCurrentUser
   * @parent user
   *
   * Get the current user based on the PHP session.
   */
  getCurrentUser({ cookieHeader }) {
    let deferred = Q.defer();
    let serverURL = config.get('SERVER_URL');

    debug('getCurrentUser request', cookieHeader);

    request.post(serverURL + '/js/author/CAJA_WS.php', {
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
          this.handleError({
            msg: `getCurrentUser error ${err}`,
            serverURL,
            deferred
          });
        }
      } else {
        let statusCode = response && response.statusCode;
        this.handleError({
          msg: `getCurrentUser error (${statusCode}): ${error} `,
          serverURL,
          deferred
        });
      }
    });

    return deferred.promise;
  }
};
