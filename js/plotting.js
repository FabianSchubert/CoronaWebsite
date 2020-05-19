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
   
   let newCountryBox = document.createElement("div");
   
   newCountryBox.setAttribute("class","countryBox");
   newCountryBox.style.backgroundColor = colCicle[colCicleState];
   newCountryBox.setAttribute("id","countryBox" + addPlotCounter);
   
   // stores the ratio yScale/xScale so that yScale = xyScaleRatio * xScale
   newCountryBox.setAttribute("xyScaleRatio","1");
   
   // initially, scales are not locked
   newCountryBox.setAttribute("lockScales","false");
   
   // stores whether to display cases or deaths
   newCountryBox.setAttribute("displayData","cases");
   
   newCountryBox.setAttribute("idx",String(idx));
   
   
   let countryHeader = document.createElement("p")
   countryHeader.innerHTML = countries[idx];
   newCountryBox.appendChild(countryHeader);
   
   //########## section adding x-scale slider
   
   let xScaleText = document.createElement("span");
   xScaleText.innerHTML = "x-Scale: ";
   
   newCountryBox.appendChild(xScaleText);
   
   let xScaleValue = document.createElement("span");
   xScaleValue.setAttribute("id",newCountryBox.id + "_xScaleValue");
   xScaleValue.setAttribute("class","xScaleValue");
   xScaleValue.innerHTML="1";
   
   newCountryBox.appendChild(xScaleValue);
   
   
   let xScaleSlider = document.createElement("input");
   xScaleSlider.setAttribute("type","range");
   xScaleSlider.setAttribute("min","1");
   xScaleSlider.setAttribute("max","50");
   xScaleSlider.setAttribute("value","10");
   xScaleSlider.setAttribute("class","slider");
   xScaleSlider.setAttribute("id",newCountryBox.id + "_xScaleSlider");
   
   xScaleSlider.oninput = function() {
      
      let xScale = this.value/10.;
      let yScale = document.getElementById($(this).parent().attr('id') + "_yScaleSlider").value/10.;      
      let n_avg = document.getElementById($(this).parent().attr('id') + "_averageWindowSlider").value;
      
      if($(this).parent().attr("lockScales") == "true"){
         yScale = xScale * parseFloat($(this).parent().attr("xyScaleRatio"));
         document.getElementById($(this).parent().attr('id') + "_yScaleSlider").value = yScale * 10.;
         yScaleValue.innerHTML = yScale.toFixed(1);;
      }
      
      
      
      let idx_node = $(this).parent().index();
      
      let idx = parseFloat($(this).parent().attr("idx"))
      
      let new_data
      if($(this).parent().attr("displayData") == "cases"){
         new_data = processDataDailyVsTotal(idx,tabArr,n_avg,xScale,yScale);
      } else {
         new_data = processDataDailyVsTotal(idx,tabArrDeaths,n_avg,xScale,yScale);
      }
      
      myLineChart.data.datasets[idx_node].data = new_data;      
      
      document.getElementById($(this).parent().attr('id') + "_xScaleValue").innerHTML = xScale;
      
      myLineChart.update();            
   }
   
   newCountryBox.appendChild(xScaleSlider);
   
   //########## end section add x-scale slider
   
   //########## section adding y-scale slider
   
   let yScaleText = document.createElement("span");
   yScaleText.innerHTML = "y-Scale: ";
   
   newCountryBox.appendChild(yScaleText);
   
   
   let yScaleValue = document.createElement("span");
   yScaleValue.setAttribute("id",newCountryBox.id + "_yScaleValue");
   yScaleValue.setAttribute("class","yScaleValue");
   yScaleValue.innerHTML="1";
   
   newCountryBox.appendChild(yScaleValue);
   
   
   let yScaleSlider = document.createElement("input");
   yScaleSlider.setAttribute("type","range");
   yScaleSlider.setAttribute("min","1");
   yScaleSlider.setAttribute("max","50");
   yScaleSlider.setAttribute("value","10");
   yScaleSlider.setAttribute("class","slider");
   yScaleSlider.setAttribute("id",newCountryBox.id + "_yScaleSlider");
   
   yScaleSlider.oninput = function() {
      
      let xScale = document.getElementById($(this).parent().attr('id') + "_xScaleSlider").value/10.;
      let yScale = this.value/10.;      
      let n_avg = document.getElementById($(this).parent().attr('id') + "_averageWindowSlider").value;
      
      if($(this).parent().attr("lockScales") == "true"){
         xScale = yScale / parseFloat($(this).parent().attr("xyScaleRatio"));
         document.getElementById($(this).parent().attr('id') + "_xScaleSlider").value = xScale * 10.;
         xScaleValue.innerHTML = xScale.toFixed(1);
      }
      
      let idx_node = $(this).parent().index();
      
      let idx = parseFloat($(this).parent().attr("idx"))
      
      let new_data
      if($(this).parent().attr("displayData") == "cases"){
         new_data = processDataDailyVsTotal(idx,tabArr,n_avg,xScale,yScale);
      } else {
         new_data = processDataDailyVsTotal(idx,tabArrDeaths,n_avg,xScale,yScale);
      }
      
      myLineChart.data.datasets[idx_node].data = new_data;      
      
      document.getElementById($(this).parent().attr('id') + "_yScaleValue").innerHTML = yScale;
      
      myLineChart.update();            
   }
   
   newCountryBox.appendChild(yScaleSlider);
   
   //########## end section add y-scale slider
   
   
   //########## section add averaging window slider
   
   let averageWindowText = document.createElement("span");
   averageWindowText.innerHTML = "averaging window (days): ";
   
   newCountryBox.appendChild(averageWindowText);
   
   
   let averageWindowValue = document.createElement("span");
   averageWindowValue.setAttribute("id",newCountryBox.id + "_averageWindowValue");
   averageWindowValue.setAttribute("class","averageWindowValue");
   averageWindowValue.innerHTML="7";
   
   newCountryBox.appendChild(averageWindowValue);
   
   let averageWindowSlider = document.createElement("input");
   averageWindowSlider.setAttribute("type","range");
   averageWindowSlider.setAttribute("min","0");
   averageWindowSlider.setAttribute("max","5");
   averageWindowSlider.setAttribute("value","3");
   averageWindowSlider.setAttribute("class","slider");
   averageWindowSlider.setAttribute("id",newCountryBox.id + "_averageWindowSlider");
   
   averageWindowSlider.oninput = function() {
      
      let xScale = document.getElementById($(this).parent().attr('id') + "_xScaleSlider").value/10.;
      let yScale = document.getElementById($(this).parent().attr('id') + "_yScaleSlider").value/10.;      
      let n_avg = this.value;
      
      let idx_node = $(this).parent().index();
      
      let idx = parseFloat($(this).parent().attr("idx"))
       
      let new_data
      if($(this).parent().attr("displayData") == "cases"){
         new_data = processDataDailyVsTotal(idx,tabArr,n_avg,xScale,yScale);
      } else {
         new_data = processDataDailyVsTotal(idx,tabArrDeaths,n_avg,xScale,yScale);
      }
      
      myLineChart.data.datasets[idx_node].data = new_data;      
      
      document.getElementById($(this).parent().attr('id') + "_averageWindowValue").innerHTML = n_avg*2+1;
      
      myLineChart.update();            
   }
   
   newCountryBox.appendChild(averageWindowSlider);
   
     
   //########## end section add averaging window slider
   
   
   //########## section add close button
   
   let newCloseButton = document.createElement("input");
   newCloseButton.setAttribute("type","image");
   newCloseButton.setAttribute("src","/img/closeicon.svg");
   newCloseButton.setAttribute("class","closeCountryBox");
   newCloseButton.onclick=function(){
      let idx_node = $(this).parent().index();
      myLineChart.data.datasets.splice(idx_node,1);
      $(this).parent().remove();
      myLineChart.update();
      nPlots--;
   }
   
   newCountryBox.appendChild(newCloseButton);
   
   //########## end section add close button
   
   //########## section add lock scale button
   
   
   
   let newScaleLock = document.createElement("input");
   newScaleLock.setAttribute("type","image");
   newScaleLock.setAttribute("src","/img/lock_open.svg");
   newScaleLock.setAttribute("class","scaleLock");
   newScaleLock.onclick=function(){
      if($(this).parent().attr("lockScales") == "false"){
         $(this).attr("src","/img/lock_closed.svg");
         $(this).parent().attr("lockScales","true");
         
         let xScale = document.getElementById($(this).parent().attr('id') + "_xScaleSlider").value;
         let yScale = document.getElementById($(this).parent().attr('id') + "_yScaleSlider").value;
         //console.log(yScale/xScale);
         $(this).parent().attr("xyScaleRatio",String(yScale/xScale));
         
      } else {
         $(this).attr("src","/img/lock_open.svg");
         $(this).parent().attr("lockScales","false");
      }
   }
   
   newCountryBox.appendChild(newScaleLock);
   
   //########## end section add close button
   
   // add text "Cases" before toggle
   let casesSpan = document.createElement("span");
   casesSpan.innerHTML = "<span>Display: Cases  </span>";
   newCountryBox.appendChild(casesSpan);
   
   //########## begin section add cases / deaths toggle
   
   let casesToggle = document.createElement("label");
   casesToggle.setAttribute("class","switch");
      
   let casesCheckbox = document.createElement("input");
   casesCheckbox.setAttribute("type","checkbox");
   casesCheckbox.onclick = function(){
      
      if(this.checked){
         $(this).parent().parent().attr("displayData","deaths");
      } else {
         $(this).parent().parent().attr("displayData","cases");
      }
      
      let idx_node = $(this).parent().parent().index();
      
      let idx = parseFloat($(this).parent().parent().attr("idx"))
      //console.log(idx);
      
      let xScale = document.getElementById($(this).parent().parent().attr('id') + "_xScaleSlider").value/10.;
      let yScale = document.getElementById($(this).parent().parent().attr('id') + "_yScaleSlider").value/10.;      
      let n_avg = document.getElementById($(this).parent().parent().attr('id') + "_averageWindowSlider").value;
      
      let new_data
      if($(this).parent().parent().attr("displayData") == "cases"){
         new_data = processDataDailyVsTotal(idx,tabArr,n_avg,xScale,yScale);
         myLineChart.data.datasets[idx_node].pointBackgroundColor 
         = myLineChart.data.datasets[idx_node].borderColor
      } else {
         
         new_data = processDataDailyVsTotal(idx,tabArrDeaths,n_avg,xScale,yScale);
         myLineChart.data.datasets[idx_node].pointBackgroundColor = 'rgba(0,0,0,0)'
      }
      
      myLineChart.data.datasets[idx_node].data = new_data;
      
      
      myLineChart.update();
      
   }
   
   let casesSlider = document.createElement("span");
   casesSlider.setAttribute("class","switchSlider round");
   
   casesToggle.appendChild(casesCheckbox);
   casesToggle.appendChild(casesSlider);
   
   newCountryBox.appendChild(casesToggle);
   
   //########## end secion add cases /deaths toggle
   
   // add text "Cases" before toggle
   let deathsSpan = document.createElement("span");
   deathsSpan.innerHTML = "<span>  Deaths  </span>";
   newCountryBox.appendChild(deathsSpan);
   
   $("#countryBoxContainer").append(newCountryBox);
      
   window.colCicleState++;
   window.colCicleState = colCicleState%nColors;
   
}