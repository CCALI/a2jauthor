<!--
	A2J Author 5 * Justice * 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	12/12/2012
	04/15/2013
-->
<html>
<head>
<title>Access to Justice</title>

<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,400italic&subset=latin,vietnamese,latin-ext' rel='stylesheet' type='text/css'>
<link href="viewer.jquery-ui.css" title="style"  rel="stylesheet" type="text/css"/>
<link href="jquery-ui.extra.css" rel="stylesheet" type="text/css" />
<link href="A2J_Viewer.css" rel="stylesheet" type="text/css" />


<SCRIPT LANGUAGE=JavaScript>
// Override these Javascript variables as needed to setup default interview/answer file loading.
<?php
	$gid=$_GET["gid"];
	$aid=$_GET["aid"];
?>
//var templateURL="/a2j4guides/Logic Tests.a2j";
//var templateURL="/a2j4guides/Field Types Test.a2j?r="+Math.random()+"#2-1-0 Pick Colors";
//var templateURL="tests/data/Field Types Test.a2j#2-1-0 Pick Colors";
//var templateURL="tests/data/A2J_FieldTypesTest_Interview.xml";
var templateURL="<?=$gid?>";
var fileDataURL="../tests/data/";
var getDataURL= "A2J_ViewerGetData.php?answersID=<?=$aid?>";
var setDataURL= "A2J_ViewerSetData.php?interviewID=<?=$gid?>";
var exitURL=   "A2J_ViewerExit.php?interviewID=<?=$gid?>";
var logURL=   "A2J_ViewerLog.php"; //"https://lawhelpinteractive.org/a2j_logging";
var errRepURL="A2J_ViewerErrRep.php";//"https://lawhelpinteractive.org/problem_reporting_form";

</script>

<script src="jquery.1.8.2.min.js" type="text/javascript"></script>
<script src="jquery.ui.1.9.1.min.js" type="text/javascript"></script>

<script xsrc="jquery.1.10.2.min.js" type="text/javascript"></script>
<script xsrc="jquery.ui.1.10.3.min.js" type="text/javascript"></script>

<?php
	if ( 1 == true ) { // include full source code for testing
?>
<script src="jquery.xml.min.js" type="text/javascript" ></script>
<script src="A2J_Shared.js" type="text/javascript"></script>
<script src="A2J_SharedSus.js" type="text/javascript"></script>
<script src="A2J_Types.js" type="text/javascript"></script>
<script src="A2J_Logic.js" type="text/javascript"></script>
<script src="A2J_Languages.js" type="text/javascript"></script>
<script src="A2J_Parser.js" type="text/javascript"></script>
<script src="A2J_Viewer.js" type="text/javascript"></script>
<script src="A2J_ViewerApp.js" type="text/javascript"></script>
<?php
	} else { // include minimized code
?>
<script src="jquery.custom.min.js" type="text/javascript" ></script>
<script src="A2J_ViewerApp.min.js" type="text/javascript"></script>
<?php
	}
?>


<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
<body class="a2jv ui-widget-content">

<div id="splash" class="welcome">
	<div align="center">
		<img src="images/A2J5_Icon_512.png"/>
	<P>Loading... <img alt="Loading..." src="images/ajax-loader.gif" width="16" height="16" /></P>
	</div>
</div>
<div id="page-viewer" class="hidestart ViewerApp a2jv">
	<div class="testing ui-widget-content">
		<div id="viewer-logic-form" class="ViewerLogicForm"><div class="tracepanel"><ol id="tracer" contentEditable="true"></ol></div><div class="immediatepanel"><span><input type="text" id="tracerimm"/></span></div></div>
		<div id="viewer-var-form" class="ViewerVarForm" ></div>
	</div>
	<div class="A2JViewer"></div>
</div>
<div id="dialog-confirm" class="a2jv" title=""></div>
<noscript>
	<div  class="NoJS">JavaScript is disabled. Please enable JavaScript to continue.</div>
</noscript>
</body>
</html>
