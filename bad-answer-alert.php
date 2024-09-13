<?php

if ((empty($_REQUEST["interviewid"])) || (strlen($_REQUEST["interviewid"]) === 0) ){
    error_log('bad feedback: '. $_SERVER['HTTP_USER_AGENT', 0);
    die();
}


$config = parse_ini_file($path . '/config_env.ini');
$service_email = $config['SERVICE_EMAIL'];


$message="
An A2J user has submitted feedback using the A2J Viewer Feedback form:
    <ul>
    <li>User email (optional): $email
    <li>Feedback type: $type
    <li>Feedback: $comment
    <li>Interview Title: " . htmlentities(stripslashes($interviewtitle)) . "
    <li>Interview Question: $questionid
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
$headers .= "From: A2J Viewer Feedback Form <a2jauthorfeedback@cali.org>\r\n";

/* and now mail it */
mail($to, $subject, $message, $headers);
