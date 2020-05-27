let tab;

const linkJohnsHopkins = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

const linkECDC = './dat/ecdc.csv';

var countries;
var times;
var tabArr;
var tabArrDeaths;
var population;

// mode is 'daily', 'total' or 'time'
var xAxMode = "total";
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
   
   
   /*
   // load table from European Centre for Disease Prevention and Control
   table = loadJSON(
      'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/');
   
   // loadTable returns a p5.js - Table object
   */
}



function setup() {
   //console.log(table.columns);
   
   [countries, times, tabArr, tabArrDeaths, population] = processDataECDC(tab);
   
   
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
   
   
   let dropdown = document.getElementById("myDropdown");
   var newEntry;
   for(i=0;i<nRows;i++){
      newEntry = document.createElement('a');
      newEntry.innerHTML = countries[i];
      newEntry.id = countries[i] + "DropdownEntry";
      newEntry.onclick = function(){
         let findidx = countries.indexOf(this.innerHTML);
         addPlot(findidx);
         document.getElementById("myDropdown").classList.toggle("show");
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
   
   
   let start_idx = 75; //Data Row for Germany...
   addPlot(start_idx);
   
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