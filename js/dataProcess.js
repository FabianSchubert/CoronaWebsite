//zero-padding for numbers

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}



function processDataJohnsHopkinsConfirmed(tab){
      
   let tabArr = tab.getArray();
   
   let nRows = tabArr.length;
   // data starts at column 11 (zero counting)
   let nCols = tabArr[0].length-11;
   
   
   
   // get the date headers starting at column 11:
   let times = tab.columns.slice(11);   
   
   let countries = [];
   
   let procArr = [];
   
   let country_idx;
   
   for(let i=0;i<nRows;i++){
      
      country_idx = countries.indexOf("USA / " + tabArr[i][6]);
      
      if(country_idx == -1){
         countries.push("USA / " + tabArr[i][6]);
         procArr.push(tabArr[i].slice(11));
         
         for(let j=0;j<nCols;j++){
            procArr[procArr.length - 1][j] = parseFloat(procArr[procArr.length - 1][j]);
         }
         
      } else {
         for(let j=0;j<nCols;j++){
            procArr[country_idx][j] += parseFloat(tabArr[i][j+11]);
         }
         
      }
   }
   
   //console.log(times[0]);
   
   for(let i=0;i<times.length;i++){
      times[i] = Math.abs(new Date(times[i]));
   }
   
   //return a list with the countries, the times, and the table with the data
   return [countries, times, procArr];
   
}

function processDataJohnsHopkinsDeaths(tab){
      
   let tabArr = tab.getArray();
   
   let nRows = tabArr.length;
   // data starts at column 11 (zero counting)
   let nCols = tabArr[0].length-12;
   
   
   
   // get the date headers starting at column 11:
   let times = tab.columns.slice(12);   
   
   let countries = [];
   
   let procArr = [];
   
   let population = [];
   
   let country_idx;
   
   for(let i=0;i<nRows;i++){
      
      country_idx = countries.indexOf("USA / " + tabArr[i][6]);
      
      if(country_idx == -1){
         countries.push("USA / " + tabArr[i][6]);
         procArr.push(tabArr[i].slice(12));
         
         population.push(parseFloat(tabArr[i][11]));
         
         for(let j=0;j<nCols;j++){
            procArr[procArr.length - 1][j] = parseFloat(procArr[procArr.length - 1][j]);
         }
         
      } else {
         for(let j=0;j<nCols;j++){
            procArr[country_idx][j] += parseFloat(tabArr[i][j+12]);
         }
         population[country_idx] += parseFloat(tabArr[i][11]);
      }
   }
   
   //console.log(times[0]);
   
   for(let i=0;i<times.length;i++){
      times[i] = Math.abs(new Date(times[i]));
   }
   
   //return a list with the countries, the times, and the table with the data
   return [countries, times, procArr, population];
   
}





function processDataECDC(tab,tab2){
   //console.log(tab);
   
   let tabArr = tab.getArray();
   let tabArr2 = tab2.getArray()
   
   let nRows = tabArr.length;
   
   let nRows2 = tabArr2.length;
   
   let nCols = tabArr[0].length;
   
   let countries = [];
   let countriesList = [];
   let countriesList2 = [];
   let population = [];
   let population2 = [];
   let popul2 = [];
   let times = [];
   
   // Rows are clustered by country and sorted by days, starting with the most recent day.
   // Therefore, we can extract all dates and countries by simply scanning the table
   // top to bottom and extracting unique values.
   
   let date;
   let country;
   
   //neu
   
   c=0
   
   d=0
   for(let i=0;i<nRows;i++){if (i ==0){c=1000}else{c=i}
   if (tabArr[i][2] !== tabArr[c-1][2] ){countriesList[d] = tabArr[i][2] 
   d +=1}}
      
   d=0
   for(let i=0;i<nRows2;i++){if (i ==0){c=1000}else{c=i}
   if (tabArr2[i][4] !== tabArr2[c-1][4] ){countriesList2[d] = tabArr2[i][4] 
   popul2[d]=tabArr2[i][7]
   d +=1}}
   
   let nRowsCountrie = countriesList.length;
   let nRowsCountrie2 = countriesList2.length;
   
   b=0
   
   d=0
    for(let i=0;i<nRowsCountrie;i++){
   for(let a=0;a<nRowsCountrie2;a++){
   if (countriesList[i] == countriesList2[a] ){population2[i] = popul2[a]
	}}if (population2[i] ==0){population2[i]=1}}
   
   
   for(let i=0;i<nRows;i++){
      //Country Name is in row 6 (starting zero)
      country = tabArr[i][2];
      //replace underscores in country names with spaces
      //country = country.replace(/_/g," ");
	 
    
      if(!(countries.includes(country))){
         countries.push(country);
		 if (i ==0){a=1}else{a=i}
		 if (tabArr[i][2]=== tabArr[a-1][2]){
		 population.push(parseFloat(population2[b]));}else{ b += 1
			 population.push(parseFloat(population2[b]));
        
      } }
      
      date = (parseInt(tabArr[i][0].slice(0,4))).pad(4) + "/" + (parseInt(tabArr[i][0].slice(5,7))).pad(2) + "/" + (parseInt(tabArr[i][0].slice(8,10))).pad(2);
 
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
      
      country = tabArr[i][2];
      
      if(countries.includes(country)){
      
         date = (parseInt(tabArr[i][0].slice(0,4))).pad(4) + "/" + (parseInt(tabArr[i][0].slice(5,7))).pad(2) + "/" + (parseInt(tabArr[i][0].slice(8,10))).pad(2); //.pad(4) + "/" + (parseInt(tabArr[i][2])).pad(2) + "/" + (parseInt(tabArr[i][1])).pad(2);
         
         
         timeIdx = times.indexOf(date);
         countryIdx = countries.indexOf(country);
         
         procArr[countryIdx][timeIdx] = parseFloat(tabArr[i][4]);//*1e5/population[countryIdx];
		 if (tabArr[i][4]<0){
			 procArr[countryIdx][timeIdx] = 0
		 }
         procArrDeaths[countryIdx][timeIdx] = parseFloat(tabArr[i][6]);//*1e5/population[countryIdx];
      }
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
   
   // convert times to list of integers denoting absolute time
   for(let i=0;i<times.length;i++){
      times[i] = Math.abs(new Date(times[i]));
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

function scaleArr(x,s,x0=0){
   let res = Array(x.length);
   for(let i=0;i<x.length;i++){
      res[i] = (x[i]-x0)*s+x0;
   }
   
   return res;
}

function addArrScal(x,s){
   let res = Array(x.length);
   for(let i=0;i<x.length;i++){
      res[i] = x[i]+s;
   }
   
   return res;
}

function processDataDailyVsTotal(idx,tabArr,times_list,population,smooth_n,xscale,yscale,xcut,ycut,timeShift,xMode,yMode){
   let total=tabArr[idx].slice(xcut,tabArr[idx].length - ycut);
   let total_cut = total.slice(1,total.length);
   let daily_change = getDailyChange(total)
   let times = times_list[idx].slice(xcut,times_list[idx].length-ycut);
   
   // find negative daily changes and remove
   // running loop backwards to avoid having to change
   // loop length on the fly...
   for(let i=total_cut.length-1;i>=0;i--){
      if(daily_change[i] < 0){
         total_cut.splice(i,1);
         daily_change.splice(i,1);
      }
   }
   let xData;
   let yData;
   
   // 1 day = 86 400 000 ms
   
   if(xMode == "daily"){
      xData = showPopRel ? scaleArr(smooth_filter(daily_change,smooth_n),xscale*1e5/population[idx])
      : scaleArr(smooth_filter(daily_change,smooth_n),xscale);
   } else if(xMode == "total"){
      xData = showPopRel ? scaleArr(smooth_filter(total_cut,smooth_n),xscale*1e5/population[idx])
      : scaleArr(smooth_filter(total_cut,smooth_n),xscale);
   } else if(xMode == "time"){
      xData = addArrScal(scaleArr(smooth_filter(times.slice(1,times.length),
                     smooth_n),
                     xscale,times[1]),timeShift*864e5);
      //times.slice(1+smooth_n,times.length-smooth_n);
      /*
      console.log("length of sliced time array:")
      console.log(xData.length);
      console.log("length it should have:")
      console.log(smooth_filter(total_cut,smooth_n).length);
      console.log("length of initial total_arr:");
      console.log(total.length);
      console.log("length of initial time_arr:");
      console.log(times.length);*/
   } else{
      console.log("Error: Wrong x-axis mode specified");
   }
   if(yMode == "daily"){
      yData = showPopRel ? scaleArr(smooth_filter(daily_change,smooth_n),yscale*1e5/population[idx])
      : scaleArr(smooth_filter(daily_change,smooth_n),yscale);
   } else if(yMode == "total"){
      yData = showPopRel ? scaleArr(smooth_filter(total_cut,smooth_n),yscale*1e5/population[idx])
      : scaleArr(smooth_filter(total_cut,smooth_n),yscale);
   } else if(yMode == "time"){
      yData = addArrScal(scaleArr(smooth_filter(times.slice(1,times.length),
                     smooth_n),
                     yscale,times[1]),timeShift*864e5);
   } else{
      console.log("Error: Wrong y-axis mode specified");
   }
   
   
   let datapoints = convert2dData(
      transpose([xData,yData]));
	
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
