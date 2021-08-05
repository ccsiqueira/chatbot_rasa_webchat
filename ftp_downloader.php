<?php

// define some variables
$local_file = $_GET['local_file'];
echo $local_file;
//$local_file = 'ReliDoc.pdf';
$server_file = $_GET['server_file'];
echo $server_file;

if (file_exists($local_file)) {
	echo 'The file ' . $path_to_file . ' exists';
} else {
	echo 'The file ' . $path_to_file . ' does not exist';
    $ftp_server="172.20.3.83";
    $ftp_user_name="sapuser";
    $ftp_user_pass="sapuser";

    $conn_id = ftp_connect($ftp_server);

    // login with username and password
    $login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);

    // try to download $server_file and save to $local_file
    if (ftp_get($conn_id, $local_file, $server_file, FTP_BINARY)) {
        echo "Successfully written to $local_file\n";
    }
    else {
        echo "There was a problem\n";
    }
    // close the connection
    ftp_close($conn_id);
}

//'/CHATBOT/files/ReliDoc.pdf';

$url = $local_file;
header( "Location: $url" );
?>
