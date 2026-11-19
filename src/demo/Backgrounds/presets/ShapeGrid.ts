export type ShapeGridShape = 'square' | 'tile' | 'hexagon' | 'triangle' | 'diamond' | 'circle' | 'cross' | 'dot';
export type ShapeGridDirection = 'diagonal' | 'up' | 'down' | 'left' | 'right' | 'none';

export const LOOK = {
  shape: 'square' as ShapeGridShape,
  direction: 'diagonal' as ShapeGridDirection,
  lineColor: '#272a27',
  hoverColor: '#ffffff',
  hoverFillColor: '#ffffff',
  fillOpacity: 0.15,
  rainbow: false,
  cellSize: 40,
  lineWidth: 1,
  speed: 0.5,
  tiltX: 0,
  tiltY: 0,
  radius: 1.5,
  trail: 0.6,
  glow: 0.35,
  twinkle: 0,
  fade: 1,
  clickCascade: true,
  intro: true
};

export type ShapeGridLook = typeof LOOK;

export const DEFAULT_PROPS = { preset: 'classic', ...LOOK };

type ShapeGridColors = Pick<ShapeGridLook, 'lineColor' | 'hoverColor' | 'hoverFillColor'>;

export const PRESETS: Record<string, { look: ShapeGridLook; light: Partial<ShapeGridColors> }> = {
  classic: { look: LOOK, light: { lineColor: '#e3e6e3', hoverColor: '#161816', hoverFillColor: '#161816' } },
  tiles: {
    look: {
      ...LOOK,
      shape: 'tile',
      direction: 'up',
      speed: 0.3,
      hoverColor: '#7c8cff',
      hoverFillColor: '#7c8cff',
      twinkle: 0.6,
      trail: 0.9
    },
    light: { lineColor: '#e3e6e3', hoverColor: '#3050ff', hoverFillColor: '#3050ff' }
  },
  hive: {
    look: {
      ...LOOK,
      shape: 'hexagon',
      direction: 'up',
      speed: 0.35,
      hoverColor: '#2dd4bf',
      hoverFillColor: '#2dd4bf',
      radius: 2,
      trail: 0.9
    },
    light: { lineColor: '#e3e6e3', hoverColor: '#0d9488', hoverFillColor: '#0d9488' }
  },
  shards: {
    look: { ...LOOK, shape: 'triangle', direction: 'left', speed: 0.4, cellSize: 46, radius: 1.8 },
    light: { lineColor: '#e3e6e3', hoverColor: '#161816', hoverFillColor: '#161816' }
  },
  lattice: {
    look: {
      ...LOOK,
      shape: 'diamond',
      direction: 'right',
      speed: 0.4,
      hoverColor: '#f5a524',
      hoverFillColor: '#f5a524',
      glow: 0.5
    },
    light: { lineColor: '#e3e6e3', hoverColor: '#c2410c', hoverFillColor: '#c2410c' }
  },
  rings: {
    look: {
      ...LOOK,
      shape: 'circle',
      direction: 'down',
      speed: 0.3,
      cellSize: 36,
      hoverColor: '#ff7ab6',
      hoverFillColor: '#ff7ab6',
      radius: 1.8
    },
    light: { lineColor: '#e3e6e3', hoverColor: '#db2777', hoverFillColor: '#db2777' }
  },
  markers: {
    look: {
      ...LOOK,
      shape: 'cross',
      direction: 'none',
      lineColor: '#373b37',
      cellSize: 34,
      radius: 3,
      trail: 1.2,
      glow: 0.2
    },
    light: { lineColor: '#d3d7d3', hoverColor: '#161816', hoverFillColor: '#161816' }
  },
  dots: {
    look: {
      ...LOOK,
      shape: 'dot',
      speed: 0.25,
      lineColor: '#373b37',
      cellSize: 26,
      radius: 3.2,
      trail: 1,
      glow: 0.5,
      twinkle: 0.3
    },
    light: { lineColor: '#c8ccc8', hoverColor: '#161816', hoverFillColor: '#161816' }
  },
  horizon: {
    look: {
      ...LOOK,
      direction: 'down',
      speed: 0.6,
      tiltX: 58,
      cellSize: 44,
      radius: 2,
      trail: 0.9,
      glow: 0.45
    },
    light: { lineColor: '#e3e6e3', hoverColor: '#161816', hoverFillColor: '#161816' }
  },
  prism: {
    look: {
      ...LOOK,
      shape: 'tile',
      direction: 'up',
      speed: 0.3,
      rainbow: true,
      tiltX: 28,
      tiltY: -22,
      radius: 2.2,
      trail: 1.2,
      glow: 0.5
    },
    light: { lineColor: '#e3e6e3', hoverColor: '#161816', hoverFillColor: '#161816' }
  }
};

export const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'tiles', label: 'Tiles' },
  { value: 'hive', label: 'Hive' },
  { value: 'shards', label: 'Shards' },
  { value: 'lattice', label: 'Lattice' },
  { value: 'rings', label: 'Rings' },
  { value: 'markers', label: 'Markers' },
  { value: 'dots', label: 'Dots' },
  { value: 'horizon', label: 'Horizon' },
  { value: 'prism', label: 'Prism' }
];

export const presetProps = (
  value: string,
  { defaults = {} }: { light?: boolean; defaults?: Record<string, unknown>; props?: Record<string, unknown> } = {}
): Partial<ShapeGridLook> => {
  const base = Object.fromEntries(Object.keys(LOOK).map(name => [name, defaults[name]]));
  return {
    ...base,
    ...(PRESETS[value] ?? PRESETS.classic).look
  };
};
