<!DOCTYPE html>
<html>
<head>
   
   <link rel="icon" href="./img/favicon.png" type="image/png">
   
   <title>Goethe Interactive COVID-19 Analyzer</title>
   <meta charset="UTF-8">
   <meta name="description" content="Online interactive Covid-19 analyzer.
   Free tool to compare Corona data for counries, daily case counts, total
   case counts and fatalities. Allows rescaling.">

   <meta name="keywords" content="Covid-19, Coronavirus, case-counts, death-counts,
   daily-counts, death-counts, analyzer, interactive, free, online, fatalities"/>
   
   <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
   <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
   
   
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" type="text/css" href="./sty/main.css">
  <link rel="stylesheet" type="text/css" href="./sty/dropdown.css">
  <link rel="stylesheet" type="text/css" href="./sty/countryb.css">
  <link rel="stylesheet" type="text/css" href="./sty/slider.css">
  <link rel="stylesheet" type="text/css" href="./sty/switch.css">

  
	 
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
   
   
</head>
<body>
   
   <?php
      include('./php/downloadData.php')
   ?>
      
   <div id="outerFrame" style= "max-width: 1125px;">
   
   <div class="centerBox" style="background:#999999; color:#FFFFFF;"
     title = "Rescale, shift and compare Covid-19 data, create your own analysis">
   <img src="./img/GU-Logo-weiss.png" align="right"
        style="border: none; display: block; width: 15%;">
   <h1 style="margin-top: 20px;
margin-bottom: 20px; font-weight: 600;">Goethe Interactive COVID-19 Analyzer</h1>
   </div>
   
   
   
   
   <div id ="centerBox" class="centerBox" style="background:#FFFFFF; font-size: 16px; text-align: left;">
    <span style="color:#666666; font-weight:bold; font-size: larger;">Compare
          Covid-19 outbreaks, create your own plots!</span>
    <span style="float:right;">
       <a href="https://itp.uni-frankfurt.de/~gros/" class="blackText">Claudius Gros</a> /
   Fabian Schubert / Carolin Roskothen</span><br>
    <span style="float:right;">Institute for Theoretical Physics &#8212;
                               Goethe University Frankfurt</span>
   
   <br><br>
   
   <div id="ChartDropdown">
		
      
      <div id = "chartcontainer">
	  	  
	       <div id="totalPopSwitchContainer" title="how to display the data" style="right: 4%;
top: 10%;" >
      <span>Per 10⁵ Inh.</span>
      <label class="switch" id="totalPopSwitch">
         <input type="checkbox"
         onclick="totalPopCheckBoxClick(this);"  >
         <span class="switchSlider round" id ="switchSlider"  ></span>
      </label>
      <span> Absolute</span>
      </div>
	  
      <div class="axDataTypeSwitch yAx"><!--
      --><button class="dataTypeButton yAx Left"
      onclick="yAxMode = 'daily';
            updateAxes();"><span
      style="font-size: 15px; margin: 20px 5px 17px 0px;">Daily</span></button><!--
      --><button class="dataTypeButton yAx Middle"
      onclick="yAxMode = 'total';
            updateAxes();"><span
      style="margin: 17px 3.65px 17px 1px;">Total</span></button><!--
	  <button class="dataTypeButton yAx Right"
      onclick="yAxMode = 'time';
            updateAxes();"><span
      style="margin: 17px 5px 20px 0px;">Time</span></button>-->
	  <!--
      -->
	    
      </div>
      
      <div  style="width:calc(100% - 70px); float: right;">
         <canvas id="chart" width="1280" height="720" ></canvas>
      </div>
      
      </div>
      
      <div class="dropdown" id="countryDropdown"
           title = "add country or US state of your choice">
      <button   id ="buttonDropdown" class="dropbtn"  type="button" data-toggle="dropdown" >Add&nbsp;Country </button>
        <div  id = "countryDropdownContent" style = "padding-top: 0px;" class="dropdown-menu dropdown-content ">
		
		<input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
	  </div>
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

        <div class="dropdown"
                title = "Choose Data">
            
            <button class="dropbtn xAxData Left"  type="button" data-toggle="dropdown" 
            onclick="updatexDataList();">Choose&nbsp;x-Data</button>
            <div id="xDataDropdown" style = "padding-top: 0px;" class="dropdown-menu dropdown-content dropdown-data">
            <!--<li><a href="javascript:void(0)" onclick ="DataTypeClick(this,'cases')">Cases</a></li>
            <li><a href="javascript:void(0)" onclick ="DataTypeClick(this,'deaths')">Deaths</a></li>
            <li><a href="javascript:void(0)" onclick ="DataTypeClick(this,'vaccines')">Fully Vaccinated</a></li>-->             
           </div>
           </div>


        <!-- <button class="dataTypeButton xAx Left"
      onclick="xAxMode = 'total';
            updateAxes();">Total</button>--><!--
      --><button class="dataTypeButton xAx Right"
      onclick="xAxMode = 'time';
            updateAxes();">Time</button><!--
      <button class="dataTypeButton xAx Right"
      onclick="xAxMode = 'daily';
            updateAxes();">Daily</button>-->
      

      <!-- switch between cases /deaths -->
          <div style="border-style: transparent;">
            <span 
            style="position: relative;
            top: -5px;
            left: 0px;
            margin-left: 15px;
            margin-right: 5px;">Daily</span>
            
            <label class="switch" 
            style="position: relative;
            top: 7px;
            left: 0px;">
               <input type="checkbox"
               class="checkbox switchCasesDeaths"
               onclick="casesCheckBoxClick(this);">
               <span class="switchSlider round"></span>
            </label>
            
            <span
            style="position: relative;
            top: -5px;
            left: 0px;
            margin-left: 5px;
            margin-right: 15px;"> Total</span>
          </div>
            


      <input type="image"
            src="./img/download.svg"
      id = "downloadButton"
      title = "export plot to png image"
      style="
      border-style: none;
      position: absolute;
      right: 5px;"
      onclick="var url = myLineChart.toBase64Image();
      downloadFileTempLink(url, 'covid_plot.png');
      //window.open(url);">
	  <input type="image"
            src="./img/download_data.svg"
      id = "downloadCSV"
      title = "export files as csv "
      style="
      border-style: none;
      position: absolute;
      right: 50px; height: 45px">
      </div>
      
   </div>
   
   
   <hr style = "height:2px;border-width:0;color:#AAAAAA;background-color:#AAAAAA">
   
   <!--<button id="showExample"
   onclick="showExampleClick(this);">Show Example</button>-->
   
   <div class="dropdown" id="exampleDropdown"
        title = "show some examples to start exploring">
		
    <button id="buttonExampleDropdown" class="dropbtn"  type="button" data-toggle="dropdown" >Show&nbsp;Examples</button>
   <div id="exampleDropdownContent" style = "padding-top: 0px;" class="dropdown-menu dropdown-content ">
      <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
      <li><a href="javascript:void(0)" id="exampleDropdownEntry1" onclick =
         "$.loadScript('./presets/preset1.js', function(){});
         document.getElementById('exampleDropdownContent').classList.remove('show');v">Compare daily cases of Germany, Spain and Italy.</a></li>
     <li><a href= "javascript:void.(0)" id="exampleDropdownEntry2" onclick =
         "$.loadScript('./presets/preset2.js', function(){});
         document.getElementById('exampleDropdownContent').classList.remove('show');">Compare confirmed cases and deaths in Italy.</a></li>
   </div>
   </div>
   
   
   <div id="countryBoxContainer">
    
   </div>
   
   <br><br><br>
   
   <div class="explainBox" style=" margin-left: auto; margin-right: auto; border-radius: 25px; border: 5px solid #666666;
	background: #FFFFFF; padding: 20px;	text-align: left; width: 100%;">
   <h2>How to use / Support</h2>
   <ul>
   <li> Select the same country multiple times to compare fatalities/case counts.
        You can simultaneously show both cases/deaths as indicated by the
        y-axis labeling (cases/deaths).
   <li> Rescale the y axis to see if the case counts of two or more countries are
        functionally similar,<br>
        rescale both x and y axis to compare XI representations
        (daily vs total case counts);<br>
        can be done both for case counts and fatalities.
   <li> Shift the timeline of a country by a few days to match the onset of the outbreak.
   <li> n-day centered moving averages are provided; examples: <br>
     n=3: mean of previous-, current- and subsequent day<br>
     n=1: raw data
   <li> Examine total or per capita data. Per 10⁵ Inh. (inhabitants) means
        (per capita) x 100000.
   <li> Pick a custom color by clicking the color wheel  &nbsp;
        <img src="./img/colorwheel.png" style="height: 15px; margin-bottom: 0;">.
   <li> Download the data currently displayed as a csv file using &nbsp;
        <img src="./img/download_data.svg" style="height: 20px; margin-bottom: 0;">.
        The downloaded data includes all manual data modifications, as well as whether "Per 10⁵ Inh."
        or "Absolute" is selected in the plot. Note that you can either choose to download the
        data of all graphs/countries currently shown using the download button at the bottom
        right of the graph, as well as data for a single graph by clicking the download button
        in the respective adjustment panel.
   <li> Export your plot to a png-image, using &nbsp;
        <img src="./img/download.svg" style="height: 15px; margin-bottom: 0;">.
   <li> For support please contact Fabian Schubert:
   <font color="#990000">
   <span onclick="this.innerHTML='fschubert';
       document.getElementById('add_2').innerHTML='@';
       document.getElementById('itp_2').innerHTML='itp.uni-frankfurt.de';"
       style="cursor: pointer;">click to show email</span><span id="add_2"></span><span id="itp_2"></span></font>
   <li> Additional functionalities are planned.
   </ul>

   <h2>Representations of an Epidemic Outbreak</h2>
   <ul>
   <li> <b>Timeline:</b> Data (case/total counts) as a function of time (date).
   <li> <b>XI representation:</b> I: daily counts (cases/fatalities) as a function of
                              X: total counts (cases/fatalities) <br>
     Time is implicit; allows to compare/extract parameters.
   <li> <b>Publication:</b>
   <em><a href="http://arxiv.org/abs/2004.00493" class="blackText" target="_blank" >
   "Containment efficiency and control strategies for the Corona pandemic costs"</a></em>,
   <br>
   C. Gros, R. Valenti, L. Schneider, K. Valenti, D. Gros (2020)
   </ul>

   <h2>Covid-19 Data Sources</h2>
   <ul>
   <li> <b>WHO:<a href="https://covid19.who.int/WHO-COVID-19-global-data.csv"
        target="_blank"
        class="blackText"> World Health Organization Covid-19 Data Table</a> (world wide countries).<br>
        WHO data used on this website was last updated on <?php include './php/whoDataSourcesLastDownload.php';?>.
   <li> <b>JH-CSSE:</b> <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank"
        class="blackText">John Hopkins Center For Systems Science and Engineering Covid-19 Github repository</a> (US states).
   <li> World and EU aggregates: calculated from WHO data.
   </ul>

   <h2>Terms</h2>
   <ul>
   <li> The Goethe Interactive COVID-19 Analyzer is free to use.
   <li> The source code is maintained on <a href="https://github.com/FabianSchubert/CoronaWebsite">GitHub</a>.
   <li> Graphics produced can be used both for private and commercial purposes,<br>
     when including the disclaimer "Produced using the Goethe Interactive COVID-19 Analyzer".
   <li> Online publications need to include a link to this website.
   </ul>

   <h2>Data Protection</h2>
   <ul>
   <li> We notify that the used Covid-19 data may contain errors and
     inconsistencies.
   <li> Please take the note of the
   <a href="https://www.uni-frankfurt.de/72059554/Datenschutz">data privacy statement</a>.
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
         timeShift="0"
         n_avg="3"
         displayData="cases"
         idx="0"
		     o="0"
         dateSlideMin="0"
         dateSlideMax="1"
         style="padding-right: 17px; background-color: #ff0000;">
		 
            <p class="countryBoxHeader">TemplateCountry</p>
			
            
            <input type="image"
            src="./img/download_data_white.svg"
      id = "DownloadCSV"
      title = "export files as csv "
      style="
      border-style: none;
      position: absolute;
      right: 30px; top: 10px; height: 40px;"
	  onclick="downloadCSV1(this)">
            
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
               <span >
                  <input type="range"
                  min="1"
                  max="50"
                  value="2"
                  class="slider xScale"
                  oninput="xScaleSliderInput(this);">
                  </span>
               <input type="text"
               class="sliderRangeField max"
               value="25"
			   style=" position: absolute; top: 67px; right: 40px; color:black"
               oninput="scaleMaxInput(this)" style ="color: black;">
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
                  value="2"
                  class="slider yScale"
                  oninput="yScaleSliderInput(this);">
               </span>
               <input type="text"
               class="sliderRangeField max"
               value="25"
			   style=" position: absolute; top: 122px; right: 40px; color:black"
               oninput="scaleMaxInput(this)" style ="color: black ;">
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
			   <input type="text"
               class="sliderRangeField max"
               value="365"
			   style=" position: absolute; top: 172px; right: 40px; width: 11%; color:black"
               oninput="timeMaxInput(this)" style ="color: black ;">

            </div>
            
            
            <!-- lock scale button 
            <input type="image"
            src="./img/lock_open.svg"
            class="scaleLock"
            onclick="scaleLockClick(this);" style="width: 11%;">-->
                         
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

            
            <!--
            <span>Select Start/End Date</span>
            
            <div id="datelock" class="rangeContainer">
               <span >
                  <div id="daterange" class="dateRange" style ="height: 6.5px;" 
                  onmouseover="dateRangeclick(this);" ></div>
               </span>
            </div>-->

            <span>Select Start/End Date</span>
            
            <div id="datelock" class="rangeContainer">
               <span >
                  <div id="daterange" class="dateRange" style ="height: 6.5px;"></div>
               </span>
            </div>

            <div class="dropdown"
                title = "Choose Data">
            
            <button class="dropbtn switchData"  type="button" data-toggle="dropdown" >Choose&nbsp;Data</button>
            <div style = "padding-top: 0px;" class="dropdown-menu dropdown-content dropdown-data">
            <li><a href="javascript:void(0)" onclick ="DataTypeClick(this,'cases')">Cases</a></li>
            <li><a href="javascript:void(0)" onclick ="DataTypeClick(this,'deaths')">Deaths</a></li>
            <li><a href="javascript:void(0)" onclick ="DataTypeClick(this,'vaccines')">Fully Vaccinated</a></li>             
           </div>
           </div>



         </div>
      </template>
      
      <script src="./js/dataProcess.js"></script>
      <script src="./js/plotting.js"></script>
      <script src="./js/dropdown.js"></script>
      <script src="./js/main.js"></script>
      <script src="./js/misc.js"></script>
	  
	  
<?php include './php/visitCounter.php';?>

   
</body>
</html>
