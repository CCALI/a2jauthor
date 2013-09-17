/*
 	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	04/15/2013

*/

/*  * /
// Comment DEBUGSTART() function out when NOT testing locally.
function DEBUGSTART(){
	trace("DEBUGSTART");
	gUserNickName='Tester';
	gUserID=0;
	var TESTMODE = 1;
	if ( TESTMODE===2 ) {
		// Hard code load db
		gGuideID =238;//238;//133;
		ws({cmd:'guide',gid:gGuideID},guideLoaded);
	}
	else
	{
		$('#welcome .tabContent').html("Welcome "+gUserNickName+" user#"+gUserID+'<p id="guidelist"></p>');
		var SAMPLES = [
			"tests/data/A2J_NYSample_interview.xml",
			"tests/data/A2J_MobileOnlineInterview_Interview.xml",
			"tests/data/A2J_ULSOnlineIntake081611_Interview.xml",
			"tests/data/A2J_ULSOnlineIntake081611_Interview.xml#1b Submit Application for Review",
			"tests/data/Logic Tests.a2j",
			"tests/data/Field Types Test.a2j#2-1-0 Pick Colors",
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
		loadGuideFile(SAMPLES[0],"");//$('a	[href="#sample"]').first().text(), "");
	}
	$('#splash').hide();
}
function signin()
{
	DEBUGSTART();
}
/* */

