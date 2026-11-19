export type DotFieldPattern = 'grid' | 'hex' | 'spiral' | 'scatter';

export const LOOK = {
  pattern: 'grid' as DotFieldPattern,
  gradientFrom: '#7cff67',
  gradientTo: '#a0ffbc',
  glowColor: '#ffffff',
  gradientAngle: 135,
  dotRadius: 1.5,
  dotSpacing: 14,
  cursorRadius: 240,
  bulgeStrength: 0.6,
  twist: 0,
  glowRadius: 160,
  glowIntensity: 0.8,
  baseOpacity: 0.55,
  waveAmplitude: 0,
  speed: 1,
  sparkle: false
};

export const DEFAULT_PROPS = {
  preset: 'lens',
  ...LOOK,
  interactive: true,
  holdToZoom: true,
  intro: true,
  lightMode: false
};

type DotFieldLook = typeof LOOK;

export const PRESETS: Record<string, Partial<DotFieldLook>> = {
  lens: {},
  vortex: { twist: 160, bulgeStrength: 0.2, cursorRadius: 280, gradientFrom: '#22d3ee', gradientTo: '#42b883' },
  gravity: { bulgeStrength: -0.8, cursorRadius: 280, glowIntensity: 1, gradientFrom: '#a0ffbc', gradientTo: '#7cff67' },
  sunflower: {
    pattern: 'spiral',
    twist: -90,
    bulgeStrength: 0.4,
    dotRadius: 1.6,
    dotSpacing: 12,
    gradientFrom: '#FFC46B',
    gradientTo: '#FF6B6B',
    glowColor: '#fff4e0'
  },
  honeycomb: { pattern: 'hex', dotRadius: 2, dotSpacing: 12, gradientFrom: '#7dd3fc', gradientTo: '#7cff67' },
  drift: { waveAmplitude: 8, sparkle: true, speed: 0.8 },
  starfield: {
    pattern: 'scatter',
    sparkle: true,
    dotRadius: 1,
    dotSpacing: 18,
    gradientFrom: '#ffffff',
    gradientTo: '#c4ffd2',
    baseOpacity: 0.45
  }
};

export const LIGHT_SWAP: Record<string, Partial<DotFieldLook>> = {
  vortex: { gradientFrom: '#0891b2', gradientTo: '#15803d' },
  starfield: { gradientFrom: '#3d423e', gradientTo: '#17843a', baseOpacity: 0.6 }
};

export const PRESET_OPTIONS = [
  { value: 'lens', label: 'Lens' },
  { value: 'vortex', label: 'Vortex' },
  { value: 'gravity', label: 'Gravity' },
  { value: 'sunflower', label: 'Sunflower' },
  { value: 'honeycomb', label: 'Honeycomb' },
  { value: 'drift', label: 'Drift' },
  { value: 'starfield', label: 'Starfield' }
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
  ) as Partial<DotFieldLook>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
