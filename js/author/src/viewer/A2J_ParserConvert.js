/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Parse A2J 4 Interview into A2J 6 format

	02/20/2012

*/

function parseXML_A2J_to_CAJA(TEMPLATE)
{	// Parse A2J into CAJA
	//trace("Converting from A2J Author 4");
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

	guide.authorId = 0;
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
		//var v = new TVariable();
		//v.name=VARIABLE.attr("NAME");
		//v.type=VARIABLE.attr("TYPE");
		//v.repeating=textToBool(VARIABLE.attr("REPEATING"),false);
		//v.comment=makestr(VARIABLE.find("COMMENT").xml());
		//Obsolete, discard: VARIABLE.attr("SCOPE");
		//guide.vars[v.name.toLowerCase()]=v;
		//v.repeating = textToBool(VARIABLE.attr('REPEATING'),false);
		guide.varCreate(VARIABLE.attr("NAME"),VARIABLE.attr("TYPE"),textToBool(VARIABLE.attr('REPEATING'),false),makestr(VARIABLE.find("COMMENT").xml()));
		//v.traceLogic('Import variable');
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
		return html.replace(/\"POPUP:\/\/(\w+)\"/ig,
			function(match,p1,offset,string){
				var popid=match.match(/\"POPUP:\/\/(\w+)\"/i)[1];
				var popup = popups[popid];
				popup.page=guide.addUniquePage(pageName+" popup");
				popup.page.type="Popup";
				//trace("Creating popup ["+popup.page.name+"]");
				popup.page.text = replacePopups(pageName,popup.text);
				return '"POPUP://' + escapeHtml(popup.page.name)+ '"';
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
		page.type = "A2J";
		page.style ="";
		page.step = parseInt(QUESTION.attr("STEP"),10);
		page.mapx = parseInt(0.5*QUESTION.attr("MAPX"),10);
		page.mapy = parseInt(0.7*QUESTION.attr("MAPY"),10) + 100;
		page.repeatVar = makestr(QUESTION.attr("REPEATVAR"));
		page.outerLoopVar = makestr(QUESTION.attr("OUTERLOOPVAR"));
		page.nested = textToBool(QUESTION.attr("NESTED"));
		page.text = replacePopups(page.name,makestr(QUESTION.find("TEXT").xml()));
		page.textCitation = cr2P(makestr(QUESTION.find("TEXTCITATION").xml()));
		page.textAudioURL = replacePopups(page.name,makestr(QUESTION.find("TEXTAUDIO").xml()));
		page.learn = makestr(QUESTION.find("LEARN").xml());
		page.help = replacePopups(page.name,makestr(QUESTION.find("HELP").xml()));
		page.helpCitation = cr2P(makestr(QUESTION.find("HELPCITATION").xml()));
		page.helpAudioURL = replacePopups(page.name,makestr(QUESTION.find("HELPAUDIO").xml()));
		page.helpReader = makestr(QUESTION.find("HELPREADER").xml());
		page.helpImageURL = makestr(QUESTION.find("HELPGRAPHIC").text());
		page.helpVideoURL = makestr(QUESTION.find("HELPVIDEO").text());
		page.notes = cr2P(makestr(QUESTION.find("NOTE").xml()));
		page.codeCitation = cr2P(makestr(QUESTION.find("CODECITATION").xml()));

		if (CONST.showXML) {
			page.xml = $(this).xml();
		}
		//page.alignText="";
		var scripts=[];

		QUESTION.find('BUTTON').each(function(){
			var button=new TButton();
			button.label =jQuery.trim($(this).find("LABEL").xml());
			button.next = fixID(makestr($(this).attr("NEXT")));
			button.url = fixID(makestr($(this).attr("URL")));
			button.name =jQuery.trim($(this).attr("NAME"));
			button.repeatVar=makestr($(this).attr("REPEATVAR"));
			button.repeatVarSet=makestr($(this).attr("REPEATVARSET"));
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
			field.calculator=textToBool($(this).attr("CALCULATOR"));
			field.label =makestr(jQuery.trim($(this).find("LABEL").xml()));
			field.name =jQuery.trim($(this).find("NAME").xml());
			field.value = makestr(jQuery.trim($(this).find("VALUE").xml()));
			field.sample = makestr(jQuery.trim($(this).find("SAMPLE").xml()));
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
						// Version 1:
						if (varName.indexOf(' ')>=0 ) {
							statement = 'SET ['+varName+'] TO '+varVal;
						}
						else{
							statement = 'SET '+varName+' TO '+varVal;
						}
					}
					else{
						statement = "";
					}
				}
				else
				if ((args = statement.match(/goto\s+(\w+)\s?/i))!==null){
					//statement = "GOTO '"+args[1]+"'";//guide.pageIDtoName(args[1]);
					statement = "GOTO \""+escapeHtml(fixID(args[1]))+"\"";
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

			if ((condition.toLowerCase()==="true" || condition==="1" || condition==="1=1" || condition ==="If 1=1"))
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
					scriptLast.push(resptest+" THEN GOTO "+ escapeHtml(fixID(button.next)));
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
			guide.clauses[DefaultPrompts[p]] =p;
		}
	}
	/*
	if (book.lastPage=="") book.lastPage=pageLessonCompleted;
	if (book.lastPage!=pageLessonCompleted)
	{
		page=book.pages[book.lastPage];
		//page.nextPage=pageLessonCompleted;
		//page.nextPageDisabled=false;
	}
	*/


	//return guide;
	return parseXML_CAJA_to_CAJA( $(jQuery.parseXML(exportXML_CAJA_from_CAJA(guide))) ); // force complete IO
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



/* */
