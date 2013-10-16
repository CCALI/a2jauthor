/*
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	A2J_Shared.js - Shared by Author and Viewer.
	10/2013
	Required by Author and Viewers
*/


/************
	CAJA_Parser_A2J.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Parse A2J 4 Interview
	04/15/2013

	Parses .a2j/xml XML into CAJA format
*/


function parseXML_A2J_to_CAJA(TEMPLATE)
{	// Parse A2J into CAJA
	trace("Converting from A2J Author (Flash)");
	//var VARIABLE, v, STEP,step,POPUP,popup,	QUESTION, page
	//var button, field, script, condition, comment, condT, condF, tf, statement, args, p
	var LINEDEL="\n"; //"<BR>xxxx";
	var INDENT=" ";//"&nbsp;"//hard space indent one
	
	
	var DefaultPrompts={
		"I need more information. Please choose one or more checkboxes to continue."  : "helpCB"
		,"I need more information. You must type an answer in the highlighted box before you can continue." : "helpText"
		,"I need more information. You must choose an answer from the highlighted box before you can continue.": "invalidPromptChoose"
	};
	var DefaultPromptsUsed={};
	
	/** @type {TGuide} */
	var guide=new TGuide();
	
	guide.tool = "A2J";
	guide.toolversion =  makestr(TEMPLATE.find('A2JVERSION').text());
	guide.avatar=			makestr(TEMPLATE.find('AVATAR').text());
	guide.guideGender=	makestr(TEMPLATE.find('GUIDEGENDER').text());
	guide.completionTime="";
	guide.copyrights="";
	guide.createdate="";
	guide.credits="";
	guide.description = cr2P(makestr(TEMPLATE.find('DESCRIPTION').xml()));
	guide.jurisdiction = makestr(TEMPLATE.find('JURISDICTION').text());
	guide.language=makestr(TEMPLATE.find('LANGUAGE').text());
	guide.modifydate="";
	guide.notes= cr2P(makestr(TEMPLATE.find('HISTORY').xml()));
	guide.sendfeedback= textToBool(TEMPLATE.find('SENDFEEDBACK').text(),false);
	guide.emailContact=makestr(TEMPLATE.find('SENDFEEDBACKEMAIL').text());
	guide.subjectarea =  guide.jurisdiction;
	guide.title = TEMPLATE.find('TITLE').text();
	guide.version=makestr(TEMPLATE.find('VERSION').text());
	guide.viewer="A2J";
	guide.endImage = TEMPLATE.find('ENDGRAPHIC').text();
	guide.logoImage = TEMPLATE.find('LOGOGRAPHIC').text();
	guide.mobileFriendly='';
	
	var author = new TAuthor();
	author.name = makestr(TEMPLATE.find('AUTHOR').text());
	guide.authors=[author];
	
	TEMPLATE.find("STEP").each(function() {
		var STEP = $(this);
		var step = new TStep();
		step.number=STEP.attr("NUMBER");
		step.text=STEP.find("TEXT").xml(); 
		guide.steps.push(step);
	 });
	
	guide.templates=makestr(TEMPLATE.find('TEMPLATES').text());

	
	
	TEMPLATE.find("VARIABLE").each(function() {
		var VARIABLE = $(this);
		var v = new TVariable();
		v.name=VARIABLE.attr("NAME");
		v.type=VARIABLE.attr("TYPE");
		v.repeating=textToBool(VARIABLE.attr("REPEATING"),false);
		v.comment=makestr(VARIABLE.find("COMMENT").xml()); 
		//Obsolete, discard: VARIABLE.attr("SCOPE");
		guide.vars[v.name.toLowerCase()]=v;
	 });
	// guide's default avatar/guide settings aren't set here. 
	
	
	var popups=[];
	TEMPLATE.find("POPUP").each(function() {
		var POPUP = $(this);
		var popup = {};//new TPopup();
		popup.id=POPUP.attr("ID");
		popup.name=POPUP.attr("NAME");
		popup.text=POPUP.find("TEXT").xml();
		popups[popup.id]=popup;
	});
	
	var mapids=[]; // map A2J id to page name or special ID
	
	var fixID = function(id)
	{	// convert a page id (#) to name.
		return (mapids[id]) ? mapids[id].name : id;
	};
	
	var replacePopups = function(pageName,html)
	{	// A2J didn't discard old popups. Find any popups, create pages for them thus dropping old ones.
		return html.replace(/\"POPUP:\/\/(\w+)\"/ig,function(match,p1,offset,string){
			var popid=match.match(/\"POPUP:\/\/(\w+)\"/i)[1];
			var popup = popups[popid];
			popup.page=guide.addUniquePage(pageName+" popup");
			popup.page.type="Popup";
			//console.log("Creating popup ["+popup.page.name+"]");
			popup.page.text = replacePopups(pageName,popup.text); 
			return '"POPUP://' + htmlEscape(popup.page.name)+ '"';
		});
	};
		
	TEMPLATE.find("QUESTION").each(function() {
		// allocate pages first so we can link scripts in second pass
		var QUESTION = $(this); 
		var page =guide.addUniquePage(jQuery.trim(QUESTION.attr("NAME")));
		mapids[QUESTION.attr("ID")] = page;
	});
	guide.firstPage =  fixID(makestr(TEMPLATE.find('FIRSTQUESTION').text()));
	guide.exitPage =  fixID(makestr(TEMPLATE.find('EXITQUESTION').text()));
	
	
	TEMPLATE.find("QUESTION").each(function() {
		var QUESTION = $(this);
		var page = mapids[QUESTION.attr("ID")]; 
		
		page.xmla2j = QUESTION.xml(); 
		page.type="A2J";
		page.style="";
		page.step=parseInt(QUESTION.attr("STEP"),10);
		page.mapx=parseInt(0.4*QUESTION.attr("MAPX"),10);
		page.mapy=parseInt(0.3*QUESTION.attr("MAPY"),10);
		page.repeatVar=makestr(QUESTION.attr("REPEATVAR"));
		page.nextPage="";
		page.nextPageDisabled = false;
		page.text=replacePopups(page.name,makestr(QUESTION.find("TEXT").xml()));
		page.textAudioURL= replacePopups(page.name,makestr(QUESTION.find("TEXTAUDIO").xml()));
		page.learn=makestr(QUESTION.find("LEARN").xml());
		page.help= replacePopups(page.name,makestr(QUESTION.find("HELP").xml()));
		page.helpAudioURL= replacePopups(page.name,makestr(QUESTION.find("HELPAUDIO").xml()));
		page.helpReader=makestr(QUESTION.find("HELPREADER").xml());
		page.helpImageURL=makestr(QUESTION.find("HELPGRAPHIC").text());
		page.helpVideoURL=makestr(QUESTION.find("HELPVIDEO").text());
		page.notes= cr2P(makestr(QUESTION.find("NOTE").xml()));
		
		if (CONST.showXML) {
			page.xml = $(this).xml();
		}
		page.alignText="";
		var scripts=[];

		QUESTION.find('BUTTON').each(function(){
			var button=new TButton();
			button.label =jQuery.trim($(this).find("LABEL").xml());
			button.next = fixID(makestr($(this).attr("NEXT")));
			button.name =jQuery.trim($(this).attr("NAME"));
			button.value = jQuery.trim($(this).find("VALUE").xml()); 
			page.buttons.push(button);
		});
		QUESTION.find('FIELD').each(function(){
			var field= new TField();
			field.type =$(this).attr("TYPE");
			field.required = !(textToBool($(this).attr("OPTIONAL"),false));
			field.order = makestr($(this).attr("ORDER"));
			field.min = makestr($(this).attr("MIN"));
			field.max = makestr($(this).attr("MAX"));
			field.calendar = textToBool($(this).attr("CALENDAR"),false);
			field.calculator=textToBool($(this).attr("CALCULATOR"),false);
			field.label =makestr(jQuery.trim($(this).find("LABEL").xml()));
			field.name =jQuery.trim($(this).find("NAME").xml());
			field.value = makestr(jQuery.trim($(this).find("VALUE").xml()));
			field.invalidPrompt =makestr(jQuery.trim($(this).find("INVALIDPROMPT").xml()));
			field.invalidPromptAudio =makestr(jQuery.trim($(this).find("INVALIDPROMPTAUDIO").xml()));
			field.listSrc =makestr(jQuery.trim($(this).find("LISTSRC").xml()));
			if (field.listSrc===""){
				field.listData = $(this).find("SELECT").xml();
			}
			//trace(field.listDATA);
			/*
			if (typeof DefaultPrompts[field.invalidPrompt]!="undefined")
			{
				DefaultPromptsUsed[field.invalidPrompt]=1;
				field.invalidPrompt = "%%"+DefaultPrompts[field.invalidPrompt]+"%%";
			}
			*/
			page.fields.push(field);
		});
		QUESTION.find('MACRO').each(function(){
			var script=new TScript();
			script.event =jQuery.trim($(this).find("EVENT").xml());
			var condition =gLogic.hds(jQuery.trim($(this).find("CONDITION").xml()));			
			var comment =jQuery.trim($(this).find("COMMENT").xml());
			// Remove old cruft.
			if (comment === "Example: set a flag if income too high" || comment===null || comment==="undefined" )
			{
				comment="";
			}
			
			var condT=[];
			var condF=[];
			$(this).find('STATEMENT').each(function(){
				var tf =jQuery.trim($(this).find("CONDITION").xml());
				var statement =jQuery.trim($(this).find("ACTION").xml());
//				if ((args = statement.match(/set\s+(\w[\w\s]*)\s?(=|TO)\s?(.+)/i))!=null)
					//statement = 'SET ['+args[1]+'] TO '+args[3];
				var args;
				if ((args = statement.match(REG.LOGIC_SET))!==null)
				{
					var p=args[1].indexOf('=');
					var varName = args[1].substr(0,p);
					var varVal= gLogic.hds(args[1].substr(p+1));
					if (varVal===""){
						varVal='""';
					}
					if (varName!=="")
					{
						// Version 1: statement = 'SET ['+varName+'] TO '+varVal;
						statement = 'SET '+varName+' TO '+varVal;
					}
					else{
						statement = "";
					}
				}
				else
				if ((args = statement.match(/goto\s+(\w+)\s?/i))!==null){
					//statement = "GOTO '"+args[1]+"'";//guide.pageIDtoName(args[1]);
					statement = "GOTO \""+htmlEscape(fixID(args[1]))+"\"";
				}
				else{
					statement = "//"+statement;
				}
				if (statement!==""){
					if (tf==="true"){
						condT.push(statement);
					}
					else{
						condF.push(statement);
					}
				}
			}); 
			
			if ((condition.toLowerCase()==="true" || condition==="1" || condition==="1=1"))
			{
				script.code = condT.join(LINEDEL)+LINEDEL;
			}
			else
			if (condF.length===0)
			{
//				if (condT.length==1)
//					script.code="IF "+condition+" THEN "+condT.join(LINEDEL)+LINEDEL;//if x then y
//				else
					script.code="IF "+condition+" "+LINEDEL+INDENT+condT.join(LINEDEL+INDENT) + LINEDEL+"END IF\n";//if x then y,z
			}
			else
			if (condT.length===0)
			{
				script.code="IF NOT ("+condition+") "+LINEDEL+INDENT+condF.join(LINEDEL+INDENT)+ LINEDEL+"END IF"+LINEDEL;//if not x then y
			}
			else
			{
				script.code="IF  "+condition+" "+LINEDEL+INDENT+condT.join(LINEDEL+INDENT)+ LINEDEL+"ELSE"+LINEDEL+INDENT+condF.join(LINEDEL+INDENT)+LINEDEL+"END IF"+LINEDEL;//if x then y else z
			}
			if (comment)
			{
				script.code = "//"+comment + LINEDEL + script.code;
			}
			 
			scripts.push(script);
		});
		  
		var scriptBefore=[];
		var scriptAfter=[];
		var scriptLast=[];
		/*
		if (0)// Move button variable/branch into Scripting? 
			for (var b in page.buttons)
			{
				var button=page.buttons[b]; 
				var resptest="IF ResponseNum="+ (parseInt(b)+1);//"IF Button("+(parseInt(b)+1)+")
				if (button.name) // if button has a variable attached, we assign a value to it
					scriptAfter.push(resptest+" THEN SET ["+button.name+"] to "+button.value+"");
				if (makestr(button.next)!="")// if button has a destination, we'll go there after any AFTER scripts have run.
					scriptLast.push(resptest+" THEN GOTO "+ htmlEscape(fixID(button.next)));
			}  */
		var s;
		for (s in scripts)
		{
			var script=scripts[s];
			var st= script.code.split("\n");//.join("<BR>");
			if (script.event==="BEFORE"){
				scriptBefore=scriptBefore.concat(st);
			}
			else{
				scriptAfter=scriptAfter.concat(st);
			}
		}
		/*
		if (scriptBefore.length>0) scriptBefore.unshift("OnBefore");
		if (scriptAfter.length>0) scriptAfter.unshift("OnAfter");
		page.scripts =  makestr((scriptBefore.concat(scriptAfter).concat(scriptLast)).join("<BR/>")); 
		*/
		page.codeBefore =	makestr((scriptBefore).join("<BR/>")); 
		page.codeAfter =	makestr((scriptAfter.concat(scriptLast)).join("<BR/>"));  
	});
	var p;
	for (p in DefaultPrompts)
	{
		if (DefaultPromptsUsed[p]===1){
			guide.constants[DefaultPrompts[p]] =p;
		}
	} 
	/* 
	if (book.lastPage=="") book.lastPage=pageLessonCompleted;
	if (book.lastPage!=pageLessonCompleted)
	{
		page=book.pages[book.lastPage];
		page.nextPage=pageLessonCompleted;
		page.nextPageDisabled=false;
	}
	*/
	
	
	//return guide;
	return parseXML_CAJA_to_CAJA( $(jQuery.parseXML(exportXML_CAJA_from_CAJA(guide))) ); // force complete IO
}


/* */


/******************
	CAJA_Parser.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	CAJA Parser
	02/20/2012
	04/15/2013

	Parse native CAJA into CAJA structure
*/


/** @param {TPage} page The page to parse */
function page2JSON(page)
{
	var PAGE = {
		_NAME:		page.name,
		_TYPE:		page.type,
		_STYLE:		page.style,
		_MAPX:		page.mapx,
		_MAPY:		page.mapy,
		_STEP:		page.step,
		_REPEATVAR:	page.repeatVar,
		_NEXTPAGE:	page.nextPage===''?JS2XML_SKIP:page.nextPage,
		_nextPageDisabled: page.nextPageDisabled===true ? true : JS2XML_SKIP,
		_alignText:	page.alignText==='' ? JS2XML_SKIP : page.alignText,
		XML_TEXT:	page.text, 
		TEXTAUDIO:	page.textAudioURL, 
		XML_LEARN:	page.learn,
		XML_HELP:	page.help,
		HELPAUDIO:	page.helpAudioURL,
		XML_HELPREADER:	page.helpReader, 
		HELPIMAGE:	page.helpImageURL, 
		HELPVIDEO:	page.helpVideoURL, 
		BUTTONS:		[],
		FIELDS:		[],
		XML_CODEBEFORE:	page.codeBefore,
		XML_CODEAFTER:		page.codeAfter,
		XML_NOTES:	page.notes
	};
	var bi;
	for (bi in page.buttons){
		var b=page.buttons[bi];
		PAGE.BUTTONS.push({BUTTON:{
			XML_LABEL:	b.label,
			_NEXT:	b.next,
			NAME:		b.name,
			VALUE:	b.value}});
	}
	var fi;
	for (fi in page.fields){
		var f=page.fields[fi];
		var FIELD = {
			_TYPE:			f.type, 
			_ORDER:			f.order, 
			_REQUIRED:		f.required, //==true ? true : JS2XML_SKIP,
			_MIN:				f.min, 
			_MAX:				f.max, 
			_CALENDAR:		f.calendar===true ? true : JS2XML_SKIP, 
			_CALCULATOR:	f.calculator===true ? true : JS2XML_SKIP, 
			_MAXCHARS:		f.maxChars,
			LISTSRC:			f.listSrc,
			XML_LISTDATA:	f.listData,
			XML_LABEL:		f.label,
			NAME:				f.name, 
			VALUE:			f.value, 
			XML_INVALIDPROMPT:	f.invalidPrompt
		};
		PAGE.FIELDS.push({FIELD:FIELD});
	}
	return PAGE;
}

/** @param {TGuide} guide */
function exportXML_CAJA_from_CAJA(guide)
{	// Convert Guide structure into XML
	var JSON={GUIDE:{INFO:{AUTHORS:[]},PAGES:[] ,STEPS:[],VARIABLES:[] }};
	
	
	JSON.GUIDE.INFO.tool=guide.tool;
	JSON.GUIDE.INFO.toolversion=guide.toolversion;
	JSON.GUIDE.INFO.avatar=guide.avatar;
	JSON.GUIDE.INFO.guideGender=guide.guideGender;
	JSON.GUIDE.INFO.XML_completionTime=guide.completionTime;
	JSON.GUIDE.INFO.XML_copyrights=guide.copyrights;
	JSON.GUIDE.INFO.createdate=guide.createdate;
	JSON.GUIDE.INFO.XML_credits=guide.credits;
	JSON.GUIDE.INFO.XML_DESCRIPTION=guide.description;
	JSON.GUIDE.INFO.emailContact=guide.emailContact;
	JSON.GUIDE.INFO.jurisdiction=guide.jurisdiction;
	JSON.GUIDE.INFO.language=guide.language;
	JSON.GUIDE.INFO.modifydate=guide.modifydate;
	JSON.GUIDE.INFO.XML_notes=guide.notes;
	JSON.GUIDE.INFO.sendfeedback=guide.sendfeedback;
	JSON.GUIDE.INFO.subjectarea=guide.subjectarea;
	JSON.GUIDE.INFO.title=guide.title;
	JSON.GUIDE.INFO.version=guide.version;
	JSON.GUIDE.INFO.viewer=guide.viewer;
	JSON.GUIDE.INFO.endImage=guide.endImage;
	JSON.GUIDE.INFO.logoImage=guide.logoImage;
	JSON.GUIDE.INFO.mobileFriendly=guide.mobileFriendly;
	var i;
	for (i in guide.authors)
	{
		var author=guide.authors[i];
		JSON.GUIDE.INFO.AUTHORS.push({
			AUTHOR:{
				NAME:author.name,
				TITLE:author.title,
				ORGANIZATION:author.organization,
				EMAIL:author.email}}); 
	}
	
	JSON.GUIDE.INFO.firstPage=guide.firstPage;
	JSON.GUIDE.INFO.exitPage=guide.exitPage;
	var si;
	for (si in guide.steps)
	{
		var step=guide.steps[si];
		JSON.GUIDE.STEPS.push({
			STEP:{
				_NUMBER:step.number,
				XML_TEXT:step.text}}); 
	}
	var vi;
	for (vi in guide.vars)
	{
		var v=guide.vars[vi];
		var VARIABLE = {
			  _NAME:v.name,
			  _TYPE:v.type,
			  _REPEATING: v.repeating===true ? v.repeating : JS2XML_SKIP,
			  _COMMENT: v.comment
			 };
		JSON.GUIDE.VARIABLES.push({VARIABLE:VARIABLE}); 
	}
	var pi;
	for (pi in guide.pages)
	{
		JSON.GUIDE.PAGES.push({PAGE:page2JSON(guide.pages[pi])});
	} 
	var xml = '<?xml version="1.0" encoding="UTF-8" ?>' + js2xml('GUIDE',JSON.GUIDE);
	return xml;
}
function parseXML_CAJA_to_CAJA(GUIDE) // GUIDE is XML DOM
{	// Parse parseCAJA
	var guide=new TGuide();
	
	var INFO = $('INFO',GUIDE);
	guide.tool =			makestr(INFO.children('TOOL').text());
	guide.toolversion =  makestr(INFO.children('TOOLVERSION').text());
	guide.avatar=			makestr(INFO.children('AVATAR').text());
	guide.guideGender=	makestr(INFO.children('GUIDEGENDER').text());
	//console.log('guide.guideGender',guide.guideGender);
	guide.completionTime=makestr(INFO.children('COMPLETIONTIME').xml());
	guide.copyrights=		makestr(INFO.children('COPYRIGHTS').xml());
	guide.createdate=		makestr(INFO.children('CREATEDATE').text());
	guide.credits =		makestr(INFO.children('CREDITS').xml());
	guide.description =	makestr(INFO.children('DESCRIPTION').xml());
	guide.jurisdiction =	makestr(INFO.children('JURISDICTION').text());
	guide.language=		makestr(INFO.children('LANGUAGE').text());
	guide.modifydate=		makestr(INFO.children('MODIFYDATE').text());
	guide.notes=			makestr(INFO.children('NOTES').xml());
	guide.sendfeedback =	textToBool(INFO.children('SENDFEEDBACK').text(),false);
	guide.emailContact=	makestr(INFO.children('EMAILCONTACT').text());
	guide.subjectarea =  makestr(INFO.children('SUBJECTAREA').text());
	guide.title =			INFO.children('TITLE').text();
	guide.version=			makestr(INFO.children('VERSION').text());
	guide.viewer =			makestr(INFO.children('VIEWER').text());
	guide.logoImage =		makestr(INFO.children('LOGOIMAGE').text());
	guide.endImage =		makestr(INFO.children('ENDIMAGE').text());
	guide.mobileFriendly=INFO.children('MOBILEFRIENDLY').text();
	guide.authors=[];
	GUIDE.find("AUTHORS > AUTHOR").each(function() {
		var AUTHOR = $(this);
		var author = new TAuthor();
		author.name = AUTHOR.find('NAME').text();
		author.title = AUTHOR.find('TITLE').text();
		author.organization = AUTHOR.find('ORGANIZATION').text();
		author.email = AUTHOR.find('EMAIL').text();
		guide.authors.push(author);
	});
	
	guide.firstPage =  makestr(GUIDE.find('FIRSTPAGE').text());
	guide.exitPage =  makestr(GUIDE.find('EXITPAGE').text());
	GUIDE.find("STEP").each(function() {
		var STEP = $(this);
		var step = new TStep();
		step.number=STEP.attr("NUMBER");
		step.text=STEP.find("TEXT").xml();
		guide.steps.push(step);
	 });
	
	// Parse pages into book.pages[] records. 
	GUIDE.find("VARIABLES > VARIABLE").each(function() {
		var VARIABLE = $(this);
		var v = new TVariable();
		v.name=VARIABLE.attr("NAME");
		v.type=VARIABLE.attr("TYPE");
		guide.vars[v.name.toLowerCase()]=v;
	 });/*
	GUIDE.find("POPUP").each(function() {//TODO discard unused popups
		var POPUP = $(this);
		var popup = new TPopup();
		popup.id=POPUP.attr("ID");
		popup.name=POPUP.attr("NAME");
		popup.text=POPUP.find("TEXT").xml();
		guide.popups[popup.id]=popup;
	});*/
	GUIDE.find("CONSTANTS").each(function() {
		var CONSTANT = $(this);
		var constant = new TConstant(); 
		constant.name=CONSTANT.attr("NAME");
		constant.text=CONSTANT.find("VAL").xml();
		guide.constants[constant.name]=constant;
	});
	GUIDE.find("PAGES > PAGE").each(function() {
		var PAGE = $(this);
		var page = guide.addUniquePage(PAGE.attr("NAME"));
		parseXML2Page(PAGE,page);
		/*
		page.xml = PAGE.xml(); 
		
		page.type=PAGE.attr("TYPE");
		page.style=makestr(PAGE.attr("STYLE"));
		if (page.type==CONST.ptPopup || page.type=="Pop-up page")
		{
			page.type=CONST.ptPopup;
			page.mapx=null;
		}
		else
		{
			page.mapx=parseInt(PAGE.attr("MAPX"));
			page.mapy=parseInt(PAGE.attr("MAPY"));
		}
		page.repeatVar=makestr(PAGE.attr("REPEATVAR"));
		page.nextPage="";
		page.nextPageDisabled = false;
		page.alignText="";
		page.step=parseInt(PAGE.attr("STEP"));
		page.text=PAGE.find("TEXT").xml();
		page.textAudioURL=makestr(PAGE.find("TEXTAUDIO").text());
		page.learn=makestr(PAGE.find("LEARN").xml());
		page.help=makestr(PAGE.find("HELP").xml());
		page.helpAudioURL=makestr(PAGE.find("HELPAUDIO").text());
		page.helpReader=makestr(PAGE.find("HELPREADER").xml());
		page.helpImageURL=makestr(PAGE.find("HELPIMAGE").text());
		page.helpVideoURL=makestr(PAGE.find("HELPVIDEO").text());
		page.notes=makestr(PAGE.find("NOTES").xml());
		page.codeBefore = makestr(PAGE.find("CODEBEFORE").xml());
		page.codeAfter =	makestr(PAGE.find("CODEAFTER").xml());
		
		PAGE.find('BUTTONS > BUTTON').each(function(){
			var button=new TButton();
			button.label =jQuery.trim($(this).find("LABEL").xml());
			button.next = makestr($(this).attr("NEXT"));
			button.name =jQuery.trim($(this).find("NAME").xml());
			button.value = jQuery.trim($(this).find("VALUE").xml()); 
			page.buttons.push(button);
		});
		PAGE.find('FIELDS > FIELD').each(function(){
			var field=new TField();
			field.type =$(this).attr("TYPE");
			field.required = textToBool($(this).attr("REQUIRED"),true);
			field.order = makestr($(this).attr("ORDER"));
			field.label =makestr(jQuery.trim($(this).find("LABEL").xml()));
			field.name =jQuery.trim($(this).find("NAME").xml());
			field.value = makestr(jQuery.trim($(this).find("VALUE").xml()));
			field.min = makestr($(this).attr("MIN"));//could be a number or a date so don't convert to number
			field.max = makestr($(this).attr("MAX"));
			field.calendar = textToBool($(this).attr("CALENDAR"),false);
			field.calculator=textToBool($(this).attr("CALCULATOR"),false);
			
			field.invalidPrompt =makestr(jQuery.trim($(this).find("INVALIDPROMPT").xml()));
			field.invalidPromptAudio =makestr(jQuery.trim($(this).find("INVALIDPROMPTAUDIO").xml()));
			page.fields.push(field);
		});
		*/
	});
	
	return guide;
}
function page2XML(page)/* return XML */
{
	return '<?xml version="1.0" encoding="UTF-8" ?>' + js2xml('PAGE', page2JSON(page));
}
function pageFromXML(xml)/* return TPage */
{
	var $xml =  $(jQuery.parseXML(xml));
	var PAGE = $('PAGE',$xml);
	var page = new TPage();
	parseXML2Page(PAGE,page);
	return page;
}


function parseXML2Page(PAGE, page)
{
	page.xml = PAGE.xml(); 
	
	page.type=PAGE.attr("TYPE");
	page.style=makestr(PAGE.attr("STYLE"));
	if (page.type===CONST.ptPopup || page.type==="Pop-up page")
	{
		page.type=CONST.ptPopup;
		page.mapx=null;
	}
	else
	{
		page.mapx=parseInt(PAGE.attr("MAPX"),10);
		page.mapy=parseInt(PAGE.attr("MAPY"),10);
	}
	page.repeatVar=makestr(PAGE.attr("REPEATVAR"));
	page.nextPage="";
	page.nextPageDisabled = false;
	page.alignText="";
	page.step=parseInt(PAGE.attr("STEP"),10);
	page.text=PAGE.find("TEXT").xml();
	page.textAudioURL=makestr(PAGE.find("TEXTAUDIO").text());
	page.learn=makestr(PAGE.find("LEARN").xml());
	page.help=makestr(PAGE.find("HELP").xml());
	page.helpAudioURL=makestr(PAGE.find("HELPAUDIO").text());
	page.helpReader=makestr(PAGE.find("HELPREADER").xml());
	page.helpImageURL=makestr(PAGE.find("HELPIMAGE").text());
	page.helpVideoURL=makestr(PAGE.find("HELPVIDEO").text());
	page.notes=makestr(PAGE.find("NOTES").xml());
	page.codeBefore = makestr(PAGE.find("CODEBEFORE").xml());
	page.codeAfter =	makestr(PAGE.find("CODEAFTER").xml());
	
	PAGE.find('BUTTONS > BUTTON').each(function(){
		var button=new TButton();
		button.label =jQuery.trim($(this).find("LABEL").xml());
		button.next = makestr($(this).attr("NEXT"));
		button.name =jQuery.trim($(this).find("NAME").xml());
		button.value = jQuery.trim($(this).find("VALUE").xml());
		page.buttons.push(button);
	});
	PAGE.find('FIELDS > FIELD').each(function(){
		var field=new TField();
		var $field=$(this);
		field.type =$field.attr("TYPE");
		field.required = textToBool($field.attr("REQUIRED"),true);
		field.order = makestr($field.attr("ORDER"));
		field.label =makestr(jQuery.trim($field.find("LABEL").xml()));
		field.name =jQuery.trim($field.find("NAME").xml());
		field.value = makestr(jQuery.trim($field.find("VALUE").xml()));
		field.min = makestr($field.attr("MIN"));//could be a number or a date so don't convert to number
		field.max = makestr($field.attr("MAX"));
		field.calendar = textToBool($field.attr("CALENDAR"),false);
		field.calculator=textToBool($field.attr("CALCULATOR"),false);
		
		field.invalidPrompt =makestr(jQuery.trim($field.find("INVALIDPROMPT").xml()));
		field.invalidPromptAudio =makestr(jQuery.trim($field.find("INVALIDPROMPTAUDIO").xml()));
		
		field.listSrc =	makestr($field.find("LISTSRC").xml());
		if (field.listSrc===""){
			field.listData =	$field.find("LISTDATA").xml();
		}
	
		page.fields.push(field);
	});
	return page;
}


function parseXML_Auto_to_CAJA(cajaData)
{	// Parse XML into CAJA
	var guide;
	if ((cajaData.find('A2JVERSION').text())!==""){
		guide=parseXML_A2J_to_CAJA(cajaData);// Parse A2J into CAJA
	}
	else
	if ((cajaData.find('CALIDESCRIPTION').text())!==""){
		if (typeof parseXML_CA_to_CAJA !== 'undefined'){
			guide=parseXML_CA_to_CAJA(cajaData);// Parse CALI Author into CAJA
		}
	}
	else{
		guide=parseXML_CAJA_to_CAJA(cajaData);// Parse Native CAJA
	}
	
	guide.sortPages();
	return guide;
}


function cr2P(txt){
	return txt === "" ?"":"<P>" + txt.split("\n").join("</P><P>")+"</P>";//replace("\n\n","\n")
}



/* */




/*************
	CAJA_Types.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	CAJA_Types.js - Type/constant declarations
	04/2012
	Required by Author and Viewers
*/


// ### Constants  ###

/** @const */ 
var CONST = {
	
	devShowTesting: false,
	showXML: true,
	uploadURL: 'CAJA_WS.php?cmd=uploadfile&gid=',
	uploadGuideURL: 'CAJA_WS.php?cmd=uploadguide',
	AJAXLoader: '<span class="loader">&nbsp;</span>"',

	A2JVersionNum:"5.0.1.2",
	A2JVersionDate:"2013-09-18",
	
	
	CAVersionNum:"5.0.0",
	CAVersionDate:"2013-04-15",
	
	//Page Types
	ptPopup:'Popup',
	//Field Types
	ftButton:"button",
	ftText:"text",
	ftTextLong:"textlong",
	ftTextPick:"textpick",
	ftNumber:"number",
	ftNumberDollar:"numberdollar",
	ftNumberSSN:"numberssn",
	ftNumberPhone:"numberphone",
	ftNumberZIP:"numberzip",
	ftNumberPick:"numberpick",
	ftDateMDY:"datemdy",
	ftGender:"gender",
	ftRace:"race",
	ftRadioButton:"radio",
	ftCheckBox:"checkbox",
	ftCheckBoxNOTA:"checkboxNOTA",
	ftCheckBoxMultiple:"checkboxmultiple",
	

	vtUnknown : 0,
	vtText : 1,
	vtTF : 2,
	vtNumber : 3,
	vtDate : 4,
	vtMC : 5,
	vtOther : 6,
	
	// Limits
	MAXFIELDS: 9,
	MAXBUTTONS: 3,
	MAXSTEPS: 12,
	kMinYear: 1900,
	
	// 11/27/07 1.7.7 Ordering options
	ordDefault:"",
	ordAscending:"ASC",
	ordDescending:"DESC",
	
// Navigation page destinations
	qIDNOWHERE:"",
	qIDSUCCESS:"SUCCESS",
	qIDFAIL:"FAIL",
	qIDEXIT:"EXIT", //8/17/09 3.0.1 Save like SUCCESS but flag incomplete true.
	qIDBACK:"BACK", //8/17/09 3.0.1 Same as history Back button.
	qIDRESUME:"RESUME", //8/24/09 3.0.2

	
	ScriptLineBreak : '<BR/>'
};

// ### Steps ###
// colors: 0xffffff,0xBDD6D6, 0xB7DDB7, 0xEFC68C, 0xE7E7B5, 0xEFDED6, 0xECD8EA,0xBDD6D6, 0xB7DDB7, 0xEFC68C, 0xE7E7B5, 0xEFDED6, 0xECD8EA];

// ### Global variables ### //
/** @type {TGuide} */
var gGuide; // global reference to current guide TGuide (CBK or A2J)
/** @type {TPage} */
var gPage; // global reference to current edit/viewed TPage
var gGuideID; // unique service side id for this guide


// User 
var gUserID=0; 
var gUserNickName="User";
//var amode=0;
//var username=""
//var orgName="Authoring Org";

// Session
var runid=0;
var resumeScoreURL=null;
var guidePath;


// ### Classes ###
/** 
 * @constructor
 * @struct
 * @this {TText}
 */
function TText()
{
	this.text = "";
	return this;
}

/** 
 * @constructor
 * @struct
 * @this {TButton} 
 */
function TButton()
{	// Guide defined button, 0 or more
	this.label = "";  // Caption of button
	this.next = ""; // Name of default page to jump to
	this.name = ""; // Variable name
	this.value = ""; // Value - when clicked, variable 'name' gets value 'value'
	return this;
}

/** 
 * @constructor
 * @struct
 * @this {TField} 
 */
function TField()
{
	this.type ="";
	this.label ="";
	this.name ="";//reference TVar.name
	this.value = "";//default value (used in radio buttons)
	this.required =false;
	this.invalidPrompt ="";
	this.invalidPromptAudio = "";
	this.order ="";//default, ASC, DESC
	this.min="";
	this.max="";
	this.calendar=false;
	this.calculator=false;
	this.maxChars="";
	this.listSrc="";
	this.listData="";
	return this;
}


/** 
 * @constructor
 * @struct
 *  @this {TScript}
 */
function TScript()
{
	this.event =""; // BEFORE page is displayed or AFTER user presses a button
	this.code ="";
	return this;
}



/** 
 * @constructor
 * @struct
 * @this {TStep} 
 */
function TStep()
{
	this.number ="";
	this.text ="";
	return this;
}


/** 
 * @constructor
 * @struct
 * @this {TConstant}
 */
function TConstant()
{
	this.name ="";
	this.text ="";
	return this;
}

/*
function TPopup()
{	// This represents an embedded popup
	this.id ="";//unique id from POPUP://#
	this.name =""
	this.text="";
	return this;
}*/

/** 
 * @constructor
 * @struct
 * @this {TPage}
 */
function TPage()
{	// This represents a single page within the lesson book/interview.
	//this.id="";// Unique id
	this.name= "";// Unique but author chosen name
	this.text= "";// Text of question
	this.textAudioURL= "";
	this.notes= "";
	this.learn= "";
	this.help= "";// Optional help text from Learn More button
	
	this.helpAudioURL = "";
	this.helpReader="";
	this.helpImageURL="";
	this.helpVideoURL="";
	this.repeatVar="";// built-in for attaching Field variables to array
	
	this.codeBefore="";
	this.codeAfter="";
	this.fields=[];
	this.buttons=[];
	this.step=0;//index into guide.steps[]
	
	this.type ="";//type of page interaction
	this.style ="";//subtype of page interaction

	this.mapx=0;
	this.mapy=0;
	this.mapBranches=null;
	
//	this.nextPage="";//default for next page
//	this.nextPageDisabled=false;//boolean - if true, next page button is disabled.
//	this.destPage=null;
//	this.columns=0;
//	this.alignText="";
//	this.details=[];
//	this.captions=[];
//	this.feedbacks=[];
//	this.feedbackShared="";
//	this.attempts=0;//number of attempts to answer this question
//	this.scores=[];//array of TScore.
//	this.textMatches=null;//array of TextMatch
//	this.subq=null;//
//	this.timeSpent=0;//seconds spent on this page
//	this.startSeconds=null;

	this.xml=null;
	return this;
}


/** 
 * @constructor
 * @struct
 * @this {TAuthor} 
 */
function TAuthor()
{
	this.name= "";
	this.title = "";
	this.organization ="";
	this.email ="";
	return this;
}

/** 
 * @constructor
 * @struct
 * @this {TGuide}
 */
function TGuide()
{	// This is the Guide representing a CALI lesson Book or an A2J Author Interview.

	this.tool="CAJA";
	this.toolversion="2012-12-12";
	this.avatar="";				//Origin A2J - default avatar to use (blank or tan)
	this.guideGender='Female';	//A2J5 - default avatar gender to use (M or F)
	this.completionTime="";		//Origin CA - author's estimated completion time including section breakdown
	this.copyrights="";			//Origin CA - CALI copyright notices, etc.
	this.createdate="";			//Original CA - first date of creation of the lesson
	this.credits="";				//Origin CA - credits for image permissions, etc.
	this.description="";			//Origin Both - author composed desciprtion or CALI's official lesson description
	this.jurisdiction="";		//Origin A2J - author's note on jurisdiction like 'Cook County'
	this.language="";				//Origin A2J - language code (default is "en")
	this.modifydate="";			//Original CA - last date of editing of the lesson
	this.notes="";					//Origin Both - author revision notes or CBK history
	this.sendfeedback=false;	//Origin A2J - if true we show email link
	this.emailContact="";		//Origin A2J - if defined, this sends feedback
	this.subjectarea="";			//Original CA - CA places every lesson into a single main category like Torts.
	this.title="";					//Origin Both - author title - in CA it's visible at top of page, not seen in A2J by user
	this.version="";				//Original Both - CA uses the mm/dd/yyyy format, A2J is author defined
	this.viewer="";				//Origin CAJA - A2J, CA, CAJA - which viewer to use? 
	this.logoImage="";			//Origin A2J
	this.endImage="";				//Origin A2J
	this.mobileFriendly='';		//If true, will run on Mobile, false won't, '' unknown.
	
	/** @type {Array.<TAuthor>} */
	this.authors=[];				//Origin Both - single line, CA is a heirarchy. Array of TAuthor
	
	this.firstPage="";			//Origin A2J - starting page specificed by author
	this.exitPage="";				//Origin A2J - page that exist success
	
	/** @type {Array.<TStep>} */
	this.steps=[];					//Origin A2J - array of TStep()
	
	
	this.pages={};			//Origin both - associative array of pages TPage() by page name. E.g., pages["Contents"] = TPage()
	this.constants={};	//Origin CAJA - associative array of contants, MAXINCOME:25000
	//this.popups=[];		//Origin A2J - array of embedded text popups (these are anonymous unlike CA where they are named)
	this.assets=[];		//Origin CAJA - array of images for preloading.

	this.templates="";	//Origin A2J - notes about source template files
	this.vars={};			//Origin A2J - associative array of TVariables()

	this.filename="";
	//this.mapids=[];// array of mapids indices	- maps a page.id to page while .pages uses page.name.
	this.sortedPages=[];//array of pages sorted by name (natural order)
	this.lastSaveXML="";
	return this;
}





var vtStrings=["Unknown","Text","TF","Number","Date","MC","Other"];
var vtStringsAnswerFile=["Unknown","TextValue","TFValue","NumValue","DateValue","MCValue","OtherValue"];
var vtStringsGrid=["Unknown","Text","True/False","Number","Date","Multiple Choice","Other"];


/** 
 * @constructor
 * @struct
 * @this {TVariable}
 */
function TVariable()
{
	this.name= "";
	this.type = "";	//E.g., Text, MC, TF
	this.comment = "";
	this.repeating=false;//if false, value is the value. if true, value is array of values.
	this.values=[];
	return this;
}

TGuide.prototype.sortPages=function()
{
	var guide=this;
	guide.sortedPages=[];
	var p;
	for (p in guide.pages){
		guide.sortedPages.push(guide.pages[p]);
	}
	guide.sortedPages=guide.sortedPages.sort(function (a,b){return sortingNaturalCompare(a.name,b.name);});
};



TGuide.prototype.pageDisplayName=function(name)//pageNametoText
{	// Convert a page name or reserved word into readable text.
	var guide=this;
	var dval="";
	if (guide.pages[name])
	{
		var page = guide.pages[name];
		//name = htmlEscape(this.pages[ name ].name);
		dval = page.name;// +"\t"+  decodeEntities(page.text);
	}
	else
	{
		var autoIDs={};
		autoIDs[CONST.qIDNOWHERE]=	lang.qIDNOWHERE;//"[no where]"
		autoIDs[CONST.qIDSUCCESS]=	lang.qIDSUCCESS;//"[Success - Process Form]"
		autoIDs[CONST.qIDFAIL]=		lang.qIDFAIL;//"[Exit - User does not qualify]"
		autoIDs[CONST.qIDEXIT]=		lang.qIDEXIT;//"[Exit - Save Incomplete Form]"//8/17/09 3.0.1 Save incomplete form
		autoIDs[CONST.qIDBACK]=		lang.qIDBACK;//"[Back to prior question]"//8/17/09 3.0.1 Same as history Back button.
		autoIDs[CONST.qIDRESUME]=	lang.qIDRESUME;//"[Exit - Resume interview]"//8/24/09 3.0.2	
		if (typeof autoIDs[ name ] === 'undefined'){
			dval = lang.UnknownID.printf( name, name );//,props(autoIDs)) //"[Unknown id "+id+"]" + props(autoIDs);
		}
		else{
			dval = name+"\t"+autoIDs[ name ];
		}
	}
	return dval;
};


/** @param {...TPage} clonePage */
TGuide.prototype.addUniquePage=function(preferredName,clonePage)
{	// create new page, attach to guide. ensure name is unique
	var guide=this;
	var counter=1;
	var name=preferredName;
	while (typeof guide.pages[name]!=='undefined')
	{
		counter++;
		name = preferredName +" " + (counter);
	}
	var page;
	if (clonePage){
		page=clonePage;
	}
	else{
		page=new TPage();
	}
	page.name = name; 
	guide.pages[page.name] = page;  
	return page;
};


/**
* @param {string} varName
* @param {string|number} [varIndex]
*/
TGuide.prototype.varGet=function(varName,varIndex)
{
	varName = jQuery.trim(varName);
	var guide=this;
	var varName_i=varName.toLowerCase();
	var v=guide.vars[varName_i];
	if (typeof varIndex==='undefined' || varIndex===null || varIndex===''){
		varIndex=0;
	}
	if (typeof v === 'undefined')
	{
		gLogic.trace('Undefined variable: '+ traceTag('var',varName)+ ((varIndex===0)?'':traceTag('varidx',varIndex) ));
		return v;//'undefined';
	}
	var val = v.values[varIndex]; 
	switch (v.type){
		case CONST.vtNumber:
			 val=parseFloat(val);
			break;
		case CONST.vtTF:
			 val= (val>0) || (val===true) || (val==='true');
			break;
	}
	return val;
};

TGuide.prototype.varSet=function(varName,varIndex,varVal)
{
	varName = jQuery.trim(varName);
	var guide=this;
	var varName_i=varName.toLowerCase();
	var v=guide.vars[varName_i];
	if (typeof v === 'undefined')
	{	// Create variable at runtime
		v=new TVariable();
		v.name=varName;
		v.repeating= !(typeof varIndex==='undefined' || varIndex===null || varIndex==='');
		guide.vars[varName_i]=v;
		gLogic.trace('Creating variable '+traceTag("var",varName));
	}
	if (typeof varIndex==='undefined' || varIndex===null || varIndex===''){
		varIndex=0;		
	}
	gLogic.indent++;
	if (varIndex===0)
	{
		gLogic.trace(traceTag('var',varName)+'='+traceTag('val',varVal));
		v.values[0]=varVal;
	}
	else
	{
		gLogic.trace(traceTag('var',varName+'#'+varIndex)+traceTag('val',varVal));
		v.values[varIndex]=varVal;
	}
	gLogic.indent--;
};


/* */


/*************
	CAJA_IO.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Shared IO

	Required by Author and Viewers

*/



function fixPath(file)
{	// keep fully qualified path, otherwise default to file within guide's folder
	if (file.indexOf('http')===0)
	{
		return file;
	}
	return guidePath+urlSplit(file).file;
}


function loadGuideFile2(guideFile,startTabOrPage)
/** @param {TGuide} guideFile */
{
   $.ajax({
      url: guideFile,
      dataType:  "xml", // IE will only load XML file from local disk as text, not xml.
      timeout: 45000,
      error:
			/*** @this {{url}} */
			function(data,textStatus,thrownError){
			  dialogAlert('Error occurred loading the XML from '+this.url+"\n"+textStatus);
			 },
      success: function(data){
         var cajaDataXML;
			cajaDataXML = data;
         cajaDataXML=$(cajaDataXML); 
         // global variable guide
         gGuide =  parseXML_Auto_to_CAJA(cajaDataXML);
         gGuide.filename=guideFile;
         guideStart(startTabOrPage);         
      }
   });
}

function loadGuideFile(guideFile,startTabOrPage)
/** @param {TGuide} guideFile */
{  // Load guide file XML directly
	
	/** @type {Object} */
	var url=urlSplit(guideFile);
	guideFile = url.path+url.file;
	guidePath = url.path;
	if (url.hash!=="")
	{
      startTabOrPage= "PAGE " +url.hash;
	}

   loadNewGuidePrep(guideFile,startTabOrPage);
   window.setTimeout(function(){loadGuideFile2(guideFile,startTabOrPage);},500);
}

function ws(data,results)
{	// Contact the webservice to handle user signin, retrieval of guide lists and load/update/cloning guides.
	$.ajax({
		url:'CAJA_WS.php',
		dataType:'json',
		type: 'POST',
		data: data,
		success: function(data){ 
			//trace(String.substr(JSON.stringify(data),0,299));
			results(data);
		},
		error: function(err,xhr) {
			dialogAlert({title:"Error",message:xhr.responseText });
			setProgress('Error: '+xhr.responseText);
		}
	});
}  




/* */


/*************
	CAJA_Logic.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Logic
	06/15/2012  10/25/11
	04/15/2013

	Convert CAJA script into JavaScript
	Required by Author and Viewers
	Phase 1: Compile the CAJA script to spot syntax errors or undefined functions or variables.
	Phase 2: If compile ie successful, execute the JS version.

	Dependencies: jqhashtable-2.1.js, jquery.numberformatter-1.2.1.jsmin.js
*/

// Classes
function jquote(str)
{
	return "\""+str.replace( /"/gi,"\\\"")+"\"";
}

/** 
 * @constructor
 * @struct
 * @this {ParseError}
 */
function ParseError(lineNum,errType,errText)
{
	this.line = lineNum;
	this.type = errType;//missing page, unknown line, unknown function
	this.text = errText;
	return this;
}


/** 
 * @constructor
 * @struct
 * @this {TLogic}
 */
function TLogic()
{
	this.showCAJAScript =
		0 // none
		//+1 // end of js line
		//+2// before js
		//+3//tracer
		;
	this.tracerID="#tracer";
	this.userFunctions =  [];
	this.indent=0;
	this.GOTOPAGE=null;
	return this;
}


TLogic.prototype.pageExists = function(pageName)
{	// return true if page name exists (Case-sensitive check)
	return gGuide.pages[pageName]!==null;
};


TLogic.prototype.pageFindReferences = function(CAJAScript,findName,newName)
{	// Find/replace all GOTO findName with newName or just return if found.
	var result={};
	result.add=false;
	var csLines = CAJAScript.split( CONST.ScriptLineBreak );
	var l;
	for (l=0;l<csLines.length;l++)
	{
		var line=jQuery.trim(csLines[l]).split("//")[0];
		// TODO : handle Replacement of a page name inside GOTO.
		var args;
		if ((args = line.match(REG.LOGIC_GOTO ))!==null)
		{	// Goto named page (not an expression). We 'return' to avoid further processing which is A2J's designed behavior.
			var pageName=args[1];
			if (pageName===findName)
			{
				result.add=true;
			}
		}
	}
	return result;
};

TLogic.prototype.evalLogicHTML = function(html)
{	// Parse for %% declarations.
	var parts=html.split("%%");
	if (parts.length > 0)
	{
		html="";
		var p;
		for (p=0;p<parts.length;p+=2)
		{
			html += parts[p];
			if (p<parts.length-1)
			{
				html += this.evalBlock(parts[p+1]);
			}
		}
	}
	return html;
};

TLogic.prototype.translateCAJAtoJS = function(CAJAScriptHTML)
{	// Translate CAJA script statements of multiple lines with conditionals into JS script but do NOT evaluate.
	// Returns JavaScript source code lines in .js and errors in .errors which caller may evaluate
	// TODO: needs a regex guru to optimize
/*
	_VG(x) = get value of variable x
	_VG(x,n) = get nth element of array variable x
	_VS(x,y,z) = set value of variable x#y to z
	_ED(d) = parse an mm/dd/yyyy string to date
	_CF(f,a) = call function f with argument a	

	CAJA supported syntax
	SET v TO e or SET v = e becomes SV(v,e)
	GOTO v becomes GOTO(v)
	IF exp
	END IF
*/
	var errors=[];
	var jsLines=[];
	//var csLines=CAJAScriptHTML.split(CONST.ScriptLineBreak);//CAJAScriptLines;//CAJAScript.split("\n");
	//var csLines= decodeEntities(CAJAScriptHTML.replace(CONST.ScriptLineBreak,"\n",'gi')).split("\n");
	
	var csLines= CAJAScriptHTML.split(CONST.ScriptLineBreak);
	
	var ifd=0;//if depth syntax checker
	var l;
	for (l=0;l<csLines.length;l++)
	{
		// Strip trailing comments
		var line=jQuery.trim( decodeEntities(csLines[l])).split("//")[0];
		var args;
		var js;
		if (line!=="")
		{
			// SET var TO expression
			// SET var[index] TO expression
			//if ((args = line.match(/set\s+([\w#]+|\[[\w|#|\s]+\])\s*?(=|TO)\s?(.+)/i))!=null)
			if ((args = line.match(REG.LOGIC_SETTO))!==null)
			{	// SET variable name TO expression
				var jj = args[1];
				jj = jj.replace(/\[|\]/gi,"");// strip variable name brackets if present
				jj = jj.split("#");// extract array index
				if (jj.length===1){
					// Set named variable to evaluated expression
					js=('_VS(' + jquote(line)+',"'+jj[0]+'",0,'+this.translateCAJAtoJSExpression(args[3], l, errors)+");");
				}
				else{
					// Set named variable array element to evaluated expression
					js=('_VS(' + jquote(line)+',"'+jj[0]+'",'+ this.translateCAJAtoJSExpression(jj[1], l, errors)+","+this.translateCAJAtoJSExpression(args[3], l, errors)+");");
				}
			}
			else
			if ((args = line.match(REG.LOGIC_GOTO2))!==null)
			{	// Goto named page (not an expression). We 'return' to avoid further processing which is A2J's designed behavior.
				var pageNameExp=args[1];
				if (pageNameExp.substr(0,1)==='"' && pageNameExp.substr(-1,1)==='"')
				{	// We can statically check of a quoted page name.
					var pageName=pageNameExp.substr(1,pageNameExp.length-2);
					if (!this.pageExists(pageName))
					{
						errors.push(new ParseError(l,"",lang.scriptErrorMissingPage.printf(pageName)));
					}
				}
				js=("_GO("+jquote(line)+","+pageNameExp+");return;");
			}
			else
			if ((args = line.match(REG.LOGIC_PRINT))!==null)
			{
				js="";
				//script.trace("PRINT "+args[1]);
				//script.trace("RESULT "+script.evalHTML(args[1]));
			}
			else
			if ((args = line.match(REG.LOGIC_IF ))!==null)
			{	// "if expressions" becomes "if (expressions) {"
				ifd++;
				if (this.showCAJAScript===3)
				{
					line="";//don't print elese?
				}
				js=("if (_IF("+ifd+","+jquote(args[1])+","+this.translateCAJAtoJSExpression(args[1], l, errors)+")){");
				//				js=("if ("+this.translateCAJAtoJSExpression(args[1], l, errors)+"){");
			}
			else
			if ((args = line.match(REG.LOGIC_ELSEIF))!==null)
			{	// "else if expression" becomes "}else if (expression){"
				//does NOT affect depth. ifd++;
				if (this.showCAJAScript===3)
				{
					line="";//don't print else?
				}
				js=("} else if (_IF("+ifd+","+jquote(args[1])+","+this.translateCAJAtoJSExpression(args[1], l, errors)+")){");
			}
			else
			if ((args = line.match(/^end if/i))!==null)
			{	// "END IF" becomes "}"
				if (this.showCAJAScript===3){
					line="";//don't print elee?
				}
				ifd--;
				js=("};_ENDIF("+ifd+");");
			}
			else
			if ((args = line.match(/^else/i))!==null)
			{	// "else" becomes "}else{" 
				if (this.showCAJAScript===3){
					line="";//don't print else?
				}
				js=("}else{");
			}
			else
			if (line.match(/deltavars/i)!==null)
			{	// debugging aid
				js=("_deltaVars("+jquote(line)+");");
			}
			else
			{	// Unknown statement
				//js=("// Unhandled: "  + line);
				js="_CAJA("+ jquote(line)+ ");";
				errors.push(new ParseError(l,"",lang.scriptErrorUnhandled.printf(line)));
			}
			
			switch (this.showCAJAScript)
			{
				case 0:
					jsLines.push(js);//standard
					break;
				case 1:
					jsLines.push(js + " //CAJA: "+line); //include original source appended
					break;
				case 2:
					jsLines.push("","//CAJA: "+line,js);// include original source prepended
					break;
				default:
					jsLines.push("","",js); // line.replace( /"/x/gi,"!") +
			}
		}
	}
	if (ifd>0){
		errors.push(new ParseError(l,"",lang.scriptErrorEndMissing.printf()));
	}
	return {js : jsLines,  errors: errors};
};

TLogic.prototype.evalBlock = function(expressionInText)
{
	var txt = "";
	var errors=[];
	var js=this.translateCAJAtoJSExpression(expressionInText, 1, errors);
	if (errors.length === 0 )
	{
		js = "with (gLogic) { return ("+ js +")}";
		try {
			var f=(new Function( js ));
			var result = f(); // Execute the javascript code. 
			txt = result;
		}
		catch (e) {
			// Trace runtime errors
			txt='<span class="code">'+expressionInText+'</span><span class="err">' + e.message + '</span>';
		}
	}
	else
	{	// Compile time error
		txt='<span class="code">'+expressionInText+'</span><span class="err">' +'syntax error' + '</span>';
	}
	return txt;
};


TLogic.prototype.hds = function(a2j4)
{	// 08/23/2013 convert A2J4 style expression into new format
	// [client name] CONVERTS TO client name
	// [child name#child counter]  CONVERTS TO child name[child counter]
	// [age] is 25 CONVERTS TO age = 25
	// [name first] + [name last] CONVERTS TO name first + name last
	// [income 1] < 25,000 and [income 2] < 35,000 CONVERTS TO income 1 < 25,000 AND income 2 < 35,000
	// Assumptions: TODO
	return a2j4;
};

TLogic.prototype.translateCAJAtoJSExpression = function(CAJAExpression, lineNum, errors)
{	// Parse a CAJA expression into a JS expression, NOT EVALUATED.
	// Compiled into JS function to check for errors.
	var js = (" " + CAJAExpression +" ");
	// Handle items not in quotes
	js = js.split('"');
	var j;
	for (j=0;j<js.length;j+=2)
	{
		var jj=js[j];
		//	A2J variables support spaces and other symbols using [] notation
		// Variable formats:
		//		Variable name with possible spaces
		//			[child name] converts to GetVar("child name")
		jj = jj.replace(/\[([\w|\s|\-]+)\]/gi,"$$1(\"$1\")"); 
		
		//		Variable name with possible spaces#number (array)
		//			[child name#2] converts to GetVar("child name",2)
		jj = jj.replace(/\[([\w|\s|\-]+)#([\d]+)\]/gi,"$$1(\"$1\",$2)");
		
		// Variable name with possible spaces#other variable name that evaluates to a number (array)
		//			[child name#child counter] converts to GetVar("child name",GetVar("child counter"))
		jj = jj.replace(/\[([\w|\s|\-]+)#([\w|\s|\-]+)\]/gi,"$$1(\"$1\",$$1(\"$2\"))");

		//	A2J dates bracketed with # like VB
		//		#12/25/2012# converts to convertDate("12/25/2012")
		var date = /#([\d|\/]+)#/gi;
		jj = jj.replace(date,"$$2(\"$1\")");
		
		js[j]=jj;
	}
	js = js.join('"').split('"');
	var comma_fnc=function(s){return s.replace(",","");};
	for (j=0;j<js.length;j+=2)
	{	// handle standalone symbols not in quotes
		jj=js[j];
		
		// A2J allows commas in numbers for clarity
		//		25,000.25 converts to 25000.25
		var vn = /(\d[\d|\,]+)/gi;
		jj = jj.replace(vn,comma_fnc);//function(s){return s.replace(",","");});
		
		//	A2J uses AND, OR and NOT while JS uses &&, || and !
		jj = jj.replace(/\band\b/gi,"&&");
		jj = jj.replace(/\bor\b/gi,"||");
		jj = jj.replace(/\bnot\b/gi,"!");
		
		//	A2J uses = and <> for comparison while JS uses == and !=
		jj = jj.replace(/\=/gi,"==");
		jj = jj.replace(/\>\=\=/gi,">=");
		jj = jj.replace(REG.LOGIC_LE ,"<=");
		jj = jj.replace(REG.LOGIC_NE,"!=");
		
		// Constants 
		jj = jj.replace(/\btrue\b/gi,"1");
		jj = jj.replace(/\bfalse\b/gi,"0");
		
		// Function calls
		//		age([child birthdate]) converts to CallFunction("age",GetVar("child birthdate"))
		jj = jj.replace(/([A-Za-z_][\w]*)(\s*)(\()/gi,'$$3("$1",');

		js[j]=jj;
	}
	js = js.join('"').split('"');
	for (j=0;j<js.length;j+=2)
	{	// handle standalone variables that aren't functions
		var jj=js[j];
		// Unbracketed variables get final VV treatment
		//		first_name converts to VV("first_name")
		jj = jj.replace(/([A-Za-z_][\w]*)/gi,'$$1("$1")');

		js[j]=jj;
	}
	js = js.join('"').split('"');
	for (j=0;j<js.length;j+=2)
	{	// restore js functions
		var jj=js[j];
		jj = jj.replace(/\$1/,"_VG").replace(/\$2/,"_ED").replace(/\$3/,"_CF");
		js[j]=jj;
	}
	js = js.join('"');
	// Build function to find syntax errors
	try {
		var f=(new Function( js ));
		f=null;
	}
	catch (e) { 
		if (e.message==="missing ; before statement"){ e.message="syntax error";}
		errors.push(new ParseError(lineNum,"",e.message));
	}
	return js;
};



TLogic.prototype.addUserFunction = function(funcName,numArgs,func)
{	// add a user defined function
	this.userFunctions.push({name:funcName,numArgs:numArgs,func:func});
};


TLogic.prototype.trace = function(html)
{
	$(this.tracerID).append('<li style="text-indent:'+(this.indent)+'em">'+html+"</li>");
	//if (typeof console!=='undefined') console.log(html);
};

// Functions called by JS translation of CAJA code. 
TLogic.prototype._CAJA = function(c)
{
	this.trace( traceTag('code',c));
};
TLogic.prototype._IF = function(d,c,e)
{
	if ( (e) === true ) {
		this.trace( "IF "+traceTag('val',c) +' ' +  '\u2714'  );
	}
	else{
		this.trace( "<strike>IF "+traceTag('val',c)+'</strike>');
	}
	//this.trace( "IF "+traceTag('val',c)+' = '+ traceTag('val',( (e) === true)) );
	this.indent=d;
	return (e===true);
};
TLogic.prototype._ENDIF = function(d)
{
	//if (this.indent!==d){
		this.indent=d;
		//this.trace( "ENDIF");
	//}
};
TLogic.prototype._VS = function(c,varname,varidx,val)
{
	this.trace(c);
	return gGuide.varSet(varname,varidx,val);
};
TLogic.prototype._VG=function( varname,varidx)
{
	return gGuide.varGet(varname,varidx);
};
TLogic.prototype._CF=function(f)
{ 
	//this.indent++;
	this.trace("Call function "+f); 
	//this.indent--;
	return 0;
};
TLogic.prototype._ED=function(dstr)
{
	// Date format expected: m/dd/yyyy. 
	// Converted to unix seconds
	return Date.parse(dstr);
};
TLogic.prototype._GO = function(c,pageName)
{
	this.GOTOPAGE=pageName;
	this.trace(c);
	//this.trace("Going to page "+traceTag('page',this.GOTOPAGE));
};
TLogic.prototype._deltaVars = function()
{
};

TLogic.prototype.executeScript = function(CAJAScriptHTML)
{
	// Execute lines of CAJA script. Syntax/runtime errors go into logic tracer, error causes all logic to cease.
	// GOTO's cause immediate break out of script and the caller is responsible for changing page.
	// Script statement lines separated <BR/> tags.
	if (typeof CAJAScriptHTML==='undefined'){
		return true;
	}
	this.indent=0;
	var script = this.translateCAJAtoJS(CAJAScriptHTML);
	if (script.errors.length === 0)
	{
		var js = "with (gLogic) {"+ script.js.join("\n") +"}";
		try {
			var f=(new Function( js ));
			var result = f(); // Execute the javascript code.
			result = null;
		}
		catch (e) {
			// Trace runtime errors
			this.trace("ERROR: " +e.message +" " + e.lineNumber);
			return false;
		}
	}
	else
	{
		this.trace("ERROR: "+"syntax error in logic");
		return false;
	}
	this.indent=0;
	return true;
};

var gLogic = new TLogic();
// Default user defined functions used by A2J
gLogic.addUserFunction('Number',1,function(val){return parseFloat(val);});
gLogic.addUserFunction('String',1,function(val){return String(val);});
gLogic.addUserFunction('HisHer',1,function(gender){return (gender==='male') ? 'his' : 'her';});
gLogic.addUserFunction('HimHer',1,function(gender){return (gender==='male') ? 'him' : 'her';});
gLogic.addUserFunction('HeShe',1,function(gender){ return (gender==='male') ? 'he' : 'she';});
if ($.formatNumber){
	gLogic.addUserFunction('Dollar',1,function(val){		return $.formatNumber(val,{format:"#,###.00", locale:"us"});});
	gLogic.addUserFunction('DollarRound',1,function(val){	return $.formatNumber(Math.round(val),{format:"#,##0", locale:"us"});});
}
gLogic.addUserFunction('dateMDY',1,function(val){ var d=new Date(); d.setTime(val*1000*60*60*24);return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();});


function traceLogic(html)
{
	gLogic.trace(html);
}

/* */



/******************
	CAJA_Shared.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Shared GUI/IO
	12/12/2012
	04/15/2013

	Required by Author and Viewers
*/

function dialogAlert(args)
{  // Usage: args.title = dialog title, args.message = message body
   if (typeof args === "string"){
		args={message:args};
	}
   if (args.title===null){
		args.title="Alert";
	}
   var $d=$( "#dialog-confirm" );
   $d.html('<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>'+args.message+'</p>');
   $d.dialog({
      title: args.title,
      resizable: false,
      width: 350,
      height:250,
      modal: true,
      buttons: {
          OK: function() {
              $( this ).dialog( "close" );
          }
      }
   });
}


/* */

/******************
	CAJA_Utils.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	CAJA Utils
	02/20/2012
	04/15/2013

	Required by Author and Viewers
*/
function urlSplit(url)
{	// given a url like http://www.cali.org/intro/view.php?a=1#start,
	// return path object with {path:"http://www.cali.org/intro/", file:"view.php", params:"a=1", hash:"start" 
	var parts={path:"",file:"",params:"",hash:""};
	var p;
	url=url.replace("\\","/","gi");
	p=url.lastIndexOf('#');
	if (p>=0)
	{
		parts.hash =  url.substr(p+1);
		url=url.substr(0,p);
	}
	p=url.lastIndexOf('?');
	if (p>=0)
	{
		parts.params =  url.substr(p+1);
		url=url.substr(0,p);
	}
	p=url.lastIndexOf('/');
	if (p>=0)
	{
		parts.file =  url.substr(p+1);
		url=url.substr(0,p+1);
	}
	parts.path=url;
	return parts;
}


function propCount(obj)
{
	var cnt = 0;
	var p;
	for ( p in obj){ cnt++;}
	return cnt;
}

function traceTag(cname,chtml)
{
	if ((cname==='val') && (chtml === ""))
		{chtml = "<i>blank</i>";}
	return "<span class="+cname+">"+chtml+"</span>";
}

/** @param {...} var_args */
function trace(var_args)
{
	var msg="";
	var a;
	for (a=0;a<arguments.length;a++)
	{
		var arg = arguments[a];
		if (typeof arg==="object"){
			msg += arg;//props(arg);
		}
		else
		if (typeof arg !=="function"){
			msg += arg;
		}
		if (typeof console!=="undefined"){
			console.log(arg);
		}
	}
}

function cloneObject(obj) {
	var clone = {};
	var i;
	for(i in obj) {
		if(typeof(obj[i])==="object"){
			 clone[i] = cloneObject(obj[i]);
		}
		else{
			 clone[i] = obj[i];
		}
	}
	return clone;
}
$.fn.showit = function(yes) { // show/hide via class rather than .toggle to avoid issues with TR
    return $(this).removeClass('hidden').addClass(yes ? '' : 'hidden');
};

String.prototype.asHTML=function(){
	return htmlEscape(this);
};
/*
String.prototype.asATTR=function(){
	return this.replace(/'/g, "&#39;");
}
*/

// http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
function htmlEscape(str){
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            //.replace(/'/g, '&apos;')//'&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
function makestr(s)
{	// lazy test to make sure s is a string or blank, not "null" or "undefined"
	return (s===null || typeof s === "undefined" ) ? '' : s;
}
function textToBool(b, defaultb)
{
	if (b===null || typeof b === "undefined" )
	{
		return defaultb;
	}
	return (b===1) || (b==='1') || (String(b).toLowerCase()==="true");
}


function aie(obj,attr,val)
{	// set obj's attr to val, only if value exists 
	if (val===null){
		return; 
	}
	obj[attr]=val;
}

String.prototype.printf = function() {
    var formatted = this, i, regexp;
    for (i = 0; i < arguments.length; i++) {
        regexp = new RegExp('\\{'+(i+1)+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};



function pickHilite(html,term)
{	// find term in html text and hilite it
	return html.replace(
		new RegExp(
			"(?![^&;]+;)(?!<[^<>]*)(" +
			$.ui.autocomplete.escapeRegex(term) +
			")(?![^<>]*>)(?![^&;]+;)", "gi"
		), "<span class=hilite>$1</span>");
}



function isNumber(n)
{//http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
  return !isNaN(parseFloat(n)) && isFinite(n);
}


var JS2XML_SKIP={skip:true};

function js2xml(name,o)
{	// 10/17/2012 Sam's simple JSON to XML. 
	// If object property name starts with '_' it becomes an attribute.
	// If object property name starts with 'XML_' it becomes a node that's NOT encoded (PCDATA like)
	function trim(name,attr,body){
		if (body===''){
			if (attr===''){
				return '';
			}
			return '<'+name.toUpperCase()+attr+'/>';
		}
		return '<'+name.toUpperCase()+attr+'>'+body+'</'+name.toUpperCase()+'>';
	}
	function clean(body)
	{
		return htmlEscape(body);
	}
	if (typeof o === 'object')
	{
		var attr="";
		var body="";
		
/*		var sorted=[];
		for (var p in o) sorted.push(p);
		sorted.sort();	
		for (var pi in sorted)
		{
			p=sorted[pi];
*/
		var p;
		for (p in o)
		{
			if (parseInt(p,10)>=0)
			{	// array assumed
				body += js2xml('',o[p]);  //recurse
			}
			else
			if (p.substr(0,1)==='_')
			{	// embed as attribute if not blank string
				if (o[p]!=="" && o[p]!==JS2XML_SKIP)//TODO 
				{
					attr += " " + p.substr(1)+"=\""+clean(o[p])+"\"";
				}
			}
			else
			if (p.substr(0,4)==='XML_')
			{	// treat as raw XML
				body += trim(p.substr(4),'',o[p]);
			}
			//else
			//if (typeof o[p]==="string")
			//	body += trim(p,'',o[p]);//o[p];
			else{
				body += js2xml(p,o[p]); //recurse
			}
		}
		if (name!==''){
			body = trim(name,attr,body); 
		}
	}
	else{
		body = trim(name,'',clean(o));
	}
	return body.replace(/&nbsp;/g,'&#160;');
}


function props(o)
{
	var t="", p;
	for (p in o)
	{
		if (typeof o[p]==="object")
		{
			t+=p+"={"+props(o[p])+"}, ";
		}
		else
		if (typeof o[p] !== 'function'){
			t+=p+"=" +  o[p] +", ";
		}
	}
	return t;
}


function propsJSON(name,o)
{
	return propsJSON_(name,0,o);
}
function propsJSON_(name,d,o)
{	// 10/17/2012 Sam's simple JSON to XML. 
	var body = "";
	//for (var t=0;t<d;t++) body += " ";
	body = '<div class="json indent">'; //+d+'em">';
	if (typeof o === 'object')
	{
		body += name + ":";
		if (o===null)
		{
			body += "null\n";
		}
		else
		{
			var elts="";
			var p;
			for (p in o)
			{
				if (parseInt(p,10)>= 0)
				{	// array assumed
					elts += propsJSON_(p,d+1,o[p]);
				}
				else{
					elts += propsJSON_(p,d+1,o[p]); //recurse
				}
			}
			if (elts===""){
				body += "{}\n";
			}
			else{
				body += "{\n"+elts+"}\n";
			}
		}
	}
	else
	if (typeof o === 'function'){
		body = '';
	}
	else
	if (typeof o === 'string')
	{
		var TRIM = 1024;
		var t=htmlEscape(o );
		if (t.length<TRIM){
			body += name + ':"' + t + '"\n';
		}
		else{
			body += name + ':"' + t.substr(0,TRIM) + '"...\n';
		}
	}
	else{
		body += name+':'+o+'\n';
	}
	body += "</div>";
	return body;
}





/*
//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();
*/

/* */









