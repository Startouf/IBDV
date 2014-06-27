/******* Global Params ******/

/*** For Edouard ***/

var whereToAppendHottenessSVG = "#content";		//showing the data appends the svg in this one
var RADIUS_BEFORE_ANIM = 100, RADIUS_AFTER_ANIM = 175;

/*
 * If you want to SHOW it : call showHottenessSVG()
 * If you want to REMOVE the SVG, call hideHottenessSVG()
 Html could be loaded from an external file
 */

/**** If you want to change the design of the edge of the circles, modify these vars : ***/
var CIRCLE_BCKG_COLOR = "#666666";
var CIRCLE_BCKG_ALPHA = 0.0;
var CIRCLE_STRK_COLOR = "#dddddd";
var CIRCLE_STRK_ALPHA = 0.5;
var CIRCLE_STRK_WIDTH = "5px";
var HIGHLIGHTER_ALPHA = 0.5; 	//The highlighter are the orbs that revolve around a bubble



/**** Circle showing 2D data with n+1 params **/
function showHottenessSVG() {
	$(whereToAppendHottenessSVG).load("hottness_descr.html", function(){
		initHottenessData();
		setupTooltip();
		setupHighlighters();
		addKey();
	})
}

var n = 3;
var data_max_val = 35;
var data_min_val = 2;
var ideas;
var dataset;

function randomiseDataAndSort(){
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
	
	scale();
	showData();
}

function initHottenessData(){
	//d3.select("article #visualization").append("h2").text("Displaying data using basic numbers");
		
	ideas = ["A new baby-foot", "Some free access computers in the common rooms", "A wifi hotspot in the common rooms", "A touchpad", "Free tea at the bar", 
	"Unlock Steam ports", "More washing machines", "Fix the ***** air conditioner", "Discounts on computers", 
	"Discounts on mobile subscriptions"];

	dataset = new Array(ideas.length);
	
	randomiseDataAndSort();
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
function getOffsets(index, radius){
	var radius, angle;
	if(index === 0){
		radius = 0;
		angle = 0;
	} else if(index < (12+1)){ //12 bubbles on circle around
		radius = radius ? radius : 200;
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
 
function showData(){
	//svg params
	var offsets;

	svgHotteness = d3.select(whereToAppendHottenessSVG)
		.append("svg")
		.attr("width", width)   // <-- Here
		.attr("height", height); // <-- and here!
	svgHotteness.selectAll("text.data")
		.data(dataset)
		.enter()
		.append("text")
			//.text(function(d){ return d[0]; })	TODO : restrain text size
			.attr("x", function(d,i) {
				offsets = getOffsets(i, RADIUS_BEFORE_ANIM);
				return offsets.x - 30;
			})
			.attr("y", function(d,i) {
				offsets = getOffsets(i, RADIUS_BEFORE_ANIM);
				return offsets.y + rScale(hotteness(d) + 15);
			})
	svgHotteness.selectAll("circle.outer")
	   .data(dataset)
	   .enter()
	   .append("circle")
			.classed("outer", true)
			.attr("cx", function(d,i) {
				offsets = getOffsets(i, RADIUS_BEFORE_ANIM);
				return offsets.x;
			})
			.attr("cy", function(d,i) {
				offsets = getOffsets(i, RADIUS_BEFORE_ANIM);
				return offsets.y;
			})
			.attr("r", function(d){
				return rScale(hotteness(d)+5);
			})
			.attr("fill", CIRCLE_BCKG_COLOR)
			.attr("fill-opacity", CIRCLE_BCKG_ALPHA)
	svgHotteness.selectAll("circle.outer")
			.transition()
			.duration(2000)
			.attr("cx", function(d,i) {
				offsets = getOffsets(i, RADIUS_AFTER_ANIM);
				return offsets.x;
			})
			.attr("cy", function(d,i) {
				offsets = getOffsets(i, RADIUS_AFTER_ANIM);
				return offsets.y;
			})

	svgHotteness.selectAll("circle.inner")
	   .data(dataset)
	   .enter()
	   .append("circle")
			.classed("inner", true)
			.attr("cx", function(d,i) {
				offsets = getOffsets(i, RADIUS_BEFORE_ANIM);
				return offsets.x;
			})
			.attr("cy", function(d,i) {
				offsets = getOffsets(i, RADIUS_BEFORE_ANIM);
				return offsets.y;
			})
			.attr("r", function(d){
				return rScale(hotteness(d));
			})
			.attr("fill", function(d){
				var color = getColor(d);
				return(color.rgb);
			})
			.attr("stroke", CIRCLE_STRK_COLOR)
			.attr("stroke-width", CIRCLE_STRK_WIDTH)
			.attr("stroke-opacity", CIRCLE_STRK_ALPHA)
			.on('mouseover', function(d,i){
				var selection = d3.select(this);
				var rr = Number(selection.attr("r"));
				var ccx = Number(selection.attr("cx"));
				var ccy = Number(selection.attr("cy"))
				showHighlighters(d, rr, ccx, ccy);
				showTooltip(d, i, rr, ccx, ccy, this);
				})
			.on('mouseout', function(){
				hideHighlighters(0,0,0,0,false);
				hideTooltip();
				})
	svgHotteness.selectAll("circle.inner")
	   .transition()
	   .duration(2000)
	   .delay(300)
			.attr("cx", function(d,i) {
				offsets = getOffsets(i, RADIUS_AFTER_ANIM);
				return offsets.x;
			})
			.attr("cy", function(d,i) {
				offsets = getOffsets(i, RADIUS_AFTER_ANIM);
				return offsets.y;
			})
}

function hideHottenessSVG(){
	d3.select("svg").remove();
}

/**************************
 ** Tooltip ***
 **************************/
var tooltip;
var tooltip_w = 200;
var tooltip_h = 210;

function setupTooltip(){
	tooltip = d3.select(whereToAppendHottenessSVG).append("div")
		.classed("tooltip", true)
		.style("width", tooltip_w)
		.style("height", tooltip_h)
}

function showTooltip(d, i, r, cx, cy, element){
	var matrix = element.getScreenCTM()
		.translate(cx,cy);
	tooltip.html(function() {
		return "<h3 class ='idea'>Idea # "+(i+1)+"</h3>" +
				"<p class='idea_descr'>"+ d[0] + "</p>" +
				"<p class='nb_comments'>Comments : "+ d[1] + "</p>" +
				"<p class='votes'>Votes Up : " + d[3] + "<br />Votes down : " + d[2] + "</p>" +
				"<p class='hotteness'>Overall Hottness : " + Math.round(hotteness(d)) + "</p>";
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

/*** Add the highlighters in svg ***/
function setupHighlighters(){
	for(var i=0; i< num_highlighters; i++){
		highlighter[i] = svgHotteness.append("circle")
			.classed("highlighter", true)
			.attr("stroke", "rgb(255,0,0)")
			.attr("fill", "green")
			.attr("r", 1)
			.attr("stroke-opacity", .3)
			.attr("fill-opacity", HIGHLIGHTER_ALPHA)
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

var stopUpdatingHighlighters = false;

/** 
 ** Start an updateLoop. The loop is done via a callBack after each update has successfuly ended.
 ** Each update is started after a mouseOver. However, each mouseOut terminates the loop by incrementing the h_instance variable
 **/
function updateHighlighters(){

	if(stopUpdatingHighlighters){
		stopUpdatingHighlighters = false;
		return;
	}

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
	var keySVG = d3.select(whereToAppendHottenessSVG).append("svg")
		.attr("width", 500)
		.attr("height", 500)
	//Size
	addCircle(keySVG, 10, 50, 100, "black")
	addCircle(keySVG, 25, 110, 100, "black")
	addCircle(keySVG, 35, 200, 100, "black")
	addLabel(keySVG, 300, 100, "Hottness")
	
	//Color
	addCircle(keySVG, 10, 50, 250, "red")
	addCircle(keySVG, 10, 100, 250, "black")
	addCircle(keySVG, 10, 150, 250, "green")
	addLabel(keySVG, 300, 250, "Approval of the idea")
}

function addCircle(where, r, cx, cy, fill){
	where.append("circle")
		.classed("key", true)
		.attr("cx", cx)
		.attr("cy", cy)
		.attr("r", r+3)
		.attr("fill", CIRCLE_BCKG_COLOR)
		.attr("fill-opacity", CIRCLE_BCKG_ALPHA)
	where.append("circle")
		.classed("key", true)
		.attr("cx", cx)
		.attr("cy", cy)
		.attr("r", r)
		.attr("fill", fill)
		.attr("stroke", CIRCLE_STRK_COLOR)
		.attr("stroke-width", CIRCLE_STRK_WIDTH)
		.attr("stroke-opacity", CIRCLE_STRK_ALPHA)
}

function addLabel(where, x, y, text, color){
	where.append("text")
		.text(text)
		.attr("x", x)
		.attr("y", y)
		.attr("fill", function(){
			return color ? color : "black";
		})
}
