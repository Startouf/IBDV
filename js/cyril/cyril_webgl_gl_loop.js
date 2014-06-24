var squareRotation = 0.0;
var lastSquareUpdateTime;

var squareXOffset = 0.0;
var squareYOffset = 0.0;
var squareZOffset = 0.0;

var xIncValue = 0.2;
var yIncValue = -0.4;
var zIncValue = 0.3;

var squareVBO;

function drawScene() {
	//requestAnimationFrame(drawScene);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if(!squareVBO){
		squareVBO = new VBO.Square();
	}
		
	perspectiveMatrix = MakePerspective(45, 640.0/480.0, 0.1, 100.0);
	loadIdentity();
	
	mvTranslate([-0.0, 0.0, -6.0]);
	mvTranslate([squareXOffset, squareYOffset, squareZOffset]);
	
	mvPushMatrix();
	mvRotate(squareRotation, [1, 0, 1]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVBO.posVBO);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVBO.colorVBO);
	gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	mvPopMatrix();
}

function update(){
	var currentTime = (new Date).getTime();
	if (lastSquareUpdateTime) {
		var delta = currentTime - lastSquareUpdateTime;
		squareRotation += (30 * delta) / 1000.0;
	}

	lastSquareUpdateTime = currentTime;
	
	//squareXOffset += xIncValue * ((30 * delta) / 1000.0);
    //squareYOffset += yIncValue * ((30 * delta) / 1000.0);
    //squareZOffset += zIncValue * ((30 * delta) / 1000.0);
    
    if (Math.abs(squareYOffset) > 2.5) {
      xIncValue = -xIncValue;
      yIncValue = -yIncValue;
      zIncValue = -zIncValue;
    }
}