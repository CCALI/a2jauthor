
function editButton()
{
	switch ($(this).attr('id')){
		case 'bold': document.execCommand('bold', false, null); break;
		case 'italic': document.execCommand('italic', false, null); break;
		case 'indent': document.execCommand('indent', false, null); break;
		case 'outdent': document.execCommand('outdent', false, null); break;
	}
}









function selectTab(target)
{
	$('#CAJAOutline li, #CAJAIndex li').each(function(){$(this).removeClass('ui-state-active')});
	$('li').filter(function(){ return target == $(this).attr('target')}).each(function(){$(this).addClass('ui-state-active')});
}
TGuide.prototype.pageRename=function(page,newName){
/* TODO Rename all references to this page in POPUPs, JUMPs and GOTOs */
	//trace("Renaming page "+page.name+" to "+newName);
	if (page.name==newName) return true;
	if (page.name.toLowerCase() != newName.toLowerCase())
	{
		if (this.pages[newName])
		{
			alert('Already a page named '+newName);
			return false
		}
	}
	// Rename GUI references
	var targetOld="PAGE "+page.name;
	var targetNew="PAGE "+newName;
	$('li').filter(function(){return targetOld==$(this).attr('target');}).each(function(){
		$(this).attr('target',targetNew);
		$(this).text(newName);
		})
	
	$('.page-edit-form').filter(function(){ return page.name == $(this).attr('rel')}).each(function(){
		$(this).attr('rel',newName);
		$(this).dialog({title:newName});
		})
	
	delete this.pages[page.name]
	page.name = newName;
	this.pages[page.name]=page;
	//trace("RENAMING REFERENES");
	return true;
}
TGuide.prototype.convertIndex=function()
{	// Build outline for entire interview includes meta, step and question sections.
	var inSteps=[];
	var popups="";
	for (s in this.steps)
	{
		inSteps[s]="";
	}
	for (var p in this.sortedPages)
	{
		var page = this.sortedPages[p];
		var plink= '<li target="PAGE '+page.name.asHTML()+'">'+page.name.asHTML()+'</li>';
		if (page.type==CONST.ptPopup)
			popups += plink;
		else
			inSteps[page.step] += plink;
	}	
	var ts="";
	for (var s in this.steps)
	{
		ts+='<li target="STEP '+s+'">'+this.steps[s].number+". "+this.steps[s].text+"</li><ul>"+inSteps[s]+"</ul>";
	}			
	return "<ul>"
			+ '<li target="tabsAbout">'+lang.tabAbout+'</li>'
			+ '<li target="tabsMapper">'+'Map'+'</li>'
			+ '<li target="tabsVariables">'+lang.tabVariables+'</li>'
			+ '<li target="tabsConstants">'+lang.tabConstants+'</li>'
			+ '<li target="tabsSteps">'+lang.tabSteps+'</li><ul>'+ts+'</ul>'
			+ '<li target="tabsPopups">'+lang.en('Popups')+'</li><ul>'+popups+'</ul>'
			+"</ul>";
}

TGuide.prototype.convertIndexAlpha=function()
{	// Build outline of just pages
	var txt="";
	for (var p in this.sortedPages)
	{
		var page = this.sortedPages[p]; 
		txt += '<li target="PAGE '+page.name.asHTML()+'">'+page.name.asHTML()+'</li>';
		console.log(page.name);
	}
	return "<ul>" + txt +"</ul>";
}


var form={
	id:0
	
	,editorAdd:function(elt){
		if (elt.parent().parent().find('.texttoolbar').length==0)
		//alert(elt.parent().parent().html());
			$('#texttoolbar').clone(true,true).attr('id','').prependTo(elt.parent()).show();
	}
	,editorRemove:function(elt){
		//$('#texttoolbar').hide();
	}
	,change: function(elt,val){
		var form= $(elt).closest('[name="record"]');
		trace("Changed value: "+elt);
		$(elt).data('data').change.call(elt,val,form.data('record'),form);
	}
	 ,h1:function(h){
		return $("<h1>"+h+"</h1>");}
		
	,h2:function(h){
		return $("<h2>"+h+"</h2>").click(function(){$(this).next().toggle()});}
		
	,noteHTML:function(kind,t){
		return '<div class="ui-widget"><div style="margin-top: 20px; padding: 0 .7em;" class="ui-state-highlight ui-corner-all"><p><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-'+kind+'"></span>'+t+'</div></div>';
	}
	,note:function(t){
		return $(form.noteHTML('info',t));
	}
	,noteAlert:function(t){
		return $(form.noteHTML('alert',t));
	}


	,fieldset:function(legend,record){
		return $('<fieldset name="record"><legend >'+legend+'</legend></fieldset>').data('record',record);;//.click(function(){$(this).toggleClass('collapse')});
	}
	,record:function(record){
		return $('<div name=record class=record/>').data('record',record);
	}
	,div:function(){
		return $('<div />');
	}
	//,number:    function(label,value,minNum,maxNum,handler){
	//	return "<label>"+label+'</label><input class="editable" type="text" name="'+group+id+'" value="'+htmlEscape(value)+'"> ';}
	
	,checkbox: function(data){
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span  class=editspan > <input class="ui-state-default ui-checkbox-input" type="checkbox" />'+data.checkbox+'</span></div>');
		$('input',e).blur(function(){ form.change($(this),$(this).is(':checked'))}).attr( 'checked',data.value==true ).data('data',data);
		return e;
	}
	
	
	,pickpage:function(data){ 
		//data.value = gGuide.pageDisplayName(data.value); 

		var dval = gGuide.pageDisplayName(data.value);
			
		var e =$( ''
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+ '<span class=editspan><input class="  ui-combobox-input editable autocomplete picker page dest" type="text" ></span>');
		$('.picker',e).blur(function(){
			var val=$(this).val();
			form.change($(this),val);
		}).data('data',data).val(decodeEntities(dval));
		$('.autocomplete.picker.page',e).autocomplete({ source: pickPage, html: true,
	      change: function () { // if didn't match, restore to original value
	         var matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex($(this).val().split("\t")[0]) + "$", "i");
	         var newvalue = $(this).val();//.split("\t")[0];
				trace(newvalue);
	         $.each(gGuide.sortedPages, function (p, page) {
					if (page.type!=CONST.ptPopup)
						if (matcher.test(page.name)) {
							newvalue = gGuide.pageDisplayName(page.name);
							return false;
						}
	         });
	         $(this).val(newvalue); 
	      }})
			.focus(function () {
			   $(this).autocomplete("search");
			});
		return e;
	}
	,text: function(data){
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan> <input class="  editable" placeholder="'+data.placeholder+'" type="text" /> </span></div>');
		if (typeof data.class!=='undefined') $('input',e).addClass(data.class);
		if (typeof data.width!=='undefined') $('input',e).css('width',data.class);
		$('input',e).blur(function(){ form.change($(this),$(this).val());}).val(decodeEntities(data.value)).data('data',data);
		return e;
	}
	,htmlarea: function(data){//label,value,handler,name){ 
		this.id++;
		var e= $('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan>'
			+'<div contenteditable=true class="  htmledit  text editable taller" id="tinyMCE_'+this.id+'"  name="'+this.id+'" rows='+1+'>'
			+data.value+'</div></span></div>');
		$('.editable',e).focus(function(){$(this).addClass('tallest');form.editorAdd($(this));}).blur(function(){
		//$(this).removeClass('tallest');
		form.editorRemove(this);
		form.change($(this),$(this).html());}).data('data',data) ;
		return e;
	} 
	,textarea: function(data){
		var rows=2;
		var e=$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><textarea  class="     text editable taller" rows='+rows+'>'+data.value+'</textarea></span></div>');
		$('.editable',e).blur(function(){form.change($(this),$(this).html());}).data('data',data);
		return e;
	}
	
	,pickAudio:function(data){ return this.text(data);}
	,pickImage:function(data){ return this.text(data);}
	,pickVideo:function(data){ return this.text(data);}
	
	,clear:function(){
		form.codeCheckList=[];
	}
	,finish:function(div){
	}
	,codeCheckIntervalID:0
	,codeCheckList:[]
	,codeCheckSoon:function(elt){
		if (form.codeCheckIntervalID==0)
			form.codeCheckIntervalID=setInterval(form.codeCheckInterval,100);
		form.codeCheckList.unshift(elt);
	}
	,codeCheckInterval:function(){ // syntax check one code block
		if (form.codeCheckList.length==0){
			clearInterval(form.codeCheckIntervalID);
			form.codeCheckIntervalID=0;
		}
		else
			form.codeCheck(form.codeCheckList.pop());
	}
	,codeCheck:function(elt){
		var code=$(elt).html();
		//TODO remove markup
		//alert(code);
		var lines = code.split('<br>');
		var script = _GCS.translateCAJAtoJS(lines.join("\n"));
		var tt="";
		var t=[];
		if (script.errors.length>0)
		{
		/*
			for (l=0;l<lines.length;l++)
			{
				var err=null;
				for (var e in script.errors)
					if (script.errors[e].line == l)
						err=script.errors[e];
				if (err == null)
					t.push(lines[l]);
				else
				{
					t.push('<span class="err">'+lines[l]+"</span>");
				}
			}
			*/
			
			for (var e in script.errors)
			{
				err=script.errors[e];
				tt+=form.noteHTML('alert',"<b>"+err.line+":"+err.text+"</b>");
			}
		}
		if(1)
		{
			t=[];
			t.push('JavaScript:');
			for (l=0;l<script.js.length;l++)
			{
				t.push(script.js[l]);
			}
			tt+=("<BLOCKQUOTE class=Script>"+t.join("<BR>")+"</BLOCKQUOTE>");
		}
		//tt=propsJSON('SCRIPT',script);
		$('.errors',$(elt).closest('.editspan')).html(tt);
	}
	,codearea:function(data){ 
		this.id++;
		var e= $('<div>'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<div class=editspan><div spellcheck="false" contenteditable=true class="text editable taller codeedit"  rows='+4+'>'+data.value+'</div><div class="errors"></div></div></div>');
		$('.editable',e).blur(function(){
			form.codeCheckSoon(this);
			form.change($(this),$(this).html());}).data('data',data);
		form.codeCheckSoon($('.codeedit',e));
		return e;
	}

	,pickList:function(data,listValueLabel){//list is array to ensure preserved order. Note: js object properties don't guarantee order
		var c="";
		for (var o=0;o<listValueLabel.length;o+=2)
			c+='<option value="'+listValueLabel[o]+'">'+listValueLabel[o+1]+'</option>';
		var e =$('<div name="'+data.name+'">'
			+(typeof data.label!=='undefined' ? ('<label>'+data.label+'</label>') : '')
			+'<span class=editspan><select class="     ui-select-input">'+c+'</select></span></div>');
		$('.ui-select-input',e).change(function(){form.change($(this),$('option:selected',this).val())}).data('data',data).val(data.value);
		return e;
	}
	,pickStep:function(data){
		var list=[];
		for (var s=0;s<gGuide.steps.length;s++){
			var step = gGuide.steps[s];
			list.push(s,step.number+". "+ (step.text));
		}
		return this.pickList(data,list);
		//var e =$('<div><label>'+label+'</label>' + '<select class="ui-state-default ui-select-input">'+o+'</select></div>');
		//$('.ui-select-input',e).change(function(){var val=$('option:selected',this).val();  $(this).data('data').change(val);}).data('data',handler).val(value);
		//return e;
	}
	,pickscore:function(label,value,handler){
		return this.pickList('','picker score',[
			'RIGHT','Right',
			'WRONG','Wrong',
			'MAYBE','Maybe',
			'INFO','Info'],value,handler);
	}
	,pickbranch:function(){ 
		return this.pickList("",'picker branch',[
		0,"Show feedback and return to question",
		1,"Show feedback then branch to this page",
		2,"Just branch directly to this page"])
		.change(function(){
			var br=$(this).val();
			$(this).parent().children('.text').toggle(br!=2);
			$(this).parent().children('.dest').toggle(br!=0);
			trace(br);
		})
	}
	
		
	//,clone:function(){return 'Clone buttons';}
	
	,tableRows:function(name,headings,rowList){
		var $tbl=$('<table/>').addClass('list').data('table',name).attr('list',name);
		if (typeof headings==="object"){
			var tr="<tr valign=top>";
			for (var col in headings)
			{
				tr+="<th>"+headings[col]+"</th>";
			}
			tr+="</tr>";
			$tbl.append($(tr));
		}
		for (var row in rowList){
			var $row=$("<tr valign=top/>");
			if (rowList[row].visible==false) $row.addClass('hidden');
			//$row.append($('<td class="editicons"/>').append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/><span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
			for (var col in rowList[row].row)
			{
				$row.append($("<td/>").append(rowList[row].row[col]));
			}
			
			$tbl.append($row);
			$row.data('record',rowList[row].record);
		
/*
			$row.hover(
				function(){ // start hovering
					$('.editicons').remove();
					$(this).append('<span class="editicons"><a href="#" class="ui-icon ui-icon-circle-plus"></a><a href="#" class="ui-icon ui-icon-circle-minus"></a></span>');
					$('.editicons .ui-icon-circle-plus').click(function(){
						// Insert blank statement above
						//alert($(this).closest('li').html());
						var line = $(this).closest('li');
						var cmd = $(this).closest('li').find('.adv.res').html();
					});
					$('.editicons .ui-icon-circle-minus').click(function(){
						// Delete statement line
						var line = $(this).closest('li');
						//line.remove();
					});
				},
				function(){ // stop hovering
					$('.editicons').remove();}
			);
			*/
			
		}
		$('tbody',$tbl).sortable({
			//handle:"td:eq(0)",
			handle:"td:eq(0) .sorthandle",
			update:function(){ }})//.disableSelection();

		$('.editicons .ui-icon-circle-plus',$tbl).click(function(){//live('click',function(){
			var row = $(this).closest('tr');
			row.clone(true,true).insertAfter(row).fadeIn();
		});
		$('.editicons .ui-icon-circle-minus',$tbl).click(function(){//.live('click',function(){
			var line = $(this).closest('tr').fadeOut("slow").empty();
		});
			
		return $tbl;
	}
	
	,tableRowCounter:function(name,label,minelts,maxelts,value)
	{	//let user choose number of said item
		var c=$('<label/>').text(label);
		var s='<select list="'+name+'" class="  ui-select">';
		for (var o=minelts;o<=maxelts;o++)s+="<option>"+o+"</option>";
			s+="</select>";
		return $('<div/>').append(c.after(s).change(function(){form.tableRowAdjust(name,$('option:selected',this).val());}).val(value));
	}
	
	,tableRowAdjust:function(name,val)
	{	// Adjust number of rows. set visible for rows > val. if val > max rows, clone the last row.
		$tbl = $('table[list="'+name+'"]');
		var settings=$tbl.data('settings');
		$tbody = $('tbody',$tbl);//'table[list="'+name+'"] tbody');
		var rows = $('tr',$tbody).length;
		trace('Changing rows from '+rows+' to '+val);
		//if (rows == val) return;
		
		for (var r=0;r<rows;r++)
			$('tr:nth('+r+')',$tbody).showit(r<val);
		for (var r=rows;r<val;r++)
			form.listManagerAddRow($tbl,$.extend({},settings.blank));
		form.listManagerSave($tbl);
	}
	
	,listManagerSave:function($tbl){// save revised order or added/removed items
		var settings=$tbl.data('settings');
		var list=[];
		$('tr',$tbl).not(':hidden').each(function(idx){ //:gt(0)
			list.push($(this).data('record'));
		});
		settings.save(list);
		$('select[list="'+settings.name+'"]').val(list.length);
	}
	,listManagerAddRow:function($tbl,record){
		var settings=$tbl.data('settings');
		var $row=$('<tr valign=top class="ui-corner-all" name="record"/>');
		$row.append($('<td class="editicons"/>')
			.append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/>'
			+'<span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
		$row.append($('<td/>').append(settings.create(form.div(),record)));
		$row.data('record',record); 
		$tbl.append($row);
	}
	,listManager:function(settings){
		// data.name:'Fields' data.,picker:'Number of fields:',data.min:0,data.max:CONST.MAXFIELDS,data.list:page.fields,data.blank:blankField,data.save=function to save,data.create=create form elts for record
		var div = $('<div/>');
		var $tbl=$('<table/>').addClass('list').data('settings',settings).attr('list',settings.name);
		div.append(form.tableRowCounter(settings.name,settings.picker,settings.min,settings.max,settings.list.length));
		for (var i=0;i<settings.list.length;i++)
			form.listManagerAddRow($tbl,settings.list[i]);
		$('tbody',$tbl).sortable({
			handle:"td .sorthandle",
			update:function(event,ui){
				form.listManagerSave((ui.item.closest('table')));
			}})

		div.append($tbl);
		/*(		div.append($('<button id="newrow"/>').button({label:'Add',icons:{primary:"ui-icon-plusthick"}}).click(function(){
			addRow($.extend({},settings.blank));
			save();
		}));

		*/
		return div;
	}
	
	
	
	
	,row:function(cols){ return "<tr valign=top><td>"+cols.join("</td><td>")+"</td></tr>";}
	,rowheading:function(cols){ return "<tr valign=top><th>"+cols.join("</th><th>")+"</th></tr>";}
};

