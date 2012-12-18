/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	A2J Viewer embedding
	Required by Author and Viewers
	10/12/2012
*/

// Elements: navbar, road step area, question, guide avatar, user avatar, learn more prompt, learn more bubble.


			
	

var a2jviewer={
	header:'<ul class="NavBar"> <li><a href="#">Back</a></li> <li><a href="#">Next</a></li> <li>Progress: <select id="history"><option>Question 1</option><option>Question 2</option></select></li> <li class="right size3"><a href="#">A</a></li> <li class="right size2"><a href="#">A</a></li> <li class="right size1"><a href="#">A</a></li> <li class="right"><a href="#">Exit</a></li> <li class="right"><a href="#">Save</a></li> </ul> <div class="interact">This is some content </div>',
	//header:'<div class="A2JViewer" title="A2J Viewer"><ul class="NavBar"> <li><a href="#">Back</a></li> <li><a href="#">Next</a></li> <li>Progress: <select id="history"><option>Question 1</option><option>Question 2</option></select></li> <li class="right size3"><a href="#">A</a></li> <li class="right size2"><a href="#">A</a></li> <li class="right size1"><a href="#">A</a></li> <li class="right"><a href="#">Exit</a></li> <li class="right"><a href="#">Save</a></li> </ul> <div class="interact">This is some content </div> </div>',
	
	IMG : "img/",

	
	
	
	
	layoutpage:function(div,guide,steps,page)
	{	// layout page into interactive viewer. attach event handlers.
	
		traceLogic(traceTag('code','GOTO')+' '+ traceTag('page',page.name));
		//TODO loopcounter; break out if we are in infinite loop
		
		gLogic.GOTOPAGE=null;
		gLogic.executeScript(page.codeBefore);
		// TODO code returns immediately after a GOTO PAGE call. Check to see if our page changed.
		
		
		
		var curstep = page.step;
		var question = page.text;
		var help = page.help;

		var stepcount=steps.length-curstep;
		var html=this.header;
		$(div).html(html);
		$('.interact',div).html(a2jviewer.layoutstep(stepcount)); 
		
		$('.A2JViewer .ui-form.question').html(question + '<fieldset class="fieldlist"></fieldset><div class="buttonlist"></div>');
		for (var bi in page.buttons)
		{
			var b = page.buttons[bi];
			$('.A2JViewer .ui-form.question  .buttonlist').append('<button num='+bi+' title="Go to page '+gGuide.pageDisplayName(b.next).asHTML()+'">'+b.label+'</button>'); 
		}
		var fs=$('.A2JViewer .ui-form.question fieldset');
		var varIndex=null;
		if (page.repeatVar!="")
			guide.varGet(page.repeatVar);
		for (var fi in page.fields)
		{
			var f = page.fields[fi];// field record
			var fid = "FID_"+fi;//field id - unique
			var fname = "FID_"+f.name;//field name - possible duplicates, i.e., radio buttons
/*
   this.type ="";
   this.label ="";
   this.name ="";//reference TVar.name
   this.optional =false;
   this.invalidPrompt ="";
   this.order ="";//default, ASC, DESC
   this.min="";
   this.max="";
   this.calendar=false;
   this.calculator=false;
   this.maxChars="";
*/
			var defval=guide.varGet(f.name,varIndex);
			var row=$('<div class="row"/>');
			switch (f.type)
			{
				case CONST.ftText://"Text"
				   row.append($('<label/>').attr('for',fid).html(f.label)).append($('<input type=text class=text id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftTextLong://"Text (Long)"
				   row.append($('<label/>').attr('for',fid).html(f.label)).append($('<textarea type=text class=textarea id='+fid+'></textarea>').val(defval));
				   break;
				case CONST.ftTextPick://"Text (Pick from list)"
				   row.append($('<label/>').attr('for',fid).html(f.label)).append($('<select id='+fid+'></select>').val(defval));
					
					var list=["1","2","3"];
					/*
	,pickList:function(data,listValueLabel){//list is array to ensure preserved order. Note: js object properties don't guarantee order
		var c="";
		for (var o=0;o<listValueLabel.length;o+=2)
			c+='<option value="'+listValueLabel[o]+'">'+listValueLabel[o+1]+'</option>';
		var e =$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><select class="     ui-select-input">'+c+'</select></span></div>');
		$('.ui-select-input',e).change(function(){form.change($(this),$('option:selected',this).val())}).data('data',data).val(data.value);
		return e;
	}*/
					
					
					
					
				   break;
				case CONST.ftNumber://"Number"
				    row.append($('<label/>').html(f.label)).append($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftNumberDollar://"Number Dollar"
				   row.append($('<label/>').html(f.label)).append($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftNumberSSN://"Number SSN"
				   row.append($('<label/>').html(f.label)).append($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftNumberPhone://"Number Phone"
				   row.append($('<label/>').html(f.label)).append($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftNumberZIP://"Number ZIP Code"
				   row.append($('<label/>').html(f.label)).append($('<input type=text class=number id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftNumberPick://"Number (Pick from list)"
				   row.append($('<label/>').attr('for',fid).html(f.label)).append($('<input type=text id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftDateMDY://"Date MM/DD/YYYY"
				   row.append($('<label/>').attr('for',fid).html(f.label)).append($('<input type=text id='+fid+'></input>').val(defval));
				   break;
				case CONST.ftGender://"Gender"
					row.append($('<div/>').html(f.label));
					var fidM=fid+"M";
					var fidF=fid+"F";
				   row.append($('<input type=radio id="'+fidM+'" name="'+fname+'"></input>')).append($('<label/>').attr('for',fidM).html('Male'));
				   row.append($('<input type=radio id="'+fidF+'" name="'+fname+'"></input>')).append($('<label/>').attr('for',fidF).html('Female'));
				   break;
				case CONST.ftRadioButton://"Radio Button"
				   row.append($('<input type=radio id="'+fid+'" name="'+fname+'"></input>')).append($('<label/>').attr('for',fid).html(f.label));
				   break;
				case CONST.ftCheckBox://"Check box"
				   row.append($('<input type=checkbox id="'+fid+'"  name="'+fname+'"></input>')).append($('<label/>').attr('for',fid).html(f.label));
				   break;
				case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)"
					TODO(); 
					break;
			}
			fs.append(row);
		} 
		$('.A2JViewer .ui-form.learnmore').html(help + '<div class="buttonlist"><button>Close</button></div>').parent().hide().filter(function(){return help!=""}).fadeIn(1000);
		$('.stepnumber.step1').text(steps[curstep].number);
		$('.steptext.step1').text(steps[curstep].text);
		$('.circle1').attr('src',''+this.IMG+'step_circle_'+(curstep%3)+'.png');
		if (curstep<steps.length-1)
		{   // layout as many steps as possible
			$('.stepnumber.step2').text(steps[curstep+1].number);
			$('.steptext.step2').text(steps[curstep+1].text);
			$('.circle2').attr('src',''+this.IMG+'step_circle_'+((curstep+1)%3)+'.png');
		}
		$('.A2JViewer .ui-form.learnmore button').button().click(function(){/*close*/});
		$('.A2JViewer .ui-form.question button').button().click(function(){
			// Validation form data before proceeding
			var varIndex=null;
			if (page.repeatVar!="")
				guide.varGet(page.repeatVar);
			
			for (var fi in page.fields)
			{
				var f = page.fields[fi];// field record
				var fid = "FID_"+fi;//field id - unique
				var fname = "FID_"+f.name;//field name - possible duplicates, i.e., radio buttons
					
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
					   break;
					case CONST.ftNumberPick://"Number (Pick from list)"
					   break;
					   break;
					case CONST.ftGender://"Gender"
					   break;
					case CONST.ftRadioButton://"Radio Button"

					   break;
					case CONST.ftCheckBox://"Check box"
					   break;
					case CONST.ftCheckBoxNOTA://"Check Box (None of the Above)" 
						break;
				}
			}
			
			var bi=parseInt($(this).attr('num'));
			var b=page.buttons[bi];
			
			if (b.name!="")
			{	// Set button's variable 
				guide.varSet(b.name,varIndex,b.value);				
			}
			
			// execute the logic
			gLogic.GOTOPAGE=b.next;
			gLogic.executeScript(page.codeAfter);
			// TODO HANDLE LOOPS
			gotoPageViewer(b.next);
			
			
			
			
		});
		
	},
	layoutstep:function(stepcount)
	{	
		var steps=['<img style="position:absolute; left:0; bottom: 0; width: 935px; height: 574px;" src="'
			+this.IMG+'step1.png" width="804" height="531" /><img src="'
			+this.IMG+'step_courthouse.png" width="734" height="255" style="position:absolute; left: 249px; top: -2px;"  /><img class="circle1" style="position:absolute; left:  218px; top: 366px;" src="'
			+this.IMG+'step_circle.png" width="370" height="92" /> <img style="position:absolute; left: 389px; top: 274px;" src="'
			+this.IMG+'blank_guide2front.png" width="175" height="165" />'
			+'<img style="position:absolute; left: 478px; top: 421px;" src="'
			+this.IMG+'step_sign.png" width="422" height="120" /><div class="question bubble" style="position:absolute; left:57px; top: 140px; width: 285px; "><div class="question ui-form"><p>Question text appears here</p><div class="buttonlist"><button>Yes</button><button>No</button></div></div></div><div class="stepnumber step1" style="position:absolute; left:498px; top: 445px; width: 55px;">12</div>'
			+'<div class="steptext step1" style="position:absolute; left:561px; top: 429px; width: 234px;" class="question">'
			+'Congratulations. You have completed this interview!</div><img style="position:absolute; left: 363px; top: 274px; width: 36px; height: 22px;" src="'
			+this.IMG+'guide_bubble_tip.png" width="59" height="42" />',
					  
					  
		'<img style="position:absolute; left:0; bottom: 0; width: 934px; height: 591px;" src="'
			+this.IMG+'step7.png" width="804" height="531" /><img src="'
			+this.IMG+'step_courthouse.png" width="373" height="88" style="position:absolute; left: 411px; top: 42px; width: 268px; height: 47px;"  /><img style="position:absolute; left:  274px; top: 210px; width: 311px; height: 62px;" src="'
			+this.IMG+'step_circle.png" class="circle2" width="477" height="118" /><img style="position:absolute; left:  160px; top: 368px;" src="'
			+this.IMG+'step_circle.png" class="circle1" width="477" height="118" /><img style="position:absolute; left: 389px; top: 278px;" src="'
			+this.IMG+'blank_guide2front.png" width="175" height="165" /> <img style="position:absolute; left: 551px; top: 413px;" src="'
			+this.IMG+'step_sign.png" width="422" height="120" /> <img style="position:absolute; left:  517px; top: 248px; width: 246px; height: 59px;" src="'
			+this.IMG+'step_sign.png" width="422" height="120" />'
			+'<div class="stepnumber step2" style="position:absolute; left: 530px; top: 260px; width: 24px; height: 17px;">2</div><div class="steptext step2" style="position:absolute; left: 562px; top: 260px; width: 131px; height: 21px;">Your information</div>'
			+'<div class="stepnumber step1" style="position:absolute; left:572px; top: 440px; width: 55px;">1</div><div class="steptext step1" style="position:absolute; left:633px; top: 433px; width: 234px; height: 52px;">Welcome!</div><div class="question bubble" style="position:absolute; left:57px; top: 140px; width: 285px; "><div class="question ui-form"><p>Question text appears here</p>			<div class="buttonlist"><button>Yes</button><button>No</button></div></div></div><img style="position:absolute; left: 362px; top: 279px; width: 36px; height: 22px;" src="'
			+this.IMG+'guide_bubble_tip.png" width="59" height="42" /> '];
		
		var shared = '<div class="learnmore bubble" style="position:absolute; left:604px; top: 93px; width: 285px;"><div class="ui-form learnmore"><p>Learn more text appears here.</p><div class="buttonlist"><button>Close</button></div></div></div>';
	

		if (stepcount<=1) final= steps[0]; else final= steps[1];
		return '<div class="step" >' + final + shared + '</div>';
	}
};





/* */
