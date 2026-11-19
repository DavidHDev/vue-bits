export const SHAPE = {
  speed: 1,
  twist: 1,
  wave: 1,
  softness: 0.5,
  shine: 1
};

export const DEFAULT_PROPS = {
  preset: 'silver',
  color: '#a3b8aa',
  ...SHAPE,
  direction: 'forward' as 'forward' | 'reverse' | 'pingpong',
  scale: 1,
  brightness: 1,
  grain: 0.04,
  quality: 0.75,
  fade: 0,
  opacity: 1,
  mouseInteractive: true,
  intro: true,
  lightMode: false
};

type PlasmaPreset = typeof SHAPE & { color: string };

export const PRESETS: Record<string, PlasmaPreset> = {
  silver: { ...SHAPE, color: '#a3b8aa' },
  copper: { ...SHAPE, color: '#ff8a5c' },
  ocean: { ...SHAPE, color: '#4f7cff' },
  jade: { ...SHAPE, color: '#2fbf8f' },
  vortex: { ...SHAPE, color: '#a3b8aa', twist: 1.8, speed: 1.3, softness: 0.3, shine: 1.4 }
};

export const PRESET_OPTIONS = [
  { value: 'silver', label: 'Silver' },
  { value: 'copper', label: 'Copper' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'jade', label: 'Jade' },
  { value: 'vortex', label: 'Vortex' }
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
