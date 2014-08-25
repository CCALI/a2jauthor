/******************************************************************************
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	A2J Viewer embedding
	10/12/2012
	05/2014

	Required by Author and Viewers
******************************************************************************/

// Elements: navbar, road step area, question, guide avatar, user avatar, learn more prompt, learn more bubble.
//var gLogic;

var alertCounter=0;

function versionString()
{
	return "Access to Justice Viewer/Author Version "+ CONST.A2JVersionNum+"("+CONST.A2JVersionDate+")";
}


function traceAlert(html)
{	// 2014-05-27 Print error message into viewer space.
	// These are errors that an author might need to deal with such as variables too long or script syntax error.
	// Displayed publicly so users will be alerted that something bad is happening. The logic tracer may be hidden
	// to users so logging only there may hide a defect.
	// Since there may be more than one error, dump them into a scrollable list. 
	var div = $('<div class="ui-widget"><div style="padding: 0 .7em;" class="ui-state-error ui-corner-all"><p><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-alert"></span>'+html+'<button/></div></div>');
	$('button',div).button({label:'x'}).click(function()
	{	// When closing an alert note, remove it, reduce counter, hide if counter back to 0. 
		$(this).parentsUntil('.ui-widget').remove();
		$('.alertCounter').text( --alertCounter );
		$('.alertPanel,.alertCounter').toggle(alertCounter>0);
	});
	$('.alertPanel').append(div);
	$('.alertCounter').text( ++alertCounter ).show();	
	$('.alertPanel').toggle(alertCounter>0);
	if(1) {
		trace(String(html).stripHTML());
	}
}

var A2JViewer={

	IMG : "images/",

	filterVariables : function ()
	{	// Apply user's filter to show only variable/values with match name or value.
		var filter = $('#viewer-var-filter').val().toUpperCase();
		$('.A2JVars tbody tr').each(function(){
			$(this).toggle($(this).text().toUpperCase().indexOf(filter)>=0);
		});
	},
	
	
	refreshVariables : function ( )
	{	// Update the variables table with latest values
		var $t=$('.varvalpanel');
		
		if ($t.length==0) {
			return;
		}
		
		/** @type {TGuide} */
		var g = gGuide;
		/** @type {TVariable} */
		var v;
		var th=html.rowheading(["Name",'Loop',"Value"]); 
		var sortvars=[];
		// List of variables *including* array element values such as child name#1, child name#2, etc.
		var vn;
		for (vn in g.vars){
			if (g.vars.hasOwnProperty(vn))
			{
				v = g.vars[vn];
				if (v.repeating) {
					for (var i=1;i<v.values.length;i++){
						sortvars.push({name:v.name+"#"+i,v:v,i:i});
					}
				}
				else{
					sortvars.push({name:v.name,v:v,i:1});				
				} 
			}
		}
		sortvars.sort(function (a,b){
			// 2014-06-16 Sort variables 'natural'
			return sortingNaturalCompare(a.name,b.name);
			 /*a.name.toLowerCase()>b.name.toLowerCase();*/
			});
		
		var tb='';
		for (var vi=0;vi<sortvars.length;vi++)
		{
			var sv=sortvars[vi];
			v=sv.v;
			var val = htmlEscape(makestr(v.values[sv.i]));
			if (v.repeating ) {
				tb+=html.row([v.name,'#'+(sv.i),val]);
				}
			else{
				tb+=html.row([v.name,'',val]);
			}
		}
	
		$t.html('').append('<table class="A2JVars">'+th + '<tbody>'+ tb + '</tbody>'+"</table>");
		$('tr',$t).click(function(){
			//$("#dialog-form-var-val-edit" ).dialog( "open" );
		});
		A2JViewer.filterVariables();
	},
	
	fillSample: function()
	{	// Populate fields with 'sample' values, if specified or applicable.
		var page = gPage;
		for (var fi=0;fi<page.fields.length;fi++)
		{
			var f = page.fields[fi];// field record
			var fid = "FID_"+fi;//field id - unique
			var sample = f.sample;
			switch (f.type)
			{
				case CONST.ftText://"Text"
				case CONST.ftTextLong://"Text (Long)"
				case CONST.ftTextPick://"Text (Pick from list)"
				case CONST.ftNumber://"Number"
				case CONST.ftNumberDollar://"Number Dollar"
				case CONST.ftNumberSSN://"Number SSN"
				case CONST.ftNumberPhone://"Number Phone"
				case CONST.ftNumberZIP://"Number ZIP Code"
				case CONST.ftNumberPick://"Number (Pick from list)"
				case CONST.ftDateMDY://"Date MM/DD/YYYY"
				   $('#'+fid).val(sample);
				   break;
				
				case CONST.ftGender://"Gender"
				case CONST.ftRadioButton://"Radio Button"
				case CONST.ftCheckBox://"Check box"
				case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)
					// Sample data not used.
					break;
			}
		}
	},
	
	history:[], // Array of {title,pagename}
	skipHistory: false,
	
	infiniteLoopCounter: 0, // Counts GOTO Pages without an interaction. If we hit too many, probable infinite loop. 
	infiniteLoopCounterMax: 100,
	
	/** @param {TPage} page  */
	layoutPage:function(div,page)
	{	// Layout page into interactive viewer. attach event handlers.
	
		if (div.html()==="")
		{	// First time rendering, attach handlers. Only executed once.
			var watermark = (  (String(window.location).indexOf('.a2jauthor.org') < 0) ? '' : '<div class="demoWatermark">For demonstration and testing purposes only. Not intended for use by the public. This A2J Guided Interview will not generate a form.</div>');
			div.html(
						'<div class="interact"></div>'
						+'<div class="a2jbtn"></div> '
						+'<ul class="NavBar">'
						
						+' <li><button class="navBack">'+lang.GoBack+'</button></li>'
						+' <li><button class="navNext">'+lang.GoNext+'</button></li>'
						+' <li><div class="ui-widget">'+lang.MyProgress	+ ': <select  id="history"></select>'+ '</div></li>'
						//+'<li class="right size2"><a href="#">A+</a></li> <li class="right size1"><a href="#">A-</a></li> '
						+'<li class="right"><button class="navFeedback">Feedback</button></li>'
						+'<li class="right"><button class="navSaveAndExit">Save &amp; Exit</button></li>'
						+'<li class="right"><button class="navResumeExit">Resume</button></li>'
						//+'<li class="right"><a href="#">Exit</a></li> <li class="right"><a href="#">Save</a></li> '
						+'</ul>'
			+'<div class="notice">'
				//+'<div class="alertPanel"></div> '
/*				+'<div class="license"><p ><span class="SJILogo"/>This program was developed under grants from the State Justice Institute (SJI grant number SJI-04-N-121), Center for Access to the Courts through Technology; Chicago Kent College of Law, Center for Computer-Assisted Legal Instruction (CALI), and Legal Services Corporation (LSC).  The points of view expressed are those of the authors and do not necessarily represent the official position or policies of the SJI, Center for Access to the Courts through Technology, Chicago-Kent, CALI, or the LSC.</p><p>&quot;A2J Author&quot; and &quot;A2J Guided Interviews&quot; are federally registered trademarks of Illinois Institute of Technology, Chicago Kent College of Law &amp; Center for Computer-Assisted Legal Instruction.  Any use of either mark must include the full name of the mark, along with the registration circle - ®.  Use of either mark on your webpage, or in any publications, presentations or materials must also prominently display the following sentence, &quot;[insert mark name here]® is a US federally registered trademark owned by Illinois Institute of Technology, Chicago Kent College of Law &amp; Center for Computer-Assisted Legal Instruction. &lt;www.a2jauthor.org&gt; </p></div>'*/
				+'<div class="copyright">'
					+'<span class="viewerenv">'+gEnv+' '+CONST.A2JVersionNum+" ("+CONST.A2JVersionDate+') </span>'
					+'© 2000-2014 Illinois Institute of Technology - Chicago-Kent College of Law and the Center for Computer-Assisted Legal Instruction'
				+'</div>'
			+'</div>'
			+ watermark
			);
			//<img src="images/SJILogo.gif" width="90" height="55" hspace="3" vspace="3" align="left" />
			
			$('div.a2jbtn',div).attr('title',versionString()).click(function()
			{
				$(div).toggleClass('test',500);//$('.A2JViewer')
			});
			
			$('.alertCounter').hide().click(function(){$('.alertPanel').slideToggle();});
	
			//$( ".NavBar" ).menu({position:{my:'left top',at:'left bottom'}});
			
			//### Variable debugging
			$('#viewer-var-form').append('<div class="relative"><button id="uploadAnswer"></button><input type="file" id="uploadAnswerFileInput"> <button id="downloadAnswer"></button><button id="refreshAnswer"></button>'
												  +'<button id="clearAnswer"></button>'
												  +'<label for="viewer-var-filter">Filter:</label><input type=text id="viewer-var-filter" size="5"/>'
												  +'</div>'
												  +'<div class=varvalpanel></div></div>');
			$('#downloadAnswer').button({label:'Save',icons:{primary:'ui-icon-disk'}}).click(function(){
				// Download answer file directly from client to desktop.
				downloadTextFile ( gGuide.HotDocsAnswerSetXML(),  'answer.anx');
			});
			$('#refreshAnswer').button({label:'Refresh',icons:{primary:'ui-icon-arrowrefresh-1-w' } } ).click(function(){
				A2JViewer.refreshVariables();
			});				
			$('#clearAnswer').button({label:'Clear',icons:{primary:'ui-icon-trash'}}).click(function(){
				gGuide.varClearAll();
				A2JViewer.refreshVariables();
			});			
			$('#clearTrace').button({label:'Clear',icons:{primary:'ui-icon-trash'}}).click(function(){
				$('#tracer').empty();
			});
			$('#uploadAnswer').button({label:'Open',icons:{primary:'ui-icon-folder-open'}});
			$('#uploadAnswerFileInput').on('change',function()			
			{	// Browse for answer file on local desktop to upload to client (no server).
				var file = $('#uploadAnswerFileInput')[0].files[0];
				var textType = /text.*/;
				setProgress("Loading..."); 
				if (file.type==='' || file.type.match(textType))
				{
					var reader = new FileReader();
					reader.onload = function(e)
					{
						var data = jQuery.parseXML(reader.result);
						gGuide.HotDocsAnswerSetFromXML($(data));
						setProgress('');
						A2JViewer.refreshVariables();
					};
					reader.readAsText(file);	
				} 
				else
				{
					setProgress("File not supported!"); 
				}
			});
			
			$('#viewer-var-filter').keyup(A2JViewer.filterVariables);
			
			// Navigation
			$('#history').change(function(){
				// Handle history navigation from drop down.
				A2JViewer.skipHistory=true;
				gotoPageView($(this).val());
			});
			$('button.navBack',div).button({label:  lang.GoBack,icons:{primary:'ui-icon-circle-triangle-w'},disabled:true}).click(function(){
				A2JViewer.goBack();
			});
			$('button.navNext',div).button({label:  lang.GoNext,icons:{primary:'ui-icon-circle-triangle-e'},disabled:true}).click(function(){
				//trace('navNext');
				$('#history').prop('selectedIndex',$('#history').prop('selectedIndex')-1);
				A2JViewer.skipHistory=true;
				gotoPageView($('#history').val());
			});
			$('button.navFeedback',div).button({label:  lang.SendFeedback,icons:{primary:'ui-icon-comment'},disabled:0}).click(function(){
				//trace('navFeedback');
				traceAlert('navFeedback not implemented');
			});
			$('button.navSaveAndExit',div).button({label:  lang.SaveAndExit,icons:{primary:'ui-icon-disk'},disabled:0}).click(function(){
				A2JViewer.goSaveExit();
			});
			$('button.navResumeExit',div).button({label:  lang.ResumeExit,icons:{primary:'ui-icon-arrowreturnthick-1-w'}}).click(function(){
				A2JViewer.goExitResume();
			});
		
			if (typeof authorViewerHook !== 'undefined'){
				authorViewerHook();
			}
			else
			{
				$('.license',div).hide();//delay(5000).slideUp( );
				$('.copyright',div).click(function(){
					$('.license').toggle();
				});//,function(){$('.license').slideUp()});
			}
		}
		traceLogic( 'Page ' + traceTag('page', page.name));
		A2JViewer.infiniteLoopCounter++;
		
		gLogic.GOTOPAGE='';
		if (makestr(page.codeBefore)!=='')
		{
			traceLogic(traceTag('info','Logic Before Question'));
			gLogic.executeScript(page.codeBefore);
			// Code returns immediately after a GOTO PAGE call. Check to see if our page changed.
			if (gLogic.GOTOPAGE!=='' && gLogic.GOTOPAGE!==gPage.name)
			{
				if (A2JViewer.infiniteLoopCounter< A2JViewer.infiniteLoopCounterMax )
				{	// Jump to next page without displaying this page. 
					gotoPageView(gLogic.GOTOPAGE);
					return;
				}
				else
				{	// Break out if we are in infinite loop
					var msg='Possible infinite loop. Too many page jumps without user interaction';
					traceAlert(msg);
					traceLogic(traceTag('info',msg));
				}
			}
			else
			{
				traceLogic(traceTag('info','Asking Question'));				
			}
		}
		
		// Displaying the question. Set our infiniteLoopCounter to 0
		A2JViewer.infiniteLoopCounter=0;
		
		
		function prepHTML(htmlText)
		{	// Take question text, learn text, popup text HTML and parse for logic blocks.
			// Ensure hyperlinks target separate windows.
			// TODO strip put any bad tags
			htmlText = gLogic.evalLogicHTML( htmlText ).html;
			var htmDiv = $('<div>'+htmlText+'</div>');
			$('a',htmDiv).each(function(){
				$(this).attr('TARGET','_BLANK');
			});
			htmlText = htmDiv.html();
			//trace(htmlText);
			return  htmlText;
		}
	
		
		var curstep = page.step;
		var questionHTML = prepHTML( page.text );
		var learnHTML = page.learn; // Learn more prompt (optional)
		var helpHTML =  prepHTML( page.help); // Help popup (optional)
		// ### Save quesetion to history (my progress)
		// ### e.g., <li><a href="#"><span class="ui-icon ui-icon-document"></span>Question 1<div>Should you use this form?</div></a></li>
		if (!A2JViewer.skipHistory)
		{
			//trace('Save in history');
			var opt='<option value="'+ page.name.asHTML() +'">'+ String(questionHTML).stripHTML().ellipsis(40) +'</option>';
			//var opt = '<li><a href="#"><span class="ui-icon ui-icon-document"></span>'+  page.name.asHTML() +'<div>'+ String(questionHTML).stripHTML().ellipsis(40)+'</div></a></li>';
			$('#history').prepend(opt).prop('selectedIndex',0);
		}
		A2JViewer.updateNavigationButtons();
		
		
		A2JViewer.skipHistory=false;
		
		
		$('.interact',div).html(A2JViewer.layoutStep(curstep));
		
		$('.ui-form.question',div).html(questionHTML+'<div class="form"></div>');
		
		// Add audio player elements to question and help panels.
		$('.question.panel',div).append('<div class="audio"></div><div class="buttonlist"></div>');
		if (page.textAudioURL!=='')
		{
			$('.question .audio',div).html(audioPlayerHTML(page.textAudioURL));
		}
		
		for (var bi=0;bi<page.buttons.length;bi++)
		{
			/** @type {TButton} */
			var b = page.buttons[bi];
			//$('.ui-form.question  .buttonlist',div).
			$('.question.panel > .buttonlist',div).append(
				'<button num='+bi+' title="Go to page '+gGuide.pageDisplayName(b.next).asHTML()+'">'
				+( b.label==='' ? lang.Continue : b.label)
				+'</button>');
		}
		
		// ### FieldSet to attach custom fields.
		var fs=$('.ui-form.question .form',div);
	
		// varIndex is null or an array index number.
		var varIndex=null;
		if (page.repeatVar!==''){
			// If a repeat var is defined, all field variables will be treated as array with repeatVar as the index.
			varIndex = textToNumber(gGuide.varGet(page.repeatVar));
		}
		for (var fi=0;fi<page.fields.length;fi++)
		{			
			/** @type {TField} */
			var f = page.fields[fi];// field record
			/*
				this.type ="";
				this.label ="";
				this.name ="";//reference TVar.name
				this.required =false;
				this.invalidPrompt ="";
				this.order ="";//default, ASC, DESC
				this.min="";
				this.max="";
				this.calendar=false;
				this.calculator=false;
				this.maxChars="";
			*/
			
			var fid = "FID_"+fi;//field id - unique
			var fname = "FID_"+f.name;//field name - possible duplicates, i.e., radio buttons


			var defval=gGuide.varGet(f.name,varIndex);
			var label = gLogic.evalLogicHTML(f.label).html;
			var $label=$('<label/>').attr('for',fid).html(label);
			var $input=null;
			var $labelinput=null;
			switch (f.type)
			{
				case CONST.ftText://"Text"
				   $input=($('<input type=text class=text id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftTextLong://"Text (Long)"
				   $input=($('<textarea type=text class=textarea id='+fid+'></textarea>').val(defval));
				   break;
				case CONST.ftTextPick://"Text (Pick from list)"
				   $input=($('<select id='+fid+'></select>').val(defval));
					if (f.listSrc!==""){
						loadXMLListExternal({elt:$input,url:f.listSrc,val:defval});
					}
					else{
						loadXMLList({elt:$input,data:'<select>'+f.listData+'</select>',val:defval});
					}
				   break;
				
				case CONST.ftNumber://"Number"
				    $input=($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				
				case CONST.ftNumberDollar://"Number Dollar"
				   $input=($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				
				case CONST.ftNumberSSN://"Number SSN"
				   $input=($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				
				case CONST.ftNumberPhone://"Number Phone"
				   $input=($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				
				case CONST.ftNumberZIP://"Number ZIP Code"
				   $input=($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				
				case CONST.ftNumberPick://"Number (Pick from list)"
				   //$input=($('<input type=text id='+fid+'></input>').val(defval));
					
				   $input=($('<select id='+fid+'></select>').val(defval));
					var listData='';
					var o;
					for (o=f.min;o<=Math.min(f.max,f.min+2000);o++)
					{
						listData += '<option value="'+o+'">'+o+'</option>';
					}
					loadXMLList({elt:$input,data:'<select>'+listData+'</select>',val:defval});
					
				   break;
				
				case CONST.ftDateMDY://"Date MM/DD/YYYY"
				   $input=($('<input type=text id='+fid+'></input>').val(defval));
					//trace(CONST.ftDateMDY,gGuide.language);
					var dateOpts = {
						changeMonth: true,
						changeYear: true
					};
					var minYear=1900;
					var maxYear=2050;
					if (!isBlankOrNull(f.min)) {
						dateOpts.minDate = mdy2jsDate(f.min);
						minYear = dateOpts.minDate.getFullYear();
					}
					if (!isBlankOrNull(f.max)) {
						dateOpts.maxDate = mdy2jsDate(f.max);
						maxYear = dateOpts.maxDate.getFullYear();
					}
					// 2014-06-16 Override year jQuery ui pick list to show entire valid range.
					dateOpts.yearRange=minYear  +':' + maxYear;
					
					$.datepicker.setDefaults($.datepicker.regional[ gGuide.language ]);
					// 3/21/2014 Format dates for any language in USA m/d/y format. 
					dateOpts.dateFormat = 'mm/dd/yy';
					$input.datepicker( dateOpts);
					$('#ui-datepicker-div').addClass('bubble');
				   break;
				
				case CONST.ftGender://"Gender"
					var fidM=fid+"M";
					var fidF=fid+"F";
					var g = gGuide.goodGender(defval);
				   $input=$('<div/>')
						.append($('<input type=radio id="'+fidM+'" name="'+fname+'"></input>').prop('checked',g==='M')).append($('<label/>').attr('for',fidM).html(lang.Male))
						.append('<br/>')
						.append($('<input type=radio id="'+fidF+'" name="'+fname+'"></input>').prop('checked',g==='F')).append($('<label/>').attr('for',fidF).html(lang.Female));
				   break;
				
				case CONST.ftRadioButton://"Radio Button"
				   $labelinput=($('<input type=radio id="'+fid+'" name="'+fname+'" value="'+f.value+'"></input>')).prop('checked',defval===f.value);
				   break;
				case CONST.ftCheckBox://"Check box"
				   $labelinput=($('<input type=checkbox id="'+fid+'"  name="'+fname+'"></input>')).prop('checked',defval);//.append($('<label/>').attr('for',fid).html(label));
				   break;
				case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)"
				   $labelinput=($('<input type=checkbox id="'+fid+'"  name="'+fname+'"></input>'));//.append($('<label/>').attr('for',fid).html(label));
					break;
			}
			var $row=$('<div class="field"/>');
			$row.attr('fname',f.name);
			if (f.required) {
				//### Add 'required' indicator (mark as red text)
				$row.addClass('required');
			}
			if ($labelinput!==null){
				$row.append($('<div class="labelinput"/>').append([$labelinput,$label]));
			}
			else{
				$row.append([$('<div class="label"/>').append($label),$('<div class="input"/>').append($input)]);
			}
			fs.append($row);
		}
		
		// ### Learn more Prompt
		if ((helpHTML!=='' || page.helpAudioURL!=='' || page.helpVideoURL!=='')  && learnHTML==='') {
			// If learn more help exists but the prompt is blank, use the default prompt.
			learnHTML=lang.LearnMore;
		}
		$('.ui-form.learnmore',div).html(learnHTML );
		$('.learnmore button',div).button().click(function(){
			$('.A2JViewer .learnmore.panel').hide();
			$('.A2JViewer .help.panel').show();
		});
		$('.panel.learnmore',div).hide();
		if (learnHTML!=="" ) {			
			$('.panel.learnmore',div).delay(3000).fadeIn(1000);
		}
		
		// ### Learn more Help		
		$('.ui-form.help',div).html(helpHTML );
		$('.panel.help',div).hide();
		if (page.helpAudioURL!=='')
		{
			$('.help .audio',div).html(audioPlayerHTML(page.helpAudioURL));
		}
		if (page.helpVideoURL!=='') {
			$('.ui-form.help',div).append(videoPlayerHTML(page.helpVideoURL));
		}
		$('.panel.help button',div).button().click(function(){
			$('.help.panel',div).hide();
			$('.learnmore.panel',div).show();
		});
		
		// For Popups, intercept click and display.
		// Popups appear over the learn more help.
		// If there are popups within popups, they are not nested, just overwrite.
		$('.ui-form.popup',div).html('');
		$('.panel.popup',div).hide();
		$('.panel.popup button',div).button().click(function(){
			$('.popup.panel',div).hide();
		});
		$('a[href^=POPUP]',div).click(function()
		{	// Used for hyperlink internal popup, like POPUP://EstateNotes.
			var popupID = String($(this).attr('href')).substr(8);
			var page = gGuide.pages[popupID];
			if (page) {
			  var htmlText = prepHTML(page.text);
			  $('.ui-form.popup',div).html(htmlText);
			  $('.popup.panel',div).show();
			}
			else{
				traceAlert('Popup "'+popupID+'" not found');
			}
			return false;
		});


		
		// ### Error prompt
		$('.panel.formerror',div).hide();
		$('.panel.formerror button',div).button().click(function(){
			$('.formerror.panel',div).hide();
		});
		
		//### Position question bubble
		var h=$('.question.ui-form',div).height();
		if (h>400)
		{	// TODO Handle via CSS instead of script
			$('.question.bubble',div).css({top:50});
		}
		
		$('.question.panel .buttonlist button',div).button().click(function()
		{	//### Question validation of form data before proceeding
			// If we have an repeat var, be sure to use array indexing.
			var varIndex=null;
			if (page.repeatVar!=='')
			{
				varIndex=textToNumber(gGuide.varGet(page.repeatVar));
			}
			var invalid=false;
			$('.question.panel .ui-form div').removeClass('error');
			for (var fi=0; (!invalid ) && (fi<page.fields.length);fi++)
			{
				/** @type TField */
				var f = page.fields[fi];// field record				
				var fid = "FID_"+fi;//field id - unique
				var val = '';
				switch (f.type)
				{	// Get the field Value, validate it, store in variables if valid.
					
					case CONST.ftText:	//	"Text"
						val = $('#'+fid).val();
						if (val==='' && f.required) {
							invalid=true;
						}
						else{
							gGuide.varSet(f.name,val,varIndex);
						}
					   break;
					
					case CONST.ftTextLong://"Text (Long)"
						val = $('#'+fid).val();
						if (val==='' && f.required) {
							invalid=true;
						}
						else{
							gGuide.varSet(f.name,val,varIndex);
						}
					   break;
					
					case CONST.ftNumber://"Number"				
					case CONST.ftNumberDollar://"Numbfer Dollar"
						val = $('#'+fid).val();
						if (val==='' && f.required) {
							invalid=true;
						}
						else
						{ 
							val = textToNumber(val);
							if (f.min !=='' && val < f.min){
								invalid=true;
							}
							if (f.max !=='' && val > f.max){
								invalid=true;
							}
						}
						if (!invalid) {
							gGuide.varSet(f.name,val,varIndex);
						}
					   break;
					
					case CONST.ftNumberSSN://"Number SSN"
					case CONST.ftNumberPhone://"Number Phone"
					case CONST.ftNumberZIP://"Number ZIP Code"
						val = $('#'+fid).val();
						if (val==='' && f.required) {
							invalid=true;
						}
						else{
							gGuide.varSet(f.name,val,varIndex);
						}
					   break;
					case CONST.ftDateMDY://"Date MM/DD/YYYY"
						val = $('#'+fid).val();
						if (val==='' && f.required) {
							invalid=true;
						}
						else
						{	// 2014-06-16 Ensure date is in valid range.
							var valDate = mdy2jsDate(val);
							if (!isBlankOrNull(f.min)) {
								invalid = valDate <  mdy2jsDate(f.min);
							}
							if (!isBlankOrNull(f.max)) {
								invalid = (valDate > mdy2jsDate(f.max)) || invalid;
							}
							if (!invalid) {
								val = jsDate2mdy(valDate);
								gGuide.varSet(f.name,val,varIndex);
							}
						}
					   break;
					case CONST.ftTextPick://"Text (Pick from list)"
						val = $('#'+fid).val();
						if (val==='' && f.required) {
							invalid=true;
						}
						else{
							gGuide.varSet(f.name,val,varIndex);
						}
					   break;
					case CONST.ftNumberPick://"Number (Pick from list)"
						val = $('#'+fid).val();
						if (val==='' && f.required) {
							invalid=true;
						}
						else{
							gGuide.varSet(f.name,val,varIndex);
						}
					   break;
					case CONST.ftGender://"Gender"
						val='';
						if ($('#'+fid+'M').is(':checked')){
							val = lang.Male;
						}
						if ($('#'+fid+'F').is(':checked')){
							val = lang.Female;
						}					
						if (val==='' && f.required) {
							invalid=true;
						}
						else{
							gGuide.varSet(f.name,val,varIndex);
						}
					   break;
					case CONST.ftRadioButton://"Radio Button"
						if ($('#'+fid).is(':checked')){
							gGuide.varSet(f.name,f.value,varIndex);
						}
						// If a radio button is required but none have been checked, mark all.
						val = $('input[name="FID_'+f.name+'"]:checked').val();
						if (typeof val ==='undefined' && f.required)
						{
							invalid=true;
						}
		
					   break;
					case CONST.ftCheckBox://"Check box"
						val  =  $('#'+fid).is(':checked');
						gGuide.varSet(f.name,val,varIndex);
					   break;
					case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)" 
						break;
				}//end case
				//trace('Field '+f.name+' '+val);
				if (invalid)
				{
					
					$('.ui-form.formerror',div).html(isBlankOrNull( f.invalidPrompt)?lang.FieldPrompts_text:f.invalidPrompt);
					$('.panel.formerror',div).show();
					$('.ui-form [fname="'+f.name+'"]').addClass('error');
				}
				
			}//end for
			
			if (!invalid)
			{
				var bi=parseInt($(this).attr('num'),10);
				var b=page.buttons[bi];
				
				traceLogic( 'You pressed ' + traceTag('ui',b.label));
				//trace('ButtonPress',b.label,b.name,b.value);
				if (b.name!=="")
				{	// Set button's variable 
					gGuide.varSet(b.name,b.value,varIndex);
				}
				
				// Our default next page is derived from the button pressed.
				// Might be overridden by the After logic.
				gLogic.GOTOPAGE=b.next;				
				// execute the logic
				if (makestr(page.codeAfter)!=='')
				{
					// TODO HANDLE LOOPS
					traceLogic(traceTag('info','Logic After Question'));
					gLogic.executeScript(page.codeAfter);
				}
		
				
				// 2014-06-03 Button repeat/counters.
				switch (b.repeatVarSet)
				{
					case CONST.RepeatVarSetOne:
						// Set the repeat variable to 1.
						traceLogic("Setting repeat variable to 1");
						if (!gGuide.varExists(b.repeatVar)) {
							gGuide.varCreate(b.repeatVar,CONST.vtNumber,false,'Repeat variable index');
						}
						gGuide.varSet(b.repeatVar,1);
						break;
					case CONST.RepeatVarSetPlusOne:
						// Increment the repeat variable or set to 1 if doesn't exist.
						if (!gGuide.varExists(b.repeatVar)) {
							gGuide.varCreate(b.repeatVar,CONST.vtNumber,false,'Repeat variable index');
						}
						var value=  textToNumber(gGuide.varGet(b.repeatVar));
						// Note, if value is 0, a logic error. Would be 0 only if we skipped over the RepeatVarSetOne.
						traceLogic("Incrementing repeat variable");
						gGuide.varSet(b.repeatVar, value + 1);
						break;
				}
				
				
				if (gLogic.GOTOPAGE === b.next)
				{	// If logic didn't change our destination, go with button's choice, including optional url.
					gotoPageView(b.next,b.url);
				}
				else
				{	// Logic changed our destination so follow that. 
					gotoPageView(gLogic.GOTOPAGE);
					
				}
			}
		});//button click
		
	},
	
	saveExitQ:'', // Remember the point we left normal path and entered the Save/Resume path
	saveExitActive:false, // True when we're in the Save path.
	
	updateNavigationButtons:function()
	{	// Ensure navigation button states reflect application state
		// 11/24/08 2.6 if history variable has value of false, grayout.
		// 04/08/09 2.7.6 if navigation is false Hide.
	
		var navOn=true;// !(Global.curTemplate.getVariableValue(CVariable.vnNavigationTF)==false);
		if (A2JViewer.saveExitActive){
			navOn=false;
		}
		var hist_size=$('#history').children('option').length;
		$('button.navBack').button({disabled:navOn && ($('#history').prop('selectedIndex')===hist_size-1)});
		$('button.navNext').button({disabled:navOn && ($('#history').prop('selectedIndex')===0)});
		//historyComboBox.visible = navOn;
		//myProgress_label._visible=navOn;
		$('button.navFeedback').button({disabled:gGuide.sendfeedback===false});
		$('button.navSaveAndExit').toggle(true === ((gGuide.exitPage !== CONST.qIDNOWHERE) && (!A2JViewer.saveExitActive)));
		$('button.navResumeExit').toggle(true === A2JViewer.saveExitActive);
	},
	
	goBack:function()
	{	// User hit the back button or scripted go back was executed.
		// trace('navBack');
		$('#history').prop('selectedIndex',$('#history').prop('selectedIndex')+1);
		A2JViewer.skipHistory=true;
		gotoPageView($('#history').val());
	},
	
	goSaveExit:function()
	{	// When user chooses Exit we first jump to the Exit page where we can present info and let them back out.
		// Exit button will be replaced with a Resume button. 
		// 08/17/09 3.0.1
		//trace('navSaveAndExit');
		A2JViewer.saveExitQ=gPage.name;
		A2JViewer.saveExitActive=true;
		gotoPageView(gGuide.exitPage);
		//updateNavigationButtons();
	},

	goExitResume:function()				
	{	// User in the Exit path and pressed Resume. 
		// 8/24/09 3.0.2 Resume from exit
		//trace('navResumeExit');
		A2JViewer.saveExitActive=false;
		//updateNavigationButtons();
		if (A2JViewer.saveExitQ!=='')
		{
			gotoPageView(A2JViewer.saveExitQ);
			A2JViewer.saveExitQ='';
		}
	},
	
	layoutStep:function(curstep)
	{
		var steps=gGuide.steps;
		var IMG = A2JViewer.IMG;
		
		/**
		* @param {string} [w]
		* @param {string} [h]
		*/
		function posimg(src,x,y,w,h){
			if (typeof w!==undefined) {w=' width='+w;}
			if (typeof h!==undefined) {h=' height='+h;}
			return '<img src="'+IMG+src+'" '+w+h+' style="position:absolute; left:'+x+'px; top:'+y+'px;">';
		}
		var stepcount=steps.length-curstep;
		var stepInfos = [//ch=courthouse, gl=guide left, gf=guide front, cr=client right
		  {ground:'step1.png',ch:[322,5,550,350],  gl:[351,204],gf:[451,200],cr:[523,198],
			steps:[[288,430,432,131]],signs:[[629,277,1]]}
		,{ground:'step7.png', ch:[579,66,143,61], gl:[351,204],gf:[451,200],cr:[523,198],
			steps:[[288,430,432,131],[448,236,197,24]],signs:[[619,438,1],[550,200,0.6]]}
		];
		var COLORS=4;
		var si = (stepcount<=1) ? stepInfos[0] : stepInfos[1];
		var txt = posimg(si.ground,0,0) + posimg('A2J5_CourtHouse.png',si.ch[0],si.ch[1],si.ch[2],si.ch[3]);
		var s;
		for (s=0;s<si.steps.length;s++) {
			var cs = curstep + s;
			var s1=si.steps[s];
			var color = (cs===0) ? 0 : (cs-1) % COLORS +1;
			//txt +=  posimg('step_circle_'+ color +'.png',s1[0],s1[1],s1[2],s1[3]) ;
			txt +=  posimg('step_circle_'+ 0 +'.png',s1[0],s1[1],s1[2],s1[3]) ;
			s1=si.signs[s];
			var zoom = s1[2];
			var scale = 'scale('+zoom+')';
			zoom = 'transform: '+scale+';'
				+'-webkit-transform: '+scale+';';
				
			txt += '<div class="stepsign" style="position:absolute; left:'+s1[0]+'px; top: '+s1[1]+'px;'+zoom+'"><div class="stepsigncolor Step'+color+'" ></div>	<div class="stepnumber" >'+steps[cs].number+'</div>'
			+'<table class="steptextdiv"><tr valign=true><td><span class="steptext">'+steps[cs].text+'</span></tr></tr></table></div>';
			// step'+s+'
		}
		
		// Setup guide and client avatars		
		var avatarVarName="User Avatar"; // "blank" or "tan" or ""
		//var genderVarName="User Gender"; // "Male" or "Female" or ""
		
		var gg=gGuide.guideGender;// Guide's gender
		gg = (gg ==='Male') ? 'M' : 'F';//M or F
		
		var cg = gGuide.getClientGender();
		//var cg=gGuide.varGet(genderVarName); // Client's gender (blank means only show guide)
		//if (cg==='Male'){ cg='M';} else if (cg==='Female') {cg='F';} else {cg='';}
		
		
		var av=gGuide.varGet(avatarVarName);// Avatar style, originally blank or tan. 
		if (typeof av === 'undefined' || av===null) {av=gGuide.avatar;}
		if (av==='tan' || av==='avatar2')
			{av=1;}
		else
		if (av==='blank' || av===''  || av==='avatar1')
			{av=0;}
		else
		if (av==='tan2' || av==='avatar3')
			{av=2;}
		else
			{av=parseInt(av,10);}
		var qx;
		if (cg!=='')
		{
			qx=si.gl[0]-300;
			txt += posimg('A2JAvatar-Guide-'+gg+av+'.png',si.gl[0],si.gl[1])+posimg('A2JAvatar-Client-'+cg+av+'.png',si.cr[0],si.cr[1]);
		}
		else
		{	// No client gender, just guide facing screen.
			qx=si.gf[0]-300;
			txt += posimg('A2JAvatar-Guide-Front-'+gg+av+'.png',si.gf[0],si.gf[1]);
		}
		txt +='<div class="question panel" style="position:absolute; left:'+qx+'px; top: 140px; width: 300px; "><div class="question bubble"><div class="question ui-form"></div></div></div><img style="position:absolute; left: '+(qx+299)+'px; top: 240px; " src="'+IMG+'guide_bubble_tip.png"   />';
	

		// HTML for Learn More and LearnMore Help bubbles. 
		// Learnmore button
		var shared = '<div class="learnmore panel" style="position:absolute; left:604px; top: 153px; width: 285px;"><div class="learnmore bubble"><div class="ui-form learnmore"></div></div>'
			+'<div class="buttonlist"><button>'+lang.LearnMore+'</button></div></div>';
		// Help panel
		shared += '<div class="help panel" style="position:absolute; left:604px; top: 93px; width: 285px;"><div class="help bubble"><div class="ui-form help"></div></div>'
			+'<div class="audio"></div><div class="buttonlist"><button>'+ lang.Close+'</button></div></div>';
		// Popup panel
		shared += '<div class="popup panel" style="position:absolute; left:550px; top: 80px; width: 300px;"><div class="popup bubble"><div class="ui-form popup"></div></div>'
			+'<div class="audio"></div><div class="buttonlist"><button>'+ lang.Close+'</button></div></div>';			
		// Form errors panel
		shared += '<div class="formerror panel" style="position:absolute; left:604px; top: 93px; width: 285px;"><div class="formerror bubble"><div class="ui-form formerror"></div></div>'
			+'<div class="buttonlist"><button>'+ lang.Close+'</button></div></div>';

		return '<div class="step" >' + txt + shared + '</div>';
	}
};



/* */

