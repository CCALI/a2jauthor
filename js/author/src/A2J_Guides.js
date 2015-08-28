/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Authoring App Guides GUI
	Guide mangement including loading/saving/archive, display list.
	2015 04/15/2013, 	05/2014

*/

/* global gGuidePath,gPage,gGuide,gUserID,gGuideID,gUserNickName */



/**
 * Parses data returned from the server
 * When guide file is finally downloaded, we can parse it and update the UI.
*/
function guideLoaded(data)
{
	var cajaDataXML;
	try {
		cajaDataXML=$(jQuery.parseXML(data.guide));
	}
	catch (e) {
		setProgress('');
		dialogAlert({title:'Error occurred loading guide #'+data.gid,body:'Unable to load XML' +"\n"+String.substr(String(e).asHTML(),0,99)});
		return;
	}
	gGuideID=data.gid;
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

			// 01/14/2015 included JSON form of guide XML
			var guideJSON_str=guide2JSON_Mobile(gGuide);

			ws( {cmd:'guidesave',
				gid:gGuideID,
				guide: xml,
				title:gGuide.title,
				json: guideJSON_str}, function(response){
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
	//$('#tabsVariables .tabContent, #tabsLogic  .tabContent, #tabsSteps .tabContent, #tabsAbout .tabContent, #tabsClauses .tabContent, #tabsText .tabContent').html("");

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

	var A2J4_XML='<?xml version="1.0" encoding="UTF-8" ?><!DOCTYPE Access2Justice_1><TEMPLATE><TITLE>My Interview</TITLE><AUTHOR>Anonymous</AUTHOR><SENDFEEDBACK>false</SENDFEEDBACK><DESCRIPTION>This is a description of my interview.</DESCRIPTION><JURISDICTION>Jurisdiction of my interview</JURISDICTION><LANGUAGE>en</LANGUAGE><AVATAR>blank</AVATAR><VERSION>7/24/2014</VERSION><A2JVERSION>2012-04-19</A2JVERSION><HISTORY>Interview created 7/24/2014</HISTORY><QUESTIONCOUNTER>4</QUESTIONCOUNTER><FIRSTQUESTION>1</FIRSTQUESTION><VARIABLES><VARIABLE SCOPE="Interview" NAME="User Gender" TYPE="Text"><COMMENT>User&apos;s gender will be used to display appopriate avatar.</COMMENT></VARIABLE><VARIABLE SCOPE="Interview" NAME="User Avatar" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client first name TE" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client middle name TE" TYPE="Text" /><VARIABLE SCOPE="Interview" NAME="Client last name TE" TYPE="Text" /></VARIABLES><STEPS><STEP NUMBER="0"><TEXT>ACCESS TO JUSTICE</TEXT></STEP><STEP NUMBER="1"><TEXT>DO YOU QUALIFY?</TEXT></STEP><STEP NUMBER="2"><TEXT>DO YOU AGREE?</TEXT></STEP><STEP NUMBER="3"><TEXT>YOUR INFORMATION</TEXT></STEP></STEPS><QUESTIONS><QUESTION ID="1" STEP="0" MAPX="13.25" MAPY="155.45" NAME="1-Introduction"><TEXT><P><FONT>This is the introduction.</FONT></P></TEXT><BUTTONS><BUTTON NEXT="2"><LABEL>Continue</LABEL></BUTTON></BUTTONS></QUESTION><QUESTION ID="2" STEP="0" MAPX="22.75" MAPY="401.85" NAME="2-Name"><TEXT><P><FONT>Enter your name.</FONT></P></TEXT><FIELDS><FIELD TYPE="text" ORDER="ASC"><LABEL>First:</LABEL><NAME>Client first name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD><FIELD TYPE="text" OPTIONAL="true" ORDER="ASC"><LABEL>Middle:</LABEL><NAME>Client middle name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD><FIELD TYPE="text" ORDER="ASC"><LABEL>Last:</LABEL><NAME>Client last name TE</NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.</INVALIDPROMPT></FIELD></FIELDS><BUTTONS><BUTTON NEXT="3" ><LABEL>Continue</LABEL></BUTTON></BUTTONS></QUESTION><QUESTION ID="3" STEP="0" MAPX="498.9" MAPY="19.9" NAME="3-Gender"><TEXT>Choose your gender.</TEXT><FIELDS><FIELD TYPE="gender"><LABEL>Gender:</LABEL><NAME>User Gender</NAME></FIELD></FIELDS><BUTTONS><BUTTON NEXT="4"><LABEL>Continue</LABEL></BUTTON></BUTTONS></QUESTION><QUESTION ID="4" STEP="1" MAPX="510.15" MAPY="396.9" NAME="1-Question 1"><TEXT><P><FONT>Text of my first question goes here.</FONT></P></TEXT><BUTTONS><BUTTON NEXT="SUCCESS"><LABEL>Save</LABEL></BUTTON></BUTTONS></QUESTION></QUESTIONS><POPUPS /></TEMPLATE>';
	// 2015-06-29 Git Issue #276 - Buttons properly labeled with 'Continue'.


	/** @type {TGuide} */
	var guide = parseXML_Auto_to_CAJA($(jQuery.parseXML(A2J4_XML)));
	var today = jsDate2mdy(today2jsDate());
	guide.title="My Interview ("+today+")";
	guide.version= today ;
	guide.notes= today +" interview created.";
	return guide;
}

// create blank guide internally, do Save As to get a server id for future saves.
function createBlankGuide() {
	var guide = blankGuide();

  var saveAsParams = {
    gid: 0,
    cmd: 'guidesaveas',
    title: guide.title,
    guide: exportXML_CAJA_from_CAJA(guide)
  };

	ws(saveAsParams, function(data) {
		if (data.error !== undefined) {
			setProgress(data.error);
		} else {
			var newgid = data.gid; //new guide id
      ws({cmd: 'guide', gid: newgid}, guideLoaded);
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

function archiveSelectedGuide() {
  // 2014-08-28 Delete the currently selected guide
	var $li = $('li.guide.' + SELECTED).first();
	var name = $('span.title', $li).text();

	dialogConfirmYesNo({
    title: 'Delete interview',
    message: 'Would you like to delete ' + name + '?',
    height: 300,
    name: name,
		Yes: function() {
		  var gid = $li.attr('gid');

			if (gid) {
        ws({cmd: 'guidearchive', gid: gid});
      }
		}
  });
}

TGuide.prototype.HotDocsAnswerSetFromCMPXML=function(cmp)
{	// 2014-08-25 Extract variables from HotDocs .CMP file (XML format)
	// Lots of handy settings that could be imported to A2J in addition to variable name/type
	/*
		<hd:components>
		<hd:text name="AGR Petitioner Mother-Father-TE" askAutomatically="false" saveAnswer="false" warnIfUnanswered="false"/>
		<hd:text name="Abuse TE" askAutomatically="false">
			<hd:prompt>List the date of every incident, the allegation, whether «Petitioner full name CO» was required to attend court, and the disposition.</hd:prompt>
			<hd:multiLine height="2"/>
		</hd:text>
	*/
	/** @type {TGuide} */
	var guide=this;

	//cmp.find('hd\\:components').children().each(function() //  doesn't work in chrome

	cmp.find("*").each(function()
	{	// Search for components A2J can handle
		var name = makestr($(this).attr("name"));
		var comment=''; // TODO? get prompt info as a comment?
		var repeating=false;
		switch (this.nodeName)
		{
			case 'hd:text':
				// hd:text name="AGR Petitioner Mother-Father-TE" askAutomatically="false" saveAnswer="false" warnIfUnanswered="false"/>
				guide.varCreate(name,CONST.vtText,repeating,comment);
				break;



			case 'hd:trueFalse':
				// <hd:trueFalse name="Petitioner unemployment TF">
				guide.varCreate(name,CONST.vtTF,repeating,comment);
				break;

			case 'hd:date':
				//	<hd:date name="Date child came into petitioner care DA">
				//		<hd:defFormat>June 3, 1990</hd:defFormat>
				//		<hd:prompt>Date on which child came into care of petitioner(s)</hd:prompt>
				//		<hd:fieldWidth widthType="calculated"/>
				//	</hd:date>
				guide.varCreate(name,CONST.vtDate,repeating,comment);
				break;

			case 'hd:number':
				//	<hd:number name="Putative children counter" askAutomatically="false" saveAnswer="false" warnIfUnanswered="false"/>
				guide.varCreate(name,CONST.vtNumber,repeating,comment);
				break;

			case 'hd:multipleChoice':
				// <hd:multipleChoice name="Child gender MC" askAutomatically="false">
				guide.varCreate(name,CONST.vtMC,repeating,comment);
				break;

			case 'hd:computation':
				//	<hd:computation name="Any parent address not known CO" resultType="trueFalse">
				// <hd:computation name="A minor/minors aff of due dliligence CO" resultType="text">
				var resultType=$(this).attr("resultType");
				switch (resultType)
				{
					case 'text':
						guide.varCreate( name,CONST.vtText,repeating,comment);
						break;
					case 'trueFalse':
						guide.varCreate( name,CONST.vtTF,repeating,comment);
						break;
				}
				break;
		}
	});

	guide.noviceTab('tabsVariables',true);
};
/* */
