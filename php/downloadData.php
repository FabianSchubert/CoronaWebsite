<?php
   // --- -------------- ---
   // --- variable names ---
   // --- -------------- ---
   $fileName_ECDC             = "./dat/ecdc.csv";
   $fileName_WHO             = "./dat/who.csv";
   $url_WHO   = "https://covid19.who.int/WHO-COVID-19-global-data.csv";
   $url_ECDC   = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv";
   $seconds_download_interval = 3600;
   // --- ------------------------ ---
   // --- time since last modified ---
   // --- ------------------------ ---
   $time_ECDC_lastUpdated = filemtime($fileName_ECDC);
   $time_WHO_lastUpdated = filemtime($fileName_WHO);
   $time_now = time();
   // --- ------------------------- ---
   // --- test output (comment out) ---
   // --- ------------------------- ---
   $logfile = fopen("./dat/ecdc_download.log","w");
   
   fwrite($logfile,"time since last modified: ");
   fwrite($logfile,$time_now - $time_ECDC_lastUpdated);
   fwrite($logfile," seconds\n");
   fclose($logfile);
   $logfile2 = fopen("./dat/who_download.log","w");
   fwrite($logfile2,"time since last modified: ");
   fwrite($logfile2,$time_now - $time_WHO_lastUpdated);
   fwrite($logfile2," seconds\n");
   fclose($logfile2);
   // --- -------------------------- ---
   // --- download new Covid-19 data ---
   // --- -------------------------- ---
   if ( ($time_now-$time_ECDC_lastUpdated) > $seconds_download_interval )
     file_put_contents($fileName_ECDC, file_get_contents($url_ECDC));
 
 if ( ($time_now-$time_WHO_lastUpdated) > $seconds_download_interval )
     file_put_contents($fileName_WHO, file_get_contents($url_WHO));
   ?>
