// JavaScript Document

$(document).ready(function(){
	lang.set('en'); 
	trace('ready');
	//$( "#main" ).dialog({width:500,height:400});
	
	
	var html='<div class="Viewer" title="A2J Viewer"><ul class="NavBar"> <li><a href="#">Back</a></li> <li><a href="#">Next</a></li> <li>Progress: <select id="history"><option>Question 1</option><option>Question 2</option></select></li> <li class="right size3"><a href="#">A</a></li> <li class="right size2"><a href="#">A</a></li> <li class="right size1"><a href="#">A</a></li> <li class="right"><a href="#">Exit</a></li> <li class="right"><a href="#">Save</a></li> </ul> <div class="interact">This is some content </div> </div>';
	
	$('#Loader').empty();
	$('.ViewerApp').html(html).show();
	
	loadGuide( templateURL);
});

function startCAJA()
{
	alert("Loaded "+caja.filename);
}
/*
	<div class="step" > <img style="position:absolute; left:0; bottom: 0; width: 935px; height: 574px;" src="../img/step1.png" width="804" height="531" /><img src="../img/step_courthouse.png" width="734" height="255" style="position:absolute; left: 249px; top: -2px;"  /><img style="position:absolute; left:  218px; top: 366px;" src="../img/step_circle.png" width="370" height="92" /> <img style="position:absolute; left: 389px; top: 274px;" src="../img/blank_guide2front.png" width="175" height="165" /> <img style="position:absolute; left: 478px; top: 421px;" src="../img/step_sign.png" width="422" height="120" />
	<div class="question bubble" style="position:absolute; left:57px; top: 140px; width: 285px; height: 320px;">
		<form><p>Question text appears here</p><div class="buttonlist"><button>Yes</button><button>No</button></div></form></div>
	<div class="stepnumber step1" style="position:absolute; left:498px; top: 445px; width: 55px;">12</div>
		<div class="steptext step1" style="position:absolute; left:561px; top: 429px; width: 234px;">Congratulations. You have completed this interview!</div>
<img style="position:absolute; left: 363px; top: 274px; width: 36px; height: 22px;" src="../img/guide_bubble_tip.png" width="59" height="42" /></div>

*/
