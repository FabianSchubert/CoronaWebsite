<!DOCTYPE html>
<html>
<head>
	<title>Goethe Interactive COVID-19 Analyzer</title>
	<meta charset="UTF-8">
   <meta name="description" content="Online interactive Covid-19 analyzer.
   Free tool to compare Corona data for counries, daily case counts, total 
   case counts and death count. Allows rescaling.">

   <meta name="keywords" content="Covid-19, Coronavirus, case-counts, death-counts,
   daily-counts, death-counts, analyzer, interactive, free, online"/>
   
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
   <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	
   
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
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
   
   <div class="centerBox" style="background:#999999; color:#FFFFFF;">
   <img src="./img/GU-Logo-weiss.png" align="right"
        style="border: none; display: block; width: 15%;">
   <h1>Goethe Interactive COVID-19 Analyzer</h1>
   </div>
   <p>
   <div class="rightBox" style="">
   Institut for Theoretical Physics &#8212;
   Goethe University Frankfurt a.M. <br>
   <a href="https://itp.uni-frankfurt.de/~gros/" class="blackText">Claudius Gros</a> / 
   Fabian Schubert
   </div>
   
   <br><br><br><br><br>
   
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
      style="margin: 17px 3.65px 17px 1px;">Total</span></button><!--
      <button class="dataTypeButton yAx Right"
      onclick="yAxMode = 'time';
            updateAxes();"><span
      style="margin: 17px 5px 20px 0px;">Time</span></button>-->
      </div>
      
      
      <div style="width:calc(100% - 70px); float: right;">
         <canvas id="chart" width="1280" height="720"></canvas>
      </div>
      </div>
      
      <div class="dropdown" id="countryDropdown">
      <button onclick="showCountries()" class="dropbtn">Add Country</button>
      <div id="countryDropdownContent" class="dropdown-content">
         <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
         <!--list of countries goes here-->
      </div>
      </div>
      
      <div id="totalPopSwitchContainer">
      <span>Display: Per 100.000 Inh. </span>
      <label class="switch" id="totalPopSwitch">
         <input type="checkbox"
         onclick="totalPopCheckBoxClick(this);">
         <span class="switchSlider round"></span>
      </label>
      <span> Absolute</span>
      </div>
      <!--
      <div class="dropdown" id="dataDropdown">
      <button onclick="showDataSets()" class="dropbtn">Choose Dataset</button>
      <div id="dataDropdownContent" class="dropdown-content">
         <a onclick = "setDataECDC();">World Countries (ECDC)</a>
         <a onclick = "setDataUSStates();">US States (Johns Hopkins University)</a>
      </div>
      </div>-->
      
      
      
      <div class="axDataTypeSwitch xAx">
         <button class="dataTypeButton xAx Left"
      onclick="xAxMode = 'total';
            updateAxes();">Total</button><!--
      --><button class="dataTypeButton xAx Middle"
      onclick="xAxMode = 'time';
            updateAxes();">Time</button><!--
      --><button class="dataTypeButton xAx Right"
      onclick="xAxMode = 'daily';
            updateAxes();">Daily</button>
      
      
      <input type="image"
            src="./img/download.svg"
      id = "downloadButton"
      style="
      border-style: none;
      position: absolute;
      right: 5px;"
      onclick="var url = myLineChart.toBase64Image();
      window.open(url);">
      
      </div>
      
   </div>
   
   
   <hr style = "height:2px;border-width:0;color:#AAAAAA;background-color:#AAAAAA">
   

   
   
   <div id="countryBoxContainer">
       
   </div>
   
   <br><br><br>
   
   <div class="explainBox" style="">
   <h2>Explanations / Support</h2>
   <ul> 
   <li> Select the same country multiple times to compare death/case counts
   <li> Rescale the x/y axis to see if the XI representation (or the timeline) of 
     countries are functionally similar; <br> 
     same when comparing death and case counts
   <li> Shift the timeline of a country by a few days to match the onset of the outbreak.
   <li> n-day centered moving averages are provided; examples: <br>
     n=3: mean of previous-, current- and subsequent day<br>
     n=1: raw data
   <li> Pick a custom color by clicking the color wheel.
   <li> For support please contact Fabian Schubert:
   <font color="#990000">
   <span onclick="this.innerHTML='fschubert';
       document.getElementById('add_2').innerHTML='@';
       document.getElementById('itp_2').innerHTML='itp.uni-frankfurt.de';"
       style="cursor: pointer;">click to show email</span><span id="add_2"></span><span id="itp_2"></span></font>
   </ul>

   <h2>Representations of an Epidemic Outbreak</h2>
   <ul>
   <li> <b>Timeline:</b> Data (case/total counts) as a function of time (date)
   <li> <b>XI representation:</b> I: daily counts (cases/deaths) as a function of 
                              X: total counts (cases/deaths) <br>
     Time is implicit; allows to compare/extract parameters
   <li> <b>Publication:</b>
   <em><a href="http://arxiv.org/abs/2004.00493" class="blackText" target="_blank" >
   "Containment efficiency and control strategies for the Corona pandemic costs"</a></em>, 
   <br>
   C. Gros, R. Valenti, L. Schneider, K. Valenti, D. Gros (2020)
   </ul>

   <h2>Covid-19 Data Sources</h2>
   <ul>
   <li> <b>ECDC:</b> <a href="https://opendata.ecdc.europa.eu/covid19/casedistribution/" 
        target="_blank"
        class="blackText"> European Center for Disease Control open Covid-19 data</a> (world wide countries)
   <li> <b>JH-CSSE:</b> <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank"
        class="blackText">John Hopkins Center For Systems Science and Engineering Covid-19 Githup repository</a> (US states)
   </ul>

   <h2>Terms</h2>
   <ul>
   <li> The Goethe Interactive COVID-19 Analyzer is free to use.
   <li> Graphics produced can be used for both for private and commercial purposes,<br>
     when including the disclaimer "Produced using the Goethe Interactive COVID-19 Analyzer".
   <li> Online publications need to include a link to this website.
   </ul>

   <h2>Data Protection</h2>
   <ul>
   <li> We notify that the used Covid-19 data may contain errors and
     inconsistencies.
   <li> Bitte bachten Sie die 
   <a href="https://www.uni-frankfurt.de/72059554/Datenschutz">Datenschutzerklärung</a>
   </ul>
   </div>
   
   
   
   </div>
   
   
   
   <!--country box template-->
   <template id="countryBoxTmpl">
         <div class="countryBox"
         id="countryBox_Init"
         xyScaleRatio="1"
         xScale="1.0"
         yScale="1.0"
         xcut="0"
         ycut="0"
         timeShift="0"
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
            
            <input type="color" style='opacity:0;width:100px;position:absolute;'
            class="colorPicker"
            onchange="setColor(this);" />            
            <input type="image"
            src="./img/colorwheel.png"
            class="colorWheel"
            onclick="openColorPicker(this);">
            
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
            
            <!-- time shift -->
            <span>Time Shift (Days): </span>
            
            <span class="timeShiftValue">0</span>
            
            <br>
            <div class="rangeContainer">
               <span>
                  <input type="range"
                  min="-60"
                  max="60"
                  value="0"
                  class="slider timeShift"
                  oninput="timeShiftSliderInput(this);">
               </span>
            </div>
            
            
            <!-- lock scale button -->
            <input type="image"
            src="./img/lock_closed.svg"
            class="scaleLock"
            onclick="scaleLockClick(this);">
                         
            <!-- averaging window-->
            <span>Averaging Window (Days): </span>
            
            <span class="averageWindowValue">7</span>
            
            <div class="rangeContainer">
            <span>
               <input type="range"
               min="0"
               max="10"
               value="3"
               class="slider averageWindow"
               oninput="averageWindowSliderInput(this);">
            </span>
            </div>
            
            <span>Select Start/End Date</span>
            
            <div class="rangeContainer">
               <span>
                  <div class="dateRange"></div>
               </span>
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
      
      <script src="./js/dataProcess.js"></script>
      <script src="./js/plotting.js"></script>
      <script src="./js/dropdown.js"></script>
      <script src="./js/main.js"></script>
   
</body>
</html>

