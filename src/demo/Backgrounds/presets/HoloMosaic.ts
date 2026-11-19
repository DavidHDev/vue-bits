export type HoloMosaicSpectrum = 'full' | 'warm' | 'cool' | 'pearl';
export type HoloMosaicFilter = 'none' | 'ascii' | 'dither';

export const LOOK = {
  metalColor: '#e8ebf1',
  spectrum: 'full' as HoloMosaicSpectrum,
  tileSize: 1,
  gap: 0.08,
  roundness: 0.15,
  bevel: 0.35,
  rotation: 0,
  scatter: 0.3,
  tilt: 0.35,
  swirl: 1,
  ripple: 0.6,
  bands: 1.3,
  softness: 0.5,
  intensity: 1.25,
  saturation: 0.1,
  glitter: 0.85,
  sheen: 0.8,
  speed: 0.5
};

export type HoloMosaicLook = typeof LOOK;

export const DEFAULT_PROPS = {
  preset: 'chrome',
  color: '#111111',
  ...LOOK,
  grain: 0.08,
  variation: 0,
  filter: 'none' as HoloMosaicFilter,
  filterSize: 1,
  fade: 0,
  opacity: 1,
  intro: true,
  mouseInteraction: true,
  mouseStrength: 1,
  mouseRadius: 0.25,
  flipOnClick: true,
  lightMode: false
};

export type HoloMosaicDemoProps = typeof DEFAULT_PROPS;

const COLOR: Partial<HoloMosaicLook> = {
  metalColor: '#c8cdd8',
  scatter: 0.12,
  tilt: 0.12,
  bands: 1,
  intensity: 1,
  saturation: 1,
  glitter: 0.4,
  sheen: 0.5
};

export const PRESETS: Record<string, Partial<HoloMosaicLook>> = {
  chrome: {},
  prism: { ...COLOR },
  gold: {
    ...COLOR,
    metalColor: '#f0c674',
    spectrum: 'warm',
    tileSize: 1.25,
    roundness: 0.22,
    ripple: 0.45,
    swirl: 0.8,
    sheen: 0.9,
    glitter: 0.55
  },
  opal: {
    ...COLOR,
    metalColor: '#e4f0ea',
    spectrum: 'pearl',
    saturation: 0.85,
    tileSize: 1.7,
    gap: 0.05,
    roundness: 0.35,
    bevel: 0.6,
    swirl: 0.65,
    bands: 0.8,
    ripple: 0.35,
    glitter: 0.25,
    speed: 0.35
  },
  glacier: {
    ...COLOR,
    metalColor: '#cfe3ff',
    spectrum: 'cool',
    tileSize: 0.75,
    rotation: 45,
    tilt: 0.2,
    ripple: 0.9,
    bands: 1.2,
    glitter: 0.5
  },
  shatter: {
    ...COLOR,
    tileSize: 0.6,
    gap: 0.12,
    roundness: 0.25,
    scatter: 1,
    tilt: 0.3,
    ripple: 0,
    glitter: 0.6,
    speed: 0.7
  }
};

export const LIGHT_SWAP: Record<string, Partial<HoloMosaicLook>> = {
  chrome: { metalColor: '#6b7280', intensity: 1.4 },
  prism: {},
  gold: { metalColor: '#b8862b' },
  opal: { metalColor: '#7f9a8c' },
  glacier: { metalColor: '#5f86c4' },
  shatter: {}
};

export const PRESET_OPTIONS = [
  { value: 'chrome', label: 'Chrome' },
  { value: 'prism', label: 'Prism' },
  { value: 'gold', label: 'Gold' },
  { value: 'opal', label: 'Opal' },
  { value: 'glacier', label: 'Glacier' },
  { value: 'shatter', label: 'Shatter' }
];

export const presetProps = (
  value: string,
  {
    light = false,
    defaults = {}
  }: { light?: boolean; defaults?: Partial<HoloMosaicDemoProps>; props?: Partial<HoloMosaicDemoProps> } = {}
): Partial<HoloMosaicDemoProps> => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(key => [key, defaults[key as keyof HoloMosaicLook] ?? LOOK[key as keyof HoloMosaicLook]])
  ) as Partial<HoloMosaicLook>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
