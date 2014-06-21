/**** Circle showing 2D data with n+1 params **/
function init() {
	initData();
	scale();
	setupSVG();
	setupTooltip();
	setupHighlighters();
	addKey();
	upload_button("uploader", load_dataset);
}

var n = 3;
var data_max_val = 35;
var data_min_val = 2;
var ideas;
var dataset;

function initData(){

	d3.select("article #visualization").append("h2").text("Displaying data using basic numbers");
		
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

/**************************
 ** Other vars & funcs ***
 **************************/

//The "Hotteness" function
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

/**
 ** Only green if #VoteUP > #voteDown
 ** Only Red otherwise
 ** And the value is normalized by total # of votes
 **/
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

/* SVG Constants */
var width = 600;
var height = 600;
var svg;
var padding = 5;
var rScale;

/**
 ** Currently only scales radius (uses hotteness function)
 **/
function scale(){
	rScale = d3.scale.linear()
	.domain([1, d3.max(dataset, function(d) { return hotteness(d); })])
	.range([5, 50])
	.nice();
}

/*******************************
 ** Setup Data Visualization **
 *******************************/
function setupSVG(){
	//svg params
	var offsets;

	svg = d3.select("#visualization")
		.append("svg")
		.attr("width", width)   // <-- Here
		.attr("height", height); // <-- and here!
	svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
			//.text(function(d){ return d[0]; })	TODO : restrain text size
			.attr("x", function(d,i) {
				offsets = getOffsets(i);
				return offsets.x - 30;
			})
			.attr("y", function(d,i) {
				offsets = getOffsets(i);
				return offsets.y + rScale(hotteness(d) + 15);
			})
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
			.attr("stroke-width", "1px")
			.attr("stroke-opacity", .3)
			.on('mouseover', function(d){
				var selection = d3.select(this);
				var rr = Number(selection.attr("r"));
				var ccx = Number(selection.attr("cx"));
				var ccy = Number(selection.attr("cy"))
				showHighlighters(d, rr, ccx, ccy);
				showTooltip(d, rr, ccx, ccy, this);
				})
			.on('mouseout', function(){
				hideHighlighters(0,0,0,0,false);
				hideTooltip();
				});
}

/**************************
 ** Tooltip ***
 **************************/
var tooltip;
var tooltip_w = 200;
var tooltip_h = 70;

function setupTooltip(){
	tooltip = d3.select("#visualization").append("div")
		.classed("tooltip", true)
		.style("width", tooltip_w)
		.style("height", tooltip_h)
}

function showTooltip(d, r, cx, cy, element){
	var matrix = element.getScreenCTM()
		.translate(cx,cy);
	tooltip.html(function() {
		return "<h3 class ='idea'>Idea</h3>" +
				"<p class='idea_descr'>"+ d[0] + "</p>";
		})
		.style("visibility", "visible")
		.style("left", (matrix.e-tooltip_w/2) + "px")
        .style("top",(matrix.f-1.5*rScale(r)-tooltip_h) + "px")
	//TODO : following not working
	d3.select(".tooltip:after")
		.style("margin-top", (tooltip_h-70) + "px")
}

function hideTooltip(){
	tooltip.style("visibility", "hidden");
}

/**************************
 ** Highlighters ***
 **************************/

var num_highlighters = 3;
var highlighter = new Array(num_highlighters);
var highlighter_cx;
var highlighter_cy;
var highlighter_r = 5;
var h_angle = 0;
var h_angle_inc = Math.PI;

function setupHighlighters(){
	for(var i=0; i< num_highlighters; i++){
		highlighter[i] = svg.append("circle")
			.classed("highlighter", true)
			.attr("stroke", "rgb(255,0,0)")
			.attr("fill", "green")
			.attr("r", 1)
			.attr("stroke-opacity", .2)
			.attr("fill-opacity", .4)
	}
}

/**
 ** Show the highlighter bulbs on the selected object
 **/
function showHighlighters(d, r, cx, cy, boolOn){
	var angle;
	//updateHighlighters needs the values of the center of rotation as global variables
	highlighter_cx = cx;
	highlighter_cy = cy
	for(var i=0; i< num_highlighters; i++){
		angle = h_angle + i*2*Math.PI/(num_highlighters);
		highlighter[i]
			.attr("cx", cx + r*Math.cos(angle))
			.attr("cy", cy + r*Math.sin(angle))
			.attr("r", highlighter_r);
	}
	updateHighlighters();
}

/**
 ** Hide the bulbs, and tell the updateLoop to stop updating the animation
 **/
function hideHighlighters(){
	for(var i=0; i< num_highlighters; i++){
		highlighter[i].attr("r",0);
		highlighter[i].transition()
			.duration(0);
	}
}

/** 
 ** Start an updateLoop. The loop is done via a callBack after each update has successfuly ended.
 ** Each update is started after a mouseOver. However, each mouseOut terminates the loop by incrementing the h_instance variable
 **/
function updateHighlighters(){
	var angle;
	for(var i =0; i < num_highlighters-1; i++){
		angle = h_angle + i*2*Math.PI/(num_highlighters); 
		highlighter[i].transition()
			.duration(50)
			.attrTween("transform", function() {
				return d3.interpolateString("rotate("+angle+","+highlighter_cx+"," +highlighter_cy+")", 
				"rotate("+(angle+h_angle_inc)+","+highlighter_cx+"," +highlighter_cy+")");
			})
	}	
	//Last highlighter has callback to this function!
	angle = h_angle + (num_highlighters-1)*2*Math.PI/(num_highlighters);
	highlighter[i].transition()
		.duration(30)
		.attrTween("transform", function() {
			return d3.interpolateString("rotate("+angle+","+highlighter_cx+"," +highlighter_cy+")", 
			"rotate("+(angle+h_angle_inc)+","+highlighter_cx+"," +highlighter_cy+")");
		})
	.each("end", function() {
		//Update the angle and make a loop
		h_angle += h_angle_inc;
		updateHighlighters();
	})
}

function addKey(){
	var keySVG = d3.select("#visualization").append("svg")
		.attr("width", 500)
		.attr("height", 500)
	//Size
	addCircle(keySVG, 10, 50, 100, "black")
	addCircle(keySVG, 25, 110, 100, "black")
	addCircle(keySVG, 35, 200, 100, "black")
	addLabel(keySVG, 300, 100, "Hotteness")
	
	//Color
	addCircle(keySVG, 10, 50, 250, "red")
	addCircle(keySVG, 10, 100, 250, "black")
	addCircle(keySVG, 10, 150, 250, "green")
	addLabel(keySVG, 300, 250, "Approval of the idea")
}

function addCircle(where, r, cx, cy, fill){
	where.append("circle")
		.attr("cx", cx)
		.attr("cy", cy)
		.attr("r", r)
		.attr("fill", fill)
}

function addLabel(where, x, y, text, color){
	where.append("text")
		.text(text)
		.attr("x", x)
		.attr("y", y)
		.attr("color", function(){
			return color ? color : "black";
		})
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
