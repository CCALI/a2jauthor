// A2J Viewer app 
// Required by Author and Viewers
// 12/12/2012 

$(document).ready(function(){
	lang.set('en');
//	var html='<div class="Viewer" title="A2J Viewer"><ul class="NavBar"> <li><a href="#">Back</a></li> <li><a href="#">Next</a></li> <li>Progress: <select id="history"><option>Question 1</option><option>Question 2</option></select></li> <li class="right size3"><a href="#">A</a></li> <li class="right size2"><a href="#">A</a></li> <li class="right size1"><a href="#">A</a></li> <li class="right"><a href="#">Exit</a></li> <li class="right"><a href="#">Save</a></li> </ul> <div class="interact">This is some content </div> </div>';
	loadGuideFile(templateURL);
});

function guideStart(start)
{
	var guide=gGuide;
	
	//alert("Loaded "+gGuide.filename+","+start);
	traceLogic('Guide '+guide.title+' loaded.');
	traceLogic('#Pages: '+propCount(guide.pages)+', #Variables:'+propCount(guide.vars));
	
	//for (var pi in guide.pages)	traceLogic(traceTag('page',guide.pages[pi].name)); 
	
	traceLogic('Starting on page '+traceTag('page',guide.firstPage));
	gotoPageViewer(guide.firstPage);
   $('#page-viewer').removeClass('hidestart')
   $('#splash').empty();

}
function loadNewGuidePrep(guideFile,startTabOrPage)
{}

function gotoPageViewer(destPageName)
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
