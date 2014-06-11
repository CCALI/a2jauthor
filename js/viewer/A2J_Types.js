/******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Type/constant declarations
	Required by Author and Viewers
	04/2012
	05/2014
******************************************************************************/



// ### Constants  ###

/** @const */ 
var CONST = {
	
	devShowTesting: false,
	showXML: 0,
	uploadURL: '',
	uploadGuideURL: '',
	// Spinnner for loading wait
	AJAXLoader: '<span class="loader">&nbsp;</span>"',

	A2JVersionNum:"5.0.1.23",//VersionInfo.verNum
	A2JVersionDate:"2014-06-11",
	
	
	//CAVersionNum:"5.0.0",
	//CAVersionDate:"2013-04-15",
	
	navigationVarName:"A2J Navigation TF",//11/24/08 2.6 Navigation button toggler.
		// if FALSE, navigation next/back/my progress are turned off.
	interviewIncompleteVarName:"A2J Interview Incomplete TF",//08/17/09 3.0.1 Is interview complete?
		// If defined to TRUE, user hit Exit before completion of variables.
	bookmarkVarName:"A2J Bookmark",
	historyVarName:"A2J History",
	interviewIDVarName: "A2J Interview ID",

	// Page Types
	ptPopup:'Popup',
	
	// Field Types
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
	

	// Variable Types
	vtUnknown : "Unknown",// 0,
	vtText : "Text", //1,
	vtTF : "TF",//2,
	vtMC : "MC",//5,
	vtNumber : "Number",// 3,
	vtDate : "Date", //4,
	vtOther : "Other",// 6,
	//vtStringsAns: ["Unknown","TextValue","TFValue","NumValue","DateValue","MCValue","OtherValue"],
	//vtStrings: ["Unknown","Text","TF","Number","Date","MC","Other"],
	//vtStringsGrid: ["Unknown","Text","True/False","Number","Date","Multiple Choice","Other"],
	
	// Limits
	// 2014-05-27 HotDocs has 50 character limit on variable name length
	MAXVARNAMELENGTH: 50,
	// Arbitrarily chosen limit on fields per question
	MAXFIELDS: 9,
	// Reasonable limit on buttons per question
	MAXBUTTONS: 3,
	MAXSTEPS: 12,
	kMinYear: 1900,
	
	// 11/27/07 1.7.7 Ordering options for lists such as a county list
	ordDefault:"",
	ordAscending:"ASC",
	ordDescending:"DESC",
	
	// Navigation page destinations
	qIDNOWHERE:"",
	qIDSUCCESS:"SUCCESS", // Posts data to server and exits viewer
	qIDFAIL:"FAIL", // Discards any data and exits viewer
	qIDEXIT:"EXIT", //8/17/09 3.0.1 Save like SUCCESS but flag incomplete true.
	qIDBACK:"BACK", //8/17/09 3.0.1 Same as history Back button.
	qIDRESUME:"RESUME", //8/24/09 3.0.2

	// 2014-06-04 Button-based repeat options
	RepeatVarSetOne:'=1', 
	RepeatVarSetPlusOne: '+=1',
	
	// HotDocs ANX
	// 4/8/04 This is the DTD for the HotDocs ANX file format.
	// It's prepended to the answer set for upload.
	HotDocsANXHeader_UTF8_str : 
	"<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
	 
	
	,
	ScriptLineBreak : '<BR/>'
};



// ### Classes ###



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
	this.values=[null];
	return this;
}




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
	this.repeatVar=""; // Old style repeat var - button option
	this.repeatVarSet="";// Old style repeat var counter adjustments - button option
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
	this.sample="";
	return this;
}

TField.prototype.fieldTypeToVariableType = function()//:Number
{	// Return variable type corresponding to this field type.
	var varType;//:Number;
	switch (this.type)
	{
		case CONST.ftText:
		case CONST.ftTextLong:
		case CONST.ftNumberSSN:
		case CONST.ftNumberPhone:
		case CONST.ftNumberZIP:
			varType=CONST.vtText;
			break;
		case CONST.ftRadioButton:
		case CONST.ftGender:
		case CONST.ftTextPick:
		case CONST.ftCheckBoxMultiple:
			varType=CONST.vtMC;
			break;
		case CONST.ftCheckBox:
		case CONST.ftCheckBoxNOTA:
			varType=CONST.vtTF;
			break;
		case CONST.ftNumber:
		case CONST.ftNumberDollar:
		case CONST.ftNumberPick:
			varType=CONST.vtNumber;
			break;
		case CONST.ftDateMDY:
			varType=CONST.vtDate;
			break;
		default:
			varType=CONST.vtText;
			//CALI.debug.ERROR("HotDocsAnswerSetVariable","Unknown field type","["+type+"]");
			break;
	}
	return varType;
};



TField.prototype.fieldTypeToTagName = function()
{	// Return variable type corresponding to this field type.
	// Since they are wordy, we abbreviate.
	if (TField.prototype.tagNames == null)
	{
		var tn={};
		tn[CONST.ftText]='Txt';
		tn[CONST.ftTextLong]='TxtLong';
		tn[CONST.ftTextPick]='TxtPick';
		tn[CONST.ftNumber]='Num';
		tn[CONST.ftNumberDollar]='$Num';
		tn[CONST.ftNumberPick]='NumPick';
		tn[CONST.ftNumberSSN]='SSN';
		tn[CONST.ftNumberPhone]='Phone';
		tn[CONST.ftNumberZIP]='ZIP';
		tn[CONST.ftRadioButton]='RB';
		tn[CONST.ftGender]='Gender';
		tn[CONST.ftCheckBoxMultiple]='CBMulti';
		tn[CONST.ftCheckBox]='CB';
		tn[CONST.ftCheckBoxNOTA]='CBNOTA';
		tn[CONST.ftDateMDY]='Date';
		TField.prototype.tagNames = tn;
	}
	var tag = this.tagNames[this.type];
	if (!tag) {
		tag=this.type;
	}
	return tag;
};



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
	this.learn= "";//Learn More prompt
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
	this.language="";				//Origin A2J - language code (default is "en") langID
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

	this.filename="interview.a2j";
	//this.mapids=[];// array of mapids indices	- maps a page.id to page while .pages uses page.name.
	this.sortedPages=[];//array of pages sorted by name (natural order)
	this.lastSaveXML="";
	
	this.attachedFiles={};//list of attached external files
	
	return this;
}
TGuide.prototype.genderVarName="User Gender";

TGuide.prototype.goodGender=function(g)
{	// Return M, F or blank (if no client gender known).
	// If blank, guide will face viewer (no client avatar appears).
	if (g==='Male'){ g='M';} else if (g==='Female') {g='F';} else {g='';}
	return g;
};
TGuide.prototype.getClientGender=function()
{	// Return M, F or blank (if no client gender known)
	return this.goodGender(this.varGet(this.genderVarName));
};


TGuide.prototype.sortPages=function()
{
	this.sortedPages=[];
	for (var pagename in this.pages){
		if (this.pages.hasOwnProperty(pagename)) {
			this.sortedPages.push(this.pages[pagename]);
		}
	}
	this.sortedPages=this.sortedPages.sort(function (a,b){return sortingNaturalCompare(a.name,b.name);});
};

TGuide.prototype.historyToXML=function()
{	// TODO
	/*
	var node_xml:XML=new XML()
	var bookmark_xml:XMLNode=node_xml.createElement("LABELS")
	node_xml.appendChild(bookmark_xml);
	var i:Number;
	for (i=0;i<historyComboBox.length;i++)
	{
		var label:String= historyComboBox.getItemAt(i).label;
		var data:Object =  historyComboBox.getItemAt(i).data;
		var qid:String = data.id;
		var loopNum:Number= (data.loopNum);
		var loopVar:String=Strings.NoNull(data.loopVar);
		var attr:Array;
		attr=["INDEX",i,"QID",qid];
		if (loopVar!="" && loopNum!= undefined)
			attr=attr.concat(["LOOPVAR",loopVar,"LOOPNUM",loopNum]);

		xmlutil.appendQuickTag(node_xml,bookmark_xml,"LABEL",label,attr);
		//history += xmlutil.appendQuickTag(node_xml,Node:XMLNode, Tag:String, Text, Attributes:Array):Void //was _global.XML_AppendQuickTag, XML_AppendQuickTag
	}
	return bookmark_xml.toString();
	*/
	return '<LABELS/>';
};


TGuide.prototype.pageDisplayName=function(name)//pageNametoText
{	// Convert a page name or reserved word into readable text.
	// Regular pages just have their name.
	// Special branches like SUCCESS or EXIT have a more user friendly description.
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
			dval = autoIDs[ name ];
		}
	}
	return dval;
};


TVariable.prototype.traceLogic=function(msg)
{
	traceLogic(msg+':'+traceTag("var",this.name)+', '+ (this.type) +', ' +(this.repeating?'REPEATING':'')+', '+this.comment);	
};

TGuide.prototype.varExists=function(varName)
{
	varName = jQuery.trim(varName);
	var varName_i=varName.toLowerCase();
	/** @type {TVariable} */
	var v=this.vars[varName_i];
	if (typeof v === 'undefined')
	{
		return null;
	}
	return v;
};
/**
* @param {string} varName
* @param {string|number} [varIndex]
*/
TGuide.prototype.varGet=function(varName,varIndex)
{
	var guide=this;
	/** @type {TVariable} */
	var v=guide.varExists(varName);//vars[varName_i];
	//varName = jQuery.trim(varName);
	//var varName_i=varName.toLowerCase();
	//var v=guide.vars[varName_i];
	if (typeof varIndex==='undefined' || varIndex===null || varIndex===''){
		varIndex=1;
	}
	if (v === null)
	{
		traceLogic('Undefined variable: '+ traceTag('var',varName)+ ((varIndex===0)?'':traceTag('varidx',varIndex) ));
		return v;//'undefined';
	}
	var val = v.values[varIndex]; 
	switch (v.type){
		case CONST.vtNumber:
			 val=parseFloat(val);
			break;
		case CONST.vtDate:
			// TODO: do we convert date's into daysSince1970, like A2J 4 so we can add? or require specific date operators?
			break;
		case CONST.vtTF:
			 val= (val>0) || (val===true) || (val==='true');
			break;
	}
	return val;
};

/**
* @param {string} varName
* @param {string} varType
* @param {boolean} varRepeat
* @param {string} varComment
*/
TGuide.prototype.varCreate=function(varName,varType,varRepeat,varComment)
{	// Create variable of specified type.
	// varType must match one of the CONST.vt??? strings
	// varRepeat is t/f. T indicates a REPEAT (or array).
	// varComment is author comment about purpose of variable, usually just blank string.
	if (varName.length>CONST.MAXVARNAMELENGTH) {
		traceAlert('Variable name "' + varName +'" exceeds maximum length of '+CONST.MAXVARNAMELENGTH +' characters.');
	}
	varName = jQuery.trim(varName);
	var varName_i=varName.toLowerCase();
	/** @type {TVariable} */
	var v=new TVariable();
	v.name=varName;
	v.repeating= varRepeat;
	v.type=varType;
	v.comment=varComment;
	this.vars[varName_i]=v;
	return v;
};

/**
* @param {string} varName
* @param {string|number} varVal
* @param {string|number} [varIndex]
*/
TGuide.prototype.varSet=function(varName,varVal,varIndex)//setVariableLoop
{
	//varName = jQuery.trim(varName);
	var guide=this;
	//var varName_i=varName.toLowerCase();
	/** @type {TVariable} */
	var v=guide.varExists(varName);//guide.vars[varName_i];
	if (v === null)
	{	// Create variable at runtime
		v=guide.varCreate(varName,CONST.vtText,!((typeof varIndex==='undefined') || (varIndex===null) || (varIndex==='') || (varIndex===0)),'');
		//v.traceLogic('Creating immediate');
	}
	if ((typeof varIndex==='undefined') || (varIndex===null) || (varIndex==='')){
		varIndex=0;		
	}
	// Set value but only trace if the value actually is different. 
	if (varIndex===0)
	{
		if (v.values[1]!==varVal) {
			gLogic.indent++;
			gLogic.traceLogic(traceTag('var',varName)+'='+traceTag('val',varVal));
			gLogic.indent--;
		}
		v.values[1]=varVal;
	}
	else
	{
		if (v.values[varIndex]!==varVal)
		{	
			gLogic.indent++;
			gLogic.traceLogic(traceTag('var',varName+' # '+varIndex)+traceTag('val',varVal));
			gLogic.indent--;
		}
		v.values[varIndex]=varVal;
	}
};



TGuide.prototype.variableToField = function (varName)
{	// Return field which assigns to variable varName, or null if not found.
	var questions=this.pages;
	var q;
	for (q in questions){
		if (questions.hasOwnProperty(q))
		{
			/** @type {TPage} */
			var question=questions[q];//CQuestion
			var f;
			for (f=0;f<question.fields.length;f++)
			{
				/** @type {TField} */
				var field;//CField
				field=question.fields[f];
				if (strcmp(field.name,varName)===0)
				{
					return field;
				}
			}
		}
	}
	return null;
};



// ### Global variables ### //

/** @type {TGuide} */
var gGuide; // global reference to current guide TGuide (CBK or A2J)

/** @type {TPage} */
var gPage; // global reference to current edit/viewed TPage

/** @type {number|string} */
var gGuideID; // unique service side id for this guide

var inAuthor; // True if author+viewer, false if just viewer.

// User 
/** @type {number} */
var gUserID=0; 
/** @type {string} */
var gUserNickName="User";
/** @type {string} */
var gGuidePath;
/** @type {string} */
var gEnv=''; // Where are we running? Locally, on a2jauthor.org, as beta or dev?
// Determine what stage we're in and display a notice. 
gEnv= (String(window.location).indexOf('http://authorbeta.a2jauthor.org')===0)?'BETA':
		(String(window.location).indexOf('http://authordev.a2jauthor.org')===0)?'DEV':
		(String(window.location).indexOf('http://localhost/')===0)?'LOCAL':'';
// User Session
//var amode=0;
//var username=""
//var orgName="Authoring Org";
//var runid=0;
//var resumeScoreURL=null;

// gStartArgs is populated by the parent IFRAME  Viewer (or A2J Author directly)
var gStartArgs = {
	templateURL:"",
	fileDataURL:"",
	getDataURL:	"",
	setDataURL:	"",
	autoSetDataURL:"",
	exitURL:		"",
	logURL:		"", //e.g., "https://lawhelpinteractive.org/a2j_logging";
	errRepURL:	"" //e.g., "https://lawhelpinteractive.org/problem_reporting_form";
};


/* */

