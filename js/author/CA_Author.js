/*
 	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	CALI Author - Main
	 10/14/2013
*/

form.picksSore = function(label,value,handler)
{
	 return form.pickList('','picker score',[
		 'RIGHT','Right',
		 'WRONG','Wrong',
		 'MAYBE','Maybe',
		 'INFO','Info'],value,handler);
}
	
form.pickBranch=function()
{ 
	return form.pickList("",'picker branch',
	[
		0,"Show feedback and return to question",
		1,"Show feedback then branch to this page",
		2,"Just branch directly to this page"
	])
	.change(function(){
		var br=$(this).val();
		$(this).parent().children('.text').toggle(br!==2);
		$(this).parent().children('.dest').toggle(br!==0);
	});
}
