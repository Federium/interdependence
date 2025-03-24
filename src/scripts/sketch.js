import { frag, vert } from "./shader.js";
/* import { pauseHero as paused } from "./map.js"; */

export const mySketch = (width, height) => (p) => {
  let capturer;

  let n = 30;
  let points = [];
  let worleyShader;
  let observationPoint;
  let delta;
  let canvas;
  let goingBackwards = false;
  let speedMultiplier = 0.002;

  p.windowResized = windowResized;

  //da settings
  let settings = {
    canvas: {
      width: width,
      height: height,
    },
    number: n,  // valore iniziale di n
    zDistribution: 1,
    size: 0.4,
    range: [0.2, 0.8],
    speed: 0.3,
    animate: true,
    duration: 10,
  };

  let recording = false;
  let timeLimit = 0;

  function createPoints() {
    points = [];
    const normalizedMouse = [p.mouseX / width, (height - p.mouseY) / height];

    points.push(new Point({ pos: p.createVector(normalizedMouse[0],normalizedMouse[1], 0.8) }));
    for (let i = 1; i < n; i++) {
      let randomPos = p.createVector(
        p.random(),
        p.random(),
        p.random(settings.zDistribution)
      );
      const point = new Point({ pos: randomPos });
      points.push(point);
    }
  }

  function preload() {
    worleyShader = p.createShader(vert, frag(n));
  }

  function setup() {
   // width = p.windowWidth;
   // height = p.windowHeight;

    canvas = p.createCanvas(width, height, p.WEBGL);
    canvas.parent("p5-canvas");

    p.pixelDensity(1);
    resize();
    p.noStroke();

    createPoints();

    observationPoint = 0;
    const normalizedMouse = [p.mouseX / width, (height - p.mouseY) / height];
    console.log(normalizedMouse);
  }

  function draw() {
    if (paused) return;
    p.background(220);

    timeLimit = settings.duration * 30;

    delta = settings.speed * speedMultiplier;

    if (settings.animate) {
      delta = delta * (goingBackwards ? -1 : 1);
      if (observationPoint + delta >= settings.zDistribution) {
        goingBackwards = true;
      } else if (observationPoint + delta <= 0) {
        goingBackwards = false;
      }

      observationPoint += delta;
    }

    const normalizedMouse = [p.mouseX / width, (height - p.mouseY) / height];

    points[0].pos.x = normalizedMouse[0];
    points[0].pos.y = normalizedMouse[1];
    


    worleyShader.setUniform("u_z", observationPoint);
    worleyShader.setUniform("u_ratio", width / height);
    worleyShader.setUniform("u_points", [
      ...points.flatMap((p) => [p.pos.x, p.pos.y, p.pos.z]),
      observationPoint,
    ]);
    worleyShader.setUniform("u_time", p.frameCount / 100);
    worleyShader.setUniform("u_mouse", normalizedMouse);
    worleyShader.setUniform("u_contrast", settings.size);
    worleyShader.setUniform("u_n", n);
    worleyShader.setUniform("u_exposure", settings.exposure);
    worleyShader.setUniform("u_range", settings.range);
  
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

    // if (recording) {
    //   if (recordedFrames === timeLimit) {
    //     toggleRecord();
    //     return;
    //   }
    //   p.requestAnimationFrame(draw);
    //   capturer.capture(canvas.elt);
    //   recordedFrames++;

    //   progressPercentageEl.innerHTML = `${Math.round(
    //     (recordedFrames / timeLimit) * 100
    //   )}%`;
    //   progressEl.style = `--progress: ${(recordedFrames / timeLimit) * 100}%`;
    // }
  }

  function resize() {
    console.log("resize");
    const { width, height } = settings.canvas;

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
    console.log(width);

    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  async function restart() {
    n = settings.number;

    if (paused) return;


    worleyShader = p.createShader(vert, frag(n));
    createPoints();

  }

  function toggleAnimation() {}

  class Point {
    constructor({ pos }) {
      this.pos = pos;
    }
  }

  p.preload = preload;
  p.setup = setup;
  p.draw = draw;


  return { n, resize, restart, toggleAnimation, recording };
};
