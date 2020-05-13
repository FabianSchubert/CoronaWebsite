

function convert2dData(datArray){
	// convert nested 2d array into list of of objects with x and y property,
	// as required by the scatter plot 
	let n_points = datArray.length;
	convArray = [];
	for(let i=0;i<n_points;i++){
		convArray.push({x: parseFloat(datArray[i][0]), y: parseFloat(datArray[i][1])});
	}

	return convArray;	
}


let table;

function preload() {
	//my table is comma separated value "csv"
	//and has a header specifying the columns labels
	table = loadTable('data.csv', 'csv', 'header');
	// loadTable returns a p5.js - Table object, which has some
	// neat additional functions. A raw 2d-nested array with the data
	// can be retrieved via table.getArray()
}



function setup() {
	
	var plotdata =  {
		datasets: [{
			label: "test plot",
			data: convert2dData(table.getArray()),
			showLine: true,
			lineTension: 0.,
			backgroundColor: 'rgba(0,0,0,.0)',
			borderColor: 'rgba(0,0,255,1)',
			pointBackgroundColor: 'rgba(0,0,255,1)'
		}]
	}

	var ctx = document.getElementById('chart');
	var myLineChart = new Chart(ctx, {
		type: 'scatter',
	
		data: plotdata,
		options:{
			scales:{
				yAxes: [{
					type: 'linear'
				}]
			}
   	}
	});
}

