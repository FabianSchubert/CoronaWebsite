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
   console.log(tab);
   
   return [0,0,0];
}

https://opendata.ecdc.europa.eu/covid19/casedistribution/csv

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

function processDataDailyVsTotal(idx,tabArr,smooth_n){
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
      transpose([smooth_filter(total_cut,smooth_n),smooth_filter(daily_change,smooth_n)]));
   
   return datapoints;
}