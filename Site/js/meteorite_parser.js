var dataset =[];

//Below jquery stuff waits for DOM to be completes before executing
/*
$(function(){
	parseMeteorsData();
});
*/

/**
 ** Load meteor information from csv file with ; separator 
 ** WARNING : Data loaded asynchronously !!!
 **/
function parseMeteorsData(callback2, statusbarLoaded, statusbarParse) {
	//We're using a csv with ";", which is not the usual csv separator, so we need to call arbitrary delimiter functions from d3
	var dsv = d3.dsv(";", "text/plain")
	
	/* This call is Asynchronous ! everything that needs the data must be put in the callback */
	d3.text("data/meteors.csv", "text/csv", function(csv) {
		var data = dsv.parse(csv)
		data.forEach(function(d,i){
			dataset.push({
				place: d.place,
				type: d.type_of_meteorite ? d.type_of_meteorite : "Unknown",
				mass: +d.mass_g,
				found: d.fell_found,	//Si on a trouvé l'impact ?
				//Some meteorites don't have a year : pick one randomly (only 500/35k don't have one), range : -2500 to 2013
				year: +(d.year ? d.year : (Math.random()*4500 - 2500)),
				database: d.database,	//Lien vers la page de la météorite
				longitude: +d.longitude,
				latitude: +d.latitude
				//rest is krap ?
			})
			if(statusbarParse && (i%100 === 0)){
				updateStatus("parse", (i/data.length)*100);
			}
		})
		updateStatus("parse", 100);
		callback2();
	})
	.on("progress", function(event){
		//update progress bar
		if (statusbarLoaded && d3.event.lengthComputable) {
			updateStatus("load",d3.event.loaded * 100 / d3.event.total);
	    }
	})
	
	/* Instructions here will be executed
	BEFORE the data is loaded
	*/
}