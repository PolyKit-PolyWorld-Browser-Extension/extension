(function () {
  'use strict';

  var PolyKit = globalThis.PolyKit;
  if (!PolyKit || !PolyKit.buildThemeCSS) return;

  var ext = globalThis.chrome || globalThis.browser;
  var root = document.documentElement;
  var settings = PolyKit.cloneDefaults();
  var themeStyle = null;
  var customStyle = null;
  var rootObserver = null;
  var headObserver = null;
  var applying = false;
  var movingCustom = false;
  var themeManaged = false;
  var fxManaged = false;
  var mediaQuery = globalThis.matchMedia ? globalThis.matchMedia('(prefers-color-scheme: dark)') : null;
  var defer = typeof queueMicrotask === 'function'
    ? queueMicrotask
    : function (fn) { setTimeout(fn, 0); };

  function ensureStyles() {
    var host = document.head || root;
    if (!themeStyle) {
      themeStyle = document.createElement('style');
      themeStyle.id = 'polykit-theme';
      host.appendChild(themeStyle);
    }
    if (!customStyle) {
      customStyle = document.createElement('style');
      customStyle.id = 'polykit-custom';
      host.appendChild(customStyle);
    }
    if (document.head) promoteStyles();
  }

  function promoteStyles() {
    if (!document.head) return;
    if (themeStyle && themeStyle.parentNode !== document.head) document.head.appendChild(themeStyle);
    if (customStyle && customStyle.parentNode !== document.head) document.head.appendChild(customStyle);
    moveCustomStyleToEnd();
  }

  function moveCustomStyleToEnd() {
    if (!customStyle || !document.head || customStyle.parentNode !== document.head) return;
    if (customStyle === document.head.lastElementChild) return;
    movingCustom = true;
    document.head.appendChild(customStyle);
    movingCustom = false;
  }

  function desiredTheme() {
    if (settings.mode === 'light') return 'light';
    if (settings.mode === 'dark') return 'dark';
    if (settings.mode === 'system') return mediaQuery && mediaQuery.matches ? 'dark' : 'light';
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function updateMetaColor(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    var tokens = PolyKit.resolveTheme(settings, theme);
    var color = tokens['--pw-theme-meta'];
    if (color && meta.getAttribute('content') !== color) meta.setAttribute('content', color);
  }

  function restoreSiteTheme() {
    if (!themeManaged) return;
    var stored = null;
    try { stored = localStorage.getItem('polyworld_theme'); } catch (e) {}
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (mediaQuery && mediaQuery.matches ? 'dark' : 'light');
    if (root.getAttribute('data-theme') !== theme) root.setAttribute('data-theme', theme);
    themeManaged = false;
  }

  function restoreSiteEffects() {
    if (!fxManaged) return;
    var off = false;
    try { off = localStorage.getItem('polyworld_site_effects') === '0'; } catch (e) {}
    if (off) root.classList.add('pw-fx-off');
    else root.classList.remove('pw-fx-off');
    fxManaged = false;
  }

  function applyStored(value) {
    var previousMode = settings.mode;
    settings = PolyKit.normalizeSettings(value);
    ensureStyles();

    applying = true;

    if (!settings.enabled) {
      restoreSiteTheme();
      restoreSiteEffects();
      root.removeAttribute('data-polykit');
      root.removeAttribute('data-polykit-compact');
      if (themeStyle) themeStyle.textContent = '';
      if (customStyle) customStyle.textContent = '';
      applying = false;
      return;
    }

    root.setAttribute('data-polykit', 'on');
    root.setAttribute('data-polykit-compact', settings.compact ? 'on' : 'off');

    if (settings.mode === 'site') {
      if (previousMode !== 'site') restoreSiteTheme();
    } else {
      var wanted = desiredTheme();
      if (root.getAttribute('data-theme') !== wanted) root.setAttribute('data-theme', wanted);
      themeManaged = true;
    }

    if (settings.reduceEffects) {
      if (!root.classList.contains('pw-fx-off')) root.classList.add('pw-fx-off');
      fxManaged = true;
    } else if (fxManaged) {
      restoreSiteEffects();
    }

    if (themeStyle) themeStyle.textContent = PolyKit.buildThemeCSS(settings);
    if (customStyle) customStyle.textContent = settings.customCSS || '';
    moveCustomStyleToEnd();
    updateMetaColor(desiredTheme());

    applying = false;
  }

  function setupRootObserver() {
    if (rootObserver) return;
    rootObserver = new MutationObserver(function () {
      if (applying || !settings.enabled) return;

      applying = true;
      if (settings.mode !== 'site') {
        var wanted = desiredTheme();
        if (root.getAttribute('data-theme') !== wanted) root.setAttribute('data-theme', wanted);
      } else {
        updateMetaColor(desiredTheme());
      }

      if (settings.reduceEffects && !root.classList.contains('pw-fx-off')) {
        root.classList.add('pw-fx-off');
        fxManaged = true;
      }
      if (!settings.reduceEffects && fxManaged && root.classList.contains('pw-fx-off')) {
        restoreSiteEffects();
      }
      applying = false;
    });
    rootObserver.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  }

  function setupHeadObserver() {
    if (headObserver || !document.head) return;
    headObserver = new MutationObserver(function (records) {
      if (applying || movingCustom || !settings.enabled || !customStyle) return;
      var addedSomething = records.some(function (record) {
        return Array.prototype.some.call(record.addedNodes, function (node) {
          return node.nodeType === 1 && node !== customStyle;
        });
      });
      if (addedSomething) defer(moveCustomStyleToEnd);
    });
    headObserver.observe(document.head, { childList: true });
  }

  function waitForRoot(callback) {
    if (document.documentElement) {
      root = document.documentElement;
      callback();
      return;
    }
    var observer = new MutationObserver(function () {
      if (!document.documentElement) return;
      observer.disconnect();
      root = document.documentElement;
      callback();
    });
    observer.observe(document, { childList: true });
  }

  function start() {
    ensureStyles();
    setupRootObserver();
    setupHeadObserver();
    applyStored(PolyKit.DEFAULT_SETTINGS);

    if (ext && ext.storage && ext.storage.local && ext.storage.local.get) {
      try {
        ext.storage.local.get(PolyKit.SETTINGS_KEY, function (data) {
          applyStored(data && data[PolyKit.SETTINGS_KEY] ? data[PolyKit.SETTINGS_KEY] : PolyKit.DEFAULT_SETTINGS);
        });
      } catch (e) {}
    }

    if (ext && ext.storage && ext.storage.onChanged) {
      try {
        ext.storage.onChanged.addListener(function (changes, areaName) {
          if (areaName === 'local' && changes[PolyKit.SETTINGS_KEY]) {
            applyStored(changes[PolyKit.SETTINGS_KEY].newValue);
          }
        });
      } catch (e) {}
    }

    if (ext && ext.runtime && ext.runtime.onMessage) {
      try {
        ext.runtime.onMessage.addListener(function (message, sender, sendResponse) {
          if (message && message.type === 'polykit:apply') {
            applyStored(message.settings);
            if (typeof sendResponse === 'function') sendResponse({ ok: true });
          }
        });
      } catch (e) {}
    }

    if (mediaQuery) {
      var onThemeChange = function () {
        if (settings.enabled && settings.mode === 'system') applyStored(settings);
      };
      if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onThemeChange);
      else if (mediaQuery.addListener) mediaQuery.addListener(onThemeChange);
    }

    function onDomReady() {
      ensureStyles();
      promoteStyles();
      setupHeadObserver();
      updateMetaColor(desiredTheme());
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onDomReady);
    else onDomReady();
  }

  waitForRoot(start);
})();
