<?php

$pdo = new PDO('mysql:host=localhost;dbname=inseccam', 'inseccam', 'yaq1wsx_');
$sql = "SELECT * FROM streams";
$rows = array();

if(isset($_GET['json'])){

foreach ($pdo->query($sql) as $row) {
    $rows[] = $row;
}
print json_encode($rows);

} else {

    foreach ($pdo->query($sql) as $row) {
        echo $row["country"] . " - " . $row["city"];
        echo $row["source"];
    }

}
?>