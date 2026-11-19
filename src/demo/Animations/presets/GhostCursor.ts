export const LOOK = {
  color: '#a0ffbc',
  size: 80,
  trailLength: 50,
  inertia: 0.5,
  turbulence: 0.5,
  drift: 0.3,
  detail: 1,
  brightness: 1,
  bloomStrength: 0.6,
  bloomRadius: 1,
  grainIntensity: 0.05
};

export type GhostCursorLook = typeof LOOK;

export const PRESETS: Record<string, Partial<GhostCursorLook>> = {
  phantom: {},
  wraith: { color: '#7aa2ff', trailLength: 80, turbulence: 0.8, drift: 0.2, bloomStrength: 0.8 },
  ember: { color: '#ff8a3d', drift: 0.7, turbulence: 0.7, brightness: 1.2, bloomStrength: 0.9, size: 70 },
  mist: {
    color: '#e5e5e5',
    size: 110,
    trailLength: 90,
    inertia: 0.7,
    drift: 0.15,
    brightness: 0.75,
    bloomStrength: 0.3,
    grainIntensity: 0.08
  },
  ecto: { color: '#6ee7b7', turbulence: 1, size: 70, bloomStrength: 0.8 },
  wisp: { size: 45, trailLength: 30, inertia: 0.25, brightness: 1.3, bloomStrength: 0.8, detail: 0.8 }
};

export const PRESET_OPTIONS = [
  { value: 'phantom', label: 'Phantom' },
  { value: 'wraith', label: 'Wraith' },
  { value: 'ember', label: 'Ember' },
  { value: 'mist', label: 'Mist' },
  { value: 'ecto', label: 'Ecto' },
  { value: 'wisp', label: 'Wisp' }
];

export const LIGHT_SWAP: Record<string, Partial<GhostCursorLook>> = {
  phantom: { color: '#1f9d45' },
  wraith: { color: '#3b5bdb' },
  ember: { color: '#ea580c' },
  mist: { color: '#525252' },
  ecto: { color: '#059669' },
  wisp: { color: '#1f9d45' }
};

export const presetProps = (
  value: string,
  { light = false, defaults = {} }: { light?: boolean; defaults?: Record<string, unknown> } = {}
): Partial<GhostCursorLook> => {
  const base = Object.fromEntries(Object.keys(LOOK).map(name => [name, defaults[name]])) as Partial<GhostCursorLook>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
