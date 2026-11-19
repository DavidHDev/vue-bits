<script lang="ts">
import {
  cloneVNode,
  h,
  isVNode,
  type Component,
  type CSSProperties,
  type FunctionalComponent,
  type VNode,
  type VNodeChild
} from 'vue';

export type GlassIconsNode = string | number | boolean | null | undefined | VNode | Component | (() => VNodeChild);

export interface GlassIconsItem {
  icon: GlassIconsNode;
  label?: string;
  color?: string;
  href?: string;
  target?: string;
  onClick?: (event: MouseEvent) => void;
  id?: string | number;
  className?: string;
}

export interface GlassIconsProps {
  items?: GlassIconsItem[];
  size?: number;
  gap?: number;
  columns?: number;
  roundness?: number;
  refraction?: number;
  bevel?: number;
  dispersion?: number;
  frost?: number;
  shine?: number;
  tint?: string;
  tintOpacity?: number;
  iconColor?: string;
  plate?: 'tilt' | 'offset' | 'circle' | 'none';
  tilt?: number;
  spread?: number;
  hover?: 'lift' | 'float' | 'press' | 'none';
  parallax?: number;
  labels?: 'hover' | 'always' | 'none';
  intro?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
  style?: CSSProperties;
}

type Maps = { refractionUrl: string; shineUrl: string; shadeUrl: string };

type Gradient = { angle: number; stops: [number, string][] };

type Motion = {
  h: number;
  hv: number;
  ht: number;
  p: number;
  pv: number;
  pt: number;
  x: number;
  xv: number;
  xt: number;
  y: number;
  yv: number;
  yt: number;
  e: number;
  ev: number;
  et: number;
  at: number;
};

type Settings = {
  count: number;
  tile: number;
  radius: number;
  edge: number;
  strength: number;
  split: number;
  soft: number;
  shine: number;
  shade: number;
  tint: string;
  tintOpacity: number;
  plate: string;
  hover: string;
  labels: string;
  tilt: number;
  spread: number;
  parallax: number;
  intro: boolean;
  colors: string[];
  colorKey: string;
};

type Engine = {
  hover: (index: number, on: boolean) => void;
  aim: (index: number, x: number, y: number) => void;
  press: (index: number, on: boolean) => void;
  sync: () => void;
};

const GRADIENTS: Record<string, string> = {
  blue: 'linear-gradient(135deg, hsl(214, 95%, 66%), hsl(226, 80%, 50%))',
  purple: 'linear-gradient(135deg, hsl(276, 84%, 70%), hsl(262, 66%, 52%))',
  red: 'linear-gradient(135deg, hsl(354, 95%, 68%), hsl(342, 80%, 52%))',
  indigo: 'linear-gradient(135deg, hsl(236, 90%, 72%), hsl(246, 64%, 54%))',
  orange: 'linear-gradient(135deg, hsl(38, 100%, 62%), hsl(20, 94%, 54%))',
  green: 'linear-gradient(135deg, hsl(146, 66%, 54%), hsl(162, 82%, 34%))',
  teal: 'linear-gradient(135deg, hsl(184, 80%, 56%), hsl(196, 84%, 40%))',
  pink: 'linear-gradient(135deg, hsl(326, 92%, 74%), hsl(314, 70%, 54%))',
  graphite: 'linear-gradient(135deg, hsl(140, 4%, 46%), hsl(140, 6%, 22%))',
  silver: 'linear-gradient(135deg, hsl(140, 5%, 92%), hsl(140, 4%, 70%))'
};

const THEMES: Record<string, Record<string, string>> = {
  dark: {
    '--glass-icons-label': 'rgba(244, 245, 244, 0.86)',
    '--glass-icons-edge': 'rgba(255, 255, 255, 0.16)',
    '--glass-icons-fallback': 'rgba(255, 255, 255, 0.1)',
    '--glass-icons-drop': 'rgba(0, 0, 0, 0.45)',
    '--glass-icons-shade': '0.35'
  },
  light: {
    '--glass-icons-label': 'rgba(22, 24, 22, 0.78)',
    '--glass-icons-edge': 'rgba(22, 24, 22, 0.08)',
    '--glass-icons-fallback': 'rgba(255, 255, 255, 0.32)',
    '--glass-icons-drop': 'rgba(22, 24, 22, 0.28)',
    '--glass-icons-shade': '0.22'
  }
};

const LIGHT_INK = '#252825';

const PLATES = ['tilt', 'offset', 'circle', 'none'];
const HOVERS = ['lift', 'float', 'press', 'none'];
const LABELS = ['hover', 'always', 'none'];
const PLATE_CODES: Record<string, number> = { none: 0, tilt: 1, offset: 2, circle: 3 };
const SIDES: Record<string, number> = { top: 0, right: 90, bottom: 180, left: 270 };
const STAGGER = 0.07;
const MAPS = new Map<string, Maps>();

const VERTEX = `#version 300 es
in vec2 aCorner;
uniform vec2 uCanvas;
uniform vec2 uCenter;
uniform float uExtent;
out vec2 vLocal;
void main() {
  vLocal = aCorner * uExtent;
  vec2 position = (uCenter + vLocal) / uCanvas * 2.0 - 1.0;
  gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vLocal;
out vec4 outColor;
uniform float uSize;
uniform float uRadius;
uniform float uBevel;
uniform float uStrength;
uniform float uSplit;
uniform float uSoft;
uniform float uShine;
uniform float uShade;
uniform vec4 uTint;
uniform vec2 uLight;
uniform int uPlate;
uniform vec2 uOrigin;
uniform mat2 uTurn;
uniform vec2 uShift;
uniform vec2 uOffset;
uniform float uScale;
uniform float uDisc;
uniform float uRow;
uniform vec2 uDirection;
uniform float uSpan;
uniform sampler2D uGradients;
uniform vec2 uLift;
uniform float uGlassScale;
uniform float uGlassAlpha;
uniform float uPlateAlpha;
uniform float uPixel;

float roundBox(vec2 p, float reach, float radius) {
  vec2 q = abs(p) - vec2(reach - radius);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

vec2 roundNormal(vec2 p, float reach, float radius) {
  vec2 q = abs(p) - vec2(reach - radius);
  vec2 s = vec2(p.x < 0.0 ? -1.0 : 1.0, p.y < 0.0 ? -1.0 : 1.0);
  if (q.x > 0.0 && q.y > 0.0) return normalize(q) * s;
  return q.x > q.y ? vec2(s.x, 0.0) : vec2(0.0, s.y);
}

vec4 plate(vec2 p, float soft) {
  if (uPlate == 0) return vec4(0.0);
  vec2 q = uTurn * ((p - uOrigin - uShift) / uScale) + uOrigin - uOffset;
  float d = uPlate == 3 ? length(q) - uDisc : roundBox(q, uSize * 0.5, uRadius);
  float a = clamp(0.5 - d / soft, 0.0, 1.0);
  if (a <= 0.0) return vec4(0.0);
  float t = clamp(dot(q, uDirection) / uSpan + 0.5, 0.0, 1.0);
  return vec4(texture(uGradients, vec2(t, uRow)).rgb * a, a);
}

void main() {
  vec2 p = vLocal;
  float reach = uSize * 0.5;
  vec2 g = (p - uLift) / uGlassScale;
  float dg = roundBox(g, reach, uRadius);
  float glass = clamp(0.5 - dg * uGlassScale / uPixel, 0.0, 1.0) * uGlassAlpha;

  vec4 color = plate(p, uPixel) * uPlateAlpha;
  if (color.a > 0.0) {
    float drop = roundBox(g - vec2(0.0, uSize * 0.1), reach, uRadius);
    color.rgb *= 1.0 - (1.0 - smoothstep(-uSize * 0.12, uSize * 0.14, drop)) * 0.28 * uGlassAlpha;
  }

  if (glass > 0.0) {
    float inside = max(0.0, -dg);
    float t = 1.0 - clamp(inside / uBevel, 0.0, 1.0);
    vec2 n = roundNormal(g, reach, uRadius);
    vec2 bend = n * pow(t, 2.2);
    vec4 seen = vec4(0.0);
    if (uPlate != 0) {
      vec4 red = plate(p - bend * (uStrength + uSplit), uSoft);
      vec4 green = plate(p - bend * uStrength, uSoft);
      vec4 blue = plate(p - bend * (uStrength - uSplit), uSoft);
      seen = vec4(red.r, green.g, blue.b, green.a) * uPlateAlpha;
      float luma = dot(seen.rgb, vec3(0.2126, 0.7152, 0.0722));
      seen.rgb = clamp(mix(vec3(luma), seen.rgb, 1.25) * 1.04, 0.0, 1.0);
      seen.rgb = min(mix(seen.rgb, uTint.rgb * seen.a, uTint.a), vec3(seen.a));
    }
    float facing = dot(n, uLight);
    float rim = clamp(inside / 1.2, 0.0, 1.0);
    float shade = (max(-facing, 0.0) * 0.75 + 0.25) * t * t * rim * uShade;
    float light = clamp((max(facing, 0.0) * 0.95 + max(-facing, 0.0) * 0.35) * t * t * t * rim * uShine, 0.0, 1.0);
    seen = seen * (1.0 - shade) + vec4(0.0, 0.0, 0.0, shade);
    seen = seen * (1.0 - light) + vec4(light);
    color = mix(color, seen, glass);
  }
  outColor = color;
}`;

const UNIFORMS = [
  'uCanvas',
  'uCenter',
  'uExtent',
  'uSize',
  'uRadius',
  'uBevel',
  'uStrength',
  'uSplit',
  'uSoft',
  'uShine',
  'uShade',
  'uTint',
  'uLight',
  'uPlate',
  'uOrigin',
  'uTurn',
  'uShift',
  'uOffset',
  'uScale',
  'uDisc',
  'uRow',
  'uDirection',
  'uSpan',
  'uGradients',
  'uLift',
  'uGlassScale',
  'uGlassAlpha',
  'uPlateAlpha',
  'uPixel'
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const ease = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const fade = (from: number, to: number, t: number) => {
  const x = clamp((t - from) / (to - from), 0, 1);
  return x * x * (3 - 2 * x);
};

const drive = (
  value: number,
  velocity: number,
  target: number,
  stiffness: number,
  damping: number,
  dt: number
): [number, number] => {
  const next = velocity + (stiffness * (target - value) - damping * velocity) * dt;
  return [value + next * dt, next];
};

const isDark = (color: string) => {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(color).trim())?.[1];
  if (!hex) return false;
  const full = hex.length === 3 ? [...hex].map(c => c + c).join('') : hex;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5;
};

const splitTopLevel = (text: string) => {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') depth--;
    else if (text[i] === ',' && depth === 0) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts;
};

const parseGradient = (value: string): Gradient => {
  const text = String(value).trim();
  const match = /^linear-gradient\((.*)\)$/is.exec(text);
  if (!match) {
    return {
      angle: 180,
      stops: [
        [0, text],
        [1, text]
      ]
    };
  }
  const parts = splitTopLevel(match[1]);
  const head = parts[0].toLowerCase();
  let angle = 180;
  if (/^-?[\d.]+(deg|turn|rad|grad)$/.test(head)) {
    const number = parseFloat(head);
    if (head.endsWith('turn')) angle = number * 360;
    else if (head.endsWith('grad')) angle = number * 0.9;
    else if (head.endsWith('rad')) angle = (number * 180) / Math.PI;
    else angle = number;
    parts.shift();
  } else if (head.startsWith('to ')) {
    const sides = head.slice(3).split(/\s+/);
    const vertical = sides.includes('top') ? -1 : sides.includes('bottom') ? 1 : 0;
    const horizontal = sides.includes('left') ? -1 : sides.includes('right') ? 1 : 0;
    angle = sides.length === 1 ? (SIDES[sides[0]] ?? 180) : (Math.atan2(horizontal, -vertical) * 180) / Math.PI;
    parts.shift();
  }
  const stops = parts.map((part): [number | null, string] => {
    const stop = /^(.*?)\s+(-?[\d.]+)%$/.exec(part);
    return stop ? [Number(stop[2]) / 100, stop[1].trim()] : [null, part];
  });
  if (!stops.length) stops.push([0, '#ffffff']);
  if (stops[0][0] === null) stops[0][0] = 0;
  if (stops[stops.length - 1][0] === null) stops[stops.length - 1][0] = 1;
  for (let i = 1; i < stops.length - 1; i++) {
    if (stops[i][0] !== null) continue;
    let next = i + 1;
    while (stops[next][0] === null) next++;
    const from = stops[i - 1][0] as number;
    stops[i][0] = from + ((stops[next][0] as number) - from) / (next - i + 1);
  }
  return { angle, stops: stops as [number, string][] };
};

const buildMaps = (size: number, radius: number, bevel: number): Maps | null => {
  const key = `${size}:${radius}:${bevel}`;
  const cached = MAPS.get(key);
  if (cached) return cached;
  const res = 2;
  const w = Math.max(8, Math.round(size * res));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = w;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const refraction = ctx.createImageData(w, w);
  const shine = ctx.createImageData(w, w);
  const shade = ctx.createImageData(w, w);
  const r = Math.min(radius * res, w / 2);
  const band = Math.max(1, bevel * res);
  const half = w / 2;
  const lx = -0.55;
  const ly = -0.83;
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - half;
      const py = y + 0.5 - half;
      const qx = Math.abs(px) - (half - r);
      const qy = Math.abs(py) - (half - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const distance = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
      let nx = 0;
      let ny = 0;
      if (qx > 0 && qy > 0) {
        const length = Math.hypot(ox, oy) || 1;
        nx = (ox / length) * Math.sign(px);
        ny = (oy / length) * Math.sign(py);
      } else if (qx > qy) {
        nx = Math.sign(px);
      } else {
        ny = Math.sign(py);
      }
      const inside = -distance;
      const t = inside >= band ? 0 : inside <= 0 ? 1 : 1 - inside / band;
      const slope = Math.pow(t, 2.2);
      const i = (y * w + x) * 4;
      refraction.data[i] = Math.round(128 + 127 * nx * slope);
      refraction.data[i + 1] = Math.round(128 + 127 * ny * slope);
      refraction.data[i + 2] = 128;
      refraction.data[i + 3] = 255;
      const facing = nx * lx + ny * ly;
      const edge = inside <= 0 ? 0 : Math.min(1, inside / (1.2 * res));
      const glow = (Math.max(0, facing) * 0.95 + Math.max(0, -facing) * 0.35) * t * t * t * edge;
      shine.data[i] = 255;
      shine.data[i + 1] = 255;
      shine.data[i + 2] = 255;
      shine.data[i + 3] = Math.round(255 * Math.min(1, glow));
      const dim = (Math.max(0, -facing) * 0.75 + 0.25) * t * t * edge;
      shade.data[i + 3] = Math.round(255 * Math.min(1, dim));
    }
  }
  ctx.putImageData(refraction, 0, 0);
  const refractionUrl = canvas.toDataURL();
  ctx.putImageData(shine, 0, 0);
  const shineUrl = canvas.toDataURL();
  ctx.putImageData(shade, 0, 0);
  const shadeUrl = canvas.toDataURL();
  const maps: Maps = { refractionUrl, shineUrl, shadeUrl };
  MAPS.set(key, maps);
  return maps;
};

const supportsLiquid = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const agent = navigator.userAgent;
  const safari = /Safari/.test(agent) && !/Chrome|Chromium|Edg/.test(agent);
  if (safari || /Firefox/.test(agent)) return false;
  return window.CSS?.supports?.('backdrop-filter', 'url(#a)') ?? false;
};

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const poseOf = (state: Motion, s: Settings) => {
  const size = s.tile;
  const enter = clamp(state.e, 0, 1);
  const swing = ease((enter - 0.18) / 0.82);
  const hover = state.h;
  const lift = s.hover === 'lift' ? hover : 0;
  const clear = s.plate === 'none';
  let liftY = 0;
  let glassScale = 1;
  if (!clear && s.hover === 'lift') liftY = -0.08 * size * hover;
  if (!clear && s.hover === 'float') liftY = -0.14 * size * hover;
  if (s.hover === 'press') {
    liftY = clear ? 0 : -0.03 * size * hover;
    glassScale = 1 - 0.08 * state.p;
  }
  const settle = clear ? 1 : 0.92 + 0.08 * ease(enter);
  const glyphRise = (1 - ease((enter - 0.25) / 0.75)) * 0.1 * size;
  const shift = [-state.x * s.parallax * 0.07 * size, -state.y * s.parallax * 0.07 * size];
  let angle = 0;
  let offset: [number, number] = [0, 0];
  let grow = 1;
  if (s.plate === 'tilt') {
    angle = (s.tilt + 10 * lift) * swing;
    offset = [-0.08 * size * lift, -0.08 * size * lift];
  } else if (s.plate === 'offset') {
    const reach = s.spread * (0.26 + 0.08 * lift) * size * swing;
    offset = [reach, -reach];
  } else if (s.plate === 'circle') {
    const reach = (s.spread * (0.24 + 0.06 * lift) + 0.06 * lift) * size * swing;
    offset = [reach, -reach];
    grow = 1 + 0.08 * lift;
  }
  const light = [-0.55 + state.x * 0.35, -0.83 + state.y * 0.35];
  const length = Math.hypot(light[0], light[1]) || 1;
  return {
    liftY,
    glassScale: clear ? 1 : glassScale * settle,
    domScale: clear ? 1 : glassScale * settle,
    glassAlpha: fade(0, 0.55, enter),
    plateAlpha: fade(0, 0.35, enter),
    faceY: (clear ? -0.05 * size * hover : liftY) + glyphRise,
    faceScale: glassScale,
    faceAlpha: fade(0.3, 0.85, enter),
    plateScale: (s.hover === 'press' ? 1 - 0.08 * state.p : 1) * grow,
    shift,
    angle,
    offset,
    bend: 1 + 1.2 * (1 - ease(enter)),
    glow: 1 + (clear ? 0.6 : 0.25) * hover,
    light: [light[0] / length, light[1] / length]
  };
};

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return cloneVNode(node);
  return h(node as Component);
};

export const GlassIconsGlyph = (props: { node?: unknown }) => renderNode(props.node);
GlassIconsGlyph.props = ['node'];

export const GlassIconsTag: FunctionalComponent<{ tag: string; [key: string]: unknown }> = (props, { attrs, slots }) =>
  h(props.tag, attrs, slots.default?.());
GlassIconsTag.props = ['tag'];
GlassIconsTag.inheritAttrs = false;
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, useId, watch } from 'vue';

const props = withDefaults(defineProps<GlassIconsProps>(), {
  items: () => [],
  size: 82,
  gap: 66,
  columns: 3,
  roundness: 0.6,
  refraction: 0.8,
  bevel: 0.6,
  dispersion: 0,
  frost: 0.2,
  shine: 0.85,
  tint: '#dfdfdf',
  tintOpacity: 0.2,
  iconColor: undefined,
  plate: 'tilt',
  tilt: 30,
  spread: 0.5,
  hover: 'press',
  parallax: 1,
  labels: 'hover',
  intro: true,
  theme: 'dark',
  className: '',
  style: undefined
});

const filterId = `glass-icons-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
const rootRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const plateRefs: (HTMLElement | null)[] = [];
const glassRefs: (HTMLElement | null)[] = [];
const faceRefs: (HTMLElement | null)[] = [];
const labelRefs: (HTMLElement | null)[] = [];
let engine: Engine | null = null;
let stop: (() => void) | null = null;
const gpu = ref(false);
const liquid = ref(false);
const maps = shallowRef<Maps | null>(null);

const tile = computed(() => Math.max(24, Math.round(props.size)));
const radius = computed(() => Math.round((tile.value / 2) * clamp(props.roundness, 0, 1)));
const edge = computed(() => Math.max(2, Math.round(tile.value * 0.26 * clamp(props.bevel, 0, 1))));
const plateMode = computed(() => (PLATES.includes(props.plate) ? props.plate : 'tilt'));
const hoverMode = computed(() => (HOVERS.includes(props.hover) ? props.hover : 'lift'));
const labelMode = computed(() => (LABELS.includes(props.labels) ? props.labels : 'hover'));
const ink = computed(
  () => props.iconColor ?? (props.theme === 'light' && plateMode.value === 'none' ? LIGHT_INK : '#ffffff')
);
const colors = computed(() =>
  props.items.map(item => (item.color && GRADIENTS[item.color]) || item.color || GRADIENTS.blue)
);

const settings = computed<Settings>(() => ({
  count: props.items.length,
  tile: tile.value,
  radius: radius.value,
  edge: edge.value,
  strength: tile.value * 0.3 * clamp(props.refraction, 0, 1.5),
  split: tile.value * 0.07 * clamp(props.dispersion, 0, 1) * clamp(props.refraction, 0, 1.5),
  soft: 1 + clamp(props.frost, 0, 1) * tile.value * 0.15,
  shine: clamp(props.shine, 0, 1),
  shade: props.theme === 'light' ? 0.22 : 0.35,
  tint: props.tint,
  tintOpacity: clamp(props.tintOpacity, 0, 1),
  plate: plateMode.value,
  hover: hoverMode.value,
  labels: labelMode.value,
  tilt: props.tilt,
  spread: clamp(props.spread, 0, 1),
  parallax: clamp(props.parallax, 0, 1),
  intro: props.intro,
  colors: colors.value,
  colorKey: colors.value.join('|')
}));

const clearGlass = computed(() => plateMode.value === 'none');
const glassFilter = computed(() =>
  clearGlass.value && liquid.value && maps.value
    ? `url(#${filterId}) saturate(1.35) brightness(1.04)`
    : `blur(${(2 + clamp(props.frost, 0, 1) * 10).toFixed(1)}px) saturate(1.4)`
);
const blur = computed(() => clamp(props.frost, 0, 1) * tile.value * 0.06);

const rootClass = computed(
  () =>
    `glass-icons${props.intro ? ' is-intro' : ''} glass-icons--labels-${labelMode.value}${props.className ? ` ${props.className}` : ''}`
);

const rootStyle = computed(
  () =>
    ({
      ...(THEMES[props.theme] ?? THEMES.dark),
      '--glass-icons-size': `${tile.value}px`,
      '--glass-icons-radius': `${radius.value}px`,
      '--glass-icons-gap': `${Math.max(0, props.gap)}px`,
      '--glass-icons-row-gap': `${Math.max(0, props.gap) + (labelMode.value === 'always' ? 26 : 0)}px`,
      '--glass-icons-columns': props.columns > 0 ? Math.round(props.columns) : Math.max(1, props.items.length),
      '--glass-icons-tint': `color-mix(in srgb, ${props.tint} ${Math.round(clamp(props.tintOpacity, 0, 1) * 100)}%, transparent)`,
      '--glass-icons-ink': ink.value,
      '--glass-icons-glyph-shadow': isDark(ink.value) ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.28)',
      '--glass-icons-tilt': `${props.tilt}deg`,
      '--glass-icons-spread': clamp(props.spread, 0, 1),
      '--glass-icons-shine': clamp(props.shine, 0, 1),
      ...props.style
    }) as CSSProperties
);

const linkAttrs = (item: GlassIconsItem) =>
  item.href
    ? { href: item.href, target: item.target, rel: item.target === '_blank' ? 'noreferrer' : undefined }
    : { type: 'button' };

const setPlateRef = (element: unknown, index: number) => {
  plateRefs[index] = element as HTMLElement | null;
};
const setGlassRef = (element: unknown, index: number) => {
  glassRefs[index] = element as HTMLElement | null;
};
const setFaceRef = (element: unknown, index: number) => {
  faceRefs[index] = element as HTMLElement | null;
};
const setLabelRef = (element: unknown, index: number) => {
  labelRefs[index] = element as HTMLElement | null;
};

const start = (): (() => void) | null => {
  const root = rootRef.value;
  const canvas = canvasRef.value;
  if (!root || !canvas) return null;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const states: Motion[] = [];
  const layout = { width: 1, height: 1, margin: 0, dpr: 1, centers: [] as number[][] };
  const paint = document.createElement('canvas');
  const paintContext = paint.getContext('2d');
  let gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let texture: WebGLTexture | null = null;
  let vertex: WebGLShader | null = null;
  let fragment: WebGLShader | null = null;
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  let gradientKey = '';
  let gradients: Gradient[] = [];
  let tintKey = '';
  let tintColor = [1, 1, 1];
  let raf = 0;
  let last = 0;
  let alive = true;
  let entered = false;

  if (gl) {
    vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    program = gl.createProgram();
    if (vertex && fragment && program) {
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
    }
    if (!program || !vertex || !fragment || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl = null;
    } else {
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const corner = gl.getAttribLocation(program, 'aCorner');
      gl.enableVertexAttribArray(corner);
      gl.vertexAttribPointer(corner, 2, gl.FLOAT, false, 0, 0);
      for (const name of UNIFORMS) uniforms[name] = gl.getUniformLocation(program, name);
      texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(uniforms.uGradients, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
  }
  gpu.value = Boolean(gl);

  const stateOf = (index: number): Motion => {
    while (states.length <= index) {
      const start = settings.value.intro && !reduce ? 0 : 1;
      states.push({
        h: 0,
        hv: 0,
        ht: 0,
        p: 0,
        pv: 0,
        pt: 0,
        x: 0,
        xv: 0,
        xt: 0,
        y: 0,
        yv: 0,
        yt: 0,
        e: start,
        ev: 0,
        et: start,
        at: 0
      });
    }
    return states[index];
  };

  const refreshTextures = () => {
    const s = settings.value;
    if (paintContext && s.tint !== tintKey) {
      tintKey = s.tint;
      paint.width = 1;
      paint.height = 1;
      paintContext.fillStyle = '#ffffff';
      paintContext.fillStyle = String(s.tint);
      paintContext.fillRect(0, 0, 1, 1);
      const [r, g, b] = paintContext.getImageData(0, 0, 1, 1).data;
      tintColor = [r / 255, g / 255, b / 255];
    }
    if (!gl || !paintContext || s.colorKey === gradientKey) return;
    gradientKey = s.colorKey;
    gradients = s.colors.map(parseGradient);
    paint.width = 256;
    paint.height = Math.max(1, gradients.length);
    gradients.forEach((gradient, row) => {
      const fill = paintContext.createLinearGradient(0, 0, 256, 0);
      gradient.stops.forEach(([at, color]) => {
        try {
          fill.addColorStop(clamp(at, 0, 1), color);
        } catch {
          fill.addColorStop(clamp(at, 0, 1), '#ffffff');
        }
      });
      paintContext.fillStyle = fill;
      paintContext.fillRect(0, row, 256, 1);
    });
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paint);
  };

  const measure = () => {
    const s = settings.value;
    const margin = Math.ceil(s.tile * 0.7);
    layout.margin = margin;
    layout.width = Math.max(1, root.clientWidth + margin * 2);
    layout.height = Math.max(1, root.clientHeight + margin * 2);
    layout.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.left = `${-margin}px`;
    canvas.style.top = `${-margin}px`;
    canvas.style.width = `${layout.width}px`;
    canvas.style.height = `${layout.height}px`;
    const width = Math.round(layout.width * layout.dpr);
    const height = Math.round(layout.height * layout.dpr);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    layout.centers = Array.from(root.querySelectorAll<HTMLElement>('[data-glass-icon]')).map(icon => [
      icon.offsetLeft + icon.offsetWidth / 2 + margin,
      icon.offsetTop + icon.offsetHeight / 2 + margin
    ]);
  };

  const applyDom = () => {
    const s = settings.value;
    for (let i = 0; i < s.count; i++) {
      const pose = poseOf(stateOf(i), s);
      const glass = glassRefs[i];
      if (glass) {
        glass.style.transform = `translate3d(0, ${pose.liftY.toFixed(2)}px, 0) scale(${pose.domScale.toFixed(4)})`;
        glass.style.opacity = pose.glassAlpha.toFixed(3);
      }
      const face = faceRefs[i];
      if (face) {
        face.style.transform = `translate3d(0, ${pose.faceY.toFixed(2)}px, 0) scale(${pose.faceScale.toFixed(4)})`;
        face.style.opacity = pose.faceAlpha.toFixed(3);
      }
      const label = labelRefs[i];
      if (label && s.labels === 'always') label.style.opacity = pose.faceAlpha.toFixed(3);
      const card = plateRefs[i];
      if (card) {
        const [sx, sy] = pose.shift;
        const [ox, oy] = pose.offset;
        card.style.transform = `translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px) scale(${pose.plateScale.toFixed(4)}) rotate(${pose.angle.toFixed(3)}deg) translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`;
        card.style.opacity = pose.plateAlpha.toFixed(3);
      }
    }
  };

  const draw = () => {
    if (!gl) return;
    const s = settings.value;
    refreshTextures();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!s.count) return;
    const size = s.tile;
    gl.uniform2f(uniforms.uCanvas, layout.width, layout.height);
    gl.uniform1f(uniforms.uExtent, size * 1.08);
    gl.uniform1f(uniforms.uSize, size);
    gl.uniform1f(uniforms.uRadius, Math.min(s.radius, size / 2));
    gl.uniform1f(uniforms.uBevel, s.edge);
    gl.uniform1f(uniforms.uSoft, s.soft);
    gl.uniform1f(uniforms.uShade, s.shade);
    gl.uniform4f(uniforms.uTint, tintColor[0], tintColor[1], tintColor[2], s.tintOpacity);
    gl.uniform1i(uniforms.uPlate, PLATE_CODES[s.plate]);
    gl.uniform1f(uniforms.uDisc, size * 0.41);
    gl.uniform1f(uniforms.uPixel, 1 / layout.dpr);
    const origin = s.plate === 'tilt' ? size / 2 : 0;
    gl.uniform2f(uniforms.uOrigin, origin, origin);
    for (let i = 0; i < s.count; i++) {
      const center = layout.centers[i];
      if (!center) continue;
      const pose = poseOf(stateOf(i), s);
      const gradient = gradients[i] ?? { angle: 180 };
      const turn = (-pose.angle * Math.PI) / 180;
      const box = s.plate === 'circle' ? size * 0.82 : size;
      const direction = (gradient.angle * Math.PI) / 180;
      const dx = Math.sin(direction);
      const dy = -Math.cos(direction);
      gl.uniform2f(uniforms.uCenter, center[0], center[1]);
      gl.uniform1f(uniforms.uStrength, s.strength * pose.bend);
      gl.uniform1f(uniforms.uSplit, s.split * pose.bend);
      gl.uniform1f(uniforms.uShine, s.shine * pose.glow);
      gl.uniform2f(uniforms.uLight, pose.light[0], pose.light[1]);
      gl.uniformMatrix2fv(uniforms.uTurn, false, [Math.cos(turn), Math.sin(turn), -Math.sin(turn), Math.cos(turn)]);
      gl.uniform2f(uniforms.uShift, pose.shift[0], pose.shift[1]);
      gl.uniform2f(uniforms.uOffset, pose.offset[0], pose.offset[1]);
      gl.uniform1f(uniforms.uScale, pose.plateScale);
      gl.uniform1f(uniforms.uRow, (i + 0.5) / Math.max(1, gradients.length));
      gl.uniform2f(uniforms.uDirection, dx, dy);
      gl.uniform1f(uniforms.uSpan, Math.max(1, Math.abs(box * dx) + Math.abs(box * dy)));
      gl.uniform2f(uniforms.uLift, 0, pose.liftY);
      gl.uniform1f(uniforms.uGlassScale, pose.glassScale);
      gl.uniform1f(uniforms.uGlassAlpha, pose.glassAlpha);
      gl.uniform1f(uniforms.uPlateAlpha, pose.plateAlpha);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  };

  const tick = (now: number) => {
    raf = 0;
    if (!alive) return;
    const s = settings.value;
    const time = now / 1000;
    const dt = last ? Math.min(1 / 30, time - last) : 1 / 60;
    last = time;
    const steps = Math.max(1, Math.ceil(dt * 240));
    const h = dt / steps;
    let moving = false;
    for (let i = 0; i < s.count; i++) {
      const state = stateOf(i);
      if (state.et === 0) {
        if (entered && time >= state.at) state.et = 1;
        else moving = moving || entered;
      }
      if (reduce) {
        state.h = state.ht;
        state.p = state.pt;
        state.x = state.xt;
        state.y = state.yt;
        state.e = state.et;
        continue;
      }
      for (let k = 0; k < steps; k++) {
        [state.h, state.hv] = drive(state.h, state.hv, state.ht, 170, 24, h);
        [state.p, state.pv] = drive(state.p, state.pv, state.pt, 420, 40, h);
        [state.x, state.xv] = drive(state.x, state.xv, state.xt, 90, 19, h);
        [state.y, state.yv] = drive(state.y, state.yv, state.yt, 90, 19, h);
        [state.e, state.ev] = drive(state.e, state.ev, state.et, 60, 15.5, h);
      }
      const pairs: [keyof Motion, keyof Motion, keyof Motion][] = [
        ['h', 'hv', 'ht'],
        ['p', 'pv', 'pt'],
        ['x', 'xv', 'xt'],
        ['y', 'yv', 'yt'],
        ['e', 'ev', 'et']
      ];
      for (const [value, velocity, target] of pairs) {
        if (Math.abs(state[target] - state[value]) < 0.0005 && Math.abs(state[velocity]) < 0.001) {
          state[value] = state[target];
          state[velocity] = 0;
        } else {
          moving = true;
        }
      }
    }
    applyDom();
    draw();
    if (moving) raf = requestAnimationFrame(tick);
    else last = 0;
  };

  const wake = () => {
    if (!raf && alive) raf = requestAnimationFrame(tick);
  };

  const visibility = new IntersectionObserver(
    entries => {
      if (entered || !entries.some(entry => entry.isIntersecting)) return;
      entered = true;
      const time = performance.now() / 1000;
      for (let i = 0; i < settings.value.count; i++) stateOf(i).at = time + i * STAGGER;
      wake();
    },
    { threshold: 0.15 }
  );
  visibility.observe(root);

  const resizeObserver = new ResizeObserver(() => {
    measure();
    applyDom();
    draw();
  });
  resizeObserver.observe(root);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    gl = null;
    gpu.value = false;
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  engine = {
    hover: (index: number, on: boolean) => {
      const state = stateOf(index);
      state.ht = on ? 1 : 0;
      if (!on) {
        state.xt = 0;
        state.yt = 0;
        state.pt = 0;
      }
      wake();
    },
    aim: (index: number, x: number, y: number) => {
      const state = stateOf(index);
      state.xt = x;
      state.yt = y;
      wake();
    },
    press: (index: number, on: boolean) => {
      stateOf(index).pt = on ? 1 : 0;
      wake();
    },
    sync: () => {
      measure();
      applyDom();
      draw();
      wake();
    }
  };
  engine.sync();

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    engine = null;
    visibility.disconnect();
    resizeObserver.disconnect();
    canvas.removeEventListener('webglcontextlost', onContextLost);
    if (gl) {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    }
  };
};

watch([tile, radius, edge], () => {
  maps.value = buildMaps(tile.value, radius.value, edge.value);
});

watch(settings, () => engine?.sync(), { flush: 'post' });

onUpdated(() => {
  engine?.sync();
});

onMounted(() => {
  liquid.value = supportsLiquid();
  maps.value = buildMaps(tile.value, radius.value, edge.value);
  stop = start();
});

onBeforeUnmount(() => {
  stop?.();
  stop = null;
});

const point = (index: number, event: PointerEvent) => {
  if (event.pointerType === 'touch') return;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  engine?.aim(index, clamp(x, -1, 1), clamp(y, -1, 1));
};

const focusVisible = (element: HTMLElement) => {
  try {
    return element.matches(':focus-visible');
  } catch {
    return false;
  }
};

const onEnter = (index: number, event: PointerEvent) => {
  if (event.pointerType !== 'touch') engine?.hover(index, true);
};

const onLeave = (index: number) => {
  engine?.hover(index, false);
};

const onPress = (index: number, on: boolean) => {
  engine?.press(index, on);
};

const onFocus = (index: number, event: FocusEvent) => {
  if (focusVisible(event.currentTarget as HTMLElement)) engine?.hover(index, true);
};

const onClick = (item: GlassIconsItem, event: MouseEvent) => {
  item.onClick?.(event);
};
</script>

<template>
  <div ref="rootRef" :class="rootClass" :style="rootStyle">
    <svg v-if="clearGlass && liquid && maps" class="glass-icons-defs" aria-hidden="true" focusable="false">
      <filter :id="filterId" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
        <feImage
          :href="maps.refractionUrl"
          x="0"
          y="0"
          :width="tile"
          :height="tile"
          preserveAspectRatio="none"
          result="map"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          :scale="-settings.strength * 2 - settings.split * 2"
          xChannelSelector="R"
          yChannelSelector="G"
          result="shiftRed"
        />
        <feColorMatrix in="shiftRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          :scale="-settings.strength * 2"
          xChannelSelector="R"
          yChannelSelector="G"
          result="shiftGreen"
        />
        <feColorMatrix
          in="shiftGreen"
          type="matrix"
          values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
          result="green"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          :scale="-settings.strength * 2 + settings.split * 2"
          xChannelSelector="R"
          yChannelSelector="G"
          result="shiftBlue"
        />
        <feColorMatrix in="shiftBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feBlend in="red" in2="green" mode="screen" result="redGreen" />
        <feBlend in="redGreen" in2="blue" mode="screen" result="glass" />
        <feGaussianBlur v-if="blur > 0" in="glass" :stdDeviation="blur.toFixed(2)" />
      </filter>
    </svg>

    <canvas ref="canvasRef" class="glass-icons-canvas" aria-hidden="true" />

    <GlassIconsTag
      :tag="item.href ? 'a' : 'button'"
      v-for="(item, index) in items"
      :key="item.id ?? index"
      :class="`glass-icon${item.className ? ` ${item.className}` : ''}`"
      data-glass-icon=""
      :aria-label="item.label"
      v-bind="linkAttrs(item)"
      @click="(event: MouseEvent) => onClick(item, event)"
      @pointerenter="(event: PointerEvent) => onEnter(index, event)"
      @pointermove="(event: PointerEvent) => point(index, event)"
      @pointerleave="onLeave(index)"
      @pointerdown="onPress(index, true)"
      @pointerup="onPress(index, false)"
      @pointercancel="onPress(index, false)"
      @focus="(event: FocusEvent) => onFocus(index, event)"
      @blur="onLeave(index)"
    >
      <span
        v-if="!gpu && plateMode !== 'none'"
        :ref="element => setPlateRef(element, index)"
        :class="`glass-icon-plate glass-icon-plate--${plateMode}`"
        :style="{ background: settings.colors[index] }"
      />
      <span
        :ref="element => setGlassRef(element, index)"
        class="glass-icon-glass"
        :style="{ backdropFilter: glassFilter, WebkitBackdropFilter: glassFilter }"
      >
        <span v-if="!gpu && maps" class="glass-icon-shade" :style="{ backgroundImage: `url(${maps.shadeUrl})` }" />
        <span v-if="!gpu && maps" class="glass-icon-shine" :style="{ backgroundImage: `url(${maps.shineUrl})` }" />
      </span>
      <span :ref="element => setFaceRef(element, index)" class="glass-icon-face">
        <span class="glass-icon-glyph" aria-hidden="true">
          <GlassIconsGlyph :node="item.icon" />
        </span>
      </span>
      <span
        v-if="labelMode !== 'none' && item.label"
        :ref="element => setLabelRef(element, index)"
        class="glass-icon-label"
      >
        {{ item.label }}
      </span>
    </GlassIconsTag>
  </div>
</template>

<style>
.glass-icons {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--glass-icons-row-gap) var(--glass-icons-gap);
  box-sizing: border-box;
  max-width: calc(
    var(--glass-icons-columns) * var(--glass-icons-size) + (var(--glass-icons-columns) - 1) * var(--glass-icons-gap)
  );
  margin: 0 auto;
  isolation: isolate;
}

.glass-icons-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

.glass-icons-canvas {
  position: absolute;
  z-index: 1;
  display: block;
  pointer-events: none;
}

.glass-icon {
  position: relative;
  flex: none;
  width: var(--glass-icons-size);
  height: var(--glass-icons-size);
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.glass-icon-plate {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--glass-icons-radius);
  will-change: transform, opacity;
}

.glass-icon-plate--tilt {
  transform: rotate(var(--glass-icons-tilt));
  transform-origin: 100% 100%;
}

.glass-icon-plate--offset {
  transform: translate(calc(var(--glass-icons-spread) * 26%), calc(var(--glass-icons-spread) * -26%));
}

.glass-icon-plate--circle {
  inset: 9%;
  border-radius: 50%;
  transform: translate(calc(var(--glass-icons-spread) * 29%), calc(var(--glass-icons-spread) * -29%));
}

.glass-icon-glass {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  border-radius: var(--glass-icons-radius);
  background: linear-gradient(var(--glass-icons-tint), var(--glass-icons-tint));
  box-shadow: 0 12px 24px -14px var(--glass-icons-drop);
  will-change: transform, opacity;
}

.glass-icon-shade,
.glass-icon-shine {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-size: 100% 100%;
  pointer-events: none;
}

.glass-icon-shade {
  opacity: var(--glass-icons-shade);
}

.glass-icon-shine {
  opacity: var(--glass-icons-shine);
}

.glass-icon-face {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  border-radius: var(--glass-icons-radius);
  pointer-events: none;
  will-change: transform, opacity;
}

.glass-icon:focus-visible .glass-icon-face {
  outline: 2px solid var(--glass-icons-label);
  outline-offset: 4px;
}

.glass-icon-glyph {
  display: grid;
  place-items: center;
  width: 40%;
  height: 40%;
  color: var(--glass-icons-ink);
  filter: drop-shadow(0 1px 3px var(--glass-icons-glyph-shadow));
}

.glass-icon-glyph > svg {
  width: 100%;
  height: 100%;
}

.glass-icon-label {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  z-index: 2;
  color: var(--glass-icons-label);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  pointer-events: none;
  transform: translateX(-50%);
  transition:
    opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.glass-icons--labels-hover .glass-icon-label {
  opacity: 0;
  transform: translate(-50%, -4px);
}

.glass-icons--labels-hover .glass-icon:focus-visible .glass-icon-label {
  opacity: 1;
  transform: translate(-50%, 0);
}

.glass-icons.is-intro .glass-icon-plate,
.glass-icons.is-intro .glass-icon-glass,
.glass-icons.is-intro .glass-icon-face,
.glass-icons.is-intro.glass-icons--labels-always .glass-icon-label {
  opacity: 0;
}

@media (hover: hover) {
  .glass-icons--labels-hover .glass-icon:hover .glass-icon-label {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .glass-icon-label {
    transition: none;
  }
}
</style>
