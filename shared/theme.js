(function (root) {
  'use strict';

  var PolyKit = (root.PolyKit = root.PolyKit || {});
  var HEX = /^([0-9a-f]{3}|[0-9a-f]{6})$/i;

  function isValidHex(value) {
    if (value === undefined || value === null) return false;
    return HEX.test(String(value).trim().replace(/^#/, ''));
  }

  function normalizeHex(value, fallback) {
    if (value === undefined || value === null || value === '') return fallback;
    var s = String(value).trim().replace(/^#/, '');
    if (!HEX.test(s)) return fallback;
    if (s.length === 3) {
      s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
    }
    return '#' + s.toLowerCase();
  }

  function hexToRgb(hex) {
    var s = normalizeHex(hex, '#000000').slice(1);
    return {
      r: parseInt(s.slice(0, 2), 16),
      g: parseInt(s.slice(2, 4), 16),
      b: parseInt(s.slice(4, 6), 16)
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function rgbToHex(r, g, b) {
    function part(v) {
      var n = clamp(Math.round(v), 0, 255).toString(16);
      return n.length === 1 ? '0' + n : n;
    }
    return '#' + part(r) + part(g) + part(b);
  }

  function mix(a, b, amount) {
    var t = clamp(amount, 0, 1);
    var x = hexToRgb(a);
    var y = hexToRgb(b);
    return rgbToHex(
      x.r + (y.r - x.r) * t,
      x.g + (y.g - x.g) * t,
      x.b + (y.b - x.b) * t
    );
  }

  function lighten(hex, amount) {
    return mix(hex, '#ffffff', amount);
  }

  function darken(hex, amount) {
    return mix(hex, '#000000', amount);
  }

  function rgba(hex, alpha) {
    var c = hexToRgb(hex);
    return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + alpha + ')';
  }

  function luminance(hex) {
    var c = hexToRgb(hex);
    function channel(v) {
      var n = v / 255;
      return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
  }

  function contrastText(hex) {
    return luminance(hex) > 0.38 ? '#151812' : '#ffffff';
  }

  function clampNumber(value, min, max, fallback) {
    var n = Number(value);
    if (!isFinite(n)) return fallback;
    return clamp(n, min, max);
  }

  function normalizeSettings(input) {
    var defaults = PolyKit.DEFAULT_SETTINGS;
    var raw = input && typeof input === 'object' ? input : {};
    var rawColors = raw.colors && typeof raw.colors === 'object' ? raw.colors : {};
    var modes = ['light', 'dark', 'system', 'site'];
    var fonts = PolyKit.FONTS.map(function (font) { return font.id; });

    var colors = {};
    ['accent', 'background', 'panel', 'text'].forEach(function (key) {
      colors[key] = isValidHex(rawColors[key]) ? normalizeHex(rawColors[key], '') : '';
    });

    return {
      enabled: typeof raw.enabled === 'boolean' ? raw.enabled : defaults.enabled,
      mode: modes.indexOf(raw.mode) > -1 ? raw.mode : defaults.mode,
      preset: PolyKit.getPreset(raw.preset).id,
      colors: colors,
      radius: clampNumber(raw.radius, 0, 24, defaults.radius),
      font: fonts.indexOf(raw.font) > -1 ? raw.font : defaults.font,
      fontScale: clampNumber(raw.fontScale, 0.8, 1.3, defaults.fontScale),
      compact: typeof raw.compact === 'boolean' ? raw.compact : defaults.compact,
      reduceEffects: typeof raw.reduceEffects === 'boolean' ? raw.reduceEffects : defaults.reduceEffects,
      customCSS: typeof raw.customCSS === 'string' ? raw.customCSS.slice(0, 20000) : ''
    };
  }

  function cloneDefaults() {
    return normalizeSettings(PolyKit.DEFAULT_SETTINGS);
  }

  function resolveTheme(settings, mode) {
    var normalized = normalizeSettings(settings);
    var preset = PolyKit.getPreset(normalized.preset);
    var base = preset[mode] || preset.light;
    var dark = mode === 'dark';
    var colors = normalized.colors;

    var accent = colors.accent ? normalizeHex(colors.accent, base.accent) : base.accent;
    var background = colors.background ? normalizeHex(colors.background, base.bg) : base.bg;
    var ink = colors.text ? normalizeHex(colors.text, base.ink) : base.ink;
    var panel;

    if (colors.panel) {
      panel = normalizeHex(colors.panel, base.panel);
    } else if (colors.background) {
      panel = mix(background, ink, dark ? 0.06 : 0.025);
    } else {
      panel = base.panel;
    }

    var secondary = base.secondary;
    var muted = colors.text || colors.background ? mix(ink, background, 0.48) : base.muted;
    var soft = mix(background, ink, dark ? 0.07 : 0.045);
    var line = mix(background, ink, dark ? 0.17 : 0.12);
    var btnHover = mix(background, ink, dark ? 0.13 : 0.06);
    var codeBg = mix(background, ink, dark ? 0.12 : 0.065);
    var stripe = mix(background, panel, 0.6);

    var accentHover = luminance(accent) < 0.18 ? lighten(accent, 0.14) : darken(accent, 0.09);
    var secondaryHover = luminance(secondary) < 0.18 ? lighten(secondary, 0.14) : darken(secondary, 0.09);
    var success = base.success;
    var danger = base.danger;
    var successInk = dark ? lighten(success, 0.06) : darken(success, 0.08);
    var ownedInk = dark ? lighten(secondary, 0.16) : darken(secondary, 0.22);

    var wash = dark ? 0.18 : 0.12;
    var font = PolyKit.getFont(normalized.font);

    return {
      '--pw-lime': accent,
      '--pw-lime-hover': accentHover,
      '--pw-accent': accent,
      '--pw-pag': secondary,
      '--pw-pag-hover': secondaryHover,
      '--pw-ink': ink,
      '--pw-on-ink': contrastText(ink),
      '--pw-ink-hover': mix(ink, accent, 0.14),
      '--pw-muted': muted,
      '--pw-bg': background,
      '--pw-soft': soft,
      '--pw-panel': panel,
      '--pw-panel-2': mix(panel, ink, dark ? 0.06 : 0.025),
      '--pw-border': line,
      '--pw-line': line,
      '--pw-danger': danger,
      '--pw-online': success,
      '--pw-playing': accent,
      '--pw-developing': secondary,
      '--pw-offline': mix(line, muted, 0.5),
      '--pw-shadow': '0 ' + (dark ? 10 : 8) + 'px ' + (dark ? 28 : 24) + 'px ' + rgba('#000000', dark ? 0.45 : 0.08),
      '--pw-overlay': rgba('#000000', dark ? 0.55 : 0.35),
      '--pw-unread': mix(accent, background, wash + 0.01),
      '--pw-alert-bg': mix(danger, background, dark ? 0.22 : 0.1),
      '--pw-success-bg': mix(success, background, dark ? 0.2 : 0.1),
      '--pw-success-ink': successInk,
      '--pw-btn-hover': btnHover,
      '--pw-theme-meta': accent,
      '--pw-owned-bg': mix(background, ink, 0.05),
      '--pw-owned-border': mix(line, ink, 0.18),
      '--pw-owned-ink': ownedInk,
      '--pw-offsale-bg': mix(background, danger, dark ? 0.12 : 0.06),
      '--pw-offsale-border': mix(background, danger, dark ? 0.28 : 0.18),
      '--pw-selected-bg': mix(accent, background, wash + 0.04),
      '--pw-lime-wash': mix(accent, background, wash - 0.01),
      '--pw-hover-border': mix(line, ink, 0.18),
      '--pw-preview-from': mix(panel, accent, dark ? 0.1 : 0.07),
      '--pw-preview-to': mix(background, accent, 0.03),
      '--pw-price': dark ? lighten(success, 0.04) : darken(success, 0.04),
      '--pw-code-bg': codeBg,
      '--pw-stripe': stripe,
      '--pw-pinned': mix(accent, background, wash),
      '--pw-banner-bg': 'linear-gradient(135deg, ' + mix(background, accent, 0.08) + ', ' + mix(background, secondary, 0.08) + ')',
      '--pw-banner-border': mix(line, accent, 0.35),
      '--pw-font-display': font.display,
      '--pw-font': font.body,
      '--pw-col': '760px',
      '--pw-nav-h': normalized.compact ? '44px' : '52px',
      '--pw-radius': normalized.radius + 'px',
      '--pk-on-accent': contrastText(accent),
      'color-scheme': dark ? 'dark' : 'light'
    };
  }

  function serializeTokens(tokens) {
    return Object.keys(tokens).map(function (key) {
      return '    ' + key + ': ' + tokens[key] + ' !important;';
    }).join('\n');
  }

  function buildThemeCSS(settings) {
    var normalized = normalizeSettings(settings);
    var lightTokens = serializeTokens(resolveTheme(normalized, 'light'));
    var darkTokens = serializeTokens(resolveTheme(normalized, 'dark'));
    var scale = normalized.fontScale;

    return '/* PolyKit generated theme */\n' +
      'html[data-polykit="on"]:root {\n' + lightTokens + '\n}\n' +
      'html[data-polykit="on"][data-theme="dark"]:root {\n' + darkTokens + '\n}\n' +
      '\n' +
      'html[data-polykit="on"] { font-size: ' + (16 * scale).toFixed(2) + 'px !important; }\n' +
      'html[data-polykit="on"] body { font-size: ' + (14 * scale).toFixed(2) + 'px !important; }\n' +
      'html[data-polykit="on"] input,\n' +
      'html[data-polykit="on"] button,\n' +
      'html[data-polykit="on"] textarea,\n' +
      'html[data-polykit="on"] select { font-family: var(--pw-font) !important; }\n' +
      'html[data-polykit="on"] [class~="page-heading"],\n' +
      'html[data-polykit="on"] [class~="page-title"],\n' +
      'html[data-polykit="on"] [class~="section-title"],\n' +
      'html[data-polykit="on"] [class~="profile-name"],\n' +
      'html[data-polykit="on"] [class~="group-logs-title"] { font-family: var(--pw-font-display) !important; }\n' +
      '\n' +
      '/* Compact layout */\n' +
      'html[data-polykit-compact="on"] .pw-nav { padding: 0 0.5rem !important; }\n' +
      'html[data-polykit-compact="on"] .pw-nav-primary { gap: 0.3rem !important; }\n' +
      'html[data-polykit-compact="on"] .pw-nav-primary .nav-link,\n' +
      'html[data-polykit-compact="on"] .nav-link-games { padding: 0.25rem !important; }\n' +
      '\n' +
      '/* Replace hard-coded site colors with theme tokens */\n' +
      'html[data-polykit="on"] [class~="forum-quote"] [class~="forum-quote"] { background: var(--pw-panel) !important; border-left-color: var(--pw-line) !important; }\n' +
      'html[data-polykit="on"] [class~="forum-code"],\n' +
      'html[data-polykit="on"] [class~="sg-code"] { background: var(--pw-code-bg) !important; color: var(--pw-ink) !important; }\n' +
      'html[data-polykit="on"] [class~="forum-bb-btn"]:hover,\n' +
      'html[data-polykit="on"] [class~="forum-emoji-toggle"]:hover,\n' +
      'html[data-polykit="on"] [class~="forum-decal-toggle"]:hover,\n' +
      'html[data-polykit="on"] [class~="forum-shot-toggle"]:hover,\n' +
      'html[data-polykit="on"] [class~="forum-game-toggle"]:hover { border-color: var(--pw-hover-border) !important; }\n' +
      'html[data-polykit="on"] [class~="emote-editor-panel"] input,\n' +
      'html[data-polykit="on"] [class~="emote-editor-panel"] select,\n' +
      'html[data-polykit="on"] [class~="emote-editor-xyz"] input,\n' +
      'html[data-polykit="on"] [class~="char-poser-look"] input[type="text"],\n' +
      'html[data-polykit="on"] [class~="emote-editor-keybtn"] { background: var(--pw-panel) !important; border-color: var(--pw-line) !important; color: var(--pw-ink) !important; }\n' +
      'html[data-polykit="on"] [class~="group-perm-switch"] input:not(:checked) + [class~="group-perm-slider"],\n' +
      'html[data-polykit="on"] [class~="group-poll-bar"] { background: var(--pw-line) !important; }\n' +
      'html[data-polykit="on"] [class~="group-shout"],\n' +
      'html[data-polykit="on"] [class~="group-poll"],\n' +
      'html[data-polykit="on"] [class~="group-perm-matrix-scroll"] { background: var(--pw-panel) !important; border-color: var(--pw-line) !important; }\n' +
      'html[data-polykit="on"] [class~="group-identity-logo-img"] { background: var(--pw-panel) !important; border-color: var(--pw-line) !important; }\n' +
      'html[data-polykit="on"] [class~="avatar-emote-wheel"] { background: var(--pw-soft) !important; }\n' +
      'html[data-polykit="on"] .pw-nav-event,\n' +
      'html[data-polykit="on"] [class~="nav-ccu"],\n' +
      'html[data-polykit="on"] [class~="shop-store-bonus"],\n' +
      'html[data-polykit="on"] [class~="donate-amount"][class~="is-selected"] { color: var(--pk-on-accent) !important; }\n';
  }

  PolyKit.color = {
    isValidHex: isValidHex,
    normalizeHex: normalizeHex,
    mix: mix,
    lighten: lighten,
    darken: darken,
    rgba: rgba,
    luminance: luminance,
    contrastText: contrastText
  };
  PolyKit.normalizeSettings = normalizeSettings;
  PolyKit.cloneDefaults = cloneDefaults;
  PolyKit.resolveTheme = resolveTheme;
  PolyKit.serializeTokens = serializeTokens;
  PolyKit.buildThemeCSS = buildThemeCSS;
})(typeof globalThis !== 'undefined' ? globalThis : this);
