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
         <!--list of countries goes here-->
      </div>
   </div>
   <div id="countryBoxContainer">
       
   </div>
   
   
   
   </div>
   
   <script src="./js/dataProcess.js"></script>
   <script src="./js/plotting.js"></script>
   <script src="./js/dropdown.js"></script>
   <script src="./js/main.js"></script>
   
   <!--country box template-->
   <template id="countryBoxTmpl">
         <div class="countryBox"
         id="countryBox_Init"
         xyScaleRatio="1"
         xScale="1.0"
         yScale="1.0"
         n_avg="7"
         lockScales="true"
         displayData="cases"
         idx="0"
         style="background-color: #ff0000;">
            <p id="countryBox_Init_Header">TemplateCountry</p>
            
            <!-- close button -->
            <input type="image"
            src="./img/closeicon.svg"
            class="closeCountryBox"
            onclick="closeButtonClick(this);">
            
            <!-- x-scale -->
            <span>x-Scale: </span>
            
            <span id="countryBox_Init_xScaleValue"
            class="xScaleValue">1</span>
            
            <input type="range"
            min="1"
            max="50"
            value="10"
            class="slider xScale"
            id="countryBox_Init_xScaleSlider"
            oninput="xScaleSliderInput(this);">
            
            <!-- y-scale -->
            <span>y-Scale: </span>
            
            <span id="countryBox_Init_yScaleValue"
            class="yScaleValue">1</span>
            
            <br>
            <input type="text">
            <input type="range"
            min="1"
            max="50"
            value="10"
            class="slider yScale"
            id="countryBox_Init_yScaleSlider"
            oninput="yScaleSliderInput(this);">
            
            <!-- lock scale button -->
            <input type="image"
            src="./img/lock_closed.svg"
            class="scaleLock"
            onclick="scaleLockClick(this);">
                         
            <!-- averaging window-->
            <span>averaging window (days): </span>
            
            <span id="countryBox_Init_averageWindowValue"
            class="averageWindowValue">7</span>
            
            <input type="range"
            min="0"
            max="5"
            value="3"
            class="slider averageWindow"
            id="countryBox_Init_averageWindowSlider"
            oninput="averageWindowSliderInput(this);">
            
            <!-- switch between cases /deaths -->
            <span>Display: Cases </span>
            
            <label class="switch">
               <input type="checkbox"
               onclick="casesCheckBoxClick(this);">
               <span class="switchSlider round"></span>
            </label>
            
            <span> Deaths</span>
         </div>
      </template>  
   
</body>
</html>
