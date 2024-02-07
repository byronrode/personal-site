const highlightCode = require('./lib/highlighter');
const trackLinks = require('./lib/tracker');

// Handle code highlighting
highlightCode();

// Handle Mixpanel event tracking
trackLinks();
