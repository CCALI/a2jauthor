/*	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
*/

/*       */
// Comment DEBUGSTART() function out when NOT testing locally.
function DEBUGSTART(){
	gUserNickName='Tester';
	gUserID=0;
	$('#welcome .tabContent').html("Welcome "+gUserNickName+" user#"+gUserID+'<p id="guidelist"></p>');
	var SAMPLES = [
		"/a2j4guides/Field Types Test.a2j#2-1 Pick Colors",
		"tests/data/A2J_MobileOnlineInterview_Interview.xml",
		"/a2j4guides/Logic Tests.a2j",
		"tests/data/A2J_ULSOnlineIntake081611_Interview.xml",
		"tests/data/A2J_ULSOnlineIntake081611_Interview.xml#1b Submit Application for Review",
		"tests/data/Field Characters Test.a2j",
		"tests/data/A2J_NYSample_interview.xml",
		"tests/data/Field Characters Test.a2j#4-1 If thens",
		"tests/data/Field Characters Test.a2j#1-5 Fields Test 1",
		"tests/data/Field Characters Test.a2j#0-1 Intro",
		"tests/data/A2J_FieldTypesTest_Interview.xml#1-1 Name",
		"tests/data/CBK_CAPAGETYPES_jqBookData.xml", 
		"tests/data/CBK_CAPAGETYPES_jqBookData.xml#MC Choices 3: 4 choices", 
		"tests/data/CBK_EVD03_jqBookData.xml"
	];
	$(SAMPLES).each(function(i,elt){
		$('#samples, #guidelist').append('<li><a href="#sample">'+elt+'</a></li>');		
	});
	loadGuideFile($('a[href="#sample"]').first().text(), "");
	$('#splash').hide();
	//$('#welcome').hide();
}


TGuide.prototype.noviceTab = function (tab,clear)//function noviceTab(guide,tab,clear)
{	// 08/03/2012 Edit panel for guide sections 
	var guide = this;
	var div = $('#'+tab);
	//if (div.html()!="") return;
	var t = $('.tabContent',div);
	if (clear){
		t.html("");
	}
	if (t.html()!==""){
		return;
	}
	
//	var t=$('<div/>').addClass('tabsPanel editq')//.append($('<div/>').addClass('tabsPanel2'));//editq
	form.clear();
	var fs;
	var ff;
	var p;
	var page;
	var pagefs;
	switch (tab){
	
		
		case "tabsVariables":
			guide.buildTabVariables(t);
			break;
			
		case "tabsConstants":
			fs = form.fieldset('Constants');
			t.append(fs);
			break;
		
		case "tabsLogic":
			t.append(form.note(
				prefs.ShowLogic=== 1 ? 'Showing only logic fields containing code' : 'Showing all logic fields'));
			
			var codeBeforeChange = function(val,page){
				page.codeBefore=val; /* TODO Compile for syntax errors */
			};
			var codeAfterChange = function(val,page){
				page.codeAfter=val; /* TODO Compile for syntax errors */
			};
			
			
			for (p in guide.sortedPages)
			{
				page=guide.sortedPages[p];
				if (page.type!==CONST.ptPopup)
				{
					if ((prefs.ShowLogic===2) || (prefs.ShowLogic===1 && (page.codeBefore!=="" || page.codeAfter!=="")))
					{
						pagefs=form.fieldset(page.name, page);
						if (prefs.ShowLogic===2 || page.codeBefore!==""){
							pagefs.append(form.codearea({label:'Before:',	value:page.codeBefore,change:codeBeforeChange} ));
						}
						if (prefs.ShowLogic===2 || page.codeAfter!==""){
							pagefs.append(form.codearea({label:'After:',	value:page.codeAfter,change:codeAfterChange} ));
						}
						t.append(pagefs);
					}
				}
			}
			
			break;
			
		case "tabsText":
			t.append(form.note(
				prefs.ShowText===1 ? 'All non-empty text blocks in this guide' : 'All text blocks in this guide'));
			for (p in guide.sortedPages)
			{
				page=guide.sortedPages[p];
				pagefs=form.fieldset(page.name, page);
				pagefs.append(form.htmlarea({label:'Text:',value:page.text,change:function(val,page){page.text=val; }} ));
				if (page.type!==CONST.ptPopup){
					if (prefs.ShowText===2 || page.learn!=="")
					{
						pagefs.append(form.text({label:'Learn More prompt:',placeholder:"",	value:page.learn,
							change:function(val,page){page.learn=val;}} ));
					}
					if (prefs.ShowText===2 || page.help!=="")
					{
						pagefs.append(form.htmlarea({label:"Help:",value:page.help,
							change:function(val,page){page.help=val;}} ));
					}
					if (prefs.ShowText===2 || page.helpReader!=="")
					{
						pagefs.append(form.htmlarea({label:'Help Text Reader:',value:page.helpReader,
							change:function(val,page){page.helpReader=val;}} ));
					}
					var f;
					for (f in page.fields)
					{
						var field = page.fields[f];
						ff=form.fieldset('Field '+(parseInt(f,10)+1),field);
						ff.append(form.htmlarea({label:'Label:',value:field.label,change:function(val,field){field.label=val;}}));
						if (prefs.ShowText===2 || field.value!=="")
						{
							ff.append(form.text({label:'Default value:',placeholder:"",name:'default', value:  field.value,change:function(val,field){field.value=val;}}));
						}
						if (prefs.ShowText===2 || field.invalidPrompt!=="")
						{
							ff.append(form.htmlarea({label:'If invalid say:',value: field.invalidPrompt,change:function(val,field){field.invalidPrompt=val;}}));
						}
						pagefs.append(ff);
					}
					var bi;
					for (bi in page.buttons)
					{
						var b = page.buttons[bi];
						var bf=form.fieldset('Button '+(parseInt(bi,10)+1),b);
						if (prefs.ShowText===2 || b.label!=="")
						{
							bf.append(form.text({value: b.label,label:'Label:',placeholder:'button label',
								change:function(val,b){b.label=val;}}));
						}
						if (prefs.ShowText===2 || b.value!=="")
						{
							bf.append(form.text({value: b.value,label:'Default value',placeholder:'Default value',
								change:function(val,b){b.value=val;}}));
						}
						pagefs.append(bf);
					}
				}
				t.append(pagefs);
			}
			
			break;
		
		case "tabsAbout":
			fs = form.fieldset('About');
			fs.append(form.text({label:'Title:', placeholder:'Interview title', value:guide.title, change:function(val){guide.title=val;}}));
			fs.append(form.htmlarea({label:'Description:',value:guide.description,change:function(val){guide.description=val;}}));
			fs.append(form.text({label:'Jurisdiction:', value:guide.jurisdiction, change:function(val){guide.jurisdiction=val;}}));
			//fs.append(form.text({label:'Language:', value:guide.language, change:function(val){guide.language=val;}}));
			
			var l,list=[];
			for (l in Languages.regional){
				list.push(l,Languages.regional[l].Language+' {'+l+'}');
			} 
			fs.append(form.pickList({label:'Language:', value:guide.language, change:function(val){guide.language=val;trace('Guide language is now '+guide.language);}},list));
			
			
			
			fs.append(form.htmlarea({label:'Credits:',value:guide.credits,change:function(val){guide.credits=val;}}));
			fs.append(form.text({label:'Approximate Completion Time:',placeholder:'',value:guide.completionTime,change:function(val){guide.completionTime=val;}}));
			t.append(fs);
			
			fs = form.fieldset('Layout');
			fs.append(form.pickImage({label:'Logo graphic:', placeholder: 'Logo URL',value:guide.logoImage, change:function(val){guide.logoImage=val;}}));
			fs.append(form.pickImage({label:'End graphic:', placeholder:'End (destination graphic) URL',value:guide.endImage, change:function(val){guide.endImage=val;}}));
			fs.append(form.pickList({label:'Mobile friendly?', value:guide.mobileFriendly, change:function(val){guide.mobileFriendly=val;}},['','Undetermined','false','No','true','Yes']));
			t.append(fs);
			
			fs = form.fieldset('Authors');
			var blankAuthor=new TAuthor();
			
			fs = form.fieldset('Revision History');  
			fs.append(form.text({label:'Current Version:',value:guide.version,change:function(val){guide.version=val;}}));
			fs.append(form.htmlarea({label:'Revision Notes',value:guide.notes,change:function(val){guide.notes=val;}}));
			t.append(fs);
			
			fs=form.fieldset('Authors');
			fs.append(form.listManager({name:'Authors',picker:'Number of authors',min:1,max:12,list:guide.authors,blank:blankAuthor
				,save:function(newlist){
					guide.authors=newlist; }
				,create:function(ff,author){
						ff.append(form.text({  label:"Author's Name:", placeholder:'name',value:author.name,
							change:function(val,author){author.name=val;}}));
						ff.append(form.text({  label:"Author's Title:", placeholder:'title',value:author.title,
							change:function(val,author){author.title=val;}}));
						ff.append(form.text({  label:"Author's Organization:", placeholder:'organization',value:author.organization,
							change:function(val,author){author.organization=val;}}));
						ff.append(form.text({  label:"Author's email:", placeholder:'email',value:author.email,
							change:function(val,author){author.email=val;}}));
					return ff;
				}}));
				
			t.append(fs);
			

			break;

		case 'tabsSteps':
		
			fs=form.fieldset('Start/Exit points');
			fs.append(form.pickpage({	value: guide.firstPage,label:'Starting Point:',	change:function(val){guide.firstPage=val;}}));
			fs.append(form.pickpage({	value: guide.exitPage,label:'Exit Point:',		change:function(val){guide.exitPage=val;}}));
			t.append(fs);
			fs=form.fieldset('Steps');
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
};


/* */
