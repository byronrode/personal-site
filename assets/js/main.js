const highlightCode = require('./lib/highlighter');
const trackLinks = require('./lib/tracker');

// Handle code highlighting
highlightCode();

// Handle Mixpanel event tracking
const currentURL = window.location.href;
if (!currentURL.includes('localhost')) {
  trackLinks();
}
