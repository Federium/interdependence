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

  let lowFpsCounter = 0;
  const fpsThreshold = 15;
  const maxLowFpsTime = 3;
  
  p.windowResized = windowResized;

  function preload() {
    worleyShader = p.createShader(vert, frag);
  }

  function setup() {
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

    let fps = p.frameRate();
    if (fps < fpsThreshold) {
      lowFpsCounter += p.deltaTime / 1000;
    } else {
      lowFpsCounter = 0;
    }

    if (lowFpsCounter >= maxLowFpsTime) {
      switchToVideo();
      return;
    }

    delta = speed * speedMultiplier * (goingBackwards ? -1 : 1);
    if (observationPoint + delta >= zDistribution) goingBackwards = true;
    else if (observationPoint + delta <= 0) goingBackwards = false;

    observationPoint += delta;

    const normalizedMouse = [p.mouseX / width, (height - p.mouseY) / height, observationPoint];

    worleyShader.setUniform("u_z", observationPoint);
    worleyShader.setUniform("u_ratio", width / height);
    worleyShader.setUniform("u_time", p.frameCount / 100);
    worleyShader.setUniform("u_mouse", normalizedMouse);
  
    p.shader(worleyShader);
    p.plane(width, height);
  }

  function switchToVideo() {
    p.remove();
    let video = document.createElement("video");
    video.src = "/assets/worley.webm";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    document.getElementById("p5-canvas").appendChild(video);
  }

  function resize() {
    const wRatio = p.windowWidth / width;
    const hRatio = p.windowHeight / height;
    let scale = Math.min(Math.min(wRatio, hRatio), 1);
    canvas.elt.style = `--scale:${scale}`;
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
