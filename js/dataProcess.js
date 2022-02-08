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


function processDataOWID(tab){

   /*
   columns:
   2: Country Name
   5: new cases
   8: new deaths
   48: population
   36: People fully vaccinated

   */

   let tabArr = tab.getArray();
   let tabArrTransp = transpose(tabArr)

   let nRows = tabArr.length;
   let nCols = tabArr[0].length;

   let countries = [];
   let times = [];
   let population = [];

   let country;
   let pop;

   let cases = [];
   let deaths = [];
   let fullvacc = [];
   let dates_local = [];

   let caseinst;
   let deathinst;
   let fullvacc_inst = [];

   for(let i=0;i<nRows;i++){
      country = tabArr[i][2];
      if(!(countries.includes(country))){
         countries.push(country);
         population.push(parseFloat(tabArr[i][48]));
         cases.push([]);
         deaths.push([]);
         fullvacc.push([]);
         dates_local.push([]);
      } 
         
      caseinst = tabArr[i][5];
      if(caseinst == ""){
         caseinst = 0.0;
      } else {
         caseinst = parseFloat(caseinst);
      }
      cases[cases.length-1].push(caseinst);
      
      deathinst = tabArr[i][8];
      if(deathinst == ""){
         deathinst = 0.0;
      } else {
         deathinst = parseFloat(deathinst);
      }
      deaths[deaths.length-1].push(deathinst);

      fullvacc_inst = tabArr[i][36];
      if(fullvacc_inst == ""){
         fullvacc_inst = 0.0;
      } else {
         fullvacc_inst = parseFloat(fullvacc_inst);
      }
      fullvacc[fullvacc.length-1].push(fullvacc_inst);


      date = (parseInt(tabArr[i][3].slice(0,4))).pad(4) + "/" + (parseInt(tabArr[i][3].slice(5,7))).pad(2) + "/" + (parseInt(tabArr[i][3].slice(8,10))).pad(2);
      
      dates_local[dates_local.length-1].push(date);

      if(!(times.includes(date))){
         times.push(date);
      }
      //console.log(date);
   }

   times.sort();

   nCountries = countries.length;
   nTimes = times.length;
   
   let procArr = []; 
   let procArrDeaths = [];
   let procArrVacc = [];

   let idxtime;

   for(let i=0;i<nCountries;i++){
      procArr.push([]);
      procArrDeaths.push([]);
      procArrVacc.push([]);
      for(let j=0;j<nTimes;j++){
         idxtime = dates_local[i].indexOf(times[j]);
         if(idxtime == -1){
            procArr[i].push(0.0);
            procArrDeaths[i].push(0.0);
            procArrVacc[i].push(0.0);
         } else {
            procArr[i].push(cases[i][idxtime]);
            procArrDeaths[i].push(deaths[i][idxtime]);
            procArrVacc[i].push(fullvacc[i][idxtime]);
         }
         
         //procArr[i].push(0.0);
      }
      //console.log(procArr[i].length);
   }
   
   //console.log(nCountries);
   console.log(times);
   // convert times to list of integers denoting absolute time
   for(let i=0;i<times.length;i++){
      times[i] = Math.abs(new Date(times[i]));
     
   }

   for(let i=0; i<nCountries;i++){
      for(let j=1; j<nTimes;j++){
         procArr[i][j] = procArr[i][j-1] + procArr[i][j];
         procArrDeaths[i][j] = procArrDeaths[i][j-1] + procArrDeaths[i][j];
      }
   }

   console.log(procArr.length);
   console.log(procArrDeaths.length);
   console.log(procArrVacc.length);

   return [countries, times, procArr, procArrDeaths, procArrVacc, population];

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
   /*
   c=0
   
   d=0
   for(let i=0;i<nRows;i++){if (i ==0){c=1000}else{c=i}
   if (tabArr[i][2] !== tabArr[c-1][2] ){countriesList[d] = tabArr[i][2] 
   d +=1}}
      
   d=0
   for(let i=0;i<nRows2;i++){if (i ==0){c=1000}else{c=i}
   if (tabArr2[i][1] !== tabArr2[c-1][4] ){countriesList2[d] = tabArr2[i][4] 
   popul2[d]=tabArr2[i][7]
   d +=1}}
   */
   
   for(let i=0;i<nRows2;i++){
      population2[i] = parseFloat(tabArr2[i][1]);
   }
  
   let b = 0;
   
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
   let nTimes = times.length;
   let nCountries = countries.length;
   
   

   
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
         
         y=parseFloat(tabArr[i][4])
		 x=1
		 z=1
		 
         timeIdx = times.indexOf(date);
         countryIdx = countries.indexOf(country);
         
       
		 if (tabArr[i][4]<0){	 
		 
			 for(let a=0; a<1000 ;a++){
				
				y+= parseFloat(tabArr[i-1-a][4])
				
			     x+=1 			
				z+=x
				if (y>0){a=999}
				
			 }differenz=y
			 b= (y)+(-y)*0.8
			 c= b/x
			d= (y)*0.8/z	 
			for (let timesIdx1=0; timesIdx1<1000; timesIdx1++){
				neu =timeIdx-timesIdx1
			 procArr[countryIdx][neu] = Math.round(c+d*x);
			 
			 differenz-=Math.round(c+d*x)
			 x-=1
			 if (x==0){timesIdx1=999}
			}procArr[countryIdx][timeIdx]+=differenz }else{ procArr[countryIdx][timeIdx] = parseFloat(tabArr[i][4]);}//*1e5/population[countryIdx];
          y=parseFloat(tabArr[i][6])
		 x=1
		 z=1
		 if (tabArr[i][6]<0){	 
		 
			 for(let a=0; a<1000 ;a++){
				
				y+= parseFloat(tabArr[i-1-a][6])
				
			     x+=1 			
				z+=x
				if (y>0){a=999}
				
			 }differenz=y
			 b= (y)+(-y)*0.8
			 c= b/x
			d= (y)*0.8/z	 
			for (let timesIdx1=0; timesIdx1<1000; timesIdx1++){
				neu =timeIdx-timesIdx1
			 procArrDeaths[countryIdx][neu] = Math.round(c+d*x);
			 
			 differenz-=Math.round(c+d*x)
			 x-=1
			 if (x==0){timesIdx1=999}
			}procArrDeaths[countryIdx][timeIdx]+=differenz }else{ procArrDeaths[countryIdx][timeIdx] = parseFloat(tabArr[i][6]);}
		 //*1e5/population[countryIdx];
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
   //console.log(timeseries);
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

function shiftArray(arr,nshift){
   let n = arr.length;
   let shiftarr = Array(n).fill(0);

   if(abs(nshift) < n){
      if(nshift >= 0){
         for(let i=nshift;i<n;i++){
            shiftarr[i] = arr[i-nshift];
         }
      } else {
         for(let i=0;i<n+nshift;i++){
            shiftarr[i] = arr[i-nshift];
         }
      }
   }

   return shiftarr;   
   
}


function processDataDailyVsTotal(datatype,idx,times,population,smooth_n,xscale,yscale,timeShift,dateSlideMin,dateSlideMax,xMode,yMode){

   let total;

   switch(datatype){
      case "cases":
         total=tabArr[idx].slice();
         break;
      case "deaths":
         total=tabArrDeaths[idx].slice();
         break;
      case "vaccines":
         total=tabArrVacc[idx].slice();
         break;
   }
   
   let total_cut = total.slice(1);

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

   let countryBoxList = $('.countryBox');

   let totalX;

   let xscaleX;
   let yscaleX;
   let smooth_nX;
   let timeShiftX;
   let idxX;
   let datatypeX;

   let total_cutX;

   let daily_changeX;

   // idxStart is the last element to be removed
   // from the beginning
   let idxStart = Math.round(dateSlideMin*nDays);
   //idxEnd is the first index to be removed from
   //at the end
   let idxEnd = Math.round(dateSlideMax*nDays)

   if(xAxMode != "time"){
      countryBoxX = $(countryBoxList[xAxDataIdx]);

      xscaleX = parseFloat(countryBoxX.attr("xScale"));
      yscaleX = parseFloat(countryBoxX.attr("yScale"));
      smooth_nX = parseFloat(countryBoxX.attr("n_avg"));
      timeShiftX = parseFloat(countryBoxX.attr("timeShift"));
      idxX = parseFloat(countryBoxX.attr("idx"));
      datatypeX = countryBoxX.attr("displayData");
      //let xcut = parseInt(countryBoxX.attr("xcut"));
      //let ycut = parseInt(countryBoxX.attr("ycut"));
      
      switch(datatypeX){
         case "cases":
            totalX=tabArr[idxX].slice();
            break;
         case "deaths":
            totalX=tabArrDeaths[idxX].slice();
            break;
         case "vaccines":
            totalX=tabArrVacc[idxX].slice();
            break;
      }

      total_cutX = totalX.slice(1);

      daily_changeX = getDailyChange(totalX);

      // find negative daily changes and remove
      // running loop backwards to avoid having to change
      // loop length on the fly...
      for(let i=total_cutX.length-1;i>=0;i--){
         if(daily_changeX[i] < 0){
            total_cutX.splice(i,1);
            daily_changeX.splice(i,1);
         }
      }

   }

   let xData;
   let yData;

   // 1 day = 86 400 000 ms
   
   if(xAxMode == "daily"){

      xData = showPopRel ? shiftArray(scaleArr(smooth_filter(daily_changeX,smooth_nX),xscaleX*1e5/population[idxX]),-round(timeShiftX))
      : shiftArray(scaleArr(smooth_filter(daily_changeX,smooth_nX),xscaleX),-round(timeShiftX));
   } else if(xAxMode == "total"){
      xData = showPopRel ? shiftArray(scaleArr(smooth_filter(total_cutX,smooth_nX),xscaleX*1e5/population[idxX]),-round(timeShiftX))
      : shiftArray(scaleArr(smooth_filter(total_cutX,smooth_nX),xscaleX),-round(timeShiftX));
   } else if(xAxMode == "time"){
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

   xData.splice(idxEnd);
   xData.splice(0,idxStart);

   yData.splice(idxEnd);
   yData.splice(0,idxStart);

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
