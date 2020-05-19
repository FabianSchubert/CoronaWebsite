<!DOCTYPE html>
<html>
<head>
	<title>plot a data file</title>
	<meta charset="UTF-8">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	
   <link rel="stylesheet" type="text/css" href="style.css">
   
   
</head>
<body>
   
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
   $logfile = fopen("ecdc_download.log","w");
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
   
   <div id="outerFrame">
   <div id="ChartDropdown">
      <div id = "chartcontainer">
      <canvas id="chart" width="4" height="2"></canvas>
      </div>

      
   </div>
   <div class="dropdown">
      <button onclick="showCountries()" class="dropbtn">Add Country</button>
      <div id="myDropdown" class="dropdown-content">
         <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
         <!--
         <a href="#about">About</a>
         <a href="#base">Base</a>
         <a href="#blog">Blog</a>
         <a href="#contact">Contact</a>
         <a href="#custom">Custom</a>
         <a href="#support">Support</a>
         <a href="#tools">Tools</a>-->
      </div>
   </div>
   <div id="countryBoxContainer">
            
   </div>
   
   
   
   </div>
   
   <script src="dataProcess.js"></script>
   <script src="plotting.js"></script>
   <script src="script.js"></script>
   <script src="dropdown.js"></script>
</body>
</html>
