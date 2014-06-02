/*******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	CAJA Parser

	Parse native CAJA into CAJA structure
	Parse A2J 4 Interview
	Parses .a2j/xml XML into CAJA format

	02/20/2012
	05/2014

******************************************************************************/

function fixPath(file)
{	// ### Keep fully qualified web path, otherwise default to file within guide's folder (no subfolders)
	if (file.indexOf('http')===0)
	{
		return file;
	}
	var fileFixed = gGuidePath+urlSplit(file).file;
	//traceInfo('fixPath',gGuidePath,file,fileFixed);
	return fileFixed;
}
function loadXMLList(opts)
{	// Load pick list elements from XML file. e.g., county names
	// opts.elt, opts.data, opts.val
	var $select=$(opts.data);
	$($select,'option:first').prepend('<option value="">Choose from this list</option>');
	$(opts.elt).html($select.html()).val(opts.val);
}

function loadXMLListExternal(opts)
{	// Load a XML based pick list.
	// Load list from opts.url, default list value will be opts.val, and XML stored in opts.elt.
   $.ajax({
      url:  fixPath(opts.url),
      dataType:  "text",
      timeout: 15000,
		opts: opts,
      error:
			/*** @this {{url}} */
			function(data,textStatus,thrownError){
			  dialogAlert({title:'Error loading external list',body:'Unable to load a list of items from '+this.url+"\n"+textStatus});
			 },
      success: function(data){
			var opts=this.opts;
			//if (!opts) opts=$(this).opts;//8/2013 this.opts;
			opts.data=data;
			loadXMLList(opts);
      }
   });
}


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
		_NEXTPAGE:	page.nextPage===''?gJS2XML_SKIP:page.nextPage,
		_nextPageDisabled: page.nextPageDisabled===true ? true : gJS2XML_SKIP,
		_alignText:	page.alignText==='' ? gJS2XML_SKIP : page.alignText,
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
			_REQUIRED:		f.required, //==true ? true : gJS2XML_SKIP,
			_MIN:				f.min, 
			_MAX:				f.max, 
			_CALENDAR:		f.calendar===true ? true : gJS2XML_SKIP, 
			_CALCULATOR:	f.calculator===true ? true : gJS2XML_SKIP, 
			_MAXCHARS:		f.maxChars,
			LISTSRC:			f.listSrc,
			XML_LISTDATA:	f.listData,
			XML_LABEL:		f.label,
			NAME:				f.name, 
			VALUE:			f.value, 
			SAMPLE:			f.sample, 
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
			  _REPEATING: ((v.repeating===true )? v.repeating : gJS2XML_SKIP),
			  _COMMENT: v.comment
			 };
		JSON.GUIDE.VARIABLES.push({VARIABLE:VARIABLE}); 
	}
	for (var pi in guide.pages)
	{
		if (guide.pages.hasOwnProperty(pi)) {
			JSON.GUIDE.PAGES.push({PAGE:page2JSON(guide.pages[pi])});
		}
	}
	var xml = '<?xml version="1.0" encoding="UTF-8" ?>' + js2xml('GUIDE',JSON.GUIDE);
	return xml;
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
		field.sample = makestr(jQuery.trim($field.find("SAMPLE").xml()));
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


function parseXML_CAJA_to_CAJA(GUIDE) // GUIDE is XML DOM
{	// Parse parseCAJA
	var guide=new TGuide();
	
	var INFO = $('INFO',GUIDE);
	guide.tool =			makestr(INFO.children('TOOL').text());
	guide.toolversion =  makestr(INFO.children('TOOLVERSION').text());
	guide.avatar=			makestr(INFO.children('AVATAR').text());
	guide.guideGender=	makestr(INFO.children('GUIDEGENDER').text());
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
		//var v = new TVariable();
		//v.name=VARIABLE.attr("NAME");
		//v.type=VARIABLE.attr("TYPE");
		//v.repeating = textToBool(VARIABLE.attr('REPEATING'),false);
		guide.varCreate(VARIABLE.attr("NAME"),VARIABLE.attr("TYPE"),textToBool(VARIABLE.attr('REPEATING'),false),makestr(VARIABLE.attr("COMMENT")));
		//v.traceLogic('Create variable');
		//guide.vars[v.name.toLowerCase()]=v;
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



TGuide.prototype.HotDocsAnswerSetXML=function()
{	// 2/28/05 Bug in HotDocs requires empty variable to NOT be included.

	//debug.printFunction("HotDocsAnswerSetXML");

	this.updateVarsForAnswerFile();

	// Build the Answer XML file.
	// Start with the DTD header.

	// 8/15/11 UTF-8 answer file format
	var xml_str=CONST.HotDocsANXHeader_UTF8_str;

	xml_str+="<AnswerSet title=\"\">";

	var vars=this.vars;
	var vi;
	for (vi in vars)
	{
		if (1)
		{
			/** @type {TVariable} */
			var v=vars[vi];
			xml_str+=this.HotDocsAnswerSetVariable(v);//+"\n";
		}
	}
	xml_str+="</AnswerSet>";
	traceInfo(xml_str);
	return xml_str;
};


/** @param {TVariable} variable  */
TGuide.prototype.HotDocsAnswerSetVariable = function(variable) //CVariable
{	// HotDocs requires a variable type.
	// This information is derived from the field's type.
	//var fieldType;//String
	/** @type {TField} */
	var field;

	// HotDocs doesn't like missing value fields.
	// 8/05 HotDocs local gets confused with variables that have no values.
	// 8/05 not sure if we include repeat values which may have blank values, so I include it.
	// 01/28/2008 1.8.6 For blank/null variables, use the unans="true" attribute.
	// this is what HotDocs wants and also forces XML nodes to remain present.

	var varType;
	field=this.variableToField(variable.name);
	if (field===null)
	{
		// We have a variable that has no field. Possible if we downloaded an answerset and the Interview has changed.
		//fieldType=CField.ftText
		varType=variable.type;
	}
	else
	{	// Use the field type to determine the HotDocs type to use.
		varType=field.fieldTypeToVariableType();
	}
	// Create XML Node like this:
	// <Answer name="Hire Date"><DateValue>4/1/2004</DateValue></Answer>
	// or
	// <Answer name="Gender"><MCValue><SelValue>4/1/2004</SelValue></MCValue></Answer>

	/*
	 <Answer name = "Vehicle make TE">
	  <RptValue>
	   <TextValue>Ford pickup</TextValue>
	   <TextValue>VW bug</TextValue>
	   <TextValue unans = "true"/>
	  </RptValue>
	 </Answer>
	 <Answer name = "Case type MC">
	  <MCValue>
	   <SelValue>Probate</SelValue>
	  </MCValue>
	 </Answer>
	*/

	// Possibilities:
	//	1. simple tag like <NumValue>55</NumValue>
	//	2. nested tag like <MCValue><SelValue>Minnesota</SelValue></MCValue>
	// 3. repeating tag like <RptValue><

	
	var mapVar2ANX={};
	mapVar2ANX[CONST.vtUnknown]=	"Unknown";
	mapVar2ANX[CONST.vtText]=		"TextValue";
	mapVar2ANX[CONST.vtTF]=			"TFValue";
	mapVar2ANX[CONST.vtMC]=			"MCValue";
	mapVar2ANX[CONST.vtNumber]=	"NumValue";
	mapVar2ANX[CONST.vtDate]=		"DateValue";
	mapVar2ANX[CONST.vtOther]=		"OtherValue";
	var ansType = mapVar2ANX[varType];
	// Type unknown possible with a Looping variable like CHILD
	if (ansType===CONST.vtUnknown || ansType === null || typeof ansType==='undefined'){
		ansType=[CONST.vtText];
	}
	
	function getXMLValue(value)
	{
		if (varType===CONST.vtDate)
		{
			// Ensure our m/d/y is converted to HotDocs d/m/y
			value=mdyTodmy(value);
		}
		var xmlV;
		if (typeof value==='undefined' || value===null || value==="")
		{	// 2014-06-02 SJG Blank value for Repeating variables MUST be in answer file (acting as placeholders.)
			xmlV  = '<'+ansType+' UNANS="true">' +  '' + '</'+ ansType+'>';
		}
		else{
			xmlV  = '<'+ansType+'>' +  htmlEscape(value) + '</'+ ansType+'>';
		}
		if (varType === CONST.vtMC) {
			xmlV = '<SelValue>' + xmlV + '</SelValue>';
		}
		return xmlV;		
	}
	var vi;
	var xml='';
	if (variable.repeating===true)
	{	// Repeating variables are nested in RptValue tag. 
		for (vi=1 ; vi< variable.values.length; vi++)
		{
			xml += getXMLValue(variable.values[vi]);
		}		
		xml = '<RptValue>' + xml + '</RptValue>';
	}
	else
	if (!(typeof value==='undefined' || value===null || value===""))
	{	// 2014-06-02 SJG Blank value for non-repeating must NOT be in the answer file.
		xml = getXMLValue(variable.values[1]);
	}
	if (xml!='') {
		xml = '<Answer name="' + variable.name + '">' + xml + '</Answer>';
	}
	else{
		//traceInfo("Skipping "+variable.name);
	}
	return xml;
};

TGuide.prototype.updateVarsForAnswerFile=function()
{	// 6/30/10 Update bookmark, history info just before saving the answer file.
	this.varSet("A2J Version", CONST.A2JVersionNum);
	this.varSet(CONST.bookmarkVarName,gPage.name);
	this.varSet(CONST.historyVarName,this.historyToXML());
	this.varSet(CONST.interviewIDVarName, this.makeHash());
};

TGuide.prototype.makeHash=function()//InterviewHash
{	// 2011-05-24 Make MD5 style hash of this interview
	var str = String(this.title)  + String(this.jurisdiction) +String(propCount(this.pages))
		+ String(this.description) + String(this.version) + String(this.language) + String(this.notes);
		//langID
	// TODO: MD5 or other function to get a somewhat unique ID to map answer file to interview file.
	return str.simpleHash();
};

TGuide.prototype.HotDocsAnswerSetFromXML=function(AnswerSetXML)
{	// 11/13 Parse HotDocs answer file XML string into guide's variables.
	// Add to existing variables. Do NOT override variable types.

	var mapANX2Var={};
	mapANX2Var["Unknown"]= CONST.vtUnknown;
	mapANX2Var["TextValue"]=CONST.vtText;
	mapANX2Var["TFValue"]=CONST.vtTF;
	mapANX2Var["MCValue"]=CONST.vtMC;
	mapANX2Var["NumValue"]=CONST.vtNumber;
	mapANX2Var["DateValue"]=CONST.vtDate;
	mapANX2Var["OtherValue"]=CONST.vtOther;
	mapANX2Var["RptValue"]=CONST.vtUnknown;
	
	var guide=this;
	$(AnswerSetXML).find('AnswerSet > Answer').each(function()
	{
		var varName = makestr($(this).attr("name"));
		if (varName.indexOf('#')>=0) {
			// 12/03/2013 Do not allow # in variable names. We discard them.
			traceInfo("Discarding invalidly named variable '"+varName+"'");
			return;
		}
		//var varName_i=varName.toLowerCase();
		/** @type {TVariable} */
		var v=guide.varExists(varName);//guide.vars[varName_i];
		var vNew=false;
		var varANXType=$(this).children().get(0).tagName;
		var varType = mapANX2Var[varANXType];
		if (v === null)
		{	// Variables not defined in the interview should be added in case we're passing variables between interviews.
			v=guide.varCreate(varName,varType,false, '');
			//v=new TVariable();
			//v.name=varName;
			//guide.vars[varName_i]=v;
			vNew=true;
		}	
		
		switch (varANXType) {
			case 'TextValue':
				guide.varSet(varName,$(this).find('TextValue').html());
				break;
			case 'NumValue':
				guide.varSet(varName,$(this).find('NumValue').html());
				break;
			case 'TFValue':
				guide.varSet(varName,$(this).find('TFValue').html());
				break;
			case 'DateValue':
				guide.varSet(varName,$(this).find('DateValue').html());
				break;
			case 'MCValue':
				guide.varSet(varName,$(this).find('MCValue > SelValue').html());
				break;
			case 'RptValue':
				v.repeating=true;
				$('RptValue',this).children().each(function(i){
					varANXType=$(this).get(0).tagName;
					varType = mapANX2Var[varANXType];
					switch (varANXType) {
						case 'TextValue':
						case 'NumValue':
						case 'TFValue':
						case 'DateValue':
							guide.varSet(varName,$(this).html(),i+1);
							break;
						case 'MCValue':
							guide.varSet(varName,$(this).find('SelValue').html());
							break;
					}
				});
				break;
		}
		if (v.type === CONST.vtUnknown) {
			v.type = varType;
			if (v.type===CONST.vtUnknown) {
				varName=varName.split(" ");
				varName=varName[varName.length-1];
				if (varName==='MC') {	v.type=CONST.vtMC;}
				else
				if (varName==='TF') {	v.type=CONST.vtTF;}
				else
				if (varName==='NU') {	v.type=CONST.vtNumber;}
				else					{	v.type=CONST.vtText;	}
				v.comment += 'Type not in answer file, assuming '+v.type;
			}
		}
		
		v.traceLogic(vNew ? 'Creating new:' : 'Replacing:');
	});
};



TGuide.prototype.loadXMLAnswerExternal = function (opts) 
/*	Load a XML based answer file. */
{	// Load list from opts.url, default list value will be opts.val, and XML stored in opts.elt.
   $.ajax({
      url:  (opts.url),
      dataType:  "xml",
      timeout: 15000,
		opts: opts,
      error:
			/*** @this {{url}} */
			function(data,textStatus,thrownError)
			{
				dialogAlert({title:'Error loading answer file',body:'Unable to load answer file from '+this.url+"\n"+textStatus});
			},
      success:
			function(data)
			{
				gGuide.HotDocsAnswerSetFromXML($(data));
				if (opts.success) {
					opts.success();
				}
			}
   });
};



function parseXML_A2J_to_CAJA(TEMPLATE)
{	// Parse A2J into CAJA
	traceInfo("Converting from A2J Author 4");
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
				//traceInfo("Creating popup ["+popup.page.name+"]");
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
			field.sample = makestr(jQuery.trim($(this).find("SAMPLE").xml()));
			field.invalidPrompt =makestr(jQuery.trim($(this).find("INVALIDPROMPT").xml()));
			field.invalidPromptAudio =makestr(jQuery.trim($(this).find("INVALIDPROMPTAUDIO").xml()));
			field.listSrc =makestr(jQuery.trim($(this).find("LISTSRC").xml()));
			if (field.listSrc===""){
				field.listData = $(this).find("SELECT").xml();
			}
			//traceInfo(field.listDATA);
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



/** @param {string} guideFile */
/** @param {string} startTabOrPage */
function loadGuideFile(guideFile,startTabOrPage)
{  // Load guide file and start on specified page
	
	if (guideFile==='') {
		$('#splash').empty();
		dialogAlert({title:'No guide file specified'});
		return;
	}
	var url=urlSplit(guideFile);
	guideFile = url.path+url.file;
	gGuidePath = url.path;
	if (url.hash!=="")
	{
      startTabOrPage= "PAGE " +url.hash;
	}
	traceInfo(guideFile,url,gGuidePath,startTabOrPage);
   loadNewGuidePrep(guideFile,startTabOrPage);
	
   window.setTimeout(function()
		//{loadGuideFile2(guideFile,startTabOrPage);}
		{	// Load guide file and start on specified page. 
			$.ajax({
				url: guideFile,
				dataType:  "xml", // IE will only load XML file from local disk as text, not xml.
				timeout: 45000,
				error:
					/*** @this {{url}} */
					function(data,textStatus,thrownError){
					$('#splash').empty();
					  dialogAlert({title:'Error occurred loading file',body:'Unable to load XML from '+guideFile+"\n"+textStatus});
					 },
				success: function(data){
					var cajaDataXML;
					cajaDataXML = data;
					cajaDataXML=$(cajaDataXML); 
					// global variable guide
					gGuide =  parseXML_Auto_to_CAJA(cajaDataXML);
					gGuide.filename=guideFile;
					guideStart(startTabOrPage);
					setProgress('');     
				}
			});
		},500);
}


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


/* */
