<!-- 3/10/2011 SJG -->
<html>
<head>
<title>A2J Player</title>


<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js" type="text/javascript"></script>
<link  href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/smoothness/jquery-ui.css"  rel="stylesheet" type="text/css"/>

<link  href="jquery.ui.custom.css" rel="stylesheet" type="text/css" />
<script src="jquery.ui.custom.min.js" type="text/javascript" ></script>

<link  xhref="jQuery/themes/base/jquery.ui.all.css" rel="stylesheet">
<link  href="A2JViewer.css"  rel="stylesheet" type="text/css"/>
<script xsrc="jQuery/external/jquery.bgiframe-2.1.2.js"></script>

<script src="CAJA_Types.js" type="text/javascript"></script>
<script src="CAJA_Utils.js" type="text/javascript"></script>
<script src="CAJA_Languages.js" type="text/javascript"></script>
<script src="CAJA_Parser.js" type="text/javascript"></script>
<script src="CAJA_Parser_CA.js" type="text/javascript"></script>
<script src="CAJA_Parser_A2J.js" type="text/javascript"></script>
<script src="A2JViewer.js" type="text/javascript"></script>


<SCRIPT LANGUAGE=JavaScript>
var templateURL="tests/data/A2J_FieldTypesTest_Interview.xml";
var fileDataURL="tests/data/";
var getDataURL= "A2JGetData.php";
var setDataURL= "A2JSetData.php?interviewID=<?=$interviewID?>";
var exitURL=   "../A2JExit.php?interviewID=<?=$interviewID?>";
var logURL=   "../A2JLog.php"; //"https://lawhelpinteractive.org/a2j_logging";
var errRepURL="../A2JErrRep.php";//"https://lawhelpinteractive.org/problem_reporting_form";
</script>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
<body>

<div id="Loader"><img alt="A2J" src="img/A2J_32.png" width="32" height="32" border="0"/>
	<P>Loading... <img alt="Loading..." src="img/ajax-loader.gif" width="16" height="16" /></P>
	<noscript>
	<div  class="NoJS">JavaScript is disabled. Please enable JavaScript to continue.</div>
	</noscript>
</div>
<div class="ViewerApp hidestart">
</div>



<div class="infobar">
	<h2>Trace:</h2>
	<div id="tracer">trace</div>
</div>
</body>
</html>
