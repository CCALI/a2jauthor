/* CALI Author CAJA - Parse CALI Author into CAJA 
*/

function aie(obj,attr,val)
{	// set obj's attr to val, only if value exists 
	if (val===null) return; 
	obj[attr]=val;
}


function parseXML_CA_to_CAJA(BOOK)
{	// Parse CALI Author into CAJA
	trace("Converting from CALI Author");
	var step, pageXML, page
		,b,text,fb;
	
	var caja=new TCAJA();
	caja.viewer="CA";
	caja.title = BOOK.find('TITLE').text();
	caja.description = BOOK.find('INFO > DESCRIPTION').xml();
	caja.completionTime = BOOK.find('INFO > COMPLETIONTIME').xml();
	caja.jurisdiction="";
	
	step = new TStep();
	step.number="1";
	step.text=lang.eoOutline
	caja.steps[0]=step;
	
	BOOK.find("BOOK > PAGE").each(function() {
		pageXML = $(this);
		page = new TPage();
		page.xml = $(this).xml();
		page.id=pageXML.attr("ID");
		page.name=page.id;
		page.type=pageXML.attr("TYPE");
		page.style=pageXML.attr("STYLE");
		page.nextPage="auto";
		page.nextPageDisabled = false;
		page.sortName=pageXML.attr("SORTNAME");//sortingNatural(page.name);

		page.text= makestr(pageXML.find("QUESTION").xml()) +  makestr(pageXML.find("TEXT").xml());
		page.alignText="auto";
		//page.step=0;
		
		var it=pageXML.find("INITIALTEXT").xml();
		if (it!==null)
		{	// text select
			//aie(page,"initialText",pageXML.find("INITIALTEXT").xml());
			page.initialText=it; 
			page.tests=[];
			page.tests.push({
				style:'range', 
				text: pageXML.find("CORRECTTEXT").xml(), 
				slackWordsBefore: pageXML.find("SLACKWORDSBEFORE").xml(), 
				slackWordsAfter: pageXML.find("SLACKWORDSAFTER").xml()
			});
		}
		
		//console.log(page.name);
		pageXML.children('BUTTON').each(function( )
		{
			//if (!('captions' in page)) page.captions=[];
			b=new TButton();
			b.label=jQuery.trim($(this).xml());
			page.buttons.push(b);
		});
		pageXML.find('DETAIL').each(function(d)
		{
			if (!('details' in page)) page.details=[];
			page.details.push({});
			page.details[d].text =jQuery.trim($(this).xml());
			page.details[d].label = "ABCDEFG".charAt(d)+".";
		});
		pageXML.find('FEEDBACK').each(function()
		{	
			text=jQuery.trim($(this).xml());
			if ($(this).attr("BUTTON")==null)
				page.feedbackShared = text;
			else
			{
				fb={};
				fb.button=$(this).attr("BUTTON")-1;
				fb.detail=$(this).attr("DETAIL")-1;
				fb.grade = $(this).attr("GRADE");
				if (fb.grade!=null) fb.grade=fb.grade;
				fb.next=$(this).attr("NEXTPAGE");
				fb.text = text;
				fb.id = fbIndex(fb.button,fb.detail);
				if (page.feedbacks==null) page.feedbacks=[];
				page.feedbacks[fb.id]=fb; 
			}
		});
		
		caja.pages[page.name] = page;
		caja.sortedPages.push(page);
		caja.mapids[page.id]=page; 
	});
//	 alert(caja.sortedPages[0]);
//	 alert(caja.sortedPages[0].text);
	 
	/*
	// Add stub pages for the About and Score screens.
	var page = new TPage();
	page.name=pageABOUT;
	page.text= book.description;
	book.pages[page.name]=page;
	
	page=new TPage()
	page.name=pageLessonCompleted;
	page.nextPageDisabled=true;
	book.pages[page.name]=page;
	*/
	/*
	if (book.lastPage=="") book.lastPage=pageLessonCompleted;
	if (book.lastPage!=pageLessonCompleted)
	{
		page=book.pages[book.lastPage];
		page.nextPage=pageLessonCompleted;
		page.nextPageDisabled=false;
	}
	*/
	return caja;
}
function fbIndex(button,detail)
{
	return parseInt(button)+"_"+ parseInt(detail);
}

