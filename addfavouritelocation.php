<?php
session_start();
$location = $_REQUEST['location'];
$userid = $_SESSION['userID'];

//Connect to database
$db= "309";
$host= "localhost";
$dbuser= "root";
$pw= "9dcb2befd76e7cf9";

$link = new mysqli($host, $dbuser, $pw, $db);
if ($link->connect_errno) {
    echo 3;
}

$sql="INSERT INTO favourites (userid, location) VALUES ('$userid', '$location')";

$result=mysqli_query($link, $sql);

$link->close();


?>