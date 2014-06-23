var horizAspect = 480.0/640.0;

var VBO = { //Namespace
	Square: function(vtx, clr) {
		this.posVBO = gl.createBuffer();
		this.colorVBO = gl.createBuffer();

		var vertices = (!vtx || vtx.length !== 12) 
		? [
				1.0, 1.0, 0.0,
				-1.0, 1.0, 0.0,
				1.0, -1.0, 0.0,
				-1.0, -1.0, 0.0,
		]
		: vertices;

		var colors = (!clr || clr.length !== 12)
		? [
				1.0, 1.0, 1.0, 1.0,    // white
				1.0, 0.0, 0.0, 1.0,    // red
				0.0, 1.0, 0.0, 1.0,    // green
				0.0, 0.0, 1.0, 1.0     // blue
		]
		: colors;
	
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.posVBO);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	    return {
	        posVBO: this.posVBO,
	        colorVBO: this.colorVBO
	    }
	}
}