// 07/14/2012 Language file for the authoring tool 

// ### Global Variable ###
var lang={regional:[]}; 

lang.set=function(languageID)
{
	if (languageID=='') languageID='en';
	trace("Set language to "+languageID);
	var e;
	var langset = this.regional[languageID];
	for (e in langset){
		lang[e]=""+langset[e];
		//trace(e+"="+lang[e]);
	}
}
lang.en=function(txt)
{	// needs translation
	return txt;
}

// English
lang.regional['en']= {
	locale:'en',
	// Tab names
	tabAbout:'About',
	tabInterview:'Interview',
	tabVariables:'Variables',
	tabConstants:'Constants',
	tabSteps:'Steps',
	// Edit Interview labels
	eiTitle:'Title',
	eiDescription:'Description',
	eoOutline:"Outline",
	eiJurisdiction:'Jurisdiction',
	eiAuthor:'Author',
	eiLogoGraphic:'Logo graphic',
	// Question branching types
	qIDNOWHERE:"[no where]",
	qIDSUCCESS:"[Success - Process Form]",
	qIDFAIL : "[Exit - User does not qualify]",
	qIDEXIT : "[Exit - Save Incomplete Form]",
	qIDBACK : "[Back to prior question]",
	qIDRESUME : "[Exit - Resume interview]",
	// Unknown ID
	UnknownID : "[Unknown id [{1}]: [{2}",
	
	scriptErrorMissingPage :'Page "{1}" does not exist.',
	scriptErrorUnhandled : 'Unknown command: {1}',
	scriptErrorEndMissing : 'Missing an EndIf',

	app:''
};

//lang.set('');


$(document).ready(function () {
	;
});
