
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import locations from '../assets/data/location.json';

gsap.registerPlugin(ScrollTrigger);
let mapElement = document.getElementById("map");

document.addEventListener("DOMContentLoaded", () => {
//   const locations = JSON.parse(`` + JSON.stringify(Astro.props.locations) + ``); // Passiamo i dati in modo sicuro

  let mapElement = document.getElementById("map");
  let paragraphBox = document.querySelector(".paragraph-box");
  let titleBox = document.querySelector(".title-box");
console.log(mapElement);
  let index = 0;
  const totalSteps = locations.length;

  const updateContent = (step) => {
    console.log(step);
    paragraphBox.innerHTML = `
      <h3>${locations[step].title}</h3>
      <h4>${locations[step].place}</h4>
      <h6>${locations[step].description}</h6>
    `;
    titleBox.innerHTML = `
      <h3 style="text-align: center; margin: 0;">${locations[step].place}</h3>
      <h4 style="text-align: center; margin: 10px 0 0 0;">${locations[step].title}</h4>
    `;
    gsap.to(mapElement, { x: step * -100, duration: 1, ease: 'power2.out' });
  };

  ScrollTrigger.create({
    trigger: ".map-section",
    start: "top top",
    end: "+=300%",
    pin: true,
    scrub: true,
    onUpdate: (self) => {
      let newIndex = Math.min(Math.floor(self.progress * totalSteps), totalSteps - 1);
      if (newIndex !== index) {
        index = newIndex;
        updateContent(index);
      }
    }
  });
});