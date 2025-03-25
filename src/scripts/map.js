import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import locations from '../assets/data/location.json';
let pauseHero = false;
let mapScrollTrigger;
let heroScrollTrigger;

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  let index = 0;

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
    const totalSteps = locations.length;
    const mw = mapImg.naturalWidth;  // image width
    const mh = mapImg.naturalHeight; // image height
    const mrw = mapImg.width;  // actual image width
    const mrh = mapImg.height; // actual image height
    const ratio = mrw/mw;
    mapSection.style.transform = `translate(0,0)`;
    console.log(ratio);
    const oPoints = [
      {	
        x: 2800,
        y: 1522
      },
      {	
        x: 2735,
        y: 1100
      },
      {	
        x: 1724,
        y: 808
      }
    ];

    const scale = [2, 2, 2];

    const points = [
      {	
        x: mrw/2 - oPoints[0].x*ratio,
        y: mrh/2 - oPoints[0].y*ratio,
        // t: [(mrw/2 - oPoints[0].x*ratio), ]
      },
      {	
        x: mrw/2 - oPoints[1].x*ratio,
        y: mrh/2 - oPoints[1].y*ratio,
        // t: [(mrw/2 - oPoints[1].x*ratio), mrh/2 - oPoints[1].y*ratio]
      },
      {	
        x: mrw/2 - oPoints[2].x*ratio,
        y: mrh/2 - oPoints[2].y*ratio
        // t: [(mrw/2 - oPoints[2].x*ratio), mrh/2 - oPoints[2].y*ratio]
      }
    ];


    function getResponsivePositions() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (vw <= 768) {
        return 0.27*vh;
        }
      else return 0.2*vh
      // } else if (vw <= 1024) {
      //   return points.map(point => ({
      //     x: point.x,
      //     y: point.y,
      //     scale: scale[0]
      //   }));
      // } else {
      //   return points.map(point => ({
      //     x: point.x,
      //     y: point.y,
      //     scale: scale[0]
      //   }));
      // }
    }

    let mapPositions = getResponsivePositions();



    const updateContent = (step, direction) => {
      const currentPoint = points[step];
      console.log(mapImg);
      mapImg.style.transformOrigin = `${mrw/2 - currentPoint.x}px ${mrh/2 - currentPoint.y}px`;
      mapImg.style.transform = `translate(${points[step].x}px, ${points[step].y-getResponsivePositions()}px) scale(${scale[step]}) `;

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

   mapScrollTrigger = ScrollTrigger.create({
      trigger: ".map-section",
      start: "top top",
      end: '+=200%',
      invalidateOnRefresh: true,
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

   heroScrollTrigger = ScrollTrigger.create({
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
    document.getElementById('hero').style.visibility = 'visible';

    updateContent(0,"down");
  }
});

window.addEventListener('resize', () => {
  // ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Rimuove tutti i trigger esistenti
  if (heroScrollTrigger) heroScrollTrigger.kill();
  if (mapScrollTrigger) heroScrollTrigger.kill();

  initializeMap(); // Reinizializza la mappa
  updateContent(index, "down"); // Assicura che i contenuti si aggiornino correttamente    
  
});

export {pauseHero};
