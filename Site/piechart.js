function showSvg() {
				
				// variables
				
				var w = 1000;                     
			    var h = 1000;                            
			    var r = 500;      
			    var Padding = 1;                  
			    var color = d3.scale.ordinal()
			    	.range(["#E2D5B6", "#91B5A8", "#337E8D", "#34426C", "#372146"]);    
					
                // dataset 
                         
			    dataset = [{"label":"ENS", "value":4}, 
			            {"label":"Centrale Pa", "value":4}, 
			            {"label":"Centrale Lyon", "value":4},
			            {"label":"C. Lille","value":2},
			            {"label":"C. Marseille","value":2},
			            {"label":"Supélec","value":16},
			            {"label":"Mines Pa","value":2},
			            {"label":"Mines Saint Etienne","value":4},
			            {"label":"ENSTA","value":8},
			            {"label":"Supaéro","value":4},
			            {"label":"ENSICA","value":2},
			            {"label":"TPT","value":2},
			            {"label":"Télécom Bretagne","value":4},
			            {"label":"Arts & Métiers","value":8},
			            {"label":"5/2","value":8},
			            {"label":"Autres","value":10}];
			            
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
				    .duration(2000)
				    .attrTween("d", animate);                                   			 
			    
			    arcs.append("svg:text")                                     
	                .attr("transform", function(d) {                    
	                	d.innerRadius = 0;
	                	d.outerRadius = r;
	                	return "translate(" + arc.centroid(d) + ")";     
	            	})
		            .attr("text-anchor", "middle")  
					.attr("dy", "0.5em")
		            .text(function(d, i) { 
		            	return (dataset[i].label); 
		            })
		            .attr("fill","white")
					.attr("font-weight", "bold")
					.attr("font-size","16");
		        
		        arcs.append("svg:text")
		        	.attr("transform",function(d) {
		        		d.innerRadius = 0;
		        		d.outerRadius = 0;
		        		return "translate(" + arc.centroid(d) + ")";
		        	})
		        	.attr("text-anchor","middle")
					.attr("dy", "-0.3em")
					.attr("dx", "-0.1em")
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