import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import locations from '../assets/data/location.json';
let pauseHero = false;

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  let mapElement = document.getElementById("map");
  let paragraphBox = document.querySelector(".paragraph-box");
  let titleBox = document.querySelector(".title-box");
  
  let index = 0;
  const totalSteps = locations.length;

  function getResponsivePositions() {
    // Get viewport width
    const vw = window.innerWidth;
    
    if (vw <= 768) { // Mobile
      return [
        { scale: 2.5, x: 20, y: -300 },
        { scale: 2.5, x: 80, y: -130 },
        { scale: 2.5, x: 380, y: -50 }
      ];
    } else if (vw <= 1024) { // Tablet
      return [
        { scale: 1.3, x: 40, y: -250 },
        { scale: 1.3, x: 120, y: -130 },
        { scale: 1.3, x: 400, y: 15 }
      ];
    } else { // Desktop
      return [
        { scale: 1.5, x: 70, y: -240 },
        { scale: 1.5, x: 180, y: -100 },
        { scale: 1.5, x: 670, y: 20 }
      ];
    }
  }

  // Replace the static mapPositions with the dynamic function
  let mapPositions = getResponsivePositions();

  // Add window resize listener to update positions
  window.addEventListener('resize', () => {
    mapPositions = getResponsivePositions();
    // Update current position immediately
    updateContent(index);
  });

  const updateContent = (step, direction) => {
    // console.log(step);
    // document.querySelector('.paragraph-box').classList.add('show');
    // document.getElementById('location-title').textContent = locations[step].title;
    // document.getElementById('location-description').textContent = locations[step].description;
    // const mapButton = document.getElementById('map-button');
    // mapButton.href = locations[step].innerLink;
    
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

    // Animate to precise position
    gsap.to(mapElement, {
      x: mapPositions[step].x,
      y: mapPositions[step].y,
      scale: mapPositions[step].scale,
      duration: 1,
      ease: 'power2.inOut'
    });
  };

  let prevProgress = 0; // Add this variable to track previous progress

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
      // Determine scroll direction
      const direction = self.progress > prevProgress ? 'down' : 'up';
      console.log('Scroll direction:', direction);
      
      let newIndex = Math.min(Math.floor(self.progress * totalSteps), totalSteps - 1);
      if (newIndex !== index) {
        index = newIndex;
        updateContent(index,direction);
      }
      
      prevProgress = self.progress; // Update previous progress
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


  // Initialize first position
  updateContent(0);
});

export {pauseHero};
