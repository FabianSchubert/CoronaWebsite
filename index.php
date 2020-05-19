<!DOCTYPE html>
<html>
<head>
	<title>Goethe Interactive COVID-19 Analyzer</title>
	<meta charset="UTF-8">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	
   
   <link rel="stylesheet" type="text/css" href="./sty/main.css">
   <link rel="stylesheet" type="text/css" href="./sty/dropdown.css">
   <link rel="stylesheet" type="text/css" href="./sty/countrybox.css">
   <link rel="stylesheet" type="text/css" href="./sty/slider.css">
   <link rel="stylesheet" type="text/css" href="./sty/switch.css">
   
   
   
</head>
<body>
   
   <?php
   include('./php/downloadData.php');
   ?>
      
   <div id="outerFrame">
   <h1>Goethe Interactive COVID-19 Analyzer</h1>
   
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
   
   <script src="./js/dataProcess.js"></script>
   <script src="./js/plotting.js"></script>
   <script src="./js/dropdown.js"></script>
   <script src="./js/main.js"></script>
</body>
</html>