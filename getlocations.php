<?php
    session_start();
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

    $sql="SELECT location FROM favourites WHERE userid='$userid'";

    $result=mysqli_query($link, $sql);

    $locations=array();
    while ($row = mysqli_fetch_row($result)) $locations[]=$row[0];
    mysqli_free_result($result);
    echo json_encode($locations);

    $link->close();
?>