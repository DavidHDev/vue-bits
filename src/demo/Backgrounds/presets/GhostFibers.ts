type GhostFibersGradient = 'depth' | 'along' | 'across';
type GhostFibersFiberStyle = 'dots' | 'dashes' | 'lines';
type GhostFibersHoverEffect = 'focus' | 'part' | 'none';

export const LOOK = {
  glowColor: '#42b883',
  lineColor: '#caebdc',
  secondaryColor: '#359369',
  gradient: 'depth' as GhostFibersGradient,
  layers: 3,
  waves: 1,
  twist: 1.2,
  volume: 0.7,
  spread: 1,
  scale: 1,
  rotation: 18,
  perspective: 0.65,
  threads: 72,
  density: 1,
  thickness: 1,
  fiberStyle: 'dots' as GhostFibersFiberStyle,
  tips: 0,
  foldGlow: 1,
  speed: 0.5,
  flow: 0.4,
  rollSpeed: 0.15,
  depthOfField: 0.85,
  focusDepth: 0,
  particles: 0.5,
  sparkle: 0.5,
  glow: 0.8,
  brightness: 1,
  vignette: 0.3,
  grain: 0.06
};

export const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  mouseInteraction: true,
  hoverEffect: 'focus' as GhostFibersHoverEffect,
  mouseStrength: 1,
  pulseOnClick: true,
  intro: true,
  lightMode: false
};

export type GhostFibersDemoProps = typeof DEFAULT_PROPS;

type GhostFibersLook = typeof LOOK;

export const PRESETS: Record<string, Partial<GhostFibersLook>> = {
  classic: {},
  fiber: {
    glowColor: '#3b6bff',
    lineColor: '#dff4ff',
    secondaryColor: '#22d3ee',
    gradient: 'along',
    fiberStyle: 'lines',
    tips: 1,
    layers: 2,
    twist: 0.5,
    waves: 0.8,
    volume: 0.5,
    threads: 96,
    flow: 0.25,
    foldGlow: 0.3,
    sparkle: 0.3,
    depthOfField: 1.1
  },
  minimal: {
    glowColor: '#d4d4d8',
    lineColor: '#ffffff',
    secondaryColor: '#a1a1aa',
    layers: 1,
    twist: 1.5,
    volume: 0.4,
    threads: 54,
    particles: 0.15,
    sparkle: 0.35,
    foldGlow: 1.5,
    glow: 0.6,
    depthOfField: 0.6
  },
  prism: {
    glowColor: '#7cff67',
    lineColor: '#ffffff',
    secondaryColor: '#2dd4bf',
    gradient: 'across',
    twist: 1.6,
    waves: 1.2,
    spread: 1.25,
    foldGlow: 1.3
  },
  ember: {
    glowColor: '#ff6a1a',
    lineColor: '#ffd9a8',
    secondaryColor: '#e11d48',
    fiberStyle: 'dashes',
    flow: 0.9,
    speed: 0.7,
    sparkle: 1,
    particles: 0.9,
    twist: 0.9,
    rotation: 8
  },
  silk: {
    glowColor: '#34d399',
    lineColor: '#ecfdf5',
    secondaryColor: '#0ea5e9',
    fiberStyle: 'lines',
    layers: 2,
    twist: 0.7,
    waves: 1.5,
    volume: 1.1,
    threads: 120,
    foldGlow: 2,
    sparkle: 0.2,
    particles: 0.25,
    depthOfField: 0.45
  },
  bokeh: {
    glowColor: '#a0ffbc',
    lineColor: '#ffffff',
    secondaryColor: '#38bdf8',
    depthOfField: 1.7,
    focusDepth: -0.45,
    particles: 1.6,
    thickness: 1.3,
    density: 0.7,
    sparkle: 1.2,
    brightness: 0.75
  }
};

export const LIGHT_SWAP: Record<string, Partial<GhostFibersLook>> = {
  classic: { glowColor: '#1f9d45', lineColor: '#14532d', secondaryColor: '#4ade80' },
  fiber: { glowColor: '#2563eb', lineColor: '#1e3a8a', secondaryColor: '#0891b2' },
  minimal: { glowColor: '#3f3f46', lineColor: '#09090b', secondaryColor: '#a1a1aa' },
  prism: { glowColor: '#15803d', lineColor: '#14532d', secondaryColor: '#0d9488' },
  ember: { glowColor: '#ea580c', lineColor: '#9a3412', secondaryColor: '#be123c' },
  silk: { glowColor: '#059669', lineColor: '#065f46', secondaryColor: '#0284c7' },
  bokeh: { glowColor: '#17843a', lineColor: '#14532d', secondaryColor: '#0284c7' }
};

export const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'fiber', label: 'Fiber Optic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'prism', label: 'Prism' },
  { value: 'ember', label: 'Ember' },
  { value: 'silk', label: 'Silk' },
  { value: 'bokeh', label: 'Bokeh' }
];

export const presetProps = (
  value: string,
  {
    light = false,
    defaults = {}
  }: { light?: boolean; defaults?: Partial<GhostFibersDemoProps>; props?: Partial<GhostFibersDemoProps> } = {}
): Partial<GhostFibersDemoProps> => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(key => [key, defaults[key as keyof GhostFibersLook] ?? LOOK[key as keyof GhostFibersLook]])
  ) as Partial<GhostFibersLook>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
