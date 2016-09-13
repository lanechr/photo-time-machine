<?php 
//Session Details
session_start();
$username= $_REQUEST['username'];
$password = $_REQUEST['password'];
//Nothing Entered Test
if ($username == "" || $password == ""){
    echo 2;
}else{

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

    $sql="SELECT userid FROM users WHERE username='$username'";

    $result=mysqli_query($link, $sql);

    if (mysqli_num_rows($result) == 1) {
        //User Exists
        echo 2;
    } else {
        
        //User Doesn't Exist (Proceed)
        // Query
        $sql = "INSERT INTO users (username, password)
        VALUES ('$username', '$password')";


        if (mysqli_query($link, $sql)) {
            echo 1;
            $_SESSION['auth'] = 1;
            
        } else {
            echo 2;
        }
    }

    $link->close();
}
?>