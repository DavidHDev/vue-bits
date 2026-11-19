export const LOOK = {
  color1: '#42b883',
  color2: '#7cff67',
  color3: '#FFFFFF',
  speed: 0.5,
  sweepSpeed: 0.25,
  sweepWidth: 1.6,
  trail: 0.5,
  reverse: false,
  scale: 1.5,
  frequency: 2,
  ripple: 0.22,
  bandDensity: 11,
  lineWidth: 1.2,
  glow: 0.6,
  scanDirection: 'vertical' as 'vertical' | 'horizontal' | 'diagonal',
  colorSpread: 0.7,
  brightness: 1,
  vignette: 0.3
};

export const DEFAULT_PROPS = {
  preset: 'scanner',
  ...LOOK,
  scanline: true,
  scanlineIntensity: 0.5,
  grain: true,
  grainIntensity: 0.04,
  opacity: 1,
  mouseInteraction: true,
  mouseMode: 'repel' as 'repel' | 'attract',
  mouseRadius: 0.5,
  mouseStrength: 0.7,
  clickEffect: 'ping' as 'ping' | 'none',
  intro: true,
  lightMode: false
};

type ScannerLook = Partial<typeof LOOK>;

export const PRESETS: Record<string, ScannerLook> = {
  scanner: {},
  phosphor: { color1: '#14532d', color2: '#4ade80', color3: '#ecfccb', trail: 0.9, ripple: 0.14, colorSpread: 0.2 },
  ember: { color1: '#7c2d12', color2: '#fb923c', color3: '#fff7ed', speed: 0.7, ripple: 0.32 },
  ice: { color1: '#1e3a8a', color2: '#60a5fa', color3: '#ffffff', scanDirection: 'diagonal', sweepSpeed: 0.3 },
  mono: { color1: '#3f3f46', color2: '#d4d4d8', color3: '#ffffff', colorSpread: 0 },
  dense: { bandDensity: 26, lineWidth: 0.8, glow: 0.4, ripple: 0.14, frequency: 1.6 },
  storm: { ripple: 0.6, frequency: 3, speed: 1.2, sweepSpeed: 0.6, sweepWidth: 1, colorSpread: 0.9 },
  calm: { speed: 0.22, sweepSpeed: 0.12, ripple: 0.12, trail: 0.95, glow: 0.8 }
};

export const LIGHT_SWAP: Record<string, ScannerLook> = {
  scanner: { color1: '#15803d', color2: '#0f766e', color3: '#18181b' },
  phosphor: { color1: '#166534', color2: '#16a34a', color3: '#052e16' },
  ember: { color1: '#9a3412', color2: '#ea580c', color3: '#431407' },
  ice: { color1: '#1e40af', color2: '#2563eb', color3: '#172554' },
  mono: { color1: '#a1a1aa', color2: '#52525b', color3: '#18181b' },
  dense: { color1: '#15803d', color2: '#0f766e', color3: '#18181b' },
  storm: { color1: '#15803d', color2: '#0f766e', color3: '#18181b' },
  calm: { color1: '#15803d', color2: '#0f766e', color3: '#18181b' }
};

export const PRESET_OPTIONS = [
  { value: 'scanner', label: 'Scanner' },
  { value: 'phosphor', label: 'Phosphor' },
  { value: 'ember', label: 'Ember' },
  { value: 'ice', label: 'Ice' },
  { value: 'mono', label: 'Mono' },
  { value: 'dense', label: 'Dense' },
  { value: 'storm', label: 'Storm' },
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
  ) as ScannerLook;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
