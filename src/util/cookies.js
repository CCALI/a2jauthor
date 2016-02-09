/**
 * @module {Module} /util/cookies cookies
 * @parent api
 *
 * Module containing utility functions for working
 * with cookies.
 *
 */
module.exports = {
  /**
   * @property {Function} cookies.forwardCookies
   * @parent cookies
   *
   * Middleware function to pass cookies through params.cookies.
   */
  forwardCookies(req, res, next) {
    req.feathers.cookieHeader = req.headers.cookie;
    next();
  }
}
