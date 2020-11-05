<?php
   
   function console_log($output, $with_script_tags = true) {
       $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . 
   ');';
       if ($with_script_tags) {
           $js_code = '<script>' . $js_code . '</script>';
       }
       echo $js_code;
   }

   // --- -------------- ---
   // --- variable names ---
   // --- -------------- ---
   $fileName_ECDC = "./dat/ecdc.csv";
   //$url_ECDC   = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv";
   $url_ECDC = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv/data.csv";
   $seconds_download_interval = 0;
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

   if ( ($time_now-$time_ECDC_lastUpdated) > $seconds_download_interval ){
      $file_contents = file_get_contents($url_ECDC);
      //console_log($file_contents);
      if($file_contents != false) { 
            file_put_contents($fileName_ECDC, $file_contents);
            console_log("File downloaded successfully"); 
      } 
      else { 
          console_log("File downloading failed."); 
      } 
   }
     
   ?>
