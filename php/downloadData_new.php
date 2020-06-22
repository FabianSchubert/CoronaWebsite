<?php
// --- -------------- ---
// --- variable names ---
// --- -------------- ---
$fileName_ESCS             = "ESCS.csv";
$url_ESCS   = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv";
$seconds_download_interval = 3600;
// --- ------------------------ ---
// --- time since last modified ---
// --- ------------------------ ---
$time_ESCS_lastUpdated = filemtime($fileName_ESCS);
$time_now = time();
// --- ------------------------- ---
// --- test output (comment out) ---
// --- ------------------------- ---
// echo "time since last modified: ";
// echo $time_now - $time_ESCS_lastUpdated;
// echo  " seconds\n";
// --- -------------------------- ---
// --- download new Covid-19 data ---
// --- -------------------------- ---
if ( ($time_now-$time_ESCS_lastUpdated) > $seconds_download_interval )
  {
  $fileContent = file_get_contents($url_ESCS);
//  echo strlen($fileContent);
  if (strlen($fileContent)>0)
    file_put_contents($fileName_ESCS, $fileContent);
  }
?>
