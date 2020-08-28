import $ from 'jquery'
import CanMap from 'can-map'
import Component from 'can-component'
import template from './a2j-analytics.stache'

/**
 * @property {can.Map} a2j-analytics-dashboard.ViewModel
 * @parent `<a2j-analytics-dashboard-page>`
 *
 * `<a2j-analytics-dashboard>`'s viewModel.
 * https://sparecycles.wordpress.com/2012/03/08/inject-content-into-a-new-iframe/
 *
 */
export const A2JAnalyticsVM = CanMap.extend('A2JAnalyticsVM', {
  getDashboard () {
    $.ajax({
      dataType: 'json',
      url: 'CAJA_WS.php',
      data: { cmd: 'currentuser' }
    })
      .done((userData) => {
        const authorId = userData.userid
        const sourceId = userData.sourceid
        const authorEmail = userData.author_email
        const guideId = window.gGuideID //userData.userid
        const token = userData.token
        const url = userData.analytics_url
        $.ajax({
          method: 'GET',
          url: url + '/' + authorId + '/' +  authorEmail +'/' + sourceId , // + authorId,
          beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + token) },
          success: (data) => {
            const iframe = document.getElementById('a2j-analyticsiframe')
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
 * @module {Module} viewer/author/a2j-analytics/ <a2j-analytics-dashboard>
 * @parent api-components
 *
 * This renders the html for the A2J Org dashboard interface
 *
 * ## Use
 *
 * @codestart
 *   <a2j-analytics-dashboard d-report></a2j-analytics-dashboard>
 * @codeend
 */
export default Component.extend({
  view: template,
  ViewModel: A2JAnalyticsVM,
  tag: 'a2j-analytics-dashboard',

  events: {
    inserted () {
      this.viewModel.getDashboard()
    }
  }
})
