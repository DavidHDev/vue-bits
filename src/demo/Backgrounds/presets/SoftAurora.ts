export const LOOK = {
  color1: '#f7f7f7',
  color2: '#7cff67',
  spectrum: 1,
  speed: 0.6,
  colorSpeed: 1,
  scale: 1.5,
  brightness: 1,
  noiseFrequency: 2.5,
  noiseAmplitude: 1,
  bandHeight: 0.5,
  bandSpread: 1,
  tilt: 0,
  octaveDecay: 0.1,
  layerOffset: 0
};

export const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  enableMouseInteraction: true,
  mouseInfluence: 0.25,
  clickPulse: true,
  intro: true,
  lightMode: false
};

type SoftAuroraLook = typeof LOOK;

export const PRESETS: Record<string, Partial<SoftAuroraLook>> = {
  classic: {},
  borealis: {
    color1: '#3EE59A',
    color2: '#22B8D3',
    spectrum: 0.2,
    bandHeight: 0.55,
    noiseAmplitude: 1.6,
    brightness: 0.8
  },
  dusk: { color1: '#FFB86B', color2: '#FF5C8A', spectrum: 0.35, bandHeight: 0.38 },
  mono: { color1: '#E3E6E3', color2: '#6C736D', spectrum: 0, brightness: 0.7 },
  ribbon: { tilt: -14, noiseAmplitude: 2.2, bandSpread: 1.3, scale: 1.2 },
  halo: { bandSpread: 0.55, brightness: 1.2, noiseFrequency: 1.5 },
  calm: { speed: 0.25, colorSpeed: 0.4, noiseAmplitude: 0.6 }
};

export const LIGHT_SWAP: Record<string, Partial<SoftAuroraLook>> = {
  mono: { color1: '#4F5550', color2: '#9DA49E' }
};

export const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'borealis', label: 'Borealis' },
  { value: 'dusk', label: 'Dusk' },
  { value: 'mono', label: 'Mono' },
  { value: 'ribbon', label: 'Ribbon' },
  { value: 'halo', label: 'Halo' },
  { value: 'calm', label: 'Calm' }
];

export const presetProps = (
  value: string,
  {
    light = false,
    defaults = {}
  }: { light?: boolean; defaults?: Partial<typeof DEFAULT_PROPS>; props?: Partial<typeof DEFAULT_PROPS> } = {}
) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaults[name as keyof typeof DEFAULT_PROPS]])
  ) as Partial<SoftAuroraLook>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
