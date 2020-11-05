<?php
   
   function console_log($output, $with_script_tags = true) {
       $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . 
   ');';
       if ($with_script_tags) {
           $js_code = '<script>' . $js_code . '</script>';
       }
       echo $js_code;
   }

   function convert_date_timestamp($date){
      $d = DateTime::createFromFormat('d-m-Y H:i:s', $date." 00:00:00");
      if ($d === false) {
          die("Incorrect date string");
      } else {
          return $d->getTimestamp();
      }

   }

   // --- -------------- ---
   // --- variable names ---
   // --- -------------- ---
   $fileName_ECDC = "./dat/ecdc.csv";
   //$url_ECDC   = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv";
   $url_ECDC = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv/data.csv";
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

   if ( ($time_now-$time_ECDC_lastUpdated) > $seconds_download_interval ){
      

      $file_contents = file_get_contents($url_ECDC);

      if($file_contents != false) { 
            file_put_contents($fileName_ECDC, $file_contents);

            copy($fileName_ECDC, "./dat/backup/ecdc_backup_".date('d-m-Y', $time_now).".csv");            

            console_log("File downloaded successfully"); 
      } 
      else { 
          console_log("File downloading failed. Replacing ecdc.csv with most recent_backup...");

          $backup_files = array_slice(scandir("./dat/backup/"),2);
   
         $max_timestamp = 0;
         for ($i = 0; $i <= count($backup_files)-1; $i++) {
              $timestamp_temp = convert_date_timestamp(substr($backup_files[$i],12,10));
              if($timestamp_temp > $max_timestamp){
                $max_timestamp = $timestamp_temp;
              }
          }

          $fileName_max_timestamp = "ecdc_backup_".date("d-m-Y", $max_timestamp).".csv";

          copy("./dat/backup/".$fileName_max_timestamp, $fileName_ECDC);


      }



   }
     
   ?>
