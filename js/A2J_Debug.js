/*******************************************************************************
	A2J_Debug.js
	CALI Author 5 / A2J Author 5 (CAJA) công lý
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Developer debugging.
	Not for use in production.
******************************************************************************/

/*   */
//var gGuideID, gPage, gUserID, gUserNickName;

// Comment DEBUGSTART() function out when NOT testing locally.
function DEBUGFIRST ()
{
	switch (  2 ){
		case 1:
			break;
		case 2:
			gotoPageView(gGuide.firstPage);
			gPage = gGuide.pages[gGuide.firstPage];
			dialogAlert({title:'DEBUG Interviews answers',body:prettyXML(gGuide.HotDocsAnswerSetXML()),width:800,height:600});
			//loadXMLAnswerExternal({url:'/SJGProjects/a2j/flash/data/Protection Order_replaced UTF8.anx'});
			gGuide.loadXMLAnswerExternal({url:'http://localhost/SJGProjects/CAJA/CAJA/js/tests/data/Protection Order_replaced UTF8.anx',success:function(){
				dialogAlert({title:'DEBUG Answer files answers',body:prettyXML(gGuide.HotDocsAnswerSetXML()),width:800,height:600});
				}});
			
			break;
	}
}
function DEBUGSTART(){
	trace("DEBUGSTART");
	gUserNickName='Tester';
	gUserID=0;
	var TESTMODE = 2;
	if ( TESTMODE===2 ) {
		// Hard code load db, skip login/interview selection steps.
		gGuideID =252;//238;//133;
		ws({cmd:'guide',gid:gGuideID},guideLoaded);
	}
	else
	{	// Load a local interview (can't be saved, used for quick UI testing 
		gGuideID=0;
		$('#welcome .tabContent').html("Welcome "+gUserNickName+" user#"+gUserID+'<p id="guidelist"></p>');
		var SAMPLES = [
			"tests/data/Field Types Test.a2j",
			"tests/data/Field Types Test.a2j#2-1-0 Pick Colors",
			"tests/data/A2J_NYSample_interview.xml",
			"tests/data/A2J_MobileOnlineInterview_Interview.xml",
			"tests/data/A2J_ULSOnlineIntake081611_Interview.xml",
			"tests/data/A2J_ULSOnlineIntake081611_Interview.xml#1b Submit Application for Review",
			"tests/data/Logic Tests.a2j",
			"tests/data/Field Characters Test.a2j",
			"tests/data/Field Characters Test.a2j#4-1 If thens",
			"tests/data/Field Characters Test.a2j#1-5 Fields Test 1",
			"tests/data/Field Characters Test.a2j#0-1 Intro",
			"tests/data/A2J_FieldTypesTest_Interview.xml#1-1 Name"
			//"tests/data/CBK_CAPAGETYPES_jqBookData.xml", 
			//"tests/data/CBK_CAPAGETYPES_jqBookData.xml#MC Choices 3: 4 choices", 
			//"tests/data/CBK_EVD03_jqBookData.xml",
			//"/a2j4guides/Field Types Test.a2j#2-1-0 Pick Colors",
			//"/a2j4guides/Logic Tests.a2j"
			
		];
		$(SAMPLES).each(function(i,elt){
			$('#samples, #guidelist').append('<li><a href="#sample">'+elt+'</a></li>');		
		});
		loadGuideFile(SAMPLES[0],'tabsGuides');
		//gotoTabOrPage('tabsGuides');
	}
	$('#splash').hide();
	$('#authortool').removeClass('hidestart');//.addClass('authortool').show
}


/* */
