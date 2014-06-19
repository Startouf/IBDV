/**** Circle showing 2D data with n+1 params **/
function init() {
	initData();
	scale();
	showSVG();
	upload_button("uploader", load_dataset);
}

var n = 3;
var data_max_val = 35;
var data_min_val = 2;
var ideas;
var dataset;

function initData(){

	d3.select("body").append("h2").text("Displaying data using basic numbers");
		
	ideas = ["A baby foot", "Some free access computers", "A wifi hotspot", "A touchpad", "Free tea at the bar", 
	"Unlock Steam ports", "More washing machines", "Fix the ***** air conditioner", "Discounts on computers", "discounts on mobile subscriptions"];

	dataset = new Array(ideas.length);

	//create 2-dimensional array using ideas as first element of each sub-array
	for(var i=0; i< ideas.length; i++){
		dataset[i] = new Array(n+1);
		dataset[i][0] = ideas[i];
		for(var j=1; j< (n+1); j++){
			dataset[i][j] = Math.floor(Math.random() * data_max_val + data_min_val);
		}
	}
	
	//sort by hotteness
	dataset = dataset.sort(function(a,b){
		return d3.descending(hotteness(a), hotteness(b));
	});
}

//define hotteness function
function hotteness(a){
	var rez = 0;
	for(var j=1; j< (n+1); j++){
		rez += a[j]*a[j];
	}
	return Math.sqrt(rez);
}
	
//get positions for circles
function getOffsets(index){
	var radius, angle;
	if(index === 0){
		radius = 0;
		angle = 0;
	} else if(index < (12+1)){ //12 bubbles on circle around
		radius = 200;
		angle = (index-1)*2*Math.PI/12; 
	} else {
		var numBubbles = dataset.size - 1 - 12;
		radius = (index-1-12)*2*Math.PI/numBubbles;
	}
	//If on a circle : 
	return{
		x: width/2 + radius*Math.cos(angle),
		y: height/2 + radius*Math.sin(angle),
		z: index
	}
}

/* SVG Constants */
var width = 800;
var height = 600;
var svg;
var padding = 5;
var rScale;

function scale(){
	rScale = d3.scale.linear()
	.domain([1, d3.max(dataset, function(d) { return hotteness(d); })])
	.range([5, 50])
	.nice();
}

/** Animation **/
var activeElement; //return var from setInterval() DO NOT TOUCH
var counter = 0;

var tooltip;

function showSVG(){
	var tip = d3.tip()
		.attr('class', 'tooltip')
		.html(function(d) {
		return "<h3 class ='idea'>Idea</h3>" +
				"<p class='idea_descr'>"+ d[0] + "</p>";
		})

	//svg params
	
	var offsets;

	svg = d3.select("body")
		.append("div")
		.attr("id", "data")
		.append("svg")
		.attr("width", width)   // <-- Here
		.attr("height", height); // <-- and here!
	tooltip = d3.select("body")
		.append("div")
		.text("a simple tooltip");	
	svg.call(tip);
	svg.selectAll("circle")
	   .data(dataset)
	   .enter()
	   .append("circle")
		.attr("cx", function(d,i) {
			offsets = getOffsets(i);
			return offsets.x;
		})
		.attr("cy", function(d,i) {
			offsets = getOffsets(i);
			return offsets.y;
		})
		.attr("r", function(d){
			return rScale(hotteness(d));
		})
		.attr("fill", function(d){
			var color = getColor(d);
			return(color.rgb);
		})
		.attr("stroke", "teal")
		.attr("stroke-width", "3px")
		.attr("stroke-opacity", .3)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
}
			
function getColor(d){
	var norm = d[2]+d[3];
	this.r = Math.floor(d[2]/norm*255);
	this.g = Math.floor(d[3]/norm*255);
	return {
		r: r,
		g: g,
		rgb: r > g  ? "rgb(" + (this.r-this.g) +", 0, 20)" : "rgb(0, "+ (this.g-this.r) +", 20)"
	};
}

function getRGB(r, g, b){
	return("rgb(" +(r%255)+ ", " +(g%255)+ ", " +(b%255)+ ")");
}
	
	
/** Upload button **/
// handle upload button
function upload_button(el, callback) {
	var uploader = document.getElementById(el);
	var reader = new FileReader();
	reader.onload = function(e) {
		var contents = e.target.result;
		callback(contents);
	};
	uploader.addEventListener("change", handleFiles, false);
	function handleFiles() {
		d3.select("#table").text("loading...");
		var file = this.files[0];
		reader.readAsText(file);
	}; 
}

// load dataset and create table
function load_dataset(csv) {
	var data = d3.csv.parse(csv);
	create_table(data);
} 

function create_table(data) {
// table stats
	var keys = d3.keys(data[0]);
	var stats = d3.select("#stats")
		.html("")
		stats.append("div")
		.text("Columns: " + keys.length)
		stats.append("div")
		.text("Rows: " + data.length)
	d3.select("#table")
		.html("")
		.append("tr")
		.attr("class","fixed")
		.selectAll("th")
		.data(keys)
		.enter().append("th")
		.text(function(d) { return d; });
	d3.select("#table")
		.selectAll("tr.row")
		.data(data)
		.enter().append("tr")
		.attr("class", "row")
		.selectAll("td")
		.data(function(d) { return keys.map(function(key) { return d[key] }) ; })
		.enter().append("td")
		.text(function(d) { return d; });
} 
