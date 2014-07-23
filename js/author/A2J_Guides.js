/*******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Authoring App Guides GUI
	04/15/2013
	05/2014
	
******************************************************************************/

/* global gGuidePath,gPage,gGuide,gUserID,gGuideID,gUserNickName */


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

function blankGuide()
{	// Create minimal functioning guide with 3 pages: Welcome, Success and Failure.
	var guide = new TGuide();

	guide.title="My guide";
	guide.notes="Guide created on "+new Date();
	guide.authors=[{name:'My name',organization:"My organization",email:"email@example.com",title:"My title"}];
	guide.description="Description of this guide";
	guide.jurisdiction="My jurisdiction";
	guide.version="1";
	guide.sendfeedback=false;
	guide.language='en';
	guide.avatar='blank';
	guide.guideGender='Female';
	guide.steps=[{number:0,text:"Welcome"},{number:1,text:"Congratulations"}];

	var page1=guide.addUniquePage("1.0. Welcome");
	var page2=guide.addUniquePage("1.1. I'm Sorry");
	var page3=guide.addUniquePage("2.0. Congratulations");
	
	page1.type="A2J";
	page1.text="<p>Welcome to Access to Justice</p><p>Do you qualify?</p>";
	page1.step=0;
	page1.buttons=[
		{label:"Yes",next:page3.name,name:"",value:"", repeatVar:"",repeatVarSet:""},
		{label:"No",next: page2.name,name:"",value:"", repeatVar:"",repeatVarSet:""}];
	
	page2.type="A2J";
	page2.step=0;
	page2.text="You don't qualify.";
	page2.buttons=[{label:"Continue",next:CONST.qIDEXIT,name:"",value:"", repeatVar:"",repeatVarSet:""}];
	
	page3.type="A2J";
	page3.step=1;
	page3.text="Congratulations!";
	page3.buttons=[{label:"Finish",next:CONST.qIDSUCCESS,name:"",value:"", repeatVar:"",repeatVarSet:""}];
	
	guide.firstPage=page1.name;
	guide.exitPage='';
	
	guide.sortPages();
	guide.varCreateInternals();
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

/* */
