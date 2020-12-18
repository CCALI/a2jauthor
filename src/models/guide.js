import $ from 'jquery'
import Model from 'can-model'
import setupPromise from 'can-reflect-promise'

import 'can-map-define'

/**
 * @module {function} Guide
 * @inherits can.Model
 * @parent api-models
 *
 * The **Guide** model represents a sample interview or an interview created
 * by the logged in user.
 *
 *  @codestart
 *    Guide.findAll().then(function(guides) {
 *    });
 *  @codeend
 *
 */
const Guide = Model.extend('GuideModel', {
  parseModels: 'guides',
  findAll: function (params) {
    params = (params == null) ? {} : params
    params.cmd = 'guides'

    const def = $.Deferred()
    setupPromise(def)

    const reject = function (xhr, e, reason) {
      def.reject(new Error(reason))
    }

    const maybeResolve = function (result) {
      if (result.error) {
        def.reject(result.error)
      } else {
        def.resolve(result)
      }
    }

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'CAJA_WS.php',
      data: params
    })
      .then(maybeResolve, reject)

    return def.promise()
  },

  destroy (id) {
    const def = $.Deferred()
    setupPromise(def)

    const reject = function () {
      def.reject()
    }

    const maybeResolve = function (result) {
      if (result.error) {
        def.reject(result.error)
      } else {
        def.resolve(result)
      }
    }

    $.post({
      dataType: 'json',
      url: 'CAJA_WS.php',
      data: { gid: id, cmd: 'guidearchive' }
    })
      .then(maybeResolve, reject)

    return def.promise
  }
}, {
  define: {
    /**
     * @property {String} Guide.prototype.title title
     * @description The guide's title, it defaults to 'Untitled' if not set.
     */
    title: {
      type: 'string',
      value: 'Untitled',
      get (lastSet) {
        // mysql escapes apostrophes on GI titles, remove the escape \
        return lastSet.replace('\\', '')
      }
    },

    /**
     * @property {Number} Guide.prototype.fileSize fileSize
     * @description Size of the XMl file that describes the guide, in bytes.
     */
    fileSize: {
      type: 'number',
      get () {
        return this.attr('details.size')
      }
    },

    /**
     * @property {String} Guide.prototype.lastModified lastModified
     * @description Date when the last modification to the guide happened (e.g '2015-06-22 11:16:36').
     */
    lastModified: {
      type: 'string',
      get () {
        return this.attr('details.modified')
      }
    }
  }
})

Guide.List = Guide.List.extend({
  /**
   * @function Guide.List.prototype.owned owned
   * @signature `guides.owned()`
   * @return {Guide.List} List of guides owned (created) by the logged in user.
   */
  owned: function () {
    return this.filter(guide => guide.owned)
  },

  /**
   * @function Guide.List.prototype.samples samples
   * @signature `guides.samples()`
   * @return {Guide.List} List of sample guides stored in the server.
   */
  samples: function () {
    return this.filter(guide => !guide.owned)
  }
})

export default Guide
