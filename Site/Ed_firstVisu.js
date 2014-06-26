

/* var dataset = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
                14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
                24, 18, 25, 9, 3 ]; */
				
var dataset = [];                        //Initialize empty array
for (var i = 0; i < 25; i++) {           //Loop 25 times
    var newNumber = Math.round(Math.random() * 30);  //New random number (0-30)
    dataset.push(newNumber);             //Add new number to array
}

var c1 = "#00ff00";

d3.select("body")
	.selectAll("bar")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar")
	.style({"height": function(d) {
    return d*5 + "px";
},"background-color": function(d){return myColour1(d)}, "width": "30px", "margin-right": "5px"})
	.text(function(d) {
        return d;
   });
	
 function myColour1(x) {
	if (x<10) {
	return "yellow"
}
	else if (10<=x && x<20) {
	return "orange" }
	else { return "red"}
}


d3.select("body").append("p").style("font-size", "27px").text("Scatterplot");


			var w = 500;
			var h = 100;
			
			var dataset = [
							[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
							[410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
						  ];
	
			//Create SVG element
			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			svg.selectAll("circle")
			   .data(dataset)
			   .enter()
			   .append("circle")
			   .attr("cx", function(d) {
			   		return d[0];
			   })
			   .attr("cy", function(d) {
			   		return d[1];
			   })
			   .attr("r", function(d) {
			   		return Math.sqrt(h - d[1]);
			   })
			   .attr("fill", "teal");

d3.select("body").append("p").style("font-size", "27px").text("Bar-chart animated visualization with SVG");

var w2 = 1000;
var h2 = 300;
var barPadding = 5;

var dataset2 = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
							11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var svg2 = d3.select("body")
            .append("svg")
            .attr("width", w2)
            .attr("height", h2);
			

	svg2.selectAll("rect")
			.data(dataset2)
			.enter()
			.append("rect")
			.attr("x", function(d, i) {
			   		return i * (w2 / dataset.length);
			   })
			.attr("y", function(d) {
    return h2 - 6*d; 
})
			.attr("width", w2 / dataset.length - barPadding)
			.attr("height", 0)
			.attr("fill", function(d) {
    return "rgb(0, 0, "  + (d * 10) + ")";
});
	
	svg2.selectAll("text")
			   .data(dataset2)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d, i) {
			   		return i * (w2 / dataset.length) + (w2 / dataset.length - barPadding) / 2;
			   })
			   .attr("y", function(d) {
			   		return h2  - 6*d + 14;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "13px")
			   .attr("font-weight", "bold")
			   .attr("fill", "white");
			   
/* Animation */			
	svg2.selectAll("rect")
		.transition()
		.duration(1000)
		.attr("height", function(d) {
    return (6*d);
});
		