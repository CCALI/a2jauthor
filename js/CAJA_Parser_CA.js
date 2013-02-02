/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	CALI Author Book Parser
	Parses CALI Author's jqXML into CAJA format 
*/

function br2cr(txt){
	return txt.replace(/&lt;BR \/&gt;/g,"\n");
}

function parseXML_CA_to_CAJA(BOOK)
{	// Parse CALI Author into CAJA
	trace("Converting from CALI Author");

	var guide=new TGuide();

	guide.tool=				"CA";
	guide.toolversion=	makestr(BOOK.find('INFO > CAVERSIONREQUIRED').text());
	guide.avatar=			"";
	guide.completionTime=BOOK.find('INFO > COMPLETIONTIME').xml();
	guide.copyrights=		cr2P(br2cr(makestr(BOOK.find('INFO > COPYRIGHTS').xml())));
	guide.createdate=		BOOK.find('INFO > CREATEDATE').xml();
	guide.credits=			cr2P(br2cr(makestr(BOOK.find('INFO > CREDITS').xml())));
	guide.description=	cr2P(makestr(BOOK.find('CALIDESCRIPTION').xml()));
	guide.jurisdiction=	""; 
	guide.language=		"en"; 
	guide.modifydate=		BOOK.find('INFO > MODIFYDATE').xml();
	guide.notes=			cr2P(br2cr(makestr(BOOK.find('INFO > NOTES').xml())));
	guide.sendfeedback=	true;
	guide.emailContact=	makestr(BOOK.find('EMAILCONTACT').text());
	guide.subjectarea=	BOOK.find('INFO > SUBJECTAREA').xml();
	guide.title=			BOOK.find('TITLE').text();
	guide.version=			makestr(BOOK.find('VERSION').text());
	guide.viewer=			"CA";

	guide.authors=[];
	BOOK.find("BOOK > INFO > AUTHORS > AUTHOR").each(function() {
		var AUTHOR = $(this);
		var author = new TAuthor();
		author.name = AUTHOR.find('NAME').text();
		author.title = br2cr(makestr(AUTHOR.find('TITLE').text()));
		author.organization = br2cr(makestr(AUTHOR.find('SCHOOL').text()));
		author.email = AUTHOR.find('EMAIL').text();
		guide.authors.push(author);
	});

	
	
	BOOK.find("BOOK > PAGE").each(function() {
		var pageXML = $(this);
		var page = new TPage();
		if (SHOWXML){
			page.xml = $(this).xml();
		}
		page.name=pageXML.attr("ID");
		//page.name=page.id;
		page.type=pageXML.attr("TYPE");
		
		page.style=makestr(pageXML.attr("STYLE"));
		page.nextPage="";
		page.nextPageDisabled = false;
		page.text= makestr(pageXML.find("QUESTION").xml()) +  makestr(pageXML.find("TEXT").xml());
		page.alignText="auto";
		//page.step=0;
		var toc=makestr(pageXML.find("TOC").xml());
		if (toc!==""){
			page.text = toc;
			guide.TOC= toc;
		}

		var $mapper=pageXML.find('MAPPER');
		if ($mapper)
		{	//XML: <MAPPER ID="47" BOUNDS="1198,360,109"><BRANCH KIND="14" NAME="True" DEST="47" BOUNDS="1196,408,30"/></MAPPER>
			var mapbounds= ($mapper.attr("BOUNDS")).split(',');
			page.mapx=mapbounds[0];
			page.mapy=mapbounds[1];
		}
		
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
		pageXML.children('BUTTON').each(function( )
		{
			//if (!('captions' in page)) page.captions=[];
			b=new TButton();
			b.label=jQuery.trim($(this).xml());
			page.buttons.push(b);
		});
		pageXML.find('DETAIL').each(function(d)
		{
			if (!(page.hasOwnProperty('details'))){ //was 'details' in page.
				page.details=[];
			}
			page.details.push({});
			page.details[d].text =jQuery.trim($(this).xml());
			page.details[d].label = "ABCDEFG".charAt(d)+".";
		});
		pageXML.find('FEEDBACK').each(function()
		{	
			text=jQuery.trim($(this).xml());
			if ($(this).attr("BUTTON")===null){
				page.feedbackShared = text;
			}
			else
			{
				fb={};
				fb.button=$(this).attr("BUTTON")-1;
				fb.detail=$(this).attr("DETAIL")-1;
				fb.grade = $(this).attr("GRADE");
				fb.next=$(this).attr("NEXTPAGE");
				fb.text = text;
				fb.id = fbIndex(fb.button,fb.detail);
				if (page.feedbacks===null)
				{
					page.feedbacks=[];
				}
				page.feedbacks[fb.id]=fb; 
			}
		});
		
		if (!(page.type==="Topics" && page.name!=="Contents"))
		{	// skip placeholder pages
			guide.pages[page.name] = page;
			//guide.mapids[page.id]=page;
			//if (page.name!=page.id) trace("mismatch");
		}
	}); 

	guide.templates="";
	guide.variables=[];
	
	
	guide.firstPage=	"Contents";
	guide.exitPage=	"";
	$('LI',guide.TOC).each(function(i,li){
		var step = new TStep();
		step.number=i;
		step.text = $('a',li).html();
		if (typeof step.text==="undefined")
		{
			step.text = $(li).html();
			step.link = "";
		}
		else
		{
			step.link = $('a',li).attr('HREF');
		}
		guide.steps.push(step);
	});
	//trace(guide.TOC);
	//trace(propsJSON('guide.steps',guide.steps));
	//var step = new TStep();
	//step.number="1";
	//step.text.eoOutline
	//guide.steps[0]=step;
	// Convert TOC into useful thing
	
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
	return parseXML_CAJA_to_CAJA( $(jQuery.parseXML(exportXML_CAJA_from_CAJA(guide))) );
}
function fbIndex(button,detail)
{
	return parseInt(button,10)+"_"+ parseInt(detail,10);
}


/* */
