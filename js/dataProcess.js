//zero-padding for numbers

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}



function processDataJohnsHopkins(tab){
      
   let tabArr = tab.getArray();
   
   let nRows = tabArr.length;
   // we do not want the province, lon and lat columns:
   let nCols = tabArr[0].length-3;
   
   // get the date headers starting at column 4:
   let times = tab.columns.slice(4);
   
   let countries = Array(nRows);
   
   let procArr = Array(nRows);
   
   for(let i=0;i<nRows;i++){
      
      countries[i] = tabArr[i][1];
      
      procArr[i] = Array(nCols);
      for(let j=0;j<nCols;j++){
         procArr[i][j] = parseFloat(tabArr[i][4+j]);
      }
   }
   
   //return a list with the countries, the times, and the table with the data
   return [countries, times, procArr];
   
}

function processDataECDC(tab){
   //console.log(tab);
   
   let tabArr = tab.getArray();
   
   let nRows = tabArr.length;
   let nCols = tabArr[0].length;
   
   let countries = [];
   let population = [];
   let times = [];
   
   // Rows are clustered by country and sorted by days, starting with the most recent day.
   // Therefore, we can extract all dates and countries by simply scanning the table
   // top to bottom and extracting unique values.
   
   let date;
   let country;
      
   for(let i=0;i<nRows;i++){
      //Country Name is in row 6 (starting zero)
      country = tabArr[i][6];
      //replace underscores in country names with spaces
      //country = country.replace(/_/g," ");
      
      if(!(countries.includes(country))){
         countries.push(country);
         population.push(parseFloat(tabArr[i][9]));
      }
      
      date = (parseInt(tabArr[i][3])).pad(4) + "/" + (parseInt(tabArr[i][2])).pad(2) + "/" + (parseInt(tabArr[i][1])).pad(2);
      
      if(!(times.includes(date))){
         times.push(date);
      }
   }
   
   times.sort();
   
   let nCountries = countries.length;
   let nTimes = times.length;
   
   /*console.log(nCountries);
   console.log(nTimes);
   console.log(tabArr.length);
   console.log(nCountries*nTimes);*/
   
   let procArr = Array(nCountries);
   let procArrDeaths = Array(nCountries);
   
   for(let i=0;i<nCountries;i++){
      procArr[i] = Array(nTimes).fill(0.);
      procArrDeaths[i] = Array(nTimes).fill(0.);
   }
   
   let timeIdx;
   let countryIdx;
   
   for(let i=0; i<nRows; i++){
      date = (parseInt(tabArr[i][3])).pad(4) + "/" + (parseInt(tabArr[i][2])).pad(2) + "/" + (parseInt(tabArr[i][1])).pad(2);
      country = tabArr[i][6];
      
      timeIdx = times.indexOf(date);
      countryIdx = countries.indexOf(country);
      
      procArr[countryIdx][timeIdx] = parseFloat(tabArr[i][4])*1e5/population[countryIdx];
      procArrDeaths[countryIdx][timeIdx] = parseFloat(tabArr[i][5])*1e5/population[countryIdx];
   }
   
   for(let i=0; i<nCountries;i++){
      for(let j=1; j<nTimes;j++){
         procArr[i][j] = procArr[i][j-1] + procArr[i][j];
         procArrDeaths[i][j] = procArrDeaths[i][j-1] + procArrDeaths[i][j];
      }
   }
   
   //console.log(times);
   
   for(let i=0;i<nCountries;i++){
      //replace underscores in country names with spaces
      countries[i] = countries[i].replace(/_/g," ");
   }
   
   return [countries, times, procArr, procArrDeaths, population];
   
   
}


function convert2dData(datArray){
   // convert nested 2d array into list of of objects with x and y property,
   // as required by the scatter plot 
   let n_points = datArray.length;
   convArray = [];
   for(let i=0;i<n_points;i++){
      convArray.push({x: datArray[i][0], y: datArray[i][1]});
   }

   return convArray; 
}

function convertPointData(pointList){
   // convert back
   let n_points = pointList.length;
   convArray = Array(n_points);
   for(let i=0;i<n_points;i++){
      convArray[i] = [pointList[i].x,pointList[i].y];
   }
   
   return convArray;
}

// calculate backward difference (difference to previous day)
function getDailyChange(timeseries){
   let n = timeseries.length;
   
   change = Array(n-1);
   for(i=1;i<n;i++){
      change[i-1] = timeseries[i] - timeseries[i-1];
   }
   
   return change;
}

// smooth function with window of range i - n -> i + n (including i + n)
function smooth_filter(x,n){
   let N = x.length;
   let smooth_x = Array(N-2*n);
   let avg;
   for(let i=n;i<N-n;i++){
      avg = 0.;
      for(let j=-n;j<=n;j++){
         avg += x[i+j];
      }
      smooth_x[i-n] = avg / (2*n+1);
   }
   
   return smooth_x;
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

function scaleArr(x,s){
   let res = Array(x.length);
   for(let i=0;i<x.length;i++){
      res[i] = x[i]*s;
   }
   
   return res;
}

function processDataDailyVsTotal(idx,tabArr,smooth_n,xscale,yscale){
   let total=tabArr[idx];
   let total_cut = total.slice(1,total.length);
   let daily_change = getDailyChange(total)
   
   
   // find negative daily changes and remove
   // running loop backwards to avoid having to change
   // loop length on the fly...
   for(let i=total_cut.length-1;i>=0;i--){
      if(daily_change[i] < 0){
         total_cut.splice(i,1);
         daily_change.splice(i,1);
      }
   }
   
   
   let datapoints = convert2dData(
      transpose([scaleArr(smooth_filter(total_cut,smooth_n),xscale),
         scaleArr(smooth_filter(daily_change,smooth_n),yscale)]));
   
   return datapoints;
}

function I(x,g0,a){
   if(x<0 || x >= 1.){
      return 0.;
   } else {
      return Math.max(0.,Math.max(x*(g0+a)/g0 + Math.log(1-x)*(1.+a)/g0,0));
   }
}

function dIdg0(x,g0,a){
   return -x*a/g0**2. - Math.log(1-x)*(1.+a)/g0**2.;
}

function dIda(x,g0,a){
   return x/g0 + Math.log(1-x)/g0;
}

function fitI(x,y){
   let n = x.length;
   
   let eps = 1e-3;
   
   let n_it = 1;
   
   let g0 = 1.;
   let a = 1.;
   
   let dg0;
   let da;
   
   for(let i=0;i<n_it;i++){
      dg0 = 0;
      da = 0;
      
      for(let j=0;j<n;j++){
         dg0 += -(y[j]-I(x[j],g0,a))*dIdg0(x[j],g0,a);
         da += -(y[j]-I(x[j],g0,a))*dIda(x[j],g0,a);
      }
      g0 += eps * dg0;
      a += eps * da;
   }
   
   return [g0,a];
}