var table;

var tableArray;

var myLineChart;

var nRows;
var nCols;
var countries;
var provinces;

var nPlots = 1;

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

const nColors = colCicle.length

function preload() {
   //my table is comma separated value "csv"
   //and has a header specifying the columns labels
   table = loadTable(
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
       'csv', 'header');
   // loadTable returns a p5.js - Table object, which has some
   // neat additional functions. A raw 2d-nested array with the data
   // can be retrieved via table.getArray()
}

function convert2dData(datArray){
   // convert nested 2d array into list of of objects with x and y property,
   // as required by the scatter plot 
   let n_points = datArray.length;
   convArray = [];
   for(let i=0;i<n_points;i++){
      convArray.push({x: parseFloat(datArray[i][0]), y: parseFloat(datArray[i][1])});
   }

   return convArray; 
}


function getDailyChange(timeseries){
   let n = timeseries.length;
   change = Array(n-2);
   for(i=1;i<n-1;i++){
      change[i-1] = (timeseries[i+1] - timeseries[i-1])/2.;
   }
   
   return change;
}

function transpose(x){
   let m = x.length;
   let n = x[0].length;
   
   let y = Array(n);
   
   for(i=0;i<n;i++){
      y[i] = Array(m);
      for(j=0;j<m;j++){
         y[i][j] = x[j][i];
      }
   }   
   return y;
}

function updatePlot(idx){
   
   nPlots++;
   
   let plotdata = {
         label: countries[idx],
         data: processDataDailyVsTotal(idx),
         lineTension: 0.,
         backgroundColor: 'rgba(0,0,0,.0)',
         borderColor: colCicle[(nPlots-1)%nColors],
         pointBackgroundColor: colCicle[(nPlots-1)%nColors]
      };
   
   myLineChart.data.datasets.push(plotdata);
   
   myLineChart.update();
   
   console.log(myLineChart.data.datasets);
      
     
   
}

function processDataDailyVsTotal(idx){
   let total=tableArray[idx].slice(4);
   let datapoints = convert2dData(
      transpose([total.slice(1,total.length-1),getDailyChange(total)]));
   return datapoints;
}


function setup() {
   //console.log(table.columns);
   
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
   
   let dropdown = document.getElementById("myDropdown");
   var newEntry;
   for(i=0;i<nRows;i++){
      newEntry = document.createElement('a');
      newEntry.innerHTML = countries[i];
      newEntry.id = countries[i] + "DropdownEntry";
      newEntry.onclick = function(){
         let findidx = countries.indexOf(this.innerHTML);
         updatePlot(findidx);
         document.getElementById("myDropdown").classList.toggle("show");
      };
      dropdown.appendChild(newEntry);
   }
   
   
   let start_idx = 120;
   
   
   
   //updatePlot(test_idx);
   let ctx = document.getElementById('chart');
   
   myLineChart = new Chart(ctx, {
      type: 'scatter',
   
      data: {
         datasets:[{
         label: countries[start_idx],
         data: processDataDailyVsTotal(start_idx),
         lineTension: 0.,
         backgroundColor: 'rgba(0,0,0,.0)',
         borderColor: colCicle[(nPlots-1)%nColors],
         pointBackgroundColor: colCicle[(nPlots-1)%nColors]
      }]
      },
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
   });
   
   
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