function addPlot(idx){
   //console.log(idx);
   let country = countries[idx];
   let fcallbackdata = function(data){
      addDataCallback(data,idx);
      //console.log("data loaded");
   };
   loadTable(linkCountryFold+country+".csv","csv","header",callback=fcallbackdata);
}

function addDataCallback(data,idx){
   let dataArray = data.getArray();
   for(let i=0;i<dataArray.length;i++){
      for(let j=0;j<dataArray[i].length;j++){
         dataArray[i][j] = parseFloat(dataArray[i][j]);
      }
   }

   dataArray = transpose(dataArray);
   tabArr[idx] = dataArray[0];
   tabArrDeaths[idx] = dataArray[1];
   tabArrVacc[idx] = dataArray[2];

   addPlot_callback(idx);
}


function addPlot_callback(idx){
   nPlots++;
   
   addPlotCounter++;
   
   $('#exampleDropdown')[0].style.display = "none";
   
   let plotdata = {
         label: countries[idx] + " - cases",
         data: [],
         lineTension: 0.,
         backgroundColor: 'rgba(0,0,0,.0)',
         borderColor: colCicle[colCicleState],
         pointBackgroundColor: colCicle[colCicleState]
      };
   
   myLineChart.data.datasets.push(plotdata);
   let countryBoxTmpl = $("#countryBoxTmpl")[0];
   
   let newCountryBoxCont = countryBoxTmpl.content.cloneNode(true);
   $("#countryBoxContainer").append(newCountryBoxCont);

   //let datelocks = $("#datelocks")[0];
   let newCountryBox = $("#countryBox_Init")[0];
   let daterange = $("#daterange")[0];
   let DownloadCSV = $("#DownloadCSV")[0]
   
   newCountryBox.style.backgroundColor = colCicle[colCicleState];
   newCountryBox.setAttribute("id","countryBox" + addPlotCounter);
   newCountryBox.setAttribute("idx",String(idx));
   //datelocks.setAttribute("id","datelocks" + addPlotCounter);
   newCountryBox.setAttribute("o", addPlotCounter);
   
   DownloadCSV.setAttribute("id","DownloadCSV" + addPlotCounter);
   daterange.setAttribute("id","daterange" + addPlotCounter);
   
   $(newCountryBox).children(".countryBoxHeader")[0].innerHTML = countries[idx] + " - " + $(newCountryBox).attr("displayData");
   //var box = document.getElementById("countryBoxContainer")
	//  xcut =box.getAttribute("xcut")
	//  ycut =  Math.round((times[times.length-1] - times[0])/864e5)-box.getAttribute("ycut")
  //console.log(ycut);

  
   $(countryBoxContainer).find("#daterange"+addPlotCounter).slider({
      range: true,
      min: 0,
      max: nDays,
      values: [0,nDays],
      change: changeRangeSlider,
      slide: changeRangeSlider
   });
  
  //newCountryBox.setAttribute("xcut",box.getAttribute("xcut"));
   //newCountryBox.setAttribute("ycut",Math.round((times[idx][times[idx].length-1] - times[idx][0])/864e5));
	
   colCicleState++;
   colCicleState = colCicleState%nColors;
   
   updateData($(newCountryBox));
   updateAxes();
   
   return newCountryBox;
   
}

function changeRangeSlider(event, ui){
   
   let countryBoxTemp = $(ui.handle).parent().parent().parent().parent();
   
   //console.log(countryBoxTemp) 

   let SlideMin = ui.values[0]/nDays;
   let SlideMax = ui.values[1]/nDays;


   countryBoxTemp.attr("dateSlideMin",SlideMin);
   countryBoxTemp.attr("dateSlideMax",SlideMax);

   updateData(countryBoxTemp);
   //console.log(countryBoxTemp.attr("dateSlideMin"));
   //updateData(countryBoxTemp);
   
}


function updateData(countryBox){ //countryBox should be a jquery object
      
   let xScale = parseFloat(countryBox.attr("xScale"));
   let yScale = parseFloat(countryBox.attr("yScale"));
   let n_avg = parseFloat(countryBox.attr("n_avg"));
   let timeShift = parseFloat(countryBox.attr("timeShift"));
   let dateSlideMin = parseFloat(countryBox.attr("dateSlideMin"));
   let dateSlideMax = parseFloat(countryBox.attr("dateSlideMax"));
   
   
   
   let idx_node = countryBox.index(); // The first element is the example button
   
   let idx = parseFloat(countryBox.attr("idx"))
   


   let new_data
   new_data = processDataDailyVsTotal(countryBox.attr("displayData"),idx,times,population,n_avg,xScale,yScale,
         timeShift,dateSlideMin,dateSlideMax,xAxMode,yAxMode);
   /*
   switch(countryBox.attr("displayData")){
      case "cases":
         new_data = processDataDailyVsTotal("cases",idx,tabArr,times,population,n_avg,xScale,yScale,
         timeShift,xAxMode,yAxMode);
         break;
      case "deaths":
         new_data = processDataDailyVsTotal("cases",idx,tabArrDeaths,times,population,n_avg,xScale,yScale,
         timeShift,xAxMode,yAxMode);
         break;
      case "vaccines":
         new_data = processDataDailyVsTotal(idx,tabArrVacc,times,population,n_avg,xScale,yScale,
         timeShift,xAxMode,yAxMode);
         break;
   }*/
   
   myLineChart.data.datasets[idx_node].data = new_data;
   myLineChart.data.datasets[idx_node].label = countries[idx] + " - " + countryBox.attr("displayData");

 
   myLineChart.update();

   let countryBoxList = $('.countryBox');

   //console.log(countryBox.attr("o"));

   if((xAxMode != "time") && ((countryBox.attr("o")-1) == xAxDataIdx)){
      for(let i=0;i<countryBoxList.length;i++){
         if(i!= xAxDataIdx){
            updateData($(countryBoxList[i]));
         }
         
      }
      
   }
}

var options = {
    responsive: true,
    maintainAspectRatio: false
}

function closeButtonClick(self){
   let selfCountryBox = $(self).parent();
   let y = selfCountryBox.attr("o");
   var z = Number(y);
   let idx_node = selfCountryBox.index(); // The first element is the example button
    myLineChart.data.datasets.splice(idx_node,1);





	 if (addPlotCounter>z){
	  for (i=0; i<(addPlotCounter-z); i++){
		  var h = i+z+1
		  let x = selfCountryBox.parent().children("#countryBox"+h)
		  let date = selfCountryBox.parent().children("#countryBox"+h).children().children().children("#daterange"+h)
		  let datelock = selfCountryBox.parent().children("#countryBox"+h).children("#datelocks"+h)
		  
		  
		  x.attr("id","countryBox"+(h-1))
		  x.attr("o",(h-1))
		  date.attr("id","daterange"+(h-1))
		  datelock.attr("id","datelocks"+(h-1))
	}
	}
 
	selfCountryBox.remove();

    addPlotCounter -=1
    myLineChart.update();
   
   nPlots--;
   if(nPlots==0){
      $('#exampleDropdown')[0].style.display = "inline-block";
   }

   let countryBoxList = $('.countryBox');

   if((y-1 == xAxDataIdx) && xAxMode != "time"){
      xAxMode = "time";
      
      for(let i=0;i<countryBoxList.length;i++){
         updateData($(countryBoxList[i]));
      }

   }

}

function updatexDataList(){

   let countryBoxList = $('.countryBox');
   let xDataDropdown = $('#xDataDropdown')[0];

   //<li><a href="javascript:void(0)" onclick ="DataTypeClick(this,'cases')">Cases</a></li>

   $('.xDataDropdownEntry').remove()

   for(let i=0;i<countryBoxList.length;i++){
      
      let idx = $(countryBoxList[i]).attr("idx");
      
      // Daily Entry
      let newEntryDaily = document.createElement('a');
      newEntryDaily.innerHTML = countries[idx] + " - " + $(countryBoxList[i]).attr("displaydata") + " - Daily";
      newEntryDaily.href = "#undefined1"
      newEntryDaily.id = "xDataDropdown"+i.toString();
      newEntryDaily.style.color = countryBoxList[i].style.backgroundColor;

      newEntryDaily.onclick = function(){
         xAxMode = "daily";

         xAxDataIdx = i;

         for(let j=0;j<countryBoxList.length;j++){
            
            updateData($(countryBoxList[j]));   
         }


         updateAxes();
         
      }

      // Total Entry
      let newEntryTotal = document.createElement('a');
      newEntryTotal.innerHTML = countries[idx] + " - " + $(countryBoxList[i]).attr("displaydata") + " - Total";
      newEntryTotal.href = "#undefined1"
      newEntryTotal.id = "xDataDropdown"+i.toString();
      newEntryTotal.style.color = countryBoxList[i].style.backgroundColor;

      newEntryTotal.onclick = function(){
         xAxMode = "total";

         xAxDataIdx = i;

         for(let j=0;j<countryBoxList.length;j++){
            
            updateData($(countryBoxList[j]));   
         }


         updateAxes();
         
      }



      //onclick ="DataTypeClick(this,'cases')"

      let newEntryListeDaily = document.createElement('li');
      $(newEntryListeDaily).attr("class","xDataDropdownEntry");
      newEntryListeDaily.appendChild(newEntryDaily);
      xDataDropdown.appendChild(newEntryListeDaily);

      let newEntryListeTotal = document.createElement('li');
      $(newEntryListeTotal).attr("class","xDataDropdownEntry");
      newEntryListeTotal.appendChild(newEntryTotal);
      xDataDropdown.appendChild(newEntryListeTotal);
   }

}


function xScaleSliderInput(selfDOM){
   
   let self = $(selfDOM);
   let selfCountryBox = self.parent().parent().parent();
   
   let xScaleMax = parseFloat(selfCountryBox.find(".sliderRangeField.max")[0].value);
   let yScaleMax = parseFloat(selfCountryBox.find(".sliderRangeField.max")[1].value);
   
   let xScale = (selfDOM.value/selfDOM.max)*xScaleMax;
   let yScale;
   
   
   if(selfCountryBox.attr("lockScales") == "true"){
      
      
      yScale = xScale * parseFloat(selfCountryBox.attr("xyScaleRatio"));
      
      if(yScale > yScaleMax){
         yScaleMax = yScale;
         selfCountryBox.find(".sliderRangeField.max")[1].value = yScaleMax;
      }
      
      
      let yScaleSlider = selfCountryBox.find(".slider.yScale")[0]
      
      yScaleSlider.value =
      (yScale / yScaleMax) * yScaleSlider.max;
      selfCountryBox.find(".yScaleValue")[0].innerHTML = yScale.toFixed(1);
      
      selfCountryBox.attr("yScale",yScale);
   }
         
   selfCountryBox.find(".xScaleValue")[0].innerHTML = xScale.toFixed(1);
   
   selfCountryBox.attr("xScale",xScale);
   
   updateData(selfCountryBox);
         
}

function yScaleSliderInput(selfDOM){
      
   let self = $(selfDOM);
   let selfCountryBox = self.parent().parent().parent();
   
   let xScaleMax = parseFloat(selfCountryBox.find(".sliderRangeField.max")[0].value);
   let yScaleMax = parseFloat(selfCountryBox.find(".sliderRangeField.max")[1].value);
   
   let xScale;
   
   let yScale = selfDOM.value*yScaleMax/selfDOM.max;
   
   
   if(selfCountryBox.attr("lockScales") == "true"){
      xScale = yScale / parseFloat(selfCountryBox.attr("xyScaleRatio"));
      
      if(xScale > xScaleMax){
         xScaleMax = xScale;
         selfCountryBox.find(".sliderRangeField.max")[0].value = xScaleMax;
      }
      
      
      let xScaleSlider = selfCountryBox.find(".slider.xScale")[0]
      
      xScaleSlider.value =
      (xScale / xScaleMax) * xScaleSlider.max;
      selfCountryBox.find(".xScaleValue")[0].innerHTML = xScale.toFixed(1);
      
      selfCountryBox.attr("xScale",xScale);
   }
         
   selfCountryBox.find(".yScaleValue")[0].innerHTML = yScale.toFixed(1);
   
   selfCountryBox.attr("yScale",yScale);
   
   updateData(selfCountryBox);
}



function averageWindowSliderInput(selfDOM){
   let self = $(selfDOM);
   let selfCountryBox = self.parent().parent().parent();
   selfCountryBox.attr("n_avg",selfDOM.value);
   updateData(selfCountryBox);
   selfCountryBox.find(".averageWindowValue")[0].innerHTML = selfDOM.value*2+1;
   //document.getElementById(selfCountryBox.attr('id') + "_averageWindowValue").innerHTML = selfDOM.value*2+1;
}

function timeShiftSliderInput(selfDOM){
   let self = $(selfDOM);
   let selfCountryBox = self.parent().parent().parent();
   
   let timeShiftSlider = selfCountryBox.find(".slider.timeShift")[0];
   let timeShiftMax = parseFloat(selfCountryBox.find(".sliderRangeField.max")[2].value);
   let timeShift = selfDOM.value*timeShiftMax/selfDOM.max;
    timeShiftSlider.value =
      (timeShift / timeShiftMax) * timeShiftSlider.max;
   selfCountryBox.attr("timeShift",timeShift);
   updateData(selfCountryBox);
   selfCountryBox.find(".timeShiftValue")[0].innerHTML = timeShift.toFixed(1);
}

function scaleLockClick(selfDOM){
   
   let self = $(selfDOM);
   let selfCountryBox = self.parent();
   
   if(selfCountryBox.attr("lockScales") == "false"){
      self.attr("src","./img/lock_closed.svg");
      selfCountryBox.attr("lockScales","true");
      
      let xScale = parseFloat(selfCountryBox.attr("xScale"));
      let yScale = parseFloat(selfCountryBox.attr("yScale"));
      //console.log(yScale/xScale);
      selfCountryBox.attr("xyScaleRatio",String(yScale/xScale));
      
   } else {
      self.attr("src","./img/lock_open.svg");
      selfCountryBox.attr("lockScales","false");
   }
}


function dateRangeclick(selfDOM){
   console.log("click");
   /*
   let self = $(selfDOM);
   let selfCountryBox = self.parent().parent().parent();
   let CountryBoxContainer = selfCountryBox.parent();
   idx= selfCountryBox.attr("idx")
	xcut = CountryBoxContainer.attr("xcut")
	
	ycut = Math.round((times[idx][times[idx].length-1] - times[idx][0])/864e5)-CountryBoxContainer.attr("ycut")
	if(selfCountryBox.attr("lockDatesAll") == "true"){
	    $(selfCountryBox).find(".dateRange").slider({
      values: [xcut,ycut],
   });
	 	  
   }*/
}

function dateLockClick(selfDOM){
   
   let self = $(selfDOM);
   let selfCountryBox = self.parent();
   
	
	if(selfCountryBox.attr("lockDatesAll") == "true"){
	  selfCountryBox.attr("lockDatesAll","false") ;
	  self.attr("src","./img/lock_opendate.svg");
	}  else {
      self.attr("src","./img/lock_closeddate.svg");
      selfCountryBox.attr("lockDatesAll","true");
	  
	  
   }
}
/* 
document.getElementById("buttonDropdown").addEventListener("click", function() {
	var box = document.getElementById("countryBoxContainer")
	if(box.getAttribute("lockDatesAll") == "true"){
		box.setAttribute("lockDatesAll","false");
		document.getElementById("datelock").addEventListener("mouseover", function() {
	if(box.getAttribute("lockDatesAll") == "false"){
	box.setAttribute("lockDatesAll","true"); }});
	
	}}
   );
*/

document.getElementById("buttonExampleDropdown").addEventListener("click", function() {
	var box = document.getElementById("countryBoxContainer")
	if(box.getAttribute("lockDatesAll") == "true"){
		box.setAttribute("lockDatesAll","false");
		document.getElementById("countryBoxContainer").addEventListener("mouseover", function() {
	if(box.getAttribute("lockDatesAll") == "false"){
	box.setAttribute("lockDatesAll","true"); }});
	
	}});


function casesCheckBoxClick(selfDOM){
   
   let selfCountryBox = $(selfDOM).parent().parent();
   
   let idx_node = selfCountryBox.index();
   
   if(selfDOM.checked){
      selfCountryBox.attr("displayData","deaths");
      myLineChart.data.datasets[idx_node].pointBackgroundColor = 'rgba(0,0,0,0)'
   } else {
      selfCountryBox.attr("displayData","cases");
      myLineChart.data.datasets[idx_node].pointBackgroundColor
      = myLineChart.data.datasets[idx_node].borderColor;
   }
   updateData(selfCountryBox);
   
}

function DataTypeClick(selfDOM,datatype){
   
   let selfCountryBox = $(selfDOM).parent().parent().parent().parent();

   let idx_node = selfCountryBox.index();


   selfCountryBox.attr("displayData",datatype);

   switch (datatype) {
     case "cases":
         myLineChart.data.datasets[idx_node].pointBackgroundColor = myLineChart.data.datasets[idx_node].borderColor;
         myLineChart.data.datasets[idx_node].pointStyle = 'circle';
         break;
     case "deaths":
         myLineChart.data.datasets[idx_node].pointBackgroundColor = 'rgba(0,0,0,0)'
         myLineChart.data.datasets[idx_node].pointStyle = 'circle';
         break;
     case "vaccines":
         myLineChart.data.datasets[idx_node].pointStyle = 'cross';
         break;
   }

   selfCountryBox.children(".countryBoxHeader")[0].innerHTML = countries[selfCountryBox.attr("idx")] + " - " + selfCountryBox.attr("displayData");

   updateData(selfCountryBox);
   

}

function scaleMaxInput(selfDOM){
     
   let self = $(selfDOM);
   let selfCountryBox = self.parent().parent();
   
   let xScaleMax = parseFloat(selfCountryBox.find(".sliderRangeField.max")[0].value);
   let yScaleMax = parseFloat(selfCountryBox.find(".sliderRangeField.max")[1].value);
   
   let xScale = selfCountryBox.attr("xScale");
   let yScale = selfCountryBox.attr("yScale");
   
   let xScaleSlider = selfCountryBox.find(".slider.xScale")[0]
   let yScaleSlider = selfCountryBox.find(".slider.yScale")[0]
   
   xScaleSlider.value = (xScale / xScaleMax) * xScaleSlider.max;
   yScaleSlider.value = (yScale / yScaleMax) * yScaleSlider.max;
}

function timeMaxInput(selfDOM){
     
   let self = $(selfDOM);
   let selfCountryBox = self.parent().parent();
   
   let timeShiftMax = parseFloat(selfCountryBox.find(".sliderRangeField.max")[2].value);
   
   let timeShift = selfCountryBox.attr("timeShift");
  
   
   let timeShiftSlider = selfCountryBox.find(".slider.timeShift")[0]
   
   timeShiftSlider.value = (timeShift / timeShiftMax) * timeShiftSlider.max;
}

function updateAxes(){
   selfCountryBox = document.getElementById("countryBoxContainer")
	
   countryBoxList = $('.countryBox');
   
   for(let k=0;k<countryBoxList.length;k++){
      updateData($(countryBoxList[k]));
      if(xAxMode == "time"){
         myLineChart.data.datasets[k].hidden = false;
      } else {
         myLineChart.data.datasets[k].hidden = (k==xAxDataIdx);
      }
   }
   
   $(".dataTypeButton.xAx").attr("style","background-color: #777777;");
   $(".dataTypeButton.yAx").attr("style","background-color: #777777;");
   
   let perPopStrX = showPopRel ? " per 10⁵ Inhabitants" : "";
   let perPopStrY = showPopRel ? " per 10⁵ Inh." : "";
   
   // Update the x axis...
   if(xAxMode == "time"){


      $(".dataTypeButton.xAx.Right").attr("style","background-color: #333333;");
      
      myLineChart.options.scales.xAxes[0] = {
               type: 'time',
               time: {
                  unit: 'day'
               },
               
               scaleLabel: {
                  display: true,
                  labelString: "Time"
               }
            }
   } else if (xAxMode == "total"){
      
      $(".dataTypeButton.xAx.Left").attr("style","background-color: #333333;");
      
      myLineChart.options.scales.xAxes[0] = {
               type: 'linear',
               time: {
                  unit: 'day'
               },
               
               scaleLabel: {
                  display: true,
                  labelString: "Total Cases / Deaths" + perPopStrX
               }
            }
   }
   // The whole thing for the y axis...
   if(yAxMode == "time"){
      
      $(".dataTypeButton.yAx.Right").attr("style","background-color: #333333;");
      
      myLineChart.options.scales.yAxes[0] = {
               type: 'time',
               time: {
                  unit: 'day'
               },
               scaleLabel: {
                  display: true,
                  labelString: "Time"
               }
            }
   } else if (yAxMode == "total"){
      
      $(".dataTypeButton.yAx.Middle").attr("style","background-color: #333333;");
      
      myLineChart.options.scales.yAxes[0] = {
               type: 'linear',
               time: {
                  unit: 'day'
               },
               
               scaleLabel: {
                  display: true,
                  labelString: "Total Cases / Deaths" + perPopStrY
               }
            }
   }  else if (yAxMode == "daily"){
      
      $(".dataTypeButton.yAx.Left").attr("style","background-color: #333333;");
      
      myLineChart.options.scales.yAxes[0] = {
               type: 'linear',
               time: {
                  unit: 'day'
               },
               scaleLabel: {
                  display: true,
                  labelString: "Daily Cases / Deaths" + perPopStrY
               }
            }
   }
   myLineChart.update();
}

$.cssHooks.backgroundColor = {
    get: function(elem) {
        if (elem.currentStyle)
            var bg = elem.currentStyle["backgroundColor"];
        else if (window.getComputedStyle)
            var bg = document.defaultView.getComputedStyle(elem,
                null).getPropertyValue("background-color");
        if (bg.search("rgb") == -1)
            return bg;
        else {
            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
        }
    }
}


function setColor(selfDOM){
   let self = $(selfDOM);
   let selfCountryBox = self.parent();
   
   let idx_node = selfCountryBox.index();
   
   let color = selfDOM.value;
   
   selfCountryBox.css("background-color",color);
   
   myLineChart.data.datasets[idx_node].borderColor = color;
   myLineChart.data.datasets[idx_node].pointBackgroundColor = color;
   
   myLineChart.update();
   
}

function openColorPicker(selfDOM){
   let self = $(selfDOM);
   let selfCountryBox = self.parent();
   
   
   let colorPicker = selfCountryBox.find(".colorPicker")[0];
   
   colorPicker.focus();
   colorPicker.value = selfCountryBox.css("backgroundColor");
   colorPicker.click();
}

function totalPopCheckBoxClicklog(selfDOM){
   
   let self = $(selfDOM);
   selfCountryBox = document.getElementById("countryBoxContainer");
   showPop = !selfDOM.checked
   if(showPop == false){
      selfCountryBox.setAttribute("logscale","true");
	 updateAxes();
   } else {
      selfCountryBox.setAttribute("logscale","false");
	  
	  updateAxes();
   }
   updateAxes();
}

function totalPopCheckBoxClick(selfDOM){
   
   showPopRel = !selfDOM.checked
   let countryBoxList = $('.countryBox')
	
   for(let i=0;i<countryBoxList.length;i++){
      updateData($(countryBoxList[i]));
   }
   updateAxes();
   
   selfCountryBox = document.getElementById("countryBoxContainer");

   /*if(selfCountryBox.getAttribute("absolut") == "false"){
      selfCountryBox.setAttribute("absolut","true");
   } else {
      selfCountryBox.setAttribute("absolut","false");
   }*/
      
}

function showExampleClick(selfDOM){
   selfDOM.style.display = "none";
   $.loadScript('./presets/preset.js', function(){});
}
