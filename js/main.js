const linkCountries = './dat/countries.csv'
const linkPopulation = './dat/population.csv'
const linkTimes = './dat/global_dates.csv'
const linkCountryFold = './dat/country_data/'

var countries = [];
var countriesTab;
var times = [];
var timesTab;
var tabArr = [];
var tabArrDeaths = [];
var tabArrVacc = [];
var population = [];
var populationTab;

var idxLockCountries = [];

var globalDateRangeMin = 0;
var globalDateRangeMax = 1;

var nDays;

var normmodeCasesDeaths = 2;
var normmodeVacc = 1;
var normmodeR = 0;

var showPopRel = true; // if true, shows numbers relative to 100000 inhabitants.
//else, absolute numbers

// mode is 'daily', 'total' or 'time'
var xAxMode = "time";
var yAxMode = "daily";

var xAxDataIdx = 0;

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

//var p5 = new p5();



function preload() {
   
   
   countriesTab = loadTable("./dat/countries.csv","csv");
   timesTab = loadTable("./dat/global_dates.csv","csv");
   populationTab = loadTable("./dat/population.csv","csv");

}



function setup() {

   countries = countriesTab.getArray()[0]
   population = populationTab.getArray()[0]
   times = timesTab.getArray()[0]



   for(let i=0;i<times.length;i++){
      times[i] = Math.abs(new Date(times[i])); 
   }

   nDays = Math.round((times[times.length-1] - times[0])/864e5);

   nCountries = countries.length;

   tabArr = Array(nCountries);
   tabArrDeaths = Array(nCountries);
   tabArrVacc = Array(nCountries);

   //xData = times.slice();
   
   //$('#totalPopSwitch').children()[0].checked = false;
   
  
   
   let dropdown = document.getElementById("countryDropdownContent");

   var newEntry;

   for(i=0;i<nCountries;i++){

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
         var box = document.getElementById("countryBoxContainer");

         if(box.getAttribute("lockDatesAll") == "false"){
            box.setAttribute("lockDatesAll","true");
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
                  labelString: "Daily new Cases / Deaths per 10⁵ Inh."
               }
            }],
            
            xAxes: [{
               type: 'linear', //'linear' or 'time'
               time: {
                  unit: 'day'
               },
               
               scaleLabel: {
                  display: true,
                  labelString: "Total Cases / Deaths per 10⁵ Inhabitants"
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
  downloadCSV();
});

  
}




jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}



