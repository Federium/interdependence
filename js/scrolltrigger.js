
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)


  gsap.from(".left-sidebar", {
    x: -100,
    opacity: 1,
    duration: 0.5,
    scrollTrigger: {
      trigger: ".text-section",
      start: "left 50%",
      toggleActions: "restart none none reverse",
      markers: true,
    },
  }); 

  gsap.from(".right-sidebar", {
    x: 100,
    opacity: 1,
    duration: 0.5,
    scrollTrigger: {
      trigger: ".text-section",
      start: "left 50%",
      toggleActions: "restart none none reverse",
      markers: true,
    },
  }); 





});