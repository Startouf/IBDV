

function hidethings() {
	document.getElementById('img-telecom').style.display = 'none';
	document.getElementById('button2D').style.display = 'none';
	document.getElementById('button3D').style.display = 'none';
	document.getElementById('mentions').style.display = 'none';
	
	document.getElementById('buttonReturn').style.display = 'inline';
}			
			
function click2D() {
	hidethings();
	document.getElementsByTagName("h1")[0].innerHTML="2D Data Visualization";
	
	document.getElementById('buttonBarChart').style.display = 'inline';
	document.getElementById('buttonPieChart').style.display = 'inline';
	document.getElementById('buttonScatterplot').style.display = 'inline';
	document.getElementById('buttonHottenessPlot').style.display = 'inline';
	
	buttonBarChart.disabled= false;
	buttonPieChart.disabled= false;
	buttonScatterplot.disabled= false;
	buttonHottenessPlot.disabled= false;
}
	
function click3D() {
	hidethings();
	load4DVisu("#content")
}



function showBarChart() {
	document.getElementById('buttonBarChart').style.background= "#C02942";
	document.getElementById('buttonPieChart').style.background= "#ECD078";
	document.getElementById('buttonScatterplot').style.background= "#ECD078";
	document.getElementById('buttonHottenessPlot').style.background= "#ECD078";
	
	buttonBarChart.disabled= true;
	buttonPieChart.disabled= false;
	buttonScatterplot.disabled= false;
	buttonHottenessPlot.disabled= false;
	
	d3.select("#content").html("");
								
	var dataset = [];                        //Initialize empty array
	for (var i = 0; i < 15; i++) {           //Loop 25 times
		var newNumber = Math.round((Math.random() * 27)+3);  //New random number (0-30)
		dataset.push(newNumber);             //Add new number to array
	}

	d3.select("#content").append("p")
		.attr("id", "titleBar")
		.style("font-size", "27px")
		.style("text-align","center")
		.text("Bar-chart animated visualization with SVG")
		.style("Text-transform","uppercase")
		.style("Font-family","'Century Gothic'")
		.style("Font-weight","bold")
		.style("Font-size","28px")
		.style("color","#C02942");


	var w2 = 1000;
	var h2 = 300;
	var barPadding = 5;

	var svg2 = d3.select("#content")
		.append("svg")
		.attr("width", w2)
		.attr("height", h2)
		.attr("align", "center");
				

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
		.attr("id","Bar")
		.attr("height", function(d) {
			return (6*d);
		});
						
}		

function showPieChart() {
	document.getElementById('buttonPieChart').style.background= "#C02942";
	document.getElementById('buttonBarChart').style.background= "#ECD078";
	document.getElementById('buttonScatterplot').style.background= "#ECD078";
	document.getElementById('buttonHottenessPlot').style.background= "#ECD078";

	buttonPieChart.disabled= true;
	buttonBarChart.disabled= false;
	buttonScatterplot.disabled= false;
	buttonHottenessPlot.disabled=false;

	d3.select("#content").html("");


	d3.select("#content").append("p")
		.attr("id","titlePie1")
		.attr("align","center")
		.style("Text-transform","uppercase")
		.style("Font-family","'Century Gothic'")
		.style("Font-weight","bold")
		.style("Font-size","28px")
		.style("color","#C02942")
		.text("Example of pie chart");
	d3.select("#content").append("p")
		.attr("id","titlePie2")
		.attr("align","center")
		.style("Font-family","'Century Gothic'")
		.style("Font-weight","bold")
		.style("Font-size","30px")
		.style("color","#53777A")
		.text("Schools of 2013 PSI* students from Condorcet");		


	// variables

	var w = 1000;                     
	var h = 1000;                            
	var r = 300;      
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
							
	var svgPie = d3.select("#content")
		.append("div")
		.attr("align","center")
		.append("svg")	
		.data([dataset])                   
		.attr("width", w)           
		.attr("height", h)
		.append("svg:g")   
		.attr("transform", "translate(500,300)");

	var arc= d3.svg.arc() 
		.outerRadius(r)
		.innerRadius(r-r/2);
	 

	var pie = d3.layout.pie()           
		.value(function(d) { 
			return d.value; 
		});

	var slices = svgPie.selectAll("g.slice")     
		.data(pie)                          
		.enter()                            
		.append("svg:g")                
		.attr("class", "slice");    
				 
	slices.append("svg:path")
		.attr("fill", function(d, i) { 
			return color(i); 
		}) 
		.attr("d", arc);
/*		.transition()
		.ease("exp")
		.duration(2000)
		.attrTween("d", animate);   */                                			 

	slices.append("svg:text")                                     
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

	slices.append("svg:text")
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
}
					
					  	
/* function animate(b) {
	var i = d3.interpolate({startAngle: 1.1*Math.PI, endAngle: 1.1*Math.PI}, b);
	//TODO : getting some "arc is undefined"
	return function(t) { return arc (i(t)); };
}  */
	
				
function showScatterplot() {
	document.getElementById('buttonScatterplot').style.background= "#C02942";
	document.getElementById('buttonPieChart').style.background= "#ECD078";
	document.getElementById('buttonBarChart').style.background= "#ECD078";
	document.getElementById('buttonHottenessPlot').style.background= "#ECD078";

	buttonBarChart.disabled= false;
	buttonPieChart.disabled= false;
	buttonHottenessPlot.disabled= false;
	buttonScatterplot.disabled= true;


	d3.select("#content").html("");
			
	var w = 1000;
	var h = 650;
	var padding = 100;
	var dataset = d3.range(0, 0, 0);
	
	d3.select("#content")
	.append("p")
	.attr("id", "titleScatterplot")
	.style("text-align","center")
	.text("Project planning in an animation studio")
	.style("Text-transform","uppercase")
	.style("Font-family","'Century Gothic'")
	.style("Font-weight","bold")
	.style("Font-size","28px")
	.style("color","#C02942");

	d3.select("#content").append("p").attr("id", "titleScatterplot2").style("text-align","center").text("(gives a visualization of works progression in an animation production studio; thus, animators can see which projects are late on schedule and need their help)").style("font-size","1.2vw");
	    

	for (var i = 0; i<10; i++){
		var teamNb =1 + Math.round(Math.random()*5);	//size of the working team
		var seqLength = Math.random()*100;		//project length
		var seqDone = Math.random()*seqLength;		//fraction of done work
		var startDate = Math.round(Math.random()*10);		
		var deadline = startDate + Math.round(Math.random()*(10-startDate));
		var nb = 0;
		dataset.push([deadline, startDate, teamNb, i, seqDone, seqLength, nb])
	};

	//counting the projects with the same deadlines and start dates
	for (var i = 0; i<10; i++){
	if (dataset[i][6]==0) {
	var k = 0;
	for (var j = 0; j<10; j++){
		if (dataset[i][0]==dataset[j][0] && dataset[i][1]==dataset[j][1] && i!==j) {
		  k = k+1;
		}
	}
	for (var j = 0; j<10; j++){
		if (dataset[i][0]==dataset[j][0] && dataset[i][1]==dataset[j][1] && i!==j) {
		  dataset[i][6]=k;
		  dataset[j][6]=k;
		}
	}
}
	    }

	/*d3.csv("datatest.csv", function(d) {
		return {
		projectID: +d.projectID,
		totalLength: +d.totalLength,
		deadLine: new Date(+d.deadLine, 0, 1)
		};
		}, function(error, rows) {domain([0, d3.max(dataset, function(d) {
							     return d[1];
							    })])
				.range([h-padding, padding]);
			console.log(rows);
		});*/

	var xScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) {
							     return d[0];
							    })])
				.range([padding, w-padding]);

	var yScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) {
							     return d[1];
							    })])
				.range([h-padding, padding]);
	
	var tip = d3.tip()
  		 .attr('class', 'd3-tip')
  		 .offset([-10, 0])
 		 .html(function(d) {
			switch(d[3]) {
   		 	case (0): return "<strong>Title:</strong> <span style='color:red'>Le noël de Grabouillon</span><br><strong>Team Size:</strong> 						  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			case (1): return "<strong>Title:</strong> <span style='color:red'>Les mystérieuses cités d'or</span><br><strong>Team 		Size:</					  strong><span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 					  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			case (2): return "<strong>Title:</strong> <span style='color:red'>Le Tableau</span><br><strong>Team Size:</strong> 						  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			case (3): return "<strong>Title:</strong> <span style='color:red'>Sam-Sam</span><br><strong>Team Size:</strong> 					  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			case (4): return "<strong>Title:</strong> <span style='color:red'>Le général et les oiseaux</span><br><strong>Team Size:</strong> 					  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			case (5): return "<strong>Title:</strong> <span style='color:red'>Le vieil homme et les pigeons</span><br><strong>Team Size:</	strong>					  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			case (6): return "<strong>Title:</strong> <span style='color:red'>Toy Story</span><br><strong>Team Size:</strong> 					  	  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			case (7): return "<strong>Title:</strong> <span style='color:red'>Redline</span><br><strong>Team Size:</strong> 					  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			case (8): return "<strong>Title:</strong> <span style='color:red'>Raiponce</span><br><strong>Team Size:</strong> 					  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>"; break;
			default: return "<strong>Title:</strong> <span style='color:red'>Ernest et Célestine</span><br><strong>Team Size:</strong> 						  <span style='color:red'>" + d[2] + "</span><br><strong>Work progress:</strong> <span style='color:red'>" + 						  Math.round(d[4]/d[5]*100) + "% </span>";
  		}});

	var svg = d3.select("#content").append("svg")
				.attr("width", w) 
				.attr("height", h+600);

	svg.call(tip);

	//scatterplot	
	svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return xScale(d[0]);
			})
		.attr("cy", function(d) {
			return yScale(d[1]);
			})
		.attr("r", function(d) {
			return (0.5*d[2]*(1+d[4]/d[5])*8);
			})
		.attr("fill", function(d) {
			switch(d[3]) {
			  case 0: return "#FF99FF"; break;
			  case 1: return "#6666CC"; break;
			  case 2: return "#FF6600"; break;
			  case 3: return "#00CC00"; break;
			  case 4: return "#33FF99"; break;
			  case 5: return "#6600FF"; break;
			  case 6: return "#CC6633"; break;
			  case 7: return "#CCFF66"; break;
			  case 8: return "#FF00CC"; break;
			  default: return "#660033";
			}})
		.attr("stroke", "#D0D0D0")
		.attr("stroke-width", function(d) {
			return d[2]*(1-d[4]/d[5])*8;
			})
		.attr("opacity", "0.9")
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);


	var text = svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.attr("x", function(d) {
			return xScale(d[0]);
			})
		.attr("y", function(d) {
			return yScale(d[1])+9;
			})
		.attr("font-family", "sans-serif")
		.attr("font-size", "30")
		.attr("fill", "white")
		.text(function(d) {
			var v = d[6]+1;
			if (d[6]!==0) {
			  return "" + v + "";
			}
		      })
		.attr("text-anchor", "middle");

	//a little animation
	svg.selectAll("circle")
		.data(dataset)
		.transition()
		.duration(1000)
		.attr("r", function(d) {
			return (0.5*d[2]*(1+d[4]/d[5])*10);
			});

	//axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, " + (h-padding) + ")")
    		.call(d3.svg.axis()
                 .scale(xScale)
                 .orient("bottom"));


	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ", 0)")
    		.call(d3.svg.axis()
                 .scale(yScale)
                 .orient("left"));

	svg.append("text")
		.attr("x", "500")
		.attr("y", "600")
		.attr("text-anchor", "middle")
		.attr("fill", "#999999")
		.text("Deadline");

	svg.append("text")
		/*.attr("transform", "rotate(-90)")*/
		.attr("x", "45")
		.attr("y", "300")
		/*.attr("dy", "1em")*/
		.attr("text-anchor", "middle")
		.attr("fill", "#999999")
		.text("Start date");
	
	//legend
	svg.append("circle")
		.attr("cx", "250")
		.attr("cy", "100")
		.attr("r", "30")
		.attr("fill", "black")
		.attr("stroke", "#D0D0D0")
		.attr("stroke-width", "10");
	//small radius
	svg.append("line")
		.attr("x1", "250")
		.attr("y1", "100")
		.attr("x2", "268")
		.attr("y2", "118")
		.attr("stroke", "#457036");
	svg.append("line")
		.attr("x1", "268")
		.attr("y1", "118")
		.attr("x2", "300")
		.attr("y2", "118")
		.attr("stroke", "#999999");
	svg.append("text")
		.attr("x", "303")
		.attr("y", "121")
		.attr("font-family", "sans-serif")
		.attr("font-size", "10")
		.attr("fill", "#999999")
		.text("small radius = quantity of work already done");
	//long radius
	svg.append("line")
		.attr("x1", "250")
		.attr("x2", "270")
		.attr("y1", "100")
		.attr("y2", "72")
		.attr("stroke", "#3d4472");
	svg.append("line")
		.attr("x1", "270")
		.attr("x2", "300")
		.attr("y1", "72")
		.attr("y2", "72")
		.attr("stroke", "#999999");
	svg.append("text")
		.attr("x", "302")
		.attr("y", "74")
		.attr("font-family", "sans-serif")
		.attr("font-size", "10")
		.attr("fill", "#999999")
		.text("long radius = team size");
	//number of projects
	svg.append("text")
		.attr("x", "240")
		.attr("y", "110")
		.attr("font-family", "sans-serif")
		.attr("font-size", "25")
		.attr("fill", "#999999")
		.text("2")
		.attr("text-anchor", "middle");
	svg.append("line")
		.attr("x1", "234")
		.attr("y1", "94")
		.attr("x2", "224")
		.attr("y2", "76")
		.attr("stroke", "#c81750");
	svg.append("line")
		.attr("x1", "224")
		.attr("y1", "76")
		.attr("x2", "207")
		.attr("y2", "76")
		.attr("stroke", "#999999");
	svg.append("text")
		.attr("x", "160")
		.attr("y", "66")
		.attr("font-family", "sans-serif")
		.attr("font-size", "10")
		.attr("fill", "#999999")
		.text("number of project")
		.attr("text-anchor", "middle");
	svg.append("text")
		.attr("x", "158")
		.attr("y", "77")
		.attr("font-family", "sans-serif")
		.attr("font-size", "10")
		.attr("fill", "#999999")
		.text("with same deadline")
		.attr("text-anchor", "middle");
	svg.append("text")
		.attr("x", "158")
		.attr("y", "88")
		.attr("font-family", "sans-serif")
		.attr("font-size", "10")
		.attr("fill", "#999999")
		.text("and start date")
		.attr("text-anchor", "middle");	
}

function showHottenessPlot(){
	
	document.getElementById('buttonPieChart').style.background= "#ECD078";
	document.getElementById('buttonBarChart').style.background= "#ECD078";
	document.getElementById('buttonScatterplot').style.background= "#ECD078";
	document.getElementById('buttonHottenessPlot').style.background= "#C02942";

	buttonPieChart.disabled= false;
	buttonBarChart.disabled= false;
	buttonScatterplot.disabled= false;
	buttonHottenessPlot.disabled=true;

	
	d3.select("#content").html("");

	showHottenessSVG(); //in cyril_custom_2D.js

}
				
function returnHomePage() {	
	window.location.reload(); 
}
			
		
			
