const trackLink = () => {
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (ev) => {
      mixpanel.track('Click', {
        'Link': ev.currentTarget.href,
        'Title': ev.currentTarget.innerText || ev.currentTarget.textContent,
      })
    })
  })
}

module.exports = trackLink;
