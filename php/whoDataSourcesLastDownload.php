<?php
$fileName_WHO             = "./dat/who.csv";

$time_WHO_lastUpdated = filemtime($fileName_WHO);

echo date('d-m-Y', $time_WHO_lastUpdated);
?>
