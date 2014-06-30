/*******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Authoring App Reports
	06/2014
	
******************************************************************************/

/* global gGuide */

function reportFull()
{	// 2016-06-24 Generate full report, ala LessonText. 
	/** @type {TGuide} */
	var guide = gGuide;
	/** @type {TPage} */
	var page;
	/** @type {TStep} */
	var step;
	/** @type {TAuthor} */
	var author;
	/** @type {TField} */
	var field;
	/** @type {TButton} */
	var button;
	
	
	function tuple(label,value,styleclass)
	{	// return table row columns
		return '<tr' + (styleclass?' class='+styleclass:'')+'><td>' + label + '</td><td>' + value + '&nbsp;</td></tr>';
	}
	function tupleAuto(label,value)
	{	// return table row columns but only if data present.
		if (!isBlankOrNull(value)) {
			return tuple(label,value);
		}
		else{
			return '';
		}
	}
	function tuples(colType,colsArray)
	{
		var t='';
		for (var c in colsArray)
		{
			t += '<'+colType+'>' + colsArray[c] + '</'+colType+'>';
		}
		return '<tr>' + t + '</tr>';
	}
	function tableWrap(html){
		return '<table class="CAJAReportDump">'+html+'</table>';
	}
	function fieldSetWrap(legend,html,styleclass) {
		return '<fieldset><legend' + (styleclass?' class='+styleclass:'')+'>'+legend+'</legend>' + html +'</fieldset>';
	}
	
	var html='';
	
	// Meta section
	var t = '';
	t += (tuple('Current Version:',  guide.version));
	t += (tuple('Title:',  guide.title));
	t += (tupleAuto('Description:',  guide.description));
	t += (tupleAuto('Jurisdiction:',  guide.jurisdiction));
	t += (tupleAuto('Language:',  guide.language));
	t += (tupleAuto('Avatar:',  guide.avatar));
	t += (tupleAuto('Guide Gender:',  guide.guideGender));
	t += (tupleAuto('Credits:',  guide.credits));
	t += (tupleAuto('Email contact:',  guide.email));
	t += (tupleAuto('Approximate Completion Time:',  guide.completionTime));
	t += (tupleAuto('Logo graphic:',  guide.logoImage));
	t += (tupleAuto('End graphic:',  guide.endImage));
	t += (tupleAuto('Mobile friendly?',  guide.mobileFriendly));
	var ta = tuples('TH',['Name','Title','Organization','email']);
	for (var ai in guide.authors)
	{
		author = guide.authors[ai];
		ta += tuples('TD',[ author.name, author.title,  author.organization,author.email]);
	}
	t += tupleAuto('Authors',tableWrap(ta));
	t += tupleAuto('Revision Notes:',  guide.notes); 
	html += fieldSetWrap('Interview Information',tableWrap(t));
	
	t = '';	
	html += fieldSetWrap('Interview Variables',t);
	
	// Steps section
	t = '';	
	t += tuple('Starting Page:',  guide.firstPage);
	t += tuple('Exit Page:',  guide.exitPage);
	for (var si in guide.steps)
	{
		step = guide.steps[si];
		t += tuple('Step "'+step.number+'":',  step.text,'Step'+parseInt(si));
	}
	html +=  fieldSetWrap('Interview Steps',tableWrap(t));
	
	// Pages section
	for (p in guide.sortedPages)
	{
		page=guide.sortedPages[p];
		var si = page.step;
		html +=  '<a name="'+p+'"/>';
		t = '';
		t += tuple('Step',	guide.stepDisplayName(si)); //steps[si].number+':'+guide.steps[si].text);
		t += (tuple('Text',	page.text));
		t += (tupleAuto('Text audio',	page.textAudioURL));
		t += (tupleAuto('Learn prompt',	page.learn));
		t += (tupleAuto('Help',	page.help));
		t += (tupleAuto('Help audio',	page.helpAudioURL));
		t += (tupleAuto('Help reader',	page.helpReader));
		t += (tupleAuto('Help image',	page.helpImageURL));
		t += (tupleAuto('Help video',	page.helpVideoURL));
		t += (tupleAuto('Variable Repeater',	page.repeatVar));
		t += (tupleAuto('Notes',	page.notes));
		
		var ft='';
		for (var fi in page.fields) {
			field = page.fields[fi];
			var fft = '';
			fft += tuple('Type',	field.type);
			fft += tuple('Label',field.label);
			fft += tupleAuto('Name',	field.name);
			fft += tupleAuto('Invalid Prompt',field.invalidPrompt);
			fft += tupleAuto('Invalid Prompt audio',field.invalidPromptAudio);
			fft += tupleAuto('Min',	field.min);
			fft += tupleAuto('Max',	field.max);
			fft += tupleAuto('Max chars',	field.maxChars);
			fft += tupleAuto('List', decodeEntities(	field.listData));
			fft += tupleAuto('List',field.listSrc);
			ft+= tuple('Field#'+(parseInt(fi)+1),tableWrap(fft));
		}
		t+= tuple('Fields',tableWrap(ft));
		
		t += (tupleAuto('Logic Before',	page.codeBefore));
		var bt=tuples('TH',[ 'Label','Next page','Variable Name','Default Value']);
		for (bi in page.buttons)
		{
			button = page.buttons[bi];
			bt += tuples('TD', [ button.label,button.next,button.name,button.value]);
		}
		t += tuple('Buttons',tableWrap(bt)); 

			
		t += tupleAuto('Logic After',	page.codeAfter);
			
		html +=  fieldSetWrap('Page '+ page.name, tableWrap(t) , 'Step'+parseInt(si));
	}
	
	$('.tabContent','#tabsReport').html(
		'<h1>Full Report for ' + gGuide.title+'</h1>'
		+html );
}

function reportTranscript()
{	//  2016-06-24 List all text blocks for translation. 
	/** @type {TGuide} */
	var guide = gGuide;
	/** @type {TPage} */
	var page;
	/** @type {TStep} */
	var step;
	/** @type {TAuthor} */
	var author;
	/** @type {TField} */
	var field;
	/** @type {TButton} */
	var button;
	
	var html = '';
	
	function tuples(colType,colsArray)
	{
		var t='';
		for (var c in colsArray)
		{
			t += '<'+colType+'>' + colsArray[c] + '</'+colType+'>';
		}
		return '<tr>' + t + '</tr>';
	}
	
	html += tuples('TH',['#','Page','Section','Text']);
	var pnum=0;
	var phcnt=0;
	var fpcnt=0;
	var PH='&nbsp;';
	// Pages section
	for (p in guide.sortedPages)
	{	// Spreadsheet format: page name, chunk/field, text 
		page=guide.sortedPages[p];
		pnum ++;
		var name = guide.pageDisplayName(page.name);
		//var si = page.step;
		if (page.type == CONST.ptPopup) {
			html+= tuples('TD',[pnum,name,'Popup Text',page.text]);
		}
		else{
			html+= tuples('TD',[pnum,name,'Page Text',page.text]);
			if (page.help!='') {
				phcnt++;
				html += tuples('TD',[PH ,PH,'Page Help',page.help]);
			}
		}
		for (var fi in page.fields)
		{
			fpcnt++;
			field = page.fields[fi];
			html += tuples('TD',[PH ,PH, 'Field Prompt <br>'+field.label+' ('+field.type+')',field.invalidPrompt]);
		}
	}
	
	$('.tabContent','#tabsReport').html(
		'<h1>Audio Transcripts for ' + gGuide.title+'</h1>'
		+'<ul>'
			+'<li>Number of pages: '+pnum
			+'<li>Number of page helps: '+phcnt
			+'<li>Number of field prompts: '+ fpcnt
		+'</ul>'
		+'<table class="CAJAReportDump CAJATranscriptDump">'+html+'</table>' );
}

/* */
