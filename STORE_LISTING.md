# PolyKit store submission notes

PolyKit is an **unofficial** theme extension for `polyworld.games`. Keep that wording in both stores so the listing is not mistaken for an official PolyWorld product.

No submission can be guaranteed to be approved, but this package follows the review-friendly setup: minimum permissions, no remote code, no background worker, and a single restricted content script.

## Manifest at a glance

- Version: `1.0.0`
- Name: `PolyKit`
- Firefox ID: `polykit@polyworld.games` (do not change after the first AMO release)
- Firefox minimum version: `140.0` (needed for the data-collection declaration)
- Firefox data collection: `browser_specific_settings.gecko.data_collection_permissions.required = ["none"]`
- Permissions: `storage` only
- Host access: `polyworld.games` and its subdomains, via `content_scripts.matches`
- Popup: `action.default_popup` → `popup/popup.html`
- No `activeTab`, `tabs`, `homepage_url`, background script, external requests or `eval`

## Name and summary

Name:

```text
PolyKit — PolyWorld Theme Customizer
```

Firefox summary / Chrome short description (under both stores' limits):

```text
Unofficial PolyWorld theme tool. Click the toolbar icon to change colors, presets, fonts and layout on polyworld.games.
```

## Full description (paste into both stores)

```text
PolyKit lets you retheme polyworld.games from a button in your browser toolbar. Pick one of ten ready-made themes, then adjust accent, background, panel and text colors, fonts, text size, corner radius, compact navigation and seasonal effects. An optional custom CSS box is available for advanced tweaks.

PolyKit is an unofficial, independent project and is not affiliated with or endorsed by PolyWorld.

Changes are saved in your browser and applied to open PolyWorld tabs immediately. PolyKit has no background process, sends no data anywhere, and does not collect analytics.

Permissions:
- Storage: saves your theme settings locally.
- Access to polyworld.games: injects the theme styles only on that site.

To use it, open polyworld.games and click the PolyKit toolbar icon. Choose "Match site" to keep PolyWorld's own light/dark toggle, or choose Light, Dark or Auto to let PolyKit control it.
```

## Permission justifications

| Permission | Why it is needed |
| --- | --- |
| `storage` | Persist the selected preset, colors, fonts and layout options in the browser. |
| `*://polyworld.games/*`, `*://*.polyworld.games/*` | Inject and update the theme CSS on the site the extension is meant to restyle. Nothing runs on other sites. |

There is intentionally no `tabs` or `activeTab` permission. The popup writes settings to storage; the content script already listens for storage changes and updates open tabs.

## Privacy / data declarations

- Data collection: **None** (`required: ["none"]` in the Firefox manifest)
- Data transmission: **None**
- Remote code: **No**
- Analytics or telemetry: **No**
- Custom CSS: entered by the user, stored locally, and injected only into PolyWorld pages as CSS. It is not JavaScript and is not fetched from a remote source.
- Source code: available as plain, readable JavaScript in the submitted package; answer AMO's "minified/obfuscated source" question **No**.
- License: MIT (`LICENSE`).

## Screenshots

- Chrome Web Store: at least one 1280×800 or 640×400 PNG showing the popup open over a themed PolyWorld page.
- Firefox AMO: at least one screenshot; 1280×720 PNG is a safe choice. Show the toolbar popup and the themed site in the same image if possible.

Do not include browser chrome that hides the extension icon; reviewers need to see that customization starts from the toolbar button.

## Build

```bash
npx web-ext build --source-dir . --artifacts-dir web-ext-artifacts --overwrite-dest
```

Upload `web-ext-artifacts/polykit-1.0.0.zip`.

## Submit

1. Firefox AMO: https://addons.mozilla.org/developers/addon/submit/ — choose "Submit a new add-on", upload the ZIP, then complete listing, category, license and privacy answers above.
2. Chrome Web Store: https://chrome.google.com/webstore/devconsole — upload the same ZIP, paste the listing text, attach screenshots, and answer the permission and data-use prompts using the declarations above.

Keep the Firefox ID stable for future updates. Chrome updates are keyed by the Web Store item, not by the gecko ID.
