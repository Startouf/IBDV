function showSvg() {
				
				// variables
				
				var w = 500;                     
			    var h = 500;                            
			    var r = 250;      
			    var Padding = 1;                  
			    var color = d3.scale.ordinal()
			    	.range(["#E2D5B6", "#91B5A8", "#337E8D", "#34426C", "#372146"]);    
					
                // dataset 
                         
			    dataset = [{"label":"happiness", "value":40}, 
			            {"label":"rage", "value":10}, 
			            {"label":"sadness", "value":5},
			            {"label":"despair","value":30},
			            {"label":"boredom","value":15}];
			            
				// pie
										
			    var svgPie = d3.select("body")
			    	.append("p")
			    	.attr("align","center")
			        .append("svg")	
			        .data([dataset])                   
			        .attr("width", w)           
			        .attr("height", h)
			        .append("svg:g")   
			        .attr("transform", "translate(" + r + "," + r + ")");
			 
			    var arc = d3.svg.arc() 
			        .outerRadius(r)
			        .innerRadius(r-r/2);
			 
			    var pie = d3.layout.pie()           
			      	.value(function(d) { 
			      		return d.value; 
			      	});
			 
			    var arcs = svgPie.selectAll("g.slice")     
			        .data(pie)                          
			        .enter()                            
			        .append("svg:g")                
			        .attr("class", "slice");    
			       			 
			    arcs.append("svg:path")
			        .attr("fill", function(d, i) { 
			        	return color(i); 
			        }) 
			        .attr("d", arc)
			        .transition()
				    .ease("exp")
				    .duration(1000)
				    .attrTween("d", animate);                                   			 
			    
			    arcs.append("svg:text")                                     
	                .attr("transform", function(d) {                    
	                	d.innerRadius = 0;
	                	d.outerRadius = r;
	                	return "translate(" + arc.centroid(d) + ")";     
	            	})
		            .attr("text-anchor", "middle")                          
		            .text(function(d, i) { 
		            	return dataset[i].label; 
		            })
		            .attr("fill","white");
		        
		        arcs.append("svg:text")
		        	.attr("transform",function(d) {
		        		d.innerRadius = 0;
		        		d.outerRadius = 0;
		        		return "translate(" + arc.centroid(d) + ")";
		        	})
		        	.attr("text-anchor","middle")
		        	.text(function(d,i) {
		        		return dataset[i].value;
		        	})
		        	.attr("fill","rgba(255,255,255,0.3)")
		        	.style("Font-size","50px");
		        	
		        function animate(b) {
		        	var i = d3.interpolate({startAngle: 1.1*Math.PI, endAngle: 1.1*Math.PI}, b);
		        	return function(t) { return arc(i(t)); };
				}
}



//function hideButton() {
//	document.getElementsByTagName('button')[0].style.display = 'none';	
//}

function initial(){
	// hideButton();
	showSvg();
}