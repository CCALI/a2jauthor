<!--
	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	12/12/2012
	04/15/2013
-->
<html>
<head>
<title>Access to Justice</title>

<link href="jQuery/themes/a2j/jquery-ui.css" title="style"  rel="stylesheet" type="text/css"/>
<link href="jQuery/jquery.ui.custom.css" rel="stylesheet" type="text/css" />
<link href="A2J_Viewer.css" rel="stylesheet" type="text/css" />


<SCRIPT LANGUAGE=JavaScript>
//var templateURL="/a2j4guides/Logic Tests.a2j";
var templateURL="/a2j4guides/Field Types Test.a2j#2-1-0 Pick Colors";
//var templateURL="tests/data/Field Types Test.a2j";
//var templateURL="tests/data/A2J_FieldTypesTest_Interview.xml";
var fileDataURL="tests/data/";
var getDataURL= "A2J_GetData.php";
var setDataURL= "A2J_SetData.php?interviewID=<?=$interviewID?>";
var exitURL=   "A2J_Exit.php?interviewID=<?=$interviewID?>";
var logURL=   "A2J_Log.php"; //"https://lawhelpinteractive.org/a2j_logging";
var errRepURL="A2J_ErrRep.php";//"https://lawhelpinteractive.org/problem_reporting_form";
</script>

<script src="jQuery/jquery.1.8.2.min.js" type="text/javascript"></script>
<script src="jQuery/jquery.ui.1.9.1.min.js" type="text/javascript"></script>
<script xsrc="jQuery/jquery.1.10.2.min.js" type="text/javascript"></script>
<script xsrc="jQuery/jquery.ui.1.10.3.min.js" type="text/javascript"></script>

<?php
	if ( 1 == true ) { // include full source code
?>
<script src="jQuery/jquery.xml.min.js" type="text/javascript" ></script>
<script src="CAJA_Utils.js" type="text/javascript"></script>
<script src="CAJA_Types.js" type="text/javascript"></script>
<script src="CAJA_Languages.js" type="text/javascript"></script>
<script src="CAJA_IO.js" type="text/javascript"></script>
<script src="CAJA_Parser.js" type="text/javascript"></script>
<script src="CAJA_Logic.js" type="text/javascript"></script>
<script src="CAJA_Parser_A2J.js" type="text/javascript"></script>
<script src="CAJA_Shared.js" type="text/javascript"></script>
<script src="A2J_Viewer.js" type="text/javascript"></script>
<script src="A2J_ViewerApp.js" type="text/javascript"></script>
<?php
	} else { // include minimized code
?>
<script src="jQuery/jquery.custom.min.js" type="text/javascript" ></script>
<script src="A2JViewer_min.js" type="text/javascript"></script>
<?php
	}
?>


<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
<body>

<div id="splash" class="welcome">
	<div align="center">
		<img src="img/A2J5_Icon_512.png"/>
	<P>Loading... <img alt="Loading..." src="img/ajax-loader.gif" width="16" height="16" /></P>
	</div>
</div>
<div id="page-viewer" class="hidestart ViewerApp">
	<div class="testing">
		<div id="viewer-logic-form" class="ViewerLogicForm"><div class="tracepanel"><ol id="tracer" contentEditable="true"></ol></div><div class="immediatepanel"><span><input type="text" id="tracerimm"/></span></div></div>
		<div id="viewer-var-form" class="ViewerVarForm" ></div>
	</div>
	<div class="A2JViewer"></div>
</div>
<div id="dialog-confirm" title=""></div>
<noscript>
	<div  class="NoJS">JavaScript is disabled. Please enable JavaScript to continue.</div>
</noscript>
</body>
</html>
