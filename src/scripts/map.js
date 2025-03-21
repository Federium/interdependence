import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import locations from '../assets/data/location.json';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  let mapElement = document.getElementById("map");
  let paragraphBox = document.querySelector(".paragraph-box");
  let titleBox = document.querySelector(".title-box");
  
  let index = 0;
  const totalSteps = locations.length;

  // Define precise positions for each step
  const mapPositions = [
    { scale: 1.5, x: 70, y: -240 },          // Initial position
    { scale: 1.5, x: 670, y: 20 },  // First location
    { scale: 1.5, x: 180, y: -100 }       // Second location
  ];

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

  // Initialize first position
  updateContent(0);
});