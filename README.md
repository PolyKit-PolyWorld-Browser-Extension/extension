# PolyKit

A Chrome + Firefox extension that rethemes all of [polyworld.games](https://polyworld.games/). Click the PolyKit icon in your browser toolbar to open the customization panel; changes apply to open PolyWorld tabs instantly.

PolyKit is an unofficial, independent project and is not affiliated with or endorsed by PolyWorld.

## What you can change

- 10 ready-made themes: PolyWorld, Midnight, Sunset, Ocean, Lavender, Cherry, Mint, Gold, Mono and Cyberpunk.
- Light, dark, match-the-site, or follow your system appearance.
- Accent, background, panel and text colors.
- Font family, text size and corner radius.
- Compact navigation and reduced seasonal effects.
- Custom CSS for anything else, injected only on PolyWorld pages.

PolyKit works on `polyworld.games` and its subdomains.

## Install in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Pin PolyKit from the extensions menu so the toolbar button is always visible.

## Install in Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json` in this folder.

Temporary add-ons are removed when Firefox restarts. For a permanent install, build/sign the extension with Firefox's `web-ext` tooling or submit it to AMO.

## Use it

1. Go to https://polyworld.games/.
2. Click the PolyKit icon at the top of your browser.
3. Pick a theme, tweak the colors, and watch the site update live.

"Match site" lets PolyWorld's own theme toggle keep working. Choosing Light, Dark or Auto makes PolyKit control the site appearance instead. Settings are saved in the browser and restored when you return.

## Files

- `manifest.json` — Manifest V3, shared by Chrome and Firefox.
- `icons/` — Toolbar and store icons generated from `Logos/59.png`.
- `content/` — Theme injector running on PolyWorld pages.
- `shared/` — Presets, color utilities and CSS generation.
- `popup/` — The panel you see when you click the toolbar icon.

## Notes

- No background service worker, remote code, analytics or network requests: the extension only reads/writes its own settings and injects styles into PolyWorld pages.
- Permissions are limited to `storage` and access to `polyworld.games`; there is no `tabs` or `activeTab` permission. Open PolyWorld tabs pick up changes through storage events.
- Custom CSS is local user input and can override any PolyKit setting. Use the **Reset** button in the popup to start over.
- Store-ready listing copy and permission justifications are in `STORE_LISTING.md`.
