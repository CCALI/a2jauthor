/*******************************************************************************
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
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
	//$('li.guide[gid="'+gGuideID+'"]').html(gGuide.title);

	gGuidePath=urlSplit(data.path).path; 
	guideStart('');
	setProgress('');
}

function guideSave(onFinished)
{	// Save current guide, but only if the XML has changed since last save to avoid upload overhead.
	// If successful/or unsuccesful save, call onFinished.
	if (gGuide!==null && gGuideID!==0)
	{
		setProgress('Saving '+gGuide.title,true);
		var xml = exportXML_CAJA_from_CAJA(gGuide);
		if (xml!==gGuide.lastSaveXML) {
			gGuide.lastSaveXML=xml;
			ws( {cmd:'guidesave',gid:gGuideID, guide: xml, title:gGuide.title}, function(response){
				setProgress((makestr(response.error)!=='') ? response.error : 'Saved');
				if (onFinished){
					onFinished();
				}
			});
		}
		else
		{
			setProgress('No changes since last save');
			if (onFinished){
				onFinished();
			}
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
{	// 2014-07-24 Create exact duplicate of A2J 4's New Interview. 
	//var A2J4_XML='<?xml version="1.0" encoding="UTF-8" ?><!DOCTYPE Access2Justice_1><TEMPLATE><TITLE>My Interview</TITLE><AUTHOR>Anonymous</AUTHOR><SENDFEEDBACK>false</SENDFEEDBACK><DESCRIPTION>This is a description of my interview.</DESCRIPTION><JURISDICTION>Jurisdiction of my interview</JURISDICTION><LANGUAGE>en</LANGUAGE><AVATAR>blank</AVATAR><VERSION>7/24/2014</VERSION><A2JVERSION>2012-04-19</A2JVERSION><HISTORY>Interview created 7/24/2014</HISTORY><QUESTIONCOUNTER>4</QUESTIONCOUNTER><FIRSTQUESTION>1</FIRSTQUESTION><VARIABLES><VARIABLE SCOPE="Interview" NAME="User Gender" TYPE="Text"><COMMENT>User&apos;s gender will be used to display appopriate avatar.</COMMENT></VARIABLE><VARIABLE SCOPE="Interview" NAME="User Avatar" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client first name TE" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client middle name TE" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client last name TE" TYPE="Text" /></VARIABLES><STEPS><STEP NUMBER="0"><TEXT>ACCESS TO JUSTICE</TEXT></STEP><STEP NUMBER="1"><TEXT>DO YOU QUALIFY?</TEXT></STEP><STEP NUMBER="2"><TEXT>DO YOU AGREE?</TEXT></STEP><STEP NUMBER="3"><TEXT>YOUR INFORMATION</TEXT></STEP></STEPS><QUESTIONS><QUESTION ID="1" STEP="0" MAPX="15" MAPY="146" NAME="1-Introduction"><TEXT><P><FONT>This is the introduction.</FONT></P></TEXT><BUTTONS><BUTTON NEXT="2" /></BUTTONS></QUESTION><QUESTION ID="2" STEP="0" MAPX="15" MAPY="396" NAME="2-Name"><TEXT><P><FONT>Enter your name.</FONT></P></TEXT><FIELDS><FIELD TYPE="text" ORDER="ASC"><LABEL>First:</LABEL><NAME>Client first name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD><FIELD TYPE="text" OPTIONAL="true" ORDER="ASC"><LABEL>Middle:</LABEL><NAME>Client middle name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD><FIELD TYPE="text" ORDER="ASC"><LABEL>Last:</LABEL><NAME>Client last name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD></FIELDS><BUTTONS><BUTTON NEXT="3" /></BUTTONS></QUESTION><QUESTION ID="3" STEP="0" MAPX="15" MAPY="646" NAME="3-Gender"><TEXT>Choose your gender.</TEXT><FIELDS><FIELD TYPE="gender"><LABEL>Gender:</LABEL><NAME>User Gender</NAME></FIELD></FIELDS><BUTTONS><BUTTON NEXT="4" /></BUTTONS></QUESTION><QUESTION ID="4" STEP="1" MAPX="15" MAPY="896" NAME="1-Question 1"><TEXT>Text of my first question goes here.</TEXT><BUTTONS><BUTTON /></BUTTONS></QUESTION></QUESTIONS><POPUPS /></TEMPLATE>';
	var A2J4_XML='<?xml version="1.0" encoding="UTF-8" ?><!DOCTYPE Access2Justice_1><TEMPLATE><TITLE>My Interview</TITLE><AUTHOR>Anonymous</AUTHOR><SENDFEEDBACK>false</SENDFEEDBACK><DESCRIPTION>This is a description of my interview.</DESCRIPTION><JURISDICTION>Jurisdiction of my interview</JURISDICTION><LANGUAGE>en</LANGUAGE><AVATAR>blank</AVATAR><VERSION>7/24/2014</VERSION><A2JVERSION>2012-04-19</A2JVERSION><HISTORY>Interview created 7/24/2014</HISTORY><QUESTIONCOUNTER>4</QUESTIONCOUNTER><FIRSTQUESTION>1</FIRSTQUESTION><VARIABLES><VARIABLE SCOPE="Interview" NAME="User Gender" TYPE="Text"><COMMENT>User&apos;s gender will be used to display appopriate avatar.</COMMENT></VARIABLE><VARIABLE SCOPE="Interview" NAME="User Avatar" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client first name TE" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client middle name TE" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client last name TE" TYPE="Text" /></VARIABLES><STEPS><STEP NUMBER="0"><TEXT>ACCESS TO JUSTICE</TEXT></STEP><STEP NUMBER="1"><TEXT>DO YOU QUALIFY?</TEXT></STEP><STEP NUMBER="2"><TEXT>DO YOU AGREE?</TEXT></STEP><STEP NUMBER="3"><TEXT>YOUR INFORMATION</TEXT></STEP></STEPS><QUESTIONS><QUESTION ID="1" STEP="0" MAPX="13.25" MAPY="155.45" NAME="1-Introduction"><TEXT><P><FONT>This is the introduction.</FONT></P></TEXT><BUTTONS><BUTTON NEXT="2" /></BUTTONS></QUESTION><QUESTION ID="2" STEP="0" MAPX="22.75" MAPY="401.85" NAME="2-Name"><TEXT><P><FONT>Enter your name.</FONT></P></TEXT><FIELDS><FIELD TYPE="text" ORDER="ASC"><LABEL>First:</LABEL><NAME>Client first name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD><FIELD TYPE="text" OPTIONAL="true" ORDER="ASC"><LABEL>Middle:</LABEL><NAME>Client middle name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD><FIELD TYPE="text" ORDER="ASC"><LABEL>Last:</LABEL><NAME>Client last name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD></FIELDS><BUTTONS><BUTTON NEXT="3" /></BUTTONS></QUESTION><QUESTION ID="3" STEP="0" MAPX="498.9" MAPY="19.9" NAME="3-Gender"><TEXT>Choose your gender.</TEXT><FIELDS><FIELD TYPE="gender"><LABEL>Gender:</LABEL><NAME>User Gender</NAME></FIELD></FIELDS><BUTTONS><BUTTON NEXT="4" /></BUTTONS></QUESTION><QUESTION ID="4" STEP="1" MAPX="510.15" MAPY="396.9" NAME="1-Question 1"><TEXT><P><FONT>Text of my first question goes here.</FONT></P></TEXT><BUTTONS><BUTTON /></BUTTONS></QUESTION></QUESTIONS><POPUPS /></TEMPLATE>';


	return parseXML_Auto_to_CAJA($(jQuery.parseXML(A2J4_XML)));
}

function createBlankGuide()
{	// create blank guide internally, do Save As to get a server id for future saves.
	var guide = blankGuide();

	ws({cmd:'guidesaveas',gid:0, guide: exportXML_CAJA_from_CAJA(guide), title: guide.title},function(data)
	{
		if (data.error!==undefined)
		{
			setProgress(data.error);
		}
		else
		{
			var newgid = data.gid;//new guide id
			ws({cmd:'guides'},function (data)
			{
				listGuides(data);
				ws({cmd:'guide',gid:newgid},guideLoaded);
			});
		}
	});
}

function openSelectedGuide()
{	// Open the currently selected guide (either double click or via Open button)
	var $li=$('li.guide.'+SELECTED).first();
	var gid=$li.attr('gid');
	if (!gid) {
		return;
	}
	var guideFile=$li.text();
	setProgress('Loading guide '+guideFile,true);
	loadNewGuidePrep(guideFile,'');
	$('#splash').hide();
	if(gid==='a2j'){
		createBlankGuide();
	}
	else{
		ws({cmd:'guide',gid:gid},guideLoaded);
	}
}

function archiveSelectedGuide()
{	// 2014-08-28 Delete the currently selected guide	
	var $li=$('li.guide.'+SELECTED).first();
	var name = $('span.title',$li).text();
	dialogConfirmYesNo({title:'Delete interview',message:'Would you like to delete '+name+'?',height:300,name:name,
		Yes:
		function()
		{
			var gid=$li.attr('gid');
			if (!gid) {
				return;
			}
			ws({cmd:'guidearchive',gid:gid},wsListGuides);
		}});
	
}
function wsListGuides()
{
	ws({cmd:'guides'},listGuides);
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
			
			var size='?';
			var modified='?';
			//var pagecount='?';
			if (g.details!=='')
			{
				size=Math.ceil(g.details.size/1024)+'K';
				modified= g.details.modified;
				//pagecount=g.details.pagecount;
			}
			if (g.title==='') {
				g.title='Untitled';
			}
			var str='<li class=guide gid="' + g.id + '">'
				+'<span class=title>' + g.title +'</span>'
				+'<span class=id>#' + g.id+ '</span>'
				+'<span class=size>' + size + '</span>'
				+'<span class=modified>' + modified + '</span>'
				//+'<span class=pagecount>' + pagecount + '</span>'
				//+(g.owned?  '<pan class=delete></span>' : '')
			+ '</li>';
			if (g.owned)
			{
				guideListMy.push(str);
			} else {
				guideListSamples.push(str);
			}
		}
	);
	$('#guideListNew').html(guideListNew.join(''));
	$('#guideListMy').html(guideListMy.join(''));
	
	$('#guideListSamples').html(guideListSamples.join(''));

	$('li.guide').click(function(){$('li.guide').removeClass(SELECTED);$(this).addClass(SELECTED);});
	$('li.guide').dblclick(openSelectedGuide);
	
	//$('#welcome').dialog('open');
}

/* */
