(function (root) {
  'use strict';

  var PolyKit = (root.PolyKit = root.PolyKit || {});

  PolyKit.SETTINGS_KEY = 'polykit.settings.v1';

  PolyKit.PRESETS = [
    {
      id: 'polyworld',
      name: 'PolyWorld',
      swatch: '#8fce00',
      light: {
        accent: '#8fce00',
        secondary: '#ffa500',
        bg: '#ffffff',
        panel: '#ffffff',
        ink: '#1a1a1a',
        muted: '#888888',
        success: '#3d7a2e',
        danger: '#c0392b'
      },
      dark: {
        accent: '#9ad914',
        secondary: '#ffb033',
        bg: '#151812',
        panel: '#21261a',
        ink: '#e8e8ea',
        muted: '#9a9aa3',
        success: '#8fd67a',
        danger: '#ff6b5a'
      }
    },
    {
      id: 'midnight',
      name: 'Midnight',
      swatch: '#4f7cff',
      light: {
        accent: '#4f7cff',
        secondary: '#ff9f43',
        bg: '#f7f9fd',
        panel: '#ffffff',
        ink: '#16203a',
        muted: '#6b7690',
        success: '#1f9d55',
        danger: '#d64545'
      },
      dark: {
        accent: '#6f9bff',
        secondary: '#ffb26b',
        bg: '#0e1420',
        panel: '#151d2c',
        ink: '#e8eefb',
        muted: '#94a0b8',
        success: '#5fd68f',
        danger: '#ff6b6b'
      }
    },
    {
      id: 'sunset',
      name: 'Sunset',
      swatch: '#ff6b35',
      light: {
        accent: '#ff6b35',
        secondary: '#ffb703',
        bg: '#fff8f4',
        panel: '#ffffff',
        ink: '#2b1a14',
        muted: '#9b7869',
        success: '#2e9e5b',
        danger: '#d33b2d'
      },
      dark: {
        accent: '#ff8a5b',
        secondary: '#ffc857',
        bg: '#1c1210',
        panel: '#281a16',
        ink: '#ffe9dd',
        muted: '#c09a8a',
        success: '#6fd89a',
        danger: '#ff7a6b'
      }
    },
    {
      id: 'ocean',
      name: 'Ocean',
      swatch: '#00a8cc',
      light: {
        accent: '#00a8cc',
        secondary: '#ffb703',
        bg: '#f2fbfd',
        panel: '#ffffff',
        ink: '#102b33',
        muted: '#66828c',
        success: '#168a63',
        danger: '#c1443b'
      },
      dark: {
        accent: '#38d6e8',
        secondary: '#ffc857',
        bg: '#0b1a1f',
        panel: '#112830',
        ink: '#e2fbff',
        muted: '#8fb2ba',
        success: '#5fe0ad',
        danger: '#ff7d70'
      }
    },
    {
      id: 'lavender',
      name: 'Lavender',
      swatch: '#8b5cf6',
      light: {
        accent: '#8b5cf6',
        secondary: '#ec4899',
        bg: '#faf8ff',
        panel: '#ffffff',
        ink: '#241a3a',
        muted: '#7c7390',
        success: '#2f9e66',
        danger: '#d64570'
      },
      dark: {
        accent: '#a78bfa',
        secondary: '#f472b6',
        bg: '#16121f',
        panel: '#211a30',
        ink: '#efe9ff',
        muted: '#a79fc0',
        success: '#6fd9a0',
        danger: '#ff7d9e'
      }
    },
    {
      id: 'cherry',
      name: 'Cherry',
      swatch: '#e91e63',
      light: {
        accent: '#e91e63',
        secondary: '#ff9800',
        bg: '#fff5f8',
        panel: '#ffffff',
        ink: '#351620',
        muted: '#9d7180',
        success: '#2e9e5b',
        danger: '#c62828'
      },
      dark: {
        accent: '#ff6b95',
        secondary: '#ffb74d',
        bg: '#201219',
        panel: '#2d1a24',
        ink: '#ffe9f0',
        muted: '#c496a5',
        success: '#6fd89a',
        danger: '#ff7b72'
      }
    },
    {
      id: 'mint',
      name: 'Mint',
      swatch: '#10b981',
      light: {
        accent: '#10b981',
        secondary: '#f59e0b',
        bg: '#f4fdf9',
        panel: '#ffffff',
        ink: '#102f27',
        muted: '#65877d',
        success: '#0f9d69',
        danger: '#c1443b'
      },
      dark: {
        accent: '#34d399',
        secondary: '#fbbf24',
        bg: '#0e1b17',
        panel: '#142620',
        ink: '#e4fff4',
        muted: '#8fb9aa',
        success: '#62e0a8',
        danger: '#ff7d70'
      }
    },
    {
      id: 'gold',
      name: 'Gold',
      swatch: '#d97706',
      light: {
        accent: '#d97706',
        secondary: '#2563eb',
        bg: '#fffcf2',
        panel: '#ffffff',
        ink: '#2d2412',
        muted: '#8a7a58',
        success: '#2e9e5b',
        danger: '#c0392b'
      },
      dark: {
        accent: '#fbbf24',
        secondary: '#60a5fa',
        bg: '#1b1710',
        panel: '#272116',
        ink: '#fff3d6',
        muted: '#b5a37b',
        success: '#6fd89a',
        danger: '#ff7a6a'
      }
    },
    {
      id: 'mono',
      name: 'Mono',
      swatch: '#475569',
      light: {
        accent: '#475569',
        secondary: '#64748b',
        bg: '#f8fafc',
        panel: '#ffffff',
        ink: '#0f172a',
        muted: '#64748b',
        success: '#15803d',
        danger: '#b91c1c'
      },
      dark: {
        accent: '#cbd5e1',
        secondary: '#94a3b8',
        bg: '#0f172a',
        panel: '#162033',
        ink: '#e2e8f0',
        muted: '#94a3b8',
        success: '#4ade80',
        danger: '#f87171'
      }
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      swatch: '#ff2bd6',
      light: {
        accent: '#d926a9',
        secondary: '#00b8d4',
        bg: '#fff0fb',
        panel: '#ffffff',
        ink: '#2a0b2b',
        muted: '#8c5f88',
        success: '#08916a',
        danger: '#d81b60'
      },
      dark: {
        accent: '#ff2bd6',
        secondary: '#22d3ee',
        bg: '#0b0710',
        panel: '#171026',
        ink: '#f7e9ff',
        muted: '#b38fc0',
        success: '#4ade80',
        danger: '#ff4d6d'
      }
    }
  ];

  PolyKit.FONTS = [
    {
      id: 'default',
      name: 'PolyWorld',
      display: '"Archivo Black", "Arial Black", sans-serif',
      body: '"Work Sans", "Segoe UI", sans-serif'
    },
    {
      id: 'system',
      name: 'System',
      display: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      body: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    },
    {
      id: 'rounded',
      name: 'Rounded',
      display: '"Avenir Next Rounded", "Trebuchet MS", sans-serif',
      body: '"Avenir Next", "Trebuchet MS", sans-serif'
    },
    {
      id: 'mono',
      name: 'Mono',
      display: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      body: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    },
    {
      id: 'serif',
      name: 'Serif',
      display: 'Georgia, "Times New Roman", serif',
      body: 'Georgia, "Times New Roman", serif'
    }
  ];

  PolyKit.DEFAULT_SETTINGS = {
    enabled: true,
    mode: 'site',
    preset: 'polyworld',
    colors: {
      accent: '',
      background: '',
      panel: '',
      text: ''
    },
    radius: 6,
    font: 'default',
    fontScale: 1,
    compact: false,
    reduceEffects: false,
    customCSS: ''
  };

  PolyKit.getPreset = function (id) {
    for (var i = 0; i < PolyKit.PRESETS.length; i += 1) {
      if (PolyKit.PRESETS[i].id === id) return PolyKit.PRESETS[i];
    }
    return PolyKit.PRESETS[0];
  };

  PolyKit.getFont = function (id) {
    for (var i = 0; i < PolyKit.FONTS.length; i += 1) {
      if (PolyKit.FONTS[i].id === id) return PolyKit.FONTS[i];
    }
    return PolyKit.FONTS[0];
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
