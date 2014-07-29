/*******************************************************************************
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Authoring App Pages GUI
	04/15/2013
	
******************************************************************************/

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



function gotoPageView(destPageName, url)
{  // Navigate to given page (after tiny delay). This version only used for Author.
   window.setTimeout(function()
	{
		
		if (destPageName === CONST.qIDSUCCESS)
		{	// On success exit, flag interview as Complete.
			gGuide.varSet(CONST.vnInterviewIncompleteTF,false);
			dialogAlert("Author note: User's data would upload to server.");
		}
		else
		if (destPageName === CONST.qIDEXIT)
		{	//Exit/Resume
			dialogAlert("Author note: User's INCOMPLETE data would upload to server.");
		}
		else
		if (destPageName === CONST.qIDFAIL)
		{
			if (makestr(url)===''){
				url=gStartArgs.exitURL;
			}
			dialogAlert('Author note: User would be redirected to another page: <a target=_blank href="'+url+'">'+url+'</a>');
		}
		else
		if (destPageName === CONST.qIDRESUME)
		{	// 8/17/09 3.0.1 Execute the Resume button.
			traceLogic("Scripted 'Resume'");
			A2JViewer.goExitResume();
		}
		else
		if (destPageName === CONST.qIDBACK)
		{	// 8/17/09 3.0.1 Execute the Back button.
			traceLogic("Scripted 'Go Back'");
			A2JViewer.goBack();
		}
		else
		{			
			var page = gGuide.pages[destPageName]; 
			if (page === null || typeof page === "undefined")
			{
				traceAlert('Page is missing: '+ destPageName);
				traceLogic('Page is missing: '+ destPageName);
			}
			else
			{
				gPage=page;
				$('#authortool').hide();
				A2JViewer.layoutPage($('.A2JViewer','#page-viewer'),gPage);
				$('#page-viewer').removeClass('hidestart').show();
				A2JViewer.refreshVariables();//TODO more efficient updates
				//$('.A2JViewer').addClass('test',500);
			}
		}
   },1);
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
	var rel = makestr($('.pageoutline li.'+SELECTED).first().attr('rel'));
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
	$('.pageoutline li').removeClass(SELECTED);
	pageNameRelFilter('.pageoutline li',pageName).toggleClass(SELECTED);	
}

function pageEditClone(pageName)
{	// Clone named page and return new page's name.
	var page = gGuide.pages[pageName];
	if (typeof page === 'undefined') {return '';}
	var clonePage = pageFromXML(page2XML(page));
	page = gGuide.addUniquePage(pageName,clonePage);
	gGuide.sortPages();
	updateTOC();
	pageEditSelect(page.name);
	return page.name;
}

function pageEditNew()
{	// Create a new blank page, after selected page. 
	var newName = pageEditSelected();
	var newStep;
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
		var selPage = gGuide.pages[newName];
		newStep = selPage.step;
	}
	var page = gGuide.addUniquePage(newName);
	page.type="A2J";
	page.text="My text";
	page.step = newStep;
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
	// Rename GUI references
	/*
	var targetOld="PAGE "+page.name;
	var targetNew="PAGE "+newName;
	$('li').filter(function(){return targetOld==$(this).attr('target');}).each(function(){
		$(this).attr('target',targetNew);
		$(this).text(newName);
		})
	$('.page-edit-form').filter(function(){ return page.name == $(this).attr('rel')}).each(function(){
		$(this).attr('rel',newName);
		$(this).dialog({title:newName});
		})
		*/
	gGuide.pageFindReferences(page.name,newName);
	delete gGuide.pages[page.name];
	page.name = newName;
	gGuide.pages[page.name]=page;
	gGuide.sortPages();
	//updateTOC(); update now handled when page dialog is closed. 
	pageEditSelect(newName);
	return true;
}

function pageEditDelete(name)
{	// Delete named page after confirmation that lists all references to it. 
	var refs=gGuide.pageFindReferences(name,null);
	var txt='';
	var r;
	if (refs.length>0)
	{
		txt=refs.length+' references to this page.<ul>';
		for (r in refs){
			txt+='<li>'+refs[r].name+' <i>'+refs[r].field+'</i></li>';
		}
		txt += "</ul>";
	}
	else{
		txt='No references';
	}
	dialogConfirmYesNo({title:'Delete page '+name,message:'Permanently delete this page?<hr>'+txt,height:300,name:name,
		Yes:
		/*** @this {{name}} */
		function(){
			var page=gGuide.pages[this.name];
			// TODO Anything pointing to this page is redirect to NOWHERE
			delete gGuide.pages[page.name];
			gGuide.sortPages();
			updateTOC();
			if ($pageEditDialog!==null){
				$pageEditDialog.dialog("close");
				$pageEditDialog = null;
			}
		}});
}

function gotoPageEdit(pageName)
{	// Bring page edit window forward with page content
	$pageEditDialog =  $('.page-edit-form');
	$('#authortool').show();
	$('#page-viewer').hide();
   var page = gGuide.pages[pageName]; 
	if (page === null || typeof page === "undefined"){
		return;
	}
	
	//trace(page2XML(pageFromXML(page2XML(page))));
	
	
	$('#tabsLogic  .tabContent, #tabsText .tabContent').html("");//clear these so they refresh with new data. TODO - update in place
	//var $page =	findPageDialog(pageName);
	//if ($page.length==0)
	//$page = $('.page-edit-form:first').clone(false,false);
	$pageEditDialog.attr('rel',page.name);
	$pageEditDialog.attr('title','Question Editor');//page.name);
	$pageEditDialog.dialog({ 
		autoOpen:false,
		title: page.name,
		width: 750,
		height: 500,
		modal: false,
		minWidth: 200,
		minHeight: 500, maxHeight: 700,
		
		close: function(){
		},
		buttons:[
		{text:'XML', click:function(){
			var pageName=$(this).attr('rel');
			dialogAlert({title:'Page XML',width:800,height:600,body:prettyXML(page2XML(gGuide.pages[pageName]))});
		}},/*
		{text:'Delete', click:function(){
			pageEditDelete($(this).attr('rel'));
		}},
		{text:'Clone', click:function(){
			pageEditClone($(this).attr('rel'));
		}},*/
		{text:'Preview', click:function(){
			var pageName=$(this).attr('rel');			
			gotoPageView(pageName);
			$pageEditDialog.dialog("close");
		}},
		{text:'Close',click:function(){ 
			$(this).dialog("close");
			updateTOCOnePage();
		 }}
	]});
	guidePageEditForm(page,$('.page-edit-form-panel',$pageEditDialog).html(''),page.name);

	$pageEditDialog.dialog('open' );
	$pageEditDialog.dialog('moveToTop');
	
	
	//if (1) {
	//$embed=pageNameRelFilter('.pageoutline li',pageName);
	//$embed.append('<div class="page-edit-form-panel"></div>');
	//guidePageEditForm(page,$('.page-edit-form-panel',$embed).html(''),page.name);
	//}
	
}
function gotoTabOrPage(target)
{	// Go to a tab or popup a page.
	//trace('gotoTabOrPage',target);

	//$('#CAJAOutline li, #CAJAIndex li').each(function(){$(this).removeClass('ui-state-active')});
	//$('li').filter(function(){ return target == $(this).attr('target')}).each(function(){$(this).addClass('ui-state-active')});	
	
	if (target.indexOf("PAGE ")===0)
	{
		gotoPageEdit(target.substr(5));
		return;
	}
	if (target.indexOf("STEP ")===0)
	{
		target='tabsSteps';
	}
	$('.guidemenu ul li').removeClass('selected');
	$('.guidemenu ul li[ref="'+target+'"]').addClass('selected');
	$('.panel').hide();
	$('#'+target).show();
	switch (target)
	{
		case 'tabsAbout':
		case 'tabsVariables':
		case 'tabsSteps':
		case 'tabsLogic':
		case 'tabsText':
		case 'tabsConstants':
			if (gGuide) {gGuide.noviceTab(target,false);}
			break;
		case 'tabsPreview':
			if (gGuide) {gotoPageView(gGuide.firstPage);}
			break;
		case 'tabsGuides':
			// Ensure author can't load new guide before we've saved the current one. 
			if (gGuide) {
				$('#'+target).hide();	
				guideSave(function(){
					$('#'+target).show();					
				});
			}
			break;
	}
}

/*
function pickPage(request,response)
{	// autocomplete page lists including internal text
	request.term = request.term.split("\t")[0];
	var matcherStarts = new RegExp(  '^'+$.ui.autocomplete.escapeRegex(request.term), "i" );
	var matcherContains = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
	var lists=[[],[]];
	var regex= new RegExp(
			"(?![^&;]+;)(?!<[^<>]*)(" +
			$.ui.autocomplete.escapeRegex(request.term) +
			")(?![^<>]*>)(?![^&;]+;)", "gi"
		);
	function hilite(html){return html.replace(regex, "<span class=hilite>$1</span>");}
	//var pages=pageGOTOList();
	var p;
	for (p in gGuide.sortedPages)
	{
		var page=gGuide.sortedPages[p];
		if (page.type!==CONST.ptPopup)
		{
			var list;
			if (matcherStarts.test(page.name)){
				list=0;
			}
			else
			if (matcherContains.test(page.name)){
				list=1;
			}
			else
			{
				list=-1;
			}
			if (list>=0)
			{
				var label = "<b>"+page.name +"</b>: "+  decodeEntities(page.text);
				lists[list].push({label:hilite(label),value:page.name});
			}
		}
	}
	response(lists[0].concat(lists[1]).slice(0,30));
}
*/




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
		fs=form.fieldset('Page info',page);
		fs.append(form.pickStep({label:'Step:',value: page.step, change:function(val,page){
			page.step=parseInt(val,10);
			updateTOC();
		}} ));
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
		
		var pagefs=form.fieldset('Question text',page);  
		
		pagefs.append(form.htmlarea(	{label:'Text:',value:page.text,change:function(val,page){page.text=val;}} ));
		pagefs.append(form.pickAudio(	{label:'Text audio:', placeholder:'mp3 file',	value:	page.textAudioURL,change:function(val,page){page.textAudioURL=val;}} ));
		pagefs.append(form.text(		{label:'Learn More prompt:',placeholder:'Learn more',	value:page.learn,	change:function(val,page){page.learn=val;}} ));
		var getShowMe=function()
		{
			if (page.helpVideoURL!==""){
				return 2; 
			}
			if (page.helpImageURL!==""){
				return 1; 
			}
			return 0;
		};
		var updateShowMe=function(form,showMe)
		{
			form.find('[name="helpAudio"]').showit(showMe!==2);
			form.find('[name="helpGraphic"]').showit(showMe===1);
			form.find('[name="helpReader"]').showit(showMe>=1);
			form.find('[name="helpVideo"]').showit(showMe===2);			
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
				var canMinMax = field.type===CONST.ftNumber || field.type===CONST.ftNumberDollar || field.type===CONST.ftNumberPick || field.type===CONST.ftDateMDY;
				var canList = field.type===CONST.ftTextPick;
				var canDefaultValue=	field.type!==CONST.ftCheckBox && field.type!==CONST.ftCheckBoxNOTA && field.type!==CONST.ftGender;
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
					ff.append(form.checkbox({label:'Required:', checkbox:'', value:field.required,
						change:function(val,field){field.required=val;}}));
					ff.append(form.text({label:'Max chars:',name:'maxchars', placeholder:'Max Chars',value: field.maxChars,
						change:function(val,field){field.maxChars=val;}}));
					ff.append(form.checkbox({label:'Show Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,
						change:function(val,field){field.calculator=val;}}));
					ff.append(form.checkbox({label:'Show Calendar:', name:'calendar',checkbox:'Calendar available?', value:field.calendar,
						change:function(val,field){field.calendar=val;}}));
					ff.append(form.text({label:'Min value:',name:'min',placeholder:'min', value: field.min,
						change:function(val,field){field.min=val;}}));
					ff.append(form.text({label:'Max value:',name:'max',placeholder:'max', value: field.max,
						change:function(val,field){field.max=val;}}));
					ff.append(form.pickXML({label:'External list:',name:'listext',value: field.listSrc,
						change:function(val,field){field.listSrc=val;}}));
					ff.append(form.textArea({label:'Internal list:',name:'listint',value: field.listData,
						change:function(val,field){field.listData=val; }}));
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
			var blankButton=new TButton();
			
			fs=form.fieldset('Buttons');
			fs.append(form.listManager({name:'Buttons',picker:'Number of buttons',min:1,max:CONST.MAXBUTTONS,list:page.buttons,blank:blankButton
				,save:function(newlist){
					page.buttons=newlist; }
				,create:function(ff,b){
					ff.append(form.text({value: b.label,label:'Label:',placeholder:'button label',
						change:function(val,b){b.label=val;}}));
					ff.append(form.varPicker({value: b.name, label:'Variable Name:',placeholder:'variable',
						change:function(val,b){b.name=val;}}));
					ff.append(form.text({value: b.value,label:'Default value:',placeholder:'Default value',
						change:function(val,b){b.value=val;}}));
					
					ff.append(form.pickpage({value: b.next,label:'Destination:',
						change:function(val,b,ff){
							b.next=val;
							updateButtonLayout(ff,b);
						}}));
					ff.append(form.text({name:'url', value: b.url, label:'URL:',placeholder:'',
						change:function(val,b,ff){
							b.url=val;
						}}));
					ff.append(form.pickList({label:'Repeat Options:',value: b.repeatVarSet,
									change:function(val,b,form){
										b.repeatVarSet = val;
									}},
						['','Normal',
						 CONST.RepeatVarSetOne,'Set Counting Variable to 1',
						 CONST.RepeatVarSetPlusOne,'Increment Counting Variable'] ));
					ff.append(form.varPicker(
						{label:'Counting Variable:',placeholder:'',	value:b.repeatVar,
						change:function(val,b){b.repeatVar=val;}} ));
					updateButtonLayout(ff,b);
					return ff;
				}}));
			t.append(fs);
		}
		fs=form.fieldset('Advanced Logic');
		fs.append(form.codearea({label:'Before:',	value:page.codeBefore,
			change:function(val){page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
		fs.append(form.codearea({label:'After:',	value:page.codeAfter,
			change:function(val){page.codeAfter=val; /* TODO Compile for syntax errors */	}} ));
		t.append(fs);

		/*
		if (page.type !== "Book page") 
		{
			if (page.type == "Multiple Choice" && page.style == "Choose Buttons") {
				for (var b in page.buttons) {
					//				t1+=form.short(page.
					t.append(text2P("Feedback for Button(" + (parseInt(b) + 1) + ")"));
					fb = page.feedbacks[fbIndex(b, 0)];
					pageText += html2P(fb.text);
				}
			}
			else if (page.type == "Multiple Choice" && page.style == "Choose List") {
				var clist = [];
				var dlist = [];
				for (var d in page.details) {
					var detail = page.details[d];
					var fb = page.feedbacks[fbIndex(0, d)];
					var $fb = $('<div/>').append(form.pickbranch())
				 .append(form.pickpage('', fb.next, {}))
				 .append(form.htmlarea("", GROUP + "CHOICE" + d, "fb" + d, fb.text));
					var brtype = makestr(fb.next) == "" ? 0 : (makestr(fb.text) == "" ? 2 : 1);
					$('select.branch', $fb).val(brtype).change();
					clist.push({ row: [detail.label, form.picksSore(fb.grade), form.htmlarea("", GROUP + "CHOICE" + d, "detail" + d, detail.text)] });
					dlist.push({ row: [detail.label, form.picksSore(fb.grade), $fb] });
				}
				t.append(form.h1('Choices'));
				t.append(form.tableRowCounter("Number of choices", 2, 7, 'choices').after(form.tablerange('choices', clist)));

				t.append(form.h1('Feedback'));
				t.append(form.tablerange(dlist));

			}
			else if (page.type == "Multiple Choice" && page.style == "Choose MultiButtons") {
				for (d in page.details) {
					var detail = page.details[d];
					t.append(form.h1("Subquestion " + (parseInt(d) + 1)));
					t.append(form.htmlarea("","","", detail.text));
				}
				for (d in page.details) {
					for (b in page.buttons) {
						var button = page.buttons[b];
						fb = page.feedbacks[fbIndex(b, d)];
						t.append(form.h1("Feedback for subquestion " + (parseInt(d) + 1) + ", Choice(" + button.label + ")"));
						t.append(form.htmlarea("","G",b,fb.text));
					}
				}
			}
			else if (page.type == "Multiple Choice" && page.style == "Radio Buttons") { }
			else if (page.type == "Multiple Choice" && page.style == "Check Boxes") { }
			else if (page.type == "Multiple Choice" && page.style == "Check Boxes Set") { }
			else if (page.type == "Text Entry" && page.style == "Text Short Answer") { }
			else if (page.type == "Text Entry" && page.style == "Text Select") {
				t.append(form.htmlarea("Text user will select from", "SELECT", "textselect", page.initialText, 8));
				list = [];
				for (ti in page.tests) {
					var test = page.tests[ti];
					list.push({ row: [
								 form.number("", "", "test" + ti, test.slackWordsBefore, 0, 9999),
							  form.number("", "", "test" + ti, test.slackWordsAfter, 0, 9999),
											  form.htmlarea("", GROUP + "test" + ti, "test" + ti, test.text, 4)
			 ]
					});
				}
				t.append(form.h2('Selection matches'));
				t.append(form.tablecount("Number of tests", 1, 5) + form.tablerange(list, ["Slack words before", "Slack words after", "Words to match"]));

				t.append(form.textArea("script"));
			}
			else if (page.type == "Text Entry" && page.style == "Text Essay") { }
			else if (page.type == "Prioritize" && page.style == "PDrag") { }
			else if (page.type == "Prioritize" && page.style == "PMatch") { }
			else if (page.type == "Slider") { }
			else if (page.type == "GAME" && page.style == "FLASHCARD") { }
			else if (page.type == "GAME" && page.style == "HANGMAN") { }

*/
		//pageText += html2P(expandPopups(this,page.text));

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
			tags += ' <span class="tag field required">' + field.fieldTypeToTagName() + '</span>';
		}else{
			tags += ' <span class="tag field">' + field.fieldTypeToTagName() + '</span>';
		}
	}
	if (page.help!=='') {
		tags += ' <span class="tag help">' + 'Help' + '</span>'; 
	}
	if (page.codeAfter!=='' || page.codeBefore!=='') {
		tags += ' <span class="tag logic">' + 'Logic' + '</span>'; 
	}
	if (page.repeatVar!=='')
	{
		tags += ' <span class="tag repeat">&nbsp</span>';
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
