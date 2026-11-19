export const LOOK = {
  rainbow: true,
  colors: ['#4f8cff', '#2dd4bf', '#ffd166'],
  colorSpeed: 1,
  intensity: 1,
  size: 1,
  force: 1,
  swirl: 3,
  trail: 1,
  momentum: 1,
  shading: 1,
  glow: 0
};

export type SplashCursorLook = typeof LOOK;

export const CLASSIC: Partial<SplashCursorLook> = { rainbow: false, colors: ['#42b883'] };

export const PRESETS: Record<string, Partial<SplashCursorLook>> = {
  classic: CLASSIC,
  rainbow: {},
  ink: { rainbow: false, colors: ['#3b82f6'], swirl: 8, trail: 2.2, momentum: 1.5, intensity: 1.3, size: 1.2 },
  smoke: {
    rainbow: false,
    colors: ['#e5e5e5'],
    swirl: 18,
    trail: 2.5,
    intensity: 0.7,
    size: 1.6,
    shading: 0.4,
    force: 0.8
  },
  lava: {
    rainbow: false,
    colors: ['#ff3d00', '#ff9100', '#ffd600'],
    swirl: 1,
    momentum: 0.6,
    trail: 1.6,
    force: 0.8,
    size: 1.4,
    glow: 0.4
  },
  silk: {
    rainbow: false,
    colors: ['#fb7185', '#fbbf24', '#38bdf8'],
    swirl: 0.5,
    momentum: 2.5,
    trail: 2.5,
    size: 2,
    force: 0.6
  }
};

export const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'ink', label: 'Ink' },
  { value: 'smoke', label: 'Smoke' },
  { value: 'lava', label: 'Lava' },
  { value: 'silk', label: 'Silk' }
];

export const presetProps = (value: string): SplashCursorLook => {
  return {
    ...LOOK,
    ...PRESETS[value]
  };
};
