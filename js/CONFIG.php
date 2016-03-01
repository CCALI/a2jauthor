<?php
/*
	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	09/07/2013 - 10/05/2012 SJG Customize db and folder paths depending on server.
*/

	$isProductionServer = true;
	$isBitoviServer = ($_SERVER["HTTP_HOST"] == "bitovi.a2jauthor.org");

	if ($isBitoviServer) {
		define("GUIDES_URL", "/app/userfiles/");
		define("DRUPAL_ROOT_DIR", "/vol/data/sites/commons7_dev");
		define("GUIDES_DIR","/vol/data/sites/bitovi-dev/userfiles/");
		$mysqli = new mysqli("localhost", "caja_dev", "r00dm0nkey", "caja_dev");
		$drupaldb = new mysqli("localhost", "D7commons_dev", "r00dm0nkey", "D7commons_dev");
	}
	elseif ($isProductionServer) {
		// requires trailing slash
		define("GUIDES_DIR", "/vol/data/sites/author/userfiles/");
		define("GUIDES_URL", "/userfiles/");

		$mysqli = new mysqli("localhost", "z", "z", "caja");

		// Drupal for user auth
		$drupaldb = new mysqli("localhost", "z", "z", "D7commons");

		// Set the working directory to your Drupal root
		define("DRUPAL_ROOT_DIR", "/vol/data/sites/commons7_beta");
	}

	// 08/05/2013 CAJA Defines user ID and upload Directory for
	// use by CAJA_WS and jQuery/UploadHandler-index.php
	$userid = $_SESSION["userid"];
	if (!isset($userid)) $userid = 0;
	define("writelog", !$isProductionServer);
?>
