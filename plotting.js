function addPlot(idx,countries,times,tabArr){
   window.nPlots++;
   
   window.addPlotCounter++;
   
   let plotdata = {
         label: countries[idx],
         data: processDataDailyVsTotal(idx,tabArr),
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
   
   
   
   let countryHeader = document.createElement("div")
   countryHeader.innerHTML = countries[idx];
   newCountryBox.appendChild(countryHeader);
   
   //########## section adding x-scale slider
   
   let xScaleText = document.createElement("span");
   xScaleText.innerHTML = "x-Scale: ";
   
   newCountryBox.appendChild(xScaleText);
   
   let xScaleValue = document.createElement("span");
   xScaleValue.setAttribute("id",newCountryBox.id + ".xScaleValue");
   xScaleValue.setAttribute("class","xScaleValue");
   xScaleValue.innerHTML="1";
   
   newCountryBox.appendChild(xScaleValue);
   
   
   let xScaleSlider = document.createElement("input");
   xScaleSlider.setAttribute("type","range");
   xScaleSlider.setAttribute("min","1");
   xScaleSlider.setAttribute("max","500");
   xScaleSlider.setAttribute("value","100");
   xScaleSlider.setAttribute("class","slider");
   
   xScaleSlider.oninput = function() {
      
      let scalefact = this.value/100.;
      
      
      
      let idx_node = $(this).parent().index();
            
      let total=tabArr[idx];
      
      for(i=0;i<myLineChart.data.datasets[idx_node].data.length;i++){
         myLineChart.data.datasets[idx_node].data[i].x = scalefact * total.slice(1,total.length-1)[i];  
      }
      
      $(this).parent().find('.xScaleValue')[0].innerHTML = scalefact;
      
      myLineChart.update();            
   }
   
   newCountryBox.appendChild(xScaleSlider);
   
   //########## end section add x-scale slider
   
   //########## section adding y-scale slider
   
   let yScaleText = document.createElement("span");
   yScaleText.innerHTML = "y-Scale: ";
   
   newCountryBox.appendChild(yScaleText);
   
   
   let yScaleValue = document.createElement("span");
   yScaleValue.setAttribute("id",newCountryBox.id + ".yScaleValue");
   yScaleValue.setAttribute("class","yScaleValue");
   yScaleValue.innerHTML="1";
   
   newCountryBox.appendChild(yScaleValue);
   
   
   let yScaleSlider = document.createElement("input");
   yScaleSlider.setAttribute("type","range");
   yScaleSlider.setAttribute("min","1");
   yScaleSlider.setAttribute("max","500");
   yScaleSlider.setAttribute("value","100");
   yScaleSlider.setAttribute("class","slider");
   
   yScaleSlider.oninput = function() {
      
      let scalefact = this.value/100.;
      
      
      
      let idx_node = $(this).parent().index();
            
      let total = tabArr[idx];
      
      let change = getDailyChange(total);
      
      for(i=0;i<myLineChart.data.datasets[idx_node].data.length;i++){
         myLineChart.data.datasets[idx_node].data[i].y = scalefact * change[i];
         
      }
      
      $(this).parent().find('.yScaleValue')[0].innerHTML = scalefact;
      
      myLineChart.update();            
   }
   
   newCountryBox.appendChild(yScaleSlider);
   
   //########## end section add y-scale slider 
   
   
   //########## section add close button
   
   let newCloseButton = document.createElement("input");
   newCloseButton.setAttribute("type","image");
   newCloseButton.setAttribute("src","closeicon.svg");
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
   
   $("#countryBoxContainer").append(newCountryBox);
      
   window.colCicleState++;
   window.colCicleState = colCicleState%nColors;
   
}