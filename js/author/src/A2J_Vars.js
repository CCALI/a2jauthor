/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	2015-03-30 A2J Variable editing
	Factoring out Variable editing section

*/



function varEdit(v/*TVariable*/)
{
	$('#varname').val(v.name);
	if (gPrefs.warnHotDocsNameLength) {
		// 2014-07-28
		$('#varname').attr('maxlength',CONST.MAXVARNAMELENGTH);
	}
	$('#vartype').val(v.type);
	$('#varcomment').val(v.comment);
	$('#varrepeating').attr('checked', v.repeating);
	$('#varUsageList').html('...');
	$('#varusage').button({label:'Quick Find',icons:{primary:'ui-icon-link'}}).click(function()
	{	// 2014-09-24 List all references to this variable.
		$('#varUsageList').html( vcGatherUsage(v.name) );
	});
	$('#var-edit-form').data(v).dialog({
  	dialogClass: "modal bootstrap-styles",
		autoOpen:true,
			width: 450,
			height: 500,
			modal:true,
			close: function(){
			},
			buttons:[
			{text:'Delete', click:function(){
				var name= $(this).data().name;
				if (name===""){
					return;
				}
				dialogConfirmYesNo({title:'Delete variable '+name,message:'Delete this variable?',name:name,Yes:
				/*** @this {{name}} */
				function(){
					$('#var-edit-form').dialog("close");
					gGuide.varDelete(this.name);
				}});
			}},
			{text:'Save',click:function(){
				var name= $('#varname').val();
				if(name!==v.name)//rename variable
				{
					delete gGuide.vars[v.name.toLowerCase()];
					v.name=name;
					gGuide.vars[name.toLowerCase()]=v;
				}
				v.type=$('#vartype').val();
				v.comment=$('#varcomment').val();
				v.repeating=$('#varrepeating').is(':checked');
				gGuide.noviceTab('tabsVariables',true);
				$(this).dialog("close");
			 }}
		]});
}



TGuide.prototype.varDelete=function(name){
	var guide=this;
	delete guide.vars[name.toLowerCase()];
	gGuide.noviceTab('tabsVariables',true);
};

function varAdd()
{  // Add new variable and edit.
	var v= new TVariable();
	varEdit(v);
}

TGuide.prototype.variableListHTML = function ()
{	// Build HTML table of variables, nicely sorted.
	var guide = this;
	var th=html.rowheading(["Name","Type","Repeating","Comment"]);
	var sortvars=guide.varsSorted();
	var vi;
	var tb='';
	for (vi in sortvars)
	{
		var v=sortvars[vi];
		tb+=html.row([v.name,v.type,v.repeating,v.comment
			+ (!v.warning ? '':'<span class="text-danger"><span class="glyphicon-attention"></span> '+v.warning+'</span>')]);
	}
	return '<table class="table table-hover">'+th + '<tbody>'+ tb + '</tbody>'+"</table>";
};

TGuide.prototype.buildTabVariables = function (t)
{
	t.append(this.variableListHTML());
	$('tr',t).click(function(){
		varEdit(gGuide.vars[$('td:first',this).text().toLowerCase()]);
	});
};


