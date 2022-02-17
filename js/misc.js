function downloadFileTempLink(url, fileName) {
  // Create an invisible A element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = url;

  // Use download attribute to set set desired file name
  a.setAttribute("download", fileName);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}



function downloadCSV() {
  var data, filename, link;
  var tab = [];
  var tabTemp;

  let nData = myLineChart.data.datasets.length;
  if(xAxMode != "time"){
    nData -= 1;
  }

  if(nData > 0){
    for(let i=0;i<myLineChart.data.datasets.length;i++){
      if(!((xAxMode != "time") && (i==xAxDataIdx))){
        tabTemp = convertDatasetToTab(myLineChart.data.datasets[i]);
        tabTemp = transpose(tabTemp);
        for(let j=0;j<tabTemp.length;j++){
          tab.push(tabTemp[j]);
        }
      }
    }
    tab = transpose(tab);
  } else {
    return null;
  }

  let csv = convertTabToCSV(tab);
  
  filename = 'chart-data.csv';
  
  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
   
  data = encodeURI(csv);
  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}

function convertTabToCSV(tab,columnDelimiter=",",lineDelimiter="\n"){
  
  let m = tab.length;
  if(m==0){
    return '';
  }
  let n = tab[0].length;

  let result = '';

  for(let i=0;i<m;i++){
    for(let j=0;j<n;j++){
      result += tab[i][j];
      if(j<(n-1)){
        result += columnDelimiter;
      }
    }
    if(i<(m-1)){
      result += lineDelimiter;
    }
  }
  return result;
}

function convertDatasetToTab(dataset){
  let data = dataset.data;
  let idx = dataset._meta[0].index;
  let count = idx + 1;

  let attrs = document.getElementById("countryBox"+count).attributes;
  let selfCountryBox = document.getElementById("countryBox"+count);

  let attrsX;

  let yscale = attrs["yscale"].value;
  let avgWindowY = attrs["n_avg"].value*2 + 1;
  let timeShiftY;

  let xscale;
  let avgWindowX;
  let timeShiftX;

  

  let split_title = dataset.label.split(" - ");
  let country = split_title[0];
  let datatypeY = split_title[1].charAt(0).toUpperCase() + split_title[1].slice(1);
  let yMode = yAxMode.charAt(0).toUpperCase() + yAxMode.slice(1);

  let perPopStrY = showPopRel ? " per 10⁵ Inh." : "";

  let title_y = country + " - " + yMode + " " + datatypeY + perPopStrY;

  let title_x;

  if(xAxMode == "time"){
    title_x = "Time";
  } else {
    title_x = countries[$($('.countryBox')[xAxDataIdx]).attr("idx")] + " - " + myLineChart.options.scales.xAxes[0].scaleLabel.labelString;
  }

  if(xAxMode == "time"){
    xscale = attrs["xscale"].value;
    avgWindowX = "-";
    timeShiftX = attrs["timeshift"].value;
    timeShiftY = "-";
  } else {
    attrsX = document.getElementById("countryBox"+(xAxDataIdx+1)).attributes;
    xscale = attrsX["xscale"].value;
    avgWindowX = attrsX["n_avg"].value*2 + 1;
    timeShiftX = attrsX["timeshift"].value;
    timeShiftY = attrs["timeshift"].value;
  }

  let result = [];

  result.push(["xscale",xscale]);
  result.push(["yscale",yscale]);
  result.push(["averaging window x (days)",avgWindowX]);
  result.push(["averaging window y (days)",avgWindowY]);
  result.push(["time shift x (days)",timeShiftX]);
  result.push(["time shift y (days)",timeShiftY]);

  result.push([title_x,title_y]);
 
  for(let i=0;i<data.length;i++){
    if(xAxMode == "time"){
      result.push([(new Date(data[i].x)).toLocaleDateString(),data[i].y]);
    } else {
      result.push([data[i].x,data[i].y]);
    }
    
  }

  return result;

}


function downloadCSV1(args) {
  var data, filename, link;
  let self = $(args);
  let selfCountryBox = self.parent()
  let datasetIdx = selfCountryBox.attr("o")-1
  
  let tabData = convertDatasetToTab(myLineChart.data.datasets[datasetIdx]);
  let csv = convertTabToCSV(tabData);
  
  if (csv == null) return;

  filename2 = selfCountryBox.children(".countryBoxHeader")[0].innerHTML
  filename =filename2+'.csv'
  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }

  
  data = encodeURI(csv);
  //console.log(data);
  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}
