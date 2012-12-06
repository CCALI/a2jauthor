var textonlyMode=0; // textonlyMode for single document editing
var editMode= 0 ; // editMode=0 if separate pages, =1 for single document

	//if(editMode==1)
	//	$('#advanced').html(gGuide.convertToText());
	//else
	
		//if (editMode==0) startTabOrPage = "PAGE " + startTabOrPage;


function showPageToEdit()
{	// Clicked on index, scroll to the right place in the document.
	var target=$(this).attr('target')
//	if (editMode==1)
//		showPageToEditTextOnly(target)
//	else
		gotoTabOrPage(target);
}



			/*
			fs.append(form.tableManager({name:'Authors',picker:'',min:1,max:12,list:guide.authors,blank:blankAuthor
				,columns: ['Name','Title','Organization','EMail']
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(author){
					var cols=[
						form.text({  placeholder:'author name',value:author.name,
							change:function(val,author){author.name=val}})
						,form.text({  placeholder:'job title',value:author.title,
							change:function(val,author){author.title=val}})
						,form.text({  placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val}})
						,form.text({  placeholder:'email',value:author.email,
							change:function(val,author){author.email=val}})
					];
					return cols;
				}}));*/

			
			/*
			fs.append(form.tableRowCounter('Steps','Number of steps',2, CONST.MAXSTEPS,guide.steps.length)); 
			var steps=[];
			for (var s in guide.steps)
			{
				var step=guide.steps[s];
				steps.push({ row: [form.text({value:step.number,class:'narrow'}),form.text({value:step.text})]});
			}
			fs.append(form.tableRows('Steps',['Step','Sign'],steps).addClass(''));
			t.append(fs);
			*/
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
x.header {
	border-bottom : 2px solid #cccccc;
	padding-top: 4px;
	padding-bottom: 0px;
	background-image: url(img/CAJA_Icon_48.png);
	background-repeat: no-repeat;
	padding-left: 50px;
}
function layoutPanes()
{
   // Splitter layout
	/*
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
		, north__size: 200
		, center__paneSelector: ".east-center"
   });
   
	*/
}


/**************************/
/* Frame Layout Theme  */
.ui-layout-pane { /* all 'panes' */
	border: 1px solid #BBB;
	padding: 10px;
	overflow:  hidden;
}
.ui-layout-content {
	overflow: auto;
}
.ui-layout-resizer { /* all 'resizer-bars' */
	background: #DDD;
}
.ui-layout-toggler { /* all 'toggler-buttons' */
	background: #AAA;
}
	<div class="ui-layout-east">
		<div class="east-north tabset">
			<ul>
				<li><a href="#tabsvars">Variables</a></li>
				<li><a href="#tabsvarssnapshots">Snapshots</a></li>
			</ul>
			<div class="ui-layout-content">
				<div id="tabsvars">
					<button id="vars_load"> </button>
					<button id="vars_save"> </button>
					<p>Variables</p>
				</div>
				<div id="tabsvarssnapshots">
					<button id="vars_load2"> </button>
					<button id="vars_save2"> </button>
					<p>Variables</p>
				</div>
			</div>
		</div>
		<div class="east-center tabset"> 
			<ul>
				<li><a href="#tabstracer">Tracer</a></li>
				<li><a href="#tabsextra">Extra</a></li>
			</ul>
			<div class="ui-layout-content">
				<div id="tabstracer"> 
			<ul id="tracer">
				<li> Player debug tracing goes here </li>
			</ul>
			
			
				</div>
				<div id="tabsextra"> 
					<p>extra</p>
				</div>
			</div>
			
	 </div>
	</div>

	<div class="ui-layout-south"><span id="CAJAStatus"></span><span style="float:right;text-align:right">All Contents &copy; CALI, The Center for Computer-Assisted Legal
		Instruction. All Rights Reserved.</span> </div>
/************** Menu bar ************/
ul.megamenu {
	background-color: transparent;
	z-index:2;
}
ul.megamenu a.mm-item-link:link, ul.megamenu a.mm-item-link:visited {
	color: #000;
}
ul.megamenu div ul {
	padding-left: 1em;
	list-style-type: none;
	padding: 0;
	margin: 0;
}
ul.megamenu div ul li {
	padding: .5em;
}
ul.megamenu div ul li:hover {
	background-color: #eee;
}

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
			
			
			
			
			

/* jquery.megamenu.min.js */
var isIE6=navigator.userAgent.toLowerCase().indexOf("msie 6")!=-1;jQuery.fn.megamenu=function(a){a=jQuery.extend({activate_action:"mouseover",deactivate_action:"mouseleave",show_method:"slideDown",hide_method:"slideUp",justify:"left",enable_js_shadow:true,shadow_size:3,mm_timeout:250},a);var b=this;if(a.activate_action=="click"){a.mm_timeout=0}b.children("li").each(function(){jQuery(this).addClass("mm-item");jQuery(".mm-item").css({"float":a.justify});jQuery(this).find("div:first").addClass("mm-item-content");jQuery(this).find("a:first").addClass("mm-item-link");var d=jQuery(this).find(".mm-item-content");var e=jQuery(this).find(".mm-item-link");d.hide();jQuery(document).bind("click",function(){jQuery(".mm-item-content").hide();jQuery(".mm-item-link").removeClass("mm-item-link-hover")});jQuery(this).bind("click",function(f){f.stopPropagation()});d.wrapInner('<div class="mm-content-base"></div>');if(a.enable_js_shadow==true){d.append('<div class="mm-js-shadow"></div>')}var c=0;jQuery(this).bind(a.activate_action,function(h){h.stopPropagation();var g=jQuery(this).find("a.mm-item-link");var f=jQuery(this).find("div.mm-item-content");clearTimeout(c);c=setTimeout(function(){g.addClass("mm-item-link-hover");f.css({top:(e.offset().top+e.outerHeight())-1+"px",left:(e.offset().left)-5+"px"});if(a.justify=="left"){var j=b.offset().left+b.outerWidth();var k=e.offset().left+d.outerWidth()-5;if(k>=j){f.css({left:(e.offset().left-(k-j))-2+"px"})}}else{if(a.justify=="right"){var i=b.offset().left;var l=e.offset().left-f.outerWidth()+e.outerWidth()+5;if(l<=i){f.css({left:i+2+"px"})}else{f.css({left:l+"px"})}}}if(a.enable_js_shadow==true){f.find(".mm-js-shadow").height(f.height());f.find(".mm-js-shadow").width(f.width());f.find(".mm-js-shadow").css({top:(a.shadow_size)+(isIE6?2:0)+"px",left:(a.shadow_size)+(isIE6?2:0)+"px",opacity:0.5})}switch(a.show_method){case"simple":f.show();break;case"slideDown":f.height("auto");f.slideDown("fast");break;case"fadeIn":f.fadeTo("fast",1);break;default:f.each(a.show_method);break}},a.mm_timeout)});jQuery(this).bind(a.deactivate_action,function(h){h.stopPropagation();clearTimeout(c);var g=jQuery(this).find("a.mm-item-link");var f=jQuery(this).find("div.mm-item-content");switch(a.hide_method){case"simple":f.hide();g.removeClass("mm-item-link-hover");break;case"slideUp":f.slideUp("fast",function(){g.removeClass("mm-item-link-hover")});break;case"fadeOut":f.fadeOut("fast",function(){g.removeClass("mm-item-link-hover")});break;default:f.each(a.hide_method);g.removeClass("mm-item-link-hover");break}if(f.length<1){g.removeClass("mm-item-link-hover")}})});this.find(">li:last").after('<li class="clear-fix"></li>');this.show()};

 //  jQuery(".megamenu").megamenu({ 'show_method': 'simple', 'hide_method': 'simple', mm_timeout: 125, 'enable_js_shadow': true, 'shadow_size': 5, 'deactivate_action': 'mouseleave click' });





			