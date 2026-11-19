export const LOOK = {
  shardColor: '#6ABD89',
  accentColor: '#7CFF67',
  lightMode: false,
  placement: 'full' as 'full' | 'left' | 'right' | 'center',
  material: 'glass' as 'glass' | 'chrome',
  markers: 'plus' as 'plus' | 'dots' | 'none',
  count: 1300,
  shardSize: 1,
  spread: 1,
  twist: 1,
  billow: 1,
  speed: 1,
  scale: 1,
  depthOfField: 0.75,
  glow: 0.35,
  grain: 0.06,
  vignette: 0.3
};

type AeroShardsLook = typeof LOOK;

export const PRESETS: Record<string, Partial<AeroShardsLook>> = {
  emerald: {},
  glacier: {
    shardColor: '#9cc9ff',
    accentColor: '#38bdf8',
    material: 'glass',
    placement: 'right',
    spread: 1.2,
    speed: 0.8
  },
  copper: {
    shardColor: '#e3a17a',
    accentColor: '#f97316',
    material: 'chrome',
    markers: 'dots',
    twist: 1.3,
    speed: 0.9
  },
  graphite: {
    shardColor: '#a3a3a3',
    accentColor: '#e5e5e5',
    material: 'chrome',
    glow: 0.25,
    billow: 0.7
  },
  halo: {
    shardColor: '#a6e8d8',
    accentColor: '#5eead4',
    placement: 'center',
    twist: 1.4,
    count: 1500
  }
};

export const LIGHT_SWAP: Record<string, Partial<AeroShardsLook>> = {
  emerald: { lightMode: true, shardColor: '#4f8a63', accentColor: '#1f9d45' },
  glacier: { lightMode: true, shardColor: '#3b82f6', accentColor: '#0ea5e9' },
  copper: { lightMode: true, shardColor: '#c2410c', accentColor: '#f97316' },
  graphite: { lightMode: true, shardColor: '#404040', accentColor: '#737373' },
  halo: { lightMode: true, shardColor: '#0f766e', accentColor: '#0d9488' }
};

export const PRESET_OPTIONS = [
  { value: 'emerald', label: 'Emerald' },
  { value: 'glacier', label: 'Glacier' },
  { value: 'copper', label: 'Copper' },
  { value: 'graphite', label: 'Graphite' },
  { value: 'halo', label: 'Halo' }
];

export const presetProps = (value: string, { light = false }: { light?: boolean } = {}) => {
  return {
    ...LOOK,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
