<?php
/*
	CALI Author 5 / A2J Author 5 (CAJA) 正义 * công lý * правосудие
	09/07/2013 - 10/05/2012 SJG Customize db and folder paths depending on server.
*/

define("SERVER_URL","http://localhost/");
define("DRUPAL_ROOT_DIR", "/var/www/drupal-7.43");
define("GUIDES_DIR","/var/www/CAJA/userfiles");
define("GUIDES_URL", "/userfiles/"); //this shoudldn't change if running at web root

// db variables
define('DB_NAME', "caja-edev");
define('DB_USER', "root");
define('DB_PASSWORD', 'cul8rgys');
define('DB_HOST', 'localhost');

define('D7_DB_NAME', "d7a2jdev");
define('D7_DB_USER', "root");
define('D7_DB_PASSWORD', 'cul8rgys');
define('D7_DB_HOST', 'localhost');

$mysqli = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
$drupaldb = new mysqli(D7_DB_HOST,D7_DB_USER,D7_DB_PASSWORD,D7_DB_NAME);

$isProductionServer = FALSE; //or FALSE
?>
