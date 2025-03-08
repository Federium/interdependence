// use a script tag or an external JS file
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(Observer)
  
  Observer.create({
    target: window,
    type: "wheel,touch,pointer",
    onDown: () => !animating && gotoSection(currentSection + 1, 1),
    onUp: () => !animating && gotoSection(currentSection - 1, -1),
    tolerance: 10
  });
  
  let sections = document.querySelectorAll("section"),
      currentSection = 0,
      animating = false;
  
  // Imposta l'altezza di ogni sezione al 100% del viewport
  gsap.set("section", {
    height: "100vh"
  });
  
  function gotoSection(index, direction) {
    // Limita l'indice al numero di sezioni
    index = Math.min(Math.max(index, 0), sections.length - 1);
    
    if (currentSection !== index) {
      animating = true;
      let fromTop = direction === -1,
          dFactor = fromTop ? -1 : 1,
          tl = gsap.timeline({
            defaults: {duration: 1.25, ease: "power1.inOut"},
            onComplete: () => animating = false
          });
      
      tl.to(window, {
        scrollTo: {y: sections[index], autoKill: false},
        duration: 1
      });
      
      currentSection = index;
    }
  }
  
  // Imposta la prima sezione come attiva all'avvio
  gsap.set(window, {scrollTo: 0});

 });



