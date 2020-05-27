<!DOCTYPE html>
<html>
<head>
	<title>Goethe Interactive COVID-19 Analyzer</title>
	<meta charset="UTF-8">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
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
      <div class="axDataTypeSwitch yAx"><!--
      --><button class="dataTypeButton yAx Left"
      onclick="yAxMode = 'daily';
            updateAxes();"><span
      style="margin: 20px 5px 17px 0px;">Daily</span></button><!--
      --><button class="dataTypeButton yAx Middle"
      onclick="yAxMode = 'total';
            updateAxes();"><span
      style="margin: 17px 3.5px 17px 1px;">Total</span></button><!--
      --><button class="dataTypeButton yAx Right"
      onclick="yAxMode = 'time';
            updateAxes();"><span
      style="margin: 17px 5px 20px 0px;">Time</span></button>
      </div>
      
      
      <div style="width:calc(100% - 70px); float: right;">
         <canvas id="chart" width="400" height="200"></canvas>
      </div>
      </div>
      
      <div class="axDataTypeSwitch xAx">
         <button class="dataTypeButton xAx Left"
      onclick="xAxMode = 'daily';
            updateAxes();">Daily</button><!--
      --><button class="dataTypeButton xAx Middle"
      onclick="xAxMode = 'total';
            updateAxes();">Total</button><!--
      --><button class="dataTypeButton xAx Right"
      onclick="xAxMode = 'time';
            updateAxes();">Time</button>
      </div>
   </div>
   
   <hr style = "height:2px;border-width:0;color:#AAAAAA;background-color:#AAAAAA">
   
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
         n_avg="3"
         lockScales="true"
         displayData="cases"
         idx="0"
         style="background-color: #ff0000;">
            <p class="countryBoxHeader">
            TemplateCountry
            </p>
            
            <!-- close button -->
            <input type="image"
            src="./img/closeicon.svg"
            class="closeCountryBox"
            onclick="closeButtonClick(this);">
            
            <!-- x-scale -->
            <span>x-Scale: </span>
            
            <span class="xScaleValue">1</span>
            <div class="rangeContainer">
               <span>
                  <input type="range"
                  min="1"
                  max="50"
                  value="10"
                  class="slider xScale"
                  oninput="xScaleSliderInput(this);">
                  </span>
               <input type="text"
               class="sliderRangeField max"
               value="5"
               oninput="scaleMaxInput(this);">
            </div>
            
            
            <!-- y-scale -->
            <span>y-Scale: </span>
            
            <span class="yScaleValue">1</span>
            
            <br>
            <div class="rangeContainer">
               <span>
                  <input type="range"
                  min="1"
                  max="50"
                  value="10"
                  class="slider yScale"
                  oninput="yScaleSliderInput(this);">
               </span>
               <input type="text"
               class="sliderRangeField max"
               value="5"
               oninput="scaleMaxInput(this);">
            </div>
            
            
            <!-- lock scale button -->
            <input type="image"
            src="./img/lock_closed.svg"
            class="scaleLock"
            onclick="scaleLockClick(this);">
                         
            <!-- averaging window-->
            <span>averaging window (days): </span>
            
            <span class="averageWindowValue">7</span>
            
            <div class="rangeContainer"
            style="padding-top: 10px;
            padding-bottom: 10px;">
               <input type="range"
               min="0"
               max="10"
               value="3"
               class="slider averageWindow"
               oninput="averageWindowSliderInput(this);">
            </div>
            
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
