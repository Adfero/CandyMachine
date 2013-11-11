google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {
	var end = new Date().getTime();
	var start = end - 604800000;
	var step = 86400000;
	jQuery.getJSON('/histogram/all',{
		start: start,
		end: end,
		step: step
	},function(histogram){
		var graphData = [
			['Date','Left','Right']
		];

		for(var stamp in histogram) {
			var info = histogram[stamp];
			graphData.push([
				new Date(parseInt(stamp)).toLocaleDateString(),
				info.left.length,
				info.right.length
			]);
		}

		var data = google.visualization.arrayToDataTable(graphData);

		var options = {
			title: 'Usage Histogram',
			hAxis: {title: 'Date', titleTextStyle: {color: 'red'}}
		};

		var chart = new google.visualization.ColumnChart(document.getElementById('graph'));
		chart.draw(data, options);
	});
}