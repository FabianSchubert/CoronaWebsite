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
   $fileName_WHO = "./dat/who.csv";
   $fileName_WHO_vacc = "./dat/who_vacc.csv";
   $fileName_OWID = "./dat/owid.csv";
   $url_WHO   = "https://covid19.who.int/WHO-COVID-19-global-data.csv";
   $url_WHO_vacc = "https://covid19.who.int/who-data/vaccination-data.csv";
   $url_ECDC   = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv";
   $url_OWID = "https://covid.ourworldindata.org/data/owid-covid-data.csv";
   $seconds_download_interval = 3600;
   // --- ------------------------ ---
   // --- time since last modified ---
   // --- ------------------------ ---
   $time_ECDC_lastUpdated = filemtime($fileName_ECDC);
   $time_WHO_lastUpdated = filemtime($fileName_WHO);
   $time_WHO_vacc_lastUpdated = filemtime($fileName_WHO_vacc);
   $time_OWID_lastUpdated = filemtime($fileName_OWID);

   //console_log($time_WHO_vacc_lastUpdated);

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

   $logfile3 = fopen("./dat/who_vacc_download.log","w");
   fwrite($logfile3,"time since last modified: ");
   fwrite($logfile3,$time_now - $time_WHO_vacc_lastUpdated);
   fwrite($logfile3," seconds\n");
   fclose($logfile3);

   $logfile4 = fopen("./dat/owid_download.log","w");
   fwrite($logfile4,"time since last modified: ");
   fwrite($logfile4,$time_now - $time_OWID_lastUpdated);
   fwrite($logfile4," seconds\n");
   fclose($logfile4);

   // --- -------------------------- ---
   // --- download new Covid-19 data ---
   // --- -------------------------- ---
    
   $fileName_list = array($fileName_ECDC,$fileName_WHO,$fileName_WHO_vacc,$fileName_OWID);
   $url_list = array($url_ECDC,$url_WHO,$url_WHO_vacc,$url_OWID);
   $time_lastUpdated_list = array($time_ECDC_lastUpdated,$time_WHO_lastUpdated,$time_WHO_vacc_lastUpdated,$time_OWID_lastUpdated);
   $dirBackup_list = array("./dat/backup/ecdc/","./dat/backup/who/","./dat/backup/who_vacc/","./dat/backup/owid/");
   $fileNameBackup_list = array("ecdc_backup_","who_backup_","who_vacc_backup_","owid_backup_");

   for ($i = 0; $i < 4; $i++) {
     if ( ($time_now-$time_lastUpdated_list[$i]) > $seconds_download_interval ){
        

        $file_contents = file_get_contents($url_list[$i]);

        if($file_contents != false) {
              file_put_contents($fileName_list[$i], $file_contents);

              copy($fileName_list[$i], $dirBackup_list[$i].$fileNameBackup_list[$i].date('d-m-Y', $time_now).".csv");

              console_log("File downloaded successfully");
        }
        else {
            if($i == 0){
              console_log("File downloading failed. Replacing ecdc.csv with most recent backup...");
            } elseif($i == 1) {
              console_log("File downloading failed. Replacing who.csv with most recent backup...");
            } elseif($i == 2) {
              console_log("File downloading failed. Replacing who_vacc.csv with most recent backup...");
            } else {
              console_log("File downloading failed. Replacing owid.csv with most recent backup...");
            }
            $backup_files = array_slice(scandir($dirBackup_list[$i]),2);
     
           $max_timestamp = 0;
           for ($j = 0; $j <= count($backup_files)-1; $j++) {
                $timestamp_temp = convert_date_timestamp(substr($backup_files[$j],12,10));
                if($timestamp_temp > $max_timestamp){
                  $max_timestamp = $timestamp_temp;
                }
            }

            $fileName_max_timestamp = $fileNameBackup_list[$i].date("d-m-Y", $max_timestamp).".csv";

            copy($dirBackup_list[$i].$fileName_max_timestamp, $fileName_ECDC);


        }



     }

   }
     
  ?>
