<?php
/*
	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	09/07/2013 - 10/05/2012 SJG Customize db and folder paths depending on server.
*/

	$isBitoviServer =    ($_SERVER["HTTP_HOST"] == "bitovi.a2jauthor.org");
	$isAuthorDevServer = ($_SERVER["HTTP_HOST"] == "authordev.a2jauthor.org");
	$isLocalServerDev =  ($_SERVER["HTTP_HOST"] == "localhost");

	if ($isLocalServerDev) {
		$isProductionServer = FALSE; 
		define("GUIDES_DIR", "/Users/Sam/Desktop/dev/F/SJGProjects/A2J5/A2JApp/userfiles/"); //'f:/www/caja.cali.org/caja/userfiles/');
		
		define("GUIDES_URL",'/app/userfiles/');
		//$mysqli = new mysqli("localhost","dbadmin","a2j4cali","caja",3356);
		//$drupaldb = new mysqli("localhost","dbadmin","a2j4cali","D7commons",3356); //Drupal for user auth
		$mysqli = new mysqli("a2j01.a2jauthor.org","caja_dev","r00dm0nkey","caja_dev");
		$drupaldb = new mysqli("a2j01.a2jauthor.org","D7commons_dev","r00dm0nkey","D7commons_dev"); //Drupal for user auth
		//session_start();//  09/05/2013 WARNING! LEAVE session_start() OFF TO ACCESS DRUPAL SESSIONS!
		// Set the working directory to your Drupal root
		define('DRUPAL_ROOT_DIR',''); 
		define("LOCAL_USER", 45 );// DEV Author 
	}
	elseif ($isBitoviServer) {
		$isProductionServer = TRUE; 
		define("DRUPAL_ROOT_DIR", "/vol/data/sites/commons7_dev");
		define("GUIDES_DIR","/vol/data/sites/bitovi-dev/userfiles/");
		define("GUIDES_URL", "/userfiles/");
		$mysqli = new mysqli("localhost", "caja_dev", "r00dm0nkey", "caja_dev");
		$drupaldb = new mysqli("localhost", "D7commons_dev", "r00dm0nkey", "D7commons_dev");
	}
	elseif ($isAuthorDevServer) {
		$isProductionServer = TRUE; 
		define("DRUPAL_ROOT_DIR", "/vol/data/sites/commons7_dev");
		define("GUIDES_DIR","/vol/data/sites/bitovi-dev/userfiles/");
		define("GUIDES_URL", "http://bitovi.a2jauthor.org/userfiles/");// grabbing files from bitovi for now
		$mysqli = new mysqli("localhost", "caja_dev", "r00dm0nkey", "caja_dev");
		$drupaldb = new mysqli("localhost", "D7commons_dev", "r00dm0nkey", "D7commons_dev");
	}
	else { 
		
	/*	3/17/2016 Needs work for main production site
	 *	$isProductionServer = TRUE; 
		// requires trailing slash
		define("GUIDES_DIR", "/vol/data/sites/author/userfiles/");
		define("GUIDES_URL", "/userfiles/");

		$mysqli = new mysqli("localhost", "z", "z", "caja");

		// Drupal for user auth
		$drupaldb = new mysqli("localhost", "z", "z", "D7commons");

		// Set the working directory to your Drupal root
		define("DRUPAL_ROOT_DIR", "/vol/data/sites/commons7_beta");
		*/
	}

	// 08/05/2013 CAJA Defines user ID and upload Directory for
	// use by CAJA_WS and jQuery/UploadHandler-index.php
	$userid = $_SESSION["userid"];
	if (!isset($userid)) $userid = 0;
	define("writelog", !$isProductionServer);
?>
