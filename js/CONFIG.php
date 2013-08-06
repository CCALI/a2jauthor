<?php
	define("GUIDES_DIR",'/path/to/caja/guides/');
	$mysqli = new mysqli("DB SERVER","DB USER","PASSWORD","DB");
	//To use Drupal for user authentication
	$drupaldb = new mysqli("DB SERVER","DB USER","PASSWORD","DB");

	// 08/05/2013 CAJA Defines uesr ID and upload Directory for use by CAJA_WS and jQuery/UploadHandler-index.php
	$userid=$_SESSION['userid'];if (!isset($userid))$userid=0;
	$userdir=$_SESSION['userdir'];if (!isset($userdir))$userdir=0;

?>
