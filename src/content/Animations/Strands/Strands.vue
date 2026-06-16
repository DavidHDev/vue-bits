<template>
  <div ref="containerRef" :class="['relative w-full h-full bg-transparent', className]" :style="style"></div>
</template>

<script setup lang="ts">
import { Color, Mesh, Program, Renderer, RenderTarget, Triangle } from 'ogl';
import { onMounted, onUnmounted, useTemplateRef, type CSSProperties } from 'vue';

interface StrandsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  hueShift?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  glass?: boolean;
  refraction?: number;
  dispersion?: number;
  glassSize?: number;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<StrandsProps>(), {
  colors: () => ['#FF4242', '#7C3AED', '#06B6D4', '#EAB308'],
  count: 3,
  speed: 0.5,
  amplitude: 1,
  waviness: 1,
  thickness: 0.7,
  glow: 2.6,
  taper: 3,
  spread: 1,
  hueShift: 0,
  intensity: 0.6,
  saturation: 1.5,
  opacity: 1,
  scale: 1.5,
  glass: false,
  refraction: 1,
  dispersion: 1,
  glassSize: 1,
  className: '',
  style: () => ({})
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

const MAX_STRANDS = 12;
const MAX_COLORS = 8;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;
  float env = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);

  vec3 col = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`;

const GLASS_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uRefraction;
uniform float uDispersion;

out vec4 fragColor;

vec2 toUv(vec2 p) {
  return p * (uResolution.y / uResolution) + 0.5;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  float d = length(p);
  float r = uRadius;

  float edge = fwidth(d) * 1.5;
  float mask = 1.0 - smoothstep(r - edge, r + edge, d);
  if (mask <= 0.0) {
    fragColor = vec4(0.0);
    return;
  }

  // sphere height: 0 at the rim, 1 at the center
  float z = sqrt(max(r * r - d * d, 0.0)) / r;
  float nd = d / r; // 0 at the center, 1 at the rim

  // refraction is confined to a narrow band near the rim; the rest stays undistorted
  vec2 dir = d > 0.0 ? p / d : vec2(0.0);
  float lens = smoothstep(0.85, 1.0, nd) * pow(nd, 6.0);
  vec2 offset = -dir * lens * uRefraction * 0.15;
  vec2 disp = -dir * lens * uDispersion * 0.012;

  vec3 light;
  light.r = texture(uScene, toUv(p + offset - disp)).r;
  light.g = texture(uScene, toUv(p + offset)).g;
  light.b = texture(uScene, toUv(p + offset + disp)).b;

  // neutral fresnel rim (no color tint so the glass stays clear)
  float fres = pow(1.0 - z, 3.0);
  vec3 rim = vec3(1.0) * fres * 0.18;

  // specular highlight from the upper-left
  vec2 lightDir = normalize(vec2(-0.55, 0.6));
  float spec = pow(max(dot(p / max(r, 1e-4), lightDir), 0.0), 6.0);
  spec *= smoothstep(r, r * 0.55, d);

  vec3 emissive = light + rim + vec3(spec) * 0.4;
  float emissiveA = clamp(max(max(emissive.r, emissive.g), emissive.b), 0.0, 1.0);

  // almost clear glass body: only a faint neutral darkening, mostly near the rim
  float bodyA = 0.05 + fres * 0.05;

  // composite emissive light over the clear body (premultiplied)
  float outA = emissiveA + bodyA * (1.0 - emissiveA);
  vec3 outRGB = emissive;

  outRGB *= mask;
  outA *= mask;

  fragColor = vec4(outRGB, outA);
}
`;

const buildPalette = (colors: string[]): number[][] => {
  const filled = colors && colors.length ? colors : ['#ffffff'];
  const padded: number[][] = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const hex = filled[i] ?? filled[filled.length - 1];
    const c = new Color(hex);
    padded.push([c.r, c.g, c.b]);
  }
  return padded;
};

let renderer: Renderer | null = null;
let animateId = 0;
let cleanupFn: (() => void) | null = null;

const initStrands = () => {
  const ctn = containerRef.value;
  if (!ctn) return;

  renderer = new Renderer({
    alpha: true,
    premultipliedAlpha: true,
    antialias: true
  });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.canvas.style.backgroundColor = 'transparent';

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) {
    delete geometry.attributes.uv;
  }

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
      uColors: { value: buildPalette(props.colors) },
      uColorCount: { value: Math.min(props.colors.length, MAX_COLORS) },
      uStrandCount: { value: Math.min(props.count, MAX_STRANDS) },
      uSpeed: { value: props.speed },
      uAmplitude: { value: props.amplitude },
      uWaviness: { value: props.waviness },
      uThickness: { value: props.thickness },
      uGlow: { value: props.glow },
      uTaper: { value: props.taper },
      uSpread: { value: props.spread },
      uHueShift: { value: props.hueShift },
      uIntensity: { value: props.intensity },
      uOpacity: { value: props.opacity },
      uScale: { value: props.scale },
      uSaturation: { value: props.saturation }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });

  const renderTarget = new RenderTarget(gl, {
    width: ctn.offsetWidth,
    height: ctn.offsetHeight
  });

  const glassProgram = new Program(gl, {
    vertex: VERT,
    fragment: GLASS_FRAG,
    uniforms: {
      uScene: { value: renderTarget.texture },
      uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
      uRadius: { value: 0.46 * props.glassSize },
      uRefraction: { value: props.refraction },
      uDispersion: { value: props.dispersion }
    }
  });
  const glassMesh = new Mesh(gl, { geometry, program: glassProgram });

  ctn.appendChild(gl.canvas);
  gl.canvas.style.width = '100%';
  gl.canvas.style.height = '100%';
  gl.canvas.style.display = 'block';

  const resize = () => {
    if (!ctn) return;
    const width = ctn.offsetWidth;
    const height = ctn.offsetHeight;
    renderer!.setSize(width, height);
    program.uniforms.uResolution.value = [width, height];
    renderTarget.setSize(width, height);
    glassProgram.uniforms.uResolution.value = [width, height];
  };
  window.addEventListener('resize', resize);
  resize();

  const update = (t: number) => {
    animateId = requestAnimationFrame(update);
    program.uniforms.uTime.value = t * 0.001;
    program.uniforms.uColors.value = buildPalette(props.colors);
    program.uniforms.uColorCount.value = Math.min(props.colors.length, MAX_COLORS);
    program.uniforms.uStrandCount.value = Math.min(Math.max(Math.round(props.count), 1), MAX_STRANDS);
    program.uniforms.uSpeed.value = props.speed;
    program.uniforms.uAmplitude.value = props.amplitude;
    program.uniforms.uWaviness.value = props.waviness;
    program.uniforms.uThickness.value = props.thickness;
    program.uniforms.uGlow.value = props.glow;
    program.uniforms.uTaper.value = props.taper;
    program.uniforms.uSpread.value = props.spread;
    program.uniforms.uHueShift.value = props.hueShift;
    program.uniforms.uIntensity.value = props.intensity;
    program.uniforms.uOpacity.value = props.opacity;
    program.uniforms.uScale.value = props.scale;
    program.uniforms.uSaturation.value = props.saturation;

    if (props.glass) {
      renderer!.render({ scene: mesh, target: renderTarget });
      glassProgram.uniforms.uScene.value = renderTarget.texture;
      glassProgram.uniforms.uRefraction.value = props.refraction;
      glassProgram.uniforms.uDispersion.value = props.dispersion;
      glassProgram.uniforms.uRadius.value = 0.46 * props.glassSize;
      renderer!.render({ scene: glassMesh });
    } else {
      renderer!.render({ scene: mesh });
    }
  };
  animateId = requestAnimationFrame(update);

  cleanupFn = () => {
    cancelAnimationFrame(animateId);
    window.removeEventListener('resize', resize);
    if (ctn && gl.canvas.parentNode === ctn) {
      ctn.removeChild(gl.canvas);
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
};

onMounted(() => {
  initStrands();
});

onUnmounted(() => {
  if (cleanupFn) {
    cleanupFn();
    cleanupFn = null;
  }
  renderer = null;
});
</script>
