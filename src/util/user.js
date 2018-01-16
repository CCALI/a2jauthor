const Q = require('q')
const request = require('request')
const config = require('./config')
const url = require('url')

const debug = require('debug')('A2J:util/user')

/**
 * @module {Module} /util/user user
 * @parent api
 *
 * Module containing utilities for retrieving
 * information about the user.
 *
 */
const user = {
  /**
   * @property {Function} user.handleError
   * @parent user
   *
   * Error Handler.
   */
  handleError ({ msg, serverURL, deferred, cookieHeader }) {
    const hostname = url.parse(serverURL).hostname

    if (hostname === 'localhost') {
      debug('getCurrentUser hardcoding to dev')
      deferred.resolve('dev')
    }

    deferred.reject('Cannot authenticate current user')
  },

  /**
   * @property {Function} user.getCurrentUser
   * @parent user
   *
   * Get the current user based on the PHP session.
   */
  getCurrentUser ({ cookieHeader }) {
    const deferred = Q.defer()
    const serverURL = config.get('SERVER_URL')

    debug('getCurrentUser request', cookieHeader)

    request.post(serverURL + '/js/author/CAJA_WS.php', {
      headers: {
        Cookie: cookieHeader
      },
      form: { cmd: 'currentuser' }
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          body = JSON.parse(body)
          debug(`currentuser response ${body.username}`)
          deferred.resolve(body.username)
        } catch (err) {
          this.handleError({
            msg: `getCurrentUser error ${err}`,
            serverURL,
            deferred,
            cookieHeader
          })
        }
      } else {
        const statusCode = response && response.statusCode
        this.handleError({
          msg: `getCurrentUser error (${statusCode}): ${error} `,
          serverURL,
          deferred,
          cookieHeader
        })
      }
    })

    return deferred.promise
  },

  middleware (req, res, next) {
    const cookieHeader = req.headers.cookie
    user.getCurrentUser({cookieHeader})
      .then(username => {
        req.user = {username}
        next()
      })
      .catch(error => next(error))
  }
}

module.exports = user
