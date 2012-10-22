/* CALI Author CAJA - Parse CAJA XML format into CAJA format */


function parseXML_A2J_to_CAJA(TEMPLATE)
{	// Parse A2J into CAJA
	var VARIABLE, v, STEP,step,POPUP,popup,	QUESTION, page
	var button, field, script, condition, comment, condT, condF, tf, statement, args, p
	var LINEDEL="\n" //"<BR>xxxx";
	var INDENT=" ";//"&nbsp;"//hard space indent one
	
	
	var DefaultPrompts={
		"I need more information. Please choose one or more checkboxes to continue."  : "helpCB"
		,"I need more information. You must type an answer in the highlighted box before you can continue." : "helpText"
		,"I need more information. You must choose an answer from the highlighted box before you can continue.": "invalidPromptChoose"
	};
	var DefaultPromptsUsed={};
	
	var guide=new TGuide();
	
	
	guide.tool = "A2J";
	guide.toolversion =  makestr(TEMPLATE.find('A2JVERSION').text());
	guide.avatar=makestr(TEMPLATE.find('AVATAR').text());
	guide.completiontime="";
	guide.copyrights="";
	guide.createdate="";
	guide.credits="";
	guide.description = cr2P(makestr(TEMPLATE.find('DESCRIPTION').xml()));
	guide.jurisdiction = makestr(TEMPLATE.find('JURISDICTION').text());
	guide.language=makestr(TEMPLATE.find('LANGUAGE').text());
	guide.modifydate="";
	guide.notes= cr2P(makestr(TEMPLATE.find('HISTORY').xml()));
	guide.sendfeedback= TextToBool(TEMPLATE.find('SENDFEEDBACK').text(),false);
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
	
	guide.firstPage =  makestr(TEMPLATE.find('FIRSTQUESTION').text());
	guide.exitPage =  makestr(TEMPLATE.find('EXITQUESTION').text());
	TEMPLATE.find("STEP").each(function() {
		STEP = $(this);
		step = new TStep();
		step.number=STEP.attr("NUMBER");
		step.text=STEP.find("TEXT").xml(); 
		guide.steps.push(step);
	 });
	
	guide.templates=makestr(TEMPLATE.find('TEMPLATES').text());
	// Parse pages into book.pages[] records. 
	TEMPLATE.find("VARIABLE").each(function() {
		VARIABLE = $(this);
		v = new TVariable();
		v.name=VARIABLE.attr("NAME");
		v.type=VARIABLE.attr("TYPE");
		v.repeating=TextToBool(VARIABLE.attr("REPEATING"),false);
		v.comment=makestr(VARIABLE.find("COMMENT").xml()); 
		guide.vars[v.name]=v;
		//Obsolete, discard: VARIABLE.attr("SCOPE");
	 });
	
	var popups=[];
	TEMPLATE.find("POPUP").each(function() {
		var POPUP = $(this);
		var popup = new TPopup();
		popup.id=POPUP.attr("ID");
		popup.name=POPUP.attr("NAME");
		popup.text=POPUP.find("TEXT").xml();
		popups[popup.id]=popup;
	});
	
	function replacePopups(pageName,html)
	{	// A2J didn't discard old popups. Find any popups, create pages for them.
		return html.replace(/\"POPUP:\/\/(\w+)\"/ig,function(match,p1,offset,string){
			var popid=match.match(/\"POPUP:\/\/(\w+)\"/i)[1];
			var popup = popups[popid];
			popup.page=guide.addUniquePage(pageName+" popup");
			popup.page.type="Popup";
			popup.page.text = replacePopups(pageName,popup.text); 
			return '"POPUP://' + htmlEscape(popup.page.name)+ '"';
		 });
	/*
		var args;
		if ((args = html.match(/\"POPUP:\/\/(\w+)\"/ig))!=null)
			for (var a=0;a<args.length;a++)
			{
				var popid=args[a].match(/\"POPUP:\/\/(\w+)\"/i)[1];
				var popup = popups[popid];
				popup.page=guide.addUniquePage(pageName+" popup");
				popup.used++;
			}*/
	}
	
	
	//var pageNameUsed={};
	
	TEMPLATE.find("QUESTION").each(function() {
		// allocate pages first so we can link scripts in second pass
		var QUESTION = $(this); 
		var page =guide.addUniquePage(QUESTION.attr("NAME"), QUESTION.attr("ID"));
		
		//var page = new TPage();
		//page.id=QUESTION.attr("ID");// A2J has unique ID
		/*
		page.name=QUESTION.attr("NAME");// A2J *can* have same page names so  force duplicates to have unique names.
		if (pageNameUsed[page.name]){
			var cnt=0;
			var newpage;
			do {
				cnt++;
				newpage = page.name+"("+cnt+")"
			} while (pageNameUsed[newpage]);
			page.name = newpage
		}
		pageNameUsed[page.name]=true;
		*/
		
		
		//guide.pages[page.name] = page;
		//guide.mapids[page.id]=page; 
	});
	
	TEMPLATE.find("QUESTION").each(function() {
		QUESTION = $(this);
		page = guide.mapids[QUESTION.attr("ID")]; 
		
		page.type="A2J";
		page.style="";
		page.step=parseInt(QUESTION.attr("STEP"));
		page.mapx=parseInt(QUESTION.attr("MAPX"));
		page.mapy=parseInt(QUESTION.attr("MAPY"));
		page.nextPage="";
		page.nextPageDisabled = false;
		page.text= replacePopups(page.name,makestr(QUESTION.find("TEXT").xml())) 
		page.learn=makestr(QUESTION.find("LEARN").xml());
		page.help= replacePopups(page.name,makestr(QUESTION.find("HELP").xml())) 
		page.helpReader=makestr(QUESTION.find("HELPREADER").xml());
		page.helpImage=makestr(QUESTION.find("HELPGRAPHIC").text());
		page.helpVideo=makestr(QUESTION.find("HELPVIDEO").text());
		page.notes= cr2P(makestr(QUESTION.find("NOTE").xml()));
		
		page.xml = $(this).xml();
		page.alignText="";
 

		QUESTION.find('BUTTON').each(function(){
			button=new TButton();
			button.label =jQuery.trim($(this).find("LABEL").xml());
			button.next = makestr($(this).attr("NEXT"));
			button.name =jQuery.trim($(this).find("NAME").xml());
			button.value = jQuery.trim($(this).find("VALUE").xml()); 
			page.buttons.push(button);
		});
		QUESTION.find('FIELD').each(function(){
			field=new TField();
			field.type =$(this).attr("TYPE");
			field.optional = TextToBool($(this).attr("OPTIONAL"),false);
			field.order = makestr($(this).attr("ORDER"));
			field.min = makestr($(this).attr("MIN"));
			field.max = makestr($(this).attr("MAX"));
			field.calendar = TextToBool($(this).attr("CALENDAR"),false);
			field.calculator=TextToBool($(this).attr("CALCULATOR"),false);
			field.label =makestr(jQuery.trim($(this).find("LABEL").xml()));
			field.name =jQuery.trim($(this).find("NAME").xml());
			field.value = makestr($(this).attr("VALUE"));
			field.invalidPrompt =makestr(jQuery.trim($(this).find("INVALIDPROMPT").xml()));
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
			var condition =jQuery.trim($(this).find("CONDITION").xml());
			var comment =jQuery.trim($(this).find("COMMENT").xml());
			var condT=[];
			var condF=[];
			$(this).find('STATEMENT').each(function(){
				var tf =jQuery.trim($(this).find("CONDITION").xml());
				var statement =jQuery.trim($(this).find("ACTION").xml());
//				if ((args = statement.match(/set\s+(\w[\w\s]*)\s?(=|TO)\s?(.+)/i))!=null)
					//statement = 'SET ['+args[1]+'] TO '+args[3];
				if ((args = statement.match(/set\s+(.+)/i))!=null)
				{
					args = args[1].split("=");
					statement = 'SET ['+args[0]+'] TO '+args[1];
				}
				else
				if ((args = statement.match(/goto\s+(\w+)\s?/i))!=null)
					//statement = "GOTO '"+args[1]+"'";//guide.pageIDtoName(args[1]);
					statement = "GOTO '"+guide.pageIDtoName(args[1])+"'";//;
				else
					statement = "//"+statement;
				if (tf=="true")
					condT.push(statement);
				else
					condF.push(statement);
			}); 
			
			if ((condition=="true" || condition=="1=1"))
				script.code = condT.join(LINEDEL)+LINEDEL;
			else if (condF.length==0)
//				if (condT.length==1)
//					script.code="IF "+condition+" THEN "+condT.join(LINEDEL)+LINEDEL;//if x then y
//				else
					script.code="IF "+condition+" THEN"+LINEDEL+INDENT+condT.join(LINEDEL+INDENT)+""+LINEDEL+"END IF\n";//if x then y,z
			else
			if (condT.length==0)
				script.code="IF NOT ("+condition+") THEN"+LINEDEL+INDENT+condF.join(LINEDEL+INDENT)+""+LINEDEL+"END IF"+LINEDEL;//if not x then y
			else
				script.code="IF  "+condition+" THEN"+LINEDEL+INDENT+condT.join(LINEDEL+INDENT)+""+LINEDEL+"ELSE"+LINEDEL+INDENT+condF.join(LINEDEL+INDENT)+LINEDEL+"END IF"+LINEDEL;//if x then y else z
			if (comment) script.code = "//"+comment + LINEDEL + script.code;
			
			
			//if (page.scripts==null) page.scripts=[];
			page.scripts.push(script);
		});
		  
		var scriptBefore=[];
		var scriptAfter=[];
		var scriptLast=[];
		if (0)// Move button variable/branch into Scripting? 
			for (var b in page.buttons)
			{
				var button=page.buttons[b]; 
				var resptest="IF ResponseNum="+ (parseInt(b)+1);//"IF Button("+(parseInt(b)+1)+")
				if (button.name) // if button has a variable attached, we assign a value to it
					scriptAfter.push(resptest+" THEN SET ["+button.name+"] to "+button.value+"");
				if (makestr(button.next)!="")// if button has a destination, we'll go there after any AFTER scripts have run.
					scriptLast.push(resptest+" THEN GOTO "+ guide.pageIDtoName(button.next));
			}  
		for (var s in page.scripts)
		{
			var script=page.scripts[s];
			var st= script.code.split("\n")//.join("<BR>");
			if (script.when=="BEFORE")
				scriptBefore=scriptBefore.concat(st);
			else
				scriptAfter=scriptAfter.concat(st);
		}
		if (scriptBefore.length>0) scriptBefore.unshift("OnBefore");
		if (scriptAfter.length>0) scriptAfter.unshift("OnAfter");
		page.scripts =  (scriptBefore.concat(scriptAfter).concat(scriptLast)).join("<BR/>");
		//if (page.scripts!="") console.log("SCRIPTS: "+page.scripts);
	});
	
	for (p in DefaultPrompts)
	{
		if (DefaultPromptsUsed[p]==1)
			guide.constants[DefaultPrompts[p]] =p;
	}
	/*
	var keep=[];
	for (var p in popups)
	{
		var popup = guide.popups[p];
		trace("Popup "+popup.id+"/"+popup.name+" used "+popup.used+" "+popup.text);
		if (popup.used>0)
			keep.push(popup);
	}
	guide.popups = keep;
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

