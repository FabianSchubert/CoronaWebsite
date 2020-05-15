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

function processDataDailyVsTotal(idx,tabArr){
   let total=tabArr[idx];
   let datapoints = convert2dData(
      transpose([total.slice(1,total.length-1),getDailyChange(total)]));
   return datapoints;
}