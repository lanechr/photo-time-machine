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

$sql="SELECT * FROM favourites WHERE userid='$userid' AND location='$location'";

$result=mysqli_query($link, $sql);

    if (!(mysqli_num_rows($result) == 1)) {
        $sql="INSERT INTO favourites (userid, location) VALUES ('$userid', '$location')";

        $result=mysqli_query($link, $sql);
        echo 1;
    } else {
        echo 2;
    }


$link->close();


?>