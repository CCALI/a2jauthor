/*******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Authoring App GUI
	04/15/2013
	05/2014
	
******************************************************************************/

/* global gGuidePath,gPage,gGuide,gUserID,gGuideID,gUserNickName */


//### File upload URLs for a guide's files and a new guide.
CONST.uploadURL = 'CAJA_WS.php?cmd=uploadfile&gid=';
CONST.uploadGuideURL= 'CAJA_WS.php?cmd=uploadguide';

var gPrefs = {
	showLogic : 1
	,showText : 1
	,showPageList : 1
	,showJS : 0
};
			
var $pageEditDialog=null;
var SELECTED = 'ui-state-active';


TGuide.prototype.noviceTab = function(tab,clear)
{	//### 08/03/2012 Edit panel for guide sections 
	/** @type {TGuide} */
	var guide = this;
	var div = $('#'+tab);
	var t = $('.tabContent',div);
	if (clear){
		t.html("");
	}
	if (t.html()!==""){
		return;
	}
	form.clear();
	var fs;
	var p;
	var page;
	var pagefs;
	switch (tab){
			
		case "tabsVariables":
			guide.buildTabVariables(t);
			break;
			
		case "tabsConstants":
			fs = form.fieldset('Constants');
			t.append(fs);
			break;
		
		case "tabsLogic":
			t.append(form.note(
				gPrefs.showLogic=== 1 ? 'Showing only logic fields containing code' : 'Showing all logic fields'));
			
			var codeBeforeChange = function(val,page){
				page.codeBefore=val; /* TODO Compile for syntax errors */
			};
			var codeAfterChange = function(val,page){
				page.codeAfter=val; /* TODO Compile for syntax errors */
			};
			
			
			for (p in guide.sortedPages)
			{
				page=guide.sortedPages[p];
				if (page.type!==CONST.ptPopup)
				{
					if ((gPrefs.showLogic===2) || (gPrefs.showLogic===1 && (page.codeBefore!=="" || page.codeAfter!=="")))
					{
						pagefs=form.fieldset(page.name, page);
						if (gPrefs.showLogic===2 || page.codeBefore!==""){
							pagefs.append(form.codearea({label:'Before:',	value:page.codeBefore,change:codeBeforeChange} ));
						}
						if (gPrefs.showLogic===2 || page.codeAfter!==""){
							pagefs.append(form.codearea({label:'After:',	value:page.codeAfter,change:codeAfterChange} ));
						}
						t.append(pagefs);
					}
				}
			}
			
			break;
			
		case "tabsText":
			t.append(form.note(gPrefs.showText===1 ? 'All non-empty text blocks in this guide' : 'All text blocks in this guide'));
			for (p in guide.sortedPages)
			{
				page=guide.sortedPages[p];
				pagefs=form.fieldset(page.name, page);
				pageNameFields(pagefs,page);
				t.append(pagefs);
			}
			
			break;
		
		case "tabsAbout":
			fs = form.fieldset('About');
			fs.append(form.text({label:'Title:', placeholder:'Interview title', value:guide.title, change:function(val){guide.title=val;}}));
			fs.append(form.htmlarea({label:'Description:',value:guide.description,change:function(val){guide.description=val;}}));
			fs.append(form.text({label:'Jurisdiction:', value:guide.jurisdiction, change:function(val){guide.jurisdiction=val;}}));
			
			var l,list=[];
			for (l in Languages.regional){
				list.push(l,Languages.regional[l].Language+' {'+l+'} '+'('+Languages.regional[l].LanguageEN+')');
			} 
			fs.append(form.pickList({label:'Language:', value:guide.language, change:function(val){
				guide.language=val;
				Languages.set(guide.language);
				$('.A2JViewer','#page-viewer').html('');
				}},list));
			list=['blank','blank','tan','tan','tan2','tan2'];
			//if (guide.avatar==='tan') guide.avatar=1;
			if (guide.avatar===''||guide.avatar==='0') {guide.avatar='blank';}
			fs.append(form.pickList({label:'Avatar:',value:guide.avatar,change:function(val){
				guide.avatar=val;}},list));
			list=['Female','Female Guide','Male','Male Guide'];
			if (guide.guideGender!=='Male') {
				guide.guideGender='Female';
			}
			fs.append(form.pickList({label:'Guide Gender:',value:guide.guideGender,change:function(val){
				guide.guideGender=val;}},list));
			fs.append(form.htmlarea({label:'Credits:',value:guide.credits,change:function(val){guide.credits=val;}}));
			fs.append(form.text({label:'Approximate Completion Time:',placeholder:'',value:guide.completionTime,change:function(val){guide.completionTime=val;}}));
			t.append(fs);
			
			fs = form.fieldset('Layout');
			fs.append(form.pickImage({label:'Logo graphic:', placeholder: 'Logo URL',value:guide.logoImage, change:function(val){guide.logoImage=val;}}));
			fs.append(form.pickImage({label:'End graphic:', placeholder:'End (destination graphic) URL',value:guide.endImage, change:function(val){guide.endImage=val;}}));
			fs.append(form.pickList({label:'Mobile friendly?', value:guide.mobileFriendly, change:function(val){guide.mobileFriendly=val;}},['','Undetermined','false','No','true','Yes']));
			t.append(fs);
			
			fs = form.fieldset('Authors');
			var blankAuthor=new TAuthor();
			
			fs = form.fieldset('Revision History');
			fs.append(form.text({label:'Current Version:',value:guide.version,change:function(val){guide.version=val;}}));
			fs.append(form.htmlarea({label:'Revision Notes',value:guide.notes,change:function(val){guide.notes=val;}}));
			t.append(fs);
			
			fs=form.fieldset('Authors');
			fs.append(form.listManager({name:'Authors',picker:'Number of authors',min:1,max:12,list:guide.authors,blank:blankAuthor
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(ff,author){
						ff.append(form.text({  label:"Author's Name:", placeholder:'name',value:author.name,
							change:function(val,author){author.name=val;}}));
						ff.append(form.text({  label:"Author's Title:", placeholder:'title',value:author.title,
							change:function(val,author){author.title=val;}}));
						ff.append(form.text({  label:"Author's Organization:", placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val;}}));
						ff.append(form.text({  label:"Author's email:", placeholder:'email',value:author.email,
							change:function(val,author){author.email=val;}}));
					return ff;
				}}));
				
			t.append(fs);
			

			break;

		case 'tabsSteps':
		
			fs=form.fieldset('Start/Exit points');
			fs.append(form.pickpage({	value: guide.firstPage,label:'Starting Point:',	change:function(val){guide.firstPage=val;}}));
			fs.append(form.pickpage({	value: guide.exitPage,label:'Exit Point:',		change:function(val){guide.exitPage=val;}}));
			t.append(fs);
			fs=form.fieldset('Steps');
			var blankStep=new TStep();
			
			fs.append(form.listManager({grid:true,name:'Steps',picker:'Number of Steps',min:1,max:CONST.MAXSTEPS,list:guide.steps,blank:blankStep
				,save:function(newlist){
					guide.steps=newlist;
					updateTOC();
				}
				,create:function(ff,step){
						ff.append(form.text({  label:"Step Number:", placeholder:'#',value:step.number,
							change:function(val,step){
								step.number=val;
								updateTOC();}}));
						ff.append(form.text({  label:"Step Sign:", placeholder:'title',value:step.text,
							change:function(val,step){
								step.text=val;
								updateTOC();
							}}));
					return ff;
				}}));		
			t.append(fs);
			break;
	}
	form.finish(t);
};

function pageNameFields(pagefs,page)
{
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
				bf.append(form.text({value: b.value,label:'Default value',placeholder:'Default value',change:bntDevValChangeFnc}));
			}
			pagefs.append(bf);
		}
	}
}


function authorViewerHook()
{	//	### Attach Author editing buttons to the A2J viewer
	A2JViewer.IMG = "../viewer/images/";
	$('.A2JViewer').append('<div class="debugmenu"><button/><button/><button/></div>');
	$('.A2JViewer div.debugmenu button').first()
		.button({label:'Edit',icons:{primary:'ui-icon-arrowreturnthick-1-w'}}).click(function(){resumeEdit();})
//	.next().button({label:'Edit this page',icons:{primary:'ui-icon-pencil'}}).click(function(){gotoPageEdit(page.name)});//ui-icon-document-b
		.next()
		.button({label:'Test',icons:{primary:'ui-icon-pencil'}}).click(function(){$('.A2JViewer').toggleClass('test',100);})
		.next()
		.button({label:'Fill',icons:{primary:'ui-icon-pencil'}}).click(function(){A2JViewer.fillSample();});
}




function signin()
{
	if (gEnv!=='' && gStartArgs.templateURL!=='')
	{
		// ### Debug start option
		localGuideStart();
		return;
	}
	ws({cmd:'login'},
		/*** @param {{userid,nickname}} data */
		function (data){
			gUserID=data.userid;
			gGuideID=0;
			gUserNickName=data.nickname;
			if (gUserID!==0)
			{	// ### Successful signin.
				gotoTabOrPage('tabsGuides');
				ws({cmd:'guides'},listGuides);
				$('#splash').hide();
				$('#authortool').removeClass('hidestart');//.addClass('authortool').show();	
			}
			else
			{	// ### If user not logged in inform them and redirect to main site.
				var $d=$( "#dialog-confirm" );
				$d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'
							+'Please login through the main site first.'
							+'</p>');
			   $d.dialog( {
					width: 400, height:300, modal: true,
					buttons: {
						 Login: function()
						 {
							  window.location = '/';
						}
					}
				});
			}
		}
  );
}

function gotoPageView(destPageName)
{  // ### Navigate to given page (after tiny delay)
   window.setTimeout(function(){
      var page = gGuide.pages[destPageName]; 
      if (page === null || typeof page === "undefined")
      {
         dialogAlert({title:'Missing page', body:'Page is missing: '+ destPageName});
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
   },1);
}


function resumeEdit()
{
	$('#authortool').show();
	$('#page-viewer').hide();
	if ($pageEditDialog!==null){$pageEditDialog.dialog('open');}
}
/*function findPageDialog(pageName)
{
	return $('.page-edit-form').filter(function(){ return pageName == $(this).attr('rel')});
}
*/

function pageNameRelFilter(e,pageName)
{	// Return all DOM elements whose REL points to page name.
	var rel = 'PAGE '+pageName;
	return $(e).filter(function()
	{
		return rel === $(this).attr('rel');
	});
}

function pageEditSelected()
{	// Return currently selected page
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

function pageEditNew()
{	
	pageEditClone(gGuide.firstPage);
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
	updateTOC();
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
	$pageEditDialog.attr('title',page.name);
	$pageEditDialog.dialog({ 
		autoOpen:false,
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
	trace('gotoTabOrPage',target);

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
			if (gGuide) {guideSave();}
			break;
	}
}

function pageGOTOList()
{	// List of page ids we can go to including the built-ins like no where, exit.
	var pages=[CONST.qIDNOWHERE,CONST.qIDSUCCESS,CONST.qIDFAIL,CONST.qIDEXIT,CONST.qIDBACK,CONST.qIDRESUME];
	var p;
	for (p in gGuide.sortedPages)
	{
		var page=gGuide.sortedPages[p];
		if (page.type!==CONST.ptPopup){
			pages.push(page.name);
		}
	}
	return pages;
}


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







function blankGuide()
{
	var guide = new TGuide();

	guide.title="My guide";
	guide.notes="Guide created on "+new Date();
	guide.authors=[{name:'My name',organization:"My organization",email:"email@example.com",title:"My title"}];
	guide.jurisdiction="Description of this guide";
	guide.jurisdiction="My jurisdiction";
	guide.version="1";
	guide.sendfeedback=false;
	var page=guide.addUniquePage("Welcome");
	page.type="A2J";
	page.text="Welcome to Access to Justice";
	page.buttons=[{label:"Continue",next:"",name:"",value:""}];
	guide.steps=[{number:0,text:"Welcome"}];
	guide.vars= {}; 
	guide.sortedPages=[page];
	guide.firstPage=page.id;
	return guide;
}

function createBlankGuide()
{	// create blank guide internally, do Save As to get a server id for future saves.
	var guide = blankGuide();

	ws({cmd:'guidesaveas',gid:0, guide: exportXML_CAJA_from_CAJA(guide), title: guide.title},function(data){
		if (data.error!==undefined){
			setProgress(data.error);
		}
		else{
			var newgid = data.gid;//new guide id
			ws({cmd:'guides'},function (data){
				listGuides(data);
				ws({cmd:'guide',gid:newgid},guideLoaded);
			 });
		}
	});
}

/*** @param {{guides}} data */
function listGuides(data)
{
	var blank = {id:'a2j', title:'Blank Interview'};
	//gGuideID=0;
	
	var guideListNew =['<li class=guide gid="' + blank.id + '">' + blank.title + '</li>'];
	var guideListMy = [];
	var guideListSamples = [];
	$.each(data.guides,
		/*** @param {{owned,id,title}} g */
		function(key,g)
		{
			var str='<li class=guide gid="' + g.id + '">' + g.title + '('+g.id+')'+  '</li>';
			if (g.owned)
			{
				guideListMy.push(str);
			} else {
				guideListSamples.push(str);
			}
	});
	$('#guideListNew').html(guideListNew.join(''));
	$('#guideListMy').html(guideListMy.join(''));
	$('#guideListSamples').html(guideListSamples.join(''));

	$('li.guide').click(function(){$('li.guide').removeClass(SELECTED);$(this).addClass(SELECTED);});
	
	//$('#welcome').dialog('open');
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
		fs.append(form.text({label:'Name:',name:'pagename', value:page.name,change:function(val,page,form){
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
		fs.append(form.text({label:'Name:', value:page.name,change:function(val,page,form){
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
		pagefs.append(form.text(		{label:'Repeating Variable:',placeholder:'',	value:page.repeatVar,
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
					ff.append(form.text({label:'Variable:', placeholder:'Variable name', value: field.name,
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
		if (page.type === "A2J" || page.buttons.length > 0) {
			var blankButton=new TButton();
			
			fs=form.fieldset('Buttons');
			fs.append(form.listManager({name:'Buttons',picker:'Number of buttons',min:1,max:CONST.MAXBUTTONS,list:page.buttons,blank:blankButton
				,save:function(newlist){
					page.buttons=newlist; }
				,create:function(ff,b){
					ff.append(form.text({value: b.label,label:'Label:',placeholder:'button label',
						change:function(val,b){b.label=val;}}));
					ff.append(form.text({value: b.name, label:'Variable Name:',placeholder:'variable',
						change:function(val,b){b.name=val;}}));
					ff.append(form.text({value: b.value,label:'Default value',placeholder:'Default value',
						change:function(val,b){b.value=val;}}));
					ff.append(form.pickpage({value: b.next,label:'Destination:',
						change:function(val,b){
						b.next=val;}}));
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

/** @param {...}  status */
/** @param {...boolean}  showSpinner */
function setProgress(status, showSpinner)
{
	if (typeof status==='undefined'){
		status='';
	}
	if (status!==''){
		trace('setProgress',status);
	}
	if (showSpinner===true) {
		status += CONST.AJAXLoader;
	}
	$('#CAJAStatus').html( status );
}

function loadNewGuidePrep(guideFile,startTabOrPage)
{
	$('.pageoutline').html('');
}


function guideStart(startTabOrPage)
{ 
	if (startTabOrPage === ''){
		startTabOrPage='tabsPages';//'tabsAbout';
	}
	
	
	
	$('#splash').hide();
	$('#authortool').removeClass('hidestart');//.addClass('authortool').show
	
	//$('#tabviews').tabs( { disabled:false});
	$('#tabsVariables .tabContent, #tabsLogic  .tabContent, #tabsSteps .tabContent, #tabsAbout .tabContent, #tabsConstants .tabContent, #tabsText .tabContent').html("");
	
	if (makestr(startTabOrPage)===""){
		startTabOrPage="PAGE "+(gGuide.firstPage);
	}
	//trace("Starting location "+startTabOrPage);
	
	gotoTabOrPage(startTabOrPage);
	updateTOC();
	
	//$('#guidepanel ul li a:first').html(gGuide.title);
	$('#guidetitle').html(gGuide.title);
	
	
	// ### Upload file(s) to current guide
	$('#fileupload').addClass('fileupload-processing');
	if (gGuideID!==0) {
		$('#fileupload').fileupload({
			 url:CONST.uploadURL+gGuideID,
			 dataType: 'json',
			 done: function (e, data) {
				setTimeout(updateAttachmentFiles,1);
			 },
			 progressall: function (e, data) {
				  var progress = parseInt(data.loaded / data.total * 100, 10);
				  $('#progress .bar').css('width',	progress + '%'
				);
			}
		});
		updateAttachmentFiles();
	}

	
	buildMap();
	
	
	if (gEnv!=='' && gStartArgs.getDataURL!=='') {
		localGuidePlay();
		return;
	}
}


function updateAttachmentFiles( )
{	// Load list of uploaded existing files:
	gGuide.attachedFiles={};
	$.ajax({
		  // Uncomment the following to send cross-domain cookies:
		  //xhrFields: {withCredentials: true},
		  url: $('#fileupload').fileupload('option', 'url'),
		  dataType: 'json',
		  context: $('#fileupload')[0]
	 }).always(function () {
		  $(this).removeClass('fileupload-processing');
	 }).done(function (result) {
		  gGuide.attachedFiles = result.files;
		  $('#attachmentFiles').empty();
			$.each(gGuide.attachedFiles, function (index, file) {
				 $('<tr><td>'+
					'<a target=_blank href="'+gGuidePath+(file.name)+'">'+file.name+'</a>'
					+'</td><td>'+file.size+'</td></tr>').appendTo('#attachmentFiles');
			});	
	 });
}


function updateTOC()
{	// Build outline for entire interview includes meta, step and question sections.
	var inSteps=[];
	var popups="";
	var s;
	for (s in gGuide.steps)
	{
		inSteps[s]="";
	}
	var p;
	for (p in gGuide.sortedPages)
	{
		var page = gGuide.sortedPages[p];
		var f;
		var ft='';
		for (var f in page.fields) {
			// List the field types.
			var field = page.fields[f];
			ft += '<span class=info>' + field.type +'</span>';
		}
		var tip = decodeEntities(page.text).substr(0,64) + ft;
		var plink= '<li class="unselectable" rel="PAGE '+page.name.asHTML()+'">'+page.name.asHTML()
			+' <span class="tip">'+tip+'</span>' +'</li>';
		if (page.type===CONST.ptPopup){
			popups += plink;
		}
		else{
			inSteps[page.step] += plink;
		}
	}	
	var ts="";
	for (s in gGuide.steps)
	{
		ts+='<li rel="STEP '+s+'">STEP '+gGuide.steps[s].number+". "+gGuide.steps[s].text+"</li><ul>"+inSteps[s]+"</ul>";
	}
	$('.pageoutline').html("<ul>"
		+ ts //'<li target="tabsSteps">'+lang.tabSteps+'</li><ul>'+ts+'</ul>'
		+ '<li rel="tabsPopups">'+Languages.en('Popups')+'</li><ul>'+popups+'</ul>'
		+"</ul>");
	
	// JM Clicking a step toggle slides step's page list.
	$('.pageoutline li[rel^="STEP "]').click(function(){
		$(this).next().slideToggle(300);
	});

	// JM Only 'select' Pages, not Steps
	$('.pageoutline li[rel^="PAGE "]')
		.click(function(e){
			if (!e.ctrlKey){
				$('.pageoutline li').removeClass(SELECTED);
			}
			$(this).toggleClass(SELECTED);
		})
		.dblclick(function (){
			var rel=$(this).attr('rel');
			$('.pageoutline li').removeClass(SELECTED);
			$(this).addClass(SELECTED);
			gotoTabOrPage(rel);
		});
}


/**
 * Parses data returned from the server
 * When guide file is finally downloaded, we can parse it and update the UI.
*/
function guideLoaded(data)
{
	gGuideID=data.gid;
	var cajaDataXML=$(jQuery.parseXML(data.guide));
	gGuide =  parseXML_Auto_to_CAJA(cajaDataXML);
	$('li.guide[gid="'+gGuideID+'"]').html(gGuide.title);
	/*
		var cajaDataXML=$(data.guide);  
		var description = makestr(cajaDataXML.find('DESCRIPTION').text());
		var pages=[];
		cajaDataXML.find("QUESTION").each(function() {
			QUESTION = $(this);
			pages.push(QUESTION.attr("ID")+" "+ QUESTION.attr("NAME"));
		});
	*/
	gGuidePath=urlSplit(data.path).path; 
	guideStart('');
	setProgress('');
}

function styleSheetSwitch(theme)
{
	//<link href="cavmobile.css" title="cavmobile" media="screen" rel="stylesheet" type="text/css" />
	trace('styleSheetSwitch',theme); 
	if (theme==='A2J') {
		theme = "jQuery/themes/"+theme.toLowerCase()+"/jquery-ui.css";
	}
	else{
		theme = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/"+theme.toLowerCase()+"/jquery-ui.css";
		//1.8.23
	}
	$('link[title=style]').attr('href',theme);
}

function editButton()
{	// ### For the simple editor, handle simple styles. 
	switch ($(this).attr('id')){
		case 'bold': document.execCommand('bold', false, null); break;
		case 'italic': document.execCommand('italic', false, null); break;
		case 'indent': document.execCommand('indent', false, null); break;
		case 'outdent': document.execCommand('outdent', false, null); break;
	}
}


/*
TGuide.prototype.IndexAlphaHTML=function()
{	// Build outline of just pages
	var txt="";
	for (var p in this.sortedPages)
	{
		var page = this.sortedPages[p]; 
		txt += '<li target="PAGE '+page.name.asHTML()+'">'+page.name.asHTML()+'</li>';
	}
	return "<ul>" + txt +"</ul>";
}
*/



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
			if (b.next===findName){
				matches.push({name:page.name,field:'Button '+b.label,text:b.label});
			}
		}
	}
	return matches;
};



TGuide.prototype.varDelete=function(name){
	var guide=this;
	delete guide.vars[name.toLowerCase()];
	gGuide.noviceTab('tabsVariables',true);
};
function varAdd()
{  // Add new variable and edit.
	var v= new TVariable();
	varEdit(v);
}
function varEdit(v/*TVariable*/)
{
	$('#varname').val(v.name);
	$('#vartype').val(v.type);
	$('#varcomment').val(v.comment);
	$('#varrepeating').attr('checked', v.repeating);
	$('#var-edit-form').data(v).dialog({
		autoOpen:true,
			width: 450,
			height: 400,
			modal:true,
			close: function(){
			},
			buttons:[
			{text:'Delete', click:function(){
				var name= $(this).data().name;
				if (name===""){
					return;
				}
				dialogConfirmYesNo({title:'Delete variable '+name,message:'Delete this variable?',name:name,Yes:
				/*** @this {{name}} */
				function(){
					$('#var-edit-form').dialog("close");
					gGuide.varDelete(this.name);
				}});
			}},
			{text:'Close',click:function(){ 
				var name= $('#varname').val();
				if(name!==v.name)//rename variable
				{
					delete gGuide.vars[v.name.toLowerCase()];
					v.name=name;
					gGuide.vars[name.toLowerCase()]=v;
				}
				v.type=$('#vartype').val();
				v.comment=$('#varcomment').val();
				v.repeating=$('#varrepeating').is(':checked');
				gGuide.noviceTab('tabsVariables',true);
				$(this).dialog("close");
			 }}
		]});
	
}
TGuide.prototype.buildTabVariables = function (t)
{
	var guide = this;
	var th=html.rowheading(["Name","Type","Repeating","Comment"]); 
	var sortvars=[];
	var vi;
	for (vi in guide.vars){
		sortvars.push(guide.vars[vi]);
	}
	sortvars.sort(function (a,b){return sortingNaturalCompare(a.name,b.name);});
	var tb='';
	for (vi in sortvars)
	{
		var v=sortvars[vi];
		tb+=html.row([v.name,v.type,v.repeating,v.comment]);
	}

	t.append('<table class="A2JVars">'+th + '<tbody>'+ tb + '</tbody>'+"</table>");
	$('tr',t).click(function(){
		varEdit(gGuide.vars[$('td:first',this).text().toLowerCase()]);
	});
};


var form={
	id:0
	
	,editorAdd:function(elt){
		if (elt.parent().parent().find('.texttoolbar').length===0){
			$('#texttoolbar').clone(true,true).attr('id','').prependTo(elt.parent()).show();
		}
	}
	,editorRemove:function(elt){
		//$('#texttoolbar').hide();
	}
	,change: function(elt,val){
		var form= $(elt).closest('[name="record"]');
		$(elt).data('data').change.call(elt,val,form.data('record'),form);
	}
	 ,h1:function(h){
		return $("<h1>"+h+"</h1>");}
		
	,h2:function(h){
		return $("<h2>"+h+"</h2>").click(function(){$(this).next().toggle();});
	}
		
	,noteHTML:function(kind,t){
		return '<div class="ui-widget"><div style="margin-top: 20px; padding: 0 .7em;" class="ui-state-highlight ui-corner-all"><p><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-'+kind+'"></span>'+t+'</div></div>';
	}
	,note:function(t){
		return $(form.noteHTML('info',t));
	}
	,noteAlert:function(t){
		return $(form.noteHTML('alert',t));
	}
	,fieldset:function(legend,record){
		return $('<fieldset name="record"><legend >'+legend+'</legend></fieldset>').data('record',record);//.click(function(){$(this).toggleClass('collapse')});
	}
	,record:function(record){
		return $('<div name=record class=record/>').data('record',record);
	}
	,div:function(){
		return $('<div />');
	}
	//,number:    function(label,value,minNum,maxNum,handler){
	//	return "<label>"+label+'</label><input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"> ';}
	
	,checkbox: function(data){
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span  class=editspan > <input class="ui-state-default ui-checkbox-input" type="checkbox" />'+data.checkbox+'</span></div>');
		$('input',e).blur(function(){
			form.change($(this),$(this).is(':checked'));}).attr( 'checked',data.value===true).data('data',data);
		return e;
	}
	
	
	,pickpage:function(data){ 
		//data.value = gGuide.pageDisplayName(data.value); 

		var dval = gGuide.pageDisplayName(data.value);
			
		var e =$((typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
				+ '<span class=editspan><input class="  ui-combobox-input editable autocomplete picker page dest" type="text" ></span>');
		$('.picker',e).blur(function(){
			var val=$(this).val();
			form.change($(this),val);
		}).data('data',data).val(decodeEntities(dval));
		$('.autocomplete.picker.page',e).autocomplete({ source: pickPage, html: true,
	      change: function () { // if didn't match, restore to original value
	         var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex($(this).val().split("\t")[0]) + "$", "i");
	         var newvalue = $(this).val();//.split("\t")[0];
				//trace(newvalue);
	         $.each(gGuide.sortedPages, function (p, page) {
					if ((page.type!==CONST.ptPopup) && (matcher.test(page.name)))
					{
						newvalue = gGuide.pageDisplayName(page.name);
						return false;
					}
					return true;
	         });
	         $(this).val(newvalue); 
	      }})
			.focus(function () {
			   $(this).autocomplete("search");
			});
		return e;
	}
	,text: function(data){
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan> <input class="ui-widget editable" '+
			//'placeholder="'+data.placeholder+'" '+
			'type="text" /> </span></div>');
		//if (typeof data.class!=='undefined') $('input',e).addClass(data.class);
		//if (typeof data.width!=='undefined') $('input',e).css('width',data.class);
		$('input',e).blur(function(){
			form.change($(this),$(this).val());
			trace('Saving text',$(this).val());
			}).val(decodeEntities(data.value)).data('data',data);
		return e;
	}
	,htmlFix:function(html){
		return html.replace(/<br\>/gi,"<BR/>"); ///\<br\>/gi
		//return html.replace("<br>","<BR/>","gi");
	}
	,htmlarea: function(data){//label,value,handler,name){ 
		form.id++;
		var e= $('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan>'
			+'<div contenteditable=true class="  htmledit  text editable taller" id="tinyMCE_'+form.id+'"  name="'+form.id+'" rows='+1+'>'
			+data.value+'</div></span></div>');
		$('.editable',e).focus(function(){$(this).addClass('tallest');form.editorAdd($(this));}).blur(function(){
		//$(this).removeClass('tallest');
		form.editorRemove(this);
		form.change($(this), form.htmlFix($(this).html()));}).data('data',data) ;
		return e;
	} 
	,textArea: function(data){
		var rows=2;
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><textarea  class="     text editable taller" rows='+rows+'>'+data.value+'</textarea></span></div>');
		$('.editable',e).blur(function(){form.change($(this),$(this).html());}).data('data',data);
		return e;
	}
	
	,pickFile : function(mask)
	{	
		var e=$('<span class="fileinput-button"><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary"><span class="ui-button-icon-primary ui-icon ui-icon-plus"></span><span class="ui-button-text" >Upload...</span></button><input class="fileupload" type="file" name="files[]"/></span>');
		//.addClass('fileupload-processing')
		if (gGuideID!==0) {
			$('.fileupload',e).fileupload({
				 url:CONST.uploadURL + gGuideID,
				 dataType: 'json',
				 done: function (e, data) {
					var filename = data.result.files[0].name;
					$(e.target).closest('div').find('input[type=text]').val(filename);
					//form.change($(this),filename);
					setTimeout(updateAttachmentFiles,250);
				 },
				 progressall: function (e, data) {
					  var progress = parseInt(data.loaded / data.total * 100, 10);
					  $('#progress .bar').css(
							'width',
							progress + '%'
					  );
				 }
			});
		}
		return e;
	}
	
	
	,pickAudio: function(data){
		return form.text(data).append(form.pickFile(''));
	}	
	,pickImage:function(data){ 
		return form.text(data).append(form.pickFile(''));
	}
	,pickVideo:function(data){
		return form.text(data).append(form.pickFile(''));
	}
	,pickXML:function(data){
		return form.text(data).append(form.pickFile(''));
	}
	
	,clear:function(){
		form.codeCheckList=[];
	}
	,finish:function(div){
	}
	,codeCheckIntervalID:0
	,codeCheckList:[]
	,codeCheckSoon:function(elt){
		if (form.codeCheckIntervalID===0){
			form.codeCheckIntervalID=setInterval(form.codeCheckInterval,100);
		}
		form.codeCheckList.unshift(elt);
	}
	,codeCheckInterval:function(){ // syntax check one code block
		if (form.codeCheckList.length===0){
			clearInterval(form.codeCheckIntervalID);
			form.codeCheckIntervalID=0;
		}
		else{
			form.codeCheck(form.codeCheckList.pop());
		}
	}
	,codeFix:function(html){
		return html.replace(/<br\>/gi,"<BR/>");
	}
	,codeCheck:function(elt){
		$(elt).removeClass('haserr');
		$('SPAN',$(elt)).remove();
		var code=form.codeFix($(elt).html());
		//TODO remove markup
		var script = gLogic.translateCAJAtoJS(code);
		var tt="";
		var t=[];
		if (script.errors.length>0)
		{
			$(elt).addClass('haserr');
		/*
			for (l=0;l<lines.length;l++)
			{
				var err=null;
				for (var e in script.errors)
					if (script.errors[e].line == l)
						err=script.errors[e];
				if (err == null)
					t.push(lines[l]);
				else
				{
					t.push('<span class="err">'+lines[l]+"</span>");
				}
			}
			*/
			var e;
			for (e in script.errors)
			{
				var err=script.errors[e];
				//tt+=form.noteHTML('alert',"<b>"+err.line+":"+err.text+"</b>");
				
				$('BR:eq('+ (  err.line) +')',$(elt)).before(
					//(err.line)
					//'<span class="err">'+err.text+'</span>'
					//'<span class="ui-widget">
					'<span style="margin-top: 20px; padding: 0 .7em;" class="ui-state-highlight ui-corner-all"><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-'+'alert'+'"></span>'+err.text+'</span></span>'
					//</span>'
					);				
			}
		}
		if( gPrefs.showJS)
		{	// print JavaScript
			t=[];
			t.push('JS:');
			var l;
			for (l=0;l<script.js.length;l++)
			{
				t.push(script.js[l]);
			}
			tt+=("<BLOCKQUOTE class=Script>"+t.join("<BR>")+"</BLOCKQUOTE>");
		}
		//tt=propsJSON('SCRIPT',script);
		$('.errors',$(elt).closest('.editspan')).html(tt);
	}
	,codearea:function(data){ 
		form.id++;
		var e= $('<div>'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<div class=editspan><div spellcheck="false" contenteditable=true spellcheck=false class="text editable taller codeedit"  rows='+4+'>'+data.value+'</div><div class="errors"></div></div></div>');
		$('.editable',e).blur(function(){
			form.codeCheckSoon(this);
			$('SPAN',$(this)).remove();
			form.change($(this),form.codeFix($(this).html()));
			}).data('data',data);
		form.codeCheckSoon($('.codeedit',e));
		return e;
	}

	,pickList:function(data,listValueLabel){//list is array to ensure preserved order. Note: js object properties don't guarantee order
		var c="";
		var o;
		for (o=0;o<listValueLabel.length;o+=2){
			c += '<option value="'+listValueLabel[o]+'">'+listValueLabel[o+1]+'</option>';
		}
		var e =$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><select class="     ui-select-input">'+c+'</select></span></div>');
		$('.ui-select-input',e).change(function(){form.change($(this),$('option:selected',this).val());}).data('data',data).val(data.value);
		//trace(data.value,$('.ui-select-input',e).val());
		if ($('.ui-select-input',e).val()!==String(data.value))
		{
			$('select',e).append($('<option value="'+data.value+'">{'+data.value+'}</option>'));
			$('.ui-select-input',e).val(data.value);
		}
		return e;
	}
	,pickStep:function(data){
		var list=[];
		var s;
		for (s=0;s<gGuide.steps.length;s++){
			var step = gGuide.steps[s];
			list.push(s,step.number+". "+ (step.text));
		}
		return form.pickList(data,list);
	}
/*
	,tableRows:function(name,headings,rowList){
		var $tbl=$('<table/>').addClass('list').data('table',name).attr('list',name);
		var tr;
		var col;
		if (typeof headings==="object")
		{
			tr="<tr valign=top>";
			for (col in headings)
			{
				tr+="<th>"+headings[col]+"</th>";
			}
			tr+="</tr>";
			$tbl.append($(tr));
		}
		var row;
		for (row in rowList){
			var $row=$("<tr valign=top/>");
			if (rowList[row].visible===false){
				$row.addClass('hidden');
			}
			//$row.append($('<td class="editicons"/>').append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/><span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
			for (col in rowList[row].row)
			{
				$row.append($("<td/>").append(rowList[row].row[col]));
			}
			
			$tbl.append($row);
			$row.data('record',rowList[row].record);
			
		}
		$('tbody',$tbl).sortable({
			//handle:"td:eq(0)",
			handle:"td:eq(0) .sorthandle",
			update:function(){ }})//.disableSelection();
		;
		return $tbl;
	}
*/
	,tableRowCounter:function(name,label,minelts,maxelts,value)
	{	//let user choose number of said item
		var c=$('<label/>').text(label);
		var s='<select list="'+name+'" class="  ui-select">';
		var o;
		for (o=minelts;o<=maxelts;o++)
		{
			s+="<option>"+o+"</option>";
		}
		s+="</select>";
		return $('<div/>').append(c.after(s).change(function(){form.tableRowAdjust(name,$('option:selected',this).val());}).val(value));
	}
	
	,tableRowAdjust:function(name,val)
	{	// Adjust number of rows. set visible for rows > val. if val > max rows, clone the last row.
		var $tbl = $('table[list="'+name+'"]');
		var settings=$tbl.data('settings');
		var $tbody = $('tbody',$tbl);//'table[list="'+name+'"] tbody');
		var rows = $('tr',$tbody).length;		
		var r;
		for (r=0;r<rows;r++){
			$('tr:nth('+r+')',$tbody).showit(r<val);
		}
		for (r=rows;r<val;r++){
			form.listManagerAddRow($tbl,$.extend({},settings.blank));
		}
		form.listManagerSave($tbl);
	}
	
	,listManagerSave:function($tbl){// save revised order or added/removed items
		var settings=$tbl.data('settings');
		var list=[];
		$('tr',$tbl).not(':hidden').each(function(idx){ //:gt(0)
			list.push($(this).data('record'));
		});
		settings.save(list);
		$('select[list="'+settings.name+'"]').val(list.length);
	}
	,listManagerAddRow:function($tbl,record){
		var settings=$tbl.data('settings');
		var $row=$('<tr valign=top class="ui-corner-all" name="record"/>');
		$row.append($('<td class="editicons"/>')
			.append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/>'
			+'<span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
		$row.append($('<td/>').append(settings.create(form.div(),record)));
		$row.data('record',record); 
		$tbl.append($row);
	}
	,listManager:function(settings){
		//###  data.name:'Fields' data.,picker:'Number of fields:',data.min:0,data.max:CONST.MAXFIELDS,data.list:page.fields,data.blank:blankField,data.save=function to save,data.create=create form elts for record
		var div = $('<div/>');
		var $tbl=$('<table/>').addClass('list').data('settings',settings).attr('list',settings.name);
		div.append(form.tableRowCounter(settings.name,settings.picker,settings.min,settings.max,settings.list.length));
		var i;
		//trace(div.html());
		for (i=0;i<settings.list.length;i++){
			form.listManagerAddRow($tbl,settings.list[i]);
		}
		//trace(settings.list);
		$('tbody',$tbl).sortable({
			handle:"td .sorthandle",
			update:function(event,ui){
				form.listManagerSave((ui.item.closest('table')));
			}});
		div.append($tbl);
		/*(		div.append($('<button id="newrow"/>').button({label:'Add',icons:{primary:"ui-icon-plusthick"}}).click(function(){
			addRow($.extend({},settings.blank));
			save();
		}));

		*/
		return div;
	}
	
};



function guideSave()
{	// Save current guide, but only if the XML has changed since last save to avoid upload overhead. 
	if (gGuide!==null && gGuideID!==0)
	{
		setProgress('Saving '+gGuide.title,true);
		var xml = exportXML_CAJA_from_CAJA(gGuide);
		if (xml!==gGuide.lastSaveXML) {
			gGuide.lastSaveXML=xml;
			ws( {cmd:'guidesave',gid:gGuideID, guide: xml, title:gGuide.title}, function(response){
				setProgress((makestr(response.error)!=='') ? response.error : 'Saved');
			});
		}
		else
		{
			setProgress('No changes since last save');
		}
	}
}








function ws(data,results)
{	// Contact the webservice to handle user signin, retrieval of guide lists and load/update/cloning guides.
	$.ajax({
		url:'CAJA_WS.php',
		dataType:'json',
		type: 'POST',
		data: data,
		success: function(data){ 
			//trace(String.substr(JSON.stringify(data),0,299));
			results(data);
		},
		error: function(err,xhr) {
			dialogAlert({title:'Error loading file',body:xhr.responseText});
			setProgress('Error: '+xhr.responseText);
		}
	});
}  




function main()
{   // Everything loaded, execute.
   Languages.set(Languages.defaultLanguage);

	$('.authorenv').text(gEnv);
	$('.authorver').html(CONST.A2JVersionNum+" "+CONST.A2JVersionDate);
	$('#cajainfo').attr('title',versionString());
	//$('#guideSave').button({label:'Save Now',icons:{primary:"ui-icon-disk"}}).click(function(){guideSave();});
	$('#settings').button({label:'Settings',icons:{primary:"ui-icon-gear"}}).click(function(){$('#settings-form').dialog('open');});
	
	/* JPM
	Expand/Collapse button for pages list.  
	*/
	$('#expandCollapse')
		.button({label:'Collapse All',icons:{primary:"ui-icon-circle-minus"}})
		.click(function(){
			expandCollapsePageList();
		});
	
	// JPM Handles Expand/Collapse button on pages list
	function expandCollapsePageList() {
		var ecText = $("#expandCollapse").text();
		if (ecText == "Collapse All") {
			$("#expandCollapse").html("Expand All");
			$("#CAJAOutline > ul > li + ul").slideUp(300);
			$('#expandCollapse').button({label:'Expand All',icons:{primary:"ui-icon-circle-plus"}});
		}
		else {
			$("#expandCollapse").html("Collapse All");
			$("#CAJAOutline > ul > li + ul").slideDown(300);
			$('#expandCollapse').button({label:'Collapse All',icons:{primary:"ui-icon-circle-minus"}});
		}
	}
	
	
	//$('#guideCreate').button({icons:{primary:"ui-icon-document"}}).click(function(){createBlankGuide();	});
	$('#guideOpen').button({label:'Open', disabled:false, icons:{primary:"ui-icon-disk"}}).click(function(){
		//alert('guideOpen');
		var $li=$('li.guide.'+SELECTED).first();
		var gid=$li.attr('gid');
		var guideFile=$li.text();
		//$('li.guide[gid="'+gid+'"]').html('Loading guide '+guideFile+AJAXLoader).addClass('.warning');
		setProgress('Loading guide '+guideFile,true);
		loadNewGuidePrep(guideFile,'');
		$('#splash').hide();
		if(gid==='a2j'){
			createBlankGuide();
		}
		else{
			ws({cmd:'guide',gid:gid},guideLoaded);
		}
	 });
	
	
	
	$('#guideZIP').button({  disabled:false, icons:{primary:"ui-icon-disk"}}).click(function()
	{	// 01/08/2014 ZIP the guide and related files. 
		function guideZipped(data)
		{ 
			setProgress('');
			gGuideID=data.gid;
			if (data.zip!==''){
				window.open( data.zip);
			}
		}
		setProgress('Generating ZIP',true);
		ws({cmd:'guidezip',gid:gGuideID},guideZipped);
	 });
	
	
	$('#guideDownload').button({  disabled:false, icons:{primary:"ui-icon-disk"}}).click(function()
	{	// 05/08/2014 Download as .a2j file
		downloadTextFile( exportXML_CAJA_from_CAJA(gGuide), gGuide.filename);
	 });
	
	
	
	$('#guideClone').button({label:'Clone', disabled:true, icons:{primary:"ui-icon-disk"}}).click(function(){
		//var $li=$('li.guide.'+SELECTED).first();
		//var gid=$li.attr('gid');
		dialogAlert({title:'Clone interview'});
	 });

	
	$('.guidemenu ul li').click(function(){
		gotoTabOrPage($(this).attr('ref'));
	});

	$(document).on("click", '.editicons .ui-icon-circle-plus',function(){// clone a table row
		var $tbl=$(this).closest('table');
		var row = $(this).closest('tr');
		var settings=$tbl.data('settings');
		if ($('tbody tr',$tbl).length>=settings.max) {return;}
		row.clone(true,true).insertAfter(row).fadeIn();
		row.data('record',$.extend({},row.data('record')));
		form.listManagerSave($(this).closest('table'));
	});
	$(document).on("click", ".editicons .ui-icon-circle-minus",  function(){// delete a table row
		var $tbl=$(this).closest('table');
		var settings=$tbl.data('settings');
		if ($('tbody tr',$tbl).length<=settings.min) {return;}
		$(this).closest('tr').remove();
		form.listManagerSave($tbl);
	});
	
	$('#tabsMapper button').first()
		.button({disabled:true,label:'Fit',icons:{primary:'ui-icon-arrow-4-diag'}}).next()
		.button({label:'Zoom in',icons:{primary:'ui-icon-zoomin'}}).next()
		.button({label:'Zoom out',icons:{primary:'ui-icon-zoomout'}});
	$('#tabsMapper button').click(mapZoomClick);
	
	$('.tabsPages .tabFooter button').first()
		.button({label:'Edit',icons:{primary:'ui-icon-pencil'}}).click(function(){
			gotoPageEdit(pageEditSelected());
		}).next()
		.button({label:'New',icons:{primary:'ui-icon-document'}}).click(function(){
			pageEditNew();
		}).next()
		.button({label:'Clone',icons:{primary:'ui-icon-newwin'}}).click(function(){
			pageEditClone(pageEditSelected());
		}).next()
		.button({label:'Delete',icons:{primary:'ui-icon-trash'}}).click(function(){
			pageEditDelete(pageEditSelected());
		});
	 
	 
	 
	
	$('#vars_load').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	$('#vars_load2').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	
	$('#showlogic').buttonset();
	$('#showlogic1').click(function(){gPrefs.showLogic=1;gGuide.noviceTab("tabsLogic",true);});
	$('#showlogic2').click(function(){gPrefs.showLogic=2;gGuide.noviceTab("tabsLogic",true);});
	
	$('#showtext').buttonset();
	$('#showtext1').click(function(){gPrefs.showText=1;gGuide.noviceTab("tabsText",true);});
	$('#showtext2').click(function(){gPrefs.showText=2;gGuide.noviceTab("tabsText",true);});
	
	//$('#showpagelist').buttonset();
	//$('#showpagelist1').click(function(){gPrefs.showPageList=1;$('#CAJAOutline, #CAJAIndex').hide();$('#CAJAOutline').show();});
	//$('#showpagelist2').click(function(){gPrefs.showPageList=2;$('#CAJAOutline, #CAJAIndex').hide();$('#CAJAIndex').show();});


   //   if (typeof initAdvanced != "undefined")      initAdvanced();




   //Ensure HTML possible for combo box pick list
   //https://github.com/scottgonzalez/jquery-ui-extensions/blob/master/autocomplete/jquery.ui.autocomplete.html.js
   $.extend($.ui.autocomplete.prototype, {
      _renderItem:  function (ul, item) {
         return $("<li></li>")
				.data("item.autocomplete", item)
				//.append($("<a></a>")[this.options.html ? "html" : "text"](item.label))
				.append($("<a></a>").html(item.label))
				.appendTo(ul);
      }
   });

   // Tips
   //window.setTimeout(hovertipInit, 1);


   // Draggable
   $('.hotspot').draggable({ containment: 'parent' }).resizable().fadeTo(0.1, 0.9);

   // Menu bar
	//$('#cajasettings').menu();
	$('#cajasettings a').click(function(){
			var attr = $(this).attr('href'); 
			switch (attr) {
				case '#sample': 
					loadGuideFile($(this).text(), "");
					break;
				case '#bold': document.execCommand('bold', false, null); break;
				case '#italic': document.execCommand('italic', false, null); break;
				case '#indent': document.execCommand('indent', false, null); break;
				case '#outdent': document.execCommand('outdent', false, null); break;
				case '#theme':
					styleSheetSwitch($(this).text());
					break;
				default:
					//trace('Unhandled ' + attr);
			}
			return false;
		});
	
	$('#settings-form').dialog({ 
		autoOpen:false,
		width: 600,
		height: 500,
		modal: true,
		buttons:[
		{text:'Close',click:function(){ 
			$(this).dialog("close");
		 }}
	]});


	$('#page-viewer').hide();
	$('#var-add').button({icons:{primary:'ui-icon-new'}}).click(varAdd);
	//$('#var-del').button({icons:{primary:'ui-icon-trash'}}).click(varDel);
	
	
	$( "#bold" ).button({label:'B'}).click(editButton);
	$( "#italic" ).button({label:'I'}).click(editButton);
	$( "#link" ).button({text:false, icons: {primary:'ui-icon-link'}}).click(editButton);
	$( "#popup" ).button({label:'P'}).click(editButton);
	
	$( document ).tooltip({
		items: ".htmledit a", //skip title for now [title]",
		content: function(){
			var element=$(this);
			if (element.is("[title]")) {return element.attr("title");}
			if (element.is("a")) {return element.attr("href");}
			return '';
		}
	});
	
	// call guideSave every 5 minutes
	setInterval(function() {
      if (gGuide) {
			guideSave();
		}
	}, 5*60*1000);
	
	
	$('#guideupload').fileupload({
		 url:CONST.uploadGuideURL,
		 dataType: 'json',
		 done: function (e, data) {
			setTimeout(signin,500);
		 },
		 progressall: function (e, data) {
			  var progress = parseInt(data.loaded / data.total * 100, 10);
			  $('#guideuploadprogress .bar').css('width',	progress + '%'
			);
		}
	});
	
	signin();
}

$(document).ready(main);

/* */
