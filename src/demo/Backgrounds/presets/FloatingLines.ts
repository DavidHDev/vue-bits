export type WaveName = 'top' | 'middle' | 'bottom';
export type LineStyle = 'solid' | 'dotted' | 'dashed';

export const WAVES: WaveName[] = ['top', 'middle', 'bottom'];

export const LOOK = {
  linesGradient: ['#7cff67', '#ffffff'],
  lineStyle: 'solid' as LineStyle,
  lineCount: 10,
  lineDistance: 6,
  lineWidth: 1,
  glow: 1,
  brightness: 1,
  animationSpeed: 1,
  amplitude: 1,
  depthOfField: 0.5,
  edgeFade: 0
};

export const DEFAULT_PROPS = {
  preset: 'signature',
  ...LOOK,
  enabledWaves: WAVES,
  interactive: true,
  bendRadius: 5,
  bendStrength: -0.5,
  parallax: true,
  parallaxStrength: 0.2,
  clickSwirl: true,
  intro: true,
  lightMode: false
};

export type FloatingLinesDemoProps = typeof DEFAULT_PROPS;

export const PRESETS: Record<string, Partial<FloatingLinesDemoProps>> = {
  signature: { ...LOOK },
  classic: { ...LOOK, linesGradient: ['#42b883', '#2f4bc0', '#42b883'] },
  mono: { ...LOOK, linesGradient: ['#ffffff', '#8b93a7'] },
  lagoon: { ...LOOK, linesGradient: ['#5eead4', '#e0fff8'] },
  ember: { ...LOOK, linesGradient: ['#ff7a45', '#ffd29a'] },
  dotted: { ...LOOK, lineStyle: 'dotted', lineCount: 14, lineDistance: 4 },
  blueprint: { ...LOOK, lineStyle: 'dashed', linesGradient: ['#7fb2ff', '#ffffff'], glow: 0.6 },
  calm: { ...LOOK, animationSpeed: 0.5, amplitude: 0.7, glow: 0.6, edgeFade: 0.6 }
};

export const PRESET_OPTIONS = [
  { value: 'signature', label: 'Signature' },
  { value: 'classic', label: 'Classic' },
  { value: 'mono', label: 'Mono' },
  { value: 'lagoon', label: 'Lagoon' },
  { value: 'ember', label: 'Ember' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'blueprint', label: 'Blueprint' },
  { value: 'calm', label: 'Calm' }
];

export const presetProps = (
  value: string,
  {
    defaults = {}
  }: { light?: boolean; defaults?: Partial<FloatingLinesDemoProps>; props?: Partial<FloatingLinesDemoProps> } = {}
): Partial<FloatingLinesDemoProps> => {
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaults[name as keyof FloatingLinesDemoProps]])
  ) as Partial<FloatingLinesDemoProps>;
  return {
    ...base,
    ...PRESETS[value]
  };
};
