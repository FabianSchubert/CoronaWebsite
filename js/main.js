let tab;
let tab2;

const linkJohnsHopkinsConfirmedUS = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv'
const linkJohnsHopkinsDeathsUS = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv';

const linkECDC = './dat/ecdc.csv';
const linkWHO = './dat/who.csv';

var countries = [];
var times = [];
var tabArr = [];
var tabArrDeaths = [];
var population = [];

var countries_ecdc;
var times_ecdc;
var tabArr_ecdc;
var tabArrDeaths_ecdc;
var population_ecdc;

var usstates;
var times_usstates;
var tabArr_usstates_confirmed;
var tabArr_usstates_deaths;

var showPopRel = true; // if true, shows numbers relative to 100000 inhabitants.
//else, absolute numbers

// mode is 'daily', 'total' or 'time'
var xAxMode = "time";
var yAxMode = "daily";

var myLineChart;

var nRows;
var nCols;
var countries;
var provinces;

var nPlots = 0;
var colCicleState = 0;

var addPlotCounter = 0;

var eu27 = [
"Austria",
"Belgium",
"Bulgaria",
"Croatia",
"Cyprus",
"Czechia",
"Denmark",
"Estonia",
"Finland",
"France",
"Germany",
"Greece",
"Hungary",
"Ireland",
"Italy",
"Latvia",
"Lithuania",
"Luxembourg",
"Malta",
"Netherlands",
"Poland",
"Portugal",
"Romania", 
"Slovakia",
"Slovenia",
"Spain",
"Sweden"
]

var eu19 = [
"Belgium",
"Germany",
"Estonia",
"Finland",
"France",
"Greece",
"Ireland",
"Italy",
"Latvia",
"Lithuania",
"Luxembourg",
"Malta",
"Netherlands",
"Austria",
"Portugal",
"Slovakia",
"Slovenia",
"Spain",
"Cyprus"
]

const colCicle = [
'rgba(76, 114, 176,255)',
'rgba(221, 132,  82,255)',
'rgba( 85, 168, 104,255)',
'rgba(196,  78,  82,255)',
'rgba(129, 114, 179,255)',
'rgba(147, 120,  96,255)',
'rgba(218, 139, 195,255)',
'rgba(140, 140, 140,255)',
'rgba(204, 185, 116,255)',
'rgba(100, 181, 205,255)'
];

Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.responsive = true;
const nColors = colCicle.length



function preload() {
   
   // load table from Johns Hopkins University
   //tab = loadTable(linkJohnsHopkins,'csv','header');
   tab = loadTable(linkWHO,'csv','header');
   tab2 = loadTable(linkECDC,'csv','header');
   
   tab_us_states_confirmed = loadTable(linkJohnsHopkinsConfirmedUS,'csv','header');
   tab_us_states_deaths = loadTable(linkJohnsHopkinsDeathsUS,'csv','header');
   
   //https://www.census.gov/data/tables/time-series/demo/popest/2010s-state-total.html
   //tab_us_states_population = loadTable('./dat/us_states_population.csv','csv','header');
   
   /*
   // load table from European Centre for Disease Prevention and Control
   table = loadJSON(
      'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/');
   
   // loadTable returns a p5.js - Table object
   */
}



function setup() {
   //console.log(table.columns);
   
   [countries_ecdc, times_ecdc, tabArr_ecdc, tabArrDeaths_ecdc, population_ecdc] = processDataECDC(tab,tab2);
   [usstates_johns_hopkins, times_usstates, tabArr_usstates_confirmed] = processDataJohnsHopkinsConfirmed(tab_us_states_confirmed);
   [usstates_johns_hopkins, times_usstates, tabArr_usstates_deaths, population_usstates] = processDataJohnsHopkinsDeaths(tab_us_states_deaths);
   
   //merge...
   for(let i=0;i<countries_ecdc.length;i++){
      if((!isNaN(population_ecdc[i])) && (population_ecdc[i] != 0)){
         countries.push(countries_ecdc[i]);
         times.push(times_ecdc);
         tabArr.push(tabArr_ecdc[i]);
         tabArrDeaths.push(tabArrDeaths_ecdc[i]);
         population.push(population_ecdc[i]);
      }
   } 
  
   for(let i=0;i<usstates_johns_hopkins.length;i++){
      if((!isNaN(population_usstates[i])) && (population_usstates[i] != 0)){
         countries.push(usstates_johns_hopkins[i]);
         times.push(times_usstates);
         tabArr.push(tabArr_usstates_confirmed[i]);
         tabArrDeaths.push(tabArr_usstates_deaths[i]);
         population.push(population_usstates[i]);
      }
   }
   
   // add a world aggregate
   let world_total_conf = Array(times_ecdc.length);
   world_total_conf.fill(0);
   let world_total_deaths = Array(times_ecdc.length);
   world_total_deaths.fill(0)
   let world_total_population = 0;
   
   countries.push("World");
   times.push(times_ecdc);
   
   for(let i=0;i<countries_ecdc.length;i++){
      for(let j=0;j<times_ecdc.length;j++){
         world_total_conf[j] += tabArr_ecdc[i][j];
         world_total_deaths[j] += tabArrDeaths_ecdc[i][j];
      }
      // "world population" as a sum over all countries in ecdc data, to be consistent.
      world_total_population += (population_ecdc[i] || 0);
   }
   tabArr.push(world_total_conf);
   tabArrDeaths.push(world_total_deaths);
   population.push(world_total_population);
   
   // add a eu_27 aggregate
   
   let eu27_total_conf = Array(times_ecdc.length);
   eu27_total_conf.fill(0);
   let eu27_total_deaths = Array(times_ecdc.length);
   eu27_total_deaths.fill(0)
   let eu27_total_population = 0;
   
   countries.push("EU27");
   times.push(times_ecdc);
   
   for(let i=0;i<countries_ecdc.length;i++){
      if(eu27.includes(countries_ecdc[i])){
         for(let j=0;j<times_ecdc.length;j++){
            eu27_total_conf[j] += tabArr_ecdc[i][j];
            eu27_total_deaths[j] += tabArrDeaths_ecdc[i][j];  
         }
         eu27_total_population += (population_ecdc[i] || 0);
      }
      
   }
   tabArr.push(eu27_total_conf);
   tabArrDeaths.push(eu27_total_deaths);
   population.push(eu27_total_population);
   
   // "eu 28" with uk:
   let eu28_total_conf = eu27_total_conf.slice();
   let eu28_total_deaths = eu27_total_deaths.slice();
   let eu28_total_population = eu27_total_population*1.;
   
   countries.push("EU28");
   times.push(times_ecdc);
   
   let idx_UK = countries_ecdc.indexOf("The United Kingdom");
   
   for(let j=0;j<times_ecdc.length;j++){
      eu28_total_conf[j] += tabArr_ecdc[idx_UK][j];
      eu28_total_deaths[j] += tabArrDeaths_ecdc[idx_UK][j];  
   }
   eu28_total_population += (population_ecdc[idx_UK] || 0);
   
   tabArr.push(eu28_total_conf);
   tabArrDeaths.push(eu28_total_deaths);
   population.push(eu28_total_population);
   
   
   // add a eu_19 aggregate
   
   let eu19_total_conf = Array(times_ecdc.length);
   eu19_total_conf.fill(0);
   let eu19_total_deaths = Array(times_ecdc.length);
   eu19_total_deaths.fill(0)
   let eu19_total_population = 0;
   
   countries.push("Euro19");
   times.push(times_ecdc);
   
   for(let i=0;i<countries_ecdc.length;i++){
      if(eu19.includes(countries_ecdc[i])){
         for(let j=0;j<times_ecdc.length;j++){
            eu19_total_conf[j] += tabArr_ecdc[i][j];
            eu19_total_deaths[j] += tabArrDeaths_ecdc[i][j];  
         }
         eu19_total_population += (population_ecdc[i] || 0);
      }
      
   }
   tabArr.push(eu19_total_conf);
   tabArrDeaths.push(eu19_total_deaths);
   population.push(eu19_total_population);
   
   
   
   
   
   // Change United States of America to "USA \\ Aggregate"
   us_idx = countries.indexOf("United States of America");
   countries[us_idx] = "USA / Aggregate";
   
   let len = countries.length;
   
   var indices = new Array(len);
   
   for (var i = 0; i < len; ++i) indices[i] = i;
   
   indices.sort(function (a, b) { return countries[a] < countries[b] ? -1 : countries[a] > countries[b] ? 1 : 0; });
   
   countries = indices.map(i => countries[i]);
   times = indices.map(i => times[i]);
   tabArr = indices.map(i => tabArr[i]);
   tabArrDeaths = indices.map(i => tabArrDeaths[i]);
   population = indices.map(i => population[i]);
  
   
   //[countries, times, tabArr] = processDataJohnsHopkins(tab);
   
   let nRows = tabArr.length;
   /*
   tableArray = table.getArray()
   
   nRows = tableArray.length;
   nCols = tableArray[0].length;
   
   countries = Array(nRows);
   provinces = Array(nRows);
   
   for(i=0;i<nRows;i++){
      countries[i] = tableArray[i][1];
      provinces[i] = tableArray[i][0];
   }
   
   let times=table.columns.slice(4);
   */
   
   
   $('#totalPopSwitch').children()[0].checked = false;
   
  
   
   let dropdown = document.getElementById("countryDropdownContent");
   var newEntry;
   for(i=0;i<nRows;i++){
      newEntry = document.createElement('a');
      newEntry.innerHTML = countries[i];
	  newEntry.href = "#undefined1"
      newEntry.id = countries[i] + "DropdownEntry";
	  newEntryListe = document.createElement('li');
	  newEntryListe.appendChild(newEntry)
      newEntry.onclick = function(){
         let findidx = countries.indexOf(this.innerHTML);
         addPlot(findidx);
         document.getElementById("countryDropdownContent").classList.remove("show");
	 var box = document.getElementById("countryBoxContainer")
	if(box.getAttribute("lockDatesAll") == "false"){
		box.setAttribute("lockDatesAll","true");
		
		/*box.setAttribute("lockDatesAll","true");*/
		
	  } 
	 };
	  dropdown.appendChild(newEntryListe);
   }
   
   
      
   //updatePlot(test_idx);
   let ctx = document.getElementById('chart');
   
   myLineChart = new Chart(ctx, {
      type: 'scatter',
	  exportEnabled: true,
      data: {
         datasets:[],
		 
      },
      options:{
         
         tooltips: {
	
            callbacks: {
               label: 
			   function(tooltipItem, data) {
                  var label = data.datasets[tooltipItem.datasetIndex].label || '';
                  
				  
                  if (label) {
                     label += ' ( ';
                  }                  
                  
                  if (myLineChart.options.scales.xAxes[0].type == 'linear'){
                     label += Math.round(tooltipItem.xLabel * 100) / 100;
                  } else if (myLineChart.options.scales.xAxes[0].type == 'time'){
                     label += tooltipItem.xLabel.substring(0,
                     tooltipItem.xLabel.length - 12);
					 
                  }
                  
                  label += ' | ';
                  
                  label += Math.round(tooltipItem.yLabel * 100) / 100;
                  label += ' )'
				  
                  return label;
               } 
            }
         },
         
         devicePixelRatio: 2,
         scales:{
            yAxes: [{
               type: 'linear',
               scaleLabel: {
                  display: true,
                  labelString: "Daily new Cases / Deaths per 100000 Inh."
               }
            }],
            
            xAxes: [{
               type: 'linear', //'linear' or 'time'
               time: {
                  unit: 'day'
               },
               
               scaleLabel: {
                  display: true,
                  labelString: "Total Confirmed Cases / Deaths per 100000 Inhabitants"
               }   
            }]
         }
      }
    
	});
    
   updateAxes();
   let start_idx = countries.indexOf("World"); //Data Row for Germany...
   addPlot(start_idx);
   
   

	myLineChart.render();

document.getElementById("downloadCSV").addEventListener("click", function(){
  downloadCSV({ filename: "chart-data.csv", chart: myLineChart })
});
	

function convertChartDataToCSV(args) {  
  var result, columnDelimiter, lineDelimiter, data;
  
  data = args.data[0]
  if (data == null ) {
    return null;
  }
  var d = []
  var xDatum = []
  var xDatenTotalalle = []
  var neueAufzählung = []
  var xDatenTimealle = []
  
  
	
  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';
  result = '';
  result += columnDelimiter;
  for (var n =0; n<args.data.length; n++){
  result += document.getElementsByClassName("countryBoxHeader")[n].innerHTML
  result += columnDelimiter;}
  result += lineDelimiter; 
  result += lineDelimiter;
  result += 'x'
  result += columnDelimiter
  for (var n =0; n<args.data.length; n++){
  result += 'y'
  result += columnDelimiter;
  }
  result += lineDelimiter;
  var anzahlAttribute = [3,4,7,8,11]
 for (i in anzahlAttribute){
	 for (var n =0; n<args.data.length; n++){
		 ab = n+1
		 attrs = document.getElementById("countryBox"+ab).attributes
		 result += columnDelimiter
	 if (i == 3){
	
	result +=  "Averaging Window (Days) : " + (attrs[anzahlAttribute[i]].value*2+1)
	 
	 }else {
		 
	  result +=  attrs[anzahlAttribute[i]].name + " : " + attrs[anzahlAttribute[i]].value
	 
	 } 
 }result += columnDelimiter
 result += lineDelimiter;}
 
	for (var n =0; n<args.data.length; n++){
	 neueAufzählung[n] = 0
	}
	function Sortierung(a, b) { 
		return (a - b);
		} 
	 Aufzählung = 0
	 for (var n =0; n<args.data.length; n++){
		  for (var i =0; i<args.data[n].data.length; i++){
               xDatenTotalalle[Aufzählung] = args.data[n].data[i].x
	           Aufzählung += 1}}
	
	xDatenTotalalle.sort(Sortierung)
	

  
 if (myLineChart.options.scales.xAxes[0].type == 'linear'){
	 for (var i =0; i<(Aufzählung-1) ; i++){
	        xDatum[i]= Math.round(xDatenTotalalle[i]*100)/100
		 	result += xDatum[i]
			result += columnDelimiter;

	    for (var n =0; n<args.data.length; n++){
		 Zahl = neueAufzählung[n]
	
		 if (xDatenTotalalle[i] == args.data[n].data[Zahl].x){
			yDaten = (args.data[n].data[Zahl].y)
			result += Math.round(yDaten*100)/100
			result += columnDelimiter; 	
			neueAufzählung[n] +=1	;
				if (neueAufzählung[n] == args.data[n].data.length){
					neueAufzählung[n]=0
				}					
			}else{
				result += columnDelimiter; 
		 }}
		result += lineDelimiter;}
	
	
 }else if (myLineChart.options.scales.xAxes[0].type == 'time'){
	 for (var i =0; i<(Aufzählung-1) ; i++){
		 xDatenTimealle[i] = Math.round(xDatenTotalalle[i]/86400000)*86400000
	        d[i] = new Date(xDatenTimealle[i])
		    xDatum[i] = d[i].toDateString().slice(3, 10)
			h=i-1
			if (h==-1){h=4}
			if (xDatum[i]!== xDatum[h]){
				
		 	result += xDatum[i]
			result += columnDelimiter;

	    for (var n =0; n<args.data.length; n++){
		 Zahl = neueAufzählung[n]
			abgerundet= Math.round(args.data[n].data[Zahl].x/86400000)*86400000
		 if (xDatenTimealle[i] == abgerundet){
			yDaten = (args.data[n].data[Zahl].y)
			result += Math.round(yDaten*100)/100
			result += columnDelimiter; 	
			neueAufzählung[n] +=1	;
				if (neueAufzählung[n] == args.data[n].data.length){
					neueAufzählung[n]=0
				}					
			}else{
				result += columnDelimiter; 
			}}result += lineDelimiter;}
		}	
} console.log(Date(xDatenTimealle[0]))
  return result;
}

function downloadCSV(args) {
  var data, filename, link;
  var csv = "";
   
 
    csv += convertChartDataToCSV({ 
      data: args.chart.data.datasets
    });
  
  if (csv == null) return;

  filename = args.filename || 'chart-data.csv';
  
  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
   
  data = encodeURI(csv);
  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  document.body.appendChild(link); // Required for FF
	link.click(); 
	document.body.removeChild(link);   
}
   
   //$.loadScript('./presets/preset.js', function(){});
   
   
   /*let country = tableArray[test_idx][1];
   
      
   let plotdata =  {
      labels: times,
      datasets:[{
         label: country,
         data: processDataDailyVsTotal(test_idx),
         lineTension: 0.,
         backgroundColor: 'rgba(0,0,0,.0)',
         borderColor: 'rgba(0,0,255,1)',
         pointBackgroundColor: 'rgba(0,0,255,1)'
      }]
   }

   var ctx = document.getElementById('chart');
   myLineChart = new Chart(ctx, {
      type: 'scatter',
   
      data: plotdata,
      options:{
         scales:{
            yAxes: [{
               type: 'linear',
               scaleLabel: {
                  display: true,
                  labelString: "Daily new Cases"
               }
            }],
            
            xAxes: [{
               type: 'linear',
               scaleLabel: {
                  display: true,
                  labelString: "Total Cases"
               }   
            }]
         }
      }
   });*/
  
}




jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}


function convertChartDataToCSV1(args) {  
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;
  
  data = args.data.data;
  if (data == null ) {
    return 2;
  }
  var d = []
  var xDatum = []
  var yNachkomma = []
  

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';
  indexZahl = args.data._meta[0].index+1
  keys = Object.keys(data[0]);
  
  attrs = document.getElementById("countryBox"+indexZahl).attributes
  selfCountryBox = document.getElementById("countryBox"+indexZahl)
  
  result = '';
  result += columnDelimiter;
  result += document.getElementsByClassName("countryBoxHeader")[indexZahl-1].innerHTML
  result += lineDelimiter;
  result += lineDelimiter;
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  var anzahlAttribute = [3,4,7,8,11]
 for (i in anzahlAttribute){
	 if (i == 3){
		 result += columnDelimiter;
   result += lineDelimiter;
	result +=  "Averaging Window (Days) : " + (attrs[anzahlAttribute[i]].value*2+1)
	  
	 }else {
		 result += columnDelimiter;
		result += lineDelimiter;
	    result +=  attrs[anzahlAttribute[i]].name + " : " + attrs[anzahlAttribute[i]].value
	  
 }} result += lineDelimiter;
	for (var i =0; i<args.data.data.length; i++){
	xDaten = (args.data.data[i].x)
	yDaten = (args.data.data[i].y)
	if (myLineChart.options.scales.xAxes[0].type == 'linear'){
	xDatum[i]= Math.round(xDaten*100)/100
	}else if (myLineChart.options.scales.xAxes[0].type == 'time'){
	d[i] = new Date(xDaten)
	xDatum[i] = d[i].toDateString().slice(3, 10)}
	result += xDatum[i]
	result += columnDelimiter;
	result += Math.round(yDaten*100)/100
	result += lineDelimiter;
  }
  return result;
}

function downloadCSV1(args) {
  var data, filename, link;
  var csv = "";
  let self = $(args);
  let selfCountryBox = self.parent()
  neu = selfCountryBox.attr("o")-1
 
    csv += convertChartDataToCSV1({
      data: myLineChart.data.datasets[neu]
    });
  
  if (csv == null) return;

  filename2 = selfCountryBox.children(".countryBoxHeader")[0].innerHTML
  filename =filename2+'.csv'
  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  
  data = encodeURI(csv);
  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  document.body.appendChild(link); // Required for FF
	link.click(); 
	document.body.removeChild(link);   
}
