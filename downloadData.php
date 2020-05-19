<?php
// --- -------------- ---
// --- variable names ---
// --- -------------- ---
$fileName_ECDC             = "ecdc.csv";
$url_ECDC   = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv";
$seconds_download_interval = 3600;
// --- ------------------------ ---
// --- time since last modified ---
// --- ------------------------ ---
$time_ECDC_lastUpdated = filemtime($fileName_ECDC);
$time_now = time();
// --- ------------------------- ---
// --- test output (comment out) ---
// --- ------------------------- ---
echo "time since last modified: ";
echo $time_now - $time_ECDC_lastUpdated;
echo  " seconds\n";
// --- -------------------------- ---
// --- download new Covid-19 data ---
// --- -------------------------- ---
if ( ($time_now-$time_ECDC_lastUpdated) > $seconds_download_interval )
  file_put_contents($fileName_ECDC, file_get_contents($url_ECDC));
?>
