export const LOOK = {
  colors: ['#42b883', '#7cff67', '#a0ffbc'],
  intensity: 1,
  mouseForce: 20,
  cursorSize: 100,
  persistence: 0.75,
  viscosity: 0
};

export const DEFAULT_PROPS = {
  preset: 'ether',
  ...LOOK,
  resolution: 0.5,
  autoDemo: true,
  autoSpeed: 0.5,
  autoIntensity: 2.2,
  clickBurst: true,
  bounceEdges: false,
  intro: true,
  lightMode: false
};

export type LiquidEtherDemoProps = typeof DEFAULT_PROPS;

type LiquidEtherLook = typeof LOOK;

export const PRESETS: Record<string, Partial<LiquidEtherLook>> = {
  ether: {},
  lagoon: { colors: ['#0e7490', '#2dd4bf', '#ccfbf1'] },
  ember: { colors: ['#9a3412', '#f97316', '#fde68a'] },
  smoke: { colors: ['#3f3f46', '#a1a1aa', '#ffffff'] },
  ocean: { colors: ['#1e3a8a', '#3b82f6', '#bae6fd'] },
  syrup: { viscosity: 0.8, persistence: 0.9, cursorSize: 140, intensity: 1.2 }
};

export const PRESET_OPTIONS = [
  { value: 'ether', label: 'Ether' },
  { value: 'lagoon', label: 'Lagoon' },
  { value: 'ember', label: 'Ember' },
  { value: 'smoke', label: 'Smoke' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'syrup', label: 'Syrup' }
];

export const presetProps = (
  value: string,
  {
    defaults = {}
  }: { light?: boolean; defaults?: Partial<LiquidEtherDemoProps>; props?: Partial<LiquidEtherDemoProps> } = {}
): Partial<LiquidEtherDemoProps> => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaults[name as keyof LiquidEtherLook]])
  ) as Partial<LiquidEtherLook>;
  return {
    ...base,
    ...PRESETS[value]
  };
};
