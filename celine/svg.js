
function showSvg() {
				
				// variables
					
				var hCircles = 100;
				var hBar = 200;
				var wBar = 1000;
				var barPadding = 2;
				var scatterPadding = 100;
				var hScatter = 500;
				var wScatter = 500;

                // datasets 
                          
				var datasetCircles = [];                      
					for (var i = 0; i < 30; i++) {          
						var newNumber = Math.random()*50;  
  						datasetCircles.push(newNumber);  
					}
				
				var datasetBars = [];                      
					for (var i = 0; i < 50; i++) {          
						var newNumber = Math.random()*50 + 5;  
  						datasetBars.push(newNumber);  
					}

//				var datasetScatter = [[]];                      
//					for (var i = 0; i < 10; i++) {          
//						var newSet = [Math.random()*50,Math.random()*50];  
//  						datasetScatter.push(newSet);  
//					}
				
				datasetScatter = [[]];
				d3.csv("data.csv", function(error, d) {
 					datasetScatter = d.map(function(d) { 
 						console.log(d);
 						return [ +d["annee"], +d["value"] ]; 
 					})
				});
  
				// scales
				var xScale = d3.scale.linear()
                     .domain([1960,2010]) 
                     .range([scatterPadding, wScatter - scatterPadding]);
                
                var yScale = d3.scale.linear()
                     .domain([1570,42390])  
                     .range([hScatter - scatterPadding, scatterPadding]);		
               
               var rScale = d3.scale.linear()
                     .domain([1570,42390])
                     .range([5, 30]);
                
                
                // axis
                var xAxis = d3.svg.axis()
                	 .scale(xScale)
                	 .orient("bottom")
                	 .ticks(5);
           		var yAxis = d3.svg.axis()
           			 .scale(yScale)
           			 .orient("left")
           			 .ticks(5);

				// barcharts
						
				d3.select("body")
					.append("p")
					.attr("align","center")
					.style("Font-family","'Museo_SLab_300'")
					.style("Font-size","60px")
					.style("color","#ECD078")
					.text("Barcharts with SVG");
				
				var svgBar = d3.select("body")
					.append("div")
			    	.attr("align","center")
			        .append("svg")
		            .attr("width", wBar)
		            .attr("height", hBar);

				var rect = svgBar.selectAll("rect")
				   .data(datasetBars)
				   .enter()
				   .append("rect")
				   .attr("x", function(d,i) {
				   		return i*(wBar/datasetBars.length);
				   	})
				   .attr("y", function(d) {
				   		return hBar-d;
				   	})
				   .attr("width", wBar/datasetBars.length - barPadding)
				   .attr("height", hBar)
				   .attr("fill", function(d) {
						if (0 <= d && d<= 10) {
			       			return "#C02942";	
			       		} else if (10 < d && d <= 20) {
			       			return "#542437";
			       		} else if ( 20 < d && d <= 30) {
			       			return "#53777A";
			       		} else if (30 < d && d <= 40) {
			       			return "#ECD078";
			       		} else if (40 < d && d <= 60) {
			       			return "#D95B43";
			       		}
				   	})
				   	.transition()
				    .duration(3000)
				    .attr("y", function(d) {
				    		return (hBar - d*3);
				    });
   		
   				svgBar.selectAll("text")
				   	.data(datasetBars)
				   	.enter()
				 	.append("text")
				 	.style("Font-family","'Century Gothic'")
				 	.style("Font-size","10px")
				 	.attr("fill","white")
				   	.attr("text-anchor", "middle")
					.text(function(d) {
				   		return Math.floor(d);
				   	})
					.attr("x", function(d, i) {
        				return i * (wBar / datasetBars.length) + (wBar / datasetBars.length - barPadding) / 2;
				   })
				   .attr("y", function(d) {
        				return hBar - (d * 3) + 14;  
				   }); 	
   				// circles
   				
				d3.select("body")
					.append("p")
					.attr("align","center")
					.style("Font-family","'Museo_SLab_300'")
					.style("Font-size","60px")
					.style("color","#ECD078")
					.text("Circles with SVG");
		
				var svgCircles = d3.select("body")
					.append("div")
			    	.attr("align","center")
					.append("svg")
					.attr("height",hCircles);
				
				var circles = svgCircles.selectAll("circle")
				    .data(datasetCircles)
				    .enter()
				    .append("circle");
				
				circles.attr("cx", function(d, i) {
			            return (0) ;
			        })
			       .attr("cy", hCircles/2)
			       .attr("r", function(d) {
			            return d-10;
			       })
			       .attr("fill", function(d) {
			       		if (0 <= d && d<= 10) {
			       			return "#C02942";	
			       		} else if (10 < d && d <= 20) {
			       			return "#542437";
			       		} else if ( 20 < d && d <= 30) {
			       			return "#53777A";
			       		} else if (30 < d && d <= 40) {
			       			return "#ECD078";
			       		} else if (40 < d && d <= 50) {
			       			return "#D95B43";
			       		}
			       })
			      .attr("stroke", "rgba(255,255,255,0.5)")
			      .attr("stroke-width", function(d) {
			      		return d/2;
			      })
			      .transition()
				    .duration(3000)
				    .attr("cx", function(d,i) {
				    		return (i*50);
				    });	

				
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
				         return xScale(d[0]);
				    })
				    .attr("cy", function(d) {
				         return yScale(d[1]);
				    })
				    .attr("r", function(d) {
					     return rScale(d[1]);
					 })
					 .attr("fill","#C02942")
//					 .attr("fill", function(d) {
//			       		if (0 <= xScale(d[0]) && xScale(d[0])<= 150) {
//			       			return "#C02942";	
//			       		} else if (150 < xScale(d[0]) && xScale(d[0]) <= 250) {
//			       			return "#542437";
//			       		} else if ( 250 < xScale(d[0]) && xScale(d[0]) <= 350) {
//			       			return "#53777A";
//			       		} else if (350 < xScale(d[0]) && xScale(d[0]) <= 400) {
//			       			return "#ECD078";
//			       		} else if (400 < xScale(d[0]) && xScale(d[0]) <= 500) {
//			       			return "#D95B43";
//			       		} else {
//			       			return "#ECD078";
//			       		}
//			       })
			      .style("opacity",0)
			      .attr("stroke", "rgba(255,255,255,0.5)")
			      .attr("stroke-width",5)
			      .transition()
				    .duration(3000)
				    .style("opacity",1);	

//				svgScatter.selectAll("text")
//				    .data(datasetScatter)
//				    .enter()
//				    .append("text")
//      				.text(function(d) {
//      					 return Math.floor(d[0])+";"+ Math.floor(d[1]);
//      				})
//      				.style("Font-size","10px")
//      				.style("Font-family","'Century Gothic'")
//      				.attr("x", function(d) {
//				         return xScale(d[0]);
//				    })
//				    .attr("y", function(d) {
//				         return yScale(d[1]);
//				    });
				
				svgScatter.append("g")
                	.attr("class","axis")	
   					.attr("transform", "translate(0," + (hScatter - scatterPadding) + ")")   					
   					.call(xAxis);
    	    	svgScatter.append("g")
				    .attr("class", "axis")
				    .attr("transform", "translate(" + scatterPadding + ",0)")
				    .call(yAxis);
				}

function hideButton() {
	document.getElementsByTagName('button')[0].style.display = 'none';	
}

function initial(){
	hideButton();
	showSvg();
}