/*******************************************************************************
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	CAJA Parser

	Parse native CAJA into CAJA structure
	Parse A2J 4 Interview
	Parses .a2j/xml XML into CAJA format

	02/20/2012

******************************************************************************/

function fixPath(file)
{	// ### Keep fully qualified web path, otherwise default to file within guide's folder (no subfolders)
	if (file.indexOf('http')===0)
	{
		return file;
	}
	var fileFixed = gGuidePath+urlSplit(file).file;
	//trace('fixPath',gGuidePath,file,fileFixed);
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
      error:
			/*** @this {{url}} */
			function(data,textStatus,thrownError)
			{
			  //dialogAlert({title:'Error loading external list',body:'Unable to load a list of items from '+this.url+"\n"+textStatus});
			  traceAlert( 'Unable to load a list of items from '+this.url+"\n"+textStatus);
			 },
      success: function(data){
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
			LABEL:	b.label, // XML_LABEL
			_NEXT:	b.next,
			_URL:		b.url,
			_REPEATVAR:	b.repeatVar,
			_REPEATVARSET:	b.repeatVarSet,
			NAME:		b.name,
			VALUE:	b.value
			}});
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
		button.url = makestr($(this).attr("URL"));
		button.repeatVar=makestr($(this).attr("REPEATVAR"));
		button.repeatVarSet=makestr($(this).attr("REPEATVARSET"));		
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
	switch (guide.avatar)
	{
		case 'blank':
		case 'avatar1':
			guide.avatar = 'avatar1';
			break;
		case 'tan':
		case 'avatar2':
			guide.avatar = 'avatar2';
			break;
		case 'tan2':
		case 'avatar3':
			guide.avatar = 'avatar3';
			break;
		default:
			guide.avatar = 'avatar1';
	}
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
	 });
	guide.varCreateInternals();
	
	/*
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
	//trace(xml_str);
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
	{
		var value=variable.values[1];
		if (!(typeof value==='undefined' || value===null || value===""))
		{	// 2014-06-02 SJG Blank value for non-repeating must NOT be in the answer file.
			xml = getXMLValue(value);
		}
	}
	if (xml!='') {
		xml = '<Answer name="' + variable.name + '">' + xml + '</Answer>';
	}
	//else{ trace("Skipping "+variable.name);}
	return xml;
};

TGuide.prototype.varCreateInternals=function()
{	// Create the A2J internal answer set variables.
	this.varCreateOverride(CONST.vnVersion, CONST.vtText,false,'A2J Author Version');
	this.varCreateOverride(CONST.vnInterviewID, CONST.vtText,false,'Guide ID');
	this.varCreateOverride(CONST.vnBookmark, CONST.vtText,false,'Current Page');
	this.varCreateOverride(CONST.vnHistory, CONST.vtText,false,'Progress History List (XML)');
	this.varCreateOverride(CONST.vnNavigationTF, CONST.vtTF,false,'Allow navigation?');
	this.varCreateOverride(CONST.vnInterviewIncompleteTF, CONST.vtTF,false,'Reached Successful Exit?');
	for (var s=0;s<CONST.MAXSTEPS;s++)
	{
		this.varCreateOverride(CONST.vnStepPrefix+s, CONST.vtText,false,'');
	}
};

TGuide.prototype.updateVarsForAnswerFile=function()
{	// 6/30/10 Update bookmark, history info just before saving the answer file.
	this.varSet(CONST.vnVersion, CONST.A2JVersionNum);
	this.varSet(CONST.vnInterviewID, this.makeHash());
	this.varSet(CONST.vnBookmark,gPage.name);
	this.varSet(CONST.vnHistory,this.historyToXML());
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
			//trace("Discarding invalidly named variable '"+varName+"'");
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
			if (v.type===CONST.vtUnknown)
			{
				varName=varName.split(" ");
				varName=varName[varName.length-1];
				if (varName==='MC') {	v.type=CONST.vtMC;}
				else
				if (varName==='TF') {	v.type=CONST.vtTF;}
				else
				if (varName==='NU') {	v.type=CONST.vtNumber;}
				else					{	v.type=CONST.vtText;	}
				v.warning = 'Type not in answer file, assuming '+v.type;
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
	//trace(guideFile,url,gGuidePath,startTabOrPage);
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
	if (preferredName==='' || typeof preferredName==='undefined') {
		preferredName='Page'; // in case of blank page names, start with something.
	}
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
	//trace(name,page.name);
	page.name = name;
	guide.pages[page.name] = page;  
	return page;
};


/* */
