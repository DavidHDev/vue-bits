export type Values = Record<string, unknown>;

export const HEX = /^#[0-9a-f]{6}$/i;

export const DOT = { size: 2.6, gap: 22, radius: 360, strength: 0.264 };

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const decimals = (step: number) => (String(step).split('.')[1] || '').length;

export const roundTo = (value: number, step: number) =>
  Number((Math.round(value / step) * step).toFixed(decimals(step)));

export const toRgb = (hex: string) => {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const toHex = (rgb: number[]) => `#${rgb.map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;

export const mix = (from: unknown, to: unknown, t: number): unknown => {
  if (typeof from === 'number' && typeof to === 'number') return from + (to - from) * t;
  if (typeof from === 'string' && typeof to === 'string' && HEX.test(from) && HEX.test(to)) {
    const a = toRgb(from);
    const b = toRgb(to);
    return toHex(a.map((channel, index) => channel + (b[index] - channel) * t));
  }
  return t < 0.5 ? from : to;
};

export const tween = (from: Values, to: Values, onFrame: (next: Values) => void, duration: number) => {
  let frame = 0;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const next: Values = { ...from };
    Object.keys(to).forEach(key => {
      next[key] = mix(from[key], to[key], eased);
    });
    onFrame(next);
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
};

const luminance = (hex: string) => {
  const [r, g, b] = toRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const dotTint = (wave: unknown, light: boolean) => {
  const base = light ? '#f5f5f5' : '#111111';
  if (!HEX.test(String(wave))) return light ? '#c6cac6' : '#454c46';
  const delta = Math.abs(luminance(String(wave)) - luminance(base)) || 1;
  return mix(base, wave, Math.min(1, Math.max(0.15, (light ? 48 : 54) / delta))) as string;
};

export const smootherstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};

export const gridLayout = (host: HTMLElement) => {
  const cell = DOT.size + DOT.gap;
  const width = host.clientWidth;
  const height = host.clientHeight;
  const cols = Math.max(1, Math.floor((width + DOT.gap) / cell));
  const rows = Math.max(1, Math.floor((height + DOT.gap) / cell));
  const startX = (width - (cols * cell - DOT.gap)) / 2 + DOT.size / 2;
  const startY = (height - (rows * cell - DOT.gap)) / 2 + DOT.size / 2;
  return { cell, width, height, startX, startY };
};
