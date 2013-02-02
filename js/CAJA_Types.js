/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Type/constant declarations
	Required by Author and Viewers
*/


/* xproperties ptPopup,ftButton,ftText,ftTextLong,ftTextPick,
ftNumber,ftNumberDollar,ftNumberSSN,ftNumberPhone,
ftNumberZIP,ftNumberPick,ftDateMDY,ftGender,ftRace,
ftRadioButton,ftCheckBox,ftCheckBoxNOTA,ftCheckBoxMultiple,
vtUnknown,vtText,vtTF,vtNumber,vtDate,vtMC,vtOther,A2JVersion,
MAXFIELDS,MAXBUTTONS,MAXSTEPS,kMinYear,ordDefault,ordAscending,ordDescending,
value,event,code,number,textAudioURL,notes,learn,help,
text,label,next,name,type,optional,invalidPrompt,order,min,max,calendar,calculator,maxChars*/
	
 




// ### Constants  ###

// Navigation page destinations
/** @const */ var qIDNOWHERE="";
/** @const */ var qIDSUCCESS="SUCCESS";
/** @const */ var qIDFAIL="FAIL";
/** @const */ var qIDEXIT="EXIT"; //8/17/09 3.0.1 Save like SUCCESS but flag incomplete true.
/** @const */ var qIDBACK="BACK"; //8/17/09 3.0.1 Same as history Back button.
/** @const */ var qIDRESUME="RESUME"; //8/24/09 3.0.2

/** @const */ 
var CONST = {
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
	
	A2JVersion:"5.0.0"
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
 
var gDev=0;


// ### Classes ###
function TText()
{
	this.text = "";
	return this;
}

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
 */
function TField()
{
	this.type ="";
	this.label ="";
	this.name ="";//reference TVar.name
	this.value = "";//default value (used in radio buttons)
	this.optional =false;
	this.invalidPrompt ="";
	this.order ="";//default, ASC, DESC
	this.min="";
	this.max="";
	this.calendar=false;
	this.calculator=false;
	this.maxChars="";
	this.listSRC="";
	this.listDATA="";
	return this;
}


/** 
 * @constructor
 * @struct
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
 */
function TStep()
{
	this.number ="";
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
	
	//this.scripts=[];
	this.codeBefore="";
	this.codeAfter="";
	this.fields=[];
	this.buttons=[];
	this.step=0;//index into guide.steps[]
	
	this.type ="";//type of page interaction
	this.style ="";//subtype of page interaction
	//this.nextPage="";//default for next page
	//this.nextPageDisabled=false;//boolean - if true, next page button is disabled.
	//this.destPage=null;
	//this.columns=0;

	this.mapx=0;
	this.mapy=0;
	
//	this.alignText="";
//	this.details=[];
//	this.captions=[];
//	this.feedbacks=[];
//	this.feedbackShared="";
//	this.attempts=0;//number of attempts to answer this question
//	this.scores=[];//array of TScore.
//	this.textMatches=null;//array of TextMatch
//	this.subq=null;//

	this.timeSpent=0;//seconds spent on this page
	this.startSeconds=null;
	this.xml=null;
	return this;
}
/** 
 * @constructor
 * @struct
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
 */
function TGuide()
{	// This is the Guide representing a CALI lesson Book or an A2J Author Interview.

	this.tool="CAJA";
	this.toolversion="2012-12-12";
	this.avatar="";				//Origin A2J - default avatar to use (blank or tan)
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

	/** @type Array.TAuthor */
	this.authors=[];				//Origin Both - single line, CA is a heirarchy. Array of TAuthor
	
	this.firstPage="";			//Origin A2J - starting page specificed by author
	this.exitPage="";				//Origin A2J - page that exist success
	
	/** @type Array.TStep */
	this.steps=[];					//Origin A2J - array of TStep()

	
	/** @type Array.TPage */	
	this.pages={};			//Origin both - associative array of pages TPage() by page name. E.g., pages["Contents"] = TPage()
	this.constants={};	//Origin CAJA - associative array of contants, MAXINCOME:25000
	//this.popups=[];		//Origin A2J - array of embedded text popups (these are anonymous unlike CA where they are named)
	this.assets=[];		//Origin CAJA - array of images for preloading.

	this.templates="";	//Origin A2J - notes about source template files
	this.vars={};			//Origin A2J - associative array of TVariables()

	this.filename="";
	//this.mapids=[];// array of mapids indices	- maps a page.id to page while .pages uses page.name.
	this.sortedPages=[];//array of pages sorted by name (natural order)
	
	return this;
}





var vtStrings=["Unknown","Text","TF","Number","Date","MC","Other"];
var vtStringsAnswerFile=["Unknown","TextValue","TFValue","NumValue","DateValue","MCValue","OtherValue"];
var vtStringsGrid=["Unknown","Text","True/False","Number","Date","Multiple Choice","Other"];


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
		autoIDs[qIDNOWHERE]=	lang.qIDNOWHERE;//"[no where]"
		autoIDs[qIDSUCCESS]=	lang.qIDSUCCESS;//"[Success - Process Form]"
		autoIDs[qIDFAIL]=		lang.qIDFAIL;//"[Exit - User does not qualify]"
		autoIDs[qIDEXIT]=		lang.qIDEXIT;//"[Exit - Save Incomplete Form]"//8/17/09 3.0.1 Save incomplete form
		autoIDs[qIDBACK]=		lang.qIDBACK;//"[Back to prior question]"//8/17/09 3.0.1 Same as history Back button.
		autoIDs[qIDRESUME]=	lang.qIDRESUME;//"[Exit - Resume interview]"//8/24/09 3.0.2	
		if (typeof autoIDs[ name ] === 'undefined'){
			dval = lang.UnknownID.printf( name, name );//,props(autoIDs)) //"[Unknown id "+id+"]" + props(autoIDs);
		}
		else{
			dval = name+"\t"+autoIDs[ name ];
		}
	}
	return dval;
};



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
		return 'undefined';
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
	//gLogic.trace('Getting value of '+  traceTag('var',varName)+ ( (varIndex==0)?'':traceTag('varidx',varIndex) ) +'='+traceTag('val',val));
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
