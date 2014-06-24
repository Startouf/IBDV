var WIDTH = 800, HEIGHT = 500, POS_X = 1800, POS_Y = 500, POS_Z = 1800;
var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
var $container = $('#threejs');

var renderer;
var camera;
var scene;

$(function(){
	init();
})

function init() {
	renderer = new THREE.WebGLRenderer();
		renderer.setClearColorHex(0x111111);
		renderer.setSize(WIDTH, HEIGHT);
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set(0, 0, 2000);
	scene =  new THREE.Scene();
	
	document.body.appendChild( renderer.domElement );
	addEarth();
	addLights();
	gameLoop();
}

/* Not used */
function loadData(){
	$(document).ready(function()  {
		jQuery.get('data/density.csv', function(data) {
			addDensity(CSVToArray(data));
			addLights();
			addEarth();
			addClouds();
		});
	});
}


// add the earth

var earth;

function addEarth() {
	var spGeo = new THREE.SphereGeometry(600,50,50);
	var planetTexture = THREE.ImageUtils.loadTexture( "image/terre-janvier.jpg" );
	var mat2 =  new THREE.MeshPhongMaterial( {
		map: planetTexture,
		shininess: 0.2 } );
	earth = new THREE.Mesh(spGeo,mat2);
	scene.add(earth);
}

// add clouds
function addClouds() {
	var spGeo = new THREE.SphereGeometry(600,50,50);
	var cloudsTexture = THREE.ImageUtils.loadTexture( "assets/earth_clouds_1024.png" );
	var materialClouds = new THREE.MeshPhongMaterial( { color: 0xffffff, map: cloudsTexture, transparent:true, opacity:0.3 } );

	meshClouds = new THREE.Mesh( spGeo, materialClouds );
	meshClouds.scale.set( 1.015, 1.015, 1.015 );
	scene.add( meshClouds );
}

// add a simple light
function addLights() {
	light = new THREE.DirectionalLight(0x3333ee, 3.5, 500 );
	scene.add( light );
	light.position.set(POS_X,POS_Y,POS_Z);
}

// convert the positions from a lat, lon to a position on a sphere.
function latLongToVector3(lat, lon, radius, heigth) {
	var phi = (lat)*Math.PI/180;
	var theta = (lon-180)*Math.PI/180;

	var x = -(radius+heigth) * Math.cos(phi) * Math.cos(theta);
	var y = (radius+heigth) * Math.sin(phi);
	var z = (radius+heigth) * Math.cos(phi) * Math.sin(theta);

	return new THREE.Vector3(x,y,z);
}


var sphere;
var cube;

function addSphereAndCube(){
	// set up the sphere vars
	var radius = 1,
    segments = 16,
    rings = 16;

	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xCC0000
		});

	sphere = new THREE.Mesh(
		new THREE.SphereGeometry(
			radius,
			segments,
			rings),
		sphereMaterial);
		
	sphere.position.x = 3

	// add the sphere to the scene
	scene.add(sphere);

	var geometry =  new THREE.CubeGeometry(1, 1, 1);
    var material =  new THREE.MeshBasicMaterial( {color : 0x00ff00});
	
    cube =  new THREE.Mesh(geometry, material);
    scene.add(cube);
}

var pointLight;

function initLights(){
	pointLight =
	  new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	// add to the scene
	scene.add(pointLight);
}

var particles;

function initParticles(){
	particleCount = 1800;
	var	particles = new THREE.Geometry(),
		pMaterial = new THREE.ParticleBasicMaterial({
		  color: 0xFFFFFF,
		  size: 20
		});

	// now create the individual particles
	for (var p = 0; p < particleCount; p++) {

	  // create a particle with random
	  // position values, -250 -> 250
	  var pX = Math.random() * 500 - 250,
		  pY = Math.random() * 500 - 250,
		  pZ = Math.random() * 500 - 250,
		  particle = new THREE.Vertex(
			new THREE.Vector3(pX, pY, pZ)
		  );

	  // add it to the geometry
	  particles.vertices.push(particle);
	}

	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
		particles,
		pMaterial);

	// add it to the scene
	scene.addChild(particleSystem);
}

function gameLoop(){
    update();
    render();
	requestAnimationFrame(gameLoop)
}

function update() {
    //cube.rotation.x += 0.1;
    //cube.rotation.y += 0.1;
	earth.rotation.y += 0.005;
}

function render() {
    renderer.render(scene, camera);
}

function updateNeeded(object, ephemere){
	// set the geometry to dynamic
	// so that it allow updates
	object.geometry.dynamic = true;

	// changes to the vertices
	object.geometry.verticesNeedUpdate = true;

	// changes to the normals
	object.geometry.normalsNeedUpdate = true;
	
	if(ephemere){
		//TODO
	}
}