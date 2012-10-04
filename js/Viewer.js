// JavaScript Document

$(document).ready(function(){
	$('#Loader').hide();
	trace('ready');
	//$( "#main" ).dialog({width:500,height:400});
	$('.ViewerApp').show();
});
function trace(m)
{
	$('#trace').append(m);
}

