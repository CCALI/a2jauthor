/******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	A2J Viewer embedding
	10/12/2012
	04/2014

	Required by Author and Viewers
******************************************************************************/

// Elements: navbar, road step area, question, guide avatar, user avatar, learn more prompt, learn more bubble.
//var gLogic;

function versionString()
{
	return "Access to Justice Viewer/Author Version "+ CONST.A2JVersionNum+"("+CONST.A2JVersionDate+")";
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
		/** @type {TGuide} */
		var g = gGuide;
		/** @type {TVariable} */
		var v;
		var th=html.rowheading(["Name",'Loop',"Value"]); 
		var sortvars=[];
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
		sortvars.sort(function (a,b){return a.name.toLowerCase()>b.name.toLowerCase();/* sortingNaturalCompare(a.name,b.name);*/});
		
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
	
	/** @param {TPage} page  */
	layoutPage:function(div,page)
	{	// Layout page into interactive viewer. attach event handlers.
	
		if (div.html()==="")
		{	// First time rendering, attach handlers.
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
/*				+'<div class="license"><p ><span class="SJILogo"/>This program was developed under grants from the State Justice Institute (SJI grant number SJI-04-N-121), Center for Access to the Courts through Technology; Chicago Kent College of Law, Center for Computer-Assisted Legal Instruction (CALI), and Legal Services Corporation (LSC).  The points of view expressed are those of the authors and do not necessarily represent the official position or policies of the SJI, Center for Access to the Courts through Technology, Chicago-Kent, CALI, or the LSC.</p><p>&quot;A2J Author&quot; and &quot;A2J Guided Interviews&quot; are federally registered trademarks of Illinois Institute of Technology, Chicago Kent College of Law &amp; Center for Computer-Assisted Legal Instruction.  Any use of either mark must include the full name of the mark, along with the registration circle - ®.  Use of either mark on your webpage, or in any publications, presentations or materials must also prominently display the following sentence, &quot;[insert mark name here]® is a US federally registered trademark owned by Illinois Institute of Technology, Chicago Kent College of Law &amp; Center for Computer-Assisted Legal Instruction. &lt;www.a2jauthor.org&gt; </p></div>'*/
				+'<div class="copyright">'
					+'<span class="viewerenv">'+gEnv+' '+CONST.A2JVersionNum+" ("+CONST.A2JVersionDate+') </span>'
					+'© 2000-2014 Illinois Institute of Technology - Chicago-Kent College of Law and the Center for Computer-Assisted Legal Instruction'
			+'</div></div>');
			//<img src="images/SJILogo.gif" width="90" height="55" hspace="3" vspace="3" align="left" />
			
			$('div.a2jbtn',div).attr('title',versionString()).click(function()
			{
				$(div).toggleClass('test',500);//$('.A2JViewer')
			});
			//$( ".NavBar" ).menu({position:{my:'left top',at:'left bottom'}});
			
			//### Variable debugging
			$('#viewer-var-form').append('<div><button/><button/><button/>'
												  +'<label for="viewer-var-filter">Filter:</label><input type=text id="viewer-var-filter" size="5"/></div>'
												  +'<div class=varvalpanel></div></div>');
			$('#viewer-var-form div button').first()
				.button({label:'Save',icons:{primary:'ui-icon-folder-open'}}).click(
					function(){
						dialogAlert({title:'Save XML',body:prettyXML(gGuide.HotDocsAnswerSetXML())});
					})
				.next().button({label:'Refresh',icons:{primary:'ui-icon-zoomin' } } ).click(function(){
						A2JViewer.refreshVariables();
					})
				.next().button({label:'Reload',icons:{primary:'ui-icon-arrowrefresh-1-e'}})
				;
			$('#viewer-var-filter').keyup(A2JViewer.filterVariables);
			//ui-icon-extlink
			$('#history').change(function(){
				// Handle history navigation from drop down.
				A2JViewer.skipHistory=true;
				gotoPageView($(this).val());
			});
			$('button.navBack',div).button({label:  lang.GoBack,icons:{primary:'ui-icon-circle-triangle-w'},disabled:true}).click(function(){
				trace('navBack');
				$('#history').prop('selectedIndex',$('#history').prop('selectedIndex')+1);
				A2JViewer.skipHistory=true;
				gotoPageView($('#history').val());
			});
			$('button.navNext',div).button({label:  lang.GoNext,icons:{primary:'ui-icon-circle-triangle-e'},disabled:true}).click(function(){
				trace('navNext');
				$('#history').prop('selectedIndex',$('#history').prop('selectedIndex')-1);
				A2JViewer.skipHistory=true;
				gotoPageView($('#history').val());
			});
			$('button.navFeedback',div).button({label:  lang.SendFeedback,icons:{primary:'ui-icon-comment'},disabled:0}).click(function(){
				trace('navFeedback');
			});
			$('button.navSaveAndExit',div).button({label:  lang.SaveAndExit,icons:{primary:'ui-icon-disk'},disabled:0}).click(function(){
				trace('navSaveAndExit');
			});
			$('button.navResumeExit',div).button({label:  lang.ResumeExit,icons:{primary:'ui-icon-arrowreturnthick-1-w'},disabled:true}).click(function(){
				trace('navResumeExit');
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
		//TODO loopcounter; break out if we are in infinite loop
		
		gLogic.GOTOPAGE=null;
		if (makestr(page.codeBefore)!=='') {
			traceLogic(traceTag('info','Logic Before Question'));
			gLogic.executeScript(page.codeBefore);
			// TODO code returns immediately after a GOTO PAGE call. Check to see if our page changed.
			traceLogic(traceTag('info','Asking Question'));
		}
		
		
		
	
	
		
		var curstep = page.step;
		var questionHTML = gLogic.evalLogicHTML( page.text );
		var helpHTML = gLogic.evalLogicHTML( page.help);
		// Save quesetion to history (my progress)
		//<li><a href="#"><span class="ui-icon ui-icon-document"></span>Question 1<div>Should you use this form?</div></a></li>
		if (!A2JViewer.skipHistory)
		{
			trace('Save in history');
			var opt='<option value="'+ page.name.asHTML() +'">'+ String(questionHTML).stripHTML().ellipsis(40) +'</option>';
			//var opt = '<li><a href="#"><span class="ui-icon ui-icon-document"></span>'+  page.name.asHTML() +'<div>'+ String(questionHTML).stripHTML().ellipsis(40)+'</div></a></li>';
			$('#history').prepend(opt).prop('selectedIndex',0);
		}
		var hist_size=$('#history').children('option').length;
		$('button.navBack',div).button({disabled:$('#history').prop('selectedIndex')===hist_size-1});
		$('button.navNext',div).button({disabled:$('#history').prop('selectedIndex')===0});
		A2JViewer.skipHistory=false;
		
		
		$('.interact',div).html(A2JViewer.layoutStep(curstep));
		
		$('.ui-form.question',div).html(questionHTML + '<div class="form"></div><div class="buttonlist"></div>');
		for (var bi=0;bi<page.buttons.length;bi++)
		{
			var b = page.buttons[bi];
			$('.ui-form.question  .buttonlist',div).append('<button num='+bi+' title="Go to page '+gGuide.pageDisplayName(b.next).asHTML()+'">'+b.label+'</button>'); //.A2JViewer .ui-form.question  .buttonlist'
		}
		var fs=$('.ui-form.question .form',div);//'.A2JViewer .ui-form.question .form'
	
		/*
		 * @type {string|number}
		* */
		var varIndex=null;
		if (page.repeatVar!==''){
			varIndex = gGuide.varGet(page.repeatVar);
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
			var label = gLogic.evalLogicHTML(f.label);
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
				   $input=($('<input type=text id='+fid+'></input>').val(defval));
				   break;
				
				case CONST.ftDateMDY://"Date MM/DD/YYYY"
				   $input=($('<input type=text id='+fid+'></input>').val(defval));
					trace(CONST.ftDateMDY,gGuide.language);
					var dateOpts = {
						changeMonth: true,
						changeYear: true
					};
					if (!isBlankOrNull(f.min)) {
						trace('minDate',f.min);
						dateOpts.minDate = f.min;
					}
					if (!isBlankOrNull(f.max)) {
						trace('maxDate',f.max);
						dateOpts.maxDate = f.max;
					}
					$.datepicker.setDefaults($.datepicker.regional[ gGuide.language ]);
					// 3/21/2014 Format dates for any language in USA m/d/y format. 
					dateOpts.dateFormat = 'mm/dd/yyyy';
					$input.datepicker( dateOpts);
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
				   $labelinput=($('<input type=radio id="'+fid+'" name="'+fname+'"></input>')).prop('checked',defval===f.value);//.append($('<label/>').attr('for',fid).html(label));
				   break;
				case CONST.ftCheckBox://"Check box"
				   $labelinput=($('<input type=checkbox id="'+fid+'"  name="'+fname+'"></input>')).prop('checked',defval);//.append($('<label/>').attr('for',fid).html(label));
				   break;
				case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)"
				   $labelinput=($('<input type=checkbox id="'+fid+'"  name="'+fname+'"></input>'));//.append($('<label/>').attr('for',fid).html(label));
					break;
			}
			var $row=$('<div class="field"/>');
			if (f.required) {
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
		$('.ui-form.learnmore',div).html(helpHTML + '<div class="buttonlist"><button>Close</button></div>').parent().hide().filter(
			function(){
				return helpHTML!=="";
			}).fadeIn(1000);
		
		
		var h=$('.question.ui-form',div).height();
		if (h>400){
			$('.question.bubble',div).css({top:50});
		}
		
		$('.ui-form.learnmore button',div).button().click(function(){
			$('.A2JViewer .learnmore.bubble').hide();
		});
		$('.ui-form.question button',div).button().click(function()
		{	// Validation of form data before proceeding
			/*
			 * @type {string|number}
			* */
			var varIndex=null;
			if (page.repeatVar!=='')
			{
				varIndex=gGuide.varGet(page.repeatVar);
			}
			for (var fi=0;fi<page.fields.length;fi++)
			{
				var f = page.fields[fi];// field record
				var fid = "FID_"+fi;//field id - unique
				//var fname = "FID_"+f.name;//field name - possible duplicates, i.e., radio buttons

				switch (f.type)
				{
					case CONST.ftText://"Text"
					case CONST.ftTextLong://"Text (Long)"
					case CONST.ftNumber://"Number"
					case CONST.ftNumberDollar://"Numbfer Dollar"
					case CONST.ftNumberSSN://"Number SSN"
					case CONST.ftNumberPhone://"Number Phone"
					case CONST.ftNumberZIP://"Number ZIP Code"
					case CONST.ftDateMDY://"Date MM/DD/YYYY"
						gGuide.varSet(f.name,$('#'+fid).val(),varIndex);
					   break;
					case CONST.ftTextPick://"Text (Pick from list)"
						gGuide.varSet(f.name,$('#'+fid).val(),varIndex);						
					   break;
					case CONST.ftNumberPick://"Number (Pick from list)"
						gGuide.varSet(f.name,$('#'+fid).val(),varIndex);
					   break;
					case CONST.ftGender://"Gender"
						if ($('#'+fid+'M').is(':checked')){
							gGuide.varSet(f.name,lang.Male,varIndex);
						}
						if ($('#'+fid+'F').is(':checked')){
							gGuide.varSet(f.name,lang.Female,varIndex);
						}
					   break;
					case CONST.ftRadioButton://"Radio Button"
						if ($('#'+fid).is(':checked')){
							gGuide.varSet(f.name,f.value,varIndex);
						}
					   break;
					case CONST.ftCheckBox://"Check box"
						gGuide.varSet(f.name,$('#'+fid).is(':checked'),varIndex);
					   break;
					case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)" 
						break;
				}
			}
			
			var bi=parseInt($(this).attr('num'),10);
			var b=page.buttons[bi];
			
			traceLogic( 'You pressed ' + traceTag('ui',b.label));
			trace('ButtonPress',b.label,b.name,b.value);
			if (b.name!=="")
			{	// Set button's variable 
				gGuide.varSet(b.name,b.value,varIndex);
			}
			
			// execute the logic
			gLogic.GOTOPAGE=b.next;
			gLogic.executeScript(page.codeAfter);
			// TODO HANDLE LOOPS
			gotoPageView(b.next);		
		});//button click
		
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
			var zoom = s1[2];zoom = '-moz-transform: scale('+zoom+');';
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
		
		
		var av=gGuide.varGet(avatarVarName);// Avatar style, originally blank or tan. Also support number.
		if (typeof av === 'undefined') {av=gGuide.avatar;}
		if (av==='tan')
			{av=1;}
		else
		if (av==='blank' || av==='')
			{av=0;}
		else
		if (av==='tan2')
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
		txt +='<div class="question bubble" style="position:absolute; left:'+qx+'px; top: 140px; width: 300px; "><div class="question ui-form"></div></div><img style="position:absolute; left: '+(qx+299)+'px; top: 240px; " src="'+IMG+'guide_bubble_tip.png"   />';
		//txt += '<div class="buttonlist" style="position:absolute; left:'+qx+'px;top: ></div>';
		

		var shared = '<div class="learnmore bubble" style="position:absolute; left:604px; top: 93px; width: 285px;"><div class="ui-form learnmore"><div class="buttonlist"><button>Close</button></div></div></div>';

		return '<div class="step" >' + txt + shared + '</div>';
	}
};


/* */
