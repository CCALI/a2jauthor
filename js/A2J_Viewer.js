/*
 	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	A2J Viewer embedding
	10/12/2012
	04/15/2013

	Required by Author and Viewers
*/

// Elements: navbar, road step area, question, guide avatar, user avatar, learn more prompt, learn more bubble.

function versionString()
{
	return "Access to Justice Viewer/Author Version "+ CONST.A2JVersionNum+"("+CONST.A2JVersionDate+")";
}
function loadXMLList(opts)
{	// opts.elt, opts.data, opts.val
	var $select=$(opts.data);
	$($select,'option:first').prepend('<option value="">Choose from this list</option>');
	$(opts.elt).html($select.html()).val(opts.val);
}
function loadXMLListExternal(opts)
/** */
{	// opts.url, opts.val, opts.elt
   $.ajax({
      url:  fixPath(opts.url),
      dataType:  "text",
      timeout: 15000,
		opts: opts,
      error:
			/*** @this {{url}} */
			function(data,textStatus,thrownError){
			  dialogAlert('Unable to load a list of items from '+this.url+"\n"+textStatus);
			 },
      success: function(data){
			var opts=this.opts;
			//if (!opts) opts=$(this).opts;//8/2013 this.opts;
			opts.data=data;
			loadXMLList(opts);
      }
   });
}


var A2JViewer={

	IMG : "img/",

	history:[],
	
	layoutPage:function(div,guide,steps,page)
	{	// layout page into interactive viewer. attach event handlers.
	
		var html = '<ul class="NavBar"> <li><a href="#navback">'+lang.GoBack+'</a></li> <li><a href="#">'+lang.GoNext+'</a></li> <li>'+lang.MyProgress+' <select id="history"><option>Question 1</option><option>Question 2</option></select></li>  <li class="right size2"><a href="#">A+</a></li> <li class="right size1"><a href="#">A-</a></li> <li class="right"><a href="#">Exit</a></li> <li class="right"><a href="#">Save</a></li> </ul><div class="interact">This is some content </div> <div id="a2jbtn"></div> ';
		if ($(div).html()==="")//first time?
		{
			$(div).html(html);
			$('#a2jbtn').attr('title',versionString()).click(function()
			{
				$('.A2JViewer').toggleClass('test',500);
			});
			$('#viewer-var-form').append('<div><button/><button/></div>');
			$('#viewer-var-form div button').first()
				.button({label:'Save',icons:{primary:'ui-icon-arrow-4-diag'}}).next()
				.button({label:'Reload',icons:{primary:'ui-icon-zoomin'}});
				
			$('.NavBar a').click(function(){
				switch ($(this).attr('href')){
					case '#navback':
						break;
					default:
						// ($(this).attr('href'));
				}
			});
			
			if (typeof authorViewerHook !== 'undefined'){
				authorViewerHook();
			}
		}
		traceLogic(traceTag('code','PAGE')+' '+ traceTag('page',page.name));
		//TODO loopcounter; break out if we are in infinite loop
		
		gLogic.GOTOPAGE=null;
		gLogic.executeScript(page.codeBefore);
		// TODO code returns immediately after a GOTO PAGE call. Check to see if our page changed.
		
		
		var curstep = page.step;
		var question = gLogic.evalLogicHTML( page.text );
		var help = gLogic.evalLogicHTML( page.help);
		$('.interact',div).html(A2JViewer.layoutstep(curstep,steps)); 
		
		$('.A2JViewer .ui-form.question').html(question + '<div class="form"></div><div class="buttonlist"></div>');
		var bi;
		for (bi in page.buttons)
		{
			var b = page.buttons[bi];
			$('.A2JViewer .ui-form.question  .buttonlist').append('<button num='+bi+' title="Go to page '+gGuide.pageDisplayName(b.next).asHTML()+'">'+b.label+'</button>'); 
		}
		var fs=$('.A2JViewer .ui-form.question .form');
		var varIndex=null;
		if (page.repeatVar!==''){
			guide.varGet(page.repeatVar);
		}
		var fi;
		for (fi in page.fields)
		{
			var f = page.fields[fi];// field record
			var fid = "FID_"+fi;//field id - unique
			var fname = "FID_"+f.name;//field name - possible duplicates, i.e., radio buttons
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
			var defval=guide.varGet(f.name,varIndex);
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
				   break;
				case CONST.ftGender://"Gender"
					//row.append($('<div/>').html(label));
					var fidM=fid+"M";
					var fidF=fid+"F";
				   $input=$('<div/>').append($('<input type=radio id="'+fidM+'" name="'+fname+'"></input>')).append($('<label/>').attr('for',fidM).html(lang.Male))
						.append($('<br/><input type=radio id="'+fidF+'" name="'+fname+'"></input>')).append($('<label/>').attr('for',fidF).html(lang.Female));
				   break;
				case CONST.ftRadioButton://"Radio Button"
				   $labelinput=($('<input type=radio id="'+fid+'" name="'+fname+'"></input>'));//.append($('<label/>').attr('for',fid).html(label));
				   break;
				case CONST.ftCheckBox://"Check box"
				   $labelinput=($('<input type=checkbox id="'+fid+'"  name="'+fname+'"></input>'));//.append($('<label/>').attr('for',fid).html(label));
				   break;
				case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)"
				   $labelinput=($('<input type=checkbox id="'+fid+'"  name="'+fname+'"></input>'));//.append($('<label/>').attr('for',fid).html(label));
					break;
			}
			var $row=$('<div class="field"/>');
			if ($labelinput!==null){
				$row.append($('<div class="labelinput"/>').append([$labelinput,$label]));
			}
			else{
				$row.append([$('<div class="label"/>').append($label),$('<div class="input"/>').append($input)]);
			}
			fs.append($row);
		} 
		$('.A2JViewer .ui-form.learnmore').html(help + '<div class="buttonlist"><button>Close</button></div>').parent().hide().filter(
			function(){
				return help!=="";
			}).fadeIn(1000);
	/*
		$('.stepnumber.step1').text(steps[curstep].number);
		$('.steptext.step1').text(steps[curstep].text);
		$('.circle1').attr('src',A2JViewer.IMG+'step_circle_'+(curstep%3)+'.png');
		if (curstep<steps.length-1)
		{   // layout as many steps as possible
			$('.stepnumber.step2').text(steps[curstep+1].number);
			$('.steptext.step2').text(steps[curstep+1].text);
			$('.circle2').attr('src',A2JViewer.IMG+'step_circle_'+((curstep+1)%3)+'.png');
		}
		*/
		var h=$('.question.ui-form').height();
		if (h>400){
			$('.question.bubble').css({top:50});
		}
		
		$('.A2JViewer .ui-form.learnmore button').button().click(function(){$('.A2JViewer .learnmore.bubble').hide()});
		$('.A2JViewer .ui-form.question button').button().click(function()
		{	// Validation of form data before proceeding
			var varIndex=null;
			if (page.repeatVar!=="")
			{
				guide.varGet(page.repeatVar);
			}
			var fi;
			for (fi in page.fields)
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
						guide.varSet(f.name,varIndex,$('#'+fid).val());
					   break;
					case CONST.ftTextPick://"Text (Pick from list)"
						guide.varSet(f.name,varIndex,$('#'+fid).val());						
					   break;
					case CONST.ftNumberPick://"Number (Pick from list)"
						guide.varSet(f.name,varIndex,$('#'+fid).val());
					   break;
					case CONST.ftGender://"Gender"
						if ($('#'+fid+'M').is(':checked')){
							guide.varSet(f.name,varIndex,lang.Male);
						}
						if ($('#'+fid+'F').is(':checked')){
							guide.varSet(f.name,varIndex,lang.Female);
						}
					   break;
					case CONST.ftRadioButton://"Radio Button"
						if ($('#'+fid).is(':checked')){
							guide.varSet(f.name,varIndex,f.value);
						}
					   break;
					case CONST.ftCheckBox://"Check box"
						guide.varSet(f.name,varIndex,$('#'+fid).is(':checked'));
					   break;
					case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)" 
						break;
				}
			}
			
			var bi=parseInt($(this).attr('num'),10);
			var b=page.buttons[bi];
			
			traceLogic( 'You pressed ' + traceTag('ui',b.label));
			trace(b.label,b.name,b.value);
			if (b.name!=="")
			{	// Set button's variable 
				guide.varSet(b.name,varIndex,b.value);
			}
			
			// execute the logic
			gLogic.GOTOPAGE=b.next;
			gLogic.executeScript(page.codeAfter);
			// TODO HANDLE LOOPS
			gotoPageView(b.next);		
		});//button click
		
	},
	layoutstep:function(curstep,steps)
	{
		
		var IMG = A2JViewer.IMG;
		function posimg(src,x,y,w,h){
			if (typeof w!=undefined) w=' width='+w;
			if (typeof h!=undefined) h=' height='+h;
			return '<img src="'+IMG+src+'" '+w+h+' style="position:absolute; left:'+x+'px; top:'+y+'px;">';
		}
		var stepcount=steps.length-curstep;
		var stepInfos = [//ch=courthouse, gl=guide left, gf=guide front, cr=client right
		  {ground:'step1.png',ch:[322,5,550,350],  gl:[351,204],gf:[451,200],cr:[523,198],
			steps:[[288,430,432,131]],signs:[[629,277,1]]}
		,{ground:'step7.png', ch:[579,66,143,61], gl:[351,204],gf:[451,200],cr:[523,198],
			steps:[[288,430,432,131],[448,236,197,24]],signs:[[619,438,1],[569,212,.8]]}
		];
		var COLORS=4;
		var si = (stepcount<=1) ? stepInfos[0] : stepInfos[1];
		var txt = posimg(si.ground,0,0) + posimg('A2J5_CourtHouse.png',si.ch[0],si.ch[1],si.ch[2],si.ch[3]);
		for (var s=0;s<si.steps.length;s++) {
			var cs = curstep + s;
			var s1=si.steps[s];
			var color = (cs===0) ? 0 : (cs-1) % COLORS +1;
			txt +=  posimg('step_circle_'+ color +'.png',s1[0],s1[1],s1[2],s1[3]) ;
			var s1=si.signs[s];
			var zoom = s1[2];zoom = '-moz-transform: scale('+zoom+');';
			txt += '<div class="stepsign" style="position:absolute; left:'+s1[0]+'px; top: '+s1[1]+'px;'+zoom+'"><div class="stepsigncolor Step'+color+'" ></div>	<div class="stepnumber" >'+steps[cs].number+'</div><div class="steptext">'+steps[cs].text+'!</div></div>';
			// step'+s+'
		}
		var ga='M';//M or F
		var ca='F';//'' or M or F
		var qx;
		if (ca!="")
		{
			qx=si.gl[0]-300;
			txt += posimg('A2JAvatar-Guide-'+ga+'0.png',si.gl[0],si.gl[1])+posimg('A2JAvatar-Client-'+ca+'1.png',si.cr[0],si.cr[1]);
		}
		else
		{
			qx=si.gf[0]-300;
			txt += posimg('A2JAvatar-Guide-Front-'+ga+'1.png',si.gf[0],si.gf[1]);
		}
		txt +='<div class="question bubble" style="position:absolute; left:'+qx+'px; top: 140px; width: 300px; "><div class="question ui-form"><div class="buttonlist"></div></div></div><img style="position:absolute; left: '+(qx+299)+'px; top: 240px; " src="'+IMG+'guide_bubble_tip.png"   />';

		var shared = '<div class="learnmore bubble" style="position:absolute; left:604px; top: 93px; width: 285px;"><div class="ui-form learnmore"><div class="buttonlist"><button>Close</button></div></div></div>';

		return '<div class="step" >' + txt + shared + '</div>';
	}
};


/* */
