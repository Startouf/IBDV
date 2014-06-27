

/* var dataset = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
                14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
                24, 18, 25, 9, 3 ]; */
				
var dataset = [];                        //Initialize empty array
for (var i = 0; i < 10; i++) {           //Loop 25 times
    var newNumber = Math.round((Math.random()*15)+3);  //New random number (0-30)
    dataset.push(newNumber);             //Add new number to array
}


d3.select("body").append("p").style("font-size", "27px").text("Bar-chart animated visualization with SVG");

var w2 = 1000;
var h2 = 300;
var barPadding = 5;



var svg2 = d3.select("body")
            .append("svg")
            .attr("width", w2)
            .attr("height", h2);
			

	svg2.selectAll("rect")
			.data(dataset)
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
			   .data(dataset)
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
		
