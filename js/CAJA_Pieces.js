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
						value=caja[value.substr(5)];
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