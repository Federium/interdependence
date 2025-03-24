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

  function getResponsivePositions() {
    const vw = window.innerWidth;
    
    if (vw <= 768) {
      return [
        { scale: 2.5, x: 20, y: -300 },
        { scale: 2.5, x: 80, y: -130 },
        { scale: 2.5, x: 380, y: -50 }
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

    gsap.to(mapElement, {
      x: mapPositions[step].x,
      y: mapPositions[step].y,
      scale: mapPositions[step].scale,
      duration: 1,
      ease: 'power2.inOut'
    });
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
