/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	05/2014
	
	Developer debugging.
	
	Supports immediate guide/answer file loading without signing in. 
	If only guide - loads guide directly, starts on author pane.
	Guide and answer - loads guide, starts in player mode after loading answers.
	
*/


function localGuideStart()
{	// Load up command line specified local test file
	//trace("localGuideStart");
	gUserNickName='Tester';
	gUserID=0;
	gGuideID=0;
	$('#welcome .tabContent').html("Welcome "+gUserNickName+" user#"+gUserID+'<p id="guidelist"></p>');
	if (gStartArgs.templateURL=='new')
	{
		gGuide = blankGuide();
		guideStart('tabsPages');   
	}
	else
	{
		loadGuideFile(gStartArgs.templateURL,'tabsPages');
	}
}

function localGuidePlay()
{	// Load up command line specified answer file and switch to play mode
	gotoPageView(gGuide.firstPage);
	gPage = gGuide.pages[gGuide.firstPage];
	//dialogAlert({title:'DEBUG Interviews answers',body:prettyXML(gGuide.HotDocsAnswerSetXML()),width:800,height:600});
	//loadXMLAnswerExternal({url:'/SJGProjects/a2j/flash/data/Protection Order_replaced UTF8.anx'});
	//load sample answer file
	gGuide.loadXMLAnswerExternal({url:gStartArgs.getDataURL
		//'http://localhost/SJGProjects/CAJA/CAJA/js/tests/data/Protection Order_replaced UTF8.anx',
		,success:function(){
			//dialogAlert({title:'DEBUG Answer files answers',body:prettyXML(gGuide.HotDocsAnswerSetXML()),width:800,height:600});
		}});
}



/* */
