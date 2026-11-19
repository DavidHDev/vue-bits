export const LOOK = {
  colors: ['#42b883', '#a0ffbc'],
  coreColor: '#FFFFFF',
  lightMode: false,
  threadCount: 6,
  speed: 0.2,
  frequency: 5,
  spread: 0.18,
  taper: 1,
  position: 0.5,
  pinch: 0.5,
  nodes: 1,
  angle: 0,
  glow: 0.02,
  falloff: 0.6,
  thickness: 1.1,
  brightness: 0.6,
  opacity: 1,
  depth: 0,
  pulses: 0,
  mirror: true,
  shimmer: false,
  fade: 0,
  grain: 0.05
};

export const DEFAULT_PROPS = {
  preset: 'aurora',
  ...LOOK,
  intro: true,
  mouseInteraction: true,
  mouseStrength: 0.5,
  pulseOnClick: true,
  paused: false
};

export type WebThreadsLook = typeof LOOK;
export type WebThreadsDemoProps = typeof DEFAULT_PROPS;

export const PRESETS: Record<string, Partial<WebThreadsLook>> = {
  aurora: {},
  helix: {
    colors: ['#22d3ee', '#3b82f6'],
    threadCount: 8,
    speed: 0.25,
    frequency: 6,
    spread: 0.3,
    taper: 0.35,
    nodes: 2,
    depth: 0.85,
    pulses: 0.4
  },
  fiber: {
    colors: ['#66c2a4', '#e3fbe9'],
    threadCount: 18,
    speed: 0.15,
    spread: 0.2,
    taper: 0.15,
    glow: 0.012,
    falloff: 0.7,
    brightness: 0.6,
    pulses: 0.9
  },
  ember: {
    colors: ['#f97316', '#facc15'],
    coreColor: '#fff7ed',
    threadCount: 12,
    speed: 0.12,
    spread: 0.22,
    taper: 0.3,
    glow: 0.016,
    falloff: 0.72,
    shimmer: true,
    fade: 0.6,
    grain: 0.08
  },
  mono: {
    colors: ['#a3a3a3', '#f5f5f5'],
    threadCount: 9,
    spread: 0.22,
    taper: 0.3,
    nodes: 3,
    angle: -8,
    glow: 0.014,
    brightness: 0.55,
    depth: 0.6
  }
};

export const LIGHT_SWAP: Record<string, Partial<WebThreadsLook>> = {
  aurora: { lightMode: true, colors: ['#15803d', '#0d9488'], glow: 0.018, brightness: 0.82, grain: 0.015 },
  helix: { lightMode: true, colors: ['#0891b2', '#2563eb'], grain: 0.015 },
  fiber: { lightMode: true, colors: ['#17843a', '#66c2a4'], grain: 0.015 },
  ember: { lightMode: true, colors: ['#c2410c', '#d97706'], grain: 0.02 },
  mono: { lightMode: true, colors: ['#171717', '#737373'], grain: 0.015 }
};

export const PRESET_OPTIONS = [
  { value: 'aurora', label: 'Aurora' },
  { value: 'helix', label: 'Helix' },
  { value: 'fiber', label: 'Fiber' },
  { value: 'ember', label: 'Ember' },
  { value: 'mono', label: 'Mono' }
];

export const presetProps = (
  value: string,
  {
    light = false
  }: { light?: boolean; defaults?: Partial<WebThreadsDemoProps>; props?: Partial<WebThreadsDemoProps> } = {}
): Partial<WebThreadsDemoProps> => {
  return {
    ...LOOK,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
