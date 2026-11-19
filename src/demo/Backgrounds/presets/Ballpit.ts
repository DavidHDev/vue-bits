type BallpitMaterial = 'satin' | 'matte' | 'gloss' | 'frosted' | 'metal';

export const LOOK = {
  colors: ['#ffffff'] as string[],
  material: 'satin' as BallpitMaterial,
  count: 200,
  minSize: 0.5,
  maxSize: 1,
  gravity: 0,
  friction: 0.9975,
  wallBounce: 0.95,
  bounce: 0.85,
  depth: 2,
  drift: 0.4,
  cursorSize: 1,
  lightColor: '#ffffff',
  lightIntensity: 1,
  exposure: 1,
  shadows: 0.6
};

export const DEFAULT_PROPS = {
  preset: 'float',
  ...LOOK,
  followCursor: true,
  grab: true,
  clickEffect: 'burst' as 'burst' | 'none',
  intro: true
};

type BallpitLook = typeof LOOK;

export const PRESETS: Record<string, Partial<BallpitLook>> = {
  float: {},
  pit: { colors: ['#42b883'], gravity: 0.6, drift: 0, count: 260 },
  clay: { material: 'matte', colors: ['#e8b4a0'], gravity: 0.6, drift: 0, shadows: 0.75 },
  gloss: { material: 'gloss', colors: ['#18181b', '#ff5b2e'] },
  frosted: { material: 'frosted', colors: ['#a0ffbc'], gravity: 0, drift: 0.5, count: 150 },
  metal: { material: 'metal', colors: ['#d4d4d8'], gravity: 0.6, drift: 0 },
  sprinkles: { colors: ['#ffffff', '#42b883'], count: 900, minSize: 0.26, maxSize: 0.46, gravity: 0.6, drift: 0 },
  zero: { colors: ['#ff5b2e'], gravity: 0, drift: 0, friction: 1, bounce: 1, wallBounce: 1 }
};

export const LIGHT_SWAP: Record<string, Partial<BallpitLook>> = {
  float: { colors: ['#18181b'] },
  frosted: { colors: ['#66c2a4'] },
  sprinkles: { colors: ['#18181b', '#1f9d45'] }
};

export const PRESET_OPTIONS = [
  { value: 'float', label: 'Float' },
  { value: 'pit', label: 'Pit' },
  { value: 'clay', label: 'Clay' },
  { value: 'gloss', label: 'Gloss' },
  { value: 'frosted', label: 'Frosted' },
  { value: 'metal', label: 'Metal' },
  { value: 'sprinkles', label: 'Sprinkles' },
  { value: 'zero', label: 'Zero G' }
];

export const presetProps = (
  value: string,
  {
    light = false,
    defaults = {}
  }: { light?: boolean; defaults?: Partial<typeof DEFAULT_PROPS>; props?: Partial<typeof DEFAULT_PROPS> } = {}
) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaults[name as keyof BallpitLook]])
  ) as Partial<BallpitLook>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
