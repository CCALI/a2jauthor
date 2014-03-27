﻿<!--
	A2J Author 5 * Justice * 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	2012-2014
-->
<html>
<head>
<title>Access to Justice</title>

<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,400italic&subset=latin,vietnamese,latin-ext' rel='stylesheet' type='text/css'>
<link href="viewer.jquery-ui.css" title="style"  rel="stylesheet" type="text/css"/>
<link href="jquery-ui.extra.css" rel="stylesheet" type="text/css" />
<link href="A2J_Viewer.css" rel="stylesheet" type="text/css" />

<SCRIPT LANGUAGE=JavaScript>
window.addEventListener("message",recieveMessage,false);
function recieveMessage(event) {
	gStartArgs  = event.data;
	main();
}
</SCRIPT>

<script src="jquery.1.8.2.min.js" type="text/javascript"></script>
<script src="jquery.ui.1.9.1.min.js" type="text/javascript"></script>

<script xsrc="jquery.1.10.2.min.js" type="text/javascript"></script>
<script xsrc="jquery.ui.1.10.3.min.js" type="text/javascript"></script>

<!-- 
	Include full source code for viewer app debugging
-->
	<script src="jquery.xml.min.js" type="text/javascript" ></script>
	<script src="A2J_Shared.js" type="text/javascript"></script>
	<script src="A2J_SharedSus.js" type="text/javascript"></script>
	<script src="A2J_Types.js" type="text/javascript"></script>
	<script src="A2J_Logic.js" type="text/javascript"></script>
	<script src="A2J_Languages.js" type="text/javascript"></script>
	<script src="A2J_Parser.js" type="text/javascript"></script>
	<script src="A2J_Viewer.js" type="text/javascript"></script>
	<script src="A2J_ViewerApp.js" type="text/javascript"></script>

<!-- 
	or include only minimized code
	<script src="jquery.custom.min.js" type="text/javascript" ></script>
	<script src="A2J_ViewerApp.min.js" type="text/javascript"></script>
-->

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
