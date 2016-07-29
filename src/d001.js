import React, { Component } from 'react';
import { initWebGL, createShader, createProgram, } from './utils/gl';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;

  void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // convert from 0 -> 1 to 0 -> 2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0 -> 2 to -1 -> +1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`;

class D001 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  componentDidUpdate() {
    let gl;
    const canvas = document.getElementById("glCanvas");
    gl = initWebGL(canvas);

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    let colorLocation = gl.getUniformLocation(program, "u_color");
    let positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let positions = [
      0, 0,
      this.state.width, 0,
      0, this.state.height,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);

    let size = 2;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32 bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer

    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(colorLocation, 77 / 255, 168 / 255, 199 / 255, 1);

    let primitiveType = gl.TRIANGLES;
    offset = 0;
    let count = 3;

    gl.drawArrays(primitiveType, offset, count);
  }

  render() {
    return (
      <div>
        <canvas id="glCanvas" width={ this.state.width } height={ this.state.height } />
      </div>
    );
  }
};

export default D001;
