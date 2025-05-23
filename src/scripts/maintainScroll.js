let savedScrollY = 0;

// Salva la posizione di scroll prima della transizione
document.addEventListener("astro:before-page-load", () => {
  savedScrollY = window.scrollY;
});

// Dopo che la pagina è caricata, ripristina la posizione di scroll
document.addEventListener("astro:after-page-load", () => {
  window.scrollTo({ top: savedScrollY, behavior: 'smooth' });
});

// Disabilita lo scroll automatico del browser durante la navigazione tra le pagine
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
