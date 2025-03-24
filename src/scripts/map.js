import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import L from 'leaflet'; // Importa Leaflet
import 'leaflet/dist/leaflet.css';  // Importa il CSS di Leaflet
import locations from '../assets/data/location.json'; // Aggiungi le coordinate

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const mapSection = document.querySelector('.map-section');
  if (!mapSection) return;

  const paragraphBox = document.querySelector(".paragraph-box");
  const titleBox = document.querySelector(".title-box");

  // Inizializza la mappa Leaflet
  const map = L.map('map', {
    center: [45.4970, 9.0718],
    zoom: 12,
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false,
    tap: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
  });

  L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>', 
}).addTo(map);

  // Aggiungi un marker per indicare la posizione corrente
  const marker = L.marker([45.4642, 9.1900]).addTo(map); // Partenza con Milano

  let index = 0;
  const totalSteps = locations.length;

  // Funzione per aggiornare contenuto e mappa
  const updateContent = (step, direction) => {
    // Aggiorna la mappa
    const location = locations[step];
    const { lat, lng } = location;
    map.setView([lat, lng], 13);  // Centra la mappa

    // Aggiungi un pan per simulare l'offset nella visualizzazione
    const panOffset = [0, 100]; // Regola questo valore per spostare la mappa più in alto o più in basso
    map.panBy(panOffset);  // Sposta la mappa di un determinato offset

    marker.setLatLng([lat, lng]);

    // Aggiorna title e paragraph
    titleBox.innerHTML = `
      <h3 style="text-align: center; margin: 0; padding: 0;">${locations[step].place}</h3>
    `;

    // Gestisce l'animazione dei box
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
  };

  // Monitoraggio dello scroll con GSAP e ScrollTrigger
  let prevProgress = 0;

  ScrollTrigger.create({
    trigger: ".map-section",
    start: "top top",
    end: "+=200%", // Modifica in base a quanto vuoi che lo scroll influenzi la mappa
    pin: true,
    pinSpacing: true,
    scrub: 1,
    anticipatePin: 1,
    onUpdate: (self) => {
      const direction = self.progress > prevProgress ? 'down' : 'up';
      let newIndex = Math.min(Math.floor(self.progress * totalSteps), totalSteps - 1);
      
      if (newIndex !== index) {
        index = newIndex;
        updateContent(index, direction); // Cambia la posizione della mappa
      }

      prevProgress = self.progress;
    }
  });

  // Imposta la posizione iniziale della mappa
  updateContent(0, 'down');
});