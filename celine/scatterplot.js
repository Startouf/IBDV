// function showSvg
function showSvg() {
				
	// variables
	var scatterPadding = 100;
	var hScatter = 500;
	var wScatter = 500;
	var datasetScatter = [];
	
	// data parsing
	function parseData() {
		d3.csv("Resources/data.csv", function(error,d) {
			d.forEach(function(d,i){
				datasetScatter.push({
					annee: + d.annee,
					valeur : + d.value
				})
			})
		})
		console.log(datasetScatter);
	}
		
	parseData();
										
	// scales
	var xScale = d3.scale.linear()
	     .domain([1960,2010]) 
	     .range([0, wScatter]);
	
	var yScale = d3.scale.linear()
	     .domain([1570,42800]) 
	     .range([hScatter, 0]);		              
	
	// axis
	var xAxis = d3.svg.axis()
		 .scale(xScale)
		 .orient("bottom");
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");
	
	// Scatterplot
	d3.select("body")
		.append("p")
		.attr("align","center")
		.style("Font-family","'Museo_SLab_300'")
		.style("Font-size","60px")
		.style("color","#ECD078")
		.text("Scatterplot with SVG");
	
	var svgScatter = d3.select("body")
		.append("div")
		.attr("align","center")
		.append("svg")
		.attr("width", wScatter)
		.attr("height", hScatter);
	
	svgScatter.selectAll("circle")
		.data(datasetScatter)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			console.log(d.annee);
			return d.annee;
		})
		.attr("cy", function(d) {
			return d.valeur;
		})
		.attr("r",5)
		.attr("fill","#C02942")
		.attr("fill", "#D95B43")
		.style("opacity",0)
		.attr("stroke", "rgba(255,255,255,0.5)")
		.attr("stroke-width",5)
		.transition()
			.duration(3000)
			.style("opacity",1);	
	
	svgScatter.selectAll("text")
		.data(datasetScatter)
		.enter()
		.append("text")
		.text(function(d) {
			return Math.floor(d.annee)+";"+ Math.floor(d.valeur);
		})
		.style("Font-size","10px")
		.style("Font-family","'Century Gothic'")
		.attr("x", function(d) {
			return d.annee;
		})
		.attr("y", function(d) {
			return d.valeur;
		});
	
	svgScatter.append("g")
		.attr("class","axis")	
		.attr("transform", "translate(0," + (hScatter - scatterPadding) + ")")   					
		.call(xAxis);
		svgScatter.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + scatterPadding + ",0)")
		.call(yAxis);
}

// function hideButton
function hideButton() {
	document.getElementsByTagName('button')[0].style.display = 'none';	
}

// function initial
function initial(){
	hideButton();
	showSvg();
}