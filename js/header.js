class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <!-- HEADER DESKTOP-->
      <div class="header_desktop">
        <div class="sidebar left-sidebar">
          <div class="button left-button" style="text-align: right;">
            <a href="salonesatellite.html">Salone Satellite</a>
          </div>
          <div class="button" style="text-align: center;">
            <a href="designxdesigners.html">Design x Designers</a>
          </div>
          <div class="button" style="text-align: left;">
            <a href="fabbricadelvapore.html">Fabbrica del Vapore</a>
          </div>
        </div>
        <div class="sidebar right-sidebar">
          <div class="button right-button">
            <a href="index.html">Interdependence</a>
          </div>
        </div>
      </div>

      <!-- HEADER MOBILE -->
      <header class="header_mobile">
        <div class="header__content">
          <a class="header__logo" href="#">interdependence</a>
          <ul class="header__menu">
            <li><a href="#">Salone Satellite</a></li>
            <li><a href="#">Design x Designers</a></li>
            <li><a href="#">Fabbrica del Vapore</a></li>
          </ul>
          <div class="icon-hamburger">
            <span></span>
            <span></span>
          </div>
        </div>
      </header>
    `;

    // Aggiungi l'event listener per il menu hamburger
    const hamburger = this.querySelector('.icon-hamburger');
    hamburger.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
    });
  }
}

customElements.define('header-component', Header);