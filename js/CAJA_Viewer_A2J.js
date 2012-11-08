/* 10/12/2012 A2J Viewer embedding */
// Elements: navbar, road step area, question, guide avatar, user avatar, learn more prompt, learn more bubble.
var IMG="img/";

var a2jviewer={
	header:'<div class="A2JViewer" title="A2J Viewer"><ul class="NavBar"> <li><a href="#">Back</a></li> <li><a href="#">Next</a></li> <li>Progress: <select id="history"><option>Question 1</option><option>Question 2</option></select></li> <li class="right size3"><a href="#">A</a></li> <li class="right size2"><a href="#">A</a></li> <li class="right size1"><a href="#">A</a></li> <li class="right"><a href="#">Exit</a></li> <li class="right"><a href="#">Save</a></li> </ul> <div class="interact">This is some content </div> </div>',
	
	layoutpage:function(div,guide,steps,page)
	{	// layout page into interactive viewer. attach event handlers.
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
		for (var fi in page.fields)
		{
			var f = page.fields[fi];
			$('.A2JViewer .ui-form.question fieldset').append('<label>'+f.label+'</label>').append('<input></input>');
		} 
		$('.A2JViewer .ui-form.learnmore').html(help + '<div class="buttonlist"><button>Close</button></div>').parent().hide().filter(function(){return help!=""}).fadeIn(1000);
		$('.stepnumber.step1').text(steps[curstep].number);
		$('.steptext.step1').text(steps[curstep].text);
		$('.circle1').attr('src',''+IMG+'step_circle_'+(curstep%3)+'.png');
		if (curstep<steps.length-1)
		{
			$('.stepnumber.step2').text(steps[curstep+1].number);
			$('.steptext.step2').text(steps[curstep+1].text);
			$('.circle2').attr('src',''+IMG+'step_circle_'+((curstep+1)%3)+'.png');
		}
		$('.A2JViewer .ui-form.learnmore button').button().click(function(){/*close*/});
		$('.A2JViewer .ui-form.question button').button().click(function(){
			var bi=parseInt($(this).attr('num'));
			var b=page.buttons[bi];
			// Validation form data before proceeding
			// VALIDATE()
			// Set label's variable 
			if (b.name!="") {}
			
			// execute the logic
			gotoPageShortly(b.next);
			//alert(b.label+" > " + b.next)
		});
		
	},
	layoutstep:function(stepcount)
	{	
		var steps=['<img style="position:absolute; left:0; bottom: 0; width: 935px; height: 574px;" src="'+IMG+'step1.png" width="804" height="531" /><img src="'+IMG+'step_courthouse.png" width="734" height="255" style="position:absolute; left: 249px; top: -2px;"  /><img class="circle1" style="position:absolute; left:  218px; top: 366px;" src="'+IMG+'step_circle.png" width="370" height="92" /> <img style="position:absolute; left: 389px; top: 274px;" src="'+IMG+'blank_guide2front.png" width="175" height="165" /> <img style="position:absolute; left: 478px; top: 421px;" src="'+IMG+'step_sign.png" width="422" height="120" /><div class="question bubble" style="position:absolute; left:57px; top: 140px; width: 285px; "><div class="question ui-form"><p>Question text appears here</p><div class="buttonlist"><button>Yes</button><button>No</button></div></div></div><div class="stepnumber step1" style="position:absolute; left:498px; top: 445px; width: 55px;">12</div><div class="steptext step1" style="position:absolute; left:561px; top: 429px; width: 234px;" class="question">Congratulations. You have completed this interview!</div><img style="position:absolute; left: 363px; top: 274px; width: 36px; height: 22px;" src="'+IMG+'guide_bubble_tip.png" width="59" height="42" />',
					  
					  
		'<img style="position:absolute; left:0; bottom: 0; width: 934px; height: 591px;" src="'+IMG+'step7.png" width="804" height="531" /><img src="'+IMG+'step_courthouse.png" width="373" height="88" style="position:absolute; left: 411px; top: 42px; width: 268px; height: 47px;"  /><img style="position:absolute; left:  274px; top: 210px; width: 311px; height: 62px;" src="'+IMG+'step_circle.png" class="circle2" width="477" height="118" /><img style="position:absolute; left:  160px; top: 368px;" src="'+IMG+'step_circle.png" class="circle1" width="477" height="118" /><img style="position:absolute; left: 389px; top: 278px;" src="'+IMG+'blank_guide2front.png" width="175" height="165" /> <img style="position:absolute; left: 551px; top: 413px;" src="'+IMG+'step_sign.png" width="422" height="120" /> <img style="position:absolute; left:  517px; top: 248px; width: 246px; height: 59px;" src="'+IMG+'step_sign.png" width="422" height="120" />	<div class="stepnumber step2" style="position:absolute; left: 530px; top: 260px; width: 24px; height: 17px;">2</div><div class="steptext step2" style="position:absolute; left: 562px; top: 260px; width: 131px; height: 21px;">Your information</div><div class="stepnumber step1" style="position:absolute; left:572px; top: 440px; width: 55px;">1</div><div class="steptext step1" style="position:absolute; left:633px; top: 433px; width: 234px; height: 52px;">Welcome!</div><div class="question bubble" style="position:absolute; left:57px; top: 140px; width: 285px; ">		<div class="question ui-form">			<p>Question text appears here</p>			<div class="buttonlist"><button>Yes</button><button>No</button></div></div></div><img style="position:absolute; left: 362px; top: 279px; width: 36px; height: 22px;" src="'+IMG+'guide_bubble_tip.png" width="59" height="42" /> '];
		
		var shared = '<div class="learnmore bubble" style="position:absolute; left:604px; top: 93px; width: 285px;"><div class="ui-form learnmore"><p>Learn more text appears here.</p><div class="buttonlist"><button>Close</button></div></div></div>';
	

		if (stepcount<=1) final= steps[0]; else final= steps[1];
		return '<div class="step" >' + final + shared + '</div>';
	}
};




