/*	CALI Author 5 - CAJA Authoring   
 	03/30/2012 
 */

function listguides(data)
{
	session.guideid=0;
	var mine = [];
	var others = [];
	$.each(data.guides, function(key,g) { var str='<li class=guide gid="' + g.id + '">' + g.title + '</li>'; if (g.owned)mine.push(str);else others.push(str);});
	$('#guidelist').html("My guides <ol>"+mine.join('')+"</ol>" + "Sample guides <ol>"+others.join('')+"</ol>");
	$('li.guide').click(function(){
		html('Loading guide '+$(this).text()+AJAXLoader);
		ws({cmd:'guide',gid:$(this).attr('gid')},guideloaded);
		//loadGuide($('a[href="#sample"]').first().text(), "TAB ABOUT");
	});
}

$(document).ready(function () {
   // Everything loaded, execute.
   lang.set('en');

   if (typeof tinyMCE === "undefined") tinyMCE = {};


   // Activate TABS
   $("#tabnav").tabs(); // first tab on by default
   $("#tabviews").tabs({ selected: 0 });
	$('.tabset').tabs();
	//$('button').button();
	$('#vars_load').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	$('#vars_load2').button({label:'Load',icons:{primary:"ui-icon-locked"}}).next().button({label:'Save',icons:{primary:"ui-icon-locked"}});
	
  // layoutPanes();


   //   if (typeof initAdvanced != "undefined")      initAdvanced();


   // Menu bar
   jQuery(".megamenu").megamenu({ 'show_method': 'simple', 'hide_method': 'simple', mm_timeout: 125, 'enable_js_shadow': true, 'shadow_size': 5, 'deactivate_action': 'mouseleave click' });
   $('.megamenu li div ul li a').bind('click', (function () {
      var attr = $(this).attr('href');
      switch (attr) {
         case '#sample':
            //alert('Loading sample '+$(this).text());
            loadGuide($(this).text(), "tabsAbout");
            break;
         case '#mode1': setMode(1); break;
         case '#mode2': setMode(2); break;
         case '#mode3': setMode(3); break;
         case '#bold': document.execCommand('bold', false, null); break;
         case '#italic': document.execCommand('italic', false, null); break;
         case '#indent': document.execCommand('indent', false, null); break;
         case '#outdent': document.execCommand('outdent', false, null); break;
         case '#text2xml': toxml(); break;
         case '#collapse': hidem(1); break;
         case '#reveal': hidem(0); break;
         case '#theme':
            styleSheetSwitch($(this).text());
            break;
         default:
            alert('Unhandled ' + attr);
      }
      return false;
   }));



   //Ensure HTML possible for combo box pick list
   //https://github.com/scottgonzalez/jquery-ui-extensions/blob/master/autocomplete/jquery.ui.autocomplete.html.js
   $.extend($.ui.autocomplete.prototype, {
      _renderItem: function (ul, item) {
         return $("<li></li>")
				.data("item.autocomplete", item)
				.append($("<a></a>")[this.options.html ? "html" : "text"](item.label))
				.appendTo(ul);
      }
   });

   // Tips
   //window.setTimeout(hovertipInit, 1);

   // Click on section header to expand/collapse.
   if (0) $(".header").click(function () {
      $(this).next().toggle();
      //$(this).toggleClass('.sectionheader .collapsable');
   });


   // Draggable
   $('.hotspot').draggable({ containment: 'parent' }).resizable().fadeTo(0.1, 0.9);


   /*
   //8/3/2012 http://stackoverflow.com/questions/1176245/how-do-you-set-the-jquery-tabs-to-form-a-100-height
   function resizeUi() {
		 
   var h = $(window).height()-60;
   var w = $(window).width();
   $("#tabs").css('height', h-95 );
   $(".ui-tabs-panel").css('height', h-140 );
   };
   var resizeTimer = null;
   $(window).bind('resize', function() {
   if (resizeTimer) clearTimeout(resizeTimer);
   resizeTimer = setTimeout(resizeUi, 100);
   });
   resizeUi();
   */


	if (1)
	{
		loadGuide($('a[href="#sample"]').first().text(), "TAB ABOUT");
		$('#authortool').removeClass('hidestart').addClass('authortool');
		$('.welcome').hide();
		layoutPanes();
	}
	else
		signinask();


});
function checkLength( o, n, min, max ) {
	if ( o.val().length > max || o.val().length < min ) {
		 o.addClass( "ui-state-error" );
		 updateTips( "Length of " + n + " must be between " +
			  min + " and " + max + "." );
		 return false;
	} else {
		 return true;
	}
}

function signin(data)
{
	session.userid=data.userid;
	session.guideid=0;
	session.nickname=data.nickname;
	if (session.userid==0)
	{
		//status('Unknown user');
		//html('Please register...');
	}
	else
	{
		$('#memenu').text(session.nickname);
		$('#tabsinfo').html("Welcome "+session.nickname+" user#"+session.userid+'<p id="guidelist">Loading your guides '+AJAXLoader +"</p>");
		$( "#dialog-form" ).dialog( "close" );
		$('#authortool').removeClass('hidestart').addClass('authortool');
		$('.welcome').hide();
		layoutPanes();
		ws({cmd:'guides'},listguides);
	}
}

function signinask()
{
	$( "#dialog-form" ).dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			 "Sign in": function() {
				  var bValid = true;
				 // allFields.removeClass( "ui-state-error" );
		
				  //bValid = bValid && checkLength( name, "username", 3, 16 );
				  //bValid = bValid && checkLength( password, "password", 4, 16 ); 
				  ws({cmd:'login',username:$('#username').val(),userpass:$('#userpass').val()},signin);
			 },
			 Cancel: function() {
				  $( this ).dialog( "close" );
			 }
		},
		close: function() {
			 //allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});
	$( "#dialog-form" ).dialog( "open" );
}

function layoutPanes()
{
   // Splitter layout
   var outerLayout = $('#authortool').layout({ //$('body').layout({
      // enable showOverflow on west-pane so popups will overlap north pane
      enableCursorHotkey: false,
      west__showOverflowOnHover: false
		, north__showOverflowOnHover: true
		, north__size: 85
		, west__size: 300
		, east__size: 300
		, east__initClosed: false
		, north__closable: false, north__resizable: false
   });
   var eastLayout = $('div.ui-layout-east').layout({
      enableCursorHotkey: false,
      minSize: 50	// ALL panes
		, north__paneSelector: ".east-north"
		, north__size: 400
		, center__paneSelector: ".east-center"
   });
   //$('.ui-layout-center').layout({		center__onresize:  $.layout.callbacks.resizeTabLayout												});
}

function toxml()
{  // convert page at selection start into XML

}
function startCAJA(startTabOrPage)
{
	$('.CAJAContent').attr("CONTENTEDITABLE",editMode==1);
//	$('.CAJAContent').html(caja.dump());
	if(editMode==1)
		$('#CAJAContent').html(caja.convertToText());
	else
		gotoTabOrPage(startTabOrPage);
	$('#CAJAIndex').html(caja.convertIndex());
	$('#CAJAListAlpha').html(caja.convertIndexAlpha());
	$('#CAJAIndex li').click(showPageToEdit);
	if (editMode==1)
	{
		setMode(2);
		showPageToEditTextOnly(startTabOrPage);
	}
}

function setMode(mode)
{
	if (editMode==0){
		editMode=1;
		startCAJA();
		return false;
	}
	textonlyMode=mode;
	prompt('scanning');
	//$('.CAJAContent P').removeClass('hilite').filter(function(){ return $(this).text().indexOf('Question ')==0;}).addClass('hilite');
	$('.inform').remove();
	
	//alert($('.CAJAContent > P').length);
	$('.CAJAContent > P, .CAJAContent > DIV > P').each(function(){parseP($(this))});
	prompt('.');
	return false;
}
function showPageToEdit()
{	// Clicked on index, scroll to the right place in the document.
	var target=$(this).attr('target')
	if (editMode==1)
		showPageToEditTextOnly(target)
	else
		gotoTabOrPage(target);
}

function gotoTabOrPage(target)
{
	// Remove existing editors 
	
	for (var edId in tinyMCE.editors)
		tinyMCE.editors[edId].remove();
 

	
	if (target.indexOf("PAGE ")==0)
	{
		$('#CAJAContent').html('');
		caja.novicePage($('#CAJAContent'),target.substr(5));
		$('#tabviews').tabs('select','#tabsPageEdit');
	}
	else
	if (target.indexOf("STEP ")==0)
	{
		$('#CAJAContent').html('');
		 caja.noviceStep($('#CAJAContent'),target.substr(5));
		$('#tabviews').tabs('select','#tabsPageEdit');
	}
	else{
		 caja.noviceTab($('#'+target),target);
		$('#tabviews').tabs('select',target);
	}

	
	// Attach editors
	//attach all immediate $('.tinyMCEtext').each(function(){tinyMCE.execCommand("mceAddControl", false, $(this).attr('id'));	});
/*	$('.tinyMCEtext').click(function(){
		var id=$(this).attr('id');
		tinyMCE.execCommand("mceAddControl", false, id);
		tinyMCE.execCommand('mceFocus',true,id);
		
		});
*/
}


/*
TGuide.prototype.editTabs={};
TGuide.prototype.editTabs['interview']=[
	 {label:'lang.eiTitle',type:'text'}
	,{label:'lang.eiDescription',type:'textarea'}
	,{label:'lang.eiJurisdiction',type:'text'}
	,{label:'lang.eiAuthor',type:'textarea'}
	,{label:'lang.eiLogoGraphic',type:'graphic'}
];
*/
var form={
	 h1:function(h){
		return $("<h1>"+h+"</h1>");}
	,h2:function(h){
		return $("<h2>"+h+"</h2>").click(function(){$(this).next().toggle()});}
	,note:function(t){
		return $("<div>"+t+"</div>")}
	,text:    function(label,group,id,value){
		return $("<label>"+label+'</label><div class=widetext><input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"></div>');}
	,number:    function(label,group,id,value,minNum,maxNum){
		return "<label>"+label+'</label><input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"><BR/>';}
	,textarea:function(label,group,id,value,rows){
		if (typeof rows=="undefined") rows=1;
		return $('<label>'+label+'</label><textarea  class="text editable"  name="'+group+id+'" rows='+rows+'>'+value+'</textarea><BR/>');}
	,htmlarea:function(label,group,id,value,rows){
		if (typeof rows=="undefined") rows=1;
		return $(  (label!="" ? ('<label>'+label+'</label>') : '') + 
			'<div class=widetext><div contenteditable=true class="text editable tinyMCEtext" id="tinyMCE_'+group+id+'"  name="'+id+'" rows='+rows+'>'+value+'</div></div>');}
//	,htmlarea:function(label,group,id,value,rows){if (typeof rows=="undefined") rows=1;return '<label>'+label+'</label><textarea class="tinyMCEtext" style="width:100%" id="tinyMCE_'+group+id+'" name="'+id+'" rows='+rows+'>'+value+'</textarea><BR/>';}
	,div:function(clas,t){
		return '<div class="'+clas+'">'+t+'</div>';}
		
	,picklist:function(label,style,list,value){//let user choose number of said item
		var c=label+'<select class="ui-state-default ui-select '+style+'">';
		for (var o=0;o<list.length;o++)
			if (typeof list[o] === "object")
				c+="<option value="+list[o].value+">"+list[o].label+"</option>";
			else
				c+="<option value="+o+">"+list[o]+"</option>";
		c+="</select>";
		return $(c).val(value);
	}
	,pickscore:function(value){
		return this.picklist('','picker score',[
			{value:'RIGHT',label:'Right'},
			{value:'WRONG',label:'Wrong'},
			{value:'MAYBE',label:'Maybe'},
			{value:'INFO',label:'Info'}],value);
	}
	,pickbranch:function(){ 
		return this.picklist("",'picker branch',["Show feedback and return to question","Show feedback then branch to this page","Just branch directly to this page"])
		.change(function(){
			var br=$(this).val();
			$(this).parent().children('.text').toggle(br!=2);
			$(this).parent().children('.dest').toggle(br!=0);
			trace(br);
		})
	}
	,pickpage:function(name,value){ 
		return $('<input class="ui-state-default ui-combobox-input autocomplete picker page dest" type="text" name="'+name+'" value="'+htmlEscape(value)+'">');
	}
	
	,tablecount:function(label,minelts,maxelts, tablename){//let user choose number of said item
		var c=$('<label/>').text(label);
		var s='<select class="ui-state-default ui-select">';
		for (var o=minelts;o<=maxelts;o++)s+="<option>"+o+"</option>";
			s+="</select>";
		return $('<div/>').append(c.after(s).data('table',tablename));
	}
	,tablerange:function(list,headings){
		var $tbl=$('<table>').addClass('list');
		if (headings!==null){
			var tr="<tr valign=top>";
			for (var col in headings)
			{
				tr+="<th>"+headings[col]+"</th>";
			}
			tr+="</tr>";
			$tbl.append($(tr));
		}
		for (var row in list){
			var $row=$("<tr valign=top/>");
			for (var col in list[row].row)
			{
				//t+="<td>"+list[row].row[col]+"</td>";
				$row.append($("<td/>").append(list[row].row[col]));
			}
			//t+="<td>add/remove</td>";
			$tbl.append($row);
		}
		return $tbl;
//		return "<table class='list' >"+t+"</table>";
	}
	,row:function(cols){ return "<tr valign=top><td>"+cols.join("</td><td>")+"</td></tr>";}
	,rowheading:function(cols){ return "<tr valign=top><th>"+cols.join("</th><th>")+"</th></tr>";}
};



function pickPage(request,response)
{	// autocomplete page lists including internal text
	var matcherStarts = new RegExp(  '^'+$.ui.autocomplete.escapeRegex(request.term), "i" );
	var matcherContains = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
	var listStarts=[];
	var listContains=[];
	for (var p in caja.sortedPages)
	{
		var page=caja.sortedPages[p];
		var label= page.name;
		if (matcherStarts.test(page.name))
			listStarts.push({label:pickHilite(label,request.term),value:page.name});
		else
		if (matcherContains.test(page.name))
			listContains.push({label:pickHilite(label,request.term),value:page.name});
		/* search name and text
		var label="<b>"+page.name +"</b>: "+ page.text;
		if (matcherStarts.test(page.name))
			listStarts.push({label:pickHilite(label,request.term),value:page.name});
		else
		if (matcherContains.test(page.name))
			listContains.push({label:pickHilite(label,request.term),value:page.name});
		else
		if (matcherContains.test(label))
			listContains.push({label:pickHilite(label,request.term),value:page.name});
		*/
	}
	response(listStarts.concat(listContains).slice(0,30));
}

TGuide.prototype.noviceTab=function(div,tab)
{	// 08/03/2012 Edit panel for guide sections 
	var t=$('<div/>').addClass('editq');
	switch (tab){
		case "tabsAbout":
			var GROUP="ABOUT";
			t.append(form.h1('About'));
			t.append(form.text('Title:',GROUP,"title",this.title));
			t.append(form.textarea('Description',GROUP,"description",this.description,4));
			t.append(form.text('Jurisdiction:',GROUP,"jurisdiction",this.jurisdiction));
			t.append(form.textarea('Credits:',GROUP,"credits",this.credits));
			t.append(form.text('Approximate Completion Time:',GROUP,"completionTime",this.completionTime));
			
			t.append(form.h1('Authors'));
			t.append(form.text('Name:',GROUP,"name",this.name));
			
			t.append(form.h1('Revision History'));
			t.append(form.text('Current Version:',GROUP,"version",this.version));
			t.append(form.textarea('Revision History',GROUP,"history",this.history,7));

			break;
			
		case "tabsVariables":
			t.append(form.h1("Variables"));
			var tt=form.rowheading(["Name","Type","Comment"]); 
			//sortingNatural
			var sortvars=[];
			for (vi in this.vars) sortvars.push(this.vars[vi]);
			sortvars.sort(function (a,b){ if (a.sortName<b.sortName) return -1; else if (a.sortName==b.sortName) return 0; else return 1;});
			for (vi in sortvars)
			{
				v=sortvars[vi];
				tt+=form.row([v.name,v.type,v.comment]);
			}
			t+='<table class="A2JVars">'+tt+"</table>";
			break;
			
		case 'tabsSteps':
			t.append(form.h1("Steps"));
			var s;
			var tt=form.rowheading(["Number","Sign"]); 
			for (s in this.steps)
			{
				var step=this.steps[s];
				tt+=form.row([step.number,step.text]);
			}
			t+='<table class="A2JSteps">'+tt+"</table>";
			break;
	}
	
	div.append(t);
}

TGuide.prototype.noviceStep=function(div,stepid)
{	// Show all pages in specified step
	var t=$('<div/>');//.addClass('editq');
	var step=this.steps[stepid];
	t.append(form.h1("Step #"+step.number+" " + step.text));
	var stepPages=[];
	for (var p in this.pages)
	{
		var page = this.pages[p];
		if (page.step==stepid)
			stepPages.push(page);
	}
	t.append(form.note("There are "+stepPages.length+" pages in this step."));
	for (var p in stepPages)
	{
		var page = stepPages[p];
		t.append(form.h2("Page "+(parseInt(p)+1)+" of "+stepPages.length));
		this.novicePage(t,page.name);
	}
	div.append(t);
}


TGuide.prototype.convertIndex=function()
{	// Build outline for entire interview includes meta, step and question sections.
	var inSteps=[], s, p, page, ts;
	for (s in this.steps)
	{
		inSteps[s]="";
	}
	for (p in this.sortedPages)
	{
		page = this.sortedPages[p]; 
		inSteps[page.step] += '<li target="PAGE '+page.name+'">'+page.name+'</li>';
	}	
	ts="";
	for (s in this.steps)
	{
		ts+='<li target="STEP '+s+'">'+this.steps[s].number+". "+this.steps[s].text+"</li><ul>"+inSteps[s]+"</ul>";
	}

			
	return "<ul>"
			+ '<li target="tabsAbout">'+lang.tabAbout+'</li>'
			+ '<li target="tabsVariables">'+lang.tabVariables+'</li>'
			+ '<li target="tabsConstants">'+lang.tabConstants+'</li>'
			+ '<li target="tabsSteps">'+lang.tabSteps+'</li><ul>'+ts+'</ul>'
			+"</ul>";
}

TGuide.prototype.convertIndexAlpha=function()
{	// Build outline of just pages
	var txt="", p, page;
	for (p in this.sortedPages)
	{
		page = this.sortedPages[p]; 
		txt += '<li target="PAGE '+page.name+'">'+page.name+'</li>';
	}	
	return "<ul>" + txt +"</ul>";
}



function ws(data,results)
{	// Contact the webservice to handle user signin, retrieval of guide lists and load/update/cloning guides.
	trace(JSON.stringify(data));
	$.ajax({
		url:'CAJA_WS.php',
		dataType:'json',
		type: 'POST',
		data: data,
		success: function(data){ 
			trace(String.substr(JSON.stringify(data),0,299));
			results(data);
		},
		error: function(err,xhr) { alert("error:"+xhr.responseText ); }
	})
}  


