// variables
var wBar = 200;
var hBar = 200;
var dataProgress=[];
var progress = 50;

// update dataProgress
function updateDataProgress(progress) {
	var percentage = + progress/100;
		for (var i = 0;i<percentage*10;i++) {
			var newNumber=i;      
			dataProgress.push(newNumber);  
		}
}	

updateDataProgress(progress);
	
// create the progress bar	
d3.select("body")
	.append("p")
	.attr("align","center")
	.style("Font-family","'Museo_SLab_300'")
	.style("Font-size","60px")
	.style("color","#ECD078")
	.text("Progress Bar");
	
var svgBar = d3.select("body")
	.append("div")
   	.attr("align","center")
       .append("svg")
          .attr("width", wBar)
          .attr("height", hBar);

var rect = svgBar.selectAll("rect")
	.data(dataProgress)
	.enter()
	.append("rect")
	   .attr("x", function(d,i) {
			return i*wBar/10;
	   	})
	   .attr("y", 0)
	   .attr("width", wBar/10-2)
	   .attr("height", hBar/10)
	   .attr("fill", "#C02942")
	   .attr("opacity",0)
	 .transition()
	 	.delay(function (d,i){ 
	 		return i * 300;
	 	})
	 	.duration(300)
	 	.attr("opacity",1);
	
	 	
	