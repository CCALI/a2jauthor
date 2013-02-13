/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	A2J Viewer app
	Used by A2J Viewer only.
	12/12/2012 
*/
var a2jVDev = 1;


$(document).ready(function(){
	loadGuideFile(templateURL,"");
});

function guideStart(start)
{
	Languages.set(Languages.defaultLanguage);
	var guide=gGuide;
	
	traceLogic('Guide '+guide.title+' loaded.');
	traceLogic('#Pages: '+propCount(guide.pages)+', #Variables:'+propCount(guide.vars));

	//for (var pi in guide.pages)	traceLogic(traceTag('page',guide.pages[pi].name)); 
	
	traceLogic('Starting on page '+traceTag('page',guide.firstPage));
	gotoPageView(guide.firstPage);
   $('#page-viewer').removeClass('hidestart');
   $('#splash').empty();
	if (a2jVDev)
	{
		$('.A2JViewer').toggleClass('test',500);
	}

}
function loadNewGuidePrep(guideFile,startTabOrPage)
{}

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
