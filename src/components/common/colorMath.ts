export type Rgba = { r: number; g: number; b: number; a: number };
export type Hsva = { h: number; s: number; v: number; a: number };
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [f(5), f(3), f(1)];
};

export const rgbToHsv = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === r) h = 60 * (((g - b) / d + 6) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
};

export const rgbToHsl = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: rgbToHsv(r, g, b).h, s: clamp(s), l };
};

export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
};

const byte = (value: number) => Math.round(clamp(value) * 255);
const pair = (value: number) => byte(value).toString(16).padStart(2, '0');

export const toHex = ({ r, g, b, a = 1 }: { r: number; g: number; b: number; a?: number }, withAlpha = false) =>
  `#${pair(r)}${pair(g)}${pair(b)}${withAlpha && a < 1 ? pair(a) : ''}`;

const channel = (token: string, scale: number) => {
  const text = String(token).trim();
  if (text.endsWith('%')) return clamp(parseFloat(text) / 100);
  const value = parseFloat(text);
  return Number.isFinite(value) ? clamp(value / scale) : NaN;
};

const alphaOf = (token: string | undefined) => {
  if (token === undefined) return 1;
  const text = String(token).trim();
  const value = text.endsWith('%') ? parseFloat(text) / 100 : parseFloat(text);
  return Number.isFinite(value) ? clamp(value) : NaN;
};

const hue = (token: string) => {
  const text = String(token).trim().toLowerCase();
  const value = parseFloat(text);
  if (!Number.isFinite(value)) return NaN;
  if (text.endsWith('turn')) return (value * 360) % 360;
  if (text.endsWith('rad')) return ((value * 180) / Math.PI) % 360;
  return ((value % 360) + 360) % 360;
};

const parts = (body: string) =>
  body
    .replace(/\s*\/\s*/, ' / ')
    .split(/[\s,]+/)
    .filter(Boolean);

let probe: CanvasRenderingContext2D | null = null;

const fromCanvas = (text: string): Rgba | null => {
  if (typeof document === 'undefined') return null;
  if (typeof CSS !== 'undefined' && CSS.supports && !CSS.supports('color', text)) return null;
  if (!probe) probe = document.createElement('canvas').getContext('2d');
  if (!probe) return null;
  probe.fillStyle = '#000000';
  probe.fillStyle = text;
  const normalized = probe.fillStyle;
  if (normalized === text) return null;
  return parseColor(normalized, false);
};

export function parseColor(input: unknown, allowCanvas = true): Rgba | null {
  if (input === null || input === undefined) return null;
  const text = String(input).trim().toLowerCase();
  if (!text) return null;
  const hex = text.match(/^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    let digits = hex[1];
    if (digits.length <= 4) digits = [...digits].map(char => char + char).join('');
    const value = (index: number) => parseInt(digits.slice(index, index + 2), 16) / 255;
    return { r: value(0), g: value(2), b: value(4), a: digits.length === 8 ? value(6) : 1 };
  }
  const rgb = text.match(/^rgba?\((.+)\)$/);
  if (rgb) {
    const tokens = parts(rgb[1]).filter(token => token !== '/');
    if (tokens.length < 3) return null;
    const color = {
      r: channel(tokens[0], 255),
      g: channel(tokens[1], 255),
      b: channel(tokens[2], 255),
      a: alphaOf(tokens[3])
    };
    return Object.values(color).some(Number.isNaN) ? null : color;
  }
  const hsl = text.match(/^hsla?\((.+)\)$/);
  if (hsl) {
    const tokens = parts(hsl[1]).filter(token => token !== '/');
    if (tokens.length < 3) return null;
    const h = hue(tokens[0]);
    const s = channel(tokens[1].endsWith('%') ? tokens[1] : `${tokens[1]}%`, 1);
    const l = channel(tokens[2].endsWith('%') ? tokens[2] : `${tokens[2]}%`, 1);
    const a = alphaOf(tokens[3]);
    if ([h, s, l, a].some(Number.isNaN)) return null;
    const [r, g, b] = hslToRgb(h, s, l);
    return { r, g, b, a };
  }
  return allowCanvas ? fromCanvas(text) : null;
}

export const hsvaToRgba = ({ h, s, v, a }: Hsva): Rgba => {
  const [r, g, b] = hsvToRgb(h, s, v);
  return { r, g, b, a };
};

export const rgbaToHsva = (rgba: Rgba, previous?: Hsva | null): Hsva => {
  const { h, s, v } = rgbToHsv(rgba.r, rgba.g, rgba.b);
  return {
    h: s === 0 || v === 0 ? (previous?.h ?? h) : h,
    s: v === 0 ? (previous?.s ?? s) : s,
    v,
    a: rgba.a ?? 1
  };
};

export const formatColor = (hsva: Hsva, format: ColorFormat, withAlpha: boolean) => {
  const rgba = hsvaToRgba(hsva);
  if (format === 'rgb') {
    const base = `${byte(rgba.r)}, ${byte(rgba.g)}, ${byte(rgba.b)}`;
    return withAlpha && rgba.a < 1 ? `rgba(${base}, ${Math.round(rgba.a * 100) / 100})` : `rgb(${base})`;
  }
  if (format === 'hsl') {
    const { h, s, l } = rgbToHsl(rgba.r, rgba.g, rgba.b);
    const base = `${Math.round(hsva.s === 0 ? hsva.h : h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
    return withAlpha && rgba.a < 1 ? `hsla(${base}, ${Math.round(rgba.a * 100) / 100})` : `hsl(${base})`;
  }
  return toHex(rgba, withAlpha);
};
