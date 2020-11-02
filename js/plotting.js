function addPlot(idx){
   window.nPlots++;
   
   window.addPlotCounter++;
   
   $('#exampleDropdown')[0].style.display = "inline-block";
   
   let plotdata = {
         label: countries[idx],
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
   
   let newCountryBox = $("#countryBox_Init")[0];
   
      
   newCountryBox.style.backgroundColor = colCicle[colCicleState];
   newCountryBox.setAttribute("id","countryBox" + addPlotCounter);
   newCountryBox.setAttribute("idx",String(idx));

   
   
   $(newCountryBox).children(".countryBoxHeader")[0].innerHTML = countries[idx];
   
   $(newCountryBox).find(".dateRange").slider({
      range: true,
      min: 0,
      max: Math.round((times[idx][times[idx].length-1] - times[idx][0])/864e5),
      values: [0,Math.round((times[idx][times[idx].length-1] - times[idx][0])/864e5)],
      change: changeRangeSlider,
      slide: changeRangeSlider     
   });
   
   colCicleState++;
   colCicleState = colCicleState%nColors;
   
   updateData($(newCountryBox));
   updateAxes();
   
   return newCountryBox;
   
}

function changeRangeSlider(event, ui){
   let countryBoxTemp = $(ui.handle).parent().parent().parent().parent();
   let max = $(ui.handle).parent().slider("option","max")
   countryBoxTemp.attr("xcut",Math.round(ui.values[0]));
   countryBoxTemp.attr("ycut",Math.round(max - ui.values[1]));
   //console.log(countryBoxTemp.attr("xcut"));
   //console.log(countryBoxTemp.attr("ycut"));
   //console.log("triggered");
	   
   updateData(countryBoxTemp);
}

function updateData(countryBox){ //countryBox should be a jquery object
      
   let xScale = parseFloat(countryBox.attr("xScale"));
   let yScale = parseFloat(countryBox.attr("yScale"));      
   let n_avg = parseFloat(countryBox.attr("n_avg"));
   let timeShift = parseFloat(countryBox.attr("timeShift"));
   let xcut = parseInt(countryBox.attr("xcut"));
   let ycut = parseInt(countryBox.attr("ycut"));
   
   
   
   let idx_node = countryBox.index(); // The first element is the example button
   
   let idx = parseFloat(countryBox.attr("idx"))
   
   let new_data
   if(countryBox.attr("displayData") == "cases"){
      new_data = processDataDailyVsTotal(idx,tabArr,times,population,n_avg,xScale,yScale,
         xcut,ycut,timeShift,xAxMode,yAxMode);
   } else {
      new_data = processDataDailyVsTotal(idx,tabArrDeaths,times,population,n_avg,xScale,yScale,
         xcut,ycut,timeShift,xAxMode,yAxMode);
   }
   
   myLineChart.data.datasets[idx_node].data = new_data;
   
   myLineChart.update();
}

function closeButtonClick(self){
   let selfCountryBox = $(self).parent();
   
   let idx_node = selfCountryBox.index(); // The first element is the example button
   
   myLineChart.data.datasets.splice(idx_node,1);
   selfCountryBox.remove();
   myLineChart.update();
   addPlotCounter -=1
   nPlots--;
   if(nPlots==0){
      $('#exampleDropdown')[0].style.display = "inline-block";
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
   
   countryBoxList = $('.countryBox');
   
   for(let k=0;k<countryBoxList.length;k++){
      updateData($(countryBoxList[k]));
   }
   
   $(".dataTypeButton.xAx").attr("style","background-color: #777777;");
   $(".dataTypeButton.yAx").attr("style","background-color: #777777;");
   
   let perPopStrX = showPopRel ? " per 100.000 Inhabitants" : "";
   let perPopStrY = showPopRel ? " per 100.000 Inh." : "";
   
   // Update the x axis...
   if(xAxMode == "time"){
      
      $(".dataTypeButton.xAx.Middle").attr("style","background-color: #333333;");
      
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
                  labelString: "Total Confirmed Cases / Deaths" + perPopStrX
               }   
            }
   } else {
      
      $(".dataTypeButton.xAx.Right").attr("style","background-color: #333333;");
      
      myLineChart.options.scales.xAxes[0] = {
               type: 'linear',
               time: {
                  unit: 'day'
               },
               
               scaleLabel: {
                  display: true,
                  labelString: "Daily Cases / Deaths" + perPopStrX
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
                  labelString: "Total Confirmed Cases / Deaths" + perPopStrY
               }   
            }
   } else {
      
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

function totalPopCheckBoxClick(selfDOM){
   
   showPopRel = !selfDOM.checked
   
   let countryBoxList = $('.countryBox')
   
   for(let i=0;i<countryBoxList.length;i++){
      updateData($(countryBoxList[i]));
   }
   
   updateAxes();
      
}

function showExampleClick(selfDOM){
   selfDOM.style.display = "none";
   $.loadScript('./presets/preset.js', function(){});
}
