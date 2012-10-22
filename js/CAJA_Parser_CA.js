/* CALI Author CAJA - Parse CALI Author into CAJA 
*/



function parseXML_CA_to_CAJA(BOOK)
{	// Parse CALI Author into CAJA
	trace("Converting from CALI Author");

	var guide=new TGuide();

	guide.tool= 			"CA";
	guide.toolversion=	makestr(BOOK.find('INFO > CAVERSIONREQUIRED').text());
	guide.avatar=			"";
	guide.completionTime=BOOK.find('INFO > COMPLETIONTIME').xml();
	guide.copyrights=		BOOK.find('INFO > COPYRIGHTS').xml();
	guide.createdate=		BOOK.find('INFO > CREATEDATE').xml();
	guide.credits=			BOOK.find('INFO > CREDITS').xml();
	guide.description= 	makestr(BOOK.find('DESCRIPTION').text());
	guide.jurisdiction=	""; 
	guide.language= 		"en"; 
	guide.modifydate=		BOOK.find('INFO > MODIFYDATE').xml();
	guide.notes=			makestr(BOOK.find('INFO > NOTES').xml());
	guide.sendfeedback=	true;
	guide.emailContact=	makestr(BOOK.find('EMAILCONTACT').text());
	guide.subjectarea=	BOOK.find('INFO > SUBJECTAREA').xml();
	guide.title= 			BOOK.find('TITLE').text();
	guide.version=			makestr(BOOK.find('VERSION').text());
	guide.viewer=			"CA";

	guide.authors=[];
	BOOK.find("BOOK > AUTHORS > AUTHOR").each(function() {
		var AUTHOR = $(this);
		var author = new TAuthor();
		author.name = AUTHOR.find('NAME').text();
		author.title = AUTHOR.find('TITLE').text();
		author.school = AUTHOR.find('SCHOOL').text();
		author.email = AUTHOR.find('EMAIL').text();
		guide.authors.push(author);
	});

	guide.firstPage=  			"Contents";
	guide.exitPage=  				"";
	var step = new TStep();
	step.number="1";
	step.text=lang.eoOutline
	guide.steps[0]=step;
	
	
	BOOK.find("BOOK > PAGE").each(function() {
		var pageXML = $(this);
		var page = new TPage();
		page.xml = $(this).xml();
		page.id=pageXML.attr("ID");
		page.name=page.id;
		page.type=pageXML.attr("TYPE");
		page.style=pageXML.attr("STYLE");
		page.nextPage="";
		page.nextPageDisabled = false;
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
		
		guide.pages[page.name] = page;
		guide.mapids[page.id]=page; 
	}); 
	 
	guide.templates="";
	guide.variables=[];
	
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
	return guide;
}
function fbIndex(button,detail)
{
	return parseInt(button)+"_"+ parseInt(detail);
}

