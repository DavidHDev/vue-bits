export const LOOK = {
  color: '#7cff67',
  colorTwo: '#42b883',
  motion: 'pulse',
  ringCount: 6,
  speed: 1,
  lineThickness: 2,
  glow: 1,
  baseRadius: 0.35,
  radiusStep: 0.1,
  expansion: 0.1,
  taper: 1.5,
  rotation: 0,
  spin: 0,
  tilt: 0,
  dispersion: 0,
  grain: 0
};

export const DEFAULT_PROPS = {
  preset: 'portal',
  ...LOOK,
  opacity: 1,
  followMouse: false,
  mouseInfluence: 0.2,
  hoverScale: 1.2,
  hoverIntensity: 1,
  parallax: 0.05,
  clickBurst: true,
  intro: true
};

export type MagicRingsDemoProps = typeof DEFAULT_PROPS;

export const PRESETS: Record<string, Partial<MagicRingsDemoProps>> = {
  portal: {},
  halo: {
    color: '#ffffff',
    colorTwo: '#a3a8a4',
    motion: 'breathe',
    ringCount: 5,
    lineThickness: 1.5,
    glow: 0.6,
    taper: 1.25
  },
  ripple: { color: '#22d3ee', colorTwo: '#3b82f6', motion: 'ripple', ringCount: 7, radiusStep: 0.09 },
  prism: {
    color: '#ffffff',
    colorTwo: '#e0f2fe',
    motion: 'breathe',
    lineThickness: 1.5,
    glow: 0.6,
    dispersion: 0.6
  },
  gyro: { color: '#fcd34d', colorTwo: '#f97316', ringCount: 4, taper: 1.1, spin: 0.8, tilt: 60 },
  eclipse: {
    color: '#ffffff',
    colorTwo: '#fb923c',
    motion: 'breathe',
    ringCount: 3,
    lineThickness: 1.5,
    glow: 1.3,
    baseRadius: 0.3,
    radiusStep: 0.05,
    taper: 1
  }
};

export const PRESET_OPTIONS = [
  { value: 'portal', label: 'Portal' },
  { value: 'halo', label: 'Halo' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'prism', label: 'Prism' },
  { value: 'gyro', label: 'Gyro' },
  { value: 'eclipse', label: 'Eclipse' }
];

export const LIGHT_SWAP: Record<string, Partial<MagicRingsDemoProps>> = {
  portal: { color: '#1f9d45', colorTwo: '#0f766e' },
  halo: { color: '#3d423e', colorTwo: '#6c736d' },
  ripple: { color: '#0891b2', colorTwo: '#2563eb' },
  prism: { color: '#3d423e', colorTwo: '#4f5550' },
  gyro: { color: '#d97706', colorTwo: '#ea580c' },
  eclipse: { color: '#3d423e', colorTwo: '#c2410c' }
};

export const presetProps = (
  value: string,
  {
    light = false,
    defaults = {}
  }: { light?: boolean; defaults?: Partial<MagicRingsDemoProps>; props?: Partial<MagicRingsDemoProps> } = {}
): Partial<MagicRingsDemoProps> => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaults[name as keyof MagicRingsDemoProps]])
  ) as Partial<MagicRingsDemoProps>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
