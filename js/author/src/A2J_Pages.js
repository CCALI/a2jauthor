/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Authoring App Pages GUI
	Page editing dialog box
	Editable page text for display in All Text
	04/15/2013

*/

/* global gGuidePath,gPage,gGuide,gUserID,gGuideID,gUserNickName */

function pageNameFieldsForTextTab(pagefs,page)
{	// Used by the Text tab.
	// Include editable fields of all a page's text blocks.
	pagefs.append(form.htmlarea({label:'Text:',value:page.text,change:function(val,page){page.text=val; }} ));
	if (page.type!==CONST.ptPopup){
		if (gPrefs.showText===2 || page.learn!=="")
		{
			pagefs.append(form.text({label:'Learn More prompt:',placeholder:"",	value:page.learn,
				change:function(val,page){page.learn=val;}} ));
		}
		if (gPrefs.showText===2 || page.help!=="")
		{
			pagefs.append(form.htmlarea({label:"Help:",value:page.help,
				change:function(val,page){page.help=val;}} ));
		}
		if (gPrefs.showText===2 || page.helpReader!=="")
		{
			pagefs.append(form.htmlarea({label:'Help Text Reader:',value:page.helpReader,
				change:function(val,page){page.helpReader=val;}} ));
		}
		var f;
		var labelChangeFnc=function(val,field){field.label=val;};
		var defValueChangeFnc=function(val,field){field.value=val;};
		var invalidChangeFnc=function(val,field){field.invalidPrompt=val;};
		for (f in page.fields)
		{
			var field = page.fields[f];
			var ff=form.fieldset('Field '+(parseInt(f,10)+1),field);
			ff.append(form.htmlarea({label:'Label:',value:field.label,change:labelChangeFnc}));
			if (gPrefs.showText===2 || field.value!=="")
			{
				ff.append(form.text({label:'Default value:',placeholder:"",name:'default', value:  field.value,change:defValueChangeFnc}));
			}
			if (gPrefs.showText===2 || field.invalidPrompt!=="")
			{
				ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,change:invalidChangeFnc}));
			}
			pagefs.append(ff);
		}
		var bi;
		var btnLabelChangeFnc=function(val,b){b.label=val;};
		var bntDevValChangeFnc=function(val,b){b.value=val;};
		for (bi in page.buttons)
		{
			var b = page.buttons[bi];
			var bf=form.fieldset('Button '+(parseInt(bi,10)+1),b);
			if (gPrefs.showText===2 || b.label!=="")
			{
				bf.append(form.text({value: b.label,label:'Label:',placeholder:'button label',change:btnLabelChangeFnc}));
			}
			if (gPrefs.showText===2 || b.value!=="")
			{
				bf.append(form.text({value: b.value,label:'Default value:',placeholder:'Default value',change:bntDevValChangeFnc}));
			}
			pagefs.append(bf);
		}
	}
}


// @param {String} destPageName
// @param {String} [url]
// Navigate to given page (after tiny delay). This version only used for Author.
function gotoPageView(destPageName, url) {
  window.setTimeout(function() {

    switch (destPageName) {
      // On success exit, flag interview as Complete.
      case CONST.qIDSUCCESS:
        gGuide.varSet(CONST.vnInterviewIncompleteTF, false);
        dialogAlert('Author note: User\'s data would upload to server.');
        break;

      // Exit/Resume
      case CONST.qIDEXIT:
        dialogAlert('Author note: User\'s INCOMPLETE data would upload to server.');
        break;

      case CONST.qIDFAIL:
        if (makestr(url) === '') url = gStartArgs.exitURL;
        dialogAlert('Author note: User would be redirected to another page: <a target=_blank href="' + url + '">' + url + '</a>');
        break;

      // 8/17/09 3.0.1 Execute the Resume button.
      case CONST.qIDRESUME:
        traceLogic('Scripted \'Resume\'');
        A2JViewer.goExitResume();
        break;

      // 8/17/09 3.0.1 Execute the Back button.
      case CONST.qIDBACK:
        traceLogic('Scripted \'Go Back\'');
        A2JViewer.goBack();
        break;

      default:
        var page = gGuide.pages[destPageName];

        if (page === null || typeof page === 'undefined') {
          traceAlert('Page is missing: ' + destPageName);
          traceLogic('Page is missing: ' + destPageName);
        } else {
          gPage = page;
          $('#authortool').hide();
          A2JViewer.layoutPage($('.A2JViewer', '#page-viewer'), gPage);
          $('#page-viewer').removeClass('hidestart').show();
          A2JViewer.refreshVariables();//TODO more efficient updates
        }
    }
  }, 1);
}

function pageNameRelFilter(e,pageName)
{	// Return all DOM elements whose REL points to page name.
	var rel = 'PAGE '+pageName;
	return $(e).filter(function()
	{
		return rel === $(this).attr('rel');
	});
}

function pageEditSelected()
{	// Return currently selected page or '' if none selected.
	var rel = makestr($('.pageoutline a.'+SELECTED).first().attr('rel'));
	if (rel.indexOf("PAGE ")===0)
	{
		rel=rel.substr(5);
	}
	else
	{
		rel='';
	}
	return rel;
}
function pageEditSelect(pageName)
{	// Select named page in our list
	$('.pageoutline a').removeClass(SELECTED);
	pageNameRelFilter('.pageoutline a',pageName).toggleClass(SELECTED);
}

function pageEditClone(pageName)
{	// Clone named page and return new page's name.
	/** @type {TPage} */
	var page = gGuide.pages[pageName];
	if (typeof page === 'undefined') {return '';}
	var clonePage = pageFromXML(page2XML(page));
	page = gGuide.addUniquePage(pageName,clonePage);
	// Fix Git Issue #272 Stagger cloned question on mapper
	page.mapy += 30;
	page.mapx += 30;
	gGuide.sortPages();
	updateTOC();
	pageEditSelect(page.name);
	return page.name;
}

function pageEditNew()
{	// Create a new blank page, after selected page.
	var newName = pageEditSelected();
	var newStep;
	var selPage = false;
	if (newName ==='')
	{	// No page selected, use first page listed in TOC and in first step.
		var rel = makestr($('.pageoutline li').first().attr('rel'));
		if (rel.indexOf("PAGE ")===0)
		{
			rel=rel.substr(5);
		}
		else
		{
			rel='New page';
		}
		newName = rel;
		newStep = 0;
	}
	else
	{	// Create new page in same step as selected page.
		selPage = gGuide.pages[newName];
		newStep = selPage.step;
	}

	if(selPage === false) {
		selPage = gGuide.sortedPages.length > 0 ? gGuide.sortedPages[gGuide.sortedPages.length - 1] : false;
	}
	

	var page = gGuide.addUniquePage(newName);
	page.type="A2J";
	page.text="My text";
	page.step = newStep;
	page.mapx = selPage ? selPage.mapx : 0;
	page.mapy = selPage ? selPage.mapy + NODE_SIZE.h + 20 : 0;
	
	// 2014-10-22 Ensure a new page has at least one button
	var cnt= new TButton();
	cnt.label = lang.Continue;
	page.buttons=[cnt];
	gGuide.sortPages();
	updateTOC();
	pageEditSelect(page.name);
	return page.name;
}

function pagePopupEditNew()
{	// Create a new blank popup page, after selected popup.
	var newName = pageEditSelected();
	if (newName ==='')
	{
		newName = 'Popup';
	}
	else
	{	// Git Issue #268 - add Popup to new popup name
		newName += ' - Popup';
	}
	var page = gGuide.addUniquePage(newName);
	page.type=CONST.ptPopup;
	page.mapx=null;
	page.text="My popup text";
	page.step = 0;
	gGuide.sortPages();
	updateTOC();
	pageEditSelect(page.name);
	return page.name;
}

function pageRename(page,newName){
/* TODO Rename all references to this page in POPUPs, JUMPs and GOTOs */
	//trace("Renaming page "+page.name+" to "+newName);
	if (page.name===newName) {return true;}
	if (page.name.toLowerCase() !== newName.toLowerCase())
	{
		if (gGuide.pages[newName])
		{
			dialogAlert({title:'Page rename disallowed',body:'There is already a page named '+newName});
			return false;
		}
	}
	gGuide.pageFindReferences(page.name,newName);
	delete gGuide.pages[page.name];
	page.name = newName;
	gGuide.pages[page.name]=page;
	gGuide.sortPages();
	// Update name for Preview button to have correct target
	if ($pageEditDialog) {
		$pageEditDialog.attr('rel', page.name);
	}
	pageEditSelect(newName);
	return true;
}

function pageEditDelete(name)
{	// Delete named page after confirmation that lists all references to it.
	if (name=='') {
		return
	}
	var refs=gGuide.pageFindReferences(name,null);
	var txt='';
	var r;
	if (refs.length>0)
	{
		txt='<h5>References to this page (' + refs.length+')</h5> <ul class="list-group">';
		for (r in refs){
			txt+='<li class="list-group-item">'+refs[r].name+' <i>'+refs[r].field+'</i></li>';
		}
		txt += "</ul>";
	}
	else{
		txt='No references to this page.';
	}
	dialogConfirmYesNo({
    title:'Deleting page',
    message:'<div class="alert alert-danger"><span class="glyphicon-attention"></span> Permanently delete page "' + name+'"?</div><div>'+txt+'</div>',
    height: 400,
    width: 600,
    name:name,
		Yes:
		/*** @this {{name}} */
		function(){
			var page=gGuide.pages[this.name];
			// 2015-06-29 Git ISsue #273 Anything pointing to this page is redirect to NOWHERE
			// Handle direct button branches and GOTO's in Logic blocks.
			gGuide.pageFindReferences(name,CONST.qIDNOWHERE);
			delete gGuide.pages[page.name];
			gGuide.sortPages();
			updateTOC();
			if ($pageEditDialog!==null){
				$pageEditDialog.dialog("close");
				$pageEditDialog = null;
			}
		}});
}

// Bring page edit window forward with page content
function gotoPageEdit(pageName) {
  $pageEditDialog = $('.page-edit-form');

  $('#authortool').show();
  $('#page-viewer').hide();

  var page = gGuide.pages[pageName];
  if (page == null) return;

  // clear these so they refresh with new data. TODO - update in place
  $('#tabsLogic  .tabContent, #tabsText .tabContent').html('');

  $pageEditDialog.attr('rel', page.name);
  $pageEditDialog.attr('title', 'Question Editor');

  $pageEditDialog.dialog({
    dialogClass: 'modal bootstrap-styles',
    autoOpen: false,
    title: page.name,
    width: 750,
    height: 500,
    modal: false,
    minWidth: 200,
    minHeight: 500,
    maxHeight: 700,

    close: function() {},

    buttons:[{
      text:'XML',
      click:function() {
        var pageName = $(this).attr('rel');
        dialogAlert({
          title: 'Page XML',
          width: 800,
          height: 600,
          body: prettyXML(page2XML(gGuide.pages[pageName]))
        });
      }
    }, {
      text: 'Preview',
      click: function() {
        var pageName = $(this).attr('rel');
        $pageEditDialog.dialog('close');
        $('#author-app').trigger('edit-page:preview', pageName);
      }
    }, {
      text: 'Close',
      click: function() {
        $(this).dialog('close');
        updateTOCOnePage();
      }
    }]
  });

  guidePageEditForm(page, $('.page-edit-form-panel', $pageEditDialog).html(''), page.name);

  $pageEditDialog.dialog('open');
  $pageEditDialog.dialog('moveToTop');
}

// Go to a tab or popup a page.
function gotoTabOrPage(target) {

  if (target.indexOf("PAGE ") === 0) {
    gotoPageEdit(target.substr(5));
    return;
  }

  if (target.indexOf("STEP ") === 0) {
    target = 'tabsSteps';
  }

  $('.guidemenu nav li').removeClass('active');
  $('.guidemenu nav li[ref="' + target + '"]').addClass('active');
  $('.tab-panel').hide();
  $('.tab-panel.panel-info').show();
  $('#' + target).show();

  switch (target) {
    case 'tabsAbout':
    case 'tabsVariables':
    case 'tabsSteps':
    case 'tabsLogic':
    case 'tabsText':
    case 'tabsClauses':
      if (gGuide) gGuide.noviceTab(target, false);
      break;
  }
}

/** @param {TPage} page */
function guidePageEditForm(page, div, pagename)//novicePage
{	// Create editing wizard for given page.
   var t = "";
  // var page = gGuide.pages[pagename];
	t=$('<div/>').addClass('tabsPanel editq');
	var fs;

	form.clear();
	if (page === null || typeof page === "undefined") {
		t.append(form.h2( "Page not found " + pagename));
	}
	else
	if (page.type === CONST.ptPopup )
	{	// Popup pages have only a few options - text, video, audio
		fs=form.fieldset('Popup info',page);
		fs.append(form.text({label:'Name:',name:'pagename', value:page.name,change:function(val,page,form)
		{	// Renaming a popup page. Rename all references to the page. Use the new name only if it's unique.
			val = jQuery.trim(val);
			if (pageRename(page,val)===false){
				$(this).val(page.name);
			}
		}} ));
		fs.append(form.htmlarea({label:'Notes:',value: page.notes,change:function(val,page){page.notes=val;}} ));
		fs.append(form.htmlarea(	{label:'Text:',value:page.text,change:function(val,page){page.text=val;}} ));
		fs.append(form.pickAudio(	{label:'Text audio:', placeholder:'mp3 file',	value:	page.textAudioURL,
			change:function(val,page){page.textAudioURL=val;}} ));
		t.append(fs);
	}
	else
	{
    fs = form.fieldset('Page info', page);

    fs.append(form.pickStep({
      label: 'Step:',
      value: page.step,
      change: function(val, page) {
        page.step = parseInt(val, 10);
        updateTOC();
      }
    }));

		fs.append(form.text({label:'Name:', value:page.name,change:function(val,page,form)
		{	// Renaming a page. Rename all references to the page. Use the new name only if it's unique.
			val = jQuery.trim(val);
			if (pageRename(page,val)===false){
				$(this).val(page.name);
			}
		}} ));
		if (page.type !== "A2J") {
			fs.append(form.h2("Page type/style: " + page.type + "/" + page.style));
		}
		fs.append(form.htmlarea({label:'Notes:',value: page.notes,change:function(val,page){page.notes=val;}} ));
		t.append(fs);

    var pagefs = form.fieldset('Question text', page);

    pagefs.append(form.htmlarea({
      label: 'Text:',
      value: page.text,
      change: function(val, page) {
        page.text = val;
      }
    }));

    pagefs.append(form.pickAudio({
      label: 'Text audio:',
      placeholder: 'mp3 file',
      value: page.textAudioURL,
      change: function(val, page) {
        page.textAudioURL = val;
      }
    }));

    pagefs.append(form.text({
      label: 'Learn More prompt:',
      placeholder: 'Learn more',
      value: page.learn,
      change: function(val, page) {
        page.learn = val;
      }
    }));

    var getShowMe = function() {
      if (page.helpVideoURL !== '') {
        return 2;
      }

      if (page.helpImageURL !== '') {
        return 1;
      }

      return 0;
    };

    var updateShowMe = function(form, showMe) {
      showMe = Number(showMe);

      form.find('[name="helpAudio"]').showit(showMe !== 2);
      form.find('[name="helpGraphic"]').showit(showMe === 1);
      form.find('[name="helpReader"]').showit(showMe >= 1);
      form.find('[name="helpVideo"]').showit(showMe === 2);

			// only show outerLoopVar if nested is checked
			form.find('[name="outerLoopVar"]').showit(page.nested);

    };

		pagefs.append(form.pickList({label:'Help style:',value:getShowMe(), change:function(val,page,form){
			updateShowMe(form, (val));
			}},  [0,'Text',1,'Show Me Graphic',2,'Show Me Video']));

		pagefs.append(form.htmlarea(	{label:"Help:",value:page.help,change:function(val,page){page.help=val;}} ));

		pagefs.append(form.pickAudio(	{name:'helpAudio',label:'Help audio:',placeholder:'Help audio URL',	value:page.helpAudioURL,
			change:function(val,page){page.helpAudioURL=val;}} ));

		pagefs.append(form.pickImage(		{name:'helpGraphic',label:'Help graphic:',placeholder:'Help image URL',	value:page.helpImageURL,
			change:function(val,page){page.helpImageURL=val;}} ));

		pagefs.append(form.pickVideo(		{name:'helpVideo', label:'Help video:',placeholder:'Help video URL',		value:page.helpVideoURL,
			change:function(val,page){page.helpVideoURL=val;}} ));

		pagefs.append(form.htmlarea(	{name:'helpReader', label:'Help Text Reader:', value:page.helpReader,
			change:function(val,page){page.helpReader=val;}} ));

		pagefs.append(form.varPicker(		{label:'Counting Variable:',placeholder:'',	value:page.repeatVar,
			change:function(val,page){page.repeatVar=val;}} ));

		pagefs.append(form.checkbox({name: 'nested', label:'Nested:', checkbox:'', value:page.nested,
			change:function(val,page){
				page.nested = val;
				$('[name="outerLoopVar"]').showit(page.nested);
				// clear outerLoopVar if unchecked
				if (!page.nested) {
					page.outerLoopVar = '';
				}
			}}));

		pagefs.append(form.varPicker({name: 'outerLoopVar', label:'Outer Loop Counting Variable:',placeholder:'',	value:page.outerLoopVar,
			change:function(val,page){page.outerLoopVar=val;}} ));

		t.append(pagefs);
		updateShowMe(pagefs,getShowMe());
		pagefs=null;


		if (page.type === "A2J" || page.fields.length > 0) {

			var blankField=new TField();
			blankField.type=CONST.ftText;
			blankField.label="Label";


			var updateFieldLayout= function(ff,field)
			//** @param {TField} field */
			{
				var canRequire = field.type !== 'radio' && field.type !== CONST.ftCheckBoxNOTA;
				var canMinMax = field.type===CONST.ftNumber || field.type===CONST.ftNumberDollar || field.type===CONST.ftNumberPick || field.type===CONST.ftDateMDY;
				var canList = field.type===CONST.ftTextPick;
				var canDefaultValue = field.type!==CONST.ftCheckBox && field.type!==CONST.ftCheckBoxNOTA && field.type!==CONST.ftGender;
				var canOrder =   field.type===CONST.ftTextPick || field.type===CONST.ftNumberPick || field.type===CONST.ftDateMDY;
				var canUseCalc = (field.type === CONST.ftNumber) || (field.type === CONST.ftNumberDollar);
				var canMaxChars= field.type===CONST.ftText || field.type===CONST.ftTextLong || field.type===CONST.ftNumber || field.type===CONST.ftNumberDollar || field.type===CONST.ftNumberPhone || field.type===CONST.ftNumberZIP;
				var canCalendar = field.type===CONST.ftDateMDY;
				var canUseSample = field.type===CONST.ftText || field.type===CONST.ftTextLong
					|| field.type === CONST.ftTextPick  || field.type === CONST.ftNumberPick
					|| field.type===CONST.ftNumber || field.type === CONST.ftNumberZIP || field.type === CONST.ftNumberSSN || field.type === CONST.ftNumberDollar
					|| field.type === CONST.ftDateMDY;
				//var canCBRange= curField.type==CField.ftCheckBox || curField.type==CField.ftCheckBoxNOTA;
				// Can it use extra long labels instead of single line?
				//	useLongLabel = curField.type==CField.ftCheckBox ||	curField.type==CField.ftCheckBoxNOTA ||curField.type==CField.ftRadioButton ||urField.type==CField.ftCheckBoxMultiple;
				//	useLongText =curField.type==CField.ftTextLong;
				ff.find('[name="required"]').showit(canRequire);
				ff.find('[name="maxchars"]').showit(canMaxChars);
				ff.find('[name="min"]').showit(canMinMax );
				ff.find('[name="max"]').showit(canMinMax );
				ff.find('[name="default"]').showit(canDefaultValue);
				ff.find('[name="calculator"]').showit(canUseCalc);
				ff.find('[name="calendar"]').showit(canCalendar);

				ff.find('[name="listext"]').showit(canList);
				ff.find('[name="listint"]').showit(canList);
				ff.find('[name="orderlist"]').showit(canOrder);
				ff.find('[name="sample"]').showit(canUseSample);
			};

			fs=form.fieldset('Fields');
			fs.append(form.listManager({name:'Fields',picker:'Number of fields:',min:0,max:CONST.MAXFIELDS,list:page.fields,blank:blankField
				,save:function(newlist){
					page.fields=newlist;
					}
				,create:function(ff,field)
				//** @param {TField} field */
				{
					ff.append(form.pickList({label:'Type:',value: field.type,
						change:function(val,field,ff){
							field.type=val;
							// Radio Buttons always required
							if (field.type === 'radio' || field.type === CONST.ftCheckBoxNOTA) {
								field.required = true;
							}

							updateFieldLayout(ff,field);
							}},

							[
								CONST.ftText,"Text",
								CONST.ftTextLong,"Text (Long)",
								CONST.ftTextPick,"Text (Pick from list)",
								CONST.ftNumber,"Number",
								CONST.ftNumberDollar,"Number Dollar",
								CONST.ftNumberSSN,"Number SSN",
								CONST.ftNumberPhone,"Number Phone",
								CONST.ftNumberZIP,"Number ZIP Code",
								CONST.ftNumberPick,"Number (Pick from list)",
								CONST.ftDateMDY,"Date MM/DD/YYYY",
								CONST.ftGender,"Gender",
								CONST.ftRadioButton,"Radio Button",
								CONST.ftCheckBox,"Check box",
								CONST.ftCheckBoxNOTA,"Check Box (None of the Above)"
							]

							));
					ff.append(form.htmlarea({label:'Label:',   value:field.label,
						change:function(val,field){field.label=val;}}));
					ff.append(form.varPicker({label:'Variable:', placeholder:'Variable name', value: field.name,
						change:function(val,field){field.name=jQuery.trim(val);}}));
					ff.append(form.text({label:'Default value:',name:'default', placeholder:'Default value',value:  field.value,
						change:function(val,field){field.value=jQuery.trim(val);}}));
					ff.append(form.checkbox({label:'Required:',name: 'required', checkbox:'', value:field.required,
					change:function(val,field){field.required = val}}));
					ff.append(form.text({label:'Max chars:',name:'maxchars', placeholder:'Max Chars',value: field.maxChars,
						change:function(val,field){field.maxChars=val;}}));
					ff.append(form.checkbox({label:'Show Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,
						change:function(val,field){field.calculator=val;}}));
					ff.append(form.text({label:'Min value:',name:'min',placeholder:'min', value: field.min,
						change:function(val,field){field.min=val;}}));
					ff.append(form.text({label:'Max value:',name:'max',placeholder:'max', value: field.max,
						change:function(val,field){field.max=val;}}));
					ff.append(form.pickXML({label:'External list:',name:'listext',value: field.listSrc,
						change:function(val,field){
							field.listSrc=val;
							// trace('List source is '+field.listSrc);
						}}));
					// 2014-11-24 For internal lists, convert select list OPTIONS into plain text with line breaks
					var listText = makestr(field.listData).replace('</OPTION>','</OPTION>\n','gi').stripHTML();
					//trace(listText);
					ff.append(form.textArea({label:'Internal list:',name:'listint',value: listText,
						change:function(val,field){
							// 2014-11-24 Convert line break items into pairs like <OPTION VALUE="Purple">Purple</OPTION>
							val = val.split('\n');
							var select=$('<SELECT/>');
							for (var vi in val) {
								var optText =jQuery.trim(val[vi]);
								if (optText !== '') {
									//02/27/2015 <> don't encode as values and break xml. so for now, just use the text as the value.
									select.append( $('<OPTION/>').text(optText));
								}
							}
							var html = select.html();
							//trace(html);
							field.listData=html;
							}}));
					ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,
						change:function(val,field){field.invalidPrompt=val;}}));
					ff.append(form.text({label:'Sample value:',name:'sample',value: field.sample,
						change:function(val,field){field.sample=val;}}));

					updateFieldLayout(ff,field);
					return ff;
				}
				}));


			t.append(fs);
		}

		var updateButtonLayout=function(ff,b)
		//** @param {TButton} b */
		{	// Choose a URL for failing the interview
			var showURL =(b.next === CONST.qIDFAIL);
			ff.find('[name="url"]').showit(showURL);
		};

    if (page.type === "A2J" || page.buttons.length > 0) {
      var blankButton = new TButton();

      fs = form.fieldset('Buttons');

      fs.append(form.listManager({
        name: 'Buttons',
        picker: 'Number of buttons',
        min: 1,
        max: CONST.MAXBUTTONS,
        list: page.buttons,
        blank: blankButton,

        save: function(newlist) {
          page.buttons = newlist;
        },

        create: function(ff, b) {
          ff.append(form.text({
            value: b.label,
            label: 'Label:',
            placeholder: 'button label',
            change: function(val, b) {
              b.label = val;
            }
          }));

          ff.append(form.varPicker({
            value: b.name,
            label: 'Variable Name:',
            placeholder: 'variable',
            change: function(val, b) {
              b.name = val;
            }
          }));

          ff.append(form.text({
            value: b.value,
            label: 'Default value:',
            placeholder: 'Default value',
            change: function(val, b) {
              b.value = val;
            }
          }));

          ff.append(form.pickpage({
            value: b.next,
            label: 'Destination:',
            change: function(val, b, ff) {
              b.next = val;
              updateButtonLayout(ff, b);
            }
          }));

          ff.append(form.text({
            name: 'url',
            value: b.url,
            label: 'URL:',
            placeholder: '',
            change: function(val, b) {
              b.url = val;
            }
          }));

          var repeatOptions = [
            '', 'Normal',
            CONST.RepeatVarSetOne, 'Set Counting Variable to 1',
            CONST.RepeatVarSetPlusOne, 'Increment Counting Variable'
          ];

          ff.append(form.pickList({
            label: 'Repeat Options:',
            value: b.repeatVarSet,
            change: function(val, b) {
              b.repeatVarSet = val;
            }
          }, repeatOptions));

          ff.append(form.varPicker({
            label: 'Counting Variable:',
            placeholder: '',
            value: b.repeatVar,
            change: function(val, b) {
              b.repeatVar = val;
            }
          }));

          updateButtonLayout(ff, b);
          return ff;
        }
      }));

			t.append(fs);
		}

		fs=form.fieldset('Advanced Logic');
		fs.append(form.codearea({label:'Before:',	value:page.codeBefore,
			change:function(val){page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
		fs.append(form.codearea({label:'After:',	value:page.codeAfter,
			change:function(val){page.codeAfter=val; /* TODO Compile for syntax errors */	}} ));
		t.append(fs);


	}

   div.append(t);
	form.finish(t);
	if (CONST.showXML){
		div.append('<div class=xml>'+htmlEscape(page.xml)+'</div>');
		div.append('<div class=xml>'+htmlEscape(page.xmla2j)+'</div>');
	}

	gPage = page;
	return page;
}


TPage.prototype.tagList=function()
{	// 05/23/2014 Return list of tags to add to TOC or Mapper.
	/** @type {TPage} */
	var page=this;
	var tags='';
	// List the field types as tags.
	for (var f in page.fields)
	{
		/** @type {TField} */
		var field = page.fields[f];
		if (field.required) {
			tags += '<span class="label label-info tag"><span class="glyphicon-pencil"></span>' + field.fieldTypeToTagName() + '<span class="text-danger">*</span></span>';
		}else{
			tags += '<span class="label label-info tag"><span class="glyphicon-pencil"></span>' + field.fieldTypeToTagName() + '</span>';
		}
	}
	if (page.help!=='') {
		tags += '<span class="label label-warning tag"><span class="glyphicon-lifebuoy"></span>Help</span>';
	}
	if (page.codeAfter!=='' || page.codeBefore!=='') {
		tags += '<span class="label label-success tag"><span class="glyphicon-split"></span>Logic</span>';
	}
	if (page.repeatVar!=='')
	{
		tags += '<span class="glyphicon-cw">&nbsp</span>';
	}
	if (page.outerLoopVar!== '')
	{
		tags += '<span class="glyphicon-cw">&nbsp</span>';
	}
	return tags;
};


TGuide.prototype.pageFindReferences=function(findName,newName){
// ### Return list of pages and fields pointing to pageName in {name:x,field:y} pairs
// ### If newName is not null, perform a replacement.
	var guide=this;
	var matches=[];
	var testtext = function(page,field,fieldname)
	{
		var add=false;
		page[field]=page[field].replace(REG.LINK_POP,function(match,p1,offset,string) // jslint nolike: /\"POPUP:\/\/(([^\"])+)\"/ig

		{
			var popupid=match.match(REG.LINK_POP2)[1];
			if (popupid===findName)
			{
				add=true;
				if (newName!==null)
				{
					popupid= htmlEscape(newName);
				}
			}
			return '"POPUP://' + popupid+ '"';
		});
		if (add)
		{
			matches.push({name:page.name,field:fieldname,text:page[field]});
		}
	};
	var testcode = function(page,field,fieldName)
	{
		var result=gLogic.pageFindReferences(page[field],findName,newName);
		if (result.add){
			matches.push({name:page.name,field:fieldName,text:''});
		}
	};
	for (var p in guide.pages)
	{
		var page=guide.pages[p];

		//text, help, codeBefore, codeAfter
		testtext(page,'text','Text');
		testtext(page,'help','Help');
		testcode(page,'codeBefore','Logic Before');
		testcode(page,'codeAfter','Logic After');
		for (var bi in page.buttons)
		{
			var b=page.buttons[bi];
			if (b.next===findName)
			{	// 2014-06-02 Make button point to renamed page.

				b.next = newName;

				matches.push({name:page.name,field:'Button '+b.label,text:b.label});
			}
		}
	}
	return matches;
};


/* */
