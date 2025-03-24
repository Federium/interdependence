import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import locations from '../assets/data/location.json';
let pauseHero = false;

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const mapSection = document.querySelector('.map-section');
  if (!mapSection) return;

  const mapImg = document.querySelector('#map');
  const paragraphBox = document.querySelector(".paragraph-box");
  const titleBox = document.querySelector(".title-box");

  // Wait for the image to load before initializing
  mapImg.addEventListener('load', () => {
    initializeMap();
  });

  // If the image is already loaded (from cache), initialize immediately
  if (mapImg.complete) {
    initializeMap();
  }

  function initializeMap() {
    let index = 0;
    const totalSteps = locations.length;
    const mw = mapImg.naturalWidth;  // image width
    const mh = mapImg.naturalHeight; // image height
    const mrw = mapImg.width;  // actual image width
    const mrh = mapImg.height; // actual image height
    const ratio = mrw/mw;
    console.log(ratio);
    const oPoints = [
      {	
        x: 4930,
        y: 3366,
      },
      {	
        x: 1200,
        y: 1000
      },
      {	
        x: 2965,
        y: 2945
      }
    ];

    const scale = [2, 2, 2];

    const points = [
      {	
        x: ((oPoints[0].x-mw/2)*ratio) + mrw/2,
        y: ((oPoints[0].y-mh/2)*ratio) + mrh/2,
        t: [((oPoints[0].x-mw/2)*ratio), ((oPoints[0].y-mh/2)*ratio)]
      },
      {	
        x: ((oPoints[1].x-mw/2)*ratio) + mrw/2,
        y: ((oPoints[1].y-mh/2)*ratio) + mrh/2,
        t: [((oPoints[1].x-mw/2)*ratio), ((oPoints[1].y-mh/2)*ratio)]
      },
      {	
        x: ((oPoints[2].x-mw/2)*ratio) + mrw/2,
        y: ((oPoints[2].y-mh/2)*ratio) + mrh/2,
        t: [((oPoints[2].x-mw/2)*ratio), ((oPoints[2].y-mh/2)*ratio)]
      }
    ];

    console.log(points);

    function getResponsivePositions() {
      const vw = window.innerWidth;
    
      if (vw <= 768) {
        return points.map(point => ({
          x: point.x,
          y: point.y,
          scale: scale[0]
        }));
      } else if (vw <= 1024) {
        return points.map(point => ({
          x: point.x,
          y: point.y,
          scale: scale[0]
        }));
      } else {
        return points.map(point => ({
          x: point.x,
          y: point.y,
          scale: scale[0]
        }));
      }
    }

    let mapPositions = getResponsivePositions();

    window.addEventListener('resize', () => {
      mapPositions = getResponsivePositions();
      updateContent(index);
    });

    const updateContent = (step, direction) => {
      const currentPoint = points[step];
      mapImg.style.transformOrigin = `${currentPoint.x}px ${currentPoint.y}px`;
      mapImg.style.transform = `scale(${scale[step]})`;

      if (direction === "down") {
        document.querySelector(`#box-${step}`).classList.add('show');

        if (step > 0) {
          document.querySelector(`#box-${step - 1}`).classList.add('hide');
        }
      }

      if (direction === "up") {
        document.querySelector(`#box-${step}`).classList.remove('hide');

        if (step < totalSteps - 1) {
          document.querySelector(`#box-${step + 1}`).classList.remove('show');
        }
      }

      titleBox.innerHTML = `
        <h3 style="text-align: center; margin: 0; padding: 0;">${locations[step].place}</h3>
      `;
    };

    let prevProgress = 0;

    ScrollTrigger.create({
      trigger: ".map-section",
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      snap: {
        snapTo: [0, 0.5, 1],
        duration: { min: 0.5, max: 1.5 },
        ease: "power1.inOut"
      },
      onUpdate: (self) => {
        const direction = self.progress > prevProgress ? 'down' : 'up';
        console.log('Scroll direction:', direction);
        
        let newIndex = Math.min(Math.floor(self.progress * totalSteps), totalSteps - 1);
        if (newIndex !== index) {
          index = newIndex;
          updateContent(index, direction);
        }
        
        prevProgress = self.progress;
      }
    });

    ScrollTrigger.create({
      trigger: ".map-section",
      start: "top 50%",
      onEnter: () => {
        pauseHero = true;
        document.getElementById('hero').style.visibility = 'hidden';
      },
      onLeaveBack: () => {
        pauseHero = false;
        document.getElementById('hero').style.visibility = 'visible';
      }
    });

    updateContent(0);
  }
});

export {pauseHero};
