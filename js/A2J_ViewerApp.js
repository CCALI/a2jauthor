/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	A2J Viewer app
	12/12/2012
	04/15/2013

	Used by A2J Viewer only.
*/
var a2jVDev = 1;


$(document).ready(function(){
	loadGuideFile(templateURL,"");
});



function setProgress(status)
{
	if (status===null){
		status="";
	}
	trace(status);
}
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
	if (a2jVDev)
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
         dialogAlert( {title:'Missing page',message:'Page is missing: '+ destPageName});
         traceLogic('Page is missing: '+ traceTag('page',destPageName));
      }
      else
      {
         gPage=page;
         A2JViewer.layoutPage($('.A2JViewer',$('#page-viewer')),gGuide,gGuide.steps,gPage);
      }
   },1);
}


/* */
