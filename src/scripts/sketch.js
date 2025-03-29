import { frag, vert } from "./shader.js";
import { pauseHero as paused } from "./mapdesk.js";

export const mySketch = (width, height) => (p) => {

  let worleyShader;
  let observationPoint;
  let delta;
  let canvas;
  let goingBackwards = false;
  let speedMultiplier = 0.002;
  let zDistribution = 0.5;
  let speed = 0.3;
  
  p.windowResized = windowResized;

  //da settings


  

  function preload() {
    worleyShader = p.createShader(vert, frag);
  }

  function setup() {
   // width = p.windowWidth;
   // height = p.windowHeight;

    canvas = p.createCanvas(width, height, p.WEBGL);
    canvas.parent("p5-canvas");

    p.pixelDensity(1);
    resize();
    p.noStroke();


    observationPoint = 0;
  }

  function draw() {
    if (paused) return;
    p.background(220);


    delta = speed * speedMultiplier;

      delta = delta * (goingBackwards ? -1 : 1);
      if (observationPoint + delta >= zDistribution) {
        goingBackwards = true;
      } else if (observationPoint + delta <= 0) {
        goingBackwards = false;
      }

      observationPoint += delta;
    

    const normalizedMouse = [p.mouseX / width, (height - p.mouseY) / height, observationPoint];



    worleyShader.setUniform("u_z", observationPoint);
    worleyShader.setUniform("u_ratio", width / height);
    worleyShader.setUniform("u_time", p.frameCount / 100);
    worleyShader.setUniform("u_mouse", normalizedMouse);
  
    p.shader(worleyShader);

    // Draw a plane that fills the canvas
    p.plane(width, height);

    p.strokeWeight(1);
    p.blendMode(p.DIFFERENCE);

    p.translate(-width / 2, -height / 2, 1);
    for (let i = 0; i <= width; i++) {
      let color = p.lerp(0, 255, i / width);
      p.stroke(color);
      p.line(i, 0, i, height);
    }

  }

  function resize() {

    const wRatio = p.windowWidth / width;
    const hRatio = p.windowHeight / height;

    let scale = Math.min(Math.min(wRatio, hRatio), 1);

    canvas.elt.style = `--scale:${scale}`;

    if (scale <= 1) {
      canvas.elt.classList?.remove("static");
    } else {
      canvas.elt.classList?.add("static");
    }

    p.resizeCanvas(width, height);
  }

  function windowResized() {

    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }





  p.preload = preload;
  p.setup = setup;
  p.draw = draw;


  return { resize };
};
