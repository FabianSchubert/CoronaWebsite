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

function convertChartDataToCSV(args) {
  let result, columnDelimiter, lineDelimiter,data;
  
  data = args.data;

  if (data[0] == null ) {
    return null;
  }
  console.log(args.data[0]);

  var d = []
  var xDatum = []
  var xDatenTotalalle = []
  var neueAufzählung = []
  var xDatenTimealle = []
  
  
  
  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';
  result = '';
  result += columnDelimiter;
  for (var n =0; n<args.data.length; n++){
  result += document.getElementsByClassName("countryBoxHeader")[n].innerHTML
  result += columnDelimiter;}
  result += lineDelimiter;
  result += lineDelimiter;
  result += 'x'
  result += columnDelimiter
  for (var n =0; n<args.data.length; n++){
  result += 'y'
  result += columnDelimiter;
  }
  result += lineDelimiter;
  var anzahlAttribute = [3,4,7,8,11]
 for (i in anzahlAttribute){
   for (var n =0; n<args.data.length; n++){
     ab = n+1
     attrs = document.getElementById("countryBox"+ab).attributes
     result += columnDelimiter
   if (i == 3){
  
  result +=  "Averaging Window (Days) : " + (attrs[anzahlAttribute[i]].value*2+1)
   
   }else {
     
    result +=  attrs[anzahlAttribute[i]].name + " : " + attrs[anzahlAttribute[i]].value
   
   }
 }result += columnDelimiter
 result += lineDelimiter;}
 
  for (var n =0; n<args.data.length; n++){
   neueAufzählung[n] = 0
  }
  function Sortierung(a, b) {
    return (a - b);
    }
   Aufzählung = 0
   for (var n =0; n<args.data.length; n++){
      for (var i =0; i<args.data[n].data.length; i++){
               xDatenTotalalle[Aufzählung] = args.data[n].data[i].x
             Aufzählung += 1}}
  
  xDatenTotalalle.sort(Sortierung)
  

  
 if (myLineChart.options.scales.xAxes[0].type == 'linear'){
   for (var i =0; i<(Aufzählung-1) ; i++){
          xDatum[i]= Math.round(xDatenTotalalle[i]*100)/100
      result += xDatum[i]
      result += columnDelimiter;

      for (var n =0; n<args.data.length; n++){
     Zahl = neueAufzählung[n]
  
     if (xDatenTotalalle[i] == args.data[n].data[Zahl].x){
      yDaten = (args.data[n].data[Zahl].y)
      result += Math.round(yDaten*100)/100
      result += columnDelimiter;
      neueAufzählung[n] +=1 ;
        if (neueAufzählung[n] == args.data[n].data.length){
          neueAufzählung[n]=0
        }
      }else{
        result += columnDelimiter;
     }}
    result += lineDelimiter;}
  
  
 }else if (myLineChart.options.scales.xAxes[0].type == 'time'){
   for (var i =0; i<(Aufzählung-1) ; i++){
     xDatenTimealle[i] = Math.round(xDatenTotalalle[i]/86400000)*86400000
          d[i] = new Date(xDatenTimealle[i])
        xDatum[i] = d[i].toDateString().slice(3, 10)
      h=i-1
      if (h==-1){h=4}
      if (xDatum[i]!== xDatum[h]){
        
      result += xDatum[i]
      result += columnDelimiter;

      for (var n =0; n<args.data.length; n++){
     Zahl = neueAufzählung[n]
      abgerundet= Math.round(args.data[n].data[Zahl].x/86400000)*86400000
     if (xDatenTimealle[i] == abgerundet){
      yDaten = (args.data[n].data[Zahl].y)
      result += Math.round(yDaten*100)/100
      result += columnDelimiter;
      neueAufzählung[n] +=1 ;
        if (neueAufzählung[n] == args.data[n].data.length){
          neueAufzählung[n]=0
        }
      }else{
        result += columnDelimiter;
      }}result += lineDelimiter;}
    }
} console.log(Date(xDatenTimealle[0]))
  return result;
}

function downloadCSV(args) {
  var data, filename, link;
  var csv = "";
   
 
    csv += convertChartDataToCSV({
      data: args.chart.data.datasets
    });
  
  if (csv == null) return;

  filename = args.filename || 'chart-data.csv';
  
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

  result.push(["Data",title]);
  result.push(["xscale",xscale]);
  result.push(["yscale",yscale]);
  result.push(["averaging window x (days)",avgWindowX]);
  result.push(["averaging window y (days)",avgWindowY]);
  result.push(["time shift x (days)",timeShiftX]);
  result.push(["time shift y (days)",timeShiftY]);

}

function convertChartDataToCSV1(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;
  
  data = args.data.data;
  if (data == null ) {
    return 2;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';
  indexZahl = args.data._meta[0].index+1
  keys = Object.keys(data[0]);
  
  attrs = document.getElementById("countryBox"+indexZahl).attributes;
  selfCountryBox = document.getElementById("countryBox"+indexZahl)
  
  /*
  # xscale: <...>
  # yscale: <...>
  # averaging window x (days): <...>
  # averaging window y (days):
  # time shift x: <...>
  # time shift y: <...>
  <Dataset x Name>,<Dataset y Name>
  <...>,<...>
  <...>,<...>
  .
  .
  */

  let attrsX;

  let yscale = attrs["yscale"].value;
  let avgWindowY = attrs["n_avg"].value*2 + 1;
  let timeShiftY;

  let xscale;
  let avgWindowX;
  let timeShiftX;

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

  result = '';
  // Meta Data
  let metaDataFmtString = (
    `% xscale: ${xscale}${lineDelimiter}`+
    `% yscale: ${yscale}${lineDelimiter}`+
    `% averaging window x (days): ${avgWindowX}${lineDelimiter}`+
    `% averaging window y (days): ${avgWindowY}${lineDelimiter}`+
    `% time shift x (days): ${timeShiftX}${lineDelimiter}`+
    `% time shift y (days): ${timeShiftY}${lineDelimiter}` );

  result += metaDataFmtString;
  
  let xColumn;
  let yColumn = document.getElementsByClassName("countryBoxHeader")[indexZahl-1].innerHTML + " " + yAxMode;

  if(xAxMode == "time"){
    xColumn = "time";
  } else {
    xColumn = document.getElementsByClassName("countryBoxHeader")[xAxDataIdx].innerHTML + " " + xAxMode;
  }

  // Header
  let headerFmtString = `${xColumn}${columnDelimiter}${yColumn}${lineDelimiter}`;

  result += headerFmtString;

  for (var i =0; i<args.data.data.length; i++){
    
    xDaten = (args.data.data[i].x)
    yDaten = (args.data.data[i].y)
    
    if (myLineChart.options.scales.xAxes[0].type == 'linear'){
      xDatum[i]= Math.round(xDaten*100)/100;
    }else if (myLineChart.options.scales.xAxes[0].type == 'time'){
      d[i] = new Date(xDaten);
      xDatum[i] = d[i].toDateString().slice(4);//.slice(3, 10);
    }
    
    result += xDatum[i];
    result += columnDelimiter;
    result += Math.round(yDaten*100)/100;
    result += lineDelimiter;
  
  }
  
  return result;

}

function downloadCSV1(args) {
  var data, filename, link;
  var csv = "";
  let self = $(args);
  let selfCountryBox = self.parent()
  let datasetIdx = selfCountryBox.attr("o")-1
 
    csv += convertChartDataToCSV1({
      data: myLineChart.data.datasets[datasetIdx]
    });

  
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
