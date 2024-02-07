const hljs = require('highlight.js/lib/core');
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));

const highlightCode = () => {
  document.querySelectorAll('pre')
    .forEach(el => {
      hljs.highlightElement(el);
    });
};

module.exports = highlightCode;
