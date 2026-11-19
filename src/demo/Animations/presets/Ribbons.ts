export const LOOK = {
  colors: ['#42b883', '#7cff67', '#a0ffbc'],
  shape: 'lens' as 'lens' | 'comet' | 'even',
  thickness: 30,
  length: 1.4,
  spread: 18,
  stiffness: 0.5,
  bounce: 0.5,
  wave: 0,
  softness: 0,
  opacity: 1,
  fade: false
};

export type RibbonsLook = typeof LOOK;

export const PRESETS: Record<string, RibbonsLook> = {
  layers: LOOK,
  solo: { ...LOOK, colors: ['#42b883'], length: 1 },
  comet: {
    ...LOOK,
    colors: ['#42b883', '#61d096', '#81e7a9', '#a0ffbc'],
    shape: 'comet',
    thickness: 26,
    length: 2.2,
    spread: 14,
    fade: true
  },
  glow: { ...LOOK, thickness: 36, length: 2.4, softness: 0.8, fade: true },
  streamers: {
    ...LOOK,
    colors: ['#2f6b45', '#42b883', '#61d096', '#81e7a9', '#a0ffbc'],
    shape: 'even',
    thickness: 10,
    length: 2.4,
    spread: 14,
    bounce: 0.7,
    wave: 0.5
  }
};

export const PRESET_OPTIONS = [
  { value: 'layers', label: 'Layers' },
  { value: 'solo', label: 'Solo' },
  { value: 'comet', label: 'Comet' },
  { value: 'glow', label: 'Glow' },
  { value: 'streamers', label: 'Streamers' }
];

export const presetProps = (
  value: string,
  { defaults = {} }: { light?: boolean; defaults?: Record<string, unknown> } = {}
): Partial<RibbonsLook> => {
  const base = Object.fromEntries(Object.keys(LOOK).map(name => [name, defaults[name]])) as Partial<RibbonsLook>;
  return {
    ...base,
    ...PRESETS[value]
  };
};
