<?php

$pdo = new PDO('mysql:host=localhost;dbname=inseccam', 'inseccam', 'yaq1wsx_');
$sql = "SELECT * FROM streams";
foreach ($pdo->query($sql) as $row) {
   echo $row['city']." ".$row['country']."<br />";
   echo "Link: ".$row['source']."<br /><br />";
}

?>