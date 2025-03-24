import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import locations from '../assets/data/location.json';
let pauseHero = false;

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const mapSection = document.querySelector('.map-section');
  if (!mapSection) return;

  let mapElement = document.getElementById("map");
  let paragraphBox = document.querySelector(".paragraph-box");
  let titleBox = document.querySelector(".title-box");
  
  let index = 0;
  const totalSteps = locations.length;
  const mapImg = document.querySelector('#map');
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
      x: 4248,
      y: 2700
    },
    {	
      x: 2965,
      y: 2945
    }
  ];

  // const points =  [
  //   {	
  //     scale: 2,
  //     x: ratio*(oPoints[0].x - mw/2),
  //     y: ratio*(oPoints[0].y - mh/2)
  //   },
  //   {	
  //     scale: 2,
  //     x: ratio*(oPoints[1].x - mw/2),
  //     y: ratio*(oPoints[1].y - mh/2)
  //   },
  //   {	
  //     scale: 2,
  //     x: ratio*(oPoints[2].x - mw/2),
  //     y: ratio*(oPoints[2].y - mh/2)
  //   }
  // ];

  const scale = [4, 4, 4]

// ((X punto - larghezzaOriginale / 2) * rapporto) + mrw/2

  const points =  [
    {	
      x: ((oPoints[0].x-mw/2)*ratio) + mrw/2 + (((oPoints[0].x-mw/2)*ratio) * 1/scale[0]),
      y: ((oPoints[0].y-mh/2)*ratio) + mrh/2 + (((oPoints[0].y-mh/2)*ratio) * 1/scale[0]),
      t: [ (1/scale[0] * (((oPoints[0].x-mw/2)*ratio))) , 1/scale[0] * (((oPoints[0].y-mh/2)*ratio))] //
    },
    {	
      scale: 2,
      x: ((oPoints[1].x-mw/2)*ratio) + mrw/2 + (((oPoints[1].x-mw/2)*ratio) * 1/scale[1]),
      y: ((oPoints[1].y-mh/2)*ratio) + mrh/2 + (((oPoints[1].y-mh/2)*ratio) * 1/scale[1]),
      t: [ (1/scale[1] * (((oPoints[1].x-mw/2)*ratio))) , 1/scale[1] * (((oPoints[1].y-mh/2)*ratio))] 
    },
    {	
      x: ((oPoints[2].x-mw/2)*ratio) + mrw/2 + (((oPoints[2].x-mw/2)*ratio) * 1/scale[2]),
      y: ((oPoints[2].y-mh/2)*ratio) + mrh/2 + (((oPoints[2].y-mh/2)*ratio) * 1/scale[2]),
      t: [ (1/scale[2] * (((oPoints[2].x-mw/2)*ratio))) , 1/scale[2] * (((oPoints[2].y-mh/2)*ratio))] 

    }
  ];

  console.log(points);

 

  function getResponsivePositions() {
    const vw = window.innerWidth;
 
    console.log("mrw "+mrw);
    console.log("mrh "+mrh);
  
    if (vw <= 768) {
      return [
        { scale: points[0].scale, x: points[0].x/points[0].scale, y: points[0].y/points[0].scale },
        { scale: points[1].scale, x: points[1].x/points[1].scale, y: points[1].y/points[1].scale },
        { scale: points[2].scale, x: points[2].x/points[2].scale, y: points[2].y/points[2].scale },
      ];
    } else if (vw <= 1024) {
      return [
        { scale: 1.3, x: 40, y: -250 },
        { scale: 1.3, x: 120, y: -130 },
        { scale: 1.3, x: 400, y: 15 }
      ];
    } else {
      return [
        { scale: 1.5, x: 70, y: -240 },
        { scale: 1.5, x: 180, y: -100 },
        { scale: 1.5, x: 670, y: 20 }
      ];
    }
  }

  let mapPositions = getResponsivePositions();

  window.addEventListener('resize', () => {
    mapPositions = getResponsivePositions();
    updateContent(index);
  });

  const updateContent = (step, direction) => {
    mapImg.style.transformOrigin = `${points[step].x}px ${points[step].y}px`;
    console.log(scale[step]);
    mapImg.style.scale = scale[step];
    // mapImg.style.translate = `${points[step].t[0]}px ${points[step].t[1]}px`;


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

    // gsap.to(mapElement, {
    //   // x: mapPositions[step].x,
    //   // y: mapPositions[step].y,
    //   x: 0,
    //   y: 0,
    //   // scale: mapPositions[step].scale,
    //   // scale:10,
    //   duration: 1,
    //   ease: 'power2.inOut'
    // });
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
});

export {pauseHero};
