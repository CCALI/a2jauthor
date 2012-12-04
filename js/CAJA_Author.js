/*	CALI Author 5 - CAJA Authoring   
 	03/30/2012 
 */


var gShowLogic=1;
var gShowText=1;

/*      */
function DEBUGSTART(){
	var SAMPLES = [
		"tests/data/Field Characters Test.a2j#4-1 If thens",
		"tests/data/A2J_NYSample_interview.xml",
		"tests/data/Field Characters Test.a2j#1-5 Fields Test 1",
		"tests/data/Field Characters Test.a2j#0-1 Intro",
		"tests/data/A2J_FieldTypesTest_Interview.xml#1-1 Name",
		"tests/data/CBK_CAPAGETYPES_jqBookData.xml", 
		"tests/data/CBK_CAPAGETYPES_jqBookData.xml#MC Choices 3: 4 choices", 
		"tests/data/A2J_MobileOnlineInterview_Interview.xml",
		"tests/data/A2J_ULSOnlineIntake081611_Interview.xml#1b Submit Application for Review",
		"tests/data/CBK_EVD03_jqBookData.xml"
	];
	$(SAMPLES).each(function(i,elt){$('#samples').append('<li><a href="#sample">'+elt+'</a></li>')})
//	<li><a href="#sample">tests/data/A2J_FieldTypesTest_Interview.xml#1-1 Name</a></li>
//	<li><a href="#sample">tests/data/A2J_NYSample_interview.xml</a></li>
//	<li><a href="#sample">tests/data/A2J_MobileOnlineInterview_Interview.xml</a></li>
//	<li><a href="#sample">tests/data/A2J_ULSOnlineIntake081611_Interview.xml#1b Submit Application for Review</a></li>
//	<li><a href="#sample">tests/data/CBK_CAPAGETYPES_jqBookData.xml#Text Select 2</a></li>
//	<li><a href="#sample">tests/data/CBK_CAPAGETYPES_jqBookData.xml#MC Choices 3: 4 choices</a></li>
//	<li><a href="#sample">tests/data/CBK_EVD16_jqBookData.xml</a></li>
//	<li><a href="#sample">tests/data/CBK_EVD03_jqBookData.xml</a></li>
//	var t="";	for( var m=1000;m<2500;m++) t+= m +" " ;	$('#Mapper').append( t);
	loadGuideFile($('a[href="#sample"]').first().text(), "TAB ABOUT");
	$('#splash').hide();
	//$('#welcome').hide();
	layoutPanes();
	
	
	
	
} /* */
 
 
$(document).ready(function () {
   // Everything loaded, execute.
   lang.set('en');

   if (typeof tinyMCE === "undefined") tinyMCE = {};

	$('#welcome, #texttoolbar').hide();
	
	$('#welcome').dialog({autoOpen:false, height:500, width:500, close:function(event,ui){ 
		if (typeof event.originalEvent=='object')	signinask();
	}} );
	
	
   // Activate TABS
	$('.tabset').tabs();	
	tabGUI();
	
	
	$('#tabviews').bind('tabsselect', function(event, ui) {
		switch (ui.panel.id){
			case 'tabsPageView':
				//a2jviewer.layoutpage(ui.panel,gGuide,gGuide.steps,gPage); 
				break;
			case 'tabsAbout':
			case 'tabsVariables':
			case 'tabsSteps':
			case 'tabsLogic':
			case 'tabsText':
			case 'tabsConstants':
				noviceTab(gGuide,ui.panel.id);
				break;
	
			default:
		}
		}); 

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
	$('#cajasettings').menu();
	$('#cajasettings a').click(function(){
			var attr = $(this).attr('href'); 
			switch (attr) {
				case '#save':
					if (gGuide!=null)
						if (gGuideID!=0)
							guideSave();
					break;
				case '#sample': 
					loadGuideFile($(this).text(), "tabsAbout");
					break;
				case '#mode1': setMode(1); break;
				case '#mode2': setMode(2); break;
				case '#mode3': setMode(3); break;
				case '#bold': document.execCommand('bold', false, null); break;
				case '#italic': document.execCommand('italic', false, null); break;
				case '#indent': document.execCommand('indent', false, null); break;
				case '#outdent': document.execCommand('outdent', false, null); break;
				case '#text2xml': toxml(); break;
				case '#collapse': hidem(1); break;
				case '#reveal': hidem(0); break;
				case '#theme':
					styleSheetSwitch($(this).text());
					break;
				default:
					alert('Unhandled ' + attr);
			}
			return false;
		});
	
	$('#page-viewer').dialog({ 
		title:'A2J Viewer',
		autoOpen:false,
		width: 1000,
		height: 800,
		modal:false,
		minWidth: 300,
		minHeight: 500, maxHeight: 800,
		buttons:[
		{text:'Return', click:function(){ 
		//alert('pretend Save...');
		}},
		{text:'Edit this page', click:function(){ 
		//alert('pretend Save...');
		}},
		{text:'Variables', click:function(){ 
		//alert('pretend Save...');
		}},
		{text:'Logic tracer', click:function(){ 
		//alert('pretend Save...');
		}},
		{text:'Close',click:function(){ 
			$(this).dialog("close");
		 }}
	]});

	
	
	$( "#bold" ).button({label:'B'}).click(editButton);
	$( "#italic" ).button({label:'I'}).click(editButton);
	$( "#link" ).button({text:false, icons: {primary:'ui-icon-link'}}).click(editButton);
	$( "#popup" ).button({label:'P'}).click(editButton);
	
	$( document ).tooltip();
});


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

function signin(data)
{
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
		layoutPanes();
		$('#welcome').show();
		
		$('#tabviews').tabs( { disabled: [1,2,3,4,5,6,7,8,9]});
		ws({cmd:'guides'},listguides);
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
				  ws({cmd:'login',username:$('#username').val(),userpass:$('#userpass').val()},signin);
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

function toxml()
{  // convert page at selection start into XML

}
function showPageOnMap()
{
	var target=$(this).attr('target');
}

function showPageToEdit()
{	// Clicked on index, scroll to the right place in the document.
	var target=$(this).attr('target')
//	if (editMode==1)
//		showPageToEditTextOnly(target)
//	else
		gotoTabOrPage(target);
}
function gotoPageShortly(dest)
{	// navigate to given page (after tiny delay)
	window.setTimeout(function(){
		gotoTabOrPage("PAGE "+(dest));
		var $viewer=$('#page-viewer');
		a2jviewer.layoutpage($('div',$viewer),gGuide,gGuide.steps,gPage);
		$viewer.dialog('moveToTop').dialog('open' );
		//$('#tabviews').tabs('select','#tabsPageView');
		//a2jviewer.layoutpage($('#tabsPageView'),gGuide,gGuide.steps,gPage);
	},1);
}

function gotoPageEdit(pageName)
{	// Bring page edit window forward with page content 
   var page = gGuide.pages[pageName]; 
	if (page == null || typeof page === "undefined") return;
	$('#tabsLogic  .tabContent, #tabsText .tabContent').html("");//clear these so they refresh with new data. TODO - update in place
	var $page =	$('.page-edit-form').filter(function(){ return pageName == $(this).attr('rel')});
	if ($page.length==0){
		$page = $('.page-edit-form:first').clone(false,false);//.appendTo('#desktop');//.removeClass('ui-helper-hidden');
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
			{text:'Preview', click:function(){ 
				gotoPageShortly($(this).attr('rel'));
			}},
			{text:'Close',click:function(){ 
				$(this).dialog("close");
			 }}
		]});
		var page = gGuide.novicePage($('.page-edit-form-panel',$page).html(''),page.name);	
	}
	
	//$('#tabsPageEdit').html('');$('#tabviews').tabs('select','#tabsPageEdit');
	//var page = gGuide.novicePage($('#tabsPageEdit'),pageName);
	$page.dialog('open' );
	$page.dialog('moveToTop');
}
function gotoTabOrPage(target)
{
	selectTab(target);
	
	// Remove existing editors 
	for (var edId in tinyMCE.editors)
		tinyMCE.editors[edId].remove();
 
 	trace("gotoTabOrPage:"+target);
	
	if (target.indexOf("PAGE ")==0)
	{
		gotoPageEdit(target.substr(5));
	}
	else
	if (target.indexOf("STEP ")==0)
	{
		$('#tabviews').tabs('select','#tabsSteps');
	}
	else{
		$('#tabviews').tabs('select',target);
	}	
	// Attach editors
	//attach all immediate $('.tinyMCEtext').each(function(){tinyMCE.execCommand("mceAddControl", false, $(this).attr('id'));	});
/*	$('.tinyMCEtext').click(function(){
		var id=$(this).attr('id');
		tinyMCE.execCommand("mceAddControl", false, id);
		tinyMCE.execCommand('mceFocus',true,id);
		
		});
*/
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
	//trace(JSON.stringify(data));
	$.ajax({
		url:'CAJA_WS.php',
		dataType:'json',
		type: 'POST',
		data: data,
		success: function(data){ 
			//trace(String.substr(JSON.stringify(data),0,299));
			results(data);
		},
		error: function(err,xhr) { alert("error:"+xhr.responseText ); }
	})
}  







//*** Mapper ***
var mapperScale=1;
var mapSize= 1 ; //0 is small, 1 is normal

function buildMap()
{	// Contruct mapper flowcharts. 
	var $map = $('.map');
	$map.empty();
	//$('.MapViewer').removeClass('big').addClass(mapSize==1 ? 'big':'');
	/*
	if (mapSize==0)
	{	// Render only boxes, no lines
		// Could be used for students but need to remove popups and add coloring.
		var YSC=.15;// YScale
		var XSC=.1 ;
		for (var p in book.pages)
		{
			var page=book.pages[p];
			if (page.mapbounds != null)
			{
				var nodeLeft=XSC*parseInt(page.mapbounds[0]);
				var nodeTop=YSC*parseInt(page.mapbounds[1]);
				$(".map").append(''
					+'<div class="node tiny" rel="'+page.mapid+'" style="left:'+nodeLeft+'px;top:'+nodeTop+'px;"></div>'
					//+'<span class="hovertip">'+page.name+'</span>'
				);
			}
		}
	}*/
	if (mapSize==1)
	{	// Full size boxes with question names and simple lines connecting boxes.
		var YSC=1.35;// YScale
		var NW=56;//half node width
		for (var p in gGuide.pages)
		{
			var page=gGuide.pages[p];
			if (page.mapx>0) 
			{
				var nodeLeft=page.mapx;
				var nodeTop= page.mapy;
				$map.append(''
					+(page.type=="Pop-up page" ? '':'<div class="arrow" style="left:'+(nodeLeft+50)+'px; top:'+(nodeTop-16)+'px;"></div>')
					+'<div class="node" rel="'+page.mapid+'" style="left:'+nodeLeft+'px;top:'+nodeTop+'px;">'+page.name+'</div>'
					+lineV(nodeLeft+NW,nodeTop+46,10)
					);
				var downlines=false;
				/* Outgoing branches to show:  
						A2J - Buttons with Destination, Script GOTOs
						CA - Next page, Feedback branches, Script GOTOs
				*/
				if (page.mapBranches==null)
				{
					var branches=[];
					for (var b in page.buttons)
					{
						var btn = page.buttons[b];
						branches.push({label:btn.label, dest: btn.next} );
					}
					page.mapBranches=branches;
				}
				/*
				var nBranches=page.mapBranches.length;
				var boffset = nBranches %2 * .5;
				for (var b in page.mapBranches)
				{
					var branch = page.mapBranches[b];
					var branchLeft=nodeLeft + (b+boffset)*30;
					var branchTop= nodeTop + 100;
					var branchWidth=50;
					if (branch.dest!="")
					{
						var destLeft= branch.dest.mapx+NW;
						var destTop = branch.dest.mapy;
						if (destTop>nodeTop) downlines=true;
						var x1 =branchLeft+branchWidth/2;// nodeLeft+NW-(b-nBranches/2)*5;
						var y1 =branchTop+18;// nodeTop+46;
						var y2 = y1 + 10 +((nBranches-b)*2);
						var x2,x3;
						if (destLeft<x1 ) {x2=destLeft;x3=x1;} else {x2=x1;x3=destLeft};
						$(".map").append(''
							+(destTop>nodeTop ?  lineV( x1,y1, y2-y1) + lineH(x2,y2,x3-x2):'')
							);
					}
					$(".map").append('<div class="branch" rel="'+branch.dest+'" style="left:'+(branchLeft)+'px; top:'+branchTop+'px; width:'+branchWidth+'px;">'+branch.text+'</div>');
				}*/
			}
		}
		$('.branch',$map).click(function(){focusNode($('.map > .node[rel="'+$(this).attr('rel')+'"]'));	});
	}
	$('.node',$map).click(function(){	focusNode($(this));});
//	focusPage()
}
function lineV(left,top,height)
{
	return '<div class="line" style="left:'+left+'px;top:'+top+'px;width:1px;height:'+height+'px;"></div>';
}
function lineH(left,top,width)
{
	return '<div class="line" style="left:'+left+'px;top:'+top+'px;width:'+width+'px;height:1px;"></div>';
}
/*
function focusPage()
{
	focusNode($('.map > .node[rel="'+page.mapid+'"]'))
}
*/



function BlankGuide(){
	var guide = new TGuide();

	guide.title="My guide";
	guide.notes="Guide created on "+new Date();
	guide.authors=[{name:'My name',organization:"My organization",email:"email@example.com",title:"My title"}];
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
	var guide = gGuide;
	prompt('Saving '+guide.title + AJAXLoader);
	ws( {cmd:'guidesave',gid:gGuideID, guide: exportXML_CAJA_from_CAJA(guide), title:guide.title}, function(response){
		if (response.error!=null)
			prompt(response.error);
		else
			prompt(response.info);
	});
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
//		$(this).html('Loading guide '+$(this).text()+AJAXLoader);
		var guideFile=$(this).text();
		$('li.guide[gid="'+gid+'"]').html('Loading guide '+guideFile+AJAXLoader).addClass('.warning');
		loadNewGuidePrep(guideFile,'');
		if(gid=='a2j')
			createBlankGuide();
		else
			ws({cmd:'guide',gid:gid},guideloaded);
		//loadGuide($('a[href="#sample"]').first().text(), "TAB ABOUT");
	});
	$('#welcome').dialog('open');
}







TGuide.prototype.novicePage = function (div, pagename) {	// Create editing wizard for given page.
   var t = ""; 
	
   var page = this.pages[pagename]; 
	 
	var t=$('<div/>').addClass('tabsPanel editq');

	trace("Loading page "+pagename);
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
			trace('udpate show me',showMe);
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
						change:function(val,field){field.name=val}}));
					ff.append(form.text({label:'Default value:',name:'default', placeholder:'Default value',value:  field.value,
						change:function(val,field){field.value=val}}));
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
					trace(b.next,val);
					b.next=val;}}));
					return ff;
				}}));
			t.append(fs);
		}
		var fs=form.fieldset('Advanced Logic');
		fs.append(form.codearea({label:'Before:',	value:page.codeBefore,	change:function(val){page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
		fs.append(form.codearea({label:'After:',	value:page.codeAfter, 	change:function(val){page.codeAfter=val; /* TODO Compile for syntax errors */}} ));
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
	div.append('<div class=xml>'+htmlEscape(page.xml)+'</div>');

	gPage = page;
	return page;
}
function tabGUI()
{
	//$('table.list').hover(function(){$('.editicons',this).showIt(1);},function(){$('.editicons',this).showIt(0);});
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
		trace(mapperScale);
		$('.map').css({zoom:mapperScale,"-moz-transform":"scale("+mapperScale+")","-webkit-transform":"scale("+mapperScale+")"});
	});
	$('#tabsMapper button').first().button({label:'Fit',icons:{primary:'ui-icon-arrow-4-diag'}}).next().button({label:'Zoom in',icons:{primary:'ui-icon-zoomin'}}).next().button({label:'Zoom out',icons:{primary:'ui-icon-zoomout'}});
	
	
	$('#vars_load').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	$('#vars_load2').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	
	$('#showlogic').buttonset();
	$('#showlogic1').click(function(){gShowLogic=1;noviceTab(gGuide,"tabsLogic",true)});
	$('#showlogic2').click(function(){gShowLogic=2;noviceTab(gGuide,"tabsLogic",true)});
	$('#showtext').buttonset();
	$('#showtext1').click(function(){gShowText=1;noviceTab(gGuide,"tabsText",true)});
	$('#showtext2').click(function(){gShowText=2;noviceTab(gGuide,"tabsText",true)});
}


function noviceTab(guide,tab,clear)
{	// 08/03/2012 Edit panel for guide sections 
	var div = $('#'+tab);
	//if (div.html()!="") return;
	var t = $('.tabContent',div);
	if (clear) t.html("");
	if (t.html()!="") return;
	
//	var t=$('<div/>').addClass('tabsPanel editq')//.append($('<div/>').addClass('tabsPanel2'));//editq
	form.clear();
	
	switch (tab){
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
				if ((gShowLogic==2) || (gShowLogic==1 && (page.codeBefore!="" || page.codeAfter!="")))
				{
					var pagefs=form.fieldset(page.name, page);
					if (gShowLogic==2 || page.codeBefore!="")
						pagefs.append(form.codearea({label:'Before:',	value:page.codeBefore,	change:function(val,page){
							page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
					if (gShowLogic==2 || page.codeAfter!="")
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
					if (gShowText==2 || page.learn!="") 			pagefs.append(form.text({label:'Learn More prompt:',placeholder:"",	value:page.learn,
															change:function(val,page){page.learn=val }} ));
					if (gShowText==2 || page.help!="") 			pagefs.append(form.htmlarea({label:"Help:",					value:page.help,
															change:function(val,page){page.help=val}} ));
					if (gShowText==2 || page.helpReader!="") 	pagefs.append(form.htmlarea({label:'Help Text Reader:',	value:page.helpReader,
															change:function(val,page){page.helpReader=val}} ));

					for (var f in page.fields)
					{
						var field = page.fields[f];
						var ff=form.fieldset('Field '+(parseInt(f)+1),field);
						ff.append(form.htmlarea({label:'Label:',   value:field.label, 
							change:function(val,field){field.label=val;}}));
						if (gShowText==2 || field.value!="") ff.append(form.text({label:'Default value:',placeholder:"",name:'default', value:  field.value,
							change:function(val,field){field.value=val}}));
						if (gShowText==2 || field.invalidPrompt!="") ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,
							change:function(val,field){field.invalidPrompt=val}}));						
						pagefs.append(ff);
					}
					for (var bi in page.buttons)
					{
						var b = page.buttons[bi];
						var bf=form.fieldset('Button '+(parseInt(bi)+1),b);
						if (gShowText==2 || b.label!="")
							bf.append(form.text({ 		value: b.label,label:'Label:',placeholder:'button label',		change:function(val,b){b.label=val}}));
						if (gShowText==2 || b.value!="")
							bf.append(form.text({ 		value: b.value,label:'Default value',placeholder:'Default value',		change:function(val,b){b.value=val}}));
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
			
			/*
			fs.append(form.tableManager({name:'Authors',picker:'',min:1,max:12,list:guide.authors,blank:blankAuthor
				,columns: ['Name','Title','Organization','EMail']
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(author){
					var cols=[
						form.text({  placeholder:'author name',value:author.name,
							change:function(val,author){author.name=val}})
						,form.text({  placeholder:'job title',value:author.title,
							change:function(val,author){author.title=val}})
						,form.text({  placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val}})
						,form.text({  placeholder:'email',value:author.email,
							change:function(val,author){author.email=val}})
					];
					return cols;
				}}));*/

			var fs = form.fieldset('Revision History');  
			fs.append(form.text({label:'Current Version:',value:guide.version,change:function(val){guide.version=val}}));
			fs.append(form.htmlarea({label:'Revision Notes',value:guide.notes,change:function(val){guide.notes=val}}));
			t.append(fs);
			
			var fs=form.fieldset('Authors');
			fs.append(form.listManager({name:'Authors',picker:'Number of authors',min:1,max:12,list:guide.authors,blank:blankAuthor
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(ff,author){
						ff.append(form.text({  label:"Author's name:", placeholder:'author name',value:author.name,
							change:function(val,author){author.name=val}}));
						ff.append(form.text({  label:"Author's job title:", placeholder:'job title',value:author.title,
							change:function(val,author){author.title=val}}));
						ff.append(form.text({  label:"Author's Organization:", placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val}}));
						ff.append(form.text({  label:"Author's email:", placeholder:'email',value:author.email,
							change:function(val,author){author.email=val}}));
					return ff;
				}}));
				
			t.append(fs);
			

			break;

		case "tabsVariables":
			t.append(form.h1('Variables'));
			var tt=form.rowheading(["Name","Type","Comment"]); 
			//sortingNatural
			var sortvars=[];
			for (vi in guide.vars) sortvars.push(guide.vars[vi]);
			sortvars.sort(function (a,b){ if (a.sortName<b.sortName) return -1; else if (a.sortName==b.sortName) return 0; else return 1;});
			for (vi in sortvars)
			{
				v=sortvars[vi];
				tt+=form.row([v.name,v.type,v.comment]);
			}
			t.append('<table class="A2JVars">'+tt+"</table>");
			break;
			
		case 'tabsSteps':
			var fs=form.fieldset('Steps'); 
			fs.append(form.tableRowCounter('Steps','Number of steps',2, CONST.MAXSTEPS,guide.steps.length)); 
			var steps=[];
			for (var s in guide.steps)
			{
				var step=guide.steps[s];
				//tt+=form.row([step.number,step.text]);
				steps.push({ row: [form.text({value:step.number,class:'narrow'}),form.text({value:step.text})]});
			}
			//t+='<table class="A2JSteps">'+tt+"</table>";
			fs.append(form.tableRows('Steps',['Step','Sign'],steps).addClass('A2JSteps'));
			t.append(fs);
			
			break;
	}
	form.finish(t);
	//div.append(t);
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




function layoutPanes()
{
}
