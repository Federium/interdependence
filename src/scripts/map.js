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
    { scale: 1, x: 70, y: -240 },          // Initial position
    { scale: 1, x: 670, y: 20 },  // First location
    { scale: 1, x: 180, y: -100 }       // Second location
  ];

  const updateContent = (step) => {
    console.log(step);
    paragraphBox.innerHTML = `
      <h3>${locations[step].title}</h3>
      <h4>${locations[step].place}</h4>
      <h6>${locations[step].description}</h6>
    `;
    titleBox.innerHTML = `
      <h3 style="text-align: center; margin: 0;">${locations[step].place}</h3>
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

  ScrollTrigger.create({
    trigger: ".map-section",
    start: "top top",
    end: "+=200%",
    pin: true,
    pinSpacing: true,
    scrub: 1,
    anticipatePin: 1,
    snap: {
      snapTo: [0, 0.5, 1], // Snap points for each position
      duration: { min: 0.2, max: 0.8 },
      ease: "power1.inOut"
    },
    onUpdate: (self) => {
      let newIndex = Math.min(Math.floor(self.progress * totalSteps), totalSteps - 1);
      if (newIndex !== index) {
        index = newIndex;
        updateContent(index);
      }
    }
  });

  // Initialize first position
  updateContent(0);
});