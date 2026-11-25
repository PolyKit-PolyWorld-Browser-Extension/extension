(function () {
  'use strict';

  var PolyKit = globalThis.PolyKit;
  var ext = globalThis.chrome || globalThis.browser;
  if (!PolyKit || !ext || !ext.storage) return;

  var KEY = PolyKit.SETTINGS_KEY;
  var storage = ext.storage.local;
  var settings = PolyKit.cloneDefaults();
  var saveTimer = null;
  var statusTimer = null;

  function el(id) {
    return document.getElementById(id);
  }

  function setStatus(message) {
    var node = el('saveStatus');
    if (!node) return;
    node.textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () {
      node.textContent = 'Ready';
    }, 2600);
  }

  function previewMode() {
    if (settings.mode === 'light' || settings.mode === 'dark') return settings.mode;
    return globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setColor(key, value) {
    el('color-' + key).value = value;
    el('hex-' + key).value = value;
  }

  function render() {
    el('enabled').checked = settings.enabled;

    Array.prototype.forEach.call(el('modeGroup').querySelectorAll('button'), function (button) {
      button.classList.toggle('active', button.getAttribute('data-mode') === settings.mode);
    });

    Array.prototype.forEach.call(el('presetGrid').querySelectorAll('button'), function (button) {
      button.classList.toggle('active', button.getAttribute('data-preset') === settings.preset);
    });

    var tokens = PolyKit.resolveTheme(settings, previewMode());
    setColor('accent', tokens['--pw-lime']);
    setColor('background', tokens['--pw-bg']);
    setColor('panel', tokens['--pw-panel']);
    setColor('text', tokens['--pw-ink']);
    document.documentElement.style.setProperty('--pk-ui-accent', tokens['--pw-lime']);

    el('font').value = settings.font;
    el('fontScale').value = settings.fontScale;
    el('fontScaleOut').value = Math.round(settings.fontScale * 100) + '%';
    el('radius').value = settings.radius;
    el('radiusOut').value = settings.radius + 'px';
    el('compact').checked = settings.compact;
    el('reduceEffects').checked = settings.reduceEffects;
    if (document.activeElement !== el('customCSS')) el('customCSS').value = settings.customCSS;
  }

  function buildPresets() {
    var grid = el('presetGrid');
    PolyKit.PRESETS.forEach(function (preset) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'pk-preset';
      button.setAttribute('data-preset', preset.id);

      var swatch = document.createElement('span');
      swatch.className = 'pk-swatch';
      swatch.style.setProperty('--swatch', preset.swatch);

      var name = document.createElement('span');
      name.textContent = preset.name;

      button.appendChild(swatch);
      button.appendChild(name);
      button.addEventListener('click', function () {
        settings.preset = preset.id;
        settings.colors = { accent: '', background: '', panel: '', text: '' };
        render();
        persist(0);
      });
      grid.appendChild(button);
    });
  }

  function buildFonts() {
    var select = el('font');
    PolyKit.FONTS.forEach(function (font) {
      var option = document.createElement('option');
      option.value = font.id;
      option.textContent = font.name;
      select.appendChild(option);
    });
  }

  function persist(delay) {
    clearTimeout(saveTimer);
    setStatus('Saving…');
    saveTimer = setTimeout(function () {
      var payload = {};
      payload[KEY] = settings;
      storage.set(payload, function () {
        setStatus('Saved — open PolyWorld tabs update');
      });
    }, typeof delay === 'number' ? delay : 160);
  }

  function bindColor(key) {
    var picker = el('color-' + key);
    var text = el('hex-' + key);

    picker.addEventListener('input', function () {
      settings.colors[key] = picker.value;
      text.value = picker.value;
      persist();
    });

    function applyText() {
      if (!PolyKit.color.isValidHex(text.value)) return;
      var value = PolyKit.color.normalizeHex(text.value, '');
      settings.colors[key] = value;
      picker.value = value;
      text.value = value;
      persist();
    }

    text.addEventListener('input', applyText);
    text.addEventListener('change', function () {
      if (!PolyKit.color.isValidHex(text.value)) {
        text.value = settings.colors[key] || picker.value;
      }
    });
  }

  function bind() {
    el('enabled').addEventListener('change', function () {
      settings.enabled = el('enabled').checked;
      render();
      persist(0);
    });

    el('modeGroup').addEventListener('click', function (event) {
      var button = event.target.closest('button[data-mode]');
      if (!button) return;
      settings.mode = button.getAttribute('data-mode');
      render();
      persist(0);
    });

    el('clearColors').addEventListener('click', function () {
      settings.colors = { accent: '', background: '', panel: '', text: '' };
      render();
      persist(0);
    });

    el('font').addEventListener('change', function () {
      settings.font = el('font').value;
      persist(0);
    });

    el('fontScale').addEventListener('input', function () {
      settings.fontScale = Number(el('fontScale').value);
      el('fontScaleOut').value = Math.round(settings.fontScale * 100) + '%';
      persist();
    });

    el('radius').addEventListener('input', function () {
      settings.radius = Number(el('radius').value);
      el('radiusOut').value = settings.radius + 'px';
      persist();
    });

    el('compact').addEventListener('change', function () {
      settings.compact = el('compact').checked;
      persist(0);
    });

    el('reduceEffects').addEventListener('change', function () {
      settings.reduceEffects = el('reduceEffects').checked;
      persist(0);
    });

    el('customCSS').addEventListener('input', function () {
      settings.customCSS = el('customCSS').value;
      persist();
    });

    el('openSite').addEventListener('click', function () {
      ext.tabs.create({ url: 'https://polyworld.games/' });
      window.close();
    });

    el('resetAll').addEventListener('click', function () {
      if (!window.confirm('Reset PolyKit to its default theme?')) return;
      settings = PolyKit.cloneDefaults();
      render();
      persist(0);
    });

    ['accent', 'background', 'panel', 'text'].forEach(bindColor);
  }

  function load() {
    storage.get(KEY, function (data) {
      settings = PolyKit.normalizeSettings(data && data[KEY] ? data[KEY] : PolyKit.DEFAULT_SETTINGS);
      render();
    });
  }

  buildPresets();
  buildFonts();
  bind();
  render();
  load();
})();
