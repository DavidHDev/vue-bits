import type { NoiseBlendMode } from '@/content/Animations/Noise/Noise.vue';

export type NoiseScene = 'photo' | 'studio' | 'dark' | 'paper';

export const DEFAULT_PROPS = {
  preset: 'film',
  scene: 'photo' as NoiseScene,
  opacity: 0.2,
  size: 1,
  fps: 24,
  blendMode: 'overlay' as NoiseBlendMode,
  contrast: 0.6,
  colored: false,
  dust: 0,
  scratches: 0,
  scanlines: 0,
  flicker: 0
};

export type NoiseDemoProps = typeof DEFAULT_PROPS;

export const PRESETS: Record<string, Partial<NoiseDemoProps>> = {
  film: {},
  studio: { scene: 'studio', opacity: 0.15, fps: 18, blendMode: 'overlay', contrast: 0.5 },
  dust: { opacity: 0.16, fps: 18, dust: 0.55, scratches: 0.5, flicker: 0.25 },
  static: {
    scene: 'dark',
    opacity: 0.42,
    size: 2,
    fps: 30,
    blendMode: 'screen',
    contrast: 1,
    scanlines: 0.4,
    flicker: 0.35
  },
  paper: { scene: 'paper', opacity: 0.5, fps: 0, blendMode: 'soft-light', contrast: 0.3 }
};

export const PRESET_OPTIONS = [
  { value: 'film', label: 'Film' },
  { value: 'studio', label: 'Studio' },
  { value: 'dust', label: 'Dust' },
  { value: 'static', label: 'Static' },
  { value: 'paper', label: 'Paper' }
];

export const presetProps = (value: string, { light = false }: { light?: boolean } = {}): NoiseDemoProps => {
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(key => [key, DEFAULT_PROPS[key as keyof NoiseDemoProps]])
  ) as NoiseDemoProps;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? { blendMode: 'multiply' as NoiseBlendMode } : null)
  };
};
