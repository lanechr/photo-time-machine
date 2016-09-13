<?php 
session_start();
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];
if ($username == "" || $password == ""){
    echo 2;
} else{
    //Connect to database
    $db= "309";
    $host= "localhost";
    $dbuser= "root";
    $pw= "9dcb2befd76e7cf9";

    $link = new mysqli($host, $dbuser, $pw, $db);
    if ($link->connect_errno) {
        echo "Failed to connect to MySQL: (" . $link->connect_errno . ") " . $link->connect_error;
    }

    // SQL Injection Protection
    $username = stripslashes($username);
    $password = stripslashes($password);
    $username = mysqli_real_escape_string($link, $username);
    $password = mysqli_real_escape_string($link, $password);

    $sql="SELECT userid FROM users WHERE username='$username' AND password='$password'";

    $result=mysqli_query($link, $sql);

    if (mysqli_num_rows($result) == 1) {
        if (isset($_SESSION['failed'])) {
            unset($_SESSION['failed']);
        }
        $_SESSION['auth'] = 1;
        $id=array();
        while ($row = mysqli_fetch_row($result)) $id[]=$row[0];
        mysqli_free_result($result);
        $_SESSION['userID'] = $id[0];
            echo 1;
    } else {
        echo 2;
    }
}

$link->close();

?>