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
        echo 3;
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
        echo 4;
    } else {
        
        //User Doesn't Exist (Proceed)
        // Query
        $sql = "INSERT INTO users (username, password)
        VALUES ('$username', '$password')";
        
        $sql="SELECT userid FROM users WHERE username='$username'";
            $result=mysqli_query($link, $sql);
            $id=array();
            while ($row = mysqli_fetch_row($result)) $id[]=$row[0];
            mysqli_free_result($result);
            $_SESSION['userID'] = $id[0];

        if (mysqli_query($link, $sql)) {
            echo 1;
            $_SESSION['auth'] = 1;
            
        } else {
            echo 5;
        }
    }

    $link->close();
}
?>