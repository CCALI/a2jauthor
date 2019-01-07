/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Authoring App Guides GUI
	Guide mangement including loading/saving/archive, display list.
	2015 04/15/2013, 	05/2014

*/
// TODO: fix legacy imports, removing circular dependencies
// import { gEnv, gStartArgs, gGuideMeta, CONST } from './viewer/A2J_Types'
// import { gotoTabOrPage } from './A2J_Pages'
// import { setProgress, ws } from './A2J_AuthorApp'
// import { parseXML_Auto_to_CAJA, exportXML_CAJA_from_CAJA } from './viewer/A2J_Parser'
// import { urlSplit, makestr } from './viewer/A2J_Shared'
// import { updateAttachmentFiles } from './A2J_Tabs'
// import {buildMap} from './A2J_Mapper'

/**
 * Parses data returned from the server
 * When guide file is finally downloaded, we can parse it and update the UI.
*/
function guideLoaded (data) {
  var cajaDataXML

  try {
    cajaDataXML = $(jQuery.parseXML(data.guide))
  } catch (e) {
    if (e.message) {
      var errorMessage = e.message.substr(0, e.message.indexOf(':'))
    }
    setProgress('')
    dialogAlert({
      title: 'Error loading  A2J Guided Interview with #' + data.gid,
      body: errorMessage +
		'<p>You can attempt to recover your A2J Guided Interview from the last successful save point by clicking the RECOVER button</p>',
      buttons: {
        RECOVER: function () {
          window.recoverSelectedGuide(data.gid)
          $(this).dialog('close')
        },
        CLOSE: function () {
          $(this).dialog('close')
        }
      }
    })
    return
  }

  gGuideID = data.gid
  window.gGuide = parseXML_Auto_to_CAJA(cajaDataXML)
  // used for piwik dashboard
  window.gGuide.authorId = data.userid
  gGuidePath = urlSplit(data.path).path

  $('#author-app').trigger('author:item-selected', gGuideID)

  guideStart('')
  setProgress('')
}

// Recover most current guide saved in Versions folder
function recoverSelectedGuide (guideId) {
  ws({ cmd: 'guiderecover', gid: guideId },
    function recoverCallback (data) {
      if (data.error) {
        window.dialogAlert({
          title: 'Unable to recover your A2J Guided Interview',
          body: 'Most likely there are no previously saved versions to recover. Please contact webmaster@a2jauthor.org for more information.'
        })
      } else {
        window.dialogAlert({
          title: 'A2J Guided Interview Recovered',
          body: 'You should now be able to open your A2J Guided Interview #' + data.gid + '.'
        })
      }
    }
  )
}
// Save current guide, but only if the XML has changed since last save to avoid upload overhead.
// If successful or unsuccessful save, call onFinished.
window.guideSave = function guideSave (onFinished) {
  if (gGuide !== null && gGuideID !== 0) {
    var xml = exportXML_CAJA_from_CAJA(gGuide)

    setProgress('Saving ' + gGuide.title, true)

    if (xml !== gGuide.lastSaveXML) {
      gGuide.lastSaveXML = xml

      // 01/14/2015 included JSON form of guide XML
      var guideJSON_str = guide2JSON_Mobile(gGuide)

      var params = {
        cmd: 'guidesave',
        gid: gGuideID,
        guide: xml,
        title: gGuide.title,
        json: guideJSON_str
      }
      ws(params, function (response) {
        if (typeof onFinished === 'function') onFinished()

        if ((makestr(response.error) !== '')) {
          setProgress(response.error)
        } else {
          setProgress('Saved')
          $('#author-app').trigger('author:guide-updated')
        }
      })
    } else {
      setProgress('No changes since last save')
      if (typeof onFinished === 'function') onFinished()
    }
  }
}

function loadNewGuidePrep () {
  $('.pageoutline').html('')
}

// When a guide is selected, the "pages" tab is automatically loaded by the
// `guideStart` method, but this happens outside of the scope of CanJS routing.
// Causing issues like https://github.com/CCALI/CAJA/issues/475, this method
// updates can.route properly.
function gotoPagesTab () {
  var pagesTabRef = 'pages'

  if (can && can.route) {
    var page = can.route.data.page

    if (page !== pagesTabRef) {
      can.route.data.attr('page', pagesTabRef)
    }
  } else {
    gotoTabOrPage('tabsPages')
  }
}

function guideStart (startTabOrPage) {
  var defaultTab = 'tabsPages' // 'tabsAbout';

  if (startTabOrPage === '') {
    startTabOrPage = defaultTab
  }

  $('#splash').hide()
  $('#authortool').removeClass('hidestart')// .addClass('authortool').show

  // $('#tabviews').tabs( { disabled:false});
  $('#tabsVariables .tabContent, #tabsLogic  .tabContent, #tabsSteps .tabContent, #tabsAbout .tabContent, #tabsClauses .tabContent, #tabsText .tabContent').html('')

  if (makestr(startTabOrPage) === '') {
    startTabOrPage = 'PAGE ' + gGuide.firstPage
  }

  if (startTabOrPage === 'tabsPages') {
    gotoPagesTab()
  } else {
    gotoTabOrPage(startTabOrPage)
  }

  window.updateTOC()

  // ### Upload file(s) to current guide
  $('#fileupload').addClass('fileupload-processing')

  if (gGuideID !== 0) {
    $('#fileupload').fileupload({
      url: CONST.uploadURL + gGuideID,
      dataType: 'json',
      done: function (e, data) {
        setTimeout(updateAttachmentFiles, 1)
      },

      progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10)
        $('#progress .bar').css('width',	progress + '%')
      }
    })

    updateAttachmentFiles()
  }

  buildMap()

  if (gEnv !== '' && gStartArgs.getDataURL !== '') {
    localGuidePlay()
  }
}

function blankGuide () {
  var A2J4_XML = '<?xml version="1.0" encoding="UTF-8" ?><!DOCTYPE Access2Justice_1><TEMPLATE><TITLE>My Interview</TITLE><AUTHOR>Anonymous</AUTHOR><SENDFEEDBACK>false</SENDFEEDBACK><DESCRIPTION>This is a description of my interview.</DESCRIPTION><JURISDICTION>Jurisdiction of my interview</JURISDICTION><LANGUAGE>en</LANGUAGE><AVATAR>blank</AVATAR><VERSION>7/24/2014</VERSION><A2JVERSION>2012-04-19</A2JVERSION><HISTORY>Interview created 7/24/2014</HISTORY><QUESTIONCOUNTER>4</QUESTIONCOUNTER><FIRSTQUESTION>1</FIRSTQUESTION><VARIABLES><VARIABLE SCOPE="Interview" NAME="User Gender" TYPE="MC"><COMMENT>User&apos;s gender will be used to display appopriate avatar.</COMMENT></VARIABLE><VARIABLE SCOPE="Interview" NAME="User Avatar" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client first name TE" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client middle name TE" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client last name TE" TYPE="Text" /></VARIABLES><STEPS><STEP NUMBER="0"><TEXT>ACCESS TO JUSTICE</TEXT></STEP><STEP NUMBER="1"><TEXT>DO YOU QUALIFY?</TEXT></STEP><STEP NUMBER="2"><TEXT>DO YOU AGREE?</TEXT></STEP><STEP NUMBER="3"><TEXT>YOUR INFORMATION</TEXT></STEP></STEPS><QUESTIONS><QUESTION ID="1" STEP="0" MAPX="13.25" MAPY="155.45" NAME="1-Introduction"><TEXT><P><FONT>This is the introduction.</FONT></P></TEXT><BUTTONS><BUTTON NEXT="2"><LABEL>Continue</LABEL></BUTTON></BUTTONS></QUESTION><QUESTION ID="2" STEP="0" MAPX="22.75" MAPY="401.85" NAME="2-Name"><TEXT><P><FONT>Enter your name.</FONT></P></TEXT><FIELDS><FIELD TYPE="text" ORDER="ASC"><LABEL>First:</LABEL><NAME>Client first name TE</NAME></FIELD><FIELD TYPE="text" OPTIONAL="true" ORDER="ASC"><LABEL>Middle:</LABEL><NAME>Client middle name TE</NAME></FIELD><FIELD TYPE="text" ORDER="ASC"><LABEL>Last:</LABEL><NAME>Client last name TE</NAME></FIELD></FIELDS><BUTTONS><BUTTON NEXT="3" ><LABEL>Continue</LABEL></BUTTON></BUTTONS></QUESTION><QUESTION ID="3" STEP="0" MAPX="498.9" MAPY="19.9" NAME="3-Gender"><TEXT>Choose your gender.</TEXT><FIELDS><FIELD TYPE="gender"><LABEL>Gender:</LABEL><NAME>User Gender</NAME></FIELD></FIELDS><BUTTONS><BUTTON NEXT="4"><LABEL>Continue</LABEL></BUTTON></BUTTONS></QUESTION><QUESTION ID="4" STEP="1" MAPX="510.15" MAPY="396.9" NAME="1-Question 1"><TEXT><P><FONT>Text of my first question goes here.</FONT></P></TEXT><BUTTONS><BUTTON NEXT="SUCCESS"><LABEL>Save</LABEL></BUTTON></BUTTONS></QUESTION></QUESTIONS><POPUPS /></TEMPLATE>'
  // 2015-06-29 Git Issue #276 - Buttons properly labeled with 'Continue'.

  /** @type {TGuide} */
  var guide = parseXML_Auto_to_CAJA($(jQuery.parseXML(A2J4_XML)))
  var today = jsDate2mdy(today2jsDate())
  guide.title = 'My Interview (' + today + ')'
  guide.version = today
  guide.notes = today + ' interview created.'
  return guide
}

// create blank guide internally, do guidesavenew to generate templates.json file.
function createBlankGuide () {
  var guide = blankGuide()
  // included JSON form of guide XML
  var guideJsonStr = window.guide2JSON_Mobile(guide)

  var saveAsParams = {
    gid: 0,
    cmd: 'guidesavenew',
    title: guide.title,
    guide: window.exportXML_CAJA_from_CAJA(guide),
    json: guideJsonStr
  }

  ws(saveAsParams, function (data) {
    if (data.error !== undefined) {
      setProgress(data.error)
    } else {
      var newgid = data.gid // new guide id
      ws({cmd: 'guide', gid: newgid}, guideLoaded)
    }
  })
}

// Open the currently selected guide (either double click or via Open button)
function openSelectedGuide (gid) {
  if (!gid) { return }

  var guideFile = $('[gid="' + gid + '"]').text()

  setProgress('Loading guide with ID: ' + gid, true)
  loadNewGuidePrep()
  $('#splash').hide()

  if (gid === 'a2j') {
    createBlankGuide()
  } else {
    ws({cmd: 'guide', gid: gid}, guideLoaded)
  }
}

function archiveSelectedGuide () {
  // 2014-08-28 Delete the currently selected guide
  var $li = $('a.guide.item-selected').first()
  var name = $li.find('span.title').text()

  var dialogMessage =
    '<div class="alert alert-danger">' +
      '<span class="glyphicon-attention"></span>' +
      'Would you like to delete ' + name + '?' +
    '</div>'

  dialogConfirmYesNo({
    title: 'Delete interview',
    message: dialogMessage,
    height: 300,
    name: name,
    Yes: function () {
      var gid = $li.attr('gid')

      if (gid) {
        window.ws({ cmd: 'guidearchive', gid: gid }, function () {
          $('#author-app').trigger('author:guide-deleted', gid)
        })
      }
    }
  })
}

/* */
