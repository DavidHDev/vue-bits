export const LOOK = {
  colors: ['#ffffff'],
  backgroundColor: '#94a3b8',
  speed: 0.3,
  streakCount: 2,
  streakWidth: 0.8,
  streakLength: 1,
  density: 0.6,
  twinkle: 0.3,
  glow: 1,
  backgroundGlow: 0.1,
  headGlow: 0.6,
  depth: 0.5,
  bloom: 0.35,
  zoom: 3
};

export const DEFAULT_PROPS = {
  preset: 'snow',
  ...LOOK,
  mouseInteraction: true,
  mouseStrength: 0.4,
  mouseRadius: 0.45,
  lens: 0.5,
  holdToWarp: true,
  intro: true,
  fade: 0,
  lightMode: false
};

export type LightfallDemoProps = typeof DEFAULT_PROPS;
export type LightfallLook = typeof LOOK;

export const STARFALL: LightfallLook = {
  ...LOOK,
  colors: ['#ffffff', '#c4ffd2', '#7cff67'],
  backgroundColor: '#42b883',
  backgroundGlow: 0.18,
  speed: 0.5,
  streakWidth: 1,
  twinkle: 1,
  bloom: 0.5
};

export const PRESETS: Record<string, LightfallLook> = {
  snow: LOOK,
  starfall: STARFALL,
  classic: {
    ...STARFALL,
    colors: ['#A6C8FF', '#7cff67', '#a0ffbc'],
    backgroundColor: '#0A29FF',
    backgroundGlow: 0.35,
    headGlow: 0,
    depth: 0,
    bloom: 0
  },
  aurora: {
    ...STARFALL,
    colors: ['#ecfdf5', '#6ee7b7', '#22d3ee'],
    backgroundColor: '#0f9f8a',
    backgroundGlow: 0.2,
    speed: 0.4
  },
  ember: {
    ...STARFALL,
    colors: ['#fff4e6', '#ffb067', '#ff5a36'],
    backgroundColor: '#ff4d1a',
    backgroundGlow: 0.1,
    speed: 0.35,
    twinkle: 0.6
  },
  hyperspace: {
    ...STARFALL,
    colors: ['#ffffff', '#bfdbfe', '#60a5fa'],
    backgroundColor: '#1d4ed8',
    backgroundGlow: 0.22,
    speed: 1.2,
    streakLength: 2.2,
    streakWidth: 0.8,
    zoom: 2.4
  }
};

export const PRESET_OPTIONS = [
  { value: 'snow', label: 'Snow' },
  { value: 'starfall', label: 'Starfall' },
  { value: 'classic', label: 'Classic' },
  { value: 'aurora', label: 'Aurora' },
  { value: 'ember', label: 'Ember' },
  { value: 'hyperspace', label: 'Hyperspace' }
];

export const presetProps = (
  value: string,
  {
    defaults = {}
  }: { light?: boolean; defaults?: Partial<LightfallDemoProps>; props?: Partial<LightfallDemoProps> } = {}
): Partial<LightfallDemoProps> => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaults[name as keyof LightfallDemoProps]])
  ) as Partial<LightfallDemoProps>;
  return {
    ...base,
    ...PRESETS[value]
  };
};
