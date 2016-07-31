import React, { Component } from 'react';
import {
  initWebGL,
  createShader,
  createProgram,
  setGeometry,
} from './utils/gl';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;
  uniform vec2 u_translation;

  void main() {
    // add in the translation
    vec2 position = a_position + u_translation;

    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;

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

class D002 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    }
  }

  componentDidMount() {
    const canvas = document.getElementById("glCanvas");
    this.gl = initWebGL(canvas);
    let gl = this.gl;

    // setup GLSL Program
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    let program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    // Look up where the vertext data needs to go
    let positionLocation = gl.getAttribLocation(program, "a_position");
    this.translationLocation = gl.getUniformLocation(program, "u_translation");

    // Look up uniforms
    let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    let colorLocation = gl.getUniformLocation(program, "u_color");

    // Set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Create a buffer
    let buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, 77 / 255, 168 / 255, 199 / 255, 1);

    setGeometry(gl);

    this.drawScene(gl);
  }

  componentDidUpdate() {
    this.drawScene(this.gl);
  }

  drawScene = (gl) => {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the translation
    gl.uniform2fv(this.translationLocation, [this.state.x, this.state.y]);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 18);
  }

  onSliderChange = (e) => {
    if (e.target.id === "range1") {
      this.setState({ x: Number(e.target.value) });
    } else {
      this.setState({ y: Number(e.target.value) });
    }
  }

  render() {
    return (
      <div>
        <canvas id="glCanvas" width={ 640 } height={ 480 } />

        <input
          type="range"
          id="range1"
          min="0"
          max="640"
          value={ this.state.x }
          onChange={ this.onSliderChange }
        />

        <input
          type="range"
          id="range2"
          min="0"
          max="480"
          value={ this.state.y }
          onChange={ this.onSliderChange }
        />
      </div>
    );
  }
};

export default D002;
