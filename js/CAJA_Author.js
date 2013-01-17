/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
 	Authoring App GUI
	03/30/2012
*/

var prefs= {
	ShowLogic : 1,
	ShowText : 1,
	ShowPageList: 1
}

gDev=0;

/*       */
function DEBUGSTART(){
	gUserNickName='Tester';
	gUserID=0;
	$('#welcome .tabContent').html("Welcome "+gUserNickName+" user#"+gUserID+'<p id="guidelist"></p>');
	var SAMPLES = [
		//"/a2j4guides/Logic Tests.a2j",
		"tests/data/A2J_ULSOnlineIntake081611_Interview.xml",
		"tests/data/A2J_ULSOnlineIntake081611_Interview.xml#1b Submit Application for Review",
		"tests/data/Field Characters Test.a2j",
		"tests/data/A2J_FieldTypesTest_Interview.xml#1-1 Name",
		"tests/data/A2J_NYSample_interview.xml",
		"tests/data/Field Characters Test.a2j#4-1 If thens",
		"tests/data/Field Characters Test.a2j#1-5 Fields Test 1",
		"tests/data/Field Characters Test.a2j#0-1 Intro",
		"tests/data/CBK_CAPAGETYPES_jqBookData.xml", 
		"tests/data/CBK_CAPAGETYPES_jqBookData.xml#MC Choices 3: 4 choices", 
		"tests/data/A2J_MobileOnlineInterview_Interview.xml",
		"tests/data/CBK_EVD03_jqBookData.xml"
	];
	$(SAMPLES).each(function(i,elt){
		$('#samples, #guidelist').append('<li><a href="#sample">'+elt+'</a></li>')
		
	})
	loadGuideFile($('a[href="#sample"]').first().text(), "");
	$('#splash').hide();
	//$('#welcome').hide();
} /* */



$(document).ready(CAJA_Initialize)

function CAJA_Initialize() {
   // Everything loaded, execute.
   lang.set('en');


	//$('#welcome, #texttoolbar').hide();
	
	$('#welcome').dialog({autoOpen:false, height:500, width:700, close:function(event,ui){ 
		if (typeof event.originalEvent=='object')	signinask();
	}} );
	

//	$('.tabset').tabs();
	//$('#guidepanel').tabs();
	//$('table.list').hover(function(){$('.editicons',this).showIt(1);},function(){$('.editicons',this).showIt(0);});
	
	//$('#guidepanel > ul').append('<span><button id="guideSave">Save</button><button id="settings">Settings</button></span>'
	//	+'<a href="#" id="guideClose" class="ui-dialog-titlebar-close ui-corner-all"><span class="ui-icon ui-icon-close"></span></a>'
		//+'<a href="#" id="settings" class="ui-dialog-titlebar-close ui-corner-all"><span class="ui-icon ui-icon-gear"></span></a>'
	//	);
//	$('#guideSave').button({icons:{primary:"ui-icon-disk"}}).click(function(){guideSave();});
//	$('#settings').button({icons:{primary:"ui-icon-gear"}}).click(function(){$('#settings-form').dialog('open');});
	$('#guideSave').button({label:'Save',icons:{primary:"ui-icon-disk"}}).click(function(){guideSave();});
	$('#guideSaveAs').button({label:'Save as',disabled:true,  icons:{primary:"ui-icon-disk"}}).click(function(){      });
	$('#guideNew').button({label:'New', disabled:true, icons:{primary:"ui-icon-disk"}}).click(function(){      });
	$('#guideOpen').button({label:'Open',disabled:true, icons:{primary:"ui-icon-disk"}}).click(function(){    });
	$('#guideClose').button({label:'Close',icons:{primary:"ui-icon-close"}}).click(function(){guideClose();});
	$('#settings').button({label:'Settings',icons:{primary:"ui-icon-gear"}}).click(function(){$('#settings-form').dialog('open');});
	
	
	$('.guidemenu ul li').click(function(){
		gotoTabOrPage($(this).attr('ref'));
	});
	/*
	$('#guideClose').hover(function() {
		$(this).addClass('ui-state-hover');
	}, function() {
		$(this).removeClass('ui-state-hover');
	}).click(function() {
		guideClose();
	});
	*/
	
	//$('.htmledit a').live('hover',
	$('.editicons .ui-icon-circle-plus').live('click',function(){// clone a table row
		var $tbl=$(this).closest('table');
		var row = $(this).closest('tr');
		var settings=$tbl.data('settings');
		if ($('tbody tr',$tbl).length>=settings.max) return;
		row.clone(true,true).insertAfter(row).fadeIn();
		row.data('record',$.extend({},row.data('record')));
		form.listManagerSave($(this).closest('table'));
	});
	$('.editicons .ui-icon-circle-minus').live('click',function(){// delete a table row
		var $tbl=$(this).closest('table');
		var settings=$tbl.data('settings');
		if ($('tbody tr',$tbl).length<=settings.min) return;
		$(this).closest('tr').remove();
		form.listManagerSave($tbl);
	});
	
	$('#tabsMapper button').click(function(){ 
		var zoom=parseFloat($(this).attr('zoom'));
		if (zoom>0)
			mapperScale = mapperScale * zoom; 
		$('.map').css({zoom:mapperScale,"-moz-transform":"scale("+mapperScale+")","-webkit-transform":"scale("+mapperScale+")"});
	});
	$('#tabsMapper button').first().button({label:'Fit',icons:{primary:'ui-icon-arrow-4-diag'}}).next().button({label:'Zoom in',icons:{primary:'ui-icon-zoomin'}}).next().button({label:'Zoom out',icons:{primary:'ui-icon-zoomout'}});
	
	
	$('#vars_load').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	$('#vars_load2').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	
	$('#showlogic').buttonset();
	$('#showlogic1').click(function(){prefs.ShowLogic=1;gGuide.noviceTab("tabsLogic",true)});
	$('#showlogic2').click(function(){prefs.ShowLogic=2;gGuide.noviceTab("tabsLogic",true)});
	
	$('#showtext').buttonset();
	$('#showtext1').click(function(){prefs.ShowText=1;gGuide.noviceTab("tabsText",true)});
	$('#showtext2').click(function(){prefs.ShowText=2;gGuide.noviceTab("tabsText",true)});
	
	$('#showpagelist').buttonset();
	$('#showpagelist1').click(function(){prefs.ShowPageList=1;$('#CAJAOutline, #CAJAIndex').hide();$('#CAJAOutline').show();});
	$('#showpagelist2').click(function(){prefs.ShowPageList=2;$('#CAJAOutline, #CAJAIndex').hide();$('#CAJAIndex').show();});

	
	/*
	$('#tabviews').bind('tabsselect', function(event, ui) {
		switch (ui.panel.id){
			case 'tabsAbout':
			case 'tabsVariables':
			case 'tabsSteps':
			case 'tabsLogic':
			case 'tabsText':
			case 'tabsConstants':
				gGuide.noviceTab(ui.panel.id);
				break;
	
			default:
		}
		}); 
*/

   //   if (typeof initAdvanced != "undefined")      initAdvanced();




   //Ensure HTML possible for combo box pick list
   //https://github.com/scottgonzalez/jquery-ui-extensions/blob/master/autocomplete/jquery.ui.autocomplete.html.js
   $.extend($.ui.autocomplete.prototype, {
      _renderItem: function (ul, item) {
         return $("<li></li>")
				.data("item.autocomplete", item)
				.append($("<a></a>")[this.options.html ? "html" : "text"](item.label))
				.appendTo(ul);
      }
   });

   // Tips
   //window.setTimeout(hovertipInit, 1);

   // Click on section header to expand/collapse.
   if (0) $(".header").click(function () {
      $(this).next().toggle();
      //$(this).toggleClass('.sectionheader .collapsable');
   });


   // Draggable
   $('.hotspot').draggable({ containment: 'parent' }).resizable().fadeTo(0.1, 0.9);


   /*
   //8/3/2012 http://stackoverflow.com/questions/1176245/how-do-you-set-the-jquery-tabs-to-form-a-100-height
   function resizeUi() {
		 
   var h = $(window).height()-60;
   var w = $(window).width();
   $("#tabs").css('height', h-95 );
   $(".ui-tabs-panel").css('height', h-140 );
   };
   var resizeTimer = null;
   $(window).bind('resize', function() {
   if (resizeTimer) clearTimeout(resizeTimer);
   resizeTimer = setTimeout(resizeUi, 100);
   });
   resizeUi();
   */

	if (typeof DEBUGSTART!=="undefined")
	{
		DEBUGSTART();
	}
	else
		signinask();

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
					//console.log('Unhandled ' + attr);
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
						
						
	$('#viewer-var-form').dialog({ 
		autoOpen:false,
		width: 405,
		height: 500,
		modal:false,
		buttons:[
		{text:'Save', click:function(){ 
		}},
		{text:'Reload', click:function(){ 
		}},
		{text:'Close',click:function(){ 
			$(this).dialog("close");
		 }}
	]});
	$('#viewer-logic-form').dialog({ 
		autoOpen:false,
		width: 405,
		height: 500,
		modal:false,
		buttons:[
		{text:'Test', click:function(){  
		}},
		{text:'Clear', click:function(){
			$('#tracer').empty();
		}},
		{text:'Close',click:function(){ 
			$(this).dialog("close");
		 }}
	]}); 
	//$('#viewer-logic-form').dialog('moveToTop').dialog('open');
	
	$('#page-viewer').dialog({ 
		title:'A2J Viewer',
		autoOpen:false,
		width: 975,
		height: 600,
		modal:false,
		minWidth: 300,
		minHeight: 500, maxHeight: 800,
		buttons:[
		{text:'Edit this page', click:function(){ 
			$(this).dialog( "option", "stack", true );
		}},
		{text:'Variables', click:function(){ 
			$('#viewer-var-form').dialog('open').dialog('moveToTop');
		}},
		{text:'Logic', click:function(){ 
			$('#viewer-logic-form').dialog('open').dialog('moveToTop');
		}},
		{text:'Close',click:function(){ 
			$(this).dialog("close");
			$(this).dialog( "option", "stack", true );
		 }}
	]});

	$('#var-add').button({icons:{primary:'ui-icon-trash'}}).click(varAdd);
	
	
	$( "#bold" ).button({label:'B'}).click(editButton);
	$( "#italic" ).button({label:'I'}).click(editButton);
	$( "#link" ).button({text:false, icons: {primary:'ui-icon-link'}}).click(editButton);
	$( "#popup" ).button({label:'P'}).click(editButton);
	
	$( document ).tooltip({
		items: ".htmledit a", //skip title for now [title]",
		content: function(){
			var element=$(this);
			if (element.is("[title]")) return element.attr("title");
			if (element.is("a")) return element.attr("href");
		}
	});
}


function checkLength( o, n, min, max ) {
	if ( o.val().length > max || o.val().length < min ) {
		 o.addClass( "ui-state-error" );
		 updateTips( "Length of " + n + " must be between " +
			  min + " and " + max + "." );
		 return false;
	} else {
		 return true;
	}
}


function signinask()
{
	$( "#login-form" ).dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Sign in": function() {
				var bValid = true;
				// allFields.removeClass( "ui-state-error" );

				//bValid = bValid && checkLength( name, "username", 3, 16 );
				//bValid = bValid && checkLength( password, "password", 4, 16 ); 
				ws({cmd:'login',username:$('#username').val(),userpass:$('#userpass').val()},
					function (data){
						gUserID=data.userid;
						gGuideID=0;
						gUserNickName=data.nickname;
						if (gUserID==0)
						{
							//status('Unknown user');
							//html('Please register...');
						}
						else
						{	// Successful signin.
							$('#memenu').text(gUserNickName);
							$('#welcome .tabContent').html("Welcome "+gUserNickName+" user#"+gUserID+'<p id="guidelist">Loading your guides '+AJAXLoader +"</p>");
							$("#login-form" ).dialog( "close" );
					//		$('#authortool').removeClass('hidestart').addClass('authortool');
							$('#splash').hide();
							$('#welcome').show();
							
							//$('#tabviews').tabs( { disabled: [1,2,3,4,5,6,7,8,9]});
							ws({cmd:'guides'},listguides);
						}
					}				  
				  );
			 },
			 Cancel: function() {
				  $( this ).dialog( "close" );
			 }
		},
		close: function() {
			 //allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});
	$( "#login-form" ).dialog( "open" );
}


function gotoPageEdit(pageName)
{	// Bring page edit window forward with page content 
   var page = gGuide.pages[pageName]; 
	if (page == null || typeof page === "undefined") return;
	$('#tabsLogic  .tabContent, #tabsText .tabContent').html("");//clear these so they refresh with new data. TODO - update in place
	var $page =	$('.page-edit-form').filter(function(){ return pageName == $(this).attr('rel')});
	if ($page.length==0)
	{
		$page = $('.page-edit-form:first').clone(false,false);
		$page.attr('rel',page.name);
		$page.attr('title',page.name);
		$page.dialog({ 
			autoOpen:false,
			width: 850,
			height: 600,
			modal:false,
			minWidth: 200,
			minHeight: 500, maxHeight: 700,
			
			close: function(){
				$(this).remove();//("destroy");
			},
			buttons:[
			{text:'Delete', click:function(){
				var name= $(this).attr('rel');
				var refs=gGuide.pageFindReferences(name,null);
				var txt='';
				if (refs.length>0)
				{
					txt=refs.length+' references to this page.<ul>';
					for (var r in refs) txt+='<li>'+refs[r].name+' <i>'+refs[r].field+'</i></li>';
					txt+="</ul>";
				}
				else
					txt='No references';
				DialogConfirmYesNo({title:'Delete page '+name,message:'Permanently delete this page?<hr>'+txt,height:300,name:name,Yes:function(){
					gGuide.pageDelete(this.name);
				}});
			}},
			{text:'Clone', click:function(){
				gGuide.pageClone($(this).attr('rel'));
			}},
			{text:'Insert after', click:function(){ 
			}},
			{text:'Preview', click:function(){ 
				gotoPageViewer($(this).attr('rel'));
			}},
			{text:'Close',click:function(){ 
				$(this).dialog("close");
			 }}
		]});
		var page = gGuide.novicePage($('.page-edit-form-panel',$page).html(''),page.name);	
	}
	$page.dialog('open' );
	$page.dialog('moveToTop');
}
function gotoTabOrPage(target)
{	// Go to a tab or popup a page.
	trace(target);

	//$('#CAJAOutline li, #CAJAIndex li').each(function(){$(this).removeClass('ui-state-active')});
	//$('li').filter(function(){ return target == $(this).attr('target')}).each(function(){$(this).addClass('ui-state-active')});	
	
	if (target.indexOf("PAGE ")==0)
	{
		gotoPageEdit(target.substr(5));
	}
	else{
		//$('.guidemenu ul li').removeClass('selected');
		//$('.guidemenu ul li[ref="'+target+'"]').addClass('selected');
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
				gGuide.noviceTab(target);
				break;
		}
	}	
}

function pageGOTOList()
{	// List of page ids we can go to including the built-ins like no where, exit.
	var pages=[qIDNOWHERE,qIDSUCCESS,qIDFAIL,qIDEXIT,qIDBACK,qIDRESUME];
	for (var p in gGuide.sortedPages)
	{
		var page=gGuide.sortedPages[p];
		if (page.type!=CONST.ptPopup)
			pages.push(page.name);
	}
	return pages;
}


function pickPage(request,response)
{	// autocomplete page lists including internal text
	request.term = request.term.split("\t")[0]
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
	for (var p in gGuide.sortedPages)
	{
		var page=gGuide.sortedPages[p];
		if (page.type!=CONST.ptPopup)
		{
			var list;
			if (matcherStarts.test(page.name)) list=0;
			else
			if (matcherContains.test(page.name)) list=1;
			else list=-1;
			if (list>=0)
			{
				var label = "<b>"+page.name +"</b>: "+  decodeEntities(page.text);
				lists[list].push({label:hilite(label),value:page.name});
			}
		}
	}
	response(lists[0].concat(lists[1]).slice(0,30));
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
		error: function(err,xhr) { DialogAlert("error:"+xhr.responseText ); }
	})
}  







function BlankGuide(){
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
	guide.vars=[]; 
	guide.sortedPages=[page];
	guide.firstPage=page.id;
	return guide;
}

function guideSave()
{
	if (gGuide!=null && gGuideID!=0)
	{
		prompt('Saving '+gGuide.title + AJAXLoader);
		ws( {cmd:'guidesave',gid:gGuideID, guide: exportXML_CAJA_from_CAJA(gGuide), title:gGuide.title}, function(response){
			if (response.error!=null)
				prompt(response.error);
			else
				prompt(response.info);
		});
	}
}

function createBlankGuide()
{	// create blank guide internally, do Save As to get a server id for future saves.
	var guide=BlankGuide();

	ws({cmd:'guidesaveas',gid:0, guide: exportXML_CAJA_from_CAJA(guide), title: guide.title},function(data){
		if (data.error!=null)
			status(data.error);
		else{
			var newgid = data.gid;//new guide id
			ws({cmd:'guides'},function (data){
				listguides(data);
				ws({cmd:'guide',gid:newgid},guideloaded);
			 });
		}
	});
}


function listguides(data)
{
	var blank = {id:'a2j', title:'Create a new guide'};
	gGuideID=0;
	var mine = [];
	var others = [];
	var start = '<li class=guide gid="' + blank.id + '">' + blank.title + '</li>';
	$.each(data.guides, function(key,g) { var str='<li class=guide gid="' + g.id + '">' + g.title + '</li>'; if (g.owned)mine.push(str);else others.push(str);});
	
	$('#guidelist').html("New guides <ol>"+start+"</ol>My guides <ol>"+mine.join('')+"</ol>" + "Sample guides <ol>"+others.join('')+"</ol>");
	$('li.guide').click(function(){
		var gid=$(this).attr('gid');
		var guideFile=$(this).text();
		$('li.guide[gid="'+gid+'"]').html('Loading guide '+guideFile+AJAXLoader).addClass('.warning');
		loadNewGuidePrep(guideFile,'');
		if(gid=='a2j')
			createBlankGuide();
		else
			ws({cmd:'guide',gid:gid},guideloaded);
	});
	$('#welcome').dialog('open');
}




TGuide.prototype.novicePage = function (div, pagename) {	// Create editing wizard for given page.
   var t = ""; 
   var page = this.pages[pagename]; 
	var t=$('<div/>').addClass('tabsPanel editq');

	form.clear();
	if (page == null || typeof page === "undefined") {
		t.append(form.h2( "Page not found " + pagename)); 
	}
	else 
	if (page.type == CONST.ptPopup ) {
		var fs=form.fieldset('Popup info',page);
		fs.append(form.text({label:'Name:',name:'pagename', value:page.name,change:function(val,page,form){
			if (gGuide.pageRename(page,val)==false) $(this).val(page.name);
		}} ));
		fs.append(form.htmlarea({label:'Notes:',value: page.notes,change:function(val,page){page.notes=val}} ));
		fs.append(form.htmlarea(	{label:'Text:',value:page.text,change:function(val,page){page.text=val}} ));
		fs.append(form.pickAudio(	{label:'Text audio:', placeholder:'mp3 file',	value:	page.textAudioURL,
			change:function(val,page){page.textAudioURL=val}} ));
		t.append(fs);
	}
	else	
	{ 
		


		var fs=form.fieldset('Page info',page);
		fs.append(form.pickStep({label:'Step:',value: page.step, change:function(val,page){page.step=parseInt(val);/* TODO Move page to new outline location */}} ));
		fs.append(form.text({label:'Name:', value:page.name,change:function(val,page,form){
			val = jQuery.trim(val);
			if (gGuide.pageRename(page,val)==false) $(this).val(page.name);
		}} ));
		if (page.type != "A2J") {
			fs.append(form.h2("Page type/style: " + page.type + "/" + page.style));
		}
		fs.append(form.htmlarea({label:'Notes:',value: page.notes,change:function(val,page){page.notes=val}} ));
		t.append(fs);
		
		var pagefs=form.fieldset('Question text',page);  
		
		pagefs.append(form.htmlarea(	{label:'Text:',value:page.text,change:function(val,page){page.text=val}} ));
		pagefs.append(form.pickAudio(	{label:'Text audio:', placeholder:'mp3 file',	value:	page.textAudioURL,change:function(val,page){page.textAudioURL=val}} ));
		pagefs.append(form.text(		{label:'Learn More prompt:',placeholder:'Learn more',	value:page.learn,	change:function(val,page){page.learn=val}} ));
		function getShowMe(){
			if (page.helpVideoURL!="") return 2; 
			else if (page.helpImageURL!="") return 1; 
			else return 0;
		}
		function updateShowMe(form,showMe){
			form.find('[name="helpAudio"]').showit(showMe!=2);
			form.find('[name="helpGraphic"]').showit(showMe==1);
			form.find('[name="helpReader"]').showit(showMe>=1);
			form.find('[name="helpVideo"]').showit(showMe==2);			
		}
		pagefs.append(form.pickList({label:'Help style:',value:getShowMe(), change:function(val,page,form){
			updateShowMe(form,val);
			}},  [0,'Text',1,'Show Me Graphic',2,'Show Me Video']));
		pagefs.append(form.htmlarea(	{label:"Help:",value:page.help,change:function(val,page){page.help=val}} ));
		pagefs.append(form.pickAudio(	{name:'helpAudio',label:'Help audio:',placeholder:'',	value:page.helpAudioURL,
			change:function(val,page){page.helpAudioURL=val}} ));
		pagefs.append(form.pickImage(		{name:'helpGraphic',label:'Help graphic:',placeholder:'',	value:page.helpImageURL,
			change:function(val,page){page.helpImageURL=val}} ));
		pagefs.append(form.pickVideo(		{name:'helpVideo', label:'Help video:',placeholder:'',		value:page.helpVideoURL,
			change:function(val,page){page.helpVideoURL=val}} ));
		pagefs.append(form.htmlarea(	{name:'helpReader', label:'Help Text Reader:', value:page.helpReader,
			change:function(val,page){page.helpReader=val}} ));
		pagefs.append(form.text(		{label:'Repeating Variable:',placeholder:'',	value:page.repeatVar,
			change:function(val,page){page.repeatVar=val}} ));
		t.append(pagefs);
		updateShowMe(pagefs,getShowMe());
		pagefs=null;
		
		
		if (page.type == "A2J" || page.fields.length > 0) {
		
			var blankField=new TField();
			blankField.type=CONST.ftText;
			blankField.label="Label";
			
			function updateFieldLayout(ff,field){
				var canMinMax = field.type==CONST.ftNumber || field.type==CONST.ftNumberDollar || field.type==CONST.ftNumberPick || field.type==CONST.ftDateMDY;
				var canList = field.type==CONST.ftTextPick;
				var canDefaultValue=	field.type!=CONST.ftCheckBox && field.type!=CONST.ftCheckBoxNOTA && field.type!=CONST.ftGender;
				var canOrder =   field.type==CONST.ftTextPick || field.type==CONST.ftNumberPick || 	field.type==CONST.ftDateMDY;
				var canUseCalc = (field.type == CONST.ftNumber) || (field.type == CONST.ftNumberDollar);
				var canMaxChars= field.type==CONST.ftText || field.type==CONST.ftTextLong || field.type==CONST.ftNumber 
					|| field.type==CONST.ftNumberDollar || 	field.type==CONST.ftNumberPhone || field.type==CONST.ftNumberZIP;				
				var canCalendar = field.type==CONST.ftDateMDY;
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
			}
			
			var fs=form.fieldset('Fields');
			fs.append(form.listManager({name:'Fields',picker:'Number of fields:',min:0,max:CONST.MAXFIELDS,list:page.fields,blank:blankField
				,save:function(newlist){
					page.fields=newlist;
					}
				,create:function(ff,field){
					ff.append(form.pickList({label:'Type:',value: field.type,change:function(val,field,ff){
						field.type=val;
						updateFieldLayout(ff,field);
						}},fieldTypesList ));
					ff.append(form.htmlarea({label:'Label:',   value:field.label, 
						change:function(val,field){field.label=val;}}));
					ff.append(form.text({label:'Variable:', placeholder:'Variable name', value: field.name,
						change:function(val,field){field.name=jQuery.trim(val)}}));
					ff.append(form.text({label:'Default value:',name:'default', placeholder:'Default value',value:  field.value,
						change:function(val,field){field.value=jQuery.trim(val)}}));
					ff.append(form.checkbox({label:'Required:', checkbox:'', value:field.required,
						change:function(val,field){field.required=val}}));
					ff.append(form.text({label:'Max chars:',name:'maxchars', placeholder:'Max Chars',value: field.maxChars,
						change:function(val,field){field.maxChars=val;}}));
					ff.append(form.checkbox({label:'Show Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,
						change:function(val,field){field.calculator=val}}));
					ff.append(form.checkbox({label:'Show Calendar:', name:'calendar',checkbox:'Calendar available?', value:field.calendar,
						change:function(val,field){field.calendar=val}}));
					ff.append(form.text({label:'Min value:',name:'min',placeholder:'min', value: field.min,
						change:function(val,field){field.min=val}}));
					ff.append(form.text({label:'Max value:',name:'max',placeholder:'max', value: field.max,
						change:function(val,field){field.max=val}}));
					ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}}));
					
					updateFieldLayout(ff,field);
					return ff;
				}
				}));
			
			
			t.append(fs);
	  	}
		if (page.type == "A2J" || page.buttons.length > 0) {
			var blankButton=new TButton();
			
			var fs=form.fieldset('Buttons');
			fs.append(form.listManager({name:'Buttons',picker:'Number of buttons',min:1,max:CONST.MAXBUTTONS,list:page.buttons,blank:blankButton
				,save:function(newlist){
					page.buttons=newlist; }
				,create:function(ff,b){
					ff.append(form.text({ 		value: b.label,label:'Label:',placeholder:'button label',		change:function(val,b){b.label=val}}));
					ff.append(form.text({ 		value: b.name, label:'Variable Name:',placeholder:'variable',		change:function(val,b){b.name=val}}));
					ff.append(form.text({ 		value: b.value,label:'Default value',placeholder:'Default value',		change:function(val,b){b.value=val}}));
					ff.append(form.pickpage({	value: b.next,label:'Destination:', 	change:function(val,b){
						b.next=val;}}));
					return ff;
				}}));
			t.append(fs);
		}
		var fs=form.fieldset('Advanced Logic');
		fs.append(form.codearea({label:'Before:',	value:page.codeBefore,	change:function(val){page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
		fs.append(form.codearea({label:'After:',	value:page.codeAfter, 	change:function(val){
			page.codeAfter=val; /* TODO Compile for syntax errors */}} ));
		t.append(fs);

		if (page.type == "Book page") { }
		else
		{
		/*
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
					clist.push({ row: [detail.label, form.pickscore(fb.grade), form.htmlarea("", GROUP + "CHOICE" + d, "detail" + d, detail.text)] });
					dlist.push({ row: [detail.label, form.pickscore(fb.grade), $fb] });
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

				t.append(form.textarea("script"));
			}
			else if (page.type == "Text Entry" && page.style == "Text Essay") { }
			else if (page.type == "Prioritize" && page.style == "PDrag") { }
			else if (page.type == "Prioritize" && page.style == "PMatch") { }
			else if (page.type == "Slider") { }
			else if (page.type == "GAME" && page.style == "FLASHCARD") { }
			else if (page.type == "GAME" && page.style == "HANGMAN") { }

*/
}

		//pageText += html2P(expandPopups(this,page.text));

   }

   div.append(t);
	form.finish(t);
	if (gDev) div.append('<div class=xml>'+htmlEscape(page.xml)+'</div>');

	gPage = page;
	return page;
}



/*

//http://net.tutsplus.com/tutorials/javascript-ajax/creating-a-windows-like-interface-with-jquery-ui/
var _init = $.ui.dialog.prototype._init;
$.ui.dialog.prototype._init = function() {
   //Run the original initialization code
   _init.apply(this, arguments);
   //set some variables for use later
   var dialog_element = this;
   var dialog_id = this.uiDialogTitlebar.next().attr('id');
   //append our minimize icon
   this.uiDialogTitlebar.append('<a href="#" id="' + dialog_id +
   '-minbutton" class="ui-dialog-titlebar-minimize ui-corner-all">'+
   '<span class="ui-icon ui-icon-minusthick"></span></a>');
//this.uiDialogTitlebar.append($("<button class='options'>Options</button>").button());
   //append our minimized state
   $('#dialog_window_minimized_container').append(
      '<div class="dialog_window_minimized ui-widget ui-state-default ui-corner-all" id="' +
      dialog_id + '_minimized">' + this.uiDialogTitlebar.find('.ui-dialog-title').text() +
      '<span class="ui-icon ui-icon-newwin"></div>');
   //create a hover event for the minimize button so that it looks good
   $('#' + dialog_id + '-minbutton').hover(function() {
      $(this).addClass('ui-state-hover');
   }, function() {
      $(this).removeClass('ui-state-hover');
   }).click(function() {
      //add a click event as well to do our "minimalization" of the window
      dialog_element.close();
      $('#' + dialog_id + '_minimized').show();
   });
   //create another click event that maximizes our minimized window
   $('#' + dialog_id + '_minimized').click(function() {
      $(this).hide();
      dialog_element.open();
   });
};
*/





function prompt(status)
{
	if (status==null) status="";
	$('#CAJAStatus').text( status );
	trace(status);
}
function loadNewGuidePrep(guideFile,startTabOrPage)
{
	//prompt('Loading '+guideFile);
	//prompt('Start location will be '+startTabOrPage);
	//$('.CAJAContent').html('Loading '+guideFile+AJAXLoader);
	$('#CAJAOutline, #CAJAIndex').html('');
}

function guideClose()
{
	if (gGuide!=null)
		if (gGuideID!=0)
			guideSave();
	
	$('#welcome').dialog('open');
	$('#authortool').hide();
}

function guideStart(startTabOrPage)
{ 
	if (startTabOrPage == '') startTabOrPage='tabsPages';//'tabsAbout';
	
	$('#authortool').removeClass('hidestart').addClass('authortool').show();
	$('#welcome').dialog('close');
	
	//$('#tabviews').tabs( { disabled:false});
	$('#tabsVariables .tabContent, #tabsLogic  .tabContent, #tabsSteps .tabContent, #tabsAbout .tabContent, #tabsConstants .tabContent, #tabsText .tabContent').html("");
	
	if (makestr(startTabOrPage)=="")
		startTabOrPage="PAGE "+(gGuide.firstPage);
	//trace("Starting location "+startTabOrPage);
	
	gotoTabOrPage(startTabOrPage);
	updateTOC();
	$('#CAJAOutline, #CAJAIndex').hide();
	$('#CAJAOutline').show();
	
	//$('#guidepanel ul li a:first').html(gGuide.title);
	$('#guidetitle').html(gGuide.title);
	/*
	$('#guidepanel').dialog({
		title: gGuide.title,
		autoopen:true,width:800,height:700,
		buttons: {
			 "Save": function() {
			 },
			 Close: function() {
				  $( this ).dialog( "close" );
			 }
		},
		close: function() {
		}});
		*/
	buildMap();
}
function updateTOC()
{
	$('#CAJAOutline').html(gGuide.IndexOutlineHTML());
	$('#CAJAIndex').html(gGuide.IndexAlphaHTML());
	$('#CAJAOutline li, #CAJAIndex li')
		.dblclick(function (){
			var target=$(this).attr('target')
			$('#CAJAOutline li, #CAJAIndex li').removeClass('ui-state-active');
			$(this).addClass('ui-state-active')
			gotoTabOrPage(target);
		})
		.click(function(e){
			if (!e.ctrlKey)
				$('#CAJAOutline li, #CAJAIndex li').removeClass('ui-state-active');
			$(this).toggleClass('ui-state-active');
		});
}
function guideloaded(data)
{
	gGuideID=data.gid;
	cajaDataXML=$(jQuery.parseXML(data.guide));
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
	//gGuide.filename=guideFile;
	guideStart('');
}

function styleSheetSwitch(theme)
{
	//<link href="cavmobile.css" title="cavmobile" media="screen" rel="stylesheet" type="text/css" />
	trace('styleSheetSwitch='+theme); 
	if (theme=='A2J') 
		theme = "themes/"+theme.toLowerCase()+"/jquery-ui.css";
	else
		theme = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/"+theme.toLowerCase()+"/jquery-ui.css";
	$('link[title=style]').attr('href',theme);
}

function editButton()
{
	switch ($(this).attr('id')){
		case 'bold': document.execCommand('bold', false, null); break;
		case 'italic': document.execCommand('italic', false, null); break;
		case 'indent': document.execCommand('indent', false, null); break;
		case 'outdent': document.execCommand('outdent', false, null); break;
	}
}



TGuide.prototype.pageRename=function(page,newName){
/* TODO Rename all references to this page in POPUPs, JUMPs and GOTOs */
	//trace("Renaming page "+page.name+" to "+newName);
	var guide=this;
	if (page.name==newName) return true;
	if (page.name.toLowerCase() != newName.toLowerCase())
	{
		if (guide.pages[newName])
		{
			DialogAlert('Page rename disallowed','There is already a page named '+newName);
			return false
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
		*/
	
	$('.page-edit-form').filter(function(){ return page.name == $(this).attr('rel')}).each(function(){
		$(this).attr('rel',newName);
		$(this).dialog({title:newName});
		})

	gGuide.pageFindReferences(page.name,newName);

		
	delete guide.pages[page.name]
	page.name = newName;
	guide.pages[page.name]=page;
	//trace("RENAMING REFERENES");
	guide.sortPages(); updateTOC();
	return true;
}
TGuide.prototype.IndexOutlineHTML=function()
{	// Build outline for entire interview includes meta, step and question sections.
	var inSteps=[];
	var popups="";
	for (s in this.steps)
	{
		inSteps[s]="";
	}
	for (var p in this.sortedPages)
	{
		var page = this.sortedPages[p];
		var plink= '<li target="PAGE '+page.name.asHTML()+'">'+page.name.asHTML()+'</li>';
		if (page.type==CONST.ptPopup)
			popups += plink;
		else
			inSteps[page.step] += plink;
	}	
	var ts="";
	for (var s in this.steps)
	{
		ts+='<li target="STEP '+s+'">'+this.steps[s].number+". "+this.steps[s].text+"</li><ul>"+inSteps[s]+"</ul>";
	}
	return "<ul>"
			//+ '<li target="tabsAbout">'+lang.tabAbout+'</li>'
			//+ '<li target="tabsMapper">'+'Map'+'</li>'
			//+ '<li target="tabsVariables">'+lang.tabVariables+'</li>'
			//+ '<li target="tabsConstants">'+lang.tabConstants+'</li>'
			+ '<li target="tabsSteps">'+lang.tabSteps+'</li><ul>'+ts+'</ul>'
			+ '<li target="tabsPopups">'+lang.en('Popups')+'</li><ul>'+popups+'</ul>'
			+"</ul>";
}

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



function DialogConfirmYesNo(args)
{
	var $d=$( "#dialog-confirm" );
	$d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'+args.message+'</p>');
	
	$d.dialog({
		title: args.title,
		resizable: false,
		width: 350,
		height:args.height!=null?args.height : 240,
		modal: true,
		buttons: {
			 Yes: function() {
				  $( this ).dialog( "close" );
				  args.Yes(args);
			 },
			 No: function() {
				  $( this ).dialog( "close" );
			 }
		}
	});
}
function gotoPageViewer(destPageName)
{  // navigate to given page (after tiny delay)
   window.setTimeout(function(){
      var page = gGuide.pages[destPageName]; 
      if (page == null || typeof page === "undefined")
      {
         DialogAlert( {title:'Missing page',message:'Page is missing: '+ destPageName});
         traceLogic('Page is missing: '+ destPageName);
      }
      else
      {
         gPage=page;
         a2jviewer.layoutpage($('.A2JViewer','#page-viewer'),gGuide,gGuide.steps,gPage);
         $('#page-viewer').dialog('moveToTop').dialog('open' );//.dialog( "option", "stack", false );
      }
   },1);
}


TGuide.prototype.pageClone=function(pageName){
	var guide=this;
	var page = guide.pages[pageName];;
	page = guide.addUniquePage(pageName,cloneObject(page));
	guide.sortPages(); updateTOC();
}

TGuide.prototype.pageFindReferences=function(findName,newName){
// ### Return list of pages and fields pointing to pageName in {name:x,field:y} pairs
// ### If newName is not null, perform a replacement.
	var guide=this;
	var matches=[];
	for (var p in guide.pages)
	{
		var page=guide.pages[p];
		function testtext(field,fieldname)
		{
			var add=false;
			page[field]=page[field].replace(/\"POPUP:\/\/(([^\"])+)\"/ig,function(match,p1,offset,string){
				var popupid=match.match(/\"POPUP:\/\/(([^\"])+)\"/i)[1];
				if (popupid==findName)
				{
					add=true;
					if (newName!=null)
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
		}
		function testcode(field,fieldName)
		{
			var result=gLogic.pageFindReferences(page[field],findName,newName);
			if (result.add)
				matches.push({name:page.name,field:fieldName,text:''});
		}
		
		//text, help, codeBefore, codeAfter
		testtext('text','Text');
		testtext('help','Help');
		testcode('codeBefore','Logic Before');
		testcode('codeAfter','Logic After');
		for (var bi in page.buttons)
		{
			var b=page.buttons[bi];
			if (b.next==findName)
				matches.push({name:page.name,field:'Button '+b.label,text:b.label});
		}
	}
	return matches;
}



TGuide.prototype.varDelete=function(name){
	var guide=this;
	delete guide.vars[name.toLowerCase()];
	gGuide.noviceTab('tabsVariables',true);
}
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
	$('#varrepeating').val(v.repeating);
	$('#var-edit-form').data(v).dialog({
		autoOpen:true,
			width: 450,
			height: 300,
			modal:true,
			close: function(){
			},
			//http://stackoverflow.com/questions/2525524/jquery-ui-dialog-button-icons
			buttons:[
			{text:'Delete', click:function(){
				var name= $(this).data().name;
				if (name=="") return;
				DialogConfirmYesNo({title:'Delete variable '+name,message:'Delete this variable?',name:name,Yes:function(){
					$('#var-edit-form').dialog("close");
					gGuide.varDelete(this.name);
				}});
			}},
			{text:'Update',click:function(){ 
				var name= $('#varname').val();
				if(name!=v.name)//rename variable
				{
					delete gGuide.vars[v.name.toLowerCase()];
					v.name=name;
					gGuide.vars[name.toLowerCase()]=v;
				}
				v.type=$('#vartype').val();
				v.comment=$('#varcomment').val();
				v.repeating=$('#varrepeating').val();
				gGuide.noviceTab('tabsVariables',true);
				$(this).dialog("close");
			 }}
		]});
	
}
TGuide.prototype.buildTabVariables = function (t)
{
	var guide = this;
	var tt=form.rowheading(["Name","Type","Comment"]); 
	var sortvars=[];
	for (vi in guide.vars) sortvars.push(guide.vars[vi]);
	sortvars.sort(function (a,b){return sortingNaturalCompare(a.name,b.name);});
	for (vi in sortvars)
	{
		v=sortvars[vi];
		tt+=form.row([v.name,v.type,v.comment]);
	}

	t.append('<table class="A2JVars">'+tt+"</table>");
	$('tr',t).click(function(){
		varEdit(gGuide.vars[$('td:first',this).text().toLowerCase()]);
	});
}


TGuide.prototype.noviceTab = function (tab,clear)//function noviceTab(guide,tab,clear)
{	// 08/03/2012 Edit panel for guide sections 
	var guide = this;
	var div = $('#'+tab);
	//if (div.html()!="") return;
	var t = $('.tabContent',div);
	if (clear) t.html("");
	if (t.html()!="") return;
	
//	var t=$('<div/>').addClass('tabsPanel editq')//.append($('<div/>').addClass('tabsPanel2'));//editq
	form.clear();
	
	switch (tab){
	
	
		case "tabsVariables":
			guide.buildTabVariables(t);
			break;
			
		case "tabsConstants":
			var fs = form.fieldset('Constants');
			t.append(fs);
			break;
		
		case "tabsLogic":
			t.append(form.note('All logic blocks in this interview'));
			for (var p in guide.sortedPages)
			{
				var page=guide.sortedPages[p];
				if (page.type!=CONST.ptPopup)
				if ((prefs.ShowLogic==2) || (prefs.ShowLogic==1 && (page.codeBefore!="" || page.codeAfter!="")))
				{
					var pagefs=form.fieldset(page.name, page);
					if (prefs.ShowLogic==2 || page.codeBefore!="")
						pagefs.append(form.codearea({label:'Before:',	value:page.codeBefore,	change:function(val,page){
							page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
					if (prefs.ShowLogic==2 || page.codeAfter!="")
						pagefs.append(form.codearea({label:'After:',	value:page.codeAfter, 	change:function(val,page){
							page.codeAfter=val ; /* TODO Compile for syntax errors */}} ));
					t.append(pagefs);
				}
			}
			
			break;
			
		case "tabsText":
			t.append(form.note('All non-empty page text blocks in this interview'));
			for (var p in guide.sortedPages)
			{
				var page=guide.sortedPages[p];
				var pagefs=form.fieldset(page.name, page);
				pagefs.append(form.htmlarea({label:'Text:',					value:page.text,			change:function(val,page){page.text=val; }} ));
				if (page.type!=CONST.ptPopup){
					if (prefs.ShowText==2 || page.learn!="")
						pagefs.append(form.text({label:'Learn More prompt:',placeholder:"",	value:page.learn,
							change:function(val,page){page.learn=val }} ));
					if (prefs.ShowText==2 || page.help!="")
						pagefs.append(form.htmlarea({label:"Help:",					value:page.help,
							change:function(val,page){page.help=val}} ));
					if (prefs.ShowText==2 || page.helpReader!="")
						pagefs.append(form.htmlarea({label:'Help Text Reader:',	value:page.helpReader,
							change:function(val,page){page.helpReader=val}} ));

					for (var f in page.fields)
					{
						var field = page.fields[f];
						var ff=form.fieldset('Field '+(parseInt(f)+1),field);
						ff.append(form.htmlarea({label:'Label:',   value:field.label, 
							change:function(val,field){field.label=val;}}));
						if (prefs.ShowText==2 || field.value!="")
							ff.append(form.text({label:'Default value:',placeholder:"",name:'default', value:  field.value,
								change:function(val,field){field.value=val}}));
						if (prefs.ShowText==2 || field.invalidPrompt!="")
							ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,
								change:function(val,field){field.invalidPrompt=val}}));						
						pagefs.append(ff);
					}
					for (var bi in page.buttons)
					{
						var b = page.buttons[bi];
						var bf=form.fieldset('Button '+(parseInt(bi)+1),b);
						if (prefs.ShowText==2 || b.label!="")
							bf.append(form.text({ 		value: b.label,label:'Label:',placeholder:'button label',
								change:function(val,b){b.label=val}}));
						if (prefs.ShowText==2 || b.value!="")
							bf.append(form.text({ 		value: b.value,label:'Default value',placeholder:'Default value',
								change:function(val,b){b.value=val}}));
						pagefs.append(bf);
					}
				}
				t.append(pagefs);
			}
			
			break;
		
		case "tabsAbout":
			var fs = form.fieldset('About');
			fs.append(form.text({label:'Title:', placeholder:'Interview title', value:guide.title, change:function(val){guide.title=val}}));
			fs.append(form.htmlarea({label:'Description:',value:guide.description,change:function(val){guide.description=val}}));
			fs.append(form.text({label:'Jurisdiction:', value:guide.jurisdiction, change:function(val){guide.jurisdiction=val}}));
			fs.append(form.htmlarea({label:'Credits:',value:guide.credits,change:function(val){guide.credits=val}}));
			fs.append(form.text({label:'Approximate Completion Time:',placeholder:'e.g., 2-3 hours',value:guide.completionTime,change:function(val){guide.completionTime=val}}));
			t.append(fs);
			
			var fs = form.fieldset('Authors');
			var blankAuthor=new TAuthor();
			
			var fs = form.fieldset('Revision History');  
			fs.append(form.text({label:'Current Version:',value:guide.version,change:function(val){guide.version=val}}));
			fs.append(form.htmlarea({label:'Revision Notes',value:guide.notes,change:function(val){guide.notes=val}}));
			t.append(fs);
			
			var fs=form.fieldset('Authors');
			fs.append(form.listManager({name:'Authors',picker:'Number of authors',min:1,max:12,list:guide.authors,blank:blankAuthor
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(ff,author){
						ff.append(form.text({  label:"Author's Name:", placeholder:'name',value:author.name,
							change:function(val,author){author.name=val}}));
						ff.append(form.text({  label:"Author's Title:", placeholder:'title',value:author.title,
							change:function(val,author){author.title=val}}));
						ff.append(form.text({  label:"Author's Organization:", placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val}}));
						ff.append(form.text({  label:"Author's email:", placeholder:'email',value:author.email,
							change:function(val,author){author.email=val}}));
					return ff;
				}}));
				
			t.append(fs);
			

			break;

		case 'tabsSteps':
		
			var fs=form.fieldset('Start/Exit points');
			fs.append(form.pickpage({	value: guide.firstPage,label:'Starting Point:',	change:function(val){guide.firstPage=val;}}));
			fs.append(form.pickpage({	value: guide.exitPage,label:'Exit Point:', 		change:function(val){guide.exitPage=val;}}));
			t.append(fs);
			var fs=form.fieldset('Steps');
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
}



TGuide.prototype.pageDelete=function(name){
	var guide=this;
	var page=guide.pages[name];
	// TODO Anything pointing to this page is redirect to NOWHERE
	
	// remove page from indexes
	/*
	var target="PAGE "+name;
	$('li').filter(function(){return target==$(this).attr('target');}).each(function(){
		$(this).remove();
	})
*/	// rename page edit title bar
	$('.page-edit-form').filter(function(){
		return page.name == $(this).attr('rel')}).each(function(){
			$(this).dialog('close');})
	
	delete guide.pages[page.name]
	guide.sortPages(); updateTOC();
}

















var form={
	id:0
	
	,editorAdd:function(elt){
		if (elt.parent().parent().find('.texttoolbar').length==0)
			$('#texttoolbar').clone(true,true).attr('id','').prependTo(elt.parent()).show();
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
		return $("<h2>"+h+"</h2>").click(function(){$(this).next().toggle()});}
		
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
		return $('<fieldset name="record"><legend >'+legend+'</legend></fieldset>').data('record',record);;//.click(function(){$(this).toggleClass('collapse')});
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
		$('input',e).blur(function(){ form.change($(this),$(this).is(':checked'))}).attr( 'checked',data.value==true ).data('data',data);
		return e;
	}
	
	
	,pickpage:function(data){ 
		//data.value = gGuide.pageDisplayName(data.value); 

		var dval = gGuide.pageDisplayName(data.value);
			
		var e =$( ''
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+ '<span class=editspan><input class="  ui-combobox-input editable autocomplete picker page dest" type="text" ></span>');
		$('.picker',e).blur(function(){
			var val=$(this).val();
			form.change($(this),val);
		}).data('data',data).val(decodeEntities(dval));
		$('.autocomplete.picker.page',e).autocomplete({ source: pickPage, html: true,
	      change: function () { // if didn't match, restore to original value
	         var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex($(this).val().split("\t")[0]) + "$", "i");
	         var newvalue = $(this).val();//.split("\t")[0];
				trace(newvalue);
	         $.each(gGuide.sortedPages, function (p, page) {
					if (page.type!=CONST.ptPopup)
						if (matcher.test(page.name)) {
							newvalue = gGuide.pageDisplayName(page.name);
							return false;
						}
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
			+'<span class=editspan> <input class="ui-widget editable" placeholder="'+data.placeholder+'" type="text" /> </span></div>');
		//if (typeof data.class!=='undefined') $('input',e).addClass(data.class);
		//if (typeof data.width!=='undefined') $('input',e).css('width',data.class);
		$('input',e).blur(function(){ form.change($(this),$(this).val());}).val(decodeEntities(data.value)).data('data',data);
		return e;
	}
	,htmlFix:function(html){
		return html.replace(/\<br\>/gi,"<BR/>");
		//return html.replace("<br>","<BR/>","gi");
	}
	,htmlarea: function(data){//label,value,handler,name){ 
		this.id++;
		var e= $('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan>'
			+'<div contenteditable=true class="  htmledit  text editable taller" id="tinyMCE_'+this.id+'"  name="'+this.id+'" rows='+1+'>'
			+data.value+'</div></span></div>');
		$('.editable',e).focus(function(){$(this).addClass('tallest');form.editorAdd($(this));}).blur(function(){
		//$(this).removeClass('tallest');
		form.editorRemove(this);
		form.change($(this), form.htmlFix($(this).html()));}).data('data',data) ;
		return e;
	} 
	,textarea: function(data){
		var rows=2;
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><textarea  class="     text editable taller" rows='+rows+'>'+data.value+'</textarea></span></div>');
		$('.editable',e).blur(function(){form.change($(this),$(this).html());}).data('data',data);
		return e;
	}
	
	,pickAudio:function(data){ return this.text(data);}
	,pickImage:function(data){ return this.text(data);}
	,pickVideo:function(data){ return this.text(data);}
	
	,clear:function(){
		form.codeCheckList=[];
	}
	,finish:function(div){
	}
	,codeCheckIntervalID:0
	,codeCheckList:[]
	,codeCheckSoon:function(elt){
		if (form.codeCheckIntervalID==0)
			form.codeCheckIntervalID=setInterval(form.codeCheckInterval,100);
		form.codeCheckList.unshift(elt);
	}
	,codeCheckInterval:function(){ // syntax check one code block
		if (form.codeCheckList.length==0){
			clearInterval(form.codeCheckIntervalID);
			form.codeCheckIntervalID=0;
		}
		else
			form.codeCheck(form.codeCheckList.pop());
	}
	,codeFix:function(html){
		return html.replace(/\<br\>/gi,"<BR/>");
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
			
			for (var e in script.errors)
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
		if(0 || gDev)
		{	// print JavaScript
			var t=[];
			t.push('JavaScript:');
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
		this.id++;
		var e= $('<div>'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<div class=editspan><div spellcheck="false" contenteditable=true class="text editable taller codeedit"  rows='+4+'>'+data.value+'</div><div class="errors"></div></div></div>');
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
		for (var o=0;o<listValueLabel.length;o+=2)
			c+='<option value="'+listValueLabel[o]+'">'+listValueLabel[o+1]+'</option>';
		var e =$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><select class="     ui-select-input">'+c+'</select></span></div>');
		$('.ui-select-input',e).change(function(){form.change($(this),$('option:selected',this).val())}).data('data',data).val(data.value);
		return e;
	}
	,pickStep:function(data){
		var list=[];
		for (var s=0;s<gGuide.steps.length;s++){
			var step = gGuide.steps[s];
			list.push(s,step.number+". "+ (step.text));
		}
		return this.pickList(data,list);
		//var e =$('<div><label>'+label+'</label>' + '<select class="ui-state-default ui-select-input">'+o+'</select></div>');
		//$('.ui-select-input',e).change(function(){var val=$('option:selected',this).val();  $(this).data('data').change(val);}).data('data',handler).val(value);
		//return e;
	}
	,pickscore:function(label,value,handler){
		return this.pickList('','picker score',[
			'RIGHT','Right',
			'WRONG','Wrong',
			'MAYBE','Maybe',
			'INFO','Info'],value,handler);
	}
	,pickbranch:function(){ 
		return this.pickList("",'picker branch',[
		0,"Show feedback and return to question",
		1,"Show feedback then branch to this page",
		2,"Just branch directly to this page"])
		.change(function(){
			var br=$(this).val();
			$(this).parent().children('.text').toggle(br!=2);
			$(this).parent().children('.dest').toggle(br!=0);
			trace(br);
		})
	}
	
		
	//,clone:function(){return 'Clone buttons';}
	
	,tableRows:function(name,headings,rowList){
		var $tbl=$('<table/>').addClass('list').data('table',name).attr('list',name);
		if (typeof headings==="object"){
			var tr="<tr valign=top>";
			for (var col in headings)
			{
				tr+="<th>"+headings[col]+"</th>";
			}
			tr+="</tr>";
			$tbl.append($(tr));
		}
		for (var row in rowList){
			var $row=$("<tr valign=top/>");
			if (rowList[row].visible==false) $row.addClass('hidden');
			//$row.append($('<td class="editicons"/>').append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/><span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
			for (var col in rowList[row].row)
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
/*
		$('.editicons .ui-icon-circle-plus',$tbl).click(function(){//live('click',function(){
			var row = $(this).closest('tr');
			row.clone(true,true).insertAfter(row).fadeIn();
		});
		$('.editicons .ui-icon-circle-minus',$tbl).click(function(){//.live('click',function(){
			var line = $(this).closest('tr').fadeOut("slow").empty();
		});
*/
		return $tbl;
	}
	
	,tableRowCounter:function(name,label,minelts,maxelts,value)
	{	//let user choose number of said item
		var c=$('<label/>').text(label);
		var s='<select list="'+name+'" class="  ui-select">';
		for (var o=minelts;o<=maxelts;o++)s+="<option>"+o+"</option>";
			s+="</select>";
		return $('<div/>').append(c.after(s).change(function(){form.tableRowAdjust(name,$('option:selected',this).val());}).val(value));
	}
	
	,tableRowAdjust:function(name,val)
	{	// Adjust number of rows. set visible for rows > val. if val > max rows, clone the last row.
		$tbl = $('table[list="'+name+'"]');
		var settings=$tbl.data('settings');
		$tbody = $('tbody',$tbl);//'table[list="'+name+'"] tbody');
		var rows = $('tr',$tbody).length;		
		for (var r=0;r<rows;r++)
			$('tr:nth('+r+')',$tbody).showit(r<val);
		for (var r=rows;r<val;r++)
			form.listManagerAddRow($tbl,$.extend({},settings.blank));
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
		for (var i=0;i<settings.list.length;i++)
			form.listManagerAddRow($tbl,settings.list[i]);
		$('tbody',$tbl).sortable({
			handle:"td .sorthandle",
			update:function(event,ui){
				form.listManagerSave((ui.item.closest('table')));
			}})

		div.append($tbl);
		/*(		div.append($('<button id="newrow"/>').button({label:'Add',icons:{primary:"ui-icon-plusthick"}}).click(function(){
			addRow($.extend({},settings.blank));
			save();
		}));

		*/
		return div;
	}
	
	
	
	
	,row:function(cols){ return "<tr valign=top><td>"+cols.join("</td><td>")+"</td></tr>";}
	,rowheading:function(cols){ return "<tr valign=top><th>"+cols.join("</th><th>")+"</th></tr>";}
};

/* */
