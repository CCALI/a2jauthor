/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	A2J Viewer app
	Used by A2J Viewer only.
	12/12/2012 
*/


$(document).ready(function(){
	lang.set('en');
	loadGuideFile(templateURL);
});

function guideStart(start)
{
	var guide=gGuide;
	
	traceLogic('Guide '+guide.title+' loaded.');
	traceLogic('#Pages: '+propCount(guide.pages)+', #Variables:'+propCount(guide.vars));

	//for (var pi in guide.pages)	traceLogic(traceTag('page',guide.pages[pi].name)); 
	
	traceLogic('Starting on page '+traceTag('page',guide.firstPage));
	gotoPageView(guide.firstPage);
   $('#page-viewer').removeClass('hidestart');
   $('#splash').empty();

}
function loadNewGuidePrep(guideFile,startTabOrPage)
{}

function gotoPageView(destPageName)
{  // navigate to given page (after tiny delay)
   window.setTimeout(function(){
      var page = gGuide.pages[destPageName]; 
      if (page == null || typeof page === "undefined")
      {
         DialogAlert( {title:'Missing page',message:'Page is missing: '+ destPageName});
         traceLogic('Page is missing: '+ traceTag('page',destPageName));
      }
      else
      {
         gPage=page;
         a2jviewer.layoutpage($('.A2JViewer',$('#page-viewer')),gGuide,gGuide.steps,gPage);
      }
   },1);
}


/* */
