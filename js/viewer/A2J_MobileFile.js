/*******************************************************************************
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	CAJA Parser

	Convert guide into JSON for Mobile

	12/22/2014  02/20/2012

******************************************************************************/

/** @param {TPage} page The page to parse */
function page2JSON_Mobile(page)
{	// 12/22/2014 Convert native TPage into Mobile JSON format.
	// Include only properties used by viewer, dropping internal pointers/cyclic references.
	var PAGE = {
		name:				page.name,
		type:				page.type,
		step:				page.step,
		repeatVar:		page.repeatVar,
		text:				page.text, 
		textAudioURL:	page.textAudioURL, 
		learn:			page.learn,
		help:				page.help,
		helpAudioURL:	page.helpAudioURL,
		helpReader:		page.helpReader, 
		helpImageURL:	page.helpImageURL, 
		helpVideoURL:	page.helpVideoURL, 
		buttons:		[],
		fields:		[],
		codeBefore:		page.codeBefore,
		codeAfter:		page.codeAfter,
		notes:			page.notes
	};
	var bi;
	for (bi in page.buttons)
	{
		var b=page.buttons[bi];
		PAGE.buttons.push({
			label:	b.label, 
			next:		b.next,
			url:		b.url,
			repeatVar:		b.repeatVar,
			repeatVarSet:	b.repeatVarSet,
			name:		b.name,
			value:	b.value
			});
	}
	var fi;
	for (fi in page.fields)
	{
		// Never used in Mobile:
		//		Flags for Calendar/calculator
		var f=page.fields[fi];
		PAGE.fields.push({
			type:				f.type, 
			label:			f.label,
			name:				f.name, 
			value:			f.value, 
			order:			f.order, 
			required:		f.required === true ? true : false,
			min:				f.min, 
			max:				f.max, 
			//calendar:		f.calendar,
			//calculator:		f.calculator,
			maxChars:		f.maxChars,
			listSrc:			f.listSrc,
			listData:		f.listData,
			sample:			f.sample, 
			invalidPrompt:	f.invalidPrompt});
	}
	return PAGE;
}


/** @param {TGuide} guide */
function guide2JSON_Mobile (guide)
{	// 12/22/2014 Convert internal Guide structure into Mobile JSON format.
	// Drop internatl references and cyclic pointers.
	var newGuide={};
	
	newGuide.tool = guide.tool;
	newGuide.toolversion=guide.toolversion;
	newGuide.avatar=guide.avatar;
	newGuide.guideGender=guide.guideGender;
	newGuide.completionTime=guide.completionTime;
	newGuide.copyrights=guide.copyrights;
	newGuide.createdate=guide.createdate;
	newGuide.credits=guide.credits;
	newGuide.description=guide.description;
	newGuide.emailContact=guide.emailContact;
	newGuide.jurisdiction=guide.jurisdiction;
	newGuide.language=guide.language;
	newGuide.modifydate=guide.modifydate;
	newGuide.notes=guide.notes;
	newGuide.sendfeedback=guide.sendfeedback;
	newGuide.subjectarea=guide.subjectarea;
	newGuide.title=guide.title;
	newGuide.version=guide.version;
	newGuide.viewer=guide.viewer;
	newGuide.endImage=guide.endImage;
	newGuide.logoImage=guide.logoImage;
	newGuide.mobileFriendly=guide.mobileFriendly;
	
	newGuide.authors=[];
	var i;
	for (i in guide.authors)
	{
		var author=guide.authors[i];
		newGuide.authors.push({
				name:author.name,
				title:author.title,
				organization:author.organization,
				email:author.email
		}); 
	}
	
	newGuide.firstPage=guide.firstPage;
	newGuide.exitPage=guide.exitPage;

	newGuide.steps=[];
	var si;
	for (si in guide.steps)
	{
		var step=guide.steps[si];
		newGuide.steps.push({
				number:step.number,
				text:step.text
			}); 
	}
	
	newGuide.vars={};
	var vi;
	for (vi in guide.vars)
	{
		var v=guide.vars[vi];
		newGuide.vars[v.name]= {
		  name:v.name,
		  type:v.type,
		  repeating: ((v.repeating===true )? v.repeating : false),
		  comment: v.comment
		 };
	}
	
	newGuide.pages={};
	for (var pi in guide.pages)
	{
		if (guide.pages.hasOwnProperty(pi)) {
			newGuide.pages[guide.pages[pi].name] = page2JSON_Mobile(guide.pages[pi]);
		}
	}
	return JSON.stringify(newGuide);
}



/* */
