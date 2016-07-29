export function initWebGL(canvas) {
  let gl = null;

  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch (e) { }

	if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }

  return gl;
}

export function createShader(gl, type, source) {
  let shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  console.log(`successfully created shader? ${success}`);

  if (success) { return shader };

  gl.deleteShader(shader);
}

export function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  console.log(`successfully created program? ${success}`);

  if (success) { return program; }

  gl.deleteProgram(program);
}
