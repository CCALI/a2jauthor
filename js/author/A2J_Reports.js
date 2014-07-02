/*******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Authoring App Reports
	06/2014
	
******************************************************************************/

/* global gGuide */

function textStatisticsReport(text)
{	// 2014-06-30 Return suitable class to use and information block about text complexity.
	// This is an API wrapper to the https://github.com/cgiffard/TextStatistics.js module.
	// Also suggested is that the text background turn green if grade level < 7, Yellow < 10 and red for >=10. 
	// Returns object with {good:bool, css:'class', info:'info'}
	
	var t=textstatistics(text); // Pulled form https://github.com/cgiffard/TextStatistics.js
	// We use fleschKincaidGradeLevel to determine colors.
	var gradeFK = t.fleschKincaidGradeLevel();
	var css = (gradeFK < 7 ? 'FleschKincaidUnder7' : (gradeFK<10 ? 'FleschKincaidUnder10' : 'FleschKincaid10OrHigher'));
	return {
		gradeFK:gradeFK,
		// If good, then we'd display text normally otherwise we might include the stat info for reference.
		good: gradeFK < 7,
		css: css,
		// Statistics summary data
		info:
			'<div class=TextStatistics>'
			+	'  <a target=_blank href="http://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests">Flesch Kincaid</a> Grade Level: <span class='+css+'>'+gradeFK+'</span>'
			+	' and Reading Ease: '+t.fleschKincaidReadingEase()
			+	'; <a target=_blank href="http://en.wikipedia.org/wiki/Gunning_fog_index">Gunning Fog</a> Score: <span>'+t.gunningFogScore()+'</span>'
			+	'; <a target=_blank href="http://en.wikipedia.org/wiki/SMOG_%28Simple_Measure_Of_Gobbledygook%29">Smog Index</a>: <span>'+t.smogIndex()+'</span>'
			+	'; <a target=_blank href="http://en.wikipedia.org/wiki/Coleman-Liau_Index">Coleman–Liau index</a>: <span>'+t.colemanLiauIndex()+'</span>'
			+	'; Word Count: ' + t.wordCount()
			+	'; Average Words Per Sentence: ' + t.averageWordsPerSentence()
			+'</div>'
		// Other stats we might use:
		//		automatedReadabilityIndex
	};
}


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
	function gradeText(text)
	{	// Calc text stats, color based on grade level, show stats if not good.
		if (text!=''){
			var tsr = textStatisticsReport(text);
			text = '<div class="TextStatistics ' + tsr.css+'">' + text  + '</div>';
			if (!tsr.good) {
				text +=   tsr.info ;
			}
		}
		return text;
	}
	
	var html='';
	
	// Glom all F-K gradable text. 
	var guideGradeText = '';
	
	// Meta section
	var t = '';
	
	
	//var tr = textStatisticsReport('Enabling the Script panel causes a Firefox slow-down due to a platform bug. This will be fixed with the next major Firefox and Firebug versions.');
	//t= 'Stats: <blockquote>' + tr.text  + '</blockquote><center>'+tr.css+'; '+tr.info+'</center>';
	
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
		guideGradeText += ' ' + page.text;
		t += (tuple('Text',	gradeText(page.text)));
		t += (tupleAuto('Text audio',	page.textAudioURL));
		t += (tupleAuto('Learn prompt',	page.learn));
		guideGradeText += ' ' + page.help;
		t += (tupleAuto('Help',	 gradeText(page.help)));
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
			guideGradeText += ' ' + field.invalidPrompt;
			fft += tupleAuto('Invalid Prompt',gradeText(field.invalidPrompt));
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
	
	
	var tsr = textStatisticsReport(guideGradeText);
	guideGradeText = '<div class="GradeReport ' + tsr.css+'">F-K Grade is '+tsr.gradeFK
		+' (< 7 is Good)'
		+  tsr.info + '</div>';
	html +=  fieldSetWrap('Text Statistics', guideGradeText );
	
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
