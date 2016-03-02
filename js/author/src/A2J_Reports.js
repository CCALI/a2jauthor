/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Authoring App Reports

	Generate both full reports of content and translation lists for translators
	06/2014

*/

/* global gGuide, gLogic */

function longProcess(statusPrompt, process) {
  setProgress(statusPrompt, true);

  setTimeout(function() {
    process();
    setProgress('');
  }, 100);
}

// Open report in new window. Include CSS for proper formatting.
function newWindowReport(title, html) {
  var reportWindow = window.open();

  html =
    '<html class="bootstrap-styles reports">' +
      '<head>' +
        '<title>' + title + '</title>' +
        '<link rel="stylesheet" type="text/css" ' +
          'href="../dist/bundles/app-template-styles.less.css">' +
      '</head>' +

      '<body class="CAJAReportDump">' + html +
        '<script>window.less = { async: true };</script>' +
      '</body>' +
    '</html>';

  reportWindow.document.write(html);
  reportWindow.document.close();
}

function textStatisticsReport(text, includeAllStats)
{	// 2014-06-30 Return suitable class to use and information block about text complexity.
	// This is an API wrapper to the https://github.com/cgiffard/TextStatistics.js module.
	// Also suggested is that the text background turn green if grade level < 7, Yellow < 10 and red for >=10.
	// Returns object with {good:bool, css:'class', info:'info'}

	text = gLogic.stripLogicHTML(text);
	var t=textstatistics(text); // Pulled form https://github.com/cgiffard/TextStatistics.js
	// We use fleschKincaidGradeLevel to determine colors.
	var gradeFK = t.fleschKincaidGradeLevel();
	var good = gradeFK < 7;
	var css = (gradeFK < 7 ? 'FleschKincaidUnder7' : (gradeFK<10 ? 'FleschKincaidUnder10' : 'FleschKincaid10OrHigher'));
	var alertClass = (gradeFK < 7 ? 'alert-success' : (gradeFK<10 ? 'alert-warning' : 'alert-danger'));
	var info = '';
	if (!good || includeAllStats===true || gPrefs.FKGradeAll)
	{
		// Doing all stats takes some time, so only do them if we've got a bad F-K grade or we specifically wnat them all.
		info = '<small class=TextStatistics>'
			+	'<a target=_blank href="http://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests">Flesch Kincaid</a> Grade Level: <span class='+css+'>'+gradeFK+'</span>'
			+	' and Reading Ease: '+t.fleschKincaidReadingEase()
			+	'; <a target=_blank href="http://en.wikipedia.org/wiki/Gunning_fog_index">Gunning Fog</a> Score: <span>'+t.gunningFogScore()+'</span>'
			+	'; <a target=_blank href="http://en.wikipedia.org/wiki/SMOG_%28Simple_Measure_Of_Gobbledygook%29">Smog Index</a>: <span>'+t.smogIndex()+'</span>'
			+	'; <a target=_blank href="http://en.wikipedia.org/wiki/Coleman-Liau_Index">Coleman–Liau index</a>: <span>'+t.colemanLiauIndex()+'</span>'
			+	'; Word Count: ' + t.wordCount()
			+	'; Average Words Per Sentence: ' + t.averageWordsPerSentence()
		// Other stats we might use:
		//		automatedReadabilityIndex
			+'</small>';
	}
	return {
		good: gradeFK < 7,
		gradeFK:gradeFK,
		// If good, then we'd display text normally otherwise we might include the stat info for reference.
		css: css,
		alertClass: alertClass,
		info: info
	};
}

function reportFull()
{	// 2016-06-24 Generate full report, ala LessonText.
	longProcess( 'Building report', function ()
	{
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


		function pageLink(pageName) {
			if (pageName && pageName != '' ) {
				return "PAGE_"+pageName;
			}
			else
			{
				return '';
			}
		}
		function anchor(link) {
			if (link!='') {
				return '<a name="'+link+'"></a>';
			}
			else
			{
				return '';
			}
		}
		function jumpAnchor(link,label)
		{
			if (link!='') {
				return '<a class="btn btn-primary" href="#'+link+'">'+label+'</a>';
			}
			else{
				return label;
			}
		}
		function fixHTML4Report(html)
		{
			// All external links, display link URL after.
			// All Popup links, display popup name after and rename link to jump to anchor tag.
			html=html.replace(REG.LINK_POP,function(match,p1,offset,string) // jslint nolike: /\"POPUP:\/\/(([^\"])+)\"/ig
			{
				// HREF="POPUP://MyPopup" becomes HREF="#PAGE_MyPopup"
				var popupid=match.match(REG.LINK_POP2)[1];
				// popupid= htmlEscape(newName);
				return   '"#' + pageLink(popupid) + '"' + 'title="Popup page ' + (popupid) +'"';
			});
			return html;
		}
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
			return '<table class="table CAJAReportDump">'+html+'</table>';
		}
		function fieldSetWrap(legend,html,styleclass) {
			return '<fieldset><legend' + (styleclass?' class='+styleclass:'')+'>'+legend+'</legend>' + html +'</fieldset>';
		}
		function gradeText(text)
		{	// Calc text stats, color based on grade level, show stats if not good.
			if (text!=''){
				var tsr = textStatisticsReport(text,false);
				text = '<div class="grade-text ' + tsr.css+'">' + text  + '</div>' + tsr.info;
			}
			return text;
		}

		var html='';

		// Glom all F-K gradable text.
		var guideGradeText = '';

		// Meta section
		var t = '';


		var stepHTML=[]; // 11/19/2014 Group pages to their steps
		var popHTML= '';
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

		// Variable count
		var vi;
		var varCnt=0;
		for (vi in guide.vars){
			varCnt++;
		}
		t += tuple('Variables:',  varCnt + ' ' + jumpAnchor('VARS','Variables list'));

		t += tuple('Starting Page:',  jumpAnchor(pageLink( guide.firstPage),guide.firstPage)  );
		t += tuple('Exit Page:',    jumpAnchor(pageLink( guide.exitPage),guide.exitPage)  );
		var ts='';
		for (var si in guide.steps)
		{
			step = guide.steps[si];
			ts+= tuple('Step "'+step.number+'":',  jumpAnchor('STEP'+si, step.text),'bg-step'+parseInt(si));
			stepHTML[si] = '';
		}
		t += tuple('Steps',fieldSetWrap('Interview Steps',tableWrap(ts)));
		t += tuple('Popups',jumpAnchor('POPUPS','Popup pages'),'');
		html += fieldSetWrap('Interview Information',tableWrap(t));

		// Variable list
		t = guide.variableListHTML();
		html += anchor('VARS')+fieldSetWrap('Interview Variables',t);


		// Steps section
		t = '';
		// Pages section
		var p;
		for (p in guide.sortedPages)
		{
			page=guide.sortedPages[p];
			si = page.step;
			t =  ''
			if (page.type === CONST.ptPopup) {
				t += (tuple('Text',	gradeText(fixHTML4Report(page.text))));
				guideGradeText += ' ' + page.text;
				popHTML +=anchor( pageLink(page.name)) + fieldSetWrap('Popup Page '+ page.name, tableWrap(t) , 'Step0');
			}
			else
			{
				t += tuple('Step',	guide.stepDisplayName(si)); //steps[si].number+':'+guide.steps[si].text);
				guideGradeText += ' ' + page.text;
				t += (tuple('Text',	gradeText(fixHTML4Report(page.text))));
				t += (tupleAuto('Text audio',	page.textAudioURL));
				t += (tupleAuto('Learn prompt',	page.learn));
				guideGradeText += ' ' + page.help;
				t += (tupleAuto('Help',	 gradeText(fixHTML4Report(page.help))));
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
					fft += tuple('Label',fixHTML4Report(field.label));
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
				var bi;
				for (bi in page.buttons)
				{
					button = page.buttons[bi];
					bt += tuples('TD', [ button.label, jumpAnchor(pageLink( button.next),button.next),button.name,button.value]);
				}
				t += tuple('Buttons',tableWrap(bt));

				t += tupleAuto('Logic After',	page.codeAfter);
				stepHTML[si] += anchor( pageLink(page.name)) + fieldSetWrap('Page '+ page.name, tableWrap(t) , 'Step'+parseInt(si));
			}
		}
		for (var si in guide.steps)
		{
			step = guide.steps[si];
			if (stepHTML[si]=='') {
				stepHTML[si]='No pages for this step';
			}
			html += anchor('STEP'+si)+'<div class="step-wrapper step-step'+ step.number+'"><h2 class="heading-step">Step '+ step.number+' ' + step.text + '</h2>' +  stepHTML[si]+'</div>';
		}
		if (popHTML=='') {
			popHTML = 'No popups in this interview';
		}
		html += anchor('POPUPS') + '<h2>Popups</h2>' + popHTML+'<hr />';

		var tsr = textStatisticsReport(guideGradeText,true);
		guideGradeText = '<div class="GradeReport ' + tsr.css+'"><div class="alert '+tsr.alertClass+'">The F-K Grade for all questions and help in this interview is '+tsr.gradeFK
			+' (< 7 is Good)</div>'
			+  tsr.info + '</div>';
		html +=  fieldSetWrap('Text Statistics', guideGradeText );
		html = '<h1>Full Report for ' + gGuide.title+'</h1>'+html;
		newWindowReport(gGuide.title +' - Full Report - A2J 5 Author',html);
		//$('.tabContent','#tabsReport').html(html);
	});
}

function reportTranscript()
{	//  2016-06-24 List all text blocks for translation.
	/** @type {TGuide} */
	var guide = gGuide;
	/** @type {TPage} */
	var page;
	/** @type {TStep} */
	//var step;
	/** @type {TAuthor} */
	//var author;
	/** @type {TField} */
	var field;
	/** @type {TButton} */
	//var button;

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
	var p;
	for (p in guide.sortedPages)
	{	// Spreadsheet format: page name, chunk/field, text
		page=guide.sortedPages[p];
		sub=0;
		pnum ++;
		var name = guide.pageDisplayName(page.name);
		//var si = page.step;
		if (page.type === CONST.ptPopup) {
			html+= tuples('TD',[pnum,name,'Popup Text',page.text]);
		}
		else{
			html+= tuples('TD',[pnum,name,'Page Text',page.text]);
			if (page.help!='') {
				phcnt++;
				sub++;
				html += tuples('TD',[pnum+'.'+sub ,PH,'Page Help',page.help]);
			}
		}
		for (var fi in page.fields)
		{
			sub++;
			field = page.fields[fi];
			html += tuples('TD',[pnum+'.'+sub ,PH, 'Field Prompt <br>'+field.label+' ('+field.type+')',field.invalidPrompt]);
		}
	}

	html = '<h1>Audio Transcripts for ' + gGuide.title+'</h1>'
		+'<ul>'
			+'<li>Number of pages: '+pnum
			+'<li>Number of page helps: '+phcnt
			+'<li>Number of field prompts: '+ fpcnt
		+'</ul>'
		+'<table class="table CAJAReportDump CAJATranscriptDump">'+html+'</table>';

	newWindowReport( gGuide.title +' - Transcript Report - A2J 5 Author' ,html);
	//	$('.tabContent','#tabsReport').html(html);
}

/* */
