<?php

$pdo = new PDO('mysql:host=localhost;dbname=inseccam', 'inseccam', 'yaq1wsx_');
$sql = "SELECT * FROM streams";
$rows = array();
foreach ($pdo->query($sql) as $row) {
    $rows[] = $row;
}
print json_encode($rows);
?>