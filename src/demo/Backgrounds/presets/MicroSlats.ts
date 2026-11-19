export type MicroSlatsPreset = 'swell' | 'tide' | 'storm' | 'signal';

export const PRESETS: Record<
  MicroSlatsPreset,
  {
    scale: number;
    speed: number;
    direction: number;
    chop: number;
    stretch: number;
    glint: number;
    contrast: number;
    perspective: number;
    fog: number;
  }
> = {
  swell: {
    scale: 1.5,
    speed: 0.6,
    direction: 250,
    chop: 0.55,
    stretch: 0,
    glint: 0.7,
    contrast: 1.25,
    perspective: 0.55,
    fog: 0.55
  },
  tide: {
    scale: 1.3,
    speed: 0.5,
    direction: 262,
    chop: 0.2,
    stretch: 0.12,
    glint: 0.45,
    contrast: 1.1,
    perspective: 0.5,
    fog: 0.4
  },
  storm: {
    scale: 0.55,
    speed: 1.6,
    direction: 236,
    chop: 1,
    stretch: 0.3,
    glint: 1.3,
    contrast: 1.8,
    perspective: 0.8,
    fog: 0.35
  },
  signal: {
    scale: 0.85,
    speed: 1.2,
    direction: 180,
    chop: 0.6,
    stretch: 0.85,
    glint: 0.25,
    contrast: 1.2,
    perspective: 0,
    fog: 0
  }
};

export const DEFAULT_PROPS = {
  preset: 'swell' as MicroSlatsPreset,
  color: '#7cff67',
  glintColor: '#ffffff',
  backgroundColor: '#111111',
  slatWidth: 10,
  slatHeight: 25,
  gap: 3,
  roundness: 0.75,
  ...PRESETS.swell,
  interactive: true,
  cursorStrength: 1,
  cursorSize: 40,
  swirl: 0,
  trail: 1.4,
  lean: 0,
  intro: true,
  introDuration: 1.5,
  paused: false
};

export const LIGHT_PROPS = {
  color: '#1f9d45',
  glintColor: '#166534',
  backgroundColor: '#ffffff'
};

export const PRESET_OPTIONS = [
  { label: 'Swell', value: 'swell' },
  { label: 'Tide', value: 'tide' },
  { label: 'Storm', value: 'storm' },
  { label: 'Signal', value: 'signal' }
];

export const presetProps = (
  value: string,
  _options: { light?: boolean; defaults?: Partial<typeof DEFAULT_PROPS>; props?: Partial<typeof DEFAULT_PROPS> } = {}
) => ({ ...(PRESETS[value as MicroSlatsPreset] || PRESETS.swell) });
