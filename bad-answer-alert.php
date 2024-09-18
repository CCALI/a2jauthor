<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

$path = dirname(__FILE__, 2);
$config = parse_ini_file($path . '/config_env.ini');
$service_email = $config['SERVICE_EMAIL'];


$keys = ["interviewtitle", "viewerversion", 
             "type", "authoremail"]; 
$user_agent = $_SERVER['HTTP_USER_AGENT'];

function checkRequest($keys, $user_agent){

    foreach ($keys as $key){
        if ((empty($_REQUEST[$key])) || 
        (strlen($_REQUEST[$key]) === 0) ){
            return false;
        }
    }
    return true;
}

if (checkRequest($keys, $user_agent)){
    error_log('bad viewer variable alert: '. $user_agent,0);
            die();
}

$interviewtitle= ($_REQUEST["interviewtitle"]);
$viewerversion=  ($_REQUEST["viewerversion"]);
$variables =   ($_REQUEST["type"]);
$authoremail =  ($_REQUEST["authoremail"]);
$created=$now=date("Y-m-d-H-i-s");


$message="
An A2J user has submitted an answerset with invalid dates or numbers:
    <ul>
    <li>Interview Title: " . htmlentities(stripslashes($interviewtitle)) . "
    <li>Interview URL: " . htmlentities(stripslashes($interviewid)). "
    <li>Viewer Version: $viewerversion
    <li>User Agent: $user_agent
    </ul>
    
    ";


$to  = $service_email;

/* subject */
$subject = "Bad Answer Values";

/* To send HTML mail, you can set the Content-type header. */
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";

/* additional headers */
$headers .= "From: A2J Viewer answerset parser <support@a2jauthor.org>\r\n";

/* and now mail it */
mail($to, $subject, $message, $headers);
