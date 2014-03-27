<!--
	A2J Author 5 * Justice * 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	2012-2014
-->
<html>
<head>
	<title>Access to Justice Author 5 - Viewer Sampler</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body onload='sendArgsToFrame();'>
	<iframe id="A2JViewerFrame" width="100%" height="100%" src="A2J_ViewerFrame.php"></iframe> 
</body>

<SCRIPT LANGUAGE=JavaScript>
// Override these Javascript variables as needed to setup default interview/answer file loading.
function sendArgsToFrame(){
<?php
	// For demo purposes, we extract guide and answer file ids from the querystring and pass them on to the Viewer.
	$gid=$_GET["gid"];
	$aid=$_GET["aid"];
?>
	A2JViewerFrame.contentWindow.postMessage({
		templateURL:"<?=$gid?>",
		fileDataURL:"../tests/data/",
		getDataURL:	"A2J_ViewerGetData.php?answersID=<?=$aid?>",
		setDataURL:	"A2J_ViewerSetData.php?interviewID=<?=$gid?>",
		exitURL: 	"A2J_ViewerExit.php?interviewID=<?=$gid?>",
		logURL:   	"A2J_ViewerLog.php", //"https://lawhelpinteractive.org/a2j_logging";
		errRepURL:	"A2J_ViewerErrRep.php",//"https://lawhelpinteractive.org/problem_reporting_form";
		'':''
	}, "*")
	//alert('A2JViewerFrame.contentWindow.postMessage');
}
</SCRIPT>

</html>
