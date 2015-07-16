<?php
/*
 	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	09/07/2013 - 10/05/2012 SJG Customize db and folder paths depending on server.
*/

  $isBitoviServer = $_SERVER['HTTP_HOST'] == "bitovi.a2jauthor.org";
  $isProductionServer = true;

	if ($isProductionServer)
	{	// Production/staging server
		define("GUIDES_DIR",'/vol/data/sites/author/userfiles/'); //requires trailing slash
		define("GUIDES_URL",'/userfiles/');
		$mysqli = new mysqli("localhost","z","z","caja");
		$drupaldb = new mysqli("localhost","z","z","D7commons"); //Drupal for user auth
		// Set the working directory to your Drupal root
		define('DRUPAL_ROOT_DIR','/vol/data/sites/commons7_beta');
	}
	else
	{	// Local host
		define("GUIDES_DIR",'f:/www/caja.cali.org/caja/userfiles/');
		define("GUIDES_URL",'/caja/userfiles/');
		$mysqli = new mysqli("localhost","z","z","caja",3356);
		$drupaldb = new mysqli("localhost","z","z","D7commons",3356); //Drupal for user auth
	}

	// 08/05/2013 CAJA Defines uesr ID and upload Directory for use by CAJA_WS and jQuery/UploadHandler-index.php
	$userid=$_SESSION['userid'];if (!isset($userid))$userid=0;

	define("writelog",  !$isProductionServer);
?>
