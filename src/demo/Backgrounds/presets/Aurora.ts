export const LOOK = {
  colorStops: ['#42b883', '#7cff67', '#42b883'],
  amplitude: 1,
  blend: 0.5,
  height: 0.45,
  speed: 1,
  scale: 1,
  glow: 0.6,
  brightness: 1,
  layers: 1,
  direction: 'top' as 'top' | 'bottom'
};

export const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  opacity: 1,
  mouseInteraction: true,
  intro: true,
  lightMode: false
};

type AuroraLook = typeof LOOK;

export const PRESETS: Record<string, AuroraLook> = {
  classic: { ...LOOK },
  borealis: { ...LOOK, colorStops: ['#1effa0', '#14c8b4', '#3a7bff'] },
  dusk: { ...LOOK, colorStops: ['#ff8a5c', '#ff5c8a', '#5c8aff'] },
  arctic: { ...LOOK, colorStops: ['#8fe3ff', '#e8f6ff', '#6f9bff'], amplitude: 0.7, speed: 0.7 },
  mono: { ...LOOK, colorStops: ['#ffffff', '#9aa0ad', '#ffffff'], brightness: 0.8 },
  horizon: { ...LOOK, colorStops: ['#5c7cff', '#ff6b9a', '#ffb35c'], direction: 'bottom', height: 0.5 },
  veil: {
    ...LOOK,
    colorStops: ['#7cff67', '#22d3c5', '#3a7bff'],
    layers: 3,
    glow: 1.2,
    speed: 0.6,
    amplitude: 1.4
  }
};

export const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'borealis', label: 'Borealis' },
  { value: 'dusk', label: 'Dusk' },
  { value: 'arctic', label: 'Arctic' },
  { value: 'mono', label: 'Mono' },
  { value: 'horizon', label: 'Horizon' },
  { value: 'veil', label: 'Veil' }
];

export const presetProps = (
  value: string,
  {
    defaults = {}
  }: { light?: boolean; defaults?: Partial<typeof DEFAULT_PROPS>; props?: Partial<typeof DEFAULT_PROPS> } = {}
) => {
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaults[name as keyof typeof DEFAULT_PROPS]])
  ) as Partial<typeof DEFAULT_PROPS>;
  return {
    ...base,
    ...PRESETS[value]
  };
};
