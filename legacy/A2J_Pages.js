/*
  A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
  All Contents Copyright The Center for Computer-Assisted Legal Instruction

  Authoring App Pages GUI
  Page editing dialog box
  Editable page text for display in All Text
  04/15/2013
*/
// TODO: fix legacy imports, removing circular dependencies
// import $ from 'jquery'
// import {TGuide, TPage, TField, TButton, window.gGuideMeta, gStartArgs, window.CONST} from './viewer/A2J_Types'
// import {gPrefs} from './viewer/A2J_Prefs'

var $pageEditDialog = null

function pageNameFieldsForTextTab (pagefs, page) { // Used by the Text tab.
  // Include editable fields of all a page's text blocks.
  pagefs.append(window.form.htmlarea({ label: 'Question Text:', value: page.text, change: function (val) { page.text = val } }))
  if (page.type !== window.CONST.ptPopup) {
    if (window.gPrefs.showText === 2 || page.learn !== '') {
      pagefs.append(window.form.text({ label: 'Prompt:',
        placeholder: '',
        value: page.learn,
        change: function (val, page) { page.learn = val } }))
    }
    if (window.gPrefs.showText === 2 || page.help !== '') {
      pagefs.append(window.form.htmlarea({ label: 'Response:',
        value: page.help,
        change: function (val) { page.help = val } }))
    }
    if (window.gPrefs.showText === 2 || page.helpReader !== '') {
      pagefs.append(window.form.htmlarea({ label: 'Video Transcript:',
        value: page.helpReader,
        change: function (val) { page.helpReader = val } }))
    }
    var f
    var labelChangeFnc = function (val, field) { field.label = val }
    var defValueChangeFnc = function (val, field) { field.value = val }
    var invalidChangeFnc = function (val, field) { field.invalidPrompt = val }
    for (f in page.fields) {
      var field = page.fields[f]
      var ff = window.form.fieldset('Field ' + (parseInt(f, 10) + 1), field)
      ff.append(window.form.htmlarea({ label: 'Label:', value: field.label, field: field, change: labelChangeFnc }))
      if (window.gPrefs.showText === 2 || field.value !== '') {
        ff.append(window.form.text({ label: 'Default Value:', placeholder: '', name: 'default', value: field.value, change: defValueChangeFnc }))
      }
      if (window.gPrefs.showText === 2 || field.invalidPrompt !== '') {
        ff.append(window.form.htmlarea({ label: 'Custom Invalid Prompt:', value: field.invalidPrompt, field: field, change: invalidChangeFnc }))
      }
      pagefs.append(ff)
    }
    var bi
    var btnLabelChangeFnc = function (val, b) { b.label = val }
    var bntDevValChangeFnc = function (val, b) { b.value = val }
    for (bi in page.buttons) {
      var b = page.buttons[bi]
      var bf = window.form.fieldset('Button ' + (parseInt(bi, 10) + 1), b)
      if (window.gPrefs.showText === 2 || b.label !== '') {
        bf.append(window.form.text({ value: b.label, label: 'Label:', placeholder: '', change: btnLabelChangeFnc }))
      }
      if (window.gPrefs.showText === 2 || b.value !== '') {
        bf.append(window.form.text({ value: b.value, label: 'Default Value:', placeholder: '', change: bntDevValChangeFnc }))
      }
      pagefs.append(bf)
    }
  }
}

// @param {String} destPageName
// @param {String} [url]
// Navigate to given page (after tiny delay). This version only used for Author.
function gotoPageView (destPageName, url) {
  window.setTimeout(function () {
    switch (destPageName) {
      // On success exit, flag interview as Complete.
      case window.CONST.qIDSUCCESS:
        window.gGuide.varSet(window.CONST.vnInterviewIncompleteTF, false)
        window.dialogAlert('Author note: User\'s data would upload to server.')
        break

      // Exit/Resume
      case window.CONST.qIDEXIT:
        window.dialogAlert('Author note: User\'s INCOMPLETE data would upload to server.')
        break

      case window.CONST.qIDFAIL:
        if (window.makestr(url) === '') url = window.gStartArgs.exitURL
        window.dialogAlert('Author note: User would be redirected to another page: <a target=_blank href="' + url + '">' + url + '</a>')
        break

      // 8/17/09 3.0.1 Execute the Resume button.
      case window.CONST.qIDRESUME:
        window.traceLogic('Scripted \'Resume\'')
        window.A2JViewer.goExitResume()
        break

      // 8/17/09 3.0.1 Execute the Back button.
      case window.CONST.qIDBACK:
        window.traceLogic('Scripted \'Go Back\'')
        window.A2JViewer.goBack()
        break

      default:
        var page = window.gGuide.pages[destPageName]

        if (page === null || typeof page === 'undefined') {
          window.traceAlert('Page is missing: ' + destPageName)
          window.traceLogic('Page is missing: ' + destPageName)
        } else {
          window.gPage = page
          window.$('#authortool').hide()
          window.A2JViewer.layoutPage(window.$('.A2JViewer', '#page-viewer'), window.gPage)
          window.$('#page-viewer').removeClass('hidestart').show()
          window.A2JViewer.refreshVariables() // TODO more efficient updates
        }
    }
  }, 1)
}

function pageNameRelFilter (e, pageName) { // Return all DOM elements whose REL points to page name.
  var rel = 'PAGE ' + pageName
  return window.$(e).filter(function () {
    return rel === window.$(this).attr('rel')
  })
}

function getSelectedPageName () { // Return currently selected page name or '' if none selected.
  var rel = window.makestr(window.$('.pageoutline a.' + window.SELECTED).first().attr('rel'))
  if (rel.indexOf('PAGE ') === 0) {
    rel = rel.substr(5)
  } else {
    rel = ''
  }
  return rel
}
function pageEditSelect (pageName) { // Select named page in our list
  window.$('.pageoutline a').removeClass(window.SELECTED)
  pageNameRelFilter('.pageoutline a', pageName).toggleClass(window.SELECTED)
}

function pageEditClone (pageName) { // Clone named page and return new page's name.
  /** @type {TPage} */
  var page = window.gGuide.pages[pageName]
  if (typeof page === 'undefined') { return '' }
  var clonePage = window.pageFromXML(window.page2XML(page))
  page = window.gGuide.addUniquePage(pageName, clonePage)
  // Fix Git Issue #272 Stagger cloned question on mapper
  page.mapy += 30
  page.mapx += 30
  window.gGuide.sortPages()
  window.updateTOC()
  pageEditSelect(page.name)
  return page.name
}

function getNewMapYForStep (stepNumber) {
  let newMapY = 60
  window.gGuide.sortedPages.forEach((page) => {
    const pageStepNumber = parseInt(page.step)
    if (pageStepNumber === stepNumber && page.mapy > newMapY) {
      newMapY = page.mapy
    }
  })

  // TODO: amount added to mapy should be based on nodeSize.height from jointjs-util.js
  return newMapY + 240
}

function createNewPage (newStep, mapx, mapy) {	// Create a new blank page, after selected page.
  // if newStep exists, this call came from the new Mapper tool
  // var newPageName
  var selectedPageName = getSelectedPageName()
  var firedFromPagesTab = newStep == null

  // resolve step/x&y from pages tab
  if (firedFromPagesTab) {
    if (selectedPageName) {
      const selectedPage = window.gGuide.pages[selectedPageName]
      newStep = selectedPage.step
      mapx = selectedPage.mapx
      // TODO: amount added to mapy should be based on nodeSize.height from jointjs-util.js
      mapy = selectedPage.mapy + 240
    } else {
      newStep = 0
      mapx = 60
      mapy = getNewMapYForStep(0)
    }
  }

  var page = window.gGuide.addUniquePage('New Page')
  page.type = 'A2J'
  page.text = 'My text'
  page.step = newStep
  page.mapx = mapx
  page.mapy = mapy

  // 2014-10-22 Ensure a new page has at least one button
  var defaultButton = new window.TButton()
  defaultButton.label = window.lang.Continue
  page.buttons = [defaultButton]
  // sort pages and update view
  window.gGuide.sortPages()
  window.updateTOC()
  // auto select new page
  pageEditSelect(page.name)

  return page
}

function createNewPopup () { // Create a new blank popup page, after selected popup.
  var newName = 'New Popup'
  var page = window.gGuide.addUniquePage(newName)
  page.type = window.CONST.ptPopup
  page.mapx = 60
  page.mapy = window.getNewMapYForStep(0)
  page.text = 'My popup text'
  page.step = 0
  window.gGuide.sortPages()
  window.updateTOC()
  pageEditSelect(page.name)

  return page
}

function pageRename (page, newName) {
/* TODO Rename all references to this page in POPUPs, JUMPs and GOTOs */
  // trace("Renaming page "+page.name+" to "+newName);
  if (page.name === newName) { return true }
  if (page.name.toLowerCase() !== newName.toLowerCase()) {
    if (window.gGuide.pages[newName]) {
      window.dialogAlert({ title: 'Page rename disallowed', body: 'There is already a page named ' + newName })
      return false
    }
  }
  window.gGuide.pageFindReferences(page.name, newName)
  delete window.gGuide.pages[page.name]
  page.name = newName
  window.gGuide.pages[page.name] = page
  window.gGuide.sortPages()
  // Update name for Preview button to have correct target
  if ($pageEditDialog) {
    $pageEditDialog.attr('rel', page.name)
  }
  pageEditSelect(newName)
  return true
}

function pageEditDelete (name) { // Delete named page after confirmation that lists all references to it.
  if (name === '') {
    return
  }
  var refs = window.gGuide.pageFindReferences(name, null)
  var txt = ''
  var r
  if (refs.length > 0) {
    txt = '<h5>References to this page (' + refs.length + ')</h5> <ul class="list-group">'
    for (r in refs) {
      txt += '<li class="list-group-item">' + refs[r].name + ' <i>' + refs[r].field + '</i></li>'
    }
    txt += '</ul>'
  } else {
    txt = 'No references to this page.'
  }
  window.dialogConfirmYesNo({
    title: 'Deleting page',
    closeText: '', // removes word "Close" from upper right titlebar close button
    message: '<div class="alert alert-danger"><span class="glyphicon-attention" aria-hidden="true"></span> Permanently delete page "' + name + '"?</div><div>' + txt + '</div>',
    height: 400,
    width: 600,
    name: name,
    Yes:
    /** * @this {{name}} */
    function () {
      var page = window.gGuide.pages[this.name]
      // 2015-06-29 Git ISsue #273 Anything pointing to this page is redirect to NOWHERE
      // Handle direct button branches and GOTO's in Logic blocks.
      window.gGuide.pageFindReferences(name, window.CONST.qIDNOWHERE)
      delete window.gGuide.pages[page.name]
      window.gGuide.sortPages()
      window.updateTOC()
      if ($pageEditDialog !== null) {
        $pageEditDialog.dialog('close')
        $pageEditDialog = null
      }
    }
  })
}

// debounce for QDE resize
// source: https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
function debounce (func, wait, immediate) {
  var timeout

  return function executedFunction () {
    var context = this
    var args = arguments

    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    var callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) { // call on leading edge
      func.apply(context, args)
    }
  }
}
// update maxHeight on resize
function setQDEmaxHeight () {
  var $pageEditDialog = window.$('.page-edit-form')
  var windowHeight = window.innerHeight
  var maxHeight = 0.9 * windowHeight
  $pageEditDialog.dialog('option', 'maxHeight', maxHeight)
}

// debounced version
var debouncedSetQDEmaxHeight = debounce(setQDEmaxHeight, 150, false)

var handleNullButtonTargets = function (buttons) {
  for (button of buttons) {
    if (button && button.next == null) {
      button.next = window.CONST.qIDNOWHERE
    }
  }

  // courtesy return for tests
  return buttons
}

// Bring page edit window forward with page content
function gotoPageEdit (pageName) {
  $pageEditDialog = window.$('.page-edit-form')

  window.$('#authortool').show()
  window.$('#page-viewer').hide()

  var page = window.gGuide.pages[pageName]
  if (page == null) return
  // catches legacy interview button.next targets set to `null`
  window.handleNullButtonTargets(page.buttons)

  // clear these so they refresh with new data. TODO - update in place
  window.$('#tabsLogic  .tabContent, #tabsText .tabContent').html('')

  $pageEditDialog.attr('rel', page.name)
  $pageEditDialog.attr('title', 'Question Editor')

  $pageEditDialog.dialog({
    dialogClass: 'page-edit-dialog',
    autoOpen: false,
    title: page.name,
    modal: false,
    resizable: false,
    closeText: '', // removes word "Close" from upper right titlebar close button
    close: function () {
      // cleanup QDE resize eventListener
      window.removeEventListener('resize', debouncedSetQDEmaxHeight)
      // callback from open below
      this.removeOverlay()
      // Update view and save any time edit dialog closes
      window.updateTOC()
      if (window.gGuide) {
        window.guideSave()
      }
    },

    open: function () {
      // create overlay which returns it's own cleanup function
      this.removeOverlay = addDialogOverlay(window.$(this))
    },

    buttons: [{
      text: 'Close',
      class: 'btn btn-default btn-wide-sm',
      click: function () {
        window.$(this).dialog('close')
      }
    },
    {
      text: 'Preview',
      class: 'btn btn-primary btn-wide-sm',
      click: function () {
        var pageName = window.$(this).attr('rel')
        $pageEditDialog.dialog('close')
        window.$('#author-app').trigger('edit-page:preview', pageName)
      }
    }]
  })

  // removes jQuery.ui classes from buttons
  var modal = $pageEditDialog.parents('.ui-dialog')
  modal.find('.ui-button').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only')
  // modal dialog is responsive now, remove draggable icon from UI
  modal.removeClass('ui-resizable')

  var $qdeParentDiv = window.$('.page-edit-form-panel', $pageEditDialog).html('')
  guidePageEditForm(page, $qdeParentDiv)

  $pageEditDialog.dialog('open')
  $pageEditDialog.dialog('moveToTop')

  // set QDE maxHeight based on window size,
  // and throttle resize events to update it
  setQDEmaxHeight()

  window.addEventListener('resize', debouncedSetQDEmaxHeight)
}

// Add overlay/backdrop to dialog modals
// returns it's own removal function
function addDialogOverlay ($parentDialog) {
  var $dialogOverlay = window.$('<div class="dialog-overlay ui-widget-overlay ui-front" />')
  var $body = window.$(document.body)
  $body.prepend($dialogOverlay)

  $dialogOverlay.on('click', function () {
    $parentDialog.dialog('close')
  })

  return function () {
    $dialogOverlay.off()
    $dialogOverlay.remove()
  }
}

// Go to a tab or popup a page.
function gotoTabOrPage (target) {
  if (target.indexOf('PAGE ') === 0) {
    gotoPageEdit(target.substr(5))
    return
  }

  if (target.indexOf('STEP ') === 0) {
    target = 'tabsSteps'
  }

  window.$('.guidemenu nav li').removeClass('active')
  window.$('.guidemenu nav li[ref="' + target + '"]').addClass('active')
  window.$('.tab-panel').hide()
  window.$('.tab-panel.panel-info').show()
  window.$('#' + target).show()

  switch (target) {
    case 'tabsAbout':
    case 'tabsVariables':
    case 'tabsSteps':
    case 'tabsLogic':
    case 'tabsText':
    case 'tabsClauses':
      if (window.gGuide) window.gGuide.noviceTab(target, false)
      break
  }
}

// For internal lists, convert select list OPTIONS into plain text with line breaks
// optionsHTML is a string html fragment
function convertOptionsToText (optionsHTML) {
  var convertedList = ''
  if (optionsHTML) {
    var listSelect = document.createElement('select')
    listSelect.innerHTML = optionsHTML
    convertedList = [].map.call(listSelect.children, function (option) {
      return option.innerHTML
    }).join('\n')
  }
  return convertedList
};

/** @param {TPage} page */
function buildPopupFieldSet (page) {
  var popupFieldSet = window.form.fieldset('Popup Info', page)
  popupFieldSet.append(window.form.text({ label: 'Name:',
    name: 'pagename',
    value: page.name,
    change: function (val, page, form) { // Renaming a popup page. Rename all references to the page. Use the new name only if it's unique.
      val = window.$.trim(val)
      if (pageRename(page, val) === false) {
        window.$(this).val(page.name)
      }
    } }))
  popupFieldSet.append(window.form.htmlarea({ label: 'Notes:', value: page.notes, change: function (val) { page.notes = val } }))
  popupFieldSet.append(window.form.htmlarea({ label: 'Text:', value: page.text, change: function (val) { page.text = val } }))
  popupFieldSet.append(window.form.pickAudio({
    label: 'Text Audio:',
    placeholder: '',
    value: page.textAudioURL,
    change: function (val, page) { page.textAudioURL = val }
  }))

  return popupFieldSet
}

/** @param {TPage} page */
function buildPageFieldSet (page) {
  var pageFieldSet = window.form.fieldset('Page Info', page)

  pageFieldSet.append(window.form.pickStep({
    label: 'Step:',
    value: page.step,
    change: function (val, page) {
      page.step = parseInt(val, 10)
      window.updateTOC()
    }
  }))

  pageFieldSet.append(window.form.text({ label: 'Name:',
    value: page.name,
    change: function (val, page, form) { // Renaming a page. Rename all references to the page. Use the new name only if it's unique.
      val = window.$.trim(val)
      if (pageRename(page, val) === false) {
        window.$(this).val(page.name)
      }
    } }))
  if (page.type !== 'A2J') {
    pageFieldSet.append(window.form.h2('Page type/style: ' + page.type + '/' + page.style))
  }
  pageFieldSet.append(window.form.htmlarea({
    label: 'Notes:',
    value: page.notes,
    change: function (val) {
      page.notes = val
    }
  }))

  return pageFieldSet
}

/** @param {TPage} page */
function buildQuestionFieldSet (page) {
  var questionFieldSet = window.form.fieldset('Question Info', page)

  questionFieldSet.append(window.form.htmlarea({
    label: 'Text:',
    value: page.text,
    change: function (val) {
      page.text = val
    }
  }))

  questionFieldSet.append(window.form.htmlarea({
    label: 'Citation:',
    value: page.textCitation,
    change: function (val) {
      page.textCitation = val
    }
  }))

  questionFieldSet.append(window.form.pickAudio({
    label: 'Audio:',
    placeholder: '',
    value: page.textAudioURL,
    change: function (val, page) {
      page.textAudioURL = val
    }
  }))

  questionFieldSet.append(window.form.varPicker({ label: 'Counting Variable:',
    placeholder: '',
    value: page.repeatVar,
    change: function (val, page) { page.repeatVar = val } }))

  questionFieldSet.append(window.form.varPicker({ name: 'outerLoopVar',
    label: 'Outer Loop Counting Variable:',
    placeholder: 'You should only use a variable here for Nested Loops',
    value: page.outerLoopVar,
    change: function (val, page) { page.outerLoopVar = val } }))

  return questionFieldSet
}

var helpAltTextChangeHandler = function (val, page) {
  val = val.replace(/[^\w\s]|_/g, "") // only allow letters, digits, and whitespace
          .replace(/\s+/g, " ") // single spaces only
  page.helpAltText = window.$.trim(val).substring(0, 120)
  return val
}

/** @param {TPage} page */
function buildLearnMoreFieldSet (page) {
  var learnMoreFieldSet = window.form.fieldset('Learn More Info', page)

  learnMoreFieldSet.append(window.form.text({
    label: 'Prompt:',
    placeholder: '',
    value: page.learn,
    change: function (val, page) {
      page.learn = val
    }
  }))

  learnMoreFieldSet.append(window.form.htmlarea({ label: 'Response:', value: page.help, change: function (val) { page.help = val } }))

  learnMoreFieldSet.append(window.form.htmlarea({ label: 'Citation:', value: page.helpCitation, change: function (val) { page.helpCitation = val } }))

  learnMoreFieldSet.append(window.form.htmlarea({
    name: 'helpMediaLabel',
    label: 'Media Label:',
    placeholder: 'Short explanatory label for Learn More Media',
    value: page.helpMediaLabel,
    change: function (val) { page.helpMediaLabel = val }
  }))

  learnMoreFieldSet.append(window.form.pickAudio({
    name: 'helpAudio',
    label: 'Audio:',
    placeholder: '',
    value: page.helpAudioURL,
    change: function (val, page) { page.helpAudioURL = val }
  }))

  learnMoreFieldSet.append(window.form.pickImage({
    name: 'helpGraphic',
    label: 'Graphic:',
    placeholder: '',
    value: page.helpImageURL,
    change: function (val, page) { page.helpImageURL = val }
  }))

  learnMoreFieldSet.append(window.form.text({
    name: 'helpAltText',
    label: 'Graphic Alt-Text:',
    placeholder: 'Enter 100 characters or less (no punctuation) to describe your image for Aria readers. Hint: 100 characters ends here',
    value: page.helpAltText,
    change: helpAltTextChangeHandler
  }))

  learnMoreFieldSet.append(window.form.pickVideo({
    name: 'helpVideo',
    label: 'Video:',
    placeholder: '',
    value: page.helpVideoURL,
    change: function (val, page) { page.helpVideoURL = val }
  }))

  learnMoreFieldSet.append(window.form.htmlarea({
    name: 'helpReader',
    label: 'Video Transcript:',
    value: page.helpReader,
    change: function (val) { page.helpReader = val }
  }))

  return learnMoreFieldSet
}

/** @param {TPage} page */
function buildFieldsFieldSet (page) {
  var blankField = new window.TField()
  blankField.type = window.CONST.ftText
  blankField.label = 'Label'

  var fieldsfs = window.form.fieldset('Fields')
  var fieldsListManager = window.form.listManager({ name: 'Fields',
    picker: 'Number of Fields:',
    min: 0,
    max: window.CONST.MAXFIELDS,
    list: page.fields,
    blank: blankField,
    customClass: 'page-edit-fields',
    save: function (newlist) {
      page.fields = newlist
    },
    create: function (ff, field) { // @param {TField} field
      ff.append(window.form.pickList({ label: 'Type:',
        value: field.type,
        change: function (val, field, ff) {
          field.type = val
          // Radio Buttons and CheckboxNOTA always required
          // Also check the `required` box so it will show checked
          // if the field type is switched to any other field
          if (field.type === 'radio' || field.type === window.CONST.ftCheckBoxNOTA) {
            field.required = true
            ff.find('[name="required"]').find('[type=checkbox]').prop('checked', true)
          }

          updateFieldLayout(ff, field)
        } },

      [
        window.CONST.ftText, 'Text',
        window.CONST.ftTextLong, 'Text (Long)',
        window.CONST.ftTextPick, 'Text (Pick from list)',
        window.CONST.ftNumber, 'Number',
        window.CONST.ftNumberDollar, 'Number Dollar',
        window.CONST.ftNumberSSN, 'Number SSN',
        window.CONST.ftNumberPhone, 'Number Phone',
        window.CONST.ftNumberZIP, 'Number ZIP Code',
        window.CONST.ftNumberPick, 'Number (Pick from list)',
        window.CONST.ftDateMDY, 'Date MM/DD/YYYY',
        window.CONST.ftGender, 'Gender',
        window.CONST.ftRadioButton, 'Radio Button',
        window.CONST.ftCheckBox, 'Check box',
        window.CONST.ftCheckBoxNOTA, 'Check Box (None of the Above)',
        window.CONST.ftUserAvatar, 'User Avatar'
      ]

      ))
      ff.append(window.form.htmlarea({ label: 'Label:',
        value: field.label,
        change: function (val) { field.label = val } }))
      ff.append(window.form.varPicker({ label: 'Variable:',
        placeholder: '',
        value: field.name,
        change: function (val, field) { field.name = window.$.trim(val) } }))
      ff.append(window.form.text({ label: 'Default Value:',
        name: 'default',
        placeholder: '',
        value: field.value,
        change: function (val, field) { field.value = window.$.trim(val) } }))
      ff.append(window.form.checkbox({ label: 'Required:',
        name: 'required',
        checkbox: '',
        value: field.required,
        change: function (val, field) { field.required = val } }))
      ff.append(window.form.text({ label: 'Max Characters:',
        name: 'maxchars',
        placeholder: 'Enter a number here to set a Character Limit for the End User\'s response',
        value: field.maxChars,
        change: function (val, field) { field.maxChars = val } }))
      ff.append(window.form.checkbox({ label: 'Show Calculator:',
        name: 'calculator',
        checkbox: '',
        value: field.calculator,
        change: function (val, field) { field.calculator = val } }))
      ff.append(window.form.text({ label: 'Min Value:',
        name: 'min',
        placeholder: 'min',
        value: field.min,
        change: function (val, field) { field.min = val } }))
      ff.append(window.form.text({ label: 'Max Value:',
        name: 'max',
        placeholder: 'max',
        value: field.max,
        change: function (val, field) { field.max = val } }))
      ff.append(window.form.pickXML({ label: 'External list:',
        name: 'listext',
        value: field.listSrc,
        change: function (val, field) {
          field.listSrc = val
          // trace('List source is '+field.listSrc);
        } }))

      // Restore previous text list or create from current html option list
      var listText = field.previousTextList ? field.previousTextList : convertOptionsToText(field.listData)

      ff.append(window.form.textArea({ label: 'Internal list:',
        name: 'listint',
        value: listText,
        change: function (val, field) {
          // 2014-11-24 Convert line break items into pairs like <OPTION VALUE="Purple">Purple</OPTION>
          field.previousTextList = val
          val = val.split('\n')
          var select = window.$('<SELECT/>')
          for (var vi in val) {
            var optText = window.$.trim(val[vi])
            if (optText !== '') {
              // 02/27/2015 <> don't encode as values and break xml. so for now, just use the text as the value.
              select.append(window.$('<OPTION/>').text(optText))
            }
          }
          var html = select.html()
          // trace(html);
          field.listData = html
        } }))
      ff.append(window.form.htmlarea({ label: 'Custom Invalid Prompt:',
        value: field.invalidPrompt,
        change: function (val) { field.invalidPrompt = val } }))
      ff.append(window.form.text({ label: 'Sample Value:',
        placeholder: '',
        name: 'sample',
        value: field.sample,
        change: function (val, field) { field.sample = val } }))

      updateFieldLayout(ff, field)
      return ff
    }
  })
  fieldsfs.append(fieldsListManager)

  return fieldsfs
}

var updateFieldLayout = function (ff, field) { //* * @param {TField} field */
  var canRequire = field.type !== 'radio' && field.type !== window.CONST.ftCheckBoxNOTA && field.type !== window.CONST.ftUserAvatar
  var canMinMax = field.type === window.CONST.ftNumber || field.type === window.CONST.ftNumberDollar || field.type === window.CONST.ftNumberPick || field.type === window.CONST.ftDateMDY
  var canList = field.type === window.CONST.ftTextPick
  var canDefaultValue = field.type !== window.CONST.ftCheckBox && field.type !== window.CONST.ftCheckBoxNOTA && field.type !== window.CONST.ftGender && field.type !== window.CONST.ftUserAvatar
  var canOrder = field.type === window.CONST.ftTextPick || field.type === window.CONST.ftNumberPick || field.type === window.CONST.ftDateMDY
  var canUseCalc = (field.type === window.CONST.ftNumber) || (field.type === window.CONST.ftNumberDollar)
  var canMaxChars = field.type === window.CONST.ftText || field.type === window.CONST.ftTextLong || field.type === window.CONST.ftNumberPhone || field.type === window.CONST.ftNumberZIP || field.type === window.CONST.ftNumberSSN
  var canCalendar = field.type === window.CONST.ftDateMDY
  var canUseSample = field.type === window.CONST.ftText || field.type === window.CONST.ftTextLong ||
    field.type === window.CONST.ftTextPick || field.type === window.CONST.ftNumberPick ||
    field.type === window.CONST.ftNumber || field.type === window.CONST.ftNumberZIP || field.type === window.CONST.ftNumberSSN || field.type === window.CONST.ftNumberDollar ||
    field.type === window.CONST.ftDateMDY
  // var canCBRange= curField.type==CField.ftCheckBox || curField.type==CField.ftCheckBoxNOTA;
  // Can it use extra long labels instead of single line?
  // useLongLabel = curField.type==CField.ftCheckBox || curField.type==CField.ftCheckBoxNOTA ||curField.type==CField.ftRadioButton ||urField.type==CField.ftCheckBoxMultiple;
  // useLongText =curField.type==CField.ftTextLong;
  ff.find('[name="required"]').showit(canRequire)
  ff.find('[name="maxchars"]').showit(canMaxChars)
  ff.find('[name="min"]').showit(canMinMax)
  ff.find('[name="max"]').showit(canMinMax)
  ff.find('[name="default"]').showit(canDefaultValue)
  ff.find('[name="calculator"]').showit(canUseCalc)
  ff.find('[name="calendar"]').showit(canCalendar)

  ff.find('[name="listext"]').showit(canList)
  ff.find('[name="listint"]').showit(canList)
  ff.find('[name="orderlist"]').showit(canOrder)
  ff.find('[name="sample"]').showit(canUseSample)
}

//* * @param {TButton} b */
var updateButtonLayout = function (ff, b) { // Choose a URL for failing the interview
  var showURL = (b.next === window.CONST.qIDFAIL)
  ff.find('[name="url"]').showit(showURL)
}

/** @param {TPage} page */
function buildButtonFieldSet (page) {
  var blankButton = new window.TButton()

  var buttonfs = window.form.fieldset('Buttons')

  buttonfs.append(window.form.listManager({
    name: 'Buttons',
    picker: 'Number of Buttons',
    min: 1,
    max: window.CONST.MAXBUTTONS,
    list: page.buttons,
    blank: blankButton,
    customClass: 'page-edit-buttons',

    save: function (newlist) {
      page.buttons = newlist
    },

    create: function (ff, b) {
      ff.append(window.form.text({
        value: b.label,
        label: 'Label:',
        placeholder: 'button label',
        change: function (val, b) {
          b.label = val
        }
      }))

      ff.append(window.form.varPicker({
        value: b.name,
        label: 'Variable Name:',
        placeholder: '',
        change: function (val, b) {
          b.name = val
        }
      }))

      ff.append(window.form.text({
        value: b.value,
        label: 'Default Value:',
        placeholder: '',
        change: function (val, b) {
          b.value = val
        }
      }))

      ff.append(window.form.pickpage({
        value: b.next,
        label: 'Destination:',
        buttonText: 'Set Destination',
        change: function (val, b, ff) {
          b.next = val
          updateButtonLayout(ff, b)
        }
      }))

      ff.append(window.form.text({
        name: 'url',
        value: b.url,
        label: 'URL:',
        placeholder: '',
        change: function (val, b) {
          b.url = val
        }
      }))

      var repeatOptions = [
        '', 'Normal',
        window.CONST.RepeatVarSetOne, 'Set Counting Variable to 1',
        window.CONST.RepeatVarSetPlusOne, 'Increment Counting Variable'
      ]

      ff.append(window.form.pickList({
        label: 'Repeat Options:',
        value: b.repeatVarSet,
        change: function (val, b) {
          b.repeatVarSet = val
        }
      }, repeatOptions))

      ff.append(window.form.varPicker({
        label: 'Counting Variable:',
        placeholder: '',
        value: b.repeatVar,
        change: function (val, b) {
          b.repeatVar = val
        }
      }))

      updateButtonLayout(ff, b)
      return ff
    }
  }))

  return buttonfs
}

/** @param {TPage} page */
function buildLogicFieldSet (page) {
  var logicfs = window.form.fieldset('Advanced Logic')
  logicfs.append(window.form.codeArea({ label: 'Before:',
    value: page.codeBefore,
    change: function (val) { page.codeBefore = val /* TODO Compile for syntax errors */ } }))
  logicfs.append(window.form.codeArea({ label: 'After:',
    value: page.codeAfter,
    change: function (val) { page.codeAfter = val /* TODO Compile for syntax errors */ } }))
  logicfs.append(window.form.htmlarea({ label: 'Logic Citation:',
    value: page.codeCitation,
    change: function (val) { page.codeCitation = val } }))

  return logicfs
}

/** @param {TPage} page */
function guidePageEditForm (page, $qdeParentDiv) {
  // Create editing wizard (QDE, Question Design Editor) for given page.
  var $qde = ''
  $qde = window.$('<div/>').addClass('tabsPanel editq')
  // form and it's methods are defined in A2J_Pages.js
  window.form.clear()
  if (page === null || typeof page === 'undefined') {
    $qde.append(window.form.h2('Page not found ' + page.name))
  } else if (page.type === window.CONST.ptPopup) { // Popup pages have only a few options - text, video, audio
    var popupfs = buildPopupFieldSet(page)
    $qde.append(popupfs)
  } else {
    // Add the Page Info Field Set
    var pagefs = buildPageFieldSet(page)
    $qde.append(pagefs)

    // Add the Question Info Field Set
    var questionfs = buildQuestionFieldSet(page)
    $qde.append(questionfs)

    // Add the Learn More Info Field Set
    var learnmorefs = buildLearnMoreFieldSet(page)
    $qde.append(learnmorefs)

    // pagefs = null

    if (page.type === 'A2J' || page.fields.length > 0) {
      var fieldsfs = buildFieldsFieldSet(page)
      $qde.append(fieldsfs)
    }

    if (page.type === 'A2J' || page.buttons.length > 0) {
      var buttonfs = buildButtonFieldSet(page)
      $qde.append(buttonfs)
    }

    var logicfs = buildLogicFieldSet(page)
    $qde.append(logicfs)
  }

  $qdeParentDiv.append($qde)

  // cleanup $qde elements when the dialog closes
  window.$('.page-edit-dialog').on('dialogclose', function (ev) {
    window.$($qdeParentDiv).empty()
  })

  // TODO: the button that triggers showXML was commented out
  // cleanup when the button is/feature is removed
  if (window.CONST.showXML) {
    $qdeParentDiv.append('<div class=xml>' + window.escapeHtml(page.xml) + '</div>')
    $qdeParentDiv.append('<div class=xml>' + window.escapeHtml(page.xmla2j) + '</div>')
  }

  window.gPage = page

  // // courtesy return for tests
  return $qde
  // return page
}

window.TPage.prototype.tagList = function () { // 05/23/2014 Return list of tags to add to TOC or Mapper.
  /** @type {TPage} */
  var page = this
  var tags = ''
  // List the field types as tags.
  for (var f in page.fields) {
    /** @type {TField} */
    var field = page.fields[f]
    if (field.required) {
      tags += '<span class="label label-info tag"><span class="glyphicon-pencil" aria-hidden="true"></span>' + field.fieldTypeToTagName() + '<span class="text-danger">*</span></span>'
    } else {
      tags += '<span class="label label-info tag"><span class="glyphicon-pencil" aria-hidden="true"></span>' + field.fieldTypeToTagName() + '</span>'
    }
  }
  if (page.help !== '') {
    tags += '<span class="label label-warning tag"><span class="glyphicon-lifebuoy" aria-hidden="true"></span>Help</span>'
  }
  if (page.codeAfter !== '' || page.codeBefore !== '') {
    tags += '<span class="label label-success tag"><span class="glyphicon-split" aria-hidden="true"></span>Logic</span>'
  }
  if (page.repeatVar !== '') {
    tags += '<span class="label label-danger glyphicon-cw" aria-hidden="true">Loop</span>'
  }
  if (page.outerLoopVar !== '') {
    tags += '<span class="label label-danger glyphicon-cw" aria-hidden="true">Nested Loop</span>'
  }
  return tags
}

window.TGuide.prototype.pageFindReferences = function (findName, newName) {
// ### Return list of pages and fields pointing to pageName in {name:x,field:y} pairs
// ### If newName is not null, perform a replacement.
  var guide = this
  var matches = []
  var testtext = function (page, field, fieldname) {
    var add = false
    // jslint nolike: /\"POPUP:\/\/(([^\"])+)\"/ig
    page[field] = page[field].replace(window.REG.LINK_POP, function (match, p1, offset, string) {
      var popupid = match.match(window.REG.LINK_POP2)[1]
      if (popupid === findName) {
        add = true
        if (newName != null) {
          popupid = window.escapeHtml(newName)
        }
      }
      return '"POPUP://' + popupid + '"'
    })
    if (add) {
      matches.push({ name: page.name, field: fieldname, text: page[field] })
    }
  }
  var testcode = function (page, field, fieldName) {
    var result = window.gLogic.pageFindReferences(page[field], findName)
    if (result.add) {
      matches.push({ name: page.name, field: fieldName, text: '' })
    }
  }
  for (var p in guide.pages) {
    var page = guide.pages[p]

    // text, help, codeBefore, codeAfter
    testtext(page, 'text', 'Text')
    testtext(page, 'help', 'Help')
    testcode(page, 'codeBefore', 'Logic Before')
    testcode(page, 'codeAfter', 'Logic After')
    for (var bi in page.buttons) {
      var b = page.buttons[bi]
      if (b.next === findName) { // 2014-06-02 Make button point to renamed page.
        if (newName != null) { // https://github.com/CCALI/CAJA/issues/2614
          b.next = newName
        }

        matches.push({ name: page.name, field: 'Button ' + b.label, text: b.label, next: b.next })
      }
    }
  }
  // test firstPage and exitPage values and update
  if (guide.firstPage === findName) {
    if (newName != null) {
      guide.firstPage = newName
      // span does not refresh, update it
      $('.starting').find('span').text(newName)
    }
    matches.push({ name: 'Steps Tab', field: 'Starting Point', text: guide.firstPage })
  }
  if (guide.exitPage === findName) {
    if (newName != null) {
      guide.exitPage = newName
      // span does not refresh, update it
      $('.starting').find('span').text(newName)
    }
    matches.push({ name: 'Steps Tab', field: 'Exit Point', text: guide.exitPage })
  }

  return matches
}
