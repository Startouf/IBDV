/** Dimensions of the OpenGL Frame. Also needs to be modified in .css file ! **/
var WIDTH_4DVisu = 800, HEIGHT_4DVisu = 600;

/** A big container where everything will be added **/
var idWhereToAddTheWholeThing = "#content";

/*
 * To load the whole stuff, call load4DVisu()
 * To remove the whole stuff, call remove4DVisu() <<==
 * /!\ /!\ It is important to call THIS ^^ function, because it will free the GPU memory (asynchronous)

/** This function will load everything inside the idWhereToAddTheWholeThing **/
function load4DVisu(idWhere){
	var whereToLoad = idWhere ? idWhere : idWhereToAddTheWholeThing;
	$(whereToLoad).load("visu_meteorites_HTMLstructure.html", function(){
		entry = document.getElementById("meteorsTable");
		addStatusBars();
		addControlButtons();
		initThreejs();
	})
}

var closeRequested = false;

function remove4DVisu(){
	stop = true;
	closeRequested = true;
}

/** Camera viewing point **/
var VIEW_ANGLE = 45, ASPECT = WIDTH_4DVisu / HEIGHT_4DVisu, NEAR = 0.1, FAR = 10000;
var renderer;
var camera;
var scene;
var undefined;
var controlOrbit; //Orbitcontrols

function initThreejs() {
	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setClearColor(0x000000,0);
	renderer.setSize(WIDTH_4DVisu, HEIGHT_4DVisu);
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set(0, 0, 1800);
	
	controlOrbit = new THREE.OrbitControls(camera,renderer.domElement);
    controlOrbit.addEventListener('change', render);
	controlOrbit.minDistance = 650;
	controlOrbit.maxDistance = Infinity;
	
	scene =  new THREE.Scene();
	camera.lookAt(scene.position);
	scene.add(camera);
	
	var container = $("#webGL");
	
	container.append( renderer.domElement );
	setTimeout(function(){
		addGalaxy();
		addLights();
		addEarth();
		addClouds();
		setTimeout(function(){
			loadResources();
			addData();
			setTimeout(function(){
				updateStatus("done");
				gameLoop();
			}, 1000)
		},1000)
	},1000)
}


/***********************************
	Add basic object & textures 
		Earth + clouds & lighting
	*********************************/

var LIGHT_X = 1800, LIGHT_Y = 500, LIGHT_Z = 1800;

/** Lights the Earth **/
function addLights() {
	light = new THREE.DirectionalLight(0xaaaaee, 3.5, 500 );
	light.lookAt(scene.position);
	scene.add( light );
	camera.add(light);
	light.position.set(LIGHT_X,LIGHT_Y,LIGHT_Z);
	render();
	updateStatus("earth", 33);
}	
	
var earth;
var clouds;

/** Generates a sphere and put an Earth texture on it **/
function addEarth() {
	var spGeo = new THREE.SphereGeometry(600,50,50);
	var planetTexture = THREE.ImageUtils.loadTexture( "image/terre-janvier.jpg" );
	var mat2 =  new THREE.MeshPhongMaterial( {
		map: planetTexture,
		shininess: 0.2 } );
	earth = new THREE.Mesh(spGeo,mat2);
	scene.add(earth);
	render();
	updateStatus("earth", 66);
}

/** Adds clouds on Earth **/
function addClouds() {
	var spGeo = new THREE.SphereGeometry(600,50,50);
	var cloudsTexture = THREE.ImageUtils.loadTexture( "image/clouds.png" );
	var materialClouds = new THREE.MeshPhongMaterial( { color: 0xffffff, map: cloudsTexture, transparent:true, opacity:0.3 } );

	clouds = new THREE.Mesh( spGeo, materialClouds );
	clouds.scale.set( 1.015, 1.015, 1.015 );
	scene.add( clouds );
	render();
	updateStatus("earth", 100);
}

/** Adds the galaxy **/
//REMOVED : added as 
function addGalaxy() {

 	var sphereGalaxy  = new THREE.SphereGeometry(1500, 50, 50);
	var materialGalaxy  = new THREE.MeshBasicMaterial();
	materialGalaxy.map   = THREE.ImageUtils.loadTexture('image/galaxy.png',{},function() {
			renderer.render(scene,camera)
		});
	materialGalaxy.side  = THREE.BackSide;
	materialGalaxy.needsUpdate=true;
	var galaxyMesh  = new THREE.Mesh(sphereGalaxy, materialGalaxy);
	scene.add(galaxyMesh);
	
	render();
	
}
	
/*************************
	Data Loading, 
	Object Generation
 ************************/

var timeScale;
var MAX_ANIMATION_TIME = 60000; // 1 min
var meteorMat;
var TOTAL_CHUNKS = 600;
var chunkSize; // Number of meteorites loaded at the same time

/** Calls the meteorite parser, init scales functions, and divide work in chunks **/
function addData(callback) {
	//TODO : show loading symbol

	//Load the data, and wait for callback
	parseMeteorsData(function(){
	
		//Total of 35k meteorites --> processing chunks of 600 meteorites ?
		chunkSize = Math.floor(dataset.length/TOTAL_CHUNKS);
	
		//Sort by year when it crashed
		dataset = dataset.sort(function(a,b){
			return d3.ascending(a.year, b.year);
		});
		
		//Scale data (time-wise)
		//From -2500 to 2012 (year when it fell) to some more precise value
		timeScale = d3.scale.linear()
			.domain([1, d3.max(dataset, function(d) { return d.year; })])
			//Every meteorite takes 2 seconds * 20FPS and BEFORE next year starts (and convert to millisecs)
			.range([1, 4500 * 2 * 20 * 1000])
			.nice();
		
		prepareChunk();
		
	}, load_status, parse_status)
}

var meteorGeometry, shockwaveGeometry;
var meteorMaterial;	//DEBUG
var meteorMeshes; 
var shockwaves;
var trails;

/** Loads the geometry that is going to be used for rendering the meteorites **/
function loadResources(){		
	meteorGeometry = new THREE.SphereGeometry(10,4,3)
	shockwaveGeometry = new THREE.SphereGeometry(1,20,20)
		
	meteorMeshes = {
		iron: loadMeteorMeshFromTexture("image/iron-meteorite-semaless-background2.jpg"),
		stone: loadMeteorMeshFromTexture("image/stone-meteorite-seamless-texture.jpg"),
		chondrite: loadMeteorMeshFromTexture("image/meteorite-chondrite-natural-seamless-background.jpg"),
		wildmanstatte: loadMeteorMeshFromTexture("image/Widmanstatte-pattern-meteor-background.jpg"),
		moon_rock: loadMeteorMeshFromTexture("image/moon-rock-bw-seamless-background-texture.jpg"),
		moon_rock_2: loadMeteorMeshFromTexture("image/moon-rock-seamless-background.jpg"),
		something: function(){
			return (this.stone);
		}
	}
	
	updateStatus("resources", 33);
	
	/* SHOCKWAVES */
	shockwaves = new Array(NB_SHOCKWAVE_MESHES);
	var shockwaveMaterial = new THREE.MeshLambertMaterial({color: 0x2222aa,opacity:0.2, emissive:0x0000aa})
	
	for(var i=0; i< (NB_SHOCKWAVE_MESHES); i++){
		shockwaves[i]= {
			mesh: new THREE.Mesh(shockwaveGeometry, shockwaveMaterial),
			time: 0,	//When to start the animation
			done_animating: true,
			scale: 0
		}
		scene.add(shockwaves[i].mesh);
	}
	
	updateStatus("resources", 66);
	
	/* TRAILS */
	var trailTexture = new THREE.ImageUtils.loadTexture( 'image/AnimatedExplosion_ME1.png' );
	var trailMaterial = new THREE.MeshBasicMaterial( { map: trailTexture, side:THREE.DoubleSide, transparent: true, opacity: 1} ); //TODO : only one side ?
	var trailGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	trails = new Array(NB_TRAIL_MESHES);
	
	for(var i=0; i< NB_TRAIL_MESHES; i++){
		var animator = new TextureAnimator( trailTexture, 7, 7, 49, 6000 ); // texture, #horiz, #vert, #total, duration.
		trails[i] = {
			mesh: new THREE.Mesh(trailGeometry, trailMaterial),
			time: 0,
			done_animating: true,
			animator: animator
		}
		scene.add(trails[i].mesh);
		trails[i].mesh.lookAt(camera.position);
	}
	updateStatus("resources", 100);
}

/*** Handle (every?) meteor type ***/
function getMeshForType(nameOfMeteorType){
	switch(nameOfMeteorType.substring(0,1)){
		case "L":
			return meteorMeshes.iron;
		case "H":
			return meteorMeshes.chondrite
		case "Iron":
			return meteorMeshes.moon_rock;
		default:
			return meteorMeshes.something();
	}
}

function loadMeteorMeshFromTexture(file){
	var texture = THREE.ImageUtils.loadTexture(file);
	var mat = new THREE.MeshPhongMaterial( {
		map: texture,
		shininess: 0.2 
	});
	meteorMaterial = mat; //DEBUG
	var meteorMesh = new THREE.Mesh(meteorGeometry, mat);
	//meteorMesh.lookAt( new THREE.Vector3(0,0,0) );	
	return(meteorMesh);
}

/** Chunk that is being prepared **/
var numChunk = 0;
/** Loaded meteorites **/
var meteorites = new Array();
/** Is it useful ? **/
var lastPreparedChunk = 0;
/** When it reached the end of the dataset **/
var allDataRendered = false;
/** If using regular shooting time, the interval **/
var SHOOT_INTERVAL = 350;

/** For a chunk, prepares the meteor VBOs for each meteorite **/
function prepareChunk(index){

	numChunk = (index !== undefined) ? index : numChunk;
	
	//Skip the last meteorite chunk (or TODO handle non multiple of chunkSize)
	if(numChunk*chunkSize > dataset.length){
		if(allDataRendered === false){
			allDataRendered = true;
		} else{
			console.log("Next Chunk exceeds data.length !!!")
		}
		return;
	}

	for (var i = numChunk*chunkSize ; i < (numChunk+1)*chunkSize ; i++) {
		//get the data, and set the offset, we need to do this since the x,y coordinates
		//from the data aren't in the correct format
		var lat = dataset[i].latitude;
		var lng = dataset[i].longitude;
		var value = dataset[i].mass;
		//var material = getMaterialForType(dataset[i].type);

		// calculate the position where we need to start the meteor
		//(The Earth is 600 radius)
		//Initial height of 600 then falling down to 2
		var position = mapLatLongToVector3(lat+Math.random()*10, lng+Math.random()*10, 600, 600+Math.random()*30); //falling down to (..., 600, 2)
		
		//Note : clone() only copies the reference of geom and material
		//proof here https://github.com/mrdoob/three.js/issues/4796
		//TODO : create one mesh per different texture
		var meteorObject = getMeshForType(dataset[i].type).clone();
		var scale = Math.log(value+1);
		if(scale <= 3){
			scale = 3;
		}
		meteorObject.position = position;
		meteorObject.scale.set( scale*0.25, scale*0.25, scale*0.25 )
		//meteorObject.lookAt( new THREE.Vector3(0,0,0) );
				
		//Add the meteorite to the processing Array
		meteorites.push({
			lat: lat,
			lng: lng,
			meteorObject : meteorObject,
			//time: timeScale(dataset[i].year),
			//TODO scale
			time: (i+1)*SHOOT_INTERVAL,
			isFalling: false,
			data: dataset[i],
			scale: scale
		});
		
		scene.add(meteorObject);

		// At first, hide the object
		//...Or not ?
	}
	
	
	
	if(numChunk === 0 || (index !== undefined)){
		currentTime = (index ? index : 0)*SHOOT_INTERVAL + TIME_TO_FALL;
		canUpdateMeteors = true;
		indexDoneFalling = index ? (index*chunkSize) : 0;
	}
	lastPreparedChunk = numChunk;
	numChunk++;
}

var indexDoneFalling = 0;
var currentTime;
var TIME_TO_FALL = 800;//in ms for now

/** Updates every meteorite of a chunk. Assumes they are sorted by order of appearance
 ** Let's make every meteorite from the currentChunk fall, 
 ** and wait till they have all crashed to start processing the next chunk
 **/
function updateMeteors(delta){
	currentTime += delta;
	for(var i = indexDoneFalling; i < chunkSize*(lastPreparedChunk+1); i++){
		if(currentTime > meteorites[i].time  ){
			//If he meteorite is falling
			if(currentTime < (meteorites[i].time + TIME_TO_FALL)){
				meteorites[i].meteorObject.position = mapLatLongToVector3(meteorites[i].lat, meteorites[i].lng, 600, 
					600-Math.round((595*(currentTime-meteorites[i].time)/TIME_TO_FALL)));
				if(meteorites[i].isFalling === false){
					isFalling = true;
					addTrailToMeteor(meteorites[i]);
				}
			} // If the meteorite has crashed
			else{
				indexDoneFalling++;
				meteorites[i].meteorObject.position = mapLatLongToVector3(meteorites[i].lat, meteorites[i].lng, 600, 2);
				triggerShockwave(meteorites[i]);
				meteorites[i].isFalling = false;	//TODO : Hide trail
				logToUserConsole(meteorites[i].data);
				//console.log("meteorite" + i + "has landed")
			}
		}
	}
	if(indexDoneFalling > Math.round(numChunk*chunkSize - 0.25*chunkSize)){
		prepare_next_chunk_bool = true;
	}
	
	if(indexDoneFalling%(2*chunkSize) === 0){
		compactGeometry();
	}
}

var SHOCKWAVE_DURATION = 500;
var NB_SHOCKWAVE_MESHES = Math.ceil(SHOCKWAVE_DURATION/SHOOT_INTERVAL)
var availableShockwaveMesh = 0;

function triggerShockwave(meteorite){
	shockwaves[availableShockwaveMesh].mesh.position = mapLatLongToVector3(meteorite.lat, meteorite.lng, 600, 3);
	shockwaves[availableShockwaveMesh].done_animating = false;
	shockwaves[availableShockwaveMesh].scale = 2*meteorite.scale;
	shockwaves[availableShockwaveMesh].time = meteorite.time + TIME_TO_FALL;
	availableShockwaveMesh = (availableShockwaveMesh +1)%NB_SHOCKWAVE_MESHES;
}

function updateShockwaves(){
	for(var i = 0; i<shockwaves.length; i++){
		if(shockwaves[i].done_animating === false){
			//If not done animating
			if(currentTime < shockwaves[i].time +SHOCKWAVE_DURATION){
				shockwaves[i].mesh.visible = true;
				var sc = 2*shockwaves[availableShockwaveMesh].scale*(currentTime-shockwaves[i].time)/SHOCKWAVE_DURATION;
				shockwaves[i].mesh.scale.set(sc, sc, sc);
			} else{
				shockwaves[i].mesh.visible = false;
				shockwaves[i].done_animating = true;
			}
		}
	}
}

var NB_TRAIL_MESHES = Math.ceil(TIME_TO_FALL/SHOOT_INTERVAL)
var availableTrailMesh = 0;
var TRAIL_WIDTH = 20;

function addTrailToMeteor(meteorite){
//TODO : keep current pos in meteorite ?

	trails[availableTrailMesh].mesh.position = mapLatLongToVector3(meteorite.lat, meteorite.lng, 600, 
					600-Math.round((595*(currentTime-meteorite.time)/TIME_TO_FALL)) + TRAIL_WIDTH);
	trails[availableTrailMesh].done_animating = false;
	trails[availableTrailMesh].time = meteorite.time;
	availableTrailMesh = (availableTrailMesh + 1)%NB_TRAIL_MESHES;
}

function updateTrails(delta){
	for(var i = 0; i< trails.length; i++){
		if(trails[i].done_animating === false){
			//If not done animating
			if(currentTime < trails[i].time +TIME_TO_FALL){
				trails[i].mesh.visible = true;
				trails[i].mesh.lookAt(camera.position);
				trails[i].animator.update(1000 * delta);
			} else{
				trails[i].mesh.visible = false;
				trails[i].done_animating = true;
			}
		}
	}
}

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}

var compactedGeometry;
var compactedMesh;
var lastIndexMerged = 0;
var PERCENTAGE_TO_COMPACT = 0.50;

function compactGeometry(keepOldMeteors){

	//Don't compact if it has already been done
	if(lastIndexMerged === indexDoneFalling){
		return;
	}
	// the geometry that will contain all our crashed meteorites
	for(var i=lastIndexMerged; i<= (Math.round(indexDoneFalling*PERCENTAGE_TO_COMPACT)); i++){
		if(keepOldMeteors){
			//TODO : compact ?
		} else{
			scene.remove(meteorites[i].meteorObject);
			//meteorites[i].meteorObject.geometry.dispose();
			//meteorites[i].geometry.deallocate();
		}
	}
	
	if(keepOldMeteors){
		//TODO : find a way to keep colors !
		var mat = new THREE.MeshLambertMaterial({color: 0x000000,opacity:0.6, emissive:0xffffff})
		
		//compactedMesh = new THREE.Mesh(compactedGeometry, mat);
		
		scene.add(compactedMesh);
	}
	
	lastIndexMerged = (Math.round(indexDoneFalling*PERCENTAGE_TO_COMPACT));
	
	console.log("Compacted " + lastIndexMerged + " meteorites meshes");
}

function clearMeteors(){
	canUpdateMeteors = false;
	for(var i=0; i< meteorites.length; i++){
		scene.remove(meteorites[i].meteorObject);
		//TODO : below function undefined
		//meteorites[i].meteorObject.deallocate();
	}
	indexDoneFalling = 0;
	lastIndexMerged = 0;
}

var date = new Date();
var lastFrameTime = date.getTime();
var prepare_next_chunk_bool;

function update() {
	date = new Date();
	var delta = date.getTime() - lastFrameTime;
	lastFrameTime = date.getTime();
	
	if(stop){
		play = false;
		clearMeteors();
		stop = false;
	}
	
	if(canUpdateMeteors && play){
		if(prepare_next_chunk_bool){
			prepareChunk()
			prepare_next_chunk_bool = false;
		}
		updateMeteors(delta);
		updateShockwaves();
		updateTrails(delta);
	}
}

var canUpdateMeteors;

function gameLoop(){
    update();	//This function handles meteor memory release if stop switched to true
    render();
	controlOrbit.update();	//orbit controls I guess :)
	if (closeRequested){
		destroy();
	} else{
		requestAnimationFrame(gameLoop);
	}
}

function render() {
    renderer.render(scene, camera);
}

// convert the positions from a lat, lon to a position on a sphere.
function mapLatLongToVector3(lat, lon, radius, heigth) {
	var phi = (lat)*Math.PI/180;
	var theta = (lon-180)*Math.PI/180;

	var x = -(radius+heigth) * Math.cos(phi) * Math.cos(theta);
	var y = (radius+heigth) * Math.sin(phi);
	var z = (radius+heigth) * Math.cos(phi) * Math.sin(theta);

	return new THREE.Vector3(x,y,z);
}

function destroy(){
	scene.remove(camera);
		for(var i=0; i< NB_SHOCKWAVE_MESHES; i++){
			shockwaves[i].mesh.geometry.dispose();
			scene.remove(shockwaves[i].mesh)
		}
	scene.remove(earth);
	scene.remove(clouds);
}

/**************************
	User related stuff
	*************************/

var stop = false;
var play = false;	

function playPause(){
	if(play === false){
		startAnim();
	}
	play = !play;
}

var chunkToPrepare = 0;

	
function stopAnim(){
	stop = true;
	chunkToPrepare = 0;
	//TODO or not ? Set year to start (chunk 0)
}

function setStartDate(){
	stopAnim();
	var year = d3.select("#selectedYear").attr("value")
	chunkToPrepare = findChunk(Number(year));
}

function startAnim(){
	//If the anim is still playing, don't do anything stupid !
	if(canUpdateMeteors === true){
		return;
	}
	prepareChunk(chunkToPrepare);
	//canUpdateMeteors = true; Done by prepare chunk when it successfully completes
	play = true;
}

function findChunk(year){
	var found = false;
	var i=0;
	while(!found){
		if(dataset[i].year >= year){
			return Math.floor(i/chunkSize);
		}
		i++;
	}
}

/** When a meteorite has Crashed, 
 ** show it to the user, 
 ** and he can click on the log entry to go to the website
 **/
function logToUserConsole(data){
	if (dataMatchesFilter(data)){
		pushRow(data);
	}
}

var MAX_LINES = 50 ;
var curs = 2;
var entry;

 function pushRow(data){
  var row = entry.insertRow(curs);
  var place = data.place;
  var type = data.type;
  var mass = data.mass;
  var year = Math.round(data.year);
  var link = data.database;
  var lng = Math.round(data.longitude*10)/10;
  var lat = Math.round(data.latitude*10)/10;

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);

  cell1.innerHTML = "<a href='" + link + "'>" + place + "</a>";
  cell2.innerHTML = year;
  cell3.innerHTML = "("+lng+","+lat+")";
  cell4.innerHTML = mass;
  cell5.innerHTML = type;


  curs = curs + 1;

  if (curs == MAX_LINES){
    entry.deleteRow(2);
    curs = curs - 1;
  }
}

/** Looks at what is written in the fields to decide whether to add the meteorite to the log or not **/
function dataMatchesFilter(data){
	var lat = data.latitude;
	var lng = data.longitude;
	 if( lat < d3.select("#latMin").attr("value")
	 || lat > d3.select("#latMax").attr("value")
	 || lng < d3.select("#lngMin").attr("value")
	 || lng > d3.select("#lngMax").attr("value")){
		return false;
	} else {
		return true;
	};
}

var SVG_STATUS_HEIGHT = 100;
var earth_status, load_status, parse_status, meteors_status, resources_status, done_status;

function addStatusBars(){
	var status = d3.select("#loadingBars").append("svg")
		.attr("width", 200)  
		.attr("height", SVG_STATUS_HEIGHT)
	earth_status = status.append("rect")
		.attr("x", 0)
		.attr("y", SVG_STATUS_HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", "rgba(30, 30, 200, 1)")
	resources_status = status.append("rect")
		.attr("x", 22)
		.attr("y", SVG_STATUS_HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", "rgba(200, 200, 20, 1)")
	load_status = status.append("rect")
		.attr("x", 44)
		.attr("y", SVG_STATUS_HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", "rgba(200, 70, 20, 1)")
	parse_status = status.append("rect")
		.attr("x", 66)
		.attr("y", SVG_STATUS_HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", "rgba(20, 200, 20, 1)")
	meteors_status = status.append("rect")
		.attr("x", 88)
		.attr("y", SVG_STATUS_HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", "rgba(200, 100, 100, 1)");
}

function addControlButtons(){
	var controls = d3.select("#controls");
	controls.append("button")
		.attr("id", "play")
		.classed("bouton2", true)
		.text("Play")
		.on("click",function(){ playPause(); })
	controls.append("button")
		.attr("id", "pause")
		.classed("bouton2", true)
		.text("Stop")
		.on("click",function(){ stopAnim(); });
	controls.append("button")
		.attr("id", "gotoYear")
		.classed("bouton2", true)
		.text("Goto year :")
		.on("click",function(){ setStartDate(); });
	controls.append("input")
		.attr("type", "number")
		.attr("min", -2500)
		.attr("max", 2013)
		.attr("step", 1)
		.attr("value", 42)
		.attr("id", "selectedYear")
	var filter = controls.append("div")
		.attr("id", "filters")
	filter.append("button")
		.attr("id", "yearFilter")
		.text("Show only meteorites falling in this area :")
		.classed("bouton2", true)
	filter.append("input")
		.attr("id", "latMin")
		.attr("value", -90)
		.attr("placeholder", "Latitude min")
	filter.append("input")
		.attr("id", "latMax")
		.attr("value", 90)
		.attr("placeholder", "Latitude max")
	filter.append("input")
		.attr("id", "lngMin")
		.attr("value", -180)
		.attr("placeholder", "Longitude min")
	filter.append("input")
		.attr("id", "lngMax")
		.attr("value", 180)
		.attr("placeholder", "Longitude max")
}

var bars_complete = 0;

function updateStatus(statusName, percentage){
	var statusBar;
	switch (statusName){
		case "load": 
			d3.select("#done_loading").html("<b>Loading...</b> Loading data !");
			statusBar = load_status;
			break;
		case "parse":
			d3.select("#done_loading").html("<b>Loading...</b> Parsing data !");
			statusBar = parse_status;
			break;
		case "earth":
			d3.select("#done_loading").html("<b>Loading...</b> Loading Earth !");
			statusBar = earth_status;
			break;
		case "meteors":
			d3.select("#done_loading").html("<b>Loading...</b> Loading Meteors !");
			statusBar = meteors_status;
			break;
		case "resources":
			d3.select("#done_loading").html("<b>Loading...</b> Loading Meshes !");
			statusBar = resources_status;
			break;
		default:
			break;
	}
	if(percentage === 100){
		bars_complete++;
	}
	var amount = Math.round(percentage);
	statusBar
		.transition()
		.duration(1000)
		.attr("y", SVG_STATUS_HEIGHT/2-amount)
		.attr("height", amount);
	if(bars_complete === 3){
		d3.select("#done_loading").html("<b>Done !</b> Click Play !");
	}
}