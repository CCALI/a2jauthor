<?php
/*
	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	09/07/2013 - 10/05/2012 SJG Customize db and folder paths depending on server.
*/

define("SERVER_URL","");
define("DRUPAL_ROOT_DIR", "");
define("GUIDES_DIR","");
define("GUIDES_URL", "/userfiles/"); //this shoudldn't change if running at web root

// db variables
define('DB_NAME', "");
define('DB_USER', "");
define('DB_PASSWORD', '');
define('DB_HOST', '');

define('D7_DB_NAME', "");
define('D7_DB_USER', "");
define('D7_DB_PASSWORD', '');
define('D7_DB_HOST', '');

$mysqli = new mysqli('localhost', 'root', 'root', 'caja', 3306);
// $mysqli = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
// $drupaldb = new mysqli(D7_DB_HOST,D7_DB_USER,D7_DB_PASSWORD,D7_DB_NAME);

$isProductionServer = FALSE; //or FALSE
?>
