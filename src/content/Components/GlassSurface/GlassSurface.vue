<script lang="ts">
import { isRef, type CSSProperties, type Ref } from 'vue';

export type GlassSurfaceChannel = 'R' | 'G' | 'B';

export type GlassSurfaceRenderer = 'auto' | 'svg' | 'webgl';

export type GlassSurfaceBackdrop = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;

export type GlassSurfaceBackdropSource =
  | Ref<GlassSurfaceBackdrop | null | undefined>
  | { current: GlassSurfaceBackdrop | null | undefined }
  | GlassSurfaceBackdrop
  | null;

export interface GlassSurfaceProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: GlassSurfaceChannel;
  yChannel?: GlassSurfaceChannel;
  mixBlendMode?: CSSProperties['mixBlendMode'];
  refraction?: boolean;
  renderer?: GlassSurfaceRenderer;
  backdrop?: GlassSurfaceBackdropSource;
  shape?: string;
  className?: string;
  style?: CSSProperties;
}

interface ShapeBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ShapeTrace {
  box: ShapeBox;
  depth: Float32Array;
  w: number;
  h: number;
  ratio: number;
  line: string;
  glow: string;
}

interface CachedTrace extends ShapeTrace {
  image: HTMLImageElement;
  width: number;
  height: number;
}

type ShapeArt =
  | { src: string; box: ShapeBox; line: string; glow: string; failed?: false }
  | { src: string; failed: true };

const FAR = 1e20;

const GLASS_VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const GLASS_FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uBackdrop;
uniform sampler2D uMap;
uniform vec2 uCanvas;
uniform vec2 uSize;
uniform vec2 uOrigin;
uniform vec2 uStep;
uniform vec3 uScale;
uniform ivec2 uChannel;
uniform float uSpread;
uniform float uLod;
uniform float uSaturation;
out vec4 outColor;

vec4 bend(vec2 p) {
  vec4 map = texture(uMap, clamp(p / uSize, 0.0, 1.0));
  vec2 shift = vec2(map[uChannel.x], map[uChannel.y]) - 0.5;
  vec2 base = uOrigin + p * uStep;
  vec4 red = textureLod(uBackdrop, base + shift * uScale.r * uStep, uLod);
  vec4 green = textureLod(uBackdrop, base + shift * uScale.g * uStep, uLod);
  vec4 blue = textureLod(uBackdrop, base + shift * uScale.b * uStep, uLod);
  return vec4(red.r, green.g, blue.b, (red.a + green.a + blue.a) / 3.0);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvas.y - gl_FragCoord.y) / uCanvas * uSize;
  vec4 color = vec4(0.0);
  if (uSpread < 0.05) {
    color = bend(p);
  } else {
    float total = 0.0;
    for (int j = -2; j <= 2; j++) {
      for (int i = -2; i <= 2; i++) {
        vec2 offset = vec2(float(i), float(j)) * uSpread * 0.8;
        float weight = exp(-dot(offset, offset) / (2.0 * uSpread * uSpread));
        color += bend(p + offset) * weight;
        total += weight;
      }
    }
    color /= total;
  }
  vec3 rgb = color.a > 0.0 ? color.rgb / color.a : vec3(0.0);
  float s = uSaturation;
  mat3 tone = mat3(
    0.213 + 0.787 * s, 0.213 - 0.213 * s, 0.213 - 0.213 * s,
    0.715 - 0.715 * s, 0.715 + 0.285 * s, 0.715 - 0.715 * s,
    0.072 - 0.072 * s, 0.072 - 0.072 * s, 0.072 + 0.928 * s
  );
  rgb = clamp(tone * rgb, 0.0, 1.0);
  outColor = vec4(rgb * color.a, color.a);
}`;

const CHANNELS: Record<string, number> = { R: 0, G: 1, B: 2, A: 3 };

const compileGlass = (gl: WebGL2RenderingContext) => {
  const make = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };
  const vertex = make(gl.VERTEX_SHADER, GLASS_VERTEX);
  const fragment = make(gl.FRAGMENT_SHADER, GLASS_FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

const resolveBackdrop = (backdrop: GlassSurfaceBackdropSource | undefined): GlassSurfaceBackdrop | null => {
  if (typeof window === 'undefined' || !backdrop) return null;
  let node: unknown = backdrop;
  if (isRef(backdrop)) node = backdrop.value;
  else if (typeof backdrop === 'object' && 'current' in backdrop) node = backdrop.current;
  if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement || node instanceof HTMLCanvasElement) {
    return node;
  }
  return null;
};

const sourceSize = (node: GlassSurfaceBackdrop): [number, number] => {
  if (node instanceof HTMLImageElement) return [node.naturalWidth, node.naturalHeight];
  if (node instanceof HTMLVideoElement) return [node.videoWidth, node.videoHeight];
  return [node.width, node.height];
};

const placeAxis = (value: string | undefined, free: number) => {
  if (!value) return free / 2;
  if (value.endsWith('%')) return (parseFloat(value) / 100) * free;
  const px = parseFloat(value);
  return Number.isFinite(px) ? px : free / 2;
};

const contentBox = (node: GlassSurfaceBackdrop): ShapeBox => {
  const rect = node.getBoundingClientRect();
  const [naturalWidth, naturalHeight] = sourceSize(node);
  const style = getComputedStyle(node);
  const fit = style.objectFit || 'fill';
  if (!naturalWidth || !naturalHeight || fit === 'fill') {
    return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
  }
  const contain = Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
  const cover = Math.max(rect.width / naturalWidth, rect.height / naturalHeight);
  const scale = fit === 'cover' ? cover : fit === 'contain' ? contain : fit === 'none' ? 1 : Math.min(1, contain);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  const [px, py] = (style.objectPosition || '50% 50%').split(' ');
  return {
    x: rect.left + placeAxis(px, rect.width - width),
    y: rect.top + placeAxis(py ?? px, rect.height - height),
    width,
    height
  };
};

const distanceLine = (f: Float64Array, d: Float64Array, v: Int32Array, z: Float64Array, n: number) => {
  let k = 0;
  v[0] = 0;
  z[0] = -FAR;
  z[1] = FAR;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = FAR;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
};

const distanceGrid = (grid: Float32Array, w: number, h: number) => {
  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    distanceLine(f, d, v, z, h);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    distanceLine(f, d, v, z, w);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }
};

const blurLine = (src: Float32Array, dst: Float32Array, offset: number, stride: number, n: number, r: number) => {
  const scale = 1 / (2 * r + 1);
  let sum = src[offset] * (r + 1);
  for (let i = 1; i <= r; i++) sum += src[offset + Math.min(i, n - 1) * stride];
  for (let i = 0; i < n; i++) {
    dst[offset + i * stride] = sum * scale;
    sum += src[offset + Math.min(i + r + 1, n - 1) * stride] - src[offset + Math.max(i - r, 0) * stride];
  }
};

const blurGrid = (grid: Float32Array, w: number, h: number, r: number) => {
  const tmp = new Float32Array(w * h);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) blurLine(grid, tmp, y * w, 1, w, r);
    for (let x = 0; x < w; x++) blurLine(tmp, grid, x, w, h, r);
  }
};

const settle = (x: number) => 1 / (1 + Math.exp(-1.702 * x));

const paint = (w: number, h: number, fill: (data: Uint8ClampedArray) => void) => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d')!;
  const image = context.createImageData(w, h);
  fill(image.data);
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
};

const shade = (depth: Float32Array, w: number, h: number, falloff: (t: number) => number) =>
  paint(w, h, data => {
    data.fill(255);
    for (let i = 0; i < w * h; i++) data[i * 4 + 3] = 255 * (1 - falloff(depth[i]));
  });

const traceShape = (image: HTMLImageElement, width: number, height: number, ratio: number): ShapeTrace => {
  const naturalWidth = image.naturalWidth || width;
  const naturalHeight = image.naturalHeight || height;
  const fit = Math.min(width / naturalWidth, height / naturalHeight);
  const box = {
    x: (width - naturalWidth * fit) / 2,
    y: (height - naturalHeight * fit) / 2,
    width: naturalWidth * fit,
    height: naturalHeight * fit
  };
  const w = Math.max(2, Math.round(width * ratio));
  const h = Math.max(2, Math.round(height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.drawImage(image, box.x * ratio, box.y * ratio, box.width * ratio, box.height * ratio);
  const pixels = context.getImageData(0, 0, w, h).data;
  const outside = new Float32Array(w * h);
  const inside = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const edge = 0.5 - pixels[i * 4 + 3] / 255;
    outside[i] = edge >= 0.5 ? FAR : Math.max(edge, 0) ** 2;
    inside[i] = edge <= -0.5 ? FAR : Math.min(edge, 0) ** 2;
  }
  distanceGrid(outside, w, h);
  distanceGrid(inside, w, h);
  const depth = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) depth[i] = (Math.sqrt(inside[i]) - Math.sqrt(outside[i])) / ratio;
  return {
    box,
    depth,
    w,
    h,
    ratio,
    line: shade(depth, w, h, t => settle(t - 1)),
    glow: shade(depth, w, h, t => settle((t - 4) / 5))
  };
};

const bendShape = (trace: ShapeTrace, edge: number, softness: number, calm: number, level: number) => {
  const { depth, w, h, ratio } = trace;
  const reach = edge + softness * 2;
  const field = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) field[i] = Math.min(Math.max(depth[i], -6), reach);
  blurGrid(field, w, h, Math.max(1, Math.round(Math.max(1.5, softness * 0.35) * ratio)));
  return paint(w, h, data => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const dx = field[i + (x < w - 1 ? 1 : 0)] - field[i - (x > 0 ? 1 : 0)];
        const dy = field[i + (y < h - 1 ? w : 0)] - field[i - (y > 0 ? w : 0)];
        const still = calm * settle((depth[i] - edge) / softness);
        const bend = (1 - still) * ratio * 0.25;
        const shift = still * (level - 0.5);
        data[i * 4] = 255 * (0.5 + dx * bend + shift);
        data[i * 4 + 1] = 255 * (0.5 + dy * bend + shift);
        data[i * 4 + 2] = 255 * (0.5 + shift);
        data[i * 4 + 3] = 255;
      }
    }
  });
};
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue';

const props = withDefaults(defineProps<GlassSurfaceProps>(), {
  width: 200,
  height: 80,
  borderRadius: 20,
  borderWidth: 0.07,
  brightness: 50,
  opacity: 0.93,
  blur: 11,
  displace: 0,
  backgroundOpacity: 0,
  saturation: 1,
  distortionScale: -180,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20,
  xChannel: 'R',
  yChannel: 'G',
  mixBlendMode: 'difference',
  refraction: true,
  renderer: 'auto',
  backdrop: undefined,
  shape: undefined,
  className: '',
  style: () => ({})
});

const uniqueId = (useId() || 'glass').replace(/:/g, '-');
const filterId = `glass-filter-${uniqueId}`;
const redGradId = `red-grad-${uniqueId}`;
const blueGradId = `blue-grad-${uniqueId}`;
const softId = `soft-${uniqueId}`;

const svgSupported = ref(false);
const checked = ref(false);
const webglFailed = ref(false);
const boxSize = ref('');
const loaded = shallowRef<{ src: string; image: HTMLImageElement | null }>({ src: '', image: null });
const art = shallowRef<ShapeArt | null>(null);

const containerRef = ref<HTMLDivElement | null>(null);
const feImageRef = ref<SVGFEImageElement | null>(null);
const redChannelRef = ref<SVGFEDisplacementMapElement | null>(null);
const greenChannelRef = ref<SVGFEDisplacementMapElement | null>(null);
const blueChannelRef = ref<SVGFEDisplacementMapElement | null>(null);
const gaussianBlurRef = ref<SVGFEGaussianBlurElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

let trace: CachedTrace | null = null;
let shapeMap = '';
let mapUrl = '';
let resizeObserver: ResizeObserver | null = null;

const generateDisplacementMap = () => {
  const rect = containerRef.value?.getBoundingClientRect();
  const actualWidth = rect?.width || 400;
  const actualHeight = rect?.height || 200;
  const edgeSize = Math.min(actualWidth, actualHeight) * (props.borderWidth * 0.5);

  const svgContent = `
      <svg width="${actualWidth}" height="${actualHeight}" viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
          <filter id="${softId}" filterUnits="userSpaceOnUse" x="0" y="0" width="${actualWidth}" height="${actualHeight}" color-interpolation-filters="sRGB">
            <feGaussianBlur stdDeviation="${props.blur}" />
          </filter>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${props.borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${props.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${props.mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${props.borderRadius}" fill="hsl(0 0% ${props.brightness}% / ${props.opacity})" filter="url(#${softId})" />
      </svg>
    `;

  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
};

const updateDisplacementMap = () => {
  mapUrl = shapeMap || generateDisplacementMap();
  feImageRef.value?.setAttribute('href', mapUrl);
};

const updateFilter = () => {
  updateDisplacementMap();
  [
    { el: redChannelRef.value, offset: props.redOffset },
    { el: greenChannelRef.value, offset: props.greenOffset },
    { el: blueChannelRef.value, offset: props.blueOffset }
  ].forEach(({ el, offset }) => {
    if (el) {
      el.setAttribute('scale', (props.distortionScale + offset).toString());
      el.setAttribute('xChannelSelector', props.xChannel);
      el.setAttribute('yChannelSelector', props.yChannel);
    }
  });

  gaussianBlurRef.value?.setAttribute('stdDeviation', props.displace.toString());
};

const shapeImage = computed(() => (props.shape && loaded.value.src === props.shape ? loaded.value.image : null));

const updateShape = () => {
  const element = containerRef.value;
  const w = element?.offsetWidth || 0;
  const h = element?.offsetHeight || 0;
  const image = shapeImage.value;
  let map = '';
  let current: CachedTrace | null = null;
  if (image && w && h) {
    const ratio = Math.min(2, window.devicePixelRatio || 1, Math.sqrt(400000 / (w * h)));
    current = trace;
    try {
      if (
        !current ||
        current.image !== image ||
        current.width !== w ||
        current.height !== h ||
        current.ratio !== ratio
      ) {
        current = { image, width: w, height: h, ...traceShape(image, w, h, ratio) };
        trace = current;
      }
      map = bendShape(
        current,
        Math.min(w, h) * props.borderWidth * 0.5,
        Math.max(props.blur, 0.5),
        props.opacity,
        props.brightness / 100
      );
    } catch {
      current = null;
      trace = null;
    }
  }
  shapeMap = map;
  updateDisplacementMap();
  if (props.shape && current)
    art.value = { src: props.shape, box: current.box, line: current.line, glow: current.glow };
  else if (props.shape && loaded.value.src === props.shape) art.value = { src: props.shape, failed: true };
};

const supportsSVGFilters = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);

  if (isWebkit || isFirefox) {
    return false;
  }

  const div = document.createElement('div');
  div.style.backdropFilter = `url(#${filterId})`;

  return div.style.backdropFilter !== '';
};

watch(
  () => [
    boxSize.value,
    props.width,
    props.height,
    props.borderRadius,
    props.borderWidth,
    props.brightness,
    props.opacity,
    props.blur,
    props.displace,
    props.distortionScale,
    props.redOffset,
    props.greenOffset,
    props.blueOffset,
    props.xChannel,
    props.yChannel,
    props.mixBlendMode
  ],
  updateFilter,
  { flush: 'post' }
);

watch(
  () => props.shape,
  (shape, _previous, onCleanup) => {
    if (!shape) return;
    let alive = true;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => {
      if (alive) loaded.value = { src: shape, image };
    };
    image.onerror = () => {
      if (alive) loaded.value = { src: shape, image: null };
    };
    image.src = shape;
    onCleanup(() => {
      alive = false;
    });
  },
  { immediate: true }
);

watch(
  () => [props.shape, loaded.value, boxSize.value, props.borderWidth, props.blur, props.opacity, props.brightness],
  updateShape,
  { flush: 'post' }
);

const webgl = computed(
  () =>
    checked.value &&
    props.refraction &&
    Boolean(props.backdrop) &&
    !webglFailed.value &&
    (props.renderer === 'webgl' || (props.renderer === 'auto' && !svgSupported.value))
);
const refractive = computed(() => !webgl.value && svgSupported.value && props.refraction);
const frosted = computed(() => !webgl.value && !refractive.value);

const startWebgl = () => {
  const canvas = canvasRef.value;
  const element = containerRef.value;
  const gl = canvas?.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false
  });
  const program = gl ? compileGlass(gl) : null;
  if (!canvas || !element || !gl || !program) {
    webglFailed.value = true;
    return undefined;
  }

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  [
    'uBackdrop',
    'uMap',
    'uCanvas',
    'uSize',
    'uOrigin',
    'uStep',
    'uScale',
    'uChannel',
    'uSpread',
    'uLod',
    'uSaturation'
  ].forEach(name => {
    uniforms[name] = gl.getUniformLocation(program, name);
  });
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  const makeTexture = () => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return texture;
  };
  const backdropTexture = makeTexture();
  const mapTexture = makeTexture();
  const mapCanvas = document.createElement('canvas');
  const mapContext = mapCanvas.getContext('2d');
  const picture: {
    node: GlassSurfaceBackdrop | null;
    key: string;
    width: number;
    height: number;
    mipmapped: boolean;
    ready: boolean;
  } = { node: null, key: '', width: 0, height: 0, mipmapped: false, ready: false };
  const map = { url: '', ready: false };
  let frame = 0;
  let visible = true;
  let drawn = '';

  const loadMap = (url: string) => {
    map.url = url;
    const image = new Image();
    image.onload = () => {
      if (map.url !== url || !mapContext) return;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      mapCanvas.width = Math.max(1, Math.round(element.offsetWidth * ratio));
      mapCanvas.height = Math.max(1, Math.round(element.offsetHeight * ratio));
      mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
      mapContext.drawImage(image, 0, 0, mapCanvas.width, mapCanvas.height);
      gl.bindTexture(gl.TEXTURE_2D, mapTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mapCanvas);
      map.ready = true;
      drawn = '';
    };
    image.src = url;
  };

  const upload = (node: GlassSurfaceBackdrop) => {
    const still = node instanceof HTMLImageElement;
    gl.bindTexture(gl.TEXTURE_2D, backdropTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, node);
    if (still) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, still ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    [picture.width, picture.height] = sourceSize(node);
    picture.mipmapped = still;
    picture.ready = true;
  };

  const tick = () => {
    frame = 0;
    if (!visible || document.hidden) return;
    frame = requestAnimationFrame(tick);
    const s = props;
    if (mapUrl && mapUrl !== map.url) loadMap(mapUrl);
    const node = resolveBackdrop(s.backdrop);
    if (!node) return;
    let key = '';
    if (node instanceof HTMLImageElement) key = node.complete && node.naturalWidth ? node.currentSrc || node.src : '';
    else if (node instanceof HTMLVideoElement)
      key = node.readyState >= 2 ? `${node.currentSrc}|${node.currentTime}` : '';
    else key = `${node.width}x${node.height}|${performance.now()}`;
    if (key && (node !== picture.node || key !== picture.key)) {
      try {
        upload(node);
      } catch {
        webglFailed.value = true;
        return;
      }
      picture.node = node;
      picture.key = key;
      drawn = '';
    }
    if (!picture.ready || !map.ready) return;

    const layoutWidth = element.offsetWidth;
    const layoutHeight = element.offsetHeight;
    if (!layoutWidth || !layoutHeight) return;
    const box = element.getBoundingClientRect();
    const content = contentBox(node);
    if (!content.width || !content.height) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(layoutWidth * ratio));
    const height = Math.max(1, Math.round(layoutHeight * ratio));
    const signature = [
      box.left,
      box.top,
      box.width,
      box.height,
      content.x,
      content.y,
      content.width,
      content.height,
      width,
      height,
      picture.key,
      map.url,
      s.displace,
      s.saturation,
      s.distortionScale,
      s.redOffset,
      s.greenOffset,
      s.blueOffset,
      s.xChannel,
      s.yChannel
    ].join('|');
    if (signature === drawn) return;
    drawn = signature;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const scaleX = box.width / layoutWidth;
    const scaleY = box.height / layoutHeight;
    const texelsPerPixel = (picture.width / content.width) * (scaleX / ratio);
    const spreadTexels = (picture.width / content.width) * scaleX * Math.max(0, s.displace);
    const lod = picture.mipmapped ? Math.max(0, Math.log2(Math.max(texelsPerPixel, spreadTexels * 0.5, 0.000001))) : 0;
    gl.viewport(0, 0, width, height);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, backdropTexture);
    gl.uniform1i(uniforms.uBackdrop, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, mapTexture);
    gl.uniform1i(uniforms.uMap, 1);
    gl.uniform2f(uniforms.uCanvas, width, height);
    gl.uniform2f(uniforms.uSize, layoutWidth, layoutHeight);
    gl.uniform2f(uniforms.uOrigin, (box.left - content.x) / content.width, (box.top - content.y) / content.height);
    gl.uniform2f(uniforms.uStep, scaleX / content.width, scaleY / content.height);
    gl.uniform3f(
      uniforms.uScale,
      s.distortionScale + s.redOffset,
      s.distortionScale + s.greenOffset,
      s.distortionScale + s.blueOffset
    );
    gl.uniform2i(uniforms.uChannel, CHANNELS[s.xChannel] ?? 0, CHANNELS[s.yChannel] ?? 1);
    gl.uniform1f(uniforms.uSpread, Math.max(0, s.displace));
    gl.uniform1f(uniforms.uLod, lod);
    gl.uniform1f(uniforms.uSaturation, s.saturation);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const wake = () => {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    webglFailed.value = true;
  };
  const intersection = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    wake();
  });
  intersection.observe(element);
  document.addEventListener('visibilitychange', wake);
  canvas.addEventListener('webglcontextlost', onLost);
  wake();

  return () => {
    cancelAnimationFrame(frame);
    intersection.disconnect();
    document.removeEventListener('visibilitychange', wake);
    canvas.removeEventListener('webglcontextlost', onLost);
    gl.deleteTexture(backdropTexture);
    gl.deleteTexture(mapTexture);
    gl.deleteBuffer(buffer);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
  };
};

watch(
  webgl,
  (active, _previous, onCleanup) => {
    if (!active) return;
    const stop = startWebgl();
    if (stop) onCleanup(stop);
  },
  { flush: 'post' }
);

onMounted(() => {
  updateFilter();
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      const element = containerRef.value;
      if (element) boxSize.value = `${element.offsetWidth}x${element.offsetHeight}`;
    });
    resizeObserver.observe(containerRef.value);
  }
  updateShape();
  svgSupported.value = supportsSVGFilters();
  checked.value = true;
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

const outline = computed(() => {
  const current = art.value;
  return props.shape && current && current.src === props.shape && !current.failed ? current : null;
});

const containerStyle = computed(() => {
  const current = outline.value;
  const maskUrl = current ? `url("${current.src.replace(/"/g, '%22').replace(/[\n\r]+/g, ' ')}")` : '';
  const maskPlace = current
    ? `${current.box.x}px ${current.box.y}px / ${current.box.width}px ${current.box.height}px no-repeat`
    : '';
  const shapeStyle: Record<string, string | number> = current
    ? { borderRadius: 0, boxShadow: 'none', WebkitMask: `${maskUrl} ${maskPlace}`, mask: `${maskUrl} ${maskPlace}` }
    : props.shape && art.value?.src !== props.shape
      ? { opacity: 0, transition: 'none' }
      : {};
  return {
    ...props.style,
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    borderRadius: `${props.borderRadius}px`,
    '--glass-frost': props.backgroundOpacity,
    '--glass-saturation': props.saturation,
    '--filter-id': `url(#${filterId})`,
    ...shapeStyle
  } as CSSProperties;
});

const modeClass = computed(() =>
  webgl.value ? 'glass-surface--webgl' : refractive.value ? 'glass-surface--svg' : 'glass-surface--fallback'
);
</script>

<template>
  <div ref="containerRef" :class="`glass-surface ${modeClass} ${className}`" :style="containerStyle">
    <svg class="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter :id="filterId" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
          <feImage ref="feImageRef" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

          <feDisplacementMap ref="redChannelRef" in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
          <feColorMatrix
            in="dispRed"
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="red"
          />

          <feDisplacementMap ref="greenChannelRef" in="SourceGraphic" in2="map" id="greenchannel" result="dispGreen" />
          <feColorMatrix
            in="dispGreen"
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="green"
          />

          <feDisplacementMap ref="blueChannelRef" in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
          <feColorMatrix
            in="dispBlue"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
            result="blue"
          />

          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur ref="gaussianBlurRef" in="output" stdDeviation="0.7" />
        </filter>
      </defs>
    </svg>

    <canvas v-if="webgl" ref="canvasRef" class="glass-surface__canvas" aria-hidden="true" />
    <span
      v-if="webgl"
      class="glass-surface__frame"
      aria-hidden="true"
      :style="outline ? { boxShadow: 'none' } : undefined"
    />
    <span v-if="frosted" class="glass-surface__sheen" aria-hidden="true" />
    <span v-if="frosted && !outline" class="glass-surface__rim" aria-hidden="true" />
    <span
      v-if="outline"
      class="glass-surface__glow"
      aria-hidden="true"
      :style="{ WebkitMaskImage: `url(${outline.glow})`, maskImage: `url(${outline.glow})` }"
    />
    <span
      v-if="outline"
      class="glass-surface__line"
      aria-hidden="true"
      :style="{ WebkitMaskImage: `url(${outline.line})`, maskImage: `url(${outline.line})` }"
    />

    <div class="glass-surface__content">
      <slot />
    </div>
  </div>
</template>

<style>
.glass-surface {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.26s ease-out;
}

.glass-surface__filter {
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  z-index: -1;
}

.glass-surface__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: inherit;
  position: relative;
  z-index: 1;
}

.glass-surface--svg {
  background: light-dark(hsl(0 0% 100% / var(--glass-frost, 0)), hsl(0 0% 0% / var(--glass-frost, 0)));
  backdrop-filter: var(--filter-id, url(#glass-filter)) saturate(var(--glass-saturation, 1));
  box-shadow:
    0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%))
      inset,
    0 0 10px 4px light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%))
      inset,
    0px 4px 16px rgba(17, 17, 26, 0.05),
    0px 8px 24px rgba(17, 17, 26, 0.05),
    0px 16px 56px rgba(17, 17, 26, 0.05),
    0px 4px 16px rgba(17, 17, 26, 0.05) inset,
    0px 8px 24px rgba(17, 17, 26, 0.05) inset,
    0px 16px 56px rgba(17, 17, 26, 0.05) inset;
}

.glass-surface--webgl {
  box-shadow:
    0px 4px 16px rgba(17, 17, 26, 0.05),
    0px 8px 24px rgba(17, 17, 26, 0.05),
    0px 16px 56px rgba(17, 17, 26, 0.05);
}

.glass-surface__canvas,
.glass-surface__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
}

.glass-surface__frame {
  background: light-dark(hsl(0 0% 100% / var(--glass-frost, 0)), hsl(0 0% 0% / var(--glass-frost, 0)));
  box-shadow:
    0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%))
      inset,
    0 0 10px 4px light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%))
      inset,
    0px 4px 16px rgba(17, 17, 26, 0.05) inset,
    0px 8px 24px rgba(17, 17, 26, 0.05) inset,
    0px 16px 56px rgba(17, 17, 26, 0.05) inset;
}

.glass-surface--fallback {
  background: light-dark(
    hsl(0 0% 100% / calc(0.12 + var(--glass-frost, 0) * 0.5)),
    hsl(0 0% 100% / calc(0.04 + var(--glass-frost, 0) * 0.3))
  );
  -webkit-backdrop-filter: blur(12px) saturate(calc(var(--glass-saturation, 1) * 1.4)) brightness(1.04);
  backdrop-filter: blur(12px) saturate(calc(var(--glass-saturation, 1) * 1.4)) brightness(1.04);
  box-shadow:
    inset 0 1px 0 0 light-dark(hsl(0 0% 100% / 0.85), hsl(0 0% 100% / 0.3)),
    inset 0 -1px 0 0 light-dark(hsl(0 0% 100% / 0.35), hsl(0 0% 100% / 0.08)),
    0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 88%), color-mix(in oklch, white, transparent 72%))
      inset,
    0 0 12px 3px light-dark(color-mix(in oklch, white, transparent 72%), color-mix(in oklch, white, transparent 90%))
      inset,
    0px 4px 16px rgba(17, 17, 26, 0.06),
    0px 8px 24px rgba(17, 17, 26, 0.06),
    0px 16px 56px rgba(17, 17, 26, 0.06);
}

.glass-surface__sheen,
.glass-surface__rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.glass-surface__sheen {
  background: linear-gradient(
    135deg,
    light-dark(hsl(0 0% 100% / 0.42), hsl(0 0% 100% / 0.14)) 0%,
    transparent 42%,
    transparent 64%,
    light-dark(hsl(0 0% 100% / 0.18), hsl(0 0% 100% / 0.05)) 100%
  );
}

.glass-surface__rim {
  padding: 3px;
  background: linear-gradient(
    150deg,
    light-dark(hsl(0 0% 100% / 0.7), hsl(0 0% 100% / 0.34)),
    light-dark(hsl(0 0% 100% / 0.1), hsl(0 0% 100% / 0.03)) 45%,
    light-dark(hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.02)) 60%,
    light-dark(hsl(0 0% 100% / 0.42), hsl(0 0% 100% / 0.18))
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box exclude,
    linear-gradient(#000 0 0);
}

.glass-surface__line,
.glass-surface__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.glass-surface--svg .glass-surface__line,
.glass-surface--webgl .glass-surface__line {
  background: light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%));
}

.glass-surface--svg .glass-surface__glow,
.glass-surface--webgl .glass-surface__glow {
  background: light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%));
}

.glass-surface--fallback .glass-surface__line {
  background: light-dark(color-mix(in oklch, black, transparent 88%), color-mix(in oklch, white, transparent 72%));
}

.glass-surface--fallback .glass-surface__glow {
  background: light-dark(color-mix(in oklch, white, transparent 72%), color-mix(in oklch, white, transparent 90%));
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-surface--fallback {
    background: light-dark(hsl(0 0% 100% / 0.72), hsl(0 0% 12% / 0.72));
  }
}

.glass-surface:focus-visible {
  outline: 2px solid light-dark(#007aff, #0a84ff);
  outline-offset: 2px;
}
</style>
