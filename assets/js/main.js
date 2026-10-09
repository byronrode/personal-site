const highlightCode = require('./lib/highlighter');
const {startAnalytics} = require('./lib/analytics');
const analyticsBuild = require('./lib/analytics-build');
const mouseTrackingGlow = require('./lib/ui');

// Handle code highlighting
highlightCode();

startAnalytics({clientId: document.querySelector('meta[name=personal-analytics-client]')?.content,
  environment: document.querySelector('meta[name=personal-analytics-environment]')?.content, buildId: analyticsBuild});

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

