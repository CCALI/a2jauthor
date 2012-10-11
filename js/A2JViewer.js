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