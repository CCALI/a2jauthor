/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	A2J Parser for XML

	Parse native CAJA into CAJA structure
	Parses .a2j/xml XML into CAJA format

	02/20/2012
	06/2015

*/
// TODO: fix legacy imports, removing circular dependencies
// import { TGuide, gStartArgs, gGuideMeta, TAuthor, TStep, TClause, TPage, CONST, TButton, TField } from './A2J_Types'
// import { setProgress } from '../A2J_AuthorApp'
// import {loadNewGuidePrep} from '../A2J_Guides'
// import { makestr, textToBool, urlSplit, gJS2XML_SKIP, js2xml } from './A2J_Shared'
// import cString from 'caja/viewer/mobile/util/string'

function fixPath (file) {	// ### Keep fully qualified web path, otherwise default to file within guide's folder (no subfolders)
  // 04/30/2015 Map data files to the fileDataURL instead of guide's path.
  // File could be http://site/myfile or myfile or somepath/myfile
  if (file.indexOf('http') === 0) {	// Files starting with http or https are not modified.
    return file
  }

  var filesPath = gStartArgs.fileDataURL
  if (filesPath == '') {
    // 2015-06-10 If path not specified (likely for an Authoring installation), try to use guide's path.
    filesPath = gGuidePath
  }
  var fileFixed = filesPath + urlSplit(file).file
  // var fileFixed = (filesPath == '') ? gGuidePath+urlSplit(file).file : filesPath+urlSplit(file).file;
  // trace('fixPath',file,fileFixed, gStartArgs.fileDataURL);
  return fileFixed
}
function loadXMLList (opts) {	// Load pick list elements from XML file. e.g., county names
  // opts.elt, opts.data, opts.val
  var $select = $(opts.data)
  $($select, 'option:first').prepend('<option value="">Choose from this list</option>')
  $(opts.elt).html($select.html()).val(opts.val)
}

function loadXMLListExternal (opts) {	// Load a XML based pick list.
  // Load list from opts.url, default list value will be opts.val, and XML stored in opts.elt.
  $.ajax({
    url: fixPath(opts.url),
    dataType: 'text',
    timeout: gConfig.AJAXLoadingTimeout,
    error:
			/** * @this {{url}} */
			function (data, textStatus, thrownError) {
			  // dialogAlert({title:'Error loading external list',body:'Unable to load a list of items from '+this.url+"\n"+textStatus});
			  traceAlert('Unable to load a list of items from ' + this.url + '\n' + textStatus)
			 },
    success: function (data) {
      opts.data = data
      loadXMLList(opts)
    }
  })
}

/** @param {TPage} page The page to parse */
function page2JSON (page) {
  var PAGE = {
    _NAME:	page.name,
    _TYPE:	page.type,
    _STYLE:	page.style,
    _MAPX:	page.mapx,
    _MAPY:	page.mapy,
    _STEP:	page.step,
    _REPEATVAR:	page.repeatVar,
    _NESTED:	page.nested,
    _OUTERLOOPVAR: page.outerLoopVar,
    // _NEXTPAGE:	page.nextPage===''?gJS2XML_SKIP:page.nextPage,
    // _nextPageDisabled: page.nextPageDisabled===true ? true : gJS2XML_SKIP,
    // _alignText:	page.alignText==='' ? gJS2XML_SKIP : page.alignText,
    XML_TEXT:	page.text,
    XML_TEXTCITATION: page.textCitation,
    TEXTAUDIO:	page.textAudioURL,
    LEARN:	page.learn,
    XML_HELP:	page.help,
    XML_HELPCITATION: page.helpCitation,
    XML_HELPMEDIALABEL: page.helpMediaLabel,
    HELPAUDIO:	page.helpAudioURL,
    XML_HELPREADER:	page.helpReader,
    HELPIMAGE:	page.helpImageURL,
    HELPALTTEXT: page.helpAltText,
    HELPVIDEO:	page.helpVideoURL,
    BUTTONS:	[],
    FIELDS:	[],
    XML_CODEBEFORE:	page.codeBefore,
    XML_CODEAFTER:	page.codeAfter,
    XML_CODECITATION: page.codeCitation,
    XML_NOTES:	page.notes
  }
  var bi
  for (bi in page.buttons) {
    var b = page.buttons[bi]
    PAGE.BUTTONS.push({BUTTON: {
      LABEL:	b.label, // XML_LABEL
      _NEXT:	b.next,
      _URL:	b.url,
      _REPEATVAR:	b.repeatVar,
      _REPEATVARSET:	b.repeatVarSet,
      NAME:	b.name,
      VALUE:	b.value
    }})
  }
  var fi
  for (fi in page.fields) {
    var 	f = page.fields[fi]
    var FIELD = {
      _TYPE:	f.type,
      _ORDER:	f.order,
      _REQUIRED:	f.required, //= =true ? true : gJS2XML_SKIP,
      _MIN:	f.min,
      _MAX:	f.max,
      _MAXCHARS:	f.maxChars,
      _CALCULATOR:	f.calculator,
      LISTSRC:	f.listSrc,
      XML_LISTDATA:	f.listData,
      XML_LABEL:	f.label,
      NAME:	f.name,
      VALUE:	f.value,
      SAMPLE:	f.sample,
      XML_INVALIDPROMPT:	f.invalidPrompt
    }
    PAGE.FIELDS.push({FIELD: FIELD})
  }
  return PAGE
}

/** @param {TGuide} guide */
function exportXML_CAJA_from_CAJA (guide) {	// Convert Guide structure into XML
  var JSON = {GUIDE: {INFO: {AUTHORS: []}, PAGES: [], STEPS: [], VARIABLES: [], CLAUSES: [] }}

  JSON.GUIDE.INFO.authorId = guide.authorId
  JSON.GUIDE.INFO.tool = guide.tool
  JSON.GUIDE.INFO.toolversion = guide.toolversion
  JSON.GUIDE.INFO.avatar = guide.avatar
  JSON.GUIDE.INFO.guideGender = guide.guideGender
  JSON.GUIDE.INFO.avatarSkinTone = guide.avatarSkinTone
  JSON.GUIDE.INFO.avatarHairColor = guide.avatarHairColor
  JSON.GUIDE.INFO.completionTime = guide.completionTime
  JSON.GUIDE.INFO.XML_copyrights = guide.copyrights
  JSON.GUIDE.INFO.createdate = guide.createdate
  JSON.GUIDE.INFO.XML_credits = guide.credits
  JSON.GUIDE.INFO.XML_DESCRIPTION = guide.description
  JSON.GUIDE.INFO.emailContact = guide.emailContact
  JSON.GUIDE.INFO.jurisdiction = guide.jurisdiction
  JSON.GUIDE.INFO.language = guide.language
  JSON.GUIDE.INFO.modifydate = guide.modifydate
  JSON.GUIDE.INFO.XML_notes = guide.notes
  JSON.GUIDE.INFO.sendfeedback = guide.sendfeedback
  JSON.GUIDE.INFO.subjectarea = guide.subjectarea
  JSON.GUIDE.INFO.title = guide.title
  JSON.GUIDE.INFO.version = guide.version
  JSON.GUIDE.INFO.viewer = guide.viewer
  JSON.GUIDE.INFO.endImage = guide.endImage
  JSON.GUIDE.INFO.logoImage = guide.logoImage

  var i
  for (i in guide.authors) {
    var author = guide.authors[i]
    JSON.GUIDE.INFO.AUTHORS.push({
      AUTHOR: {
        NAME: author.name,
        TITLE: author.title,
        ORGANIZATION: author.organization,
        EMAIL: author.email}})
  }

  JSON.GUIDE.INFO.firstPage = guide.firstPage
  JSON.GUIDE.INFO.exitPage = guide.exitPage
  var si
  for (si in guide.steps) {
    var step = guide.steps[si]
    JSON.GUIDE.STEPS.push({
      STEP: {
        _NUMBER: step.number,
        // escape special chars, ex: &, for XML answer set
        XML_TEXT: escapeHtml(step.text)}})
  }
  var vi
  for (vi in guide.vars) {
    var v = guide.vars[vi]
    var VARIABLE = {
      _NAME: v.name,
      _TYPE: v.type,
      _REPEATING: ((v.repeating === true) ? v.repeating : gJS2XML_SKIP),
      _COMMENT: v.comment
    }
    JSON.GUIDE.VARIABLES.push({VARIABLE: VARIABLE})
  }
  var ci
  for (ci in guide.clauses) {
    var c = guide.clauses[ci]
    var CLAUSE = {
      _NAME: c.name,
      _COMMENT: c.comment,
      XML_TEXT: c.text
    }
    JSON.GUIDE.CLAUSES.push({CLAUSE: CLAUSE})
  }
  for (var pi in guide.pages) {
    if (guide.pages.hasOwnProperty(pi)) {
      JSON.GUIDE.PAGES.push({PAGE: page2JSON(guide.pages[pi])})
    }
  }
  var xml = '<?xml version="1.0" encoding="UTF-8" ?>' + js2xml('GUIDE', JSON.GUIDE)
  return xml
}

function parseXML2Page (PAGE, page) {
  page.xml = PAGE.xml()

  page.type = PAGE.attr('TYPE')
  page.style = makestr(PAGE.attr('STYLE'))
  if (page.type === CONST.ptPopup || page.type === 'Pop-up page') {
    page.type = CONST.ptPopup
    page.mapx = null
  } else {
    page.mapx = parseInt(PAGE.attr('MAPX'), 10)
    page.mapy = parseInt(PAGE.attr('MAPY'), 10)
  }
  page.repeatVar = makestr(PAGE.attr('REPEATVAR'))
  page.nested = textToBool(PAGE.attr('NESTED'))
  page.outerLoopVar = makestr(PAGE.attr('OUTERLOOPVAR'))
  // page.nextPage="";
  // page.nextPageDisabled = false;
  // page.alignText="";
  page.step = parseInt(PAGE.attr('STEP'), 10)
  page.text = PAGE.find('TEXT').xml()
  page.textCitation = makestr(PAGE.find('TEXTCITATION').xml())
  page.textAudioURL = makestr(PAGE.find('TEXTAUDIO').text())
  page.learn = makestr(PAGE.find('LEARN').text())
  page.help = makestr(PAGE.find('HELP').xml())
  page.helpCitation = makestr(PAGE.find('HELPCITATION').xml())
  page.helpMediaLabel = makestr(PAGE.find('HELPMEDIALABEL').xml())
  page.helpAudioURL = makestr(PAGE.find('HELPAUDIO').text())
  page.helpReader = makestr(PAGE.find('HELPREADER').xml())
  page.helpImageURL = makestr(PAGE.find('HELPIMAGE').text())
  page.helpAltText = makestr(PAGE.find("HELPALTTEXT").text())
  page.helpVideoURL = makestr(PAGE.find('HELPVIDEO').text())
  page.notes = makestr(PAGE.find('NOTES').xml())
  page.codeBefore = makestr(PAGE.find('CODEBEFORE').xml())
  page.codeAfter = makestr(PAGE.find('CODEAFTER').xml())
  page.codeCitation = makestr(PAGE.find('CODECITATION').xml())

  PAGE.find('BUTTONS > BUTTON').each(function () {
    var button = new TButton()
    button.label = jQuery.trim($(this).find('LABEL').text())
    button.next = makestr($(this).attr('NEXT'))
    button.url = makestr($(this).attr('URL'))
    button.repeatVar = makestr($(this).attr('REPEATVAR'))
    button.repeatVarSet = makestr($(this).attr('REPEATVARSET'))
    button.name = jQuery.trim($(this).find('NAME').xml())
    button.value = jQuery.trim($(this).find('VALUE').xml())
    page.buttons.push(button)
  })
  PAGE.find('FIELDS > FIELD').each(function () {
    var field = new TField()
    var $field = $(this)
    field.type = $field.attr('TYPE')
    field.required = textToBool($field.attr('REQUIRED'), true)
    field.order = makestr($field.attr('ORDER'))
    field.label = makestr(jQuery.trim($field.find('LABEL').xml()))
    field.name = jQuery.trim($field.find('NAME').xml())
    field.value = makestr(jQuery.trim($field.find('VALUE').xml()))
    field.sample = makestr(jQuery.trim($field.find('SAMPLE').xml()))
    field.min = makestr($field.attr('MIN'))// could be a number or a date so don't convert to number
    field.max = makestr($field.attr('MAX'))
    field.maxChars = makestr($field.attr('MAXCHARS'))
    field.calculator = textToBool($field.attr('CALCULATOR'))
    field.invalidPrompt = makestr(jQuery.trim($field.find('INVALIDPROMPT').xml()))
    field.invalidPromptAudio = makestr(jQuery.trim($field.find('INVALIDPROMPTAUDIO').xml()))

    field.listSrc =	makestr($field.find('LISTSRC').xml())
    if (field.listSrc === '') {
      field.listData =	$field.find('LISTDATA').xml()
    }

    page.fields.push(field)
  })
  return page
}

function parseXML_CAJA_to_CAJA (GUIDE) // GUIDE is XML DOM
{	// Parse parseCAJA
  var guide = new TGuide()

  var INFO = $('INFO', GUIDE)
  guide.tool =			makestr(INFO.children('TOOL').text())
  guide.toolversion = makestr(INFO.children('TOOLVERSION').text())
  guide.avatar =			makestr(INFO.children('AVATAR').text())
  switch (guide.avatar) {
    case 'blank':
    case 'avatar1':
      guide.avatar = 'avatar1'
      break
    case 'tan':
    case 'avatar2':
      guide.avatar = 'avatar2'
      break
    case 'tan2':
    case 'avatar3':
      guide.avatar = 'avatar3'
      break
    default:
      guide.avatar = 'avatar1'
  }
  guide.avatarSkinTone = makestr(INFO.children('AVATARSKINTONE').text())
  guide.avatarHairColor = makestr(INFO.children('AVATARHAIRCOLOR').text())
  guide.guideGender =	makestr(INFO.children('GUIDEGENDER').text())
  guide.completionTime = makestr(INFO.children('COMPLETIONTIME').text())
  guide.copyrights =		makestr(INFO.children('COPYRIGHTS').xml())
  guide.createdate =		makestr(INFO.children('CREATEDATE').text())
  guide.credits =		makestr(INFO.children('CREDITS').xml())
  guide.description =	makestr(INFO.children('DESCRIPTION').xml())
  guide.jurisdiction =	makestr(INFO.children('JURISDICTION').text())
  guide.language =		makestr(INFO.children('LANGUAGE').text())
  guide.modifydate =		makestr(INFO.children('MODIFYDATE').text())
  guide.notes =			makestr(INFO.children('NOTES').xml())
  guide.sendfeedback =	textToBool(INFO.children('SENDFEEDBACK').text(), false)
  guide.emailContact =	makestr(INFO.children('EMAILCONTACT').text())
  guide.subjectarea = makestr(INFO.children('SUBJECTAREA').text())
  guide.title =			INFO.children('TITLE').text()
  guide.version =			makestr(INFO.children('VERSION').text())
  guide.viewer =			makestr(INFO.children('VIEWER').text())
  guide.logoImage =		makestr(INFO.children('LOGOIMAGE').text())
  guide.endImage =		makestr(INFO.children('ENDIMAGE').text())
  guide.authors = []

  GUIDE.find('AUTHORS > AUTHOR').each(function () {
    var AUTHOR = $(this)
    var author = new TAuthor()
    author.name = AUTHOR.find('NAME').text()
    author.title = AUTHOR.find('TITLE').text()
    author.organization = AUTHOR.find('ORGANIZATION').text()
    author.email = AUTHOR.find('EMAIL').text()
    guide.authors.push(author)
  })

  guide.firstPage = makestr(GUIDE.find('FIRSTPAGE').text())
  guide.exitPage = makestr(GUIDE.find('EXITPAGE').text())
  GUIDE.find('STEP').each(function () {
    var STEP = $(this)
    var step = new TStep()
    step.number = STEP.attr('NUMBER')
    // convert escaped XML special chars ex: &amp;
    step.text = decodeEntities(STEP.find('TEXT').xml())
    guide.steps.push(step)
	})
  // Parse pages into book.pages[] records.
  GUIDE.find('VARIABLES > VARIABLE').each(function () {
    var VARIABLE = $(this)
    // var v = new TVariable();
    // v.name=VARIABLE.attr("NAME");
    // v.type=VARIABLE.attr("TYPE");
    // v.repeating = textToBool(VARIABLE.attr('REPEATING'),false);
    guide.varCreate(VARIABLE.attr('NAME'), VARIABLE.attr('TYPE'), textToBool(VARIABLE.attr('REPEATING'), false), makestr(VARIABLE.attr('COMMENT')))
    // v.traceLogic('Create variable');
    // guide.vars[v.name.toLowerCase()]=v;
	})
  guide.varCreateInternals()

  /*
	GUIDE.find("POPUP").each(function() {//TODO discard unused popups
		var POPUP = $(this);
		var popup = new TPopup();
		popup.id=POPUP.attr("ID");
		popup.name=POPUP.attr("NAME");
		popup.text=POPUP.find("TEXT").xml();
		guide.popups[popup.id]=popup;
	}); */
  GUIDE.find('CLAUSES > CLAUSE').each(function () {
    var CLAUSE = $(this)
    var clause = new TClause()
    clause.name = CLAUSE.attr('NAME')
    clause.comment = makestr(CLAUSE.attr('COMMENT'))
    clause.text = makestr(CLAUSE.find('TEXT').xml())
    guide.clauses[clause.name.toLowerCase()] = clause
  })
  GUIDE.find('PAGES > PAGE').each(function () {
    var PAGE = $(this)
    var page = guide.addUniquePage(PAGE.attr('NAME'))
    parseXML2Page(PAGE, page)
  })

  return guide
}
function page2XML (page)/* return XML */
{
  return '<?xml version="1.0" encoding="UTF-8" ?>' + js2xml('PAGE', page2JSON(page))
}

function pageFromXML (xml)/* return TPage */
{
  var $xml = $(jQuery.parseXML(xml))
  var PAGE = $('PAGE', $xml)
  var page = new TPage()
  parseXML2Page(PAGE, page)
  return page
}

/** @param {string} guideFile */
/** @param {string} startTabOrPage */
// Load guide file and start on specified page
function loadGuideFile (guideFile, startTabOrPage) {
  if (guideFile === '') {
    $('#splash').empty()
    dialogAlert({title: 'No guide file specified'})
    return
  }
  // this global function is defined in A2J_Guides.js
  loadNewGuidePrep()

  window.setTimeout(function () {
    $.ajax({
      url: guideFile,
      dataType: 'xml', // IE will only load XML file from local disk as text, not xml.
      timeout: gConfig.AJAXLoadingTimeout,
      error:
					/** * @this {{url}} */
					function (data, textStatus, thrownError) {
					  $('#splash').empty()
					  dialogAlert({title: 'Error occurred loading file', body: 'Unable to load XML from ' + guideFile + '\n' + textStatus})
					},
      success: function (data) {
        var cajaDataXML
        cajaDataXML = data
        cajaDataXML = $(cajaDataXML)
        // global variable guide
        gGuide = parseXML_Auto_to_CAJA(cajaDataXML)
        gGuide.filename = guideFile
        guideStart(startTabOrPage)
        setProgress('')
      }
    })
  }, 500)
}

/** @param {...TPage} clonePage */
TGuide.prototype.addUniquePage = function (preferredName, clonePage) {	// create new page, attach to guide. ensure name is unique
  var guide = this
  var counter = 1
  if (preferredName === '' || typeof preferredName === 'undefined') {
    preferredName = 'Page' // in case of blank page names, start with something.
  }
  var name = preferredName
  while (typeof guide.pages[name] !== 'undefined') {
    counter++
    name = preferredName + ' ' + (counter)
  }
  var page
  if (clonePage) {
    page = clonePage
  } else {
    page = new TPage()
  }
  // trace(name,page.name);
  page.name = name
  guide.pages[page.name] = page
  return page
}

/* */

function parseXML_A2J_to_CAJA (TEMPLATE) {	// Parse A2J into CAJA
  // trace("Converting from A2J Author 4");
  // var VARIABLE, v, STEP,step,POPUP,popup,	QUESTION, page
  // var button, field, script, condition, comment, condT, condF, tf, statement, args, p
  var LINEDEL = '\n' // "<BR>xxxx";
  var INDENT = ' '// "&nbsp;"//hard space indent one

  var DefaultPrompts = {
    'I need more information. Please choose one or more checkboxes to continue.': 'helpCB',
		 'I need more information. You must type an answer in the highlighted box before you can continue.': 'helpText',
		 'I need more information. You must choose an answer from the highlighted box before you can continue.': 'invalidPromptChoose'
  }
  var DefaultPromptsUsed = {}

  /** @type {TGuide} */
  var guide = new TGuide()

  guide.authorId = 0
  guide.tool = 'A2J'
  guide.toolversion = makestr(TEMPLATE.find('A2JVERSION').text())
  guide.avatar =			makestr(TEMPLATE.find('AVATAR').text())
  guide.guideGender =	makestr(TEMPLATE.find('GUIDEGENDER').text())
  guide.completionTime = ''
  guide.copyrights = ''
  guide.createdate = ''
  guide.credits = ''
  guide.description = makestr(TEMPLATE.find('DESCRIPTION').xml())
  guide.jurisdiction = makestr(TEMPLATE.find('JURISDICTION').text())
  guide.language = makestr(TEMPLATE.find('LANGUAGE').text())
  guide.modifydate = ''
  guide.notes = cr2P(makestr(TEMPLATE.find('HISTORY').xml()))
  guide.sendfeedback = textToBool(TEMPLATE.find('SENDFEEDBACK').text(), false)
  guide.emailContact = makestr(TEMPLATE.find('SENDFEEDBACKEMAIL').text())
  guide.subjectarea = guide.jurisdiction
  guide.title = TEMPLATE.find('TITLE').text()
  guide.version = makestr(TEMPLATE.find('VERSION').text())
  guide.viewer = 'A2J'
  guide.endImage = TEMPLATE.find('ENDGRAPHIC').text()
  guide.logoImage = TEMPLATE.find('LOGOGRAPHIC').text()

  var author = new TAuthor()
  author.name = makestr(TEMPLATE.find('AUTHOR').text())
  guide.authors = [author]

  TEMPLATE.find('STEP').each(function () {
    var STEP = $(this)
    var step = new TStep()
    step.number = STEP.attr('NUMBER')
    step.text = STEP.find('TEXT').xml()
    guide.steps.push(step)
  })

  guide.templates = makestr(TEMPLATE.find('TEMPLATES').text())

  TEMPLATE.find('VARIABLE').each(function () {
    var VARIABLE = $(this)
    // var v = new TVariable();
    // v.name=VARIABLE.attr("NAME");
    // v.type=VARIABLE.attr("TYPE");
    // v.repeating=textToBool(VARIABLE.attr("REPEATING"),false);
    // v.comment=makestr(VARIABLE.find("COMMENT").xml());
    // Obsolete, discard: VARIABLE.attr("SCOPE");
    // guide.vars[v.name.toLowerCase()]=v;
    // v.repeating = textToBool(VARIABLE.attr('REPEATING'),false);
    guide.varCreate(VARIABLE.attr('NAME'), VARIABLE.attr('TYPE'), textToBool(VARIABLE.attr('REPEATING'), false), makestr(VARIABLE.find('COMMENT').xml()))
    // v.traceLogic('Import variable');
	 })
  // guide's default avatar/guide settings aren't set here.

  var popups = []
  TEMPLATE.find('POPUP').each(function () {
    var POPUP = $(this)
    var popup = {}// new TPopup();
    popup.id = POPUP.attr('ID')
    popup.name = POPUP.attr('NAME')
    popup.text = POPUP.find('TEXT').xml()
    popups[popup.id] = popup
  })

  var mapids = [] // map A2J id to page name or special ID

  var fixID = function (id) {	// convert a page id (#) to name.
    return (mapids[id]) ? mapids[id].name : id
  }

  var replacePopups = function (pageName, html) {	// A2J didn't discard old popups. Find any popups, create pages for them thus dropping old ones.
    return html.replace(/\"POPUP:\/\/(\w+)\"/ig,
      function (match, p1, offset, string) {
        var popid = match.match(/\"POPUP:\/\/(\w+)\"/i)[1]
        var popup = popups[popid]
        popup.page = guide.addUniquePage(pageName + ' popup')
        popup.page.type = 'Popup'
        // trace("Creating popup ["+popup.page.name+"]");
        popup.page.text = replacePopups(pageName, popup.text)
        return '"POPUP://' + escapeHtml(popup.page.name) + '"'
      })
  }

  TEMPLATE.find('QUESTION').each(function () {
    // allocate pages first so we can link scripts in second pass
    var QUESTION = $(this)
    var page = guide.addUniquePage(jQuery.trim(QUESTION.attr('NAME')))
    mapids[QUESTION.attr('ID')] = page
  })
  guide.firstPage = fixID(makestr(TEMPLATE.find('FIRSTQUESTION').text()))
  guide.exitPage = fixID(makestr(TEMPLATE.find('EXITQUESTION').text()))

  TEMPLATE.find('QUESTION').each(function () {
    var QUESTION = $(this)
    var page = mapids[QUESTION.attr('ID')]

    page.xmla2j = QUESTION.xml()
    page.type = 'A2J'
    page.style = ''
    page.step = parseInt(QUESTION.attr('STEP'), 10)
    page.mapx = parseInt(0.5 * QUESTION.attr('MAPX'), 10)
    page.mapy = parseInt(0.7 * QUESTION.attr('MAPY'), 10) + 100
    page.repeatVar = makestr(QUESTION.attr('REPEATVAR'))
    page.outerLoopVar = makestr(QUESTION.attr('OUTERLOOPVAR'))
    page.nested = textToBool(QUESTION.attr('NESTED'))
    page.text = replacePopups(page.name, makestr(QUESTION.find('TEXT').xml()))
    page.textCitation = cr2P(makestr(QUESTION.find('TEXTCITATION').xml()))
    page.textAudioURL = replacePopups(page.name, makestr(QUESTION.find('TEXTAUDIO').xml()))
    page.learn = makestr(QUESTION.find('LEARN').xml())
    page.help = replacePopups(page.name, makestr(QUESTION.find('HELP').xml()))
    page.helpCitation = cr2P(makestr(QUESTION.find('HELPCITATION').xml()))
    page.helpMediaLabel = makestr(PAGE.find('HELPMEDIALABEL').xml())
    page.helpAudioURL = replacePopups(page.name, makestr(QUESTION.find('HELPAUDIO').xml()))
    page.helpReader = makestr(QUESTION.find('HELPREADER').xml())
    page.helpImageURL = makestr(QUESTION.find('HELPGRAPHIC').text())
    page.helpVideoURL = makestr(QUESTION.find('HELPVIDEO').text())
    page.notes = cr2P(makestr(QUESTION.find('NOTE').xml()))
    page.codeCitation = cr2P(makestr(QUESTION.find('CODECITATION').xml()))

    if (CONST.showXML) {
      page.xml = $(this).xml()
    }
    // page.alignText="";
    var scripts = []

    QUESTION.find('BUTTON').each(function () {
      var button = new TButton()
      button.label = jQuery.trim($(this).find('LABEL').xml())
      button.next = fixID(makestr($(this).attr('NEXT')))
      button.url = fixID(makestr($(this).attr('URL')))
      button.name = jQuery.trim($(this).attr('NAME'))
      button.repeatVar = makestr($(this).attr('REPEATVAR'))
      button.repeatVarSet = makestr($(this).attr('REPEATVARSET'))
      button.value = jQuery.trim($(this).find('VALUE').xml())
      page.buttons.push(button)
    })
    QUESTION.find('FIELD').each(function () {
      var field = new TField()
      field.type = $(this).attr('TYPE')
      field.required = !(textToBool($(this).attr('OPTIONAL'), false))
      field.order = makestr($(this).attr('ORDER'))
      field.min = makestr($(this).attr('MIN'))
      field.max = makestr($(this).attr('MAX'))
      field.calculator = textToBool($(this).attr('CALCULATOR'))
      field.label = makestr(jQuery.trim($(this).find('LABEL').xml()))
      field.name = jQuery.trim($(this).find('NAME').xml())
      field.value = makestr(jQuery.trim($(this).find('VALUE').xml()))
      field.sample = makestr(jQuery.trim($(this).find('SAMPLE').xml()))
      field.invalidPrompt = makestr(jQuery.trim($(this).find('INVALIDPROMPT').xml()))
      field.invalidPromptAudio = makestr(jQuery.trim($(this).find('INVALIDPROMPTAUDIO').xml()))
      field.listSrc = makestr(jQuery.trim($(this).find('LISTSRC').xml()))
      if (field.listSrc === '') {
        field.listData = $(this).find('SELECT').xml()
      }
      // trace(field.listDATA);
      /*
			if (typeof DefaultPrompts[field.invalidPrompt]!="undefined")
			{
				DefaultPromptsUsed[field.invalidPrompt]=1;
				field.invalidPrompt = "%%"+DefaultPrompts[field.invalidPrompt]+"%%";
			}
			*/
      page.fields.push(field)
    })
    QUESTION.find('MACRO').each(function () {
      var script = new TScript()
      script.event = jQuery.trim($(this).find('EVENT').xml())
      var condition = gLogic.hds(jQuery.trim($(this).find('CONDITION').xml()))
      var comment = jQuery.trim($(this).find('COMMENT').xml())
      // Remove old cruft.
      if (comment === 'Example: set a flag if income too high' || comment === null || comment === 'undefined') {
        comment = ''
      }

      var condT = []
      var condF = []
      $(this).find('STATEMENT').each(function () {
        var tf = jQuery.trim($(this).find('CONDITION').xml())
        var statement = jQuery.trim($(this).find('ACTION').xml())
        //				if ((args = statement.match(/set\s+(\w[\w\s]*)\s?(=|TO)\s?(.+)/i))!=null)
        // statement = 'SET ['+args[1]+'] TO '+args[3];
        var args
        if ((args = statement.match(REG.LOGIC_SET)) !== null) {
          var p = args[1].indexOf('=')
          var varName = args[1].substr(0, p)
          var varVal = gLogic.hds(args[1].substr(p + 1))
          if (varVal === '') {
            varVal = '""'
          }
          if (varName !== '') {
            // Version 1:
            if (varName.indexOf(' ') >= 0) {
              statement = 'SET [' + varName + '] TO ' + varVal
            } else {
              statement = 'SET ' + varName + ' TO ' + varVal
            }
          } else {
            statement = ''
          }
        } else
        if ((args = statement.match(/goto\s+(\w+)\s?/i)) !== null) {
          // statement = "GOTO '"+args[1]+"'";//guide.pageIDtoName(args[1]);
          statement = 'GOTO "' + escapeHtml(fixID(args[1])) + '"'
        } else {
          statement = '//' + statement
        }
        if (statement !== '') {
          if (tf === 'true') {
            condT.push(statement)
          } else {
            condF.push(statement)
          }
        }
      })

      if ((condition.toLowerCase() === 'true' || condition === '1' || condition === '1=1' || condition === 'If 1=1')) {
        script.code = condT.join(LINEDEL) + LINEDEL
      } else
      if (condF.length === 0) {
        //				if (condT.length==1)
        //					script.code="IF "+condition+" THEN "+condT.join(LINEDEL)+LINEDEL;//if x then y
        //				else
        script.code = 'IF ' + condition + ' ' + LINEDEL + INDENT + condT.join(LINEDEL + INDENT) + LINEDEL + 'END IF\n'// if x then y,z
      } else
      if (condT.length === 0) {
        script.code = 'IF NOT (' + condition + ') ' + LINEDEL + INDENT + condF.join(LINEDEL + INDENT) + LINEDEL + 'END IF' + LINEDEL// if not x then y
      } else {
        script.code = 'IF  ' + condition + ' ' + LINEDEL + INDENT + condT.join(LINEDEL + INDENT) + LINEDEL + 'ELSE' + LINEDEL + INDENT + condF.join(LINEDEL + INDENT) + LINEDEL + 'END IF' + LINEDEL// if x then y else z
      }
      if (comment) {
        script.code = '//' + comment + LINEDEL + script.code
      }

      scripts.push(script)
    })

    var scriptBefore = []
    var scriptAfter = []
    var scriptLast = []
    var s
    for (s in scripts) {
      var script = scripts[s]
      var st = script.code.split('\n')// .join("<BR>");
      if (script.event === 'BEFORE') {
        scriptBefore = scriptBefore.concat(st)
      } else {
        scriptAfter = scriptAfter.concat(st)
      }
    }

    page.codeBefore =	makestr((scriptBefore).join('<BR/>'))
    page.codeAfter =	makestr((scriptAfter.concat(scriptLast)).join('<BR/>'))
  })
  var p
  for (p in DefaultPrompts) {
    if (DefaultPromptsUsed[p] === 1) {
      guide.clauses[DefaultPrompts[p]] = p
    }
  }

  return parseXML_CAJA_to_CAJA($(jQuery.parseXML(exportXML_CAJA_from_CAJA(guide)))) // force complete IO
}

function parseXML_Auto_to_CAJA (cajaData) {	// Parse XML into CAJA
  var guide
  if ((cajaData.find('A2JVERSION').text()) !== '') {
    guide = parseXML_A2J_to_CAJA(cajaData)// Parse A2J into CAJA
  } else
  if ((cajaData.find('CALIDESCRIPTION').text()) !== '') {
    if (typeof parseXML_CA_to_CAJA !== 'undefined') {
      guide = parseXML_CA_to_CAJA(cajaData)// Parse CALI Author into CAJA
    }
  } else {
    guide = parseXML_CAJA_to_CAJA(cajaData)// Parse Native CAJA
  }

  guide.sortPages()
  return guide
}
