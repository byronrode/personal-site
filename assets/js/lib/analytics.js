const {OpenPanel} = require('@openpanel/web');

function createAnalytics(config, hostname, factory = options => new OpenPanel(options)) {
  if (!config || config.environment !== 'production' || !/^(www\.)?byronrode\.(com|co\.za)$/.test(hostname) || !config.clientId || !/^[a-f0-9]{40}$/i.test(config.buildId || '')) return null;
  const client = factory({apiUrl: 'https://analytics.services.ignislabs.io/api', clientId: config.clientId,
    trackScreenViews: false, trackOutgoingLinks: false, trackAttributes: false, trackHashChanges: false,
    sessionReplay: {enabled: false}, filter: event => {
      if (event.type !== 'track') return false;
      for (const key of Object.keys(event.payload.properties || {})) {
        if (key.startsWith('__') && key !== '__timestamp' && key !== '__deviceId') delete event.payload.properties[key];
      }
      return event.payload.properties.environment === 'production';
    }});
  return {track(event, properties, identity) {
    const occurredAt = new Date().toISOString();
    const safe = {};
    for (const key of ['path', 'target_host', 'target_path', 'link_kind']) {
      const value = properties[key];
      if (typeof value === 'string' && value.length <= 300 && !/[?@#]/.test(value) && !/\d{8,}/.test(value)) safe[key] = value;
    }
    try { Promise.resolve(client.track(event, {...safe, event_id: crypto.randomUUID(), occurred_at: occurredAt,
      __timestamp: occurredAt, __deviceId: identity.installationId, profileId: identity.installationId,
      session_id: identity.sessionId, environment: 'production', product: 'personal', surface: 'personal_site',
      site_domain: hostname, platform: 'web', app_build: config.buildId, schema_version: 1})).catch(() => {}); } catch { /* Analytics cannot interrupt navigation. */ }
  }};
}

function storedId(storage, key) {
  try { const existing = storage.getItem(key); if (existing && /^[a-f0-9-]{36}$/i.test(existing)) return existing;
    const id = crypto.randomUUID(); storage.setItem(key, id); return id;
  } catch { return crypto.randomUUID(); }
}

function startAnalytics(config, browser = window) {
  const analytics = createAnalytics(config, browser.location.hostname);
  if (!analytics || browser.navigator.doNotTrack === '1') return;
  let identity;
  try { identity = {installationId: storedId(browser.localStorage, 'personal.analytics.installation.v1'),
    sessionId: storedId(browser.sessionStorage, 'personal.analytics.session.v1')}; }
  catch { identity = {installationId: crypto.randomUUID(), sessionId: crypto.randomUUID()}; }
  analytics.track('page_viewed', {path: browser.location.pathname}, identity);
  browser.document.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    try { const target = new URL(link.href, browser.location.origin);
      const http = ['http:', 'https:'].includes(target.protocol);
      analytics.track('Click', {link_kind: http ? 'web' : target.protocol.replace(':', ''),
        ...(http ? {target_host: target.hostname, target_path: target.pathname} : {})}, identity);
    } catch { /* Ignore malformed links. */ }
  }));
}
module.exports = {createAnalytics, startAnalytics};
