export const PRISM = {
  color1: '#ffd9a8',
  color2: '#42b883',
  color3: '#5b8cff',
  ribbons: 3,
  spacing: 28,
  barWidth: 0.5,
  ribbonHeight: 0.26,
  spread: 0.1,
  amplitude: 0.1,
  frequency: 1,
  perspective: 0.45,
  curve: 0.5,
  blur: 0.6,
  glow: 1,
  position: 0.78,
  slices: 0
};

export const DEFAULT_PROPS = {
  preset: 'prism',
  ...PRISM,
  speed: 1,
  brightness: 1.25,
  rotation: 0,
  grain: 0.08,
  fade: 0,
  opacity: 1,
  mouseInteraction: true,
  intro: true,
  lightMode: false
};

type SlicedWavesLook = typeof PRISM;
type SlicedWavesDemoProps = typeof DEFAULT_PROPS;
type SlicedWavesColors = Pick<SlicedWavesLook, 'color1' | 'color2' | 'color3'>;

export const PRESETS: Record<string, SlicedWavesLook> = {
  prism: PRISM,
  neon: { ...PRISM, color1: '#8fe9ff', color2: '#ff6fae', color3: '#4d7cff' },
  ember: { ...PRISM, color1: '#ffc46b', color2: '#ff6a3d', color3: '#ff2d55' },
  aurora: { ...PRISM, color1: '#6dffc7', color2: '#4dc3ff', color3: '#5468ff', ribbons: 4, spread: 0.08 },
  ion: { ...PRISM, color1: '#ffffff', color2: '#7fa7ff', color3: '#3d5afe', blur: 0.9 },
  signal: { ...PRISM, slices: 6, spacing: 30, barWidth: 0.6, blur: 0.3 }
};

export const LIGHT_COLORS: Record<string, SlicedWavesColors> = {
  prism: { color1: '#ff9d4d', color2: '#1f9d45', color3: '#3060ff' },
  neon: { color1: '#00a7c4', color2: '#ff2d78', color3: '#2f5bff' },
  ember: { color1: '#ff9a1f', color2: '#ff4a1c', color3: '#e0123c' },
  aurora: { color1: '#00b886', color2: '#0098e0', color3: '#3050ff' },
  ion: { color1: '#475569', color2: '#3b5bff', color3: '#1d2fd6' },
  signal: { color1: '#ff9d4d', color2: '#1f9d45', color3: '#3060ff' }
};

export const PRESET_OPTIONS = [
  { value: 'prism', label: 'Prism' },
  { value: 'neon', label: 'Neon' },
  { value: 'ember', label: 'Ember' },
  { value: 'aurora', label: 'Aurora' },
  { value: 'ion', label: 'Ion' },
  { value: 'signal', label: 'Signal' }
];

export const presetProps = (
  value: string,
  {
    light = false,
    defaults = {}
  }: { light?: boolean; defaults?: Partial<SlicedWavesDemoProps>; props?: Partial<SlicedWavesDemoProps> } = {}
): Partial<SlicedWavesDemoProps> => {
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaults[name as keyof SlicedWavesDemoProps]])
  ) as Partial<SlicedWavesDemoProps>;
  const tone = light ? LIGHT_COLORS[value] : {};
  return {
    ...base,
    ...PRESETS[value],
    ...tone
  };
};
