<?php
   // --- -------------- ---
   // --- variable names ---
   // --- -------------- ---
   $fileName_ECDC             = "./dat/ecdc.csv";
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
   $logfile = fopen("./dat/ecdc_download.log","w");
   fwrite($logfile,"time since last modified: ");
   fwrite($logfile,$time_now - $time_ECDC_lastUpdated);
   fwrite($logfile," seconds\n");
   fclose($logfile);
   // --- -------------------------- ---
   // --- download new Covid-19 data ---
   // --- -------------------------- ---
   if ( ($time_now-$time_ECDC_lastUpdated) > $seconds_download_interval )
     file_put_contents($fileName_ECDC, file_get_contents($url_ECDC));
   ?>
