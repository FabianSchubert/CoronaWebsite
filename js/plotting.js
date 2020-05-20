function addPlot(idx,countries,times){
   window.nPlots++;
   
   window.addPlotCounter++;
   
   
   let plotdata = {
         label: countries[idx],
         data: processDataDailyVsTotal(idx,tabArr,3,1,1),
         lineTension: 0.,
         backgroundColor: 'rgba(0,0,0,.0)',
         borderColor: colCicle[colCicleState],
         pointBackgroundColor: colCicle[colCicleState]
      };
   
   myLineChart.data.datasets.push(plotdata);
   
   myLineChart.update();
   
   let countryBoxTmpl = $("#countryBoxTmpl")[0];
   
   let newCountryBoxCont = countryBoxTmpl.content.cloneNode(true);
   $("#countryBoxContainer").append(newCountryBoxCont);
   
   let newCountryBox = $("#countryBox_Init")[0];
      
   newCountryBox.style.backgroundColor = colCicle[colCicleState];
   newCountryBox.setAttribute("id","countryBox" + addPlotCounter);
   newCountryBox.setAttribute("idx",String(idx));
   
   // update ids...
   $("#countryBox_Init_Header").attr("id",
      newCountryBox.id + "_Header");
   $("#"+newCountryBox.id + "_Header")[0].innerHTML = countries[idx];
   
   $("#countryBox_Init_xScaleValue").attr("id",
      newCountryBox.id + "_xScaleValue");
   
   $("#countryBox_Init_xScaleSlider").attr("id",
      newCountryBox.id + "_xScaleSlider");
   
   $("#countryBox_Init_yScaleValue").attr("id",
      newCountryBox.id + "_yScaleValue");
   
   
   $("#countryBox_Init_yScaleSlider").attr("id",
      newCountryBox.id + "_yScaleSlider");
   
   $("#countryBox_Init_averageWindowValue").attr("id",
      newCountryBox.id + "_averageWindowValue");
         
   window.colCicleState++;
   window.colCicleState = colCicleState%nColors;
   
}

function updateData(countryBox){ //countryBox should be a jquery object
      
   let xScale = parseFloat(countryBox.attr("xScale"));
   let yScale = parseFloat(countryBox.attr("yScale"));      
   let n_avg = parseFloat(countryBox.attr("n_avg"));
      
   let idx_node = countryBox.index();
   
   let idx = parseFloat(countryBox.attr("idx"))
   
   let new_data
   if(countryBox.attr("displayData") == "cases"){
      new_data = processDataDailyVsTotal(idx,tabArr,n_avg,xScale,yScale);
   } else {
      new_data = processDataDailyVsTotal(idx,tabArrDeaths,n_avg,xScale,yScale);
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
   let selfCountryBox = self.parent();
   
   let xScale = selfDOM.value/10.;
   let yScale;      
   
   
   if(selfCountryBox.attr("lockScales") == "true"){
      yScale = xScale * parseFloat(selfCountryBox.attr("xyScaleRatio"));
      
      selfCountryBox.children(".slider.yScale")[0].value = yScale * 10.;
      selfCountryBox.children(".yScaleValue")[0].innerHTML = yScale.toFixed(1);
      
      selfCountryBox.attr("yScale",yScale);
   }
         
   document.getElementById(selfCountryBox.attr('id') + "_xScaleValue").innerHTML = xScale.toFixed(1);
   
   selfCountryBox.attr("xScale",xScale);
   
   updateData(selfCountryBox);
         
}

function yScaleSliderInput(selfDOM){
      
   let self = $(selfDOM);
   let selfCountryBox = self.parent();
   
   let xScale;
   let yScale = selfDOM.value/10.;      
   
   
   if(selfCountryBox.attr("lockScales") == "true"){
      xScale = yScale / parseFloat(selfCountryBox.attr("xyScaleRatio"));
      
      selfCountryBox.children(".slider.xScale")[0].value = xScale * 10.;
      selfCountryBox.children(".xScaleValue")[0].innerHTML = xScale.toFixed(1);
      
      /*document.getElementById(selfCountryBox.attr('id') + "_xScaleSlider").value = xScale * 10.;
      document.getElementById(selfCountryBox.attr('id') + "_xScaleValue").innerHTML = xScale.toFixed(1);*/
      selfCountryBox.attr("xScale",xScale);
   }
         
   document.getElementById(selfCountryBox.attr('id') + "_yScaleValue").innerHTML = yScale.toFixed(1);
   
   selfCountryBox.attr("yScale",yScale);
   
   updateData(selfCountryBox);     
}

function averageWindowSliderInput(selfDOM){
   let self = $(selfDOM);
   let selfCountryBox = self.parent();
   selfCountryBox.attr("n_avg",selfDOM.value);
   updateData(selfCountryBox);
   document.getElementById(selfCountryBox.attr('id') + "_averageWindowValue").innerHTML = selfDOM.value*2+1;
}

function scaleLockClick(selfDOM){
   
   let self = $(selfDOM);
   let selfCountryBox = self.parent();
   
   if(selfCountryBox.attr("lockScales") == "false"){
      self.attr("src","./img/lock_closed.svg");
      selfCountryBox.attr("lockScales","true");
      
      let xScale = document.getElementById(selfCountryBox.attr('id') + "_xScaleSlider").value;
      let yScale = document.getElementById(selfCountryBox.attr('id') + "_yScaleSlider").value;
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