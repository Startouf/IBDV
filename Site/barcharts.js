function showBars() {
					
				var dataset1 = [ 5, 10, 15, 20, 25 ];
				var dataset2 = [ 25, 7, 5, 26, 11, 25, 7, 5, 26, 11 ];
				var dataset3 = [];                      
					for (var i = 0; i < 40; i++) {          
						var newNumber = Math.random() * 30;  
  						dataset3.push(newNumber);  
					}
					
				d3.select("body").append("p")
					.attr("align","center")
					.style("Font-family","'Museo_SLab_300'")
					.style("Font-size","60px")
					.style("color","#ECD078")
					.text("Bar Chart Test 1");
		
				d3.select("body").append("p")
					.attr("align","center")
					.selectAll("div")
					    .data(dataset1)
					    .enter()
					    .append("div")
					    .attr("class", function(d) {
					    		switch (d) {
					    			case 5: return "bar1";
					    			case 10: return "bar2";
					    			case 15: return "bar3";
					    			case 20: return "bar4";
					    			case 25: return "bar5";
					    		}
					    })
					    .style("height", function(d) {
						    return d*5 + "px";   
						});
					
				d3.select("body").append("p")
					.attr("align","center")
					.style("Font-family","'Museo_SLab_300'")
					.style("Font-size","60px")
					.style("color","#ECD078")
					.text("Bar Chart Test 2");
					
				d3.select("body").append("p")
					.attr("align","center")
					.selectAll("div")
					    .data(dataset2)
					    .enter()
					    .append("div")
					    .attr("class", "bar5")
					    .style("height", function(d) {
						    return d*5 + "px";   
						});
					
				d3.select("body").append("p")
					.attr("align","center")
					.style("Font-family","'Museo_SLab_300'")
					.style("Font-size","60px")
					.style("color","#ECD078")
					.text("Bar Chart Test Random");
					
				d3.select("body").append("p")
					.attr("align","center")	
					.selectAll("div")
					    .data(dataset3)
					    .enter()
					    .append("div")
					    .attr("class", "bar3")
					    .style("height", function(d) {
						    return d*5 + "px";   
						});	
};

function hideButton() {
	document.getElementsByTagName('button')[0].style.display = 'none';	
}

function initial(){
	hideButton();
	showBars();
}