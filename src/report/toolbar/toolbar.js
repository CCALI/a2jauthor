import CanMap from 'can-map'
import Component from 'can-component'
import template from './toolbar.stache'

import 'can-map-define'

/**
 * @property {can.Map} reportToolbar.ViewModel
 * @parent `<report-toolbar>`
 *
 * `<report-toolbar>`'s viewModel.
 *
 */
export const ReportToolbarVM = CanMap.extend('ReportToolbarVM', {
  define: {
    /**
     * @property {String} reportToolbar.ViewModel.prototype.define.selectedReport selectedReport
     * @parent reportToolbar.ViewModel
     *
     * tracks and sends the selected report type to the `<report-page>` component
     */
    selectedReport: {},

    /**
     * @property {Boolean} report.ViewModel.prototype.define.hideAllGrades hideAllGrades
     * @parent report.ViewModel
     *
     * show fk text grades only when bad, or author selects hideAllGrades
     */
    hideAllGrades: {},

    /**
     * @property {String} report.ViewModel.prototype.define.gradesButtonText gradesButtonText
     * @parent report.ViewModel
     *
     * update show/hide button text
     */
    gradesButtonText: {
      value: 'Hide Text Grading',
      get () {
        return this.attr('hideAllGrades') === true ? 'Show Text Grading' : 'Hide Text Grading'
      }
    }
  }
})

/**
 * @module {function} components/report/toolbar/ <report-toolbar>
 * @parent <report-page>
 * @signature `<report-toolbar>`
 *
 * Displays buttons that allow user to choose and print a report.
 *
 * ## Use
 *
 * @codestart
 *  <report-toolbar {(hide-all-grades)}="hideAllGrades" {(selected-report)}="selectedReport"></report-toolbar>
 * @codeend
 */
export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: ReportToolbarVM,
  tag: 'report-toolbar',

  events: {
    '.select-full-report click': function () {
      this.viewModel.attr('selectedReport', 'fullReport')
    },

    '.select-text-report click': function () {
      this.viewModel.attr('selectedReport', 'textReport')
    },

    '.select-citation-report click': function () {
      this.viewModel.attr('selectedReport', 'citationReport')
    },

    '.hide-grades-toggle click': function () {
      const currentValue = this.viewModel.attr('hideAllGrades')
      this.viewModel.attr('hideAllGrades', !currentValue)
    },

    '.print-report click': function () {
      const reportElement = document.getElementById('print-report')
      const reportTitleElement = document.getElementsByClassName('guidetitle')[0]

      if (reportElement) {
        var printPreview = window.open('about:blank', 'print_preview')
        var printDocument = printPreview.document
        printDocument.open()

        printDocument.write('<!DOCTYPE html><html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css">' +
            '<style>' +
              'body { margin: 5px; }' +
              'fieldset { border: 1px solid #e0e0e0; margin: 0; padding: 7.5px; }' +
              'legend { display: block; width: auto; padding: 0 7.5px; margin:0; font-size: 18px; font-weight:300; color: #333333; border: none; line-height: inherit; }' +
              '.hide-section { display: none; }' +
              'p { margin: 0px 0px 2px 10px; }' +
              '.sub-legend { font-size: 16px; font-weight: 300; margin-top: 3px; }' +
              'label { margin-bottom: 0px; }' +
              '@media print {' +
              '.col-sm-1 {width:8%;  float:left;}' +
              '.col-sm-2 {width:16%; float:left;}' +
              '.col-sm-3 {width:25%; float:left;}' +
              '.col-sm-4 {width:33%; float:left;}' +
              '.col-sm-5 {width:42%; float:left;}' +
              '.col-sm-6 {width:50%; float:left;}' +
              '.col-sm-7 {width:58%; float:left;}' +
              '.col-sm-8 {width:66%; float:left;}' +
              '.col-sm-9 {width:75%; float:left;}' +
              '.col-sm-10{width:83%; float:left;}' +
              '.col-sm-11{width:92%; float:left;}' +
              '.col-sm-12{width:100%; float:left;}' +
              '}' +
            '</style>' +
            '</head><body>' +
            reportTitleElement.outerHTML + '<br>' +
            reportElement.outerHTML + '</body></html>')
        printDocument.close()
      }
    }

  }
})
