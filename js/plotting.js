function addPlot(idx){
   window.nPlots++;
   
   window.addPlotCounter++;
   
   
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
     
   window.colCicleState++;
   window.colCicleState = colCicleState%nColors;
   
   updateData($(newCountryBox));
   updateAxes();
   
}

function updateData(countryBox){ //countryBox should be a jquery object
      
   let xScale = parseFloat(countryBox.attr("xScale"));
   let yScale = parseFloat(countryBox.attr("yScale"));      
   let n_avg = parseFloat(countryBox.attr("n_avg"));
   let timeShift = parseFloat(countryBox.attr("timeShift"));
   
   
   
   let idx_node = countryBox.index();
   
   let idx = parseFloat(countryBox.attr("idx"))
   
   let new_data
   if(countryBox.attr("displayData") == "cases"){
      new_data = processDataDailyVsTotal(idx,tabArr,times,n_avg,xScale,yScale,
         timeShift,xAxMode,yAxMode);
   } else {
      new_data = processDataDailyVsTotal(idx,tabArrDeaths,times,n_avg,xScale,yScale,
         timeShift,xAxMode,yAxMode);
   }
   
   myLineChart.data.datasets[idx_node].data = new_data;
   
   myLineChart.update();
}

function closeButtonClick(self){
   let selfCountryBox = $(self).parent();
   
   let idx_node = selfCountryBox.index();
   
   myLineChart.data.datasets.splice(idx_node,1);
   selfCountryBox.remove();
   myLineChart.update();
   nPlots--;
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
   let selfCountryBox = self.parent().parent();
   selfCountryBox.attr("n_avg",selfDOM.value);
   updateData(selfCountryBox);
   selfCountryBox.find(".averageWindowValue")[0].innerHTML = selfDOM.value*2+1;
   //document.getElementById(selfCountryBox.attr('id') + "_averageWindowValue").innerHTML = selfDOM.value*2+1;
}

function timeShiftSliderInput(selfDOM){
   let self = $(selfDOM);
   let selfCountryBox = self.parent().parent().parent();
   selfCountryBox.attr("timeShift",selfDOM.value/2.);
   updateData(selfCountryBox);
   selfCountryBox.find(".timeShiftValue")[0].innerHTML = selfDOM.value/2.;
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

function updateAxes(){
   
   countryBoxList = $('.countryBox');
   
   for(let k=0;k<countryBoxList.length;k++){
      updateData($(countryBoxList[k]));
   }
   
   $(".dataTypeButton.xAx").attr("style","background-color: #777777;");
   $(".dataTypeButton.yAx").attr("style","background-color: #777777;");
   
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
      
      $(".dataTypeButton.xAx.Middle").attr("style","background-color: #333333;");
      
      myLineChart.options.scales.xAxes[0] = {
               type: 'linear',
               time: {
                  unit: 'day'
               },
               
               scaleLabel: {
                  display: true,
                  labelString: "Total Confirmed Cases / Deaths per 100000 Inhabitants"
               }   
            }
   } else {
      
      $(".dataTypeButton.xAx.Left").attr("style","background-color: #333333;");
      
      myLineChart.options.scales.xAxes[0] = {
               type: 'linear',
               time: {
                  unit: 'day'
               },
               
               scaleLabel: {
                  display: true,
                  labelString: "Daily Cases / Deaths per 100000 Inhabitants"
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
                  labelString: "Total Confirmed Cases / Deaths per 100000 Inh."
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
                  labelString: "Daily Cases / Deaths per 100000 Inh."
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