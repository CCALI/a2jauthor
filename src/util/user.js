const Q = require('q');
const request = require('request');
const config = require('./config');
const url = require('url');

const debug = require('debug')('A2J:util/user');

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
  handleError({ msg, serverURL, deferred, cookieHeader }) {
    const hostname = url.parse(serverURL).hostname;

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
    const deferred = Q.defer();
    const serverURL = config.get('SERVER_URL');

    debug('getCurrentUser request', cookieHeader);

    request.post(serverURL + '/app/js/author/CAJA_WS.php', { 
      headers: {
        Cookie: cookieHeader
      },
      form: { cmd: 'currentuser' }
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        try {
          body = JSON.parse(body);
          debug(`currentuser response ${body.username}`);
          deferred.resolve(body.username);
        } catch (err) {
          this.handleError({
            msg: `getCurrentUser error ${err}`,
            serverURL,
            deferred,
            cookieHeader
          });
        }
      } else {
        const statusCode = response && response.statusCode;
        this.handleError({
          msg: `getCurrentUser error (${statusCode}): ${error} `,
          serverURL,
          deferred,
          cookieHeader
        });
      }
    });

    return deferred.promise;
  }
};
