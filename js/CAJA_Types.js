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

// ### Global variables ### //
var gGuide; // global reference to current guide TGuide (CBK or A2J)
var gPage; // global reference to current edit/viewed TPage
var gGuideID; // unique service side id for this guide

// User 
var gUserID=0; 
var gUserNickName="User";
var amode=0;
//var username=""
//var orgName="Authoring Org";

// Session
var runid=0;
var resumeScoreURL=null;
 

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
	this.learn ="";
	this.help = "";// Optional help text from Learn More button
	this.notes="";
	
	this.scripts=[];
	this.fields=[];
	this.buttons=[];
	this.step=0;//index into guide.steps[]
	
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

function TGuide()
{	// This is the Guide representing a CALI lesson Book or an A2J Author Interview.

	this.viewer=""; 				//Origin CAJA - A2J, CA, CAJA - which viewer to use? 
	this.version="";				//Original Both - CA uses the mm/dd/yyyy format, A2J is author defined
	this.title="";					//Origin Both - author title - in CA it's visible at top of page, not seen in A2J by user
	this.createdate="";			//Original CA - first date of creation of the lesson
	this.modifydate="";			//Original CA - last date of editing of the lesson
	this.description="";			//Origin Both - author composed desciprtion or CALI's official lesson description
	this.credits="";				//Origin CA - credits for image permissions, etc.
	this.copyrights="";			//Origin CA - CALI copyright notices, etc.
	this.author="";				//
	this.sendfeedback="";		//Origin A2J - if true we show email link
	this.sendfeedbackemail="";	//Origin A2J - if defined, this sends feedback
	this.completionTime="";		//Origin CA - author's estimated completion time including section breakdown
	this.subjectarea="";			//Original CA - CA places every lesson into a single main category like Torts.
	this.jurisdiction="";		//Origin A2J - author's note on jurisdiction like 'Cook County'
	this.firstPage="";			//Origin A2J - starting page specificed by author
	this.history="";				//Origin Both - author revision notes or CBK history
	this.avatar="";				//Origin A2J - default avatar to use (blank or tan)
	this.language="";				//Origin A2J - language code (default is "en")
	
	this.pages={};			//Origin both - associative array of pages TPage() by page name. E.g., pages["Contents"] = TPage()
	this.constants={};	//Origin CAJA - associative array of contants, MAXINCOME:25000
	this.vars={};			//Origin A2J - associative array of TVariables()
	this.steps=[];			//Origin A2J - array of TStep()
	this.popups=[];		//Origin A2J - array of embedded text popups (these are anonymous unlike CA where they are named)
	this.assets=[];		//Origin CAJA - array of images for preloading.


	this.filename="";
	this.mapids=[];// array of mapids indices	- maps a page.id to page while .pages uses page.name.
	this.sortedPages=[];//array of pages sorted by name (natural order)
	return this;
}

