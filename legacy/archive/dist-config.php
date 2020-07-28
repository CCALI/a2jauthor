<?php
/**
 * set the needed config values in this file
 * rename it CONFIG.php
 *
 */
define("SERVER_URL","http://your.server.url/");
define("DRUPAL_ROOT_DIR", "/path/to/drupal/root");
define("GUIDES_DIR","/path/to/userfiles/");
define("GUIDES_URL", "/userfiles/"); //this shoudldn't change if running at web root

// db variables
define('DB_NAME', "your db name");
define('DB_USER', "your db username");
define('DB_PASSWORD', 'your db password');
define('DB_HOST', 'localhost');

define('D7_DB_NAME', "your db name");
define('D7_DB_USER', "your db username");
define('D7_DB_PASSWORD', 'your db password');
define('D7_DB_HOST', 'localhost');

$mysqli = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
$drupaldb = new mysqli(D7_DB_HOST,D7_DB_USER,D7_DB_PASSWORD,D7_DB_NAME); //Drupal for user auth

$isProductionServer = TRUE; //or FALSE

?>