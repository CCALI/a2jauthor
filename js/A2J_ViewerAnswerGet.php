<?php
/*
	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	02/2004 	
	04/15/2013

	
	This URL is called by the Flash A2J Viewer.
	It responds with a list of variables in HotDocs Answer file format.
	Which template and which user to draw the data for depends on the server's session.
	
*/
header("mime-type","plaintext/xml");
echo file_get_contents("tests/data/sample_answers-1.anx");
?>
