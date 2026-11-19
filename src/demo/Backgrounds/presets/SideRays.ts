export type SideRaysOrigin = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'left';

export const LOOK = {
  rayColor1: '#FFC46B',
  rayColor2: '#96c8ff',
  blend: 0.6,
  origin: 'top-right' as SideRaysOrigin,
  speed: 2.5,
  intensity: 2,
  spread: 2,
  density: 5,
  sharpness: 0.5,
  tilt: 0,
  falloff: 1.6,
  glow: 1,
  saturation: 1,
  dust: 0
};

export const DEFAULT_PROPS = {
  preset: 'sunbeam',
  ...LOOK,
  followMouse: true,
  mouseInfluence: 0.5,
  intro: true,
  lightMode: false,
  opacity: 1
};

export const LIGHT_SWAP: Record<string, string> = {
  '#ffffff': '#64748b',
  '#e0e7ff': '#60a5fa'
};

type SideRaysLook = typeof LOOK;

export const PRESETS: Record<string, Partial<SideRaysLook>> = {
  sunbeam: {},
  dawn: { rayColor1: '#ff9a62', rayColor2: '#ff6b9d', blend: 0.5 },
  moonlight: { rayColor1: '#dbe4ff', rayColor2: '#7aa2ff', blend: 0.7, intensity: 1.6, speed: 1.5 },
  spotlight: {
    rayColor1: '#ffffff',
    rayColor2: '#e0e7ff',
    origin: 'top-left',
    spread: 1.2,
    density: 3,
    sharpness: 0.75,
    glow: 1.4
  },
  cathedral: { rayColor1: '#ffe2b0', rayColor2: '#ffd28a', spread: 2.6, density: 12, sharpness: 0.8, dust: 0.5 },
  horizon: { origin: 'left', rayColor1: '#ffb36b', rayColor2: '#7aa2ff', spread: 2.4, falloff: 1.2 }
};

export const PRESET_OPTIONS = [
  { value: 'sunbeam', label: 'Sunbeam' },
  { value: 'dawn', label: 'Dawn' },
  { value: 'moonlight', label: 'Moonlight' },
  { value: 'spotlight', label: 'Spotlight' },
  { value: 'cathedral', label: 'Cathedral' },
  { value: 'horizon', label: 'Horizon' }
];

export const swapColor = (value: string, light: boolean) => {
  const key = `#${String(value).replace(/^#/, '').toLowerCase()}`;
  return light ? (LIGHT_SWAP[key] ?? value) : value;
};

export const presetProps = (
  value: string,
  {
    defaults = {}
  }: { light?: boolean; defaults?: Partial<typeof DEFAULT_PROPS>; props?: Partial<typeof DEFAULT_PROPS> } = {}
): Partial<typeof DEFAULT_PROPS> => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaults[name as keyof typeof DEFAULT_PROPS]])
  ) as Partial<typeof DEFAULT_PROPS>;
  return {
    ...base,
    ...PRESETS[value]
  };
};
