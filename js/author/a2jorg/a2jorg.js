import $ from 'jquery'
import CanMap from 'can-map'
import Component from 'can-component'
import template from './a2jorg.stache'

/**
 * @property {can.Map} a2jorg-dashboard.ViewModel
 * @parent `<a2jorg-dashboard-page>`
 *
 * `<a2jorg-dashboard>`'s viewModel.
 * https://sparecycles.wordpress.com/2012/03/08/inject-content-into-a-new-iframe/
 *
 */
export const A2jorgVM = CanMap.extend('A2jorgVM', {
  getDashboard () {
    $.ajax({
      dataType: 'json',
      url: 'CAJA_WS.php',
      data: { cmd: 'currentuser' }
    })
      .done((userData) => {
        const authorId = userData.userid
        const token = userData.token
        const url = userData.a2j_url
        $.ajax({
          method: 'GET',
          url: url + authorId,
          beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + token) },
          success: (data) => {
            const iframe = document.getElementById('a2jorgiframe')
            iframe.contentWindow.contents = data
            iframe.src = 'javascript:window["contents"]'
          },
          error: (err) => { console.log(err) }
        })
      })
      .fail((xhr) => {
        console.error(xhr)
      })
  }
})

/**
 * @module {Module} viewer/author/a2jorg/ <a2jorg-dashboard>
 * @parent api-components
 *
 * This renders the html for the A2J Org dashboard interface
 *
 * ## Use
 *
 * @codestart
 *   <a2jorg-dashboard d-report></a2jorg-dashboard>
 * @codeend
 */
export default Component.extend({
  view: template,
  ViewModel: A2jorgVM,
  tag: 'a2jorg-dashboard',

  events: {
    inserted () {
      this.viewModel.getDashboard()
    }
  }
})
