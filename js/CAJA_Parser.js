/* 02/20/2012 Parse XML of A2J, CALI Author or native CAJA into CAJA structure */
// Code shared by A2J Author, A2J Viewer, CALI Author and CALI 5 Viewer



function exportXML_CAJA_from_CAJA(guide)
{	// Convert Guide structure into XML
	var JSON={GUIDE:{INFO:{AUTHORS:[]},PAGES:[] ,STEPS:[],VARIABLES:[] }};
	
	JSON.GUIDE.INFO.tool=guide.tool;
	JSON.GUIDE.INFO.toolversion=guide.toolversion;
	JSON.GUIDE.INFO.avatar=guide.avatar;
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
	
	for (var i in guide.authors)
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
	for (var si in guide.steps)
	{
		var step=guide.steps[si];
		JSON.GUIDE.STEPS.push({
			STEP:{
				_NUMBER:step.number,
				XML_TEXT:step.text}}); 
	}
	for (var vi in guide.vars)
	{
		var v=guide.vars[vi];
		var VARIABLE = {
			  _NAME:v.name,
			  _TYPE:v.type,
			  _REPEATING: v.repeating==true ? v.repeating : JS2XML_SKIP,
			  _COMMENT: v.comment
			 };
		JSON.GUIDE.VARIABLES.push({VARIABLE:VARIABLE}); 
	}

	for (var pi in guide.pages)
	{
		var page = guide.pages[pi];
		var PAGE = {
			_ID:			page.id,
			_NAME:		page.name,
			_TYPE:		page.type,
			_STYLE:		page.style,
			_MAPX:		page.mapx,
			_MAPY:		page.mapy,
			_STEP:		page.step,
			_NEXTPAGE:	page.nextPage,
			_nextPageDisabled: page.nextPageDisabled==true ? true : JS2XML_SKIP,
			_alignText:	page.alignText,
			XML_TEXT:	page.text, 
			XML_LEARN:	page.learn,
			XML_HELP:	page.help,
			XML_HELPREADER:	page.helpReader, 
			HELPIMAGE:	page.helpImage, 
			HELPVIDEO:	page.helpVideo, 
			BUTTONS: 	[],
			FIELDS:		[],
			XML_SCRIPTS:		page.scripts,
			XML_NOTES:	page.notes
		}
		
		for (var bi in page.buttons){
			var b=page.buttons[bi];
			PAGE.BUTTONS.push({BUTTON:{
				XML_LABEL:	b.label,
				_NEXT:	b.next,
				NAME:		b.name,
				VALUE:	b.value}});
		}
		for (var fi in page.fields){
			var f=page.fields[fi];
			var FIELD = {
				_TYPE:			f.type, 
				_ORDER:			f.order, 
				_OPTIONAL:		f.optional==true ? true : JS2XML_SKIP,
				_MIN:				f.min, 
				_MAX:				f.max, 
				_CALENDAR:		f.calendar==true ? true : JS2XML_SKIP, 
				_CALCULATOR:	f.calculator==true ? true : JS2XML_SKIP, 
				_MAXCHARS:		f.maxChars,
				XML_LABEL:			f.label,
				NAME:				f.name, 
				VALUE:			f.value, 
				XML_INVALIDPROMPT:	f.invalidPrompt,
			}
			PAGE.FIELDS.push({FIELD:FIELD});
		}
		
		JSON.GUIDE.PAGES.push({PAGE:PAGE});
	} 
			
//	trace('<pre>'+propsJSON('Guide', JSON.GUIDE)+'</pre>'); 
	return '<?xml version="1.0" encoding="UTF-8" ?>' + js2xml('GUIDE',JSON.GUIDE);
}
function parseXML_CAJA_to_CAJA(GUIDE)
{	// Parse parseCAJA
	var guide=new TGuide();
	
	var INFO = $('INFO',GUIDE);
	guide.tool = 			makestr(INFO.children('TOOL').text());;
	guide.toolversion =  makestr(INFO.children('TOOLVERSION').text());
	guide.avatar=			makestr(INFO.children('AVATAR').text());
	guide.completiontime=makestr(INFO.children('COMPLETIONTIME').xml());;
	guide.copyrights=		makestr(INFO.children('COPYRIGHTS').xml());;
	guide.createdate=		makestr(INFO.children('CREATEDATE').text());;
	guide.credits=			makestr(INFO.children('CREDITS').xml());;
	guide.description = 	makestr(INFO.children('DESCRIPTION').xml());
	guide.jurisdiction =	makestr(INFO.children('JURISDICTION').text());
	guide.language=		makestr(INFO.children('LANGUAGE').text());
	guide.modifydate=		makestr(INFO.children('MODIFYDATE').text());;
	guide.notes=			makestr(INFO.children('NOTES').xml());
	guide.sendfeedback=	TextToBool(INFO.children('SENDFEEDBACK').text(),false);
	guide.emailContact=	makestr(INFO.children('EMAILCONTACT').text());
	guide.subjectarea =  makestr(INFO.children('SUBJECTAREA').text());
	guide.title = 			INFO.children('TITLE').text();
	guide.version=			makestr(INFO.children('VERSION').text());
	guide.viewer = 		makestr(INFO.children('VIEWER').text());
	guide.logoImage = 	makestr(INFO.children('LOGOIMAGE').text());
	guide.endImage = 		makestr(INFO.children('ENDIMAGE').text());

	
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
		v.sortName=	sortingNatural(v.name);
		v.type=VARIABLE.attr("TYPE");
		guide.vars[v.name]=v;
	 });
	GUIDE.find("POPUP").each(function() {//TODO discard unused popups
		var POPUP = $(this);
		var popup = new TPopup();
		popup.id=POPUP.attr("ID");
		popup.name=POPUP.attr("NAME");
		popup.text=POPUP.find("TEXT").xml();
		guide.popups[popup.id]=popup;
	});
	GUIDE.find("CONSTANTS").each(function() {
		var CONSTANT = $(this);
		var constant = new TConstant(); 
		constant.name=v.attr("NAME");
		constant.text=CONSTANT.find("VAL").xml();
		guide.constants[constant.name]=constant;
	});	
	GUIDE.find("PAGES > PAGE").each(function() {
		var PAGE = $(this);
		//var page = new TPage();
		var page = guide.addUniquePage(PAGE.attr("NAME"),PAGE.attr("ID"));
		
		//page.id=PAGE.attr("ID");
		//page.name=PAGE.attr("NAME");
		page.type=PAGE.attr("TYPE");
		page.style=makestr(PAGE.attr("STYLE"));
		page.mapx=parseInt(PAGE.attr("MAPX"));
		page.mapy=parseInt(PAGE.attr("MAPY"));
		page.nextPage="";
		page.nextPageDisabled = false;
		page.step=parseInt(PAGE.attr("STEP"));
		page.text=PAGE.find("TEXT").xml();
		page.learn=makestr(PAGE.find("LEARN").xml());
		page.help=makestr(PAGE.find("HELP").xml());
		page.helpReader=makestr(PAGE.find("HELPREADER").xml());
		page.helpImage=makestr(PAGE.find("HELPIMAGE").text());
		page.helpVideo=makestr(PAGE.find("HELPVIDEO").text());
		page.notes=makestr(PAGE.find("NOTES").xml());
		page.alignText="";
		page.scripts = makestr(PAGE.find("SCRIPTS").xml());
		
		
		page.xml = $(this).xml();
		//page.sortName=(page.id==guide.firstPage) ? "#":sortingNatural(page.step+";"+page.name);// sort by Step then Page. 
		//guide.pages[page.name] = page;
		//guide.mapids[page.id]=page;
		
		PAGE.children('BUTTON').each(function(){
			var button=new TButton();
			button.label =jQuery.trim($(this).find("LABEL").xml());
			button.next = makestr($(this).attr("NEXT"));
			button.name =jQuery.trim($(this).find("NAME").xml());
			button.value = jQuery.trim($(this).find("VALUE").xml()); 
			page.buttons.push(button);
		});
		PAGE.children('FIELD').each(function(){
			var field=new TField();
			field.type =$(this).attr("TYPE");
			field.optional = TextToBool($(this).attr("OPTIONAL"),false);
			field.order = makestr($(this).attr("ORDER"));
			field.label =makestr(jQuery.trim($(this).find("LABEL").xml()));
			field.name =jQuery.trim($(this).find("NAME").xml());
			field.value = makestr($(this).attr("VALUE"));
			field.min = makestr($(this).attr("MIN"));//could be a number or a date so don't convert to number
			field.max = makestr($(this).attr("MAX"));
			field.calendar = TextToBool($(this).attr("CALENDAR"),false);
			field.calculator=TextToBool($(this).attr("CALCULATOR"),false);
			
			field.invalidPrompt =makestr(jQuery.trim($(this).find("INVALIDPROMPT").xml()));
			page.fields.push(field);
		});
	});
	
	return guide;
}


TGuide.prototype.addUniquePage=function(preferredName,id)
{	// create new page, attach to guide. ensure name is unique
	var counter=2;
	var name=preferredName;
	while (this.pages[name]!=null)
		name = preferredName +" " + (counter++);
	var page=new TPage();
	page.name = name;
	page.id = id==null ? name : id;
	this.pages[page.name] = page;
	this.mapids[page.id] = page;
	//console.log("Created new page "+name +  ( name != preferredName ? " from "+preferredName:""));
	return page;
}


TGuide.prototype.pageIDtoName=function(id)
{	// convert a page id (#) or reserved word into text.
	if (this.mapids[id])
	{
		id = this.mapids[id].name;
	}
	else
	{
		var autoIDs={};
		autoIDs[qIDNOWHERE]=	lang.qIDNOWHERE;//"[no where]"
		autoIDs[qIDSUCCESS]=	lang.qIDSUCCESS;//"[Success - Process Form]"
		autoIDs[qIDFAIL]=   	lang.qIDFAIL;//"[Exit - User does not qualify]"
		autoIDs[qIDEXIT]=		lang.qIDEXIT;//"[Exit - Save Incomplete Form]"//8/17/09 3.0.1 Save incomplete form
		autoIDs[qIDBACK]=		lang.qIDBACK;//"[Back to prior question]"//8/17/09 3.0.1 Same as history Back button.
		autoIDs[qIDRESUME]=	lang.qIDRESUME;//"[Exit - Resume interview]"//8/24/09 3.0.2
		if (typeof autoIDs[id]=="undefined")
			id=lang.UnknownID.printf(id);//,props(autoIDs)) //"[Unknown id "+id+"]" + props(autoIDs);
		else
			id=autoIDs[id];
	}
	return id;
}


function parseXML_Auto_to_CAJA(cajaData)
{	// Parse XML into CAJA
	var guide;
	if ((cajaData.find('A2JVERSION').text())!="")
		guide=parseXML_A2J_to_CAJA(cajaData);// Parse A2J into CAJA
	else
	if ((cajaData.find('CAVERSIONREQUIRED').text())!="")
		guide=parseXML_CA_to_CAJA(cajaData);// Parse CALI Author into CAJA
	else
		guide=parseXML_CAJA_to_CAJA(cajaData);// Parse Native CAJA
	
	
	for (var vi in guide.variables)
	{
		var v=guide.variables[vi];
		v.sortName=	sortingNatural(v.name);
	}
	guide.sortedPages=[];
	for (var p in guide.pages)
	{
		var page = guide.pages[p];
		//	page.sortName=sortingNatural(page.name);//pageXML.attr("SORTNAME");//sortingNatural(page.name);
		page.sortName=(page.id==guide.firstPage) ? "#":sortingNatural(page.step+";"+page.name);// sort by Step then Page. 
		guide.sortedPages.push(page);
	}
	guide.sortedPages=guide.sortedPages.sort(function (a,b){ if (a.sortName<b.sortName) return -1; else if (a.sortName==b.sortName) return 0; else return 1;});

	return guide;
}
 


TGuide.prototype.dump=function()
{	// Generate report of entire CAJA contents
	var txt="",p, f, b, page, field, button,txtp;
	
	function row(a,b,c,d){return '<tr><td>'+a+'</td><td>'+b+'</td><td>'+c+'</td><td>'+d+'</td></tr>\n'};
	txt += row('title','','',this.title)
		+row('viewer','','',this.viewer)
		+row('description','','',this.description);
	for (p in this.pages)
	{
		page = this.pages[p];
		txtp= row(page.id,'','id',page.id)
			+  row(page.id,'','name',page.name)
			+  row(page.id,'','text',page.text);
		for (f in page.fields)
		{
			field=page.fields[f];
			txtp += row(page.id,'field'+f,'label',field.label);
			txtp += row(page.id,'field'+f,'type',field.type);
			txtp += row(page.id,'field'+f,'name',field.name);
			txtp += row(page.id,'field'+f,'optional',field.optional);
			txtp += row(page.id,'field'+f,'invalidPrompt',field.invalidPrompt);
		}
		for (b in page.buttons)
		{
			button=page.buttons[b];
			txtp += row(page.id,'button'+b,'label',button.label);
			txtp += row(page.id,'button'+b,'next',button.next);
		}
		txt += txtp;
	}
	return '<table class="CAJAReportDump">'+txt+'</table>';
}














function prompt(status)
{
	if (status==null) status="";
	$('#CAJAStatus').text( status );
	trace(status);
}
function loadNewGuidePrep(guideFile,startTabOrPage)
{
	prompt('Loading '+guideFile);
	prompt('Start location will be '+startTabOrPage);
	$('.CAJAContent').html('Loading '+guideFile+AJAXLoader);
	$('#CAJAIndex, #CAJAListAlpha').html('');
}

function BlankGuide(){
	var guide = new TGuide();

	guide.title="My guide";
	guide.notes="Guide created on "+new Date();
	guide.authors=[{name:'My name',organization:"My organization",email:"email@example.com",title:"My title"}];
	guide.sendfeedback=false;
	var page=guide.addUniquePage("Welcome","Welcome");
	page.type="A2J";
	page.text="Welcome to Access to Justice";
	page.buttons=[{label:"Continue",next:"",name:"",value:""}];
	guide.steps=[{number:0,text:"Welcome"}];
	guide.vars=[]; 
	guide.sortedPages=[page];
	guide.firstPage=page.id;
	return guide;
}

function guideSave()
{
	var guide = gGuide;
	prompt('Saving '+guide.title + AJAXLoader);
	ws( {cmd:'guidesave',gid:gGuideID, guide: exportXML_CAJA_from_CAJA(guide), title:guide.title}, function(response){
		if (response.error!=null)
			prompt(response.error);
		else
			prompt(response.info);
	});
}
function createBlankGuide()
{	// create blank guide internally, do Save As to get a server id for future saves.
	var guide=BlankGuide();

	ws({cmd:'guidesaveas',gid:0, guide: exportXML_CAJA_from_CAJA(guide), title: guide.title},function(data){
		if (data.error!=null)
			status(data.error);
		else{
			var newgid = data.gid;//new guide id
			ws({cmd:'guides'},function (data){
				listguides(data);
				ws({cmd:'guide',gid:newgid},guideloaded);
			 });
		}
	});
}

function loadGuide(guideFile,startTabOrPage)
{
	guideFile=guideFile.split("#");
	if (guideFile.length==1)
	{
		guideFile=guideFile[0];
	}
	else
	{
		startTabOrPage= "PAGE " +guideFile[1];
		//if (editMode==0) startTabOrPage = "PAGE " + startTabOrPage;
		guideFile=guideFile[0];
	}
	loadNewGuidePrep(guideFile,startTabOrPage);
	window.setTimeout(function(){loadGuide2(guideFile,startTabOrPage)},500);
}
function guideloaded(data)
{
	gGuideID=data.gid;
	cajaDataXML=$(jQuery.parseXML(data.guide));
	gGuide =  parseXML_Auto_to_CAJA(cajaDataXML);
	$('li.guide[gid="'+gGuideID+'"]').html(gGuide.title);
	/*
		var cajaDataXML=$(data.guide);  
		var description = makestr(cajaDataXML.find('DESCRIPTION').text());
		var pages=[];
		cajaDataXML.find("QUESTION").each(function() {
			QUESTION = $(this);
			pages.push(QUESTION.attr("ID")+" "+ QUESTION.attr("NAME"));
		});
		alert( description +pages.join('<li>')); 
	*/
	//gGuide.filename=guideFile;
	startCAJA();
}

function listguides(data)
{
	var blank = {id:'a2j', title:'New empty guide'};
	gGuideID=0;
	var mine = [];
	var others = [];
	var start = '<li class=guide gid="' + blank.id + '">' + blank.title + '</li>';
	$.each(data.guides, function(key,g) { var str='<li class=guide gid="' + g.id + '">' + g.title + '</li>'; if (g.owned)mine.push(str);else others.push(str);});
	
	$('#guidelist').html("New guides <ol>"+start+"</ol>My guides <ol>"+mine.join('')+"</ol>" + "Sample guides <ol>"+others.join('')+"</ol>");
	$('li.guide').click(function(){
		var gid=$(this).attr('gid');
//		$(this).html('Loading guide '+$(this).text()+AJAXLoader);
		var guideFile=$(this).text();
		$('li.guide[gid="'+gid+'"]').html('Loading guide '+guideFile+AJAXLoader).addClass('.warning');
		loadNewGuidePrep(guideFile,'');
		if(gid=='a2j')
			createBlankGuide();
		else
			ws({cmd:'guide',gid:gid},guideloaded);
		//loadGuide($('a[href="#sample"]').first().text(), "TAB ABOUT");
	});
}

function loadGuide2(guideFile,startTabOrPage)
{
	var cajaDataXML;
	$.ajax({
			url: guideFile,
			dataType: ($.browser.msie) ? "text" : "xml", // IE will only load XML file from local disk as text, not xml.
			timeout: 45000,
			error: function(data,textStatus,thrownError){
			  alert('Error occurred loading the XML from '+this.url+"\n"+textStatus);
			 },
			success: function(data){
				//var cajaDataXML;
				if ($.browser.msie)
				{	// convert text to XML. 
					cajaDataXML = new ActiveXObject('Microsoft.XMLDOM');
					cajaDataXML.async = false;
					data=data.replace('<!DOCTYPE Access2Justice_1>','');//02/27/12 hack bug error
					cajaDataXML.loadXML(data);
				}
				else
				{
					cajaDataXML = data;
				}
				cajaDataXML=$(cajaDataXML); 
				// global variable guide
				gGuide =  parseXML_Auto_to_CAJA(cajaDataXML);
				gGuide.filename=guideFile;
				startCAJA(startTabOrPage);
				
			}
		});
}


function styleSheetSwitch(theme)
{
	//<link href="cavmobile.css" title="cavmobile" media="screen" rel="stylesheet" type="text/css" />
	trace('styleSheetSwitch='+theme); 
	theme = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/"+theme.toLowerCase()+"/jquery-ui.css";
	$('link[title=style]').attr('href',theme);
}

