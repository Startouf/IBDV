var dataset =[];



//Below jquery stuff waits for DOM to be completes before executing
$(function(){
console.log("blabla3");
	parseMeteorsData();
});

/**
 ** Load meteor information from csv file with ; separator 
 ** WARNING : Data loaded asynchronously !!!
 **/
function parseMeteorsData() {
	console.log("blabla");
	//We're using a csv with ";", which is not the usual csv separator, so we need to call arbitrary delimiter functions from d3
	var dsv = d3.dsv(";", "text/plain")
	
	/* This call is Asynchronous ! everything that needs the data must be put in the callback */
	d3.text("data/meteors.csv", "text/csv", function(csv) {
		var data = dsv.parse(csv);
		data.forEach(function(d,i){
			console.log("blabla");
			dataset.push({
				place: d.place,
				type: d.type_of_meteorite,
				mass: +d.mass_g,
				found: d.fell_found,	//Si on a trouvé l'impact ?
				year: +d.year,
				database: d.database,	//Lien vers la page de la météorite
				longitude: +d.longitude,
				latitude: +d.latitude
				//rest is krap ?
			})
		})
		/* Put callback stuff here ! */
		console.log(dataset[0]);
		displayStuff();
		
		/* End of callback stuff */
	})
	
	/* Instructions here will be executed
	BEFORE the data is loaded
	*/
}