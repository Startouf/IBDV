var WIDTH = 800, HEIGHT = 600;
var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
var $container = $('#threejs');

var renderer;
var camera;
var scene;

var status, earth_status, load_status, parse_status, meteors_status;

/** Load after DOM generated **/
$(function(){
	addStatusBars();
	$("stop").click(function(){ stop(); });
	$("start").click(function(){ start(); });
	init();
})

function init(semaf, semaf2) {
	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xdddddd);
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
	addLights();
	addEarth();
	addClouds();
	addData();
	gameLoop();
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

/*************************
	Data Loading, 
	Object Generation
 ************************/

var timeScale;
var MAX_ANIMATION_TIME = 60000; // 1 min
var cubeMat;
var TOTAL_CHUNKS = 600;
var chunkSize; // Number of meteorites loaded at the same time
var meteorMaterial;

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
			//Every meteorite takes 2 seconds * 20FPS and BEFORE next year starts (and convert to millisecs
			.range([1, 4500 * 2 * 20 * 1000])
			.nice();
		
		// material to use for each of our elements. Could use a set of materials to
		// add colors relative to the density. Not done here.
		//TODO : handle every different meteor type;
		cubeMat = {
			mat1: new THREE.MeshLambertMaterial({color: 0x000000,opacity:0.6, emissive:0xffffff}),
			mat2: new THREE.MeshLambertMaterial({color: 0x000000,opacity:0.6, emissive:0xffffff}),
			mat3: new THREE.MeshLambertMaterial({color: 0x000000,opacity:0.6, emissive:0xffffff})
		}
		
		var meteorTexture = THREE.ImageUtils.loadTexture( "image/stone-meteorite-seamless-texture.jpg" );
			meteorMaterial =  new THREE.MeshPhongMaterial( {
			map: meteorTexture,
			shininess: 0.2 } );	
		
		//prepareMaterials();
		prepareNextChunk();
		
	}, load_status, parse_status)
}

var fireballMaterial;

function prepareMaterials(){
// base image texture for mesh
	var lavaTexture = new THREE.ImageUtils.loadTexture( 'image/lava.jpg');
	lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping; 
	// multiplier for distortion speed 		
	var baseSpeed = 0.01;
	// number of times to repeat texture in each direction
	var repeatS = repeatT = 4.0;
	
	// texture used to generate "randomness", distort all other textures
	var noiseTexture = new THREE.ImageUtils.loadTexture( 'image/cloud.png' );
	noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
	// magnitude of noise effect
	var noiseScale = 0.2;
	
	// texture to additively blend with base image texture
	var blendTexture = new THREE.ImageUtils.loadTexture( 'image/lava.jpg' );
	blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping; 
	// multiplier for distortion speed 
	var blendSpeed = 0.01;
	// adjust lightness/darkness of blended texture
	var blendOffset = 0.25;

	// texture to determine normal displacement
	var bumpTexture = noiseTexture;
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// multiplier for distortion speed 		
	var bumpSpeed   = 0.03;
	// magnitude of normal displacement
	var bumpScale   = 20.0;
	
	// use "this." to create global object
	this.customUniforms = {
		baseTexture: 	{ type: "t", value: lavaTexture },
		baseSpeed:		{ type: "f", value: baseSpeed },
		repeatS:		{ type: "f", value: repeatS },
		repeatT:		{ type: "f", value: repeatT },
		noiseTexture:	{ type: "t", value: noiseTexture },
		noiseScale:		{ type: "f", value: noiseScale },
		blendTexture:	{ type: "t", value: blendTexture },
		blendSpeed: 	{ type: "f", value: blendSpeed },
		blendOffset: 	{ type: "f", value: blendOffset },
		bumpTexture:	{ type: "t", value: bumpTexture },
		bumpSpeed: 		{ type: "f", value: bumpSpeed },
		bumpScale: 		{ type: "f", value: bumpScale },
		alpha: 			{ type: "f", value: 1.0 },
		time: 			{ type: "f", value: 1.0 }
	};
	
	// create custom material from the shader code above
	//   that is within specially labeled script tags
	fireballMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: customUniforms,
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	}   );
}

var numChunk = 0;
var meteorites = new Array();
var preparedChunks = 0;
var allDataRendered = false;

function createMeteorMesh(){

}

/** For a chunk, prepares the cube VBOs for each meteorite **/
function prepareNextChunk(){
	
	//Skip the last meteorite chunk (or TODO handle non multiple of chunkSize)
	if((numChunk+1)*chunkSize > dataset.length){
		if(allDataRendered === false){
			allDataRendered = true;
		} else{
			console.log("Next Chunk exceeds data.length !!!")
		}
		return;
	}

	numChunk++;

	for (var i = numChunk*chunkSize ; i < (numChunk+1)*chunkSize ; i++) {
		//get the data, and set the offset, we need to do this since the x,y coordinates
		//from the data aren't in the correct format
		var lat = dataset[i].latitude;
		var lng = dataset[i].longitude;
		var value = dataset[i].mass;
		//var material = getMaterialForType(dataset[i].type);

		// calculate the position where we need to start the cube
		//(The Earth is 600 radius)
		//Initial height of 600 then falling down to 2
		var position = mapLatLongToVector3(lat, lng, 600, 600+Math.random()*30); //falling down to (..., 600, 2)

		// create the cube
		//TODO : choose material depending on meteorite type
		//var cube = new THREE.Mesh(new THREE.BoxGeometry(5,5,1+Math.log(value+0.1),1,1,1),meteorMaterial);
		cube = new THREE.Mesh(new THREE.SphereGeometry(7,6,5), meteorMaterial);
		cube.position = position;
		cube.lookAt( new THREE.Vector3(0,0,0) );
		
		var object = new THREE.Object3D
		
		//Add the meteorite to the processing Array
		meteorites.push({
			lat: lat,
			lng: lng,
			cube : cube,
			//time: timeScale(dataset[i].year),
			//TODO scale
			time: (i+1)*100,
			isFalling: false,
			data: dataset[i]
		});
		
		scene.add(cube);

		// At first, hide the object
		//...Or not ?
	}
	
	if(preparedChunks === 0){
		startTime = date.getTime();
		currentTime = 0;
		canUpdateMeteors = true;
	}
	preparedChunks++;
}

/*** Handle every meteor type ***/
function getMaterialForType(nameOfMeteorType){
	return cubeMat.mat1;
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
	for(var i = indexDoneFalling; i < chunkSize*(preparedChunks); i++){
		if(currentTime > meteorites[i].time ){
			//If he meteorite is falling
			if(currentTime < meteorites[i].time + TIME_TO_FALL  ){
				meteorites[i].cube.position = mapLatLongToVector3(meteorites[i].lat, meteorites[i].lng, 600, 
					600-Math.round((595*(currentTime-meteorites[i].time)/TIME_TO_FALL)));
				//console.log("meteorite " + i + " has fallen to " + 600-Math.round((5*currentTime/(meteorites[i].time + TIME_TO_FALL))))
			} // If the meteorite has crashed
			else{
				indexDoneFalling++;
				meteorites[i].cube.position = mapLatLongToVector3(meteorites[i].lat, meteorites[i].lng, 600, 2);
				logToUserConsole(meteorites[i].data);
				//console.log("meteorite" + i + "has landed")
			}
		}
	}
	if(indexDoneFalling > Math.round(numChunk*chunkSize - 0.25*chunkSize)){
		prepare_next_chunk_bool = true;
	}
	
	if(indexDoneFalling%500 === 0){
		compactGeometry();
	}
}

var compactedGeometry;
var compactedMesh;
var lastIndexMerged = 0;

function compactGeometry(keepOldMeteors){

	//Don't compact if it has already been done
	if(lastIndexMerged === indexDoneFalling){
		return;
	}
	// the geometry that will contain all our crashed meteorites
	compactedGeometry = new THREE.Geometry();
	for(var i=lastIndexMerged; i<= indexDoneFalling; i++){
		if(keepOldMeteors){
			THREE.GeometryUtils.merge(compactedGeometry, meteorites[i].cube);
		}
		scene.remove(meteorites[i].cube);
		meteorites[i].cube.geometry.dispose();
	}
	
	if(keepOldMeteors){
		//TODO : find a way to keep colors !
		var mat = new THREE.MeshLambertMaterial({color: 0x000000,opacity:0.6, emissive:0xffffff})
		
		compactedMesh = new THREE.Mesh(compactedGeometry, mat);
		
		scene.add(compactedMesh);
	}
	
	lastIndexMerged = indexDoneFalling;
	
	console.log("Compacted " + lastIndexMerged + " meteorites meshes");
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
	//TODO : move all the cubes
	*/
	
	date = new Date();
	var delta = date.getTime() - lastFrameTime;
	lastFrameTime = date.getTime();
	
	if(canUpdateMeteors && play){
		if(prepare_next_chunk_bool){
			prepareNextChunk()
			prepare_next_chunk_bool = false;
		}
		updateMeteors(delta);
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
	if(!stop){
		requestAnimationFrame(gameLoop)
	}
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

function pause(){
	play = !play;
}
	
function stop(){
	stop = true;
}

function start(){
	stop = false;
}

/** When a meteorite has Crashed, 
 ** show it to the user, 
 ** and he can click on the log entry to go to the website
 **/
function logToUserConsole(data){

}

function addStatusBars(){
	status = d3.select("#status").append("svg")
		.attr("width", 400)  
		.attr("height", HEIGHT)
	earth_status = status.append("rect")
		.attr("x", 0)
		.attr("y", HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", function(d) {
			return "rgb(30, 30, 200)";
		})
	load_status = status.append("rect")
		.attr("x", 22)
		.attr("y", HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", function(d) {
			return "rgb(200, 70, 20)";
		})
	parse_status = status.append("rect")
		.attr("x", 44)
		.attr("y", HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", function(d) {
			return "rgb(200, 70, 20)";
		})
	meteors_status = status.append("rect")
		.attr("x", 66)
		.attr("y", HEIGHT/2)
		.attr("width", 20)
		.attr("height", 0)
		.attr("fill", function(d) {
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