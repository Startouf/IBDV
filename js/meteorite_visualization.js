var WIDTH = 800,
    HEIGHT = 400;
var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
var $container = $('#threejs');

var renderer;
var camera;
var scene;

var undefined;

var status, earth_status, load_status, parse_status, meteors_status;

/** Load after DOM generated **/
$(function(){
	addStatusBars();
	var debug = $("#stop");
	$("#stop").click(function(){ stopAnim(); });
	$("#start").click(function(){ startAnim(); });
	init();
})

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000);
	renderer.setSize(WIDTH, HEIGHT);
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set(0, 0, 1800);
	var controls;
	
	controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.addEventListener('change', render);
	
	scene =  new THREE.Scene();
	camera.lookAt(scene.position);
	scene.add(camera);
	
	$("#threejs").append( renderer.domElement );
	setTimeout(function(){
		addGalaxy();
		addLights();
		addEarth();
		addClouds();
		setTimeout(function(){
			loadResources();
			addData();
			setTimeout(function(){
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
	
	renderer.render(scene, camera);
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
	
	
	
	if(lastPreparedChunk === 0 || (index !== undefined)){
		currentTime = (index ? index : 0)*SHOOT_INTERVAL + TIME_TO_FALL;
		canUpdateMeteors = true;
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
				//console.log("meteorite " + i + " has fallen to " + 600-Math.round((5*currentTime/(meteorites[i].time + TIME_TO_FALL))))
			} // If the meteorite has crashed
			else{
				indexDoneFalling++;
				meteorites[i].meteorObject.position = mapLatLongToVector3(meteorites[i].lat, meteorites[i].lng, 600, 2);
				triggerShockwave(meteorites[i]);
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
	//compactedGeometry = new THREE.Geometry();
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
	
	lastIndexMerged = indexDoneFalling;
	
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
	/* Earth revolves
	earth.rotation.y += 0.005;
	clouds.rotation.y += 0.005;
	if(total){
		total.rotation.y += 0.005;
	}
	//TODO : move all the meteors
	*/
	
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
	}
}

function render() {
    renderer.render(scene, camera);
}

/** arg1 is a mesh or geometry ?
 ** ephemere -> if true, only one update is needed
 **/
function updateNeeded(arg1, ephemere){
	// set the geometry to dynamic
	// so that it allow updates
	mesh.geometry.dynamic = true;

	// changes to the vertices
	mesh.geometry.verticesNeedUpdate = true;

	// changes to the normals
	mesh.geometry.normalsNeedUpdate = true;
	
	if(ephemere){
		//TODO
	}
}

var canUpdateMeteors;

function updateNoLongerNeeded(object){
	object.geometry.dynamic = false;
	object.geometry.verticesNeedUpdate = false;
	object.geometry.normalsNeedUpdate = false;
}

function gameLoop(){
    update();
    render();
	requestAnimationFrame(gameLoop)
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

/**************************
	User related stuff
	*************************/

var stop = false;
var play = true;	

function playPause(){
	play = !play;
}

var chunkToPrepare = 0;
	
function stopAnim(){
	stop = true;
	chunkToPrepare = 0;
}

function setStartDate(year){
	chunkToPrepare = findChunk(year);
}

function startAnim(){
	//If the anim is still playing, don't do anything stupid !
	if(canUpdateMeteors === true){
		return;
	}
	prepareChunk(chunkToPrepare);
	canUpdateMeteors = true;
	play = true;
}

function findChunk(year){
	var found = false;
	var i=0;
	while(!found){
		if(dataset[i].year <= year){
			return Math.floor(i/chunkSize);
		}
	}
}

/** When a meteorite has Crashed, 
 ** show it to the user, 
 ** and he can click on the log entry to go to the website
 **/
function logToUserConsole(data){
	//TODO
}

var status, earth_status, load_status, parse_status, meteors_status;

function addStatusBars(){
	status = d3.select("#status").append("svg")
		.attr("width", 200)  
		.attr("height", HEIGHT)
	earth_status = d3.select("#status").append("rect")
		.attr("x", 0)
		.attr("y", HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", function() {
			return "rgb(30, 30, 200)";
		})
	load_status = d3.select("#status").append("rect")
		.attr("x", 22)
		.attr("y", HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", function() {
			return "rgb(200, 70, 20)";
		})
	parse_status = d3.select("#status").append("rect")
		.attr("x", 44)
		.attr("y", HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", function() {
			return "rgb(200, 70, 20)";
		})
	meteors_status = d3.select("#status").append("rect")
		.attr("x", 66)
		.attr("y", HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", function() {
			return "rgb(200, 70, 20)";
		});
}

function updateStatus(statusName, percentage){
	var statusBar;
	switch (statusName){
		case "load": 
			statusBar = load_status;
			break;
		case "parse":
			statusBar = parse_status;
			break;
		case "earth":
			statusBar = earth_status;
			break;
		case "meteors":
			statusBar = meteors_status;
			break;
		default:
			break;
	}
	var amount = Math.round(percentage);
	statusBar
		.transition()
		.duration(1000)
		.attr("y", HEIGHT/2-amount)
		.attr("height", amount)
}