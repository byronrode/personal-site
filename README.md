# Personal Theme

Version 2.0

This is based off of Tailwind UI's [Spotlight](https://tailwindui.com/templates/spotlight) theme, 
with some custom tweaking and a few other changes.

Requires: Yarn 4+, Node 20+, Tailwind

### Copyright & License

Copyright (c) 2024 Byron Rode
Copyright (c) 2013-2024 Ghost Foundation - Released under the [MIT license](LICENSE).

## Owned analytics

The theme uses the official OpenPanel SDK with explicit anonymous page and link events. Theme settings default analytics to disabled; the production environment and a dedicated personal-site public write client must both be set during an authorized Ghost theme deployment. The project must be separated from Ignis and Rodehouse projects. No read secret belongs in the theme.

Build with the existing Gulp pipeline; it embeds the exact Git SHA (or IGNIS_SOURCE_SHA for an exported checkout). Preview/local hosts remain disabled. Automatic capture, replay, query strings, link text, contact values and referrers are excluded. Do Not Track is respected. Run yarn test:analytics and yarn test:ci before packaging with yarn zip. Historical Mixpanel data and its subscription are retained; this source change does not configure or deploy Ghost.
