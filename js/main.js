let tab;

const linkJohnsHopkinsConfirmedUS = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv'
const linkJohnsHopkinsDeathsUS = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv';

const linkECDC = './dat/ecdc.csv';

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

const nColors = colCicle.length



function preload() {
   
   // load table from Johns Hopkins University
   //tab = loadTable(linkJohnsHopkins,'csv','header');
   tab = loadTable(linkECDC,'csv','header');
   
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
   
   [countries_ecdc, times_ecdc, tabArr_ecdc, tabArrDeaths_ecdc, population_ecdc] = processDataECDC(tab);
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
      newEntry.id = countries[i] + "DropdownEntry";
      newEntry.onclick = function(){
         let findidx = countries.indexOf(this.innerHTML);
         addPlot(findidx);
         document.getElementById("countryDropdownContent").classList.toggle("show");
      };
      dropdown.appendChild(newEntry);
   }
      
   //updatePlot(test_idx);
   let ctx = document.getElementById('chart');
   
   myLineChart = new Chart(ctx, {
      type: 'scatter',
   
      data: {
         datasets:[]
      },
      options:{
         
         tooltips: {
            callbacks: {
               label: function(tooltipItem, data) {
                  var label = data.datasets[tooltipItem.datasetIndex].label || '';

                  if (label) {
                     label += ' ( ';
                  }
                  
                  
                  
                  if (myLineChart.options.scales.xAxes[0].type == 'linear'){
                     label += Math.round(tooltipItem.xLabel * 100) / 100;
                  } else if (myLineChart.options.scales.xAxes[0].type == 'time'){
                     label += tooltipItem.xLabel.substring(0,
                     tooltipItem.xLabel.length - 13);
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
   //let start_idx = countries.indexOf("Germany"); //Data Row for Germany...
   //addPlot(start_idx);
   
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
