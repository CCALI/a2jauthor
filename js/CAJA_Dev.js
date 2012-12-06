

TGuide.prototype.pageFindReferences=function(findName,newName){
// ### Return list of pages and fields pointing to pageName in {name:x,field:y} pairs
	var guide=this;
	var matches=[];
	for (var p in guide.pages)
	{
		var page=guide.pages[p];
		function testtext(field,fieldname)
		{
			var add=false;
			page[field]=page[field].replace(/\"POPUP:\/\/(([^\"])+)\"/ig,function(match,p1,offset,string){
				var popupid=match.match(/\"POPUP:\/\/(([^\"])+)\"/i)[1];
				if (popupid==findName)
				{
					add=true;
					if (newName!=null)
					{
						//console.log('REPLACING '+popupid+" with "+htmlEscape(newName));
						popupid= htmlEscape(newName);
					}
				}
				return '"POPUP://' + popupid+ '"';
			});
			if (add)
			{
				matches.push({name:page.name,field:fieldname,text:page[field]});
			}
		}
		function testcode(field,fieldName)
		{
			var result=_GCS.pageFindReferences(page[field],findName,newName);
			if (result.add)
				matches.push({name:page.name,field:fieldName,text:''});
		}
		
		//text, help, codeBefore, codeAfter
		testtext('text','Text');
		testtext('help','Help');
		testcode('codeBefore','Logic Before');
		testcode('codeAfter','Logic After');
		for (var bi in page.buttons)
		{
			var b=page.buttons[bi];
			if (b.next==findName)
				matches.push({name:page.name,field:'Button '+b.label,text:b.label});
		}
		
		// TODO Check CODE scripts
	}
	return matches;
}



TGuide.prototype.varDelete=function(name){
	var guide=this;
	delete guide.vars[name.toLowerCase()];
	gGuide.noviceTab('tabsVariables',true);
}
function varAdd()
{
	var v= new TVariable();
	varEdit(v);
}
function varEdit(v/*TVariable*/)
{
	$('#varname').val(v.name);
	$('#vartype').val(v.type);
	$('#varcomment').val(v.comment);
	$('#varrepeating').val(v.repeating);
	$('#var-edit-form').data(v).dialog({
		autoOpen:true,
			width: 450,
			height: 300,
			modal:true,
			close: function(){
			},
			//http://stackoverflow.com/questions/2525524/jquery-ui-dialog-button-icons
			buttons:[
			{text:'Delete', click:function(){
				var name= $(this).data().name;
				if (name=="") return;
				DialogConfirmYesNo({title:'Delete variable '+name,message:'Delete this variable?',name:name,Yes:function(){
					$('#var-edit-form').dialog("close");
					gGuide.varDelete(this.name);
				}});
			}},
			{text:'Update',click:function(){ 
				var name= $('#varname').val();
				if(name!=v.name)//rename variable
				{
					delete gGuide.vars[v.name.toLowerCase()];
					v.name=name;
					gGuide.vars[name.toLowerCase()]=v;
				}
				v.type=$('#vartype').val();
				v.comment=$('#varcomment').val();
				v.repeating=$('#varrepeating').val();
				gGuide.noviceTab('tabsVariables',true);
				$(this).dialog("close");
			 }}
		]});
	
}
TGuide.prototype.buildTabVariables = function (t)
{
	var guide = this;
	t.append(form.h1('Variables'));
	var tt=form.rowheading(["Name","Type","Comment"]); 
	var sortvars=[];
	for (vi in guide.vars) sortvars.push(guide.vars[vi]);
	sortvars.sort(function (a,b){return sortingNaturalCompare(a.name,b.name);});
	for (vi in sortvars)
	{
		v=sortvars[vi];
		tt+=form.row([v.name,v.type,v.comment]);
	}

	t.append('<table class="A2JVars">'+tt+"</table>");
	$('tr',t).click(function(){
		varEdit(gGuide.vars[$('td:first',this).text().toLowerCase()]);
	});
}


TGuide.prototype.noviceTab = function (tab,clear)//function noviceTab(guide,tab,clear)
{	// 08/03/2012 Edit panel for guide sections 
	var guide = this;
	var div = $('#'+tab);
	//if (div.html()!="") return;
	var t = $('.tabContent',div);
	if (clear) t.html("");
	if (t.html()!="") return;
	
//	var t=$('<div/>').addClass('tabsPanel editq')//.append($('<div/>').addClass('tabsPanel2'));//editq
	form.clear();
	
	switch (tab){
	
	
		case "tabsVariables":
			guide.buildTabVariables(t);
			break;
			
		case "tabsConstants":
			var fs = form.fieldset('Constants');
			t.append(fs);
			break;
		
		case "tabsLogic":
			t.append(form.note('All logic blocks in this interview'));
			for (var p in guide.sortedPages)
			{
				var page=guide.sortedPages[p];
				if (page.type!=CONST.ptPopup)
				if ((prefs.ShowLogic==2) || (prefs.ShowLogic==1 && (page.codeBefore!="" || page.codeAfter!="")))
				{
					var pagefs=form.fieldset(page.name, page);
					if (prefs.ShowLogic==2 || page.codeBefore!="")
						pagefs.append(form.codearea({label:'Before:',	value:page.codeBefore,	change:function(val,page){
							page.codeBefore=val; /* TODO Compile for syntax errors */}} ));
					if (prefs.ShowLogic==2 || page.codeAfter!="")
						pagefs.append(form.codearea({label:'After:',	value:page.codeAfter, 	change:function(val,page){
							page.codeAfter=val ; /* TODO Compile for syntax errors */}} ));
					t.append(pagefs);
				}
			}
			
			break;
			
		case "tabsText":
			t.append(form.note('All non-empty page text blocks in this interview'));
			for (var p in guide.sortedPages)
			{
				var page=guide.sortedPages[p];
				var pagefs=form.fieldset(page.name, page);
				pagefs.append(form.htmlarea({label:'Text:',					value:page.text,			change:function(val,page){page.text=val; }} ));
				if (page.type!=CONST.ptPopup){
					if (prefs.ShowText==2 || page.learn!="")
						pagefs.append(form.text({label:'Learn More prompt:',placeholder:"",	value:page.learn,
							change:function(val,page){page.learn=val }} ));
					if (prefs.ShowText==2 || page.help!="")
						pagefs.append(form.htmlarea({label:"Help:",					value:page.help,
							change:function(val,page){page.help=val}} ));
					if (prefs.ShowText==2 || page.helpReader!="")
						pagefs.append(form.htmlarea({label:'Help Text Reader:',	value:page.helpReader,
							change:function(val,page){page.helpReader=val}} ));

					for (var f in page.fields)
					{
						var field = page.fields[f];
						var ff=form.fieldset('Field '+(parseInt(f)+1),field);
						ff.append(form.htmlarea({label:'Label:',   value:field.label, 
							change:function(val,field){field.label=val;}}));
						if (prefs.ShowText==2 || field.value!="")
							ff.append(form.text({label:'Default value:',placeholder:"",name:'default', value:  field.value,
								change:function(val,field){field.value=val}}));
						if (prefs.ShowText==2 || field.invalidPrompt!="")
							ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,
								change:function(val,field){field.invalidPrompt=val}}));						
						pagefs.append(ff);
					}
					for (var bi in page.buttons)
					{
						var b = page.buttons[bi];
						var bf=form.fieldset('Button '+(parseInt(bi)+1),b);
						if (prefs.ShowText==2 || b.label!="")
							bf.append(form.text({ 		value: b.label,label:'Label:',placeholder:'button label',
								change:function(val,b){b.label=val}}));
						if (prefs.ShowText==2 || b.value!="")
							bf.append(form.text({ 		value: b.value,label:'Default value',placeholder:'Default value',
								change:function(val,b){b.value=val}}));
						pagefs.append(bf);
					}
				}
				t.append(pagefs);
			}
			
			break;
		
		case "tabsAbout":
			var fs = form.fieldset('About');
			fs.append(form.text({label:'Title:', placeholder:'Interview title', value:guide.title, change:function(val){guide.title=val}}));
			fs.append(form.htmlarea({label:'Description:',value:guide.description,change:function(val){guide.description=val}}));
			fs.append(form.text({label:'Jurisdiction:', value:guide.jurisdiction, change:function(val){guide.jurisdiction=val}}));
			fs.append(form.htmlarea({label:'Credits:',value:guide.credits,change:function(val){guide.credits=val}}));
			fs.append(form.text({label:'Approximate Completion Time:',placeholder:'e.g., 2-3 hours',value:guide.completionTime,change:function(val){guide.completionTime=val}}));
			t.append(fs);
			
			var fs = form.fieldset('Authors');
			var blankAuthor=new TAuthor();
			
			var fs = form.fieldset('Revision History');  
			fs.append(form.text({label:'Current Version:',value:guide.version,change:function(val){guide.version=val}}));
			fs.append(form.htmlarea({label:'Revision Notes',value:guide.notes,change:function(val){guide.notes=val}}));
			t.append(fs);
			
			var fs=form.fieldset('Authors');
			fs.append(form.listManager({name:'Authors',picker:'Number of authors',min:1,max:12,list:guide.authors,blank:blankAuthor
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(ff,author){
						ff.append(form.text({  label:"Author's Name:", placeholder:'name',value:author.name,
							change:function(val,author){author.name=val}}));
						ff.append(form.text({  label:"Author's Title:", placeholder:'title',value:author.title,
							change:function(val,author){author.title=val}}));
						ff.append(form.text({  label:"Author's Organization:", placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val}}));
						ff.append(form.text({  label:"Author's email:", placeholder:'email',value:author.email,
							change:function(val,author){author.email=val}}));
					return ff;
				}}));
				
			t.append(fs);
			

			break;

		case 'tabsSteps':
			var fs=form.fieldset('Steps');
			var blankStep=new TStep();
			fs.append(form.listManager({grid:true,name:'Steps',picker:'Number of Steps',min:1,max:CONST.MAXSTEPS,list:guide.steps,blank:blankStep
				,save:function(newlist){
					guide.steps=newlist;
					updateTOC();
				}
				,create:function(ff,step){
						ff.append(form.text({  label:"Step Number:", placeholder:'#',value:step.number,
							change:function(val,step){
								step.number=val;
								updateTOC();}}));
						ff.append(form.text({  label:"Step Sign:", placeholder:'title',value:step.text,
							change:function(val,step){
								step.text=val;
								updateTOC();
							}}));
					return ff;
				}}));		
			t.append(fs);
			break;
	}
	form.finish(t);
}



TGuide.prototype.pageDelete=function(name){
	var guide=this;
	var page=guide.pages[name];
	// remove page from indexes
	var target="PAGE "+name;
	$('li').filter(function(){return target==$(this).attr('target');}).each(function(){
		$(this).remove();
	})
	// rename page edit title bar
	$('.page-edit-form').filter(function(){
		return page.name == $(this).attr('rel')}).each(function(){
			$(this).dialog('close');})

	// TODO Anything pointing to this page is redirect to NOWHERE
	
	delete guide.pages[page.name]
}
