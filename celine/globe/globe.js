// variables
var camera,
	scene,
	container,
	renderer,
	light,
	earthMesh,
	control;
	
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;	
    
init();
animate();

// function initialize
function init() {
		
	// create the container
	container = document.createElement('div');
	document.body.appendChild(container);	
	
	// init the WebGL renderer and append it to the Dom  
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH,HEIGHT);
	container.appendChild( renderer.domElement );
	
	// create the scene
	scene = new THREE.Scene();  
    
    // create the light
    light = new THREE.PointLight(0xffffff);
    light.position.set(100,100,500);
    light.lookAt(scene.position);
    scene.add(light);
    
	// create the camera
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 4000);
    camera.position.set(0,0,0);
    camera.position.z = 500;
    camera.lookAt(scene.position);
    camera.add(light);
    scene.add(camera);
    
    // create the control
    controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.addEventListener('change',render);
    
    // create the sphere
	var sphere   = new THREE.SphereGeometry(100, 50, 50);
	var material  = new THREE.MeshPhongMaterial();
	material.map = THREE.ImageUtils.loadTexture('earth.jpg', {}, function() {
    		renderer.render(scene, camera)
    	});		
    material.specularMap = THREE.ImageUtils.loadTexture('earthspec.jpg',{},function() {
    		renderer.render(scene,camera)
    	});
	material.specular  = new THREE.Color('grey');	
	material.needsUpdate = true;
	earthMesh = new THREE.Mesh(sphere, material);
	
	// create the clouds
	var sphereCloud  = new THREE.SphereGeometry(100,50,50);
	var materialCloud  = new THREE.MeshPhongMaterial();
	materialCloud.map = THREE.ImageUtils.loadTexture('earthcloud.png',{},function() {
			renderer.render(scene,camera)
		});
	materialCloud.transparent = true;
	materialCloud.depthWrite = false;
	materialCloud.opacity=0.8;
	materialCloud.needsUpdate = true;
	var cloudMesh = new THREE.Mesh(sphereCloud, materialCloud)
	earthMesh.add(cloudMesh);

	// rotate a little bit
	earthMesh.rotation.x += 0.05;
	
	// add the sphere
	scene.add(earthMesh);   
    
   	// galaxy
	var sphereGalaxy  = new THREE.SphereGeometry(450, 50, 50);
	// create the material, using a texture of startfield
	var materialGalaxy  = new THREE.MeshBasicMaterial();
	materialGalaxy.map   = THREE.ImageUtils.loadTexture('galaxy.png',{},function() {
			renderer.render(scene,camera)
		});
	materialGalaxy.side  = THREE.BackSide;
	materialGalaxy.needsUpdate=true;
	var galaxyMesh  = new THREE.Mesh(sphereGalaxy, materialGalaxy);
	scene.add(galaxyMesh);
	
	renderer.render(scene, camera);

}

// animate
function animate() {

	// render
	render();
	// relaunch timer
	requestAnimationFrame( animate );
	// update controls
	controls.update();
	
}

// rendering 3D
function render() {

	// rotation
	earthMesh.rotation.y -= 0.005;

	renderer.render( scene, camera );
}


