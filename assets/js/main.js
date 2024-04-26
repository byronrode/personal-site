const highlightCode = require('./lib/highlighter');
const trackLinks = require('./lib/tracker');
const mouseTrackingGlow = require('./lib/ui');

// Handle code highlighting
highlightCode();

// Handle Mixpanel event tracking
const currentURL = window.location.href;
if (!currentURL.includes('localhost')) {
  trackLinks();
}

// Handle Mobile Navigation
const navMenu = document.querySelector('.nav-menu-button');
const closeNavMenu = document.querySelector('.close-nav-menu');
if (navMenu) {
  const mainNav = document.querySelector('.main-navigation-mobile');
  navMenu.addEventListener('click', (ev) => {
    if(mainNav){
      mainNav.classList.toggle('hidden');
    }
    if(closeNavMenu){
      closeNavMenu.addEventListener('click', (ev) => {
        mainNav.classList.toggle('hidden');
      })
    }

  })
}

// Handle mouse tracking glow effect
mouseTrackingGlow();

