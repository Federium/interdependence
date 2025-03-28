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
  const titleBox = document.querySelectorAll(".title-box");
  const pointerBlur = document.querySelector(".pointer-blur");

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

    const scale = [1.3, 1.3, 1.3];

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



    // const updateContent = (step, direction) => {
    //   const currentPoint = points[step];
    //   console.log(mapImg);
    //   // mapImg.style.transformOrigin = `${mrw/2 - currentPoint.x}px ${mrh/2 - currentPoint.y}px`;
    //   // mapImg.style.transform = `translate(${points[step].x}px, ${points[step].y-getResponsivePositions()}px) scale(${scale[step]}) `;
    //   mapImg.style.transform = `scale(${scale[step]}) `;
    //   titleBox[0].style.transform = `translate(${-points[0].x * scale[0]}px, ${(-points[0].y-getResponsivePositions())* scale[0]}px)`;
    //   titleBox[1].style.transform = `translate(${-points[1].x * scale[1]}px, ${(-points[1].y-getResponsivePositions())* scale[1]}px)`;
    //   titleBox[2].style.transform = `translate(${-points[2].x * scale[2]}px, ${(-points[2].y-getResponsivePositions())* scale[2]}px)`;

    //   pointerBlur.style.transform = `translate(${-points[step].x * scale[step]}px, ${(-points[step].y-getResponsivePositions())*scale[step]}px)`;

    //   if (direction === "down") {
    //     document.querySelector(`#box-${step}`).classList.add('show');

    //     if (step > 0) {
    //       document.querySelector(`#box-${step - 1}`).classList.add('hide');
    //     }
    //     // if (step ==0) {
    //     //   pauseHero = true;
    //     //    document.getElementById('hero').style.visibility = 'hidden';
    //     // }
    //   }

    //   if (direction === "up") {
    //     document.querySelector(`#box-${step}`).classList.remove('hide');

    //     if (step == 0 ) {
    //               pauseHero = false;
    //     document.getElementById('hero').style.visibility = 'visible';
    //     }

    //     if (step < totalSteps - 1) {
    //       document.querySelector(`#box-${step + 1}`).classList.remove('show');
    //     }
    //   }

    //   titleBox.innerHTML = `
    //     <div><h3 style="text-align: center; margin: 0; padding: 0;">${locations[step].place}</h3></div>
    //   `;
    // };
    const updateContent = (step) => {
      const currentPoint = points[step];
      console.log(mapImg);
      
      mapImg.style.transform = `scale(${scale[step]})`;
      
      titleBox[0].style.transform = `translate(${-points[0].x * scale[0]}px, ${(-points[0].y - getResponsivePositions()) * scale[0]}px)`;
      titleBox[1].style.transform = `translate(${-points[1].x * scale[1]}px, ${(-points[1].y - getResponsivePositions()) * scale[1]}px)`;
      titleBox[2].style.transform = `translate(${-points[2].x * scale[2]}px, ${(-points[2].y - getResponsivePositions()) * scale[2]}px)`;
  
      pointerBlur.style.transform = `translate(${-points[step].x * scale[step]}px, ${(-points[step].y - getResponsivePositions()) * scale[step]}px)`;
      
      document.querySelectorAll('[id^="box-"]').forEach((box, index) => {
          if (index === step) {
              box.classList.add('show');
              box.classList.remove('hide-desktop');
          } else {
              box.classList.add('hide-desktop');
              
          }
      });
      
      titleBox.innerHTML = `
          <div><h3 style="text-align: center; margin: 0; padding: 0;">${locations[step].place}</h3></div>
      `;
  };

    let prevProgress = 0;

   

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

    let elementsArray = document.querySelectorAll(".title-box");
  console.log("ciao")

  elementsArray.forEach(function(div,index) {
      div.addEventListener("mouseenter", function() {
          updateContent(index);
      });
  });
  }


  
  
  
});
export {pauseHero};

window.addEventListener('resize', () => {
  if (heroScrollTrigger) heroScrollTrigger.kill();
  if (mapScrollTrigger) mapScrollTrigger.kill();

  initializeMap(); 
  

  setTimeout(() => {
    ScrollTrigger.refresh(); 
  }, 100); // Lascia il tempo ai nuovi elementi di aggiornarsi
});
