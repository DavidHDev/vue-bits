export type PatternWavesPreset = 'silk' | 'ocean' | 'pond' | 'lines' | 'terminal' | 'mesh';
export type PatternWavesPattern = 'dot' | 'square' | 'plus' | 'line' | 'glyph';
export type PatternWavesWave = 'silk' | 'swell' | 'ripple';
export type PatternWavesFade = 'edges' | 'center' | 'bottom' | 'top' | 'none';

export interface PatternWavesLook {
  pattern: PatternWavesPattern;
  wave: PatternWavesWave;
  spacing: number;
  markSize: number;
  depth: number;
  light: number;
  shine: number;
  contrast: number;
  speed: number;
  scale: number;
  direction: number;
}

export const PRESETS: Record<PatternWavesPreset, PatternWavesLook> = {
  silk: {
    pattern: 'dot',
    wave: 'silk',
    spacing: 9,
    markSize: 0.95,
    depth: 0.95,
    light: 0,
    shine: 0.8,
    contrast: 1.2,
    speed: 0.35,
    scale: 1,
    direction: 20
  },
  ocean: {
    pattern: 'dot',
    wave: 'swell',
    spacing: 10,
    markSize: 0.9,
    depth: 0.42,
    light: 0,
    shine: 1,
    contrast: 1.2,
    speed: 0.5,
    scale: 1,
    direction: 100
  },
  pond: {
    pattern: 'dot',
    wave: 'ripple',
    spacing: 10,
    markSize: 0.9,
    depth: 0.55,
    light: 0,
    shine: 1.2,
    contrast: 1.2,
    speed: 0.5,
    scale: 1,
    direction: 35
  },
  lines: {
    pattern: 'line',
    wave: 'silk',
    spacing: 12,
    markSize: 0.42,
    depth: 0.9,
    light: 0,
    shine: 0.6,
    contrast: 1.2,
    speed: 0.3,
    scale: 1,
    direction: 20
  },
  terminal: {
    pattern: 'glyph',
    wave: 'ripple',
    spacing: 13,
    markSize: 0.95,
    depth: 0.75,
    light: 0,
    shine: 0.9,
    contrast: 1.4,
    speed: 0.3,
    scale: 1.1,
    direction: 200
  },
  mesh: {
    pattern: 'plus',
    wave: 'silk',
    spacing: 14,
    markSize: 0.8,
    depth: 0.95,
    light: 0,
    shine: 1,
    contrast: 1.45,
    speed: 0.4,
    scale: 1.1,
    direction: 325
  }
};

export const PRESET_OPTIONS = [
  { label: 'Silk', value: 'silk' },
  { label: 'Ocean', value: 'ocean' },
  { label: 'Pond', value: 'pond' },
  { label: 'Lines', value: 'lines' },
  { label: 'Terminal', value: 'terminal' },
  { label: 'Mesh', value: 'mesh' }
];

export const presetProps = (value: string): PatternWavesLook => ({
  ...(PRESETS[value as PatternWavesPreset] || PRESETS.silk)
});

export const DEFAULT_PROPS = {
  preset: 'silk' as PatternWavesPreset,
  ...PRESETS.silk,
  color: '#ffffff',
  backgroundColor: '#111111',
  opacity: 1,
  fade: 'edges' as PatternWavesFade,
  fadeSize: 0.5,
  characters: '.:-=+*#%@',
  interactive: true,
  cursorSize: 50,
  cursorStrength: 0.6,
  intro: true,
  paused: false
};

export const LIGHT_PROPS = {
  color: '#161816',
  backgroundColor: '#ffffff'
};
