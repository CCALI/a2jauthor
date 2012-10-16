/* CALI Author CAJA - Parse A2J into CAJA format */

function parseXML_A2J_to_CAJA(TEMPLATE)
{	// Parse A2J into CAJA
	var VARIABLE, v, STEP,step,POPUP,popup,	QUESTION, page
	,button, field, script, condition, comment, condT, condF, tf, statement, args, p
	,LINEDEL="\n" //"<BR>xxxx";
	,INDENT="&nbsp;"//hard space indent one
	
	
	var DefaultPrompts={
		"I need more information. Please choose one or more checkboxes to continue."  : "helpCB"
		,"I need more information. You must type an answer in the highlighted box before you can continue." : "helpText"
		,"I need more information. You must choose an answer from the highlighted box before you can continue.": "invalidPromptChoose"
	};
	var DefaultPromptsUsed={};
	
	var guide=new TGuide();
	guide.viewer="A2J";
	guide.title = TEMPLATE.find('TITLE').text();
	guide.description = makestr(TEMPLATE.find('DESCRIPTION').text());
	guide.jurisdiction =  makestr(TEMPLATE.find('JURISDICTION').text());
	guide.firstPage =  makestr(TEMPLATE.find('FIRSTQUESTION').text());
	
	// Parse pages into book.pages[] records. 
	TEMPLATE.find("VARIABLE").each(function() {
		VARIABLE = $(this);
		v = new TVariable();
		v.name=VARIABLE.attr("NAME");
		v.sortName=	sortingNatural(v.name);
		v.type=VARIABLE.attr("TYPE");
		guide.vars[v.name]=v;
		//Obsolete, discard: VARIABLE.attr("SCOPE");
	 });
	TEMPLATE.find("STEP").each(function() {
		STEP = $(this);
		step = new TStep();
		step.number=STEP.attr("NUMBER");
		step.text=STEP.find("TEXT").xml();
		//if (guide.steps==null) guide.steps=[];
		guide.steps.push(step);
	 });
	TEMPLATE.find("POPUP").each(function() {//TODO discard unused popups
		POPUP = $(this);
		popup = new TPopup();
		popup.id=POPUP.attr("ID");
		popup.name=POPUP.attr("NAME");
		popup.text=POPUP.find("TEXT").xml();
		//if (guide.popups==null) guide.popups=[];
		guide.popups[popup.id]=popup;
	});

	var pageNameUsed={};
	
	TEMPLATE.find("QUESTION").each(function() {
		// allocate pages first so we can link scripts in second pass
		QUESTION = $(this);
		page = new TPage();
		page.id=QUESTION.attr("ID");// A2J has unique ID
		
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
		
		page.step=parseInt(QUESTION.attr("STEP"));
		while (guide.pages[page.name])
			page.name+="_DUPLICATE";
		page.sortName=(page.id==guide.firstPage) ? "#":sortingNatural(page.step+";"+page.name);// sort by Step then Page. 
		
		guide.pages[page.name] = page;
		guide.sortedPages.push(page);
		guide.mapids[page.id]=page; 
	});
	
	TEMPLATE.find("QUESTION").each(function() {
		QUESTION = $(this);
		page = guide.mapids[QUESTION.attr("ID")]; 
		
		page.type="A2J";
		page.style="";
		page.nextPage="auto";
		page.nextPageDisabled = false;
		//alert(QUESTION.find("TEXT").toString());
		page.text=QUESTION.find("TEXT").xml();
		page.learn=makestr(QUESTION.find("LEARN").xml());
		page.help=makestr(QUESTION.find("HELP").xml());
		page.note=QUESTION.find("NOTE").xml();
		page.xml = $(this).xml();
		page.alignText="auto";


		QUESTION.find('BUTTON').each(function(){
			button=new TButton();
			button.label =jQuery.trim($(this).find("LABEL").xml());
			button.next = makestr($(this).attr("NEXT"));
			button.name =jQuery.trim($(this).find("NAME").xml());
			button.value = jQuery.trim($(this).find("VALUE").xml());
			//if (page.buttons==null) page.buttons=[];
			page.buttons.push(button);
		});
		QUESTION.find('FIELD').each(function(){
			field=new TField();
			field.type =$(this).attr("TYPE");
			field.optional =$(this).attr("OPTIONAL")!="false";
			field.order =$(this).attr("ORDER");			
			field.label =jQuery.trim($(this).find("LABEL").xml());
			field.name =jQuery.trim($(this).find("NAME").xml());
			field.invalidPrompt =jQuery.trim($(this).find("INVALIDPROMPT").xml());
			if (typeof DefaultPrompts[field.invalidPrompt]!="undefined")
			{
				DefaultPromptsUsed[field.invalidPrompt]=1;
				field.invalidPrompt = "%%"+DefaultPrompts[field.invalidPrompt]+"%%";
			}
			//if (page.fields==null) page.fields=[];
			page.fields.push(field);
		});
		QUESTION.find('MACRO').each(function(){
			script=new TScript();
			script.event =jQuery.trim($(this).find("EVENT").xml());
			condition =jQuery.trim($(this).find("CONDITION").xml());
			comment =jQuery.trim($(this).find("COMMENT").xml());
			condT=[];
			condF=[];
			$(this).find('STATEMENT').each(function(){
				tf =jQuery.trim($(this).find("CONDITION").xml());
				statement =jQuery.trim($(this).find("ACTION").xml());
				
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
			//console.log(script.code);
			if (comment) script.code = "//"+comment + LINEDEL + script.code;
			
			
			//if (page.scripts==null) page.scripts=[];
			page.scripts.push(script);
		});
		  
		var scriptBefore=[];
		var scriptAfter=[];
		var scriptLast=[];
		if (0)// Mmove button variable/branch into Scripting?
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
		page.scripts = "OnBefore\n" + scriptBefore.join("\n") + "OnAfter\n"+ scriptAfter.join("\n")  + "\n" + scriptLast.join("\n");

		
	});
	
	for (p in DefaultPrompts)
	{
		if (DefaultPromptsUsed[p]==1)
			guide.constants[DefaultPrompts[p]] =p;
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
	return guide;
}

