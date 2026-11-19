export const LOOK = {
  color1: '#DE443B',
  color2: '#006BB4',
  color3: '#162325',
  contrast: 3.5,
  lighting: 0.4,
  swirl: 0.25,
  speed: 1,
  rotationSpeed: 0,
  scale: 1,
  detail: 5,
  pixelSize: 1.5,
  crt: 0,
  mouseStrength: 1
};

export const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  mouseInteraction: true,
  clickSwirl: true,
  intro: true,
  lightMode: false
};

type BalatroLook = typeof LOOK;
type BalatroProps = typeof DEFAULT_PROPS;

export const PRESETS: Record<string, Partial<BalatroLook>> = {
  classic: {},
  felt: { color1: '#3BA55C', color2: '#E3B341', color3: '#0E2A1D', swirl: 0.35, lighting: 0.5 },
  ember: { color1: '#FF7A2F', color2: '#FFD166', color3: '#2A0F0A', scale: 1.4, speed: 0.7 },
  vortex: { swirl: 0.8, rotationSpeed: -3, contrast: 2.5 },
  ocean: { color1: '#1FB6C9', color2: '#0B4F8A', color3: '#04131F', lighting: 0.7, detail: 6 },
  mono: {
    color1: '#D9D9D9',
    color2: '#555555',
    color3: '#0E0E0E',
    pixelSize: 0,
    detail: 4,
    scale: 1.5,
    speed: 0.5
  },
  arcade: { pixelSize: 4, crt: 1 }
};

export const LIGHT_SWAP: Record<string, Partial<BalatroLook>> = {
  ocean: { color1: '#0E9DB0' },
  mono: { color1: '#A1A1A1', color2: '#3F3F3F' }
};

export const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'felt', label: 'Felt' },
  { value: 'ember', label: 'Ember' },
  { value: 'vortex', label: 'Vortex' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'mono', label: 'Mono' },
  { value: 'arcade', label: 'Arcade' }
];

export const presetProps = (
  value: string,
  {
    light = false,
    defaults = {}
  }: { light?: boolean; defaults?: Partial<BalatroProps>; props?: Partial<BalatroProps> } = {}
): Partial<BalatroLook> => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaults[name as keyof BalatroProps]])
  ) as Partial<BalatroLook>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
