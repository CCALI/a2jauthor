/* CAJA Type/constant declarations
*/

// ### Constants  ###

// Navigation page destinations
var qIDNOWHERE=""
var qIDSUCCESS="SUCCESS"
var qIDFAIL="FAIL"
var qIDEXIT="EXIT" //8/17/09 3.0.1 Save like SUCCESS but flag incomplete true.
var qIDBACK="BACK" //8/17/09 3.0.1 Same as history Back button.
var qIDRESUME="RESUME" //8/24/09 3.0.2

// ### Steps ###
// colors: 0xffffff,0xBDD6D6, 0xB7DDB7, 0xEFC68C, 0xE7E7B5, 0xEFDED6, 0xECD8EA,0xBDD6D6, 0xB7DDB7, 0xEFC68C, 0xE7E7B5, 0xEFDED6, 0xECD8EA];
var MAXSTEPS= 12;

var textonlyMode=0; // textonlyMode for single document editing
var editMode= 0 ; // editMode=0 if separate pages, =1 for single document


// ### Classes ###
function TText()
{
	this.text = "";
	return this;
}

function TVariable()
{
	this.name= "";
	this.type ="";//E.g., Text, MC, TF
	this.comment ="";
	this.value =null;
	this.sortName="";
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
function TField()
{
	this.type ="";
	this.order ="";//default, ASC, DESC
	this.label ="";
	this.name ="";//reference TVar.name
	this.optional =false;
	this.invalidPrompt ="";
	return this;
}
function TScript()
{
	this.event =""; // BEFORE page is displayed or AFTER user presses a button
	this.code ="";
	return this;
}
function TStep()
{
	this.number ="";
	this.text ="";
	return this;
}
function TPopup()
{	// This represents an embedded popup
	this.id ="";//unique id from POPUP://#
	this.name =""
	this.text="";
	return this;
}
function TPage()
{	// This represents a single page within the lesson book/interview.
	this.id ="";// Unique id
	this.name ="";// Unique but author chosen name
	this.text ="";// Text of question
	this.help = "";// Optional help text from Learn More button
	this.notes="";
	
	this.scripts=[];
	this.fields=[];
	this.buttons=[];
	this.step=0;
	
	this.type ="";//type of page interaction
	this.style ="";//subtype of page interaction
	this.nextPage="";//default for next page
	this.nextPageDisabled=false;//boolean - if true, next page button is disabled.
	this.destPage=null;
	this.columns=0;

//	this.alignText="";
//	this.details=[];
//	this.captions=[];
	this.feedbacks=[];
	this.feedbackShared="";
	this.attempts=0;//number of attempts to answer this question
	this.scores=[];//array of TScore.
	this.xml=null;
	this.textMatches=null;//array of TextMatch
	this.sortName="";
	
	
	this.subq=null;//
	this.timeSpent=0;//seconds spent on this page
	this.startSeconds=null;
	return this;
}

function TCAJA()
{	// This is the Book representing a lesson.
	this.viewer="";//A2J, CA, CAJA
	this.version="";
	this.title="";
	this.description="";
	this.pages={};// associative array of pages TPage() by page name. E.g., pages["Contents"] = TPage()
	this.sortedPages=[];//array of pages sorted by name (natural order)
	this.vars={};//associative array of TVariables()
	this.constants={};//associative array of contants, MAXINCOME:25000
	this.mapids=[];// array of mapids indices	
	this.steps=[];//
	this.popups=[];
	this.assets=[];//array of images for preloading.
	return this;
}

