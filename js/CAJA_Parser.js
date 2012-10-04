/* 02/20/2012 Parse XML of A2J, CALI Author or native CAJA into CAJA structure */
//(function () {   
//"use strict";



/*
TCAJA.prototype.editTabs={};
TCAJA.prototype.editTabs['interview']=[
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


TCAJA.prototype.pageIDtoName=function(id)
{
	if (this.mapids[id])
	{
		id = this.mapids[id].name;
	}
	else
	{
		var autoIDs={};
		autoIDs[qIDNOWHERE]=	lang.qIDNOWHERE;//"[no where]"
		autoIDs[qIDSUCCESS]=	lang.qIDSUCCESS;//"[Success - Process Form]"
		autoIDs[qIDFAIL]=   	lang.qIDFAIL;//"[Exit - User does not qualify]"
		autoIDs[qIDEXIT]=		lang.qIDEXIT;//"[Exit - Save Incomplete Form]"//8/17/09 3.0.1 Save incomplete form
		autoIDs[qIDBACK]=		lang.qIDBACK;//"[Back to prior question]"//8/17/09 3.0.1 Same as history Back button.
		autoIDs[qIDRESUME]=	lang.qIDRESUME;//"[Exit - Resume interview]"//8/24/09 3.0.2
		if (typeof autoIDs[id]=="undefined")
			id=lang.UnknownID.printf(id,props(autoIDs)) //"[Unknown id "+id+"]" + props(autoIDs);
		else
			id=autoIDs[id];
	}
	return id;
}

TCAJA.prototype.convertIndex=function()
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
			+ '<li target="TAB META">'+lang.tabAbout+'</li>'
			+ '<li target="TAB VARS">'+lang.tabVariables+'</li>'
			+ '<li target="TAB CONST">'+lang.tabConstants+'</li>'
			+ '<li target="TAB STEPS">'+lang.tabSteps+'</li><ul>'+ts+'</ul>'
			+"</ul>";
}

TCAJA.prototype.convertIndexAlpha=function()
{	// Build outline of just pages
	var txt="", p, page;
	for (p in this.sortedPages)
	{
		page = this.sortedPages[p]; 
		txt += '<li target="PAGE '+page.name+'">'+page.name+'</li>';
	}	
	return "<ul>" + txt +"</ul>";
}




function parseXML_CAJA_to_CAJA(CAJA)
{	// Parse parseCAJA
	var caja=new TCAJA();
	caja.viewer="CAJA";
	caja.title = CAJA.find('TITLE').text();
	return caja;
}

function parseXML_Auto_to_CAJA(cajaData)
{	// Parse XML into CAJA
	var caja;
	trace("Parse XML data");
	if ((cajaData.find('A2JVERSION').text())!="")
		caja=parseXML_A2J_to_CAJA(cajaData);// Parse A2J into CAJA
	else
	if ((cajaData.find('CAJAVERSION').text())!="")
		caja=parseXML_CAJA_to_CAJA(cajaData);// Parse CALI Author into CAJA
	else
		caja=parseXML_CA_to_CAJA(cajaData);// Parse Native CAJA
		
	caja.sortedPages=caja.sortedPages.sort(function (a,b){ if (a.sortName<b.sortName) return -1; else if (a.sortName==b.sortName) return 0; else return 1;});

	return caja;
}


TCAJA.prototype.noviceTab=function(tab)
{	// 08/03/2012 Edit panel for guide sections
	var t="";
	switch (tab){
		case "META":
			var GROUP="ABOUT";
			t+=form.h1('About');
			t+=form.text('Title:',GROUP,"title",this.title);
			t+=form.textarea('Description',GROUP,"description",this.description,4);
			t+=form.text('Jurisdiction:',GROUP,"jurisdiction",this.jurisdiction);
			t+=form.textarea('Credits:',GROUP,"credits",this.credits);
			t+=form.text('Approximate Completion Time:',GROUP,"completionTime",this.completionTime);
			
			t+=form.h1('Authors');
			t+=form.text('Name:',GROUP,"name",this.name);
			
			t+=form.h1('Revision History');
			t+=form.text('Current Version:',GROUP,"version",this.version);
			t+=form.textarea('Revision History',GROUP,"history",this.history,7);

			break;
			
		case "VARS":
			t+=form.h1('Variables');
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
			
		case 'STEPS':
			t+=form.h1("Steps");
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
	
	return form.div("editq",t); 
}
TCAJA.prototype.noviceStep=function(stepid)
{	// Show all pages in specified step
	var t="";
	var step=this.steps[stepid];
	t += form.h1("Step #"+step.number+" " + step.text);
	for (var p in this.pages)
	{
		var page = this.pages[p];
		if (page.step==stepid)
			t += this.novicePage(page.name);
	}
	return t;
}

//}());


TCAJA.prototype.dump=function()
{	// Generate report of entire CAJA contents
	var txt="",p, f, b, page, field, button,txtp;
	
	function row(a,b,c,d){return '<tr><td>'+a+'</td><td>'+b+'</td><td>'+c+'</td><td>'+d+'</td></tr>\n'};
	txt += row('title','','',this.title)
		+row('viewer','','',this.viewer)
		+row('description','','',this.description);
	for (p in this.pages)
	{
		page = this.pages[p];
		txtp= row(page.id,'','id',page.id)
			+  row(page.id,'','name',page.name)
			+  row(page.id,'','text',page.text);
		for (f in page.fields)
		{
			field=page.fields[f];
			txtp += row(page.id,'field'+f,'label',field.label);
			txtp += row(page.id,'field'+f,'type',field.type);
			txtp += row(page.id,'field'+f,'name',field.name);
			txtp += row(page.id,'field'+f,'optional',field.optional);
			txtp += row(page.id,'field'+f,'invalidPrompt',field.invalidPrompt);
		}
		for (b in page.buttons)
		{
			button=page.buttons[b];
			txtp += row(page.id,'button'+b,'label',button.label);
			txtp += row(page.id,'button'+b,'next',button.next);
		}
		txt += txtp;
	}
	return '<table class="CAJAReportDump">'+txt+'</table>';
}













TCAJA.prototype.novicePage=function(div,pagename)
{	// Create editing wizard for given page.
	var t="";
	var page = this.pages[pagename];
	

	var t=$('<div/>').addClass('editq');

if( 1 ){
	if (page==null)
	{
		t+="Page not found "+pagename;
	}
	else
	{
		var GROUP = page.id;

		t.append($('<h2/>').text('Your Page & all Info'));
		t.children('h2').click(function(){alert('click h2');});
		
		
		t.append(form.h2('Page info'));
		t.append(form.text('Name:',GROUP,"name",page.name));
		
		if (page.type!="A2J"){
			t.append(form.h2("Page type/style: "+page.type+"/"+page.style));
		}
		t.append(form.htmlarea('Text',GROUP,"text",page.text));

		
		var b,d,detail,fb,t1,t2,list;
		
		if (page.type=="A2J" || page.fields.length>0)
		{
			//t+=form.h1('Fields');
			for (var f in page.fields)
			{
				var field=page.fields[f];
				var GROUPFIELD = GROUP+"_FIELD"+f; 
				t.append(form.text('Name',GROUPFIELD,'name',field.name));
				t.append(form.text('Label',GROUPFIELD,'label',field.label));
				t.append(form.text('Optional',GROUPFIELD,'optional',field.optional));
				t.append(form.htmlarea('If invalid say:',GROUPFIELD,"invalidPrompt",field.invalidPrompt));	  
			}
		}
		
		if (page.type == "Book page"){}
		else
		if (page.type=="Multiple Choice" && page.style=="Choose Buttons")
		{
			for (var b in page.buttons){
//				t1+=form.short(page.
				t.append(text2P("Feedback for Button("+(parseInt(b)+1)+")"));
				fb=page.feedbacks[fbIndex(b,0)];
				pageText+=html2P(fb.text);
			}
		}
		else if (page.type=="Multiple Choice" && page.style=="Choose List") {
			var clist=[];
			var dlist=[];
			for (var d in page.details){
				var detail=page.details[d];
				var fb=page.feedbacks[fbIndex(0,d)];
				var $fb=$('<div/>').append(form.pickbranch())
					 .append(form.pickpage("dest",makestr(fb.next)))
					 .append(form.htmlarea("",GROUP+"CHOICE"+d,"fb"+d,fb.text));
				var brtype=makestr(fb.next)=="" ? 0 : (makestr(fb.text)=="" ? 2 : 1);
				$('select.branch',$fb).val(brtype).change();
				clist.push({row:[detail.label,form.pickscore(fb.grade), form.htmlarea("",GROUP+"CHOICE"+d,"detail"+d,detail.text) ]});
				dlist.push({row:[detail.label,form.pickscore(fb.grade),$fb]});
			}
			t.append(form.h1('Choices'));
			t.append(form.tablecount("Number of choices",2,7,'choices').after(form.tablerange('choices',clist)));
			
			t.append(form.h1('Feedback'));
			t.append(form.tablerange(dlist));
			
		}
		else if (page.type=="Multiple Choice" && page.style=="Choose MultiButtons"){
			for (d in page.details){
				detail=page.details[d];
				pageText+=text2P("Subquestion "+ (parseInt(d)+1)); 
				pageText+=html2P(detail.text);
			}
			for (d in page.details)
			{
				for (b in page.buttons)
				{	
					button=page.buttons[b];
					fb=page.feedbacks[fbIndex(b,d)];
					pageText+=text2P("Feedback for subquestion " +(parseInt(d)+1) + ", Choice("+button.label+")");
					pageText+=html2P(fb.text);
				}
			}
		}
		else if (page.type=="Multiple Choice" && page.style=="Radio Buttons") 		{}
		else if (page.type=="Multiple Choice" && page.style=="Check Boxes")				{}
		else if (page.type=="Multiple Choice" && page.style=="Check Boxes Set")			{}
		else if (page.type=="Text Entry" && page.style=="Text Short Answer")				{}
		else if (page.type=="Text Entry" && page.style=="Text Select") {
			t.append(form.htmlarea("Text user will select from","SELECT","textselect",page.initialText,8));
			list=[];
			for (ti in page.tests){
				var test=page.tests[ti];
				list.push({row:[
									 form.number("","","test"+ti,test.slackWordsBefore,0,9999),
								  form.number("","","test"+ti,test.slackWordsAfter,0,9999),
												  form.htmlarea("",GROUP+"test"+ti,"test"+ti,test.text,4)
				 ]});
			}
			t.append(form.h2('Selection matches'));
			t.append(form.tablecount("Number of tests",1,5) + form.tablerange(list,["Slack words before","Slack words after","Words to match"]));
			
			t.append(form.textarea("script"));
			}
		else if (page.type=="Text Entry" && page.style=="Text Essay")						{}
		else if (page.type=="Prioritize" && page.style=="PDrag")								{}
		else if (page.type=="Prioritize" && page.style=="PMatch")							{}
		else if (page.type=="Slider")																	{}
		else if (page.type=="GAME" && page.style=="FLASHCARD")								{}
		else if (page.type=="GAME" && page.style=="HANGMAN")									{} 		
		
		
	
	//pageText += html2P(expandPopups(this,page.text));
			
		t.append(form.htmlarea("Learn more help","help",makestr(page.help)));
		t.append(form.textarea('Notes',GROUP,"note",makestr(page.notes)));

	}
	//t+=form.h1('XML')+htmlEscape(page.xml);
	
}
	
	/*
	var t=$('<input/>',{
		id:'test',
		click:function(){alert('hi');},
		addClass:'ui-input'
	  });
	);*/

//	editq.append(t);
//	form.html(t);
	div.append(t);
	
//	div.append(htmlEscape($(t).html()));
	div.append(htmlEscape(page.xml));

	
//	div.append(form.div("editq",t));

	// Attach event handlers
	/*
	$('.picker.branch').change(function(){
		var br=$(this).val();
		$(this).parent().children('.text').toggle(br!=2);
		$(this).parent().children('.dest').toggle(br!=0);
	})
	*/
	
	$('.autocomplete.picker.page').autocomplete({source:pickPage, html:true, 
		change:function(){ // if didn't match, restore to original value
			var matcher = new RegExp(  '^'+$.ui.autocomplete.escapeRegex($(this).val())+"$", "i" );
			var newvalue=$(this).data('org');//attr('orgval');
			$.each(caja.pages,function(p,page){
				if (matcher.test(page.name))
				{
					newvalue= page.name
					return false;
				}
			});
			$(this).val(newvalue);
			$(this).data('org',$(this).val());
//			$(this).attr('orgval',$(this).val());
			}})
		.focus(function(){
			console.log($(this).val());
			$(this).autocomplete("search");
		});
}
