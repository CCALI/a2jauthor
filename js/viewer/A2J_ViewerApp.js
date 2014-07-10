/******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	A2J Viewer app
	12/12/2012
	04/15/2013

	Used by A2J Viewer only.
*/




/** @param {...string} status */
function setProgress(status)
{
	if (status===null){
		status='';
	}
	//trace('setProgress',status);
}/*
  *
	// 05/24/11 Check for answer interview ID hash. If not present or no match current interview ALWAYS start on first question.
	var hashAnswer = Global.curTemplate.getVariableValue(CVariable.vnInterviewID);
	var hashInterview=Global.curTemplate.InterviewHash();

	if (Strings.isBlankOrNull(historyStr) || (hashAnswer != hashInterview))
	{	// No history or interview hash doesn't match answer hash (or no answer hash),
		//	start on first question.
		sb.gotoQuestion(Global.curTemplate.firstQuestion);
	}
  */
function guideStart(start)
{
	if (start.indexOf("PAGE ")===0)
	{
		start=(start.substr(5));
	}
	Languages.set(Languages.defaultLanguage);
	var guide=gGuide;
	
	traceLogic('Guide '+guide.title+' loaded.');
	traceLogic('#Pages: '+propCount(guide.pages)+', #Variables:'+propCount(guide.vars));

	//for (var pi in guide.pages)	traceLogic(traceTag('page',guide.pages[pi].name)); 
	if( "" === String(start)){
		start=guide.firstPage;
	}
	traceLogic('Starting on page '+traceTag('page',start));
	gotoPageView(start);
   $('#page-viewer').removeClass('hidestart');
   $('#splash').empty();
	if (CONST.devShowTesting)
	{
		$('.A2JViewer').toggleClass('test',500);
	}
	
	
	// Auto load answer file when starting Viewer only. 
	gGuide.loadXMLAnswerExternal({
		url:gStartArgs.getDataURL 
		,success:function(){
			//dialogAlert({title:'DEBUG Answer files answers',body:prettyXML(gGuide.HotDocsAnswerSetXML()),width:800,height:600});
		}});
}

function loadNewGuidePrep(guideFile,startTabOrPage)
{
	// Place holder
}




function doSetDataURL(target)
{	// Upload data to server.
	// target is either "_self" or "_blank"
/*
	if (gStartArgs.localClient===1)
	{	// 5/5/10  3.6
		// Running viewer in local mode. Send answer file to caller to save.
		//var RawXML:String=Global.curTemplate.HotDocsAnswerSetXML().toString();
		//External.saveAnswer(RawXML,this);
	}
	else
*/
	{	// Post as AnswerKey variable.
		var $form = $('<form action="'+gStartArgs.setDataURL+'" method=POST accept-charset="UTF-8" target=_parent><input type=hidden id="AnswerKey" name="AnswerKey"/></form>');
		$('body').append($form);
		var answers = gGuide.HotDocsAnswerSetXML();
		$('#AnswerKey').val(answers);
		$form.submit();
	}
}


function gotoPageView(destPageName)
{  // Viewer-only navigate to given page (after tiny delay)
   window.setTimeout(function()
	{
		var url;
		if (destPageName === CONST.qIDSUCCESS)
		{	// On success exit, flag interview as Complete.
			// Save data
			gGuide.varSet(CONST.vnInterviewIncompleteTF,false);
			// 9/01/09 3.0.3 Display an progress dialog when submitting data.
			doSetDataURL('_self');
		}
		else
		if (destPageName === CONST.qIDEXIT)
		{	//Exit/Resume
			gGuide.varSet(CONST.vnInterviewIncompleteTF,true);
			doSetDataURL('_self');
		}
		else
		if (destPageName === CONST.qIDFAIL)
		{
			url=gStartArgs.exitURL;
			window.parent.location = url; // Replace parent, not just this IFRAME.
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
			/** @type TPage */
			var page = gGuide.pages[destPageName];
			if (typeof page === 'undefined')
			{
				dialogAlert( 'Page is missing: '+ destPageName );
				traceLogic('Page is missing: '+ traceTag('page',destPageName));
			}
			else
			{
				gPage=page;
				A2JViewer.layoutPage($('#page-viewer .A2JViewer'),gPage);
			}
		}
		
   },1);
}

function main(){
	inAuthor=false;
	loadGuideFile(gStartArgs.templateURL,"");
}

window.addEventListener("message",receiveMessage,false);

function receiveMessage(event) {
	gStartArgs  = event.data;
	main();
}

/* */
