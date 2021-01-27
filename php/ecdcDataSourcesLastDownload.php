<?php

$fileName_ECDC             = "./dat/ecdc.csv";

$time_ECDC_lastUpdated = filemtime($fileName_ECDC);

echo date('d-m-Y', $time_ECDC_lastUpdated);
?>
