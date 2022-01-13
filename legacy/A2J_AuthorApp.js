/*
  A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
  All Contents Copyright The Center for Computer-Assisted Legal Instruction

  Authoring App GUI
  Shell for the author app (the Main())
  04/15/2013

*/
// TODO: fix legacy imports, removing circular dependencies
// import $ from 'jquery'
// import 'jquery-ui/ui/button'
// import 'jquery-ui/ui/autocomplete'
// import 'jquery-ui/ui/draggable'
// import 'jquery-ui/ui/resizable'
// import 'jquery-ui/ui/dialog'
// import 'jquery-ui/ui/tooltip'

// import {gGuide, gEnv, gStartArgs, gGuideMeta, CONST} from './viewer/A2J_Types'
// import {versionString} from './viewer/A2J_Viewer'
// import {clauseAdd} from './A2J_Clauses'
// import {editButton} from './A2J_Tabs'
// import {localGuideStart} from './A2J_Debug'
// import {Languages} from './viewer/A2J_Languages'
// import {gPrefs} from './viewer/A2J_Prefs'

// File upload URLs for a guide's files and a new guide.
CONST.uploadURL = 'CAJA_WS.php?cmd=uploadfile&gid='
CONST.uploadGuideURL = 'CAJA_WS.php?cmd=uploadguide'

// Save interview every 5 minutes (if changed)
CONST.AutoSaveInterval = 5 * 60 * 1000

// Reference for the page editing dialog box
var SELECTED = 'item-selected'

/** @param {...}  status */
/** @param {...boolean}  showSpinner */
function setProgress (status, showSpinner) {
  if (typeof status === 'undefined') {
    status = ''
  }
  // if (status!==''){ trace('setProgress',status);}
  if (showSpinner === true) {
    status += CONST.AJAXLoader
  }
  $('#CAJAStatus').html(status)
}

// Contact the webservice to handle user signin, retrieval of guide lists and
// load/update/cloning guides.
function ws (data, results) {
  $.ajax({
    url: 'CAJA_WS.php',
    dataType: 'json',
    type: 'POST',
    data: data,
    success: function (data) {
      // trace(String.substr(JSON.stringify(data),0,299));
      results(data)
    },

    error: function (err, xhr) {
      dialogAlert({ title: 'Error loading file', body: xhr.responseText })
      setProgress('Error: ' + xhr.responseText)
    }
  })
}

function signin () {
  if (gEnv !== '' && gStartArgs.templateURL !== '') {
    // ### Debug start option
    localGuideStart()
    return
  }
  ws({cmd: 'login'},
    /** * @param {{userid,nickname}} data */
    function (data) {
      var gUserID = data.userid
      gGuideID = 0
      if (gUserID !== 0) { // ### Successful signin.
        $('#splash').hide()
        $('#cajaheader').removeClass('hidestart')
        $('#authortool').removeClass('hidestart')// .addClass('authortool').show();
      } else { // ### If user not logged in inform them and redirect to main site.
        var $d = $('#dialog-confirm')
        $d.html('<div class="alert alert-danger" role="alert"><span class="glyphicon-attention" style="float: left; margin: 0 7px 20px 0;" aria-hidden="true"></span>' +
              'Please login to your a2jauthor.org account first. Access to the A2J Author tool requires authentication first. To be authenticated, please fill out the survey that was emailed to you after you first registered for this site. If you have any problems after filling out the survey, please contact webmaster@a2jauthor.org.' +
              '</div>')
        $d.dialog({
          dialogClass: '',
          closeText: '',
          width: 400,
          height: 300,
          modal: true,
          buttons: {
            Login: function () {
              window.location = '/'
            }
          }
        })
      }
    }
  )
}

function styleSheetSwitch (theme) {
  // <link href="cavmobile.css" title="cavmobile" media="screen" rel="stylesheet" type="text/css" />
  // trace('styleSheetSwitch',theme);
  if (theme === 'A2J') {
    theme = 'jQuery/themes/' + theme.toLowerCase() + '/jquery-ui.css'
  } else {
    theme = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/' + theme.toLowerCase() + '/jquery-ui.css'
    // 1.8.23
  }
  $('link[title=style]').attr('href', theme)
}

function main () { // Everything loaded, now execute code.
  Languages.set(Languages.defaultLanguage)

  $('.authorenv').text(gEnv)
  $('#cajainfo').attr('title', versionString())

  // JPM expand/collapse all panel buttons on various tabs/popups
  $('.ecPanelButton') // SJG apply to all ec buttons operating on LEGEND tags

    .click(function () {
      var ecPanelButtonState = $(this).attr('data-state')

      if (ecPanelButtonState === 'collapsed') {
        $(this).parents('.tab-panel').find('legend ~ div').slideToggle(300)
        $(this).button({label: '<span class="glyphicon-expand" aria-hidden="true"></span> Expand All'})
        $(this).attr('data-state', 'expanded')
        $('fieldset').addClass('collapsed')
      } else {
        $(this).parents('.tab-panel').find('legend ~ div').slideDown(300)
        $(this).button({label: '<span class="glyphicon-collapse" aria-hidden="true"></span> Collapse All'})
        $(this).attr('data-state', 'collapsed')
        $('fieldset').removeClass('collapsed')
      }
    })

  // clone a table row
  $(document).on('click', '.editicons .ui-icon-circle-plus', function () {
    var $tbl = $(this).closest('table')
    var $row = $(this).closest('tr')
    var $rows = $tbl.find('tbody tr')
    var settings = $tbl.data('settings')

    if ($rows.length >= settings.max) {
      return
    }

    $row.clone(true, true)
      .attr('class', 'step-step' + ($rows.length + 1))
      .insertAfter($row).fadeIn()
      .data('record', $.extend({}, $row.data('record')))

    form.listManagerSave($(this).closest('table'))
  })

  // delete a table row
  $(document).on('click', '.editicons .ui-icon-circle-minus', function () {
    var $tbl = $(this).closest('table')
    var settings = $tbl.data('settings')

    if ($tbl.find('tbody tr').length <= settings.min) {
      return
    }

    $(this).closest('tr').remove()
    form.listManagerSave($tbl)
  })

  $('#vars_load').button({label: 'Load', icons: {primary: 'ui-icon-locked'}}).next().button({label: 'Save', icons: {primary: 'ui-icon-locked'}})
  $('#vars_load2').button({label: 'Load', icons: {primary: 'ui-icon-locked'}}).next().button({label: 'Save', icons: {primary: 'ui-icon-locked'}})

  $('#showlogic1').click(function () {
    gPrefs.showLogic = 1
    gGuide.noviceTab('tabsLogic', true)
    $('#showlogic2').removeClass('active')
    $('#showlogic1').addClass('active')
  })
  $('#showlogic2').click(function () {
    gPrefs.showLogic = 2
    gGuide.noviceTab('tabsLogic', true)
    $('#showlogic1').removeClass('active')
    $('#showlogic2').addClass('active')
  })

  $('#showtext1').click(function () {
    gPrefs.showText = 1
    gGuide.noviceTab('tabsText', true)
    $('#showtext2').removeClass('active')
    $('#showtext1').addClass('active')
  })
  $('#showtext2').click(function () {
    gPrefs.showText = 2
    gGuide.noviceTab('tabsText', true)
    $('#showtext1').removeClass('active')
    $('#showtext2').addClass('active')
  })

  // Ensure HTML possible for combo box pick list
  // https://github.com/scottgonzalez/jquery-ui-extensions/blob/master/autocomplete/jquery.ui.autocomplete.html.js
  $.extend($.ui.autocomplete.prototype, {
    _renderItem: function (ul, item) {
      return $('<li></li>')
        .data('item.autocomplete', item)
        // .append($("<a></a>")[this.options.html ? "html" : "text"](item.label))
        .append($('<a></a>').html(item.label))
        .appendTo(ul)
    }
  })

  // Tips
  // window.setTimeout(hovertipInit, 1);

  // Draggable
  $('.hotspot').draggable({ containment: 'parent' }).resizable().fadeTo(0.1, 0.9)

  $('#page-viewer').hide()
  $('#clause-add').button().click(clauseAdd)

  $('#bold').button({label: 'B'}).click(editButton)
  $('#italic').button({label: 'I'}).click(editButton)

  $('#indent').button({text: false, icons: {primary: 'ui-icon-arrowstop-1-e'}}).click(editButton)
  $('#outdent').button({text: false, icons: {primary: 'ui-icon-arrowstop-1-w'}}).click(editButton)

  $('#link').button({text: false, icons: {primary: 'ui-icon-link'}}).click(editButton)
  $('#popup').button({label: 'P'}).click(editButton)

  $(document).tooltip({
    items: '.htmledit a', // skip title for now [title]",
    content: function () {
      var element = $(this)
      if (element.is('[title]')) { return element.attr('title') }
      if (element.is('a')) { return element.attr('href') }
      return ''
    }
  })

  // call guideSave every 5 minutes
  setInterval(function () {
    if (gGuide) {
      window.guideSave()
    }
  }, CONST.AutoSaveInterval)

  signin()
}

window.onbeforeunload = function () {
  // Chrome no longer let's you customize the message
  // If we've got a guide loaded, ask if we want to leave.
  if (gGuide && gGuideID && (gGuideID !== 0)) {
    return 'Leave A2J Author?'
  } else {
    return null
  }
}

$(document).ready(main)

/* */
