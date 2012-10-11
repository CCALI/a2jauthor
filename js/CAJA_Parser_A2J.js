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
	
	var caja=new TGuide();
	caja.viewer="A2J";
	caja.title = TEMPLATE.find('TITLE').text();
	caja.description = TEMPLATE.find('DESCRIPTION').text();
	caja.jurisdiction = TEMPLATE.find('JURISDICTION').text();
	caja.firstQuestion = TEMPLATE.find('FIRSTQUESTION').text(); 
	
	// Parse pages into book.pages[] records. 
	TEMPLATE.find("VARIABLE").each(function() {
		VARIABLE = $(this);
		v = new TVariable();
		v.name=VARIABLE.attr("NAME");
		v.sortName=	sortingNatural(v.name);
		v.type=VARIABLE.attr("TYPE");
		caja.vars[v.name]=v;
		//Obsolete, discard: VARIABLE.attr("SCOPE");
	 });
	TEMPLATE.find("STEP").each(function() {
		STEP = $(this);
		step = new TStep();
		step.number=STEP.attr("NUMBER");
		step.text=STEP.find("TEXT").xml();
		//if (caja.steps==null) caja.steps=[];
		caja.steps.push(step);
	 });
	TEMPLATE.find("POPUP").each(function() {//TODO discard unused popups
		POPUP = $(this);
		popup = new TPopup();
		popup.id=POPUP.attr("ID");
		popup.name=POPUP.attr("NAME");
		popup.text=POPUP.find("TEXT").xml();
		//if (caja.popups==null) caja.popups=[];
		caja.popups[popup.id]=popup;
	});

	TEMPLATE.find("QUESTION").each(function() {
	// allocate pages first so we can link scripts in second pass
		QUESTION = $(this);
		page = new TPage();
		page.id=QUESTION.attr("ID");
		page.name=QUESTION.attr("NAME");
		page.step=QUESTION.attr("STEP");
		while (caja.pages[page.name])
			page.name+="_DUPLICATE";
		page.sortName=(page.id==caja.firstQuestion) ? "#":sortingNatural(page.step+";"+page.name);// sort by Step then Page. 
		
		caja.pages[page.name] = page;
		caja.sortedPages.push(page);
		caja.mapids[page.id]=page; 
	});
	
	TEMPLATE.find("QUESTION").each(function() {
		QUESTION = $(this);
		page = caja.pages[QUESTION.attr("NAME")];
		
		page.type="A2J";
		page.style="";
		page.nextPage="auto";
		page.nextPageDisabled = false;
		//alert(QUESTION.find("TEXT").toString());
		page.text=QUESTION.find("TEXT").xml();
		page.learn=QUESTION.find("LEARN").xml();
		page.note=QUESTION.find("NOTE").xml();
		page.help=QUESTION.find("HELP").xml();
		page.alignText="auto";


		QUESTION.find('BUTTON').each(function(){
			button=new TButton();
			button.label =jQuery.trim($(this).find("LABEL").xml());
			button.next =$(this).attr("NEXT");if (typeof button.next==="undefined") button.next="";
			button.name =$(this).attr("NAME");
			button.value = jQuery.trim($(this).find("VALUE").xml());
			//if (page.buttons==null) page.buttons=[];
			page.buttons.push(button);
		});
		QUESTION.find('FIELD').each(function(){
			field=new TField();
			field.type =$(this).attr("TYPE");
			field.optional =$(this).attr("OPTIONAL");		
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
					//statement = "GOTO '"+args[1]+"'";//caja.pageIDtoName(args[1]);
					statement = "GOTO '"+caja.pageIDtoName(args[1])+"'";//;
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
	});
	
	for (p in DefaultPrompts)
	{
		if (DefaultPromptsUsed[p]==1)
			caja.constants[DefaultPrompts[p]] =p;
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
	return caja;
}

