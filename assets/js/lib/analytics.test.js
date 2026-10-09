const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createAnalytics} = require('./analytics');
const config = {environment: 'production', clientId: 'public-client', buildId: 'a'.repeat(40)};
test('previews and unconfigured builds remain disabled', () => {
  for (const [input, host] of [[{}, 'byronrode.com'], [config, 'localhost'], [{...config, buildId: ''}, 'byronrode.com'], [{...config, environment: 'staging'}, 'byronrode.com']]) assert.equal(createAnalytics(input, host), null);
});
test('events preserve identity and discard query, contact and SDK URL properties', async () => {
  let options; let payload;
  const client = createAnalytics(config, 'byronrode.com', value => {options = value; return {track: async (_, properties) => {payload = properties;}};});
  client.track('Click', {target_path: '/?token=private', target_host: 'example.com', email: 'private@example.com', title: 'Private'}, {installationId: 'installation', sessionId: 'session'});
  assert.equal(payload.target_path, undefined); assert.equal(payload.email, undefined); assert.equal(payload.title, undefined);
  assert.equal(payload.__deviceId, 'installation'); assert.equal(payload.app_build, config.buildId);
  assert.equal(options.trackScreenViews, false); assert.equal(options.sessionReplay.enabled, false);
  const event = {type: 'track', payload: {properties: {...payload, __url: 'private', __referrer: 'private'}}};
  assert.equal(options.filter(event), true); assert.equal(event.payload.properties.__url, undefined);
});
