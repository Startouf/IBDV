var gl; // A global variable for the WebGL context

function start() {
	canvas = document.getElementById("glcanvas");
	gl = initWebGL(canvas);      // Initialize the GL context

	// Only continue if WebGL is available and working
	if (gl) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
		gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
		gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
		gl.viewport(0, 0, canvas.width, canvas.height);
		
		initShaders();
		drawScene();
	}
}

function initWebGL(canvas) {
	gl = null;

	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}

	return gl;
}

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	// Create the shader program

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	alert("Unable to initialize the shader program.");
	}

	gl.useProgram(shaderProgram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
	
	//Attributes for shaders :
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(vertexColorAttribute);
	
	
}

function getShader(gl, id) {
	var shaderScript, theSource, currentChild, shader;

	shaderScript = document.getElementById(id);

	if (!shaderScript) {
	return null;
	}

	theSource = "";
	currentChild = shaderScript.firstChild;

	while(currentChild) {
	if (currentChild.nodeType == currentChild.TEXT_NODE) {
	  theSource += currentChild.textContent;
	}

	currentChild = currentChild.nextSibling;
	}

	if (shaderScript.type == "x-shader/x-fragment") {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
	shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
	 // Unknown shader type
	 return null;
	}

	gl.shaderSource(shader, theSource);

	// Compile the shader program
	gl.compileShader(shader);  

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
	  alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
	  return null;  
	}

	return shader;
}