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
	trace('setProgress',status);
}/*
  *
	// 05/24/11 Check for answer interview ID hash. If not present or no match current interview ALWAYS start on first question.
	var hashAnswer = Global.curTemplate.getVariableValue(CVariable.interviewIDVarName);
	var hashInterview=Global.curTemplate.InterviewHash();

	if (Strings.isBlankOrNull(historyStr) || (hashAnswer != hashInterview))
	{	// No history or interview hash doesn't match answer hash (or no answer hash),
		//	start on first question.
		//ScriptTracer.trace(0,ScriptTracer.blue,false,'Restarting (no history)');
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

}
function loadNewGuidePrep(guideFile,startTabOrPage)
{
	// Place holder
}

function gotoPageView(destPageName)
{  // navigate to given page (after tiny delay)
   window.setTimeout(function(){
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
         A2JViewer.layoutPage($('#page-viewer .A2JViewer'),gPage);//$('.A2JViewer',$('#page-viewer')
      }
   },1);
}

function main(){
	loadGuideFile(gStartArgs.templateURL,"");
}

window.addEventListener("message",receiveMessage,false);

function receiveMessage(event) {
	gStartArgs  = event.data;
	main();
}

/* */
