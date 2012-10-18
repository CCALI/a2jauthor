/* 02/20/2012 Parse XML of A2J, CALI Author or native CAJA into CAJA structure */
// Code shared by A2J Author, A2J Viewer, CALI Author and CALI 5 Viewer


function exportXML_CAJA_from_CAJA(guide)
{	// Convert Guide structure into XML
	var JSON={GUIDE:{INFO:{},STEPS:[],VARIABLES:[],PAGES:[]}};
	var chars=" CHARS[<'&\">]";
	
	JSON.GUIDE.INFO.viewer=guide.viewer;
	JSON.GUIDE.INFO.version=guide.version;
	JSON.GUIDE.INFO.title=guide.title;
	JSON.GUIDE.INFO.description=guide.description;
	JSON.GUIDE.INFO.credits=guide.credits;
	JSON.GUIDE.INFO.completionTime=guide.completionTime;
	JSON.GUIDE.INFO.jurisdiction=guide.jurisdiction;
	JSON.GUIDE.INFO.firstPage=guide.firstPage;

	for (var si in guide.steps)
	{
		var step=guide.steps[si];
		JSON.GUIDE.STEPS.push({STEP:{_NUMBER:step.number,TEXT:step.text}}); 
	}
	for (var vi in guide.vars)
	{
		var v=guide.vars[vi];
		JSON.GUIDE.VARIABLES.push({VARIABLE:{_NAME:v.name,_TYPE:v.type}}); 
	}
	if(1)
	for (var pi in guide.pages)
	{
		var page = guide.pages[pi];
		JSON.GUIDE.PAGES.push({PAGE:{
			_ID:page.id,
			_NAME:page.name,
			_TYPE:page.type,
			_STYLE:page.style,
			_STEP:page.step,
			XML_TEXT:page.text, //"<p>text of <b>my</b> page</p><p>" + htmlEscape(chars)+"</p>",
			XML_HELP:page.help, //"<p>text of <b>my</b> page's help</p><p>" + htmlEscape(chars)+"</p>"
			
			_alignText: page.alignText,
			SCRIPTS: page.scripts 
			}});
	}
/*		page.nextPage="auto";
		page.nextPageDisabled = false;
		page.step=parseInt(PAGE.attr("STEP"));
		page.text=PAGE.find("TEXT").xml();
		page.learn=makestr(PAGE.find("LEARN").xml());
		page.help=makestr(PAGE.find("HELP").xml());
		page.note=PAGE.find("NOTE").xml();
		page.alignText="auto";
		page.sortName=(page.id==guide.firstPage) ? "#":sortingNatural(page.step+";"+page.name);// sort by Step then Page. 
		page.scripts = PAGE.find("SCRIPTS").xml();
	*/				
			
	return js2xml('GUIDE',JSON.GUIDE);
}
function js2xml(name,o)
{	// 10/17/2012 Sam's simple JSON to XML. 
	// If object property name starts with '_' it becomes an attribute.
	// If object property name starts with 'XML_' it becomes a node that's NOT encoded.
	function trim(name,attr,body){
		if (body=='')
			if (attr=='')
				return '';
			else
				return '<'+name.toUpperCase()+attr+'/>';
		else
			return '<'+name.toUpperCase()+attr+'>'+body+'</'+name.toUpperCase()+'>';
	}
	if (typeof o === 'object')
	{
		var attr="";
		var body="";
		for (var p in o)
		{
			if (parseInt(p)>= 0) // array assumed
				body += js2xml('',o[p]);
			else
			if (p.substr(0,1)=='_') // embed as attribute
				attr += " " + p.substr(1)+"=\""+htmlEscape(o[p])+"\"";
			else
			if (p.substr(0,4)=='XML_') // treat as raw XML
				body += o[p];
			else
				body += js2xml(p,o[p]); //recurse
		}
		if (name=='')
			return body;
		else
			return trim(name,attr,body);//'<'+name+attr+'>'+body+'</'+name+'>';
	}
	else
		return trim(name,'',htmlEscape(o));// '<'+name+'>'+htmlEscape(o)+'</'+name+'>' ; // string or number is escaped. 
}

function parseXML_CAJA_to_CAJA(cajaData)
{	// Parse parseCAJA
	var guide=new TGuide();
	guide.title = cajaData.find('TITLE').text();
	guide.jurisdiction =  makestr(TEMPLATE.find('JURISDICTION').text());
	guide.firstPage =  makestr(TEMPLATE.find('FIRSTPAGE').text());
	
	// Parse pages into book.pages[] records. 
	TEMPLATE.find("VARIABLE").each(function() {
		var VARIABLE = $(this);
		var v = new TVariable();
		v.name=VARIABLE.attr("NAME");
		v.sortName=	sortingNatural(v.name);
		v.type=VARIABLE.attr("TYPE");
		guide.vars[v.name]=v;
	 });
	TEMPLATE.find("STEP").each(function() {
		var STEP = $(this);
		var step = new TStep();
		step.number=STEP.attr("NUMBER");
		step.text=STEP.find("TEXT").xml();
		guide.steps.push(step);
	 });
	TEMPLATE.find("POPUP").each(function() {//TODO discard unused popups
		var POPUP = $(this);
		var popup = new TPopup();
		popup.id=POPUP.attr("ID");
		popup.name=POPUP.attr("NAME");
		popup.text=POPUP.find("TEXT").xml();
		guide.popups[popup.id]=popup;
	});
	TEMPLATE.find("CONSTANTS").each(function() {
		var CONSTANT = $(this);
		var constant = new TConstant(); 
		constant.name=v.attr("NAME");
		constant.text=CONSTANT.find("VAL").xml();
		guide.constants[constant.name]=constant;
	});
	
	TEMPLATE.find("PAGE").each(function() {
		var PAGE = $(this);
		var page = new TPage();
		page.xml = $(this).xml();
		
		page.id=PAGE.attr("ID");
		page.name=page.id;
		page.type=PAGE.attr("TYPE");
		page.style=PAGE.attr("STYLE");
		page.nextPage="auto";
		page.nextPageDisabled = false;
		page.step=parseInt(PAGE.attr("STEP"));
		page.text=PAGE.find("TEXT").xml();
		page.learn=makestr(PAGE.find("LEARN").xml());
		page.help=makestr(PAGE.find("HELP").xml());
		page.note=PAGE.find("NOTE").xml();
		page.alignText="auto";
		page.sortName=(page.id==guide.firstPage) ? "#":sortingNatural(page.step+";"+page.name);// sort by Step then Page. 
		page.scripts = PAGE.find("SCRIPTS").xml();
		
		PAGE.find('BUTTON').each(function(){
			var button=new TButton();
			button.label =jQuery.trim($(this).find("LABEL").xml());
			button.next = makestr($(this).attr("NEXT"));
			button.name =jQuery.trim($(this).find("NAME").xml());
			button.value = jQuery.trim($(this).find("VALUE").xml()); 
			page.buttons.push(button);
		});
		PAGE.find('FIELD').each(function(){
			var field=new TField();
			field.type =$(this).attr("TYPE");
			field.optional =$(this).attr("OPTIONAL")!="false";
			field.order =$(this).attr("ORDER");			
			field.label =jQuery.trim($(this).find("LABEL").xml());
			field.name =jQuery.trim($(this).find("NAME").xml());
			field.invalidPrompt =jQuery.trim($(this).find("INVALIDPROMPT").xml());
			page.fields.push(field);
		});
	});
	
	return guide;
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
	//trace("Parse XML data");
	if ((cajaData.find('A2JVERSION').text())!="")
		guide=parseXML_A2J_to_CAJA(cajaData);// Parse A2J into CAJA
	else
	if ((cajaData.find('CAJAVERSION').text())!="")
		guide=parseXML_CAJA_to_CAJA(cajaData);// Parse CALI Author into CAJA
	else
		guide=parseXML_CA_to_CAJA(cajaData);// Parse Native CAJA
		
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
function loadNewGuide(guideFile,startTabOrPage)
{
	prompt('Loading '+guideFile);
	prompt('Start location will be '+startTabOrPage);
	$('.CAJAContent').html('Loading '+guideFile+AJAXLoader);
	$('#CAJAIndex, #CAJAListAlpha').html('');
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
	loadNewGuide(guideFile,startTabOrPage);
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
	gGuideID=0;
	var mine = [];
	var others = [];
	$.each(data.guides, function(key,g) { var str='<li class=guide gid="' + g.id + '">' + g.title + '</li>'; if (g.owned)mine.push(str);else others.push(str);});
	$('#guidelist').html("My guides <ol>"+mine.join('')+"</ol>" + "Sample guides <ol>"+others.join('')+"</ol>");
	$('li.guide').click(function(){
		var gid=$(this).attr('gid');
//		$(this).html('Loading guide '+$(this).text()+AJAXLoader);
		var guideFile=$(this).text();
		$('li.guide[gid="'+gid+'"]').html('Loading guide '+guideFile+AJAXLoader).addClass('.warning');
		loadNewGuide(guideFile,'');
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

