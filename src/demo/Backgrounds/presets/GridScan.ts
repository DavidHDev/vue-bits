type LineStyle = 'solid' | 'dashed' | 'dotted';
type ScanDirection = 'forward' | 'backward' | 'pingpong';
type ClickEffect = 'ping' | 'scan' | 'none';

export const LOOK = {
  scanColor: '#7dd3fc',
  cells: 8,
  lineThickness: 1,
  lineStyle: 'solid' as LineStyle,
  depth: 3,
  depthFade: 0.6,
  shading: 0.7,
  reflection: 0.35,
  points: true,
  scanDirection: 'forward' as ScanDirection,
  scanDuration: 2.4,
  scanDelay: 1.6,
  scanWidth: 1,
  trail: 0.5,
  glow: 0.6
};

export const DEFAULT_PROPS = {
  preset: 'scan',
  linesColor: '#4a4f4b',
  ...LOOK,
  parallax: 1,
  autoScan: true,
  interactive: true,
  clickEffect: 'ping' as ClickEffect,
  enableWebcam: false,
  showPreview: true,
  intro: true,
  lightMode: false
};

type GridScanDemoProps = typeof DEFAULT_PROPS;

export const PRESETS: Record<string, Partial<GridScanDemoProps>> = {
  scan: { ...LOOK },
  laser: { ...LOOK, scanColor: '#ff453a', scanWidth: 0.6, trail: 0.3, glow: 0.5, points: false, reflection: 0.55 },
  lidar: { ...LOOK, scanColor: '#5eead4', cells: 6, trail: 0.9, scanDuration: 3.2, scanDelay: 0.8 },
  blueprint: {
    ...LOOK,
    linesColor: '#5b6b8c',
    scanColor: '#f3f5f3',
    cells: 10,
    lineStyle: 'dashed',
    shading: 0.4,
    points: false
  },
  deep: { ...LOOK, cells: 10, depth: 8, trail: 0.7, scanDuration: 4 },
  wire: { ...LOOK, linesColor: '#585e5a', scanColor: '#fbbf24', shading: 0, reflection: 0, points: false, glow: 0.35 },
  pulse: {
    ...LOOK,
    scanColor: '#bef264',
    depth: 2.2,
    scanDirection: 'pingpong',
    scanDuration: 1.2,
    scanDelay: 0.2,
    trail: 0.25
  }
};

export const LIGHT_SWAP: Record<string, Partial<GridScanDemoProps>> = {
  scan: { scanColor: '#0284c7' },
  laser: { scanColor: '#e5332a' },
  lidar: { scanColor: '#0d9488' },
  blueprint: { linesColor: '#94a3b8', scanColor: '#161816' },
  deep: { scanColor: '#0284c7' },
  wire: { linesColor: '#a0a6a1', scanColor: '#d97706' },
  pulse: { scanColor: '#65a30d' }
};

export const PRESET_OPTIONS = [
  { value: 'scan', label: 'Scan' },
  { value: 'laser', label: 'Laser' },
  { value: 'lidar', label: 'LiDAR' },
  { value: 'blueprint', label: 'Blueprint' },
  { value: 'deep', label: 'Deep' },
  { value: 'wire', label: 'Wire' },
  { value: 'pulse', label: 'Pulse' }
];

export const presetProps = (
  value: string,
  {
    light = false,
    defaults = {}
  }: { light?: boolean; defaults?: Partial<GridScanDemoProps>; props?: Partial<GridScanDemoProps> } = {}
) => {
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaults[name as keyof GridScanDemoProps]])
  ) as Partial<GridScanDemoProps>;
  return {
    ...base,
    ...PRESETS[value],
    ...(light ? LIGHT_SWAP[value] : null)
  };
};
