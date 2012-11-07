
			if (0){
				function makeField(field){
					var field1=form.record(field);
					field1.append(form.pickList({label:'Type:',value: field.type,change:function(val,field,form){
						field.type=val;
						updateFieldLayout(form,field);
						}},fieldTypesList ));
					field1.append(form.htmlarea({label:'Label:',   value:field.label, 
						change:function(val,field){field.label=val;}}));
					field1.append(form.text({label:'Variable:', value: field.name,
						change:function(val,field){field.name=val}}));
					field1.append(form.text({label:'Default value:',name:'default', value:  field.value,
						change:function(val,field){field.value=val}}));
					field1.append(form.checkbox({label:'Validation:', checkbox:'User must fill in', value:field.optional,
						change:function(val,field){field.optional=val}}));
					field1.append(form.text({label:'Max chars:',name:'maxchars', value: field.maxChars,
						change:function(val,field){field.maxChars=val;}}));
					field1.append(form.checkbox({label:'Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,
						change:function(val,field){field.calculator=val}}));
					field1.append(form.checkbox({label:'Calendar:', name:'calendar',checkbox:'Calendar available?', value:field.calendar,
						change:function(val,field){field.calendar=val}}));
					field1.append(form.text({label:'Min value:',name:'min',placeholder:'min', value: field.min,
						change:function(val,field){field.min=val}}));
					field1.append(form.text({label:'Max value:',name:'max',placeholder:'max', value: field.max,
						change:function(val,field){field.max=val}}));
					field1.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}}));
					updateFieldLayout(field1,field);
					return field1;
				}			
				var fs=form.fieldset('Fields');
				fs.append(form.tableRowCounter('fields','Number of fields:',0, CONST.MAXFIELDS,page.fields.length));
				var fields=[];
				for (var f in page.fields) {
					fields.push({ record:page.fields[f], row: [ makeField(page.fields[f])]});
				}/*
				for (var f=page.fields.length;f<CONST.MAXFIELDS;f++) {
					fields.push({ record:blankField, row: [ makeField(blankField)], visible:false });
				}*/
				fs.append(form.tableRows('fields','',fields));
			}/*
		$('.editicons .ui-icon-circle-plus',$tbl).click(function(){//live('click',function(){
			var row = $(this).closest('tr');
			row.clone(true,true).insertAfter(row).fadeIn();
			row.data('record',$.extend({},row.data('record')));
			save();
		});
		$('.editicons .ui-icon-circle-minus',$tbl).click(function(){//.live('click',function(){
			var line = $(this).closest('tr').remove();
			save();
		});
		*/			/*
		function save(){// save revised order or added/removed items
			var list=[];
			trace('Save table items');
			$('tr:gt(0)',$tbl).each(function(idx){
				trace(idx);
				list.push($(this).data('record'));
			});
			data.save(list);
		}*/

	
	,tableManager:function(data){
		var div = $('<div/>');//.append($('<label/>').text(data.label));
		/*
		var s='<select list="'+data.name+'" class="ui-state-default ui-select">';
		for (var o=data.min;o<=data.max;o++)s+="<option>"+o+"</option>";
			s+="</select>";
		s=$(s).val(data.list.length).change(function(){
			var val = ($('option:selected',this).val());
			$tbody = $(this).parent().find('table tbody');
			var rows = $('tr',$tbody).length;
			for (var r=0;r<rows;r++)
				$('tr:nth('+r+')',$tbody).showit(r<val);
			for (var r=rows;r<val;r++)
				$('tr:last',$tbody).clone(true).appendTo($tbody);//no longer used?
				
			});
		div.append(s);
		*/
		
		var $tbl=$('<table/>').addClass('list').data('data',data).attr('list',data.name);
		
		if (typeof data.columns!=="undefined")
		{
			var tr="<tr valign=top>" + "<th>-</th>" ;//+ "<th>#</th>";
			for (var col in data.columns)
			{
				tr+="<th>"+data.columns[col]+"</th>";
			}
			tr+="</tr>";
			$tbl.append($(tr));
		}
		function addRow(record)
		{
			var $row=$('<tr valign=top class="ui-corner-all" name="record"/>');
			$row.append($('<td class="editicons"/>')
				.append('<span class="ui-draggable sorthandle ui-icon ui-icon-arrowthick-2-n-s"/><span class="ui-icon ui-icon-circle-plus"/><span class="ui-icon ui-icon-circle-minus"/>'));
			//$row.append($("<td>"+(i+1)+"</td>"));
			//$row.append($("<td/>").append(data.create(data.list[i])));
			var cols = data.create(record);
			for (var c in cols){
				$row.append($('<td/>').append(cols[c]));
			}			
			$row.data('record',record); 
			$tbl.append($row);
		}
		
		for (var i=0;i<data.list.length;i++)
			addRow(data.list[i]);
			
		function save(){// save revised order or added/removed items
			var list=[];
			trace('Save table items');
			$('tr:gt(0)',$tbl).each(function(idx){
				trace(idx);
				list.push($(this).data('record'));
			});
			data.save(list);
		}
		$('tbody',$tbl).sortable({
			handle:"td .sorthandle",
			update:function(event,ui){
				save();
			}})//.disableSelection();

		$('.editicons .ui-icon-circle-plus',$tbl).click(function(){//live('click',function(){
			var row = $(this).closest('tr');
			row.clone(true,true).insertAfter(row).fadeIn();
			row.data('record',$.extend({},row.data('record')));
			save();
		});
		$('.editicons .ui-icon-circle-minus',$tbl).click(function(){//.live('click',function(){
			var line = $(this).closest('tr').remove();
			save();
		});
		div.append($tbl);
		div.append($('<button id="newrow"/>').button({label:'Add',icons:{primary:"ui-icon-plusthick"}}).click(function(){
			addRow($.extend({},data.blank));
			save();
		}));
		return div;
	} 
	
	
			/*
			fs.append(form.tableManager({name:'Fields',picker:'Number of fields',min:0,max:CONST.MAXFIELDS,list:page.fields,blank:blankField
				,columns:['Label','Var Name','Default Value','Type','Required?','Max Chars','Calc?','Calendar?','Min/Max Value','Invalid Prompt']
				,save:function(newlist){page.fields=newlist; }
				,create:function(field){
					var cols=[
						form.htmlarea({  value:field.label, 							change:function(val,field){field.label=val;}})
						,form.text({  value: field.name, placeholder:'variable',						change:function(val,field){field.name=val}})
						,form.text({  name:'default', placeholder:'default value',	value:  field.value, 				change:function(val,field){field.value=val}})
						,form.pickList({  value: field.type,change:function(val,field,form){
							field.type=val;
							updateFieldLayout(form,field);
							}},fieldTypesList)
						,form.checkbox({ checkbox:'', value:field.required, change:function(val,field){field.required=val}})
						,form.text({name:'maxchars', width:'3em', placeholder:'max chars',	value: field.maxChars,			change:function(val,field){field.maxChars=val;}})
						,form.checkbox({ name:'calculator',checkbox:'', value:field.calculator,change:function(val,field){field.calculator=val}})
						,form.checkbox({  name:'calendar',checkbox:'', value:field.calendar, change:function(val,field){field.calendar=val}})
						,form.text({ name:'min', placeholder:'min',	value: field.min, 						change:function(val,field){field.min=val}})
						.append(form.text({ name:'max',placeholder:'max',	 value: field.max, 						change:function(val,field){field.max=val}}))
						,form.htmlarea({value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}})
					];
					//updateFieldLayout(field1,field);
					return cols;
				}}));
				*/
			/*
			fs.append(form.tableRowCounter('buttons','Number of buttons:',1, CONST.MAXBUTTONS,page.buttons.length));
			function makeButton(b)
			{
				var record=form.record(b);
				record.append(form.text({label:'Label:', 				value: b.label,	change:function(val){b.label=val}}));
				record.append(form.text({label:'Var Name:', 			value: b.name, 	change:function(val){b.name=val}}));
				record.append(form.text({label:'Var Value:',			value: b.value,	change:function(val){b.value=val}}));
				record.append(form.pickpage({label:'Destination:', value: b.next, 	change:function(val){b.next=val;trace(b.next);}}));
				return record;
			}
			var buttons=[];
			for (var b in page.buttons) {
				buttons.push({ row: [ makeButton(page.buttons[b])]});
			}
			var blankButton=new TButton();
			for (var b=page.buttons.length;b<CONST.MAXBUTTONS;b++) {
				buttons.push({ row: [ makeButton(blankButton)], visible:false });
			}
			fs.append(form.tableRows('buttons','',buttons));
			*/
			fs.append(form.tableManager({name:'Buttons',picker:'Number of buttons',min:1,max:CONST.MAXBUTTONS,list:page.buttons,blank:blankButton
				,columns: ['Label','Var Name','Default value','Destination']
				,save:function(newlist){
					page.buttons=newlist; }
				,create:function(b){
					var cols=[
						form.text({ 		value: b.label,placeholder:'caption',		change:function(val,b){b.label=val}})
						,form.text({ 		value: b.name, placeholder:'variable',		change:function(val,b){b.name=val}})
						,form.text({ 		value: b.value,placeholder:'value',		change:function(val,b){b.value=val}})
						,form.pickpage({	value: b.next, 	change:function(val,b){b.next=val;}})
					];
					//updateFieldLayout(field1,field);
					return cols;
				}}));
			
			/*
			fs.append(form.tableManager({name:'Fields',picker:'Number of fields',min:0,max:CONST.MAXFIELDS,list:page.fields,blank:blankField,
				create:function(field){
					var field1=form.record(field); 
					field1.append(form.pickList({label:'Type:',value: field.type,change:function(val,field,form){
						field.type=val;
						updateFieldLayout(form,field);
						}},fieldTypesList ));
					field1.append(form.htmlarea({label:'Label:',   value:field.label, 							change:function(val,field){field.label=val;}}));
					field1.append(form.text({label:'Variable:', value: field.name, 						change:function(val,field){field.name=val}}));
					field1.append(form.text({label:'Default value:',name:'default', value:  field.value, 				change:function(val,field){field.value=val}}));
					field1.append(form.checkbox({label:'Validation:', checkbox:'User must fill in', value:field.optional, change:function(val,field){field.optional=val}}));
					field1.append(form.text({label:'Max chars:',name:'maxchars', value: field.maxChars,			change:function(val,field){field.maxChars=val;}}));
					field1.append(form.checkbox({label:'Calculator:',name:'calculator',checkbox:'Calculator available?', value:field.calculator,change:function(val,field){field.calculator=val}}));
					field1.append(form.checkbox({label:'Calendar:', name:'calendar',checkbox:'Calendar available?', value:field.calendar, change:function(val,field){field.calendar=val}}));
					field1.append(form.text({label:'Min value:',name:'min', value: field.min, 						change:function(val,field){field.min=val}}));
					field1.append(form.text({label:'Max value:',name:'max', value: field.max, 						change:function(val,field){field.max=val}}));
					field1.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,	change:function(val,field){field.invalidPrompt=val}}));
					updateFieldLayout(field1,field);
					return field1;
				}}));
				*/
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

TGuide.prototype.dump=function()
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




function js2xml(o)
{ 
	var t="";
	if (typeof o==="object")
	{
		for (var p in o)
			if (parseInt(p)>= 0)
				t += js2xml(o[p]);
			else
				t += "<"+p+">" + js2xml(o[p]) + "</"+p+">";
	}
	else
	if (typeof o !== 'function')
		t = o;
	return t;
}
	/*
	layout:function(div,curstep,steps,question,learnmore)
	{
		var stepcount=steps.length-curstep;
		var html=this.header;
		$(div).html(html);
		$('.interact',div).html(a2jviewer.layoutstep(stepcount));
		$('.A2JViewer .ui-form.question').html(question);
		$('.A2JViewer .ui-form.learnmore').html(learnmore);
		$('.stepnumber.step1').text(steps[curstep].number);
		$('.steptext.step1').text(steps[curstep].text);
		$('.circle1').attr('src',''+IMG+'step_circle_'+(curstep%3)+'.png');
		if (curstep<steps.length-1)
		{
			$('.stepnumber.step2').text(steps[curstep+1].number);
			$('.steptext.step2').text(steps[curstep+1].text);
			$('.circle2').attr('src',''+IMG+'step_circle_'+((curstep+1)%3)+'.png');
		}
		$('.A2JViewer button').button()
	},*/
	
	
	
	<p>8/3/2012 Novice mode instead. </p>
		<p>5/09/2012 Entire interview/lesson as an editable text file. jQuery provides immediate parsing to detect information - using Context Sensitive tool bar.</p>

				var ff={group:"Field",
					fields:[
						 {label:'Name',type:'text',id:'name',value: field.name}
						,{label:'Label',type:'text',id:'label',value: field.label}
						,{label:'Optional',type:'text',id:'optional',value: field.optional}
						,{label:'If invalid say:',type:"htmlarea",id:"invalidPrompt",value: field.invalidPrompt}
					]};
				tf.fieldsets.push(ff)//t+=walk(ff);		
	
		var tf= {
			title:"Page",
			fieldsets: [
				{	group:"Page info",
					fields:[
						 {label:"Name:", id:"name", type:"text", value: page.name }
						,{label:"Page type/style:", id:"typestyle", type:"text", value: page.type+"/"+page.style } 
						,{label:"Text:",id:"text",type:"htmlarea", rows:4, value:page.text}
					]
				} 
				]
		};
function walk(f)
{// 9/2012 old idea to define author edit forms as JSON. 
	var t;
	t="";
	for (var e in f)
	{
		var elt=f[e];
		switch(e){
			case "title":
				t+=form.h1(elt);
				break;
			case "group":
				t+=form.h2(elt);
				break;
			case "fieldsets":
				for (var fs in elt)
					t+=walk(elt[fs]);
				break;
			case "fields":
				//t+='<table class="list" width=100%>';
				for (var fi in elt){
					var field=elt[fi];
					var value=field.id;
					if (value.indexOf("meta.")==0)
						value=guide[value.substr(5)];
					var group="";
					switch (field.type){
						case "text":
							if (typeof field.value==="undefined") field.value="";
							t+=form.text(field.label,"group",field.id,field.value);
//							t+="<tr><td><label>"+field.label+'</label></td><td><input class="editable" type="text" name="'+group+field.id+'" value="'+htmlEscape(value)+'"></td></tr>';
							break;
						case "textarea":
							if (typeof field.rows==="undefined") field.rows=1; 
							if (typeof field.value==="undefined") field.value="";
							t+=form.textarea(field.label,"group",field.id,field.value, field.rows);
//							t+="<tr><td><label>"+field.label+'</label></td><td><textarea  class="editable"  name="'+group+field.id+'" rows='+field.rows+'>'+value+'</textarea></td></tr>';
							break;
						case "htmlarea":
							if (typeof field.rows==="undefined") field.rows=1; 
							if (typeof field.value==="undefined") field.value="";
							t+=form.htmlarea(field.label,"group",field.id,field.value,field.rows);
//							t+="<tr><td><label>"+field.label+'</label></td><td><div contenteditable=true class="editable tinyMCEtext" id="tinyMCE_'+group+field.id+'" name="'+field.id+'" rows='+field.rows+'>'+value+'</div></td></tr>';
							break;
						default:
							t+=form.h1("Unknown field type: " + field.type);
					}
				}
				//t+="</table>";
				break;
			default:
				t+=form.h1("Unknown elt: " + e);
		}
	}
	return t;
}
		/*
			var tf= {
				title:"Meta",
				fieldsets: [
					{	group:"About",
						fields:[
							 {label:"Title:",id:"meta.title",type:"text" }
							,{label:"Description:",id:"description",type:"textarea", rows:4}
							,{label:"Jurisdiction:",id:"jurisdiction",type:"text" }
							,{label:"Credits:",id:"credits",type:"textarea", rows:4}
							,{label:"Approximate Completion Time:",id:"completionTime",type:"text" }
						]
					}
					,{ group:"Authors",
						fields:[{label:"Name",id:"name",type:"text"}]
					}
					,{ group:"Revisions",
						fields:[
							 {label:"Current Version",id:"version",type:"text",}
							,{label:"Revision History:",id:"history",type:"textarea", rows:7}
							]
					}
					]
			}
			t+=walk(tf); 
*/






var clist=dlist=[];
			for (var d in page.details){
				var detail=page.details[d];
				clist.push({row:[
					{label:detail.label},
					{type:'scorepicker',value: detail.score},
					{type:'htmlarea',id:GROUP+"CHOICE"+d,value:detail.text}
				]});
				var fb=page.feedbacks[fbIndex(0,d)];
				dlist.push({row:
							  [{label:detail.label}
								,{type:'scorepicker',value:detail.score},
								{"SCORE",form.picklist("branchstyle",["Display feedback","Display feedback then jump","No feedback, just jump"])
+ form.htmlarea("",GROUP+"CHOICE"+d,"fb"+d,fb.text)]});
			}
			t+=form.h1('Choices');
			t+=form.tablecount("Number of choices",2,7) + form.tablerange(list);
			list=[];
			for (d in page.details){
			}  
			t+=form.h1('Feedback');
			t+=form.tablerange(list);