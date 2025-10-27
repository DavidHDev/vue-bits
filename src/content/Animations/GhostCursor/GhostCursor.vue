<script setup lang="ts">
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { computed, markRaw, onBeforeUnmount, onMounted, ref, useTemplateRef, watch, type CSSProperties } from 'vue';

type GhostCursorProps = {
  className?: string;
  style?: CSSProperties;

  trailLength?: number;
  inertia?: number;
  grainIntensity?: number;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;

  brightness?: number;
  color?: string;
  mixBlendMode?: CSSProperties['mixBlendMode'];
  edgeIntensity?: number;

  maxDevicePixelRatio?: number;
  targetPixels?: number;
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  zIndex?: number;
};

const props = withDefaults(defineProps<GhostCursorProps>(), {
  trailLength: 50,
  inertia: 0.5,
  grainIntensity: 0.05,
  bloomStrength: 0.1,
  bloomRadius: 1.0,
  bloomThreshold: 0.025,
  brightness: 1,
  color: '#A0FFBC',
  mixBlendMode: 'screen',
  edgeIntensity: 0,
  maxDevicePixelRatio: 0.5,
  zIndex: 10
});

const containerRef = useTemplateRef('containerRef');
const rendererRef = ref<THREE.WebGLRenderer | null>(null);
const composerRef = ref<EffectComposer | null>(null);
const materialRef = ref<THREE.ShaderMaterial | null>(null);
const bloomPassRef = ref<UnrealBloomPass | null>(null);
const filmPassRef = ref<ShaderPass | null>(null);

const trailBufRef = ref<THREE.Vector2[]>([]);
const headRef = ref(0);

const rafRef = ref<number | null>(null);
const resizeObsRef = ref<ResizeObserver | null>(null);
const currentMouseRef = ref(new THREE.Vector2(0.5, 0.5));
const velocityRef = ref(new THREE.Vector2(0, 0));
const fadeOpacityRef = ref(1);
const lastMoveTimeRef = ref(typeof performance !== 'undefined' ? performance.now() : Date.now());
const pointerActiveRef = ref(false);
const runningRef = ref(false);

const isTouch = computed(
  () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
);

const pixelBudget = computed(() => props.targetPixels ?? (isTouch.value ? 0.9e6 : 1.3e6));
const fadeDelay = computed(() => props.fadeDelayMs ?? (isTouch.value ? 500 : 1000));
const fadeDuration = computed(() => props.fadeDurationMs ?? (isTouch.value ? 1000 : 1500));

const baseVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float iTime;
uniform vec3  iResolution;
uniform vec2  iMouse;
uniform vec2  iPrevMouse[MAX_TRAIL_LENGTH];
uniform float iOpacity;
uniform float iScale;
uniform vec3  iBaseColor;
uniform float iBrightness;
uniform float iEdgeIntensity;
varying vec2  vUv;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f *= f * (3. - 2. * f);
    return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
                mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
}
float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for(int i=0;i<5;i++){
        v += a * noise(p);
        p = m * p * 2.0;
        a *= 0.5;
    }
    return v;
}
vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }

vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
    vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));
    vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));

    float smoke = fbm(p * iScale + r * 0.8);
    float radius = 0.5 + 0.3 * (1.0 / iScale);
    float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
    float alpha = pow(smoke, 2.5) * distFactor;

    vec3 c1 = tint1(iBaseColor);
    vec3 c2 = tint2(iBaseColor);
    vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);

    return vec4(color * alpha * intensity, alpha * intensity);
}

void main() {
    vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
    vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

    vec3 colorAcc = vec3(0.0);
    float alphaAcc = 0.0;

    vec4 b = blob(uv, mouse, 1.0, iOpacity);
    colorAcc += b.rgb;
    alphaAcc += b.a;

    for (int i = 0; i < MAX_TRAIL_LENGTH; i++) {
        vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
        float t = 1.0 - float(i) / float(MAX_TRAIL_LENGTH);
        t = pow(t, 2.0);
        if (t > 0.01) {
            vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
            colorAcc += bt.rgb;
            alphaAcc += bt.a;
        }
    }

    colorAcc *= iBrightness;

    vec2 uv01 = gl_FragCoord.xy / iResolution.xy;
    float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));
    float distFromEdge = clamp(edgeDist * 2.0, 0.0, 1.0);
    float k = clamp(iEdgeIntensity, 0.0, 1.0);
    float edgeMask = mix(1.0 - k, 1.0, distFromEdge);

    float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);
    gl_FragColor = vec4(colorAcc, outAlpha);
}
`;

const FilmGrainShader = computed(() => {
  return {
    uniforms: {
      tDiffuse: { value: null },
      iTime: { value: 0 },
      intensity: { value: props.grainIntensity }
    },
    vertexShader: `
    varying vec2 vUv;
    void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float iTime;
    uniform float intensity;
    varying vec2 vUv;

    float hash1(float n){ return fract(sin(n)*43758.5453); }

    void main(){
        vec4 color = texture2D(tDiffuse, vUv);
        float n = hash1(vUv.x*1000.0 + vUv.y*2000.0 + iTime) * 2.0 - 1.0;
        color.rgb += n * intensity * color.rgb;
        gl_FragColor = color;
    }
    `
  };
});

const UnpremultiplyPass = computed(
  () =>
    new ShaderPass({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: `
          uniform sampler2D tDiffuse;
          varying vec2 vUv;
          void main(){
            vec4 c = texture2D(tDiffuse, vUv);
            float a = max(c.a, 1e-5);
            vec3 straight = c.rgb / a;
            gl_FragColor = vec4(clamp(straight, 0.0, 1.0), c.a);
          }
        `
    })
);

function calculateScale(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const base = 600;
  const current = Math.min(Math.max(1, r.width), Math.max(1, r.height));
  return Math.max(0.5, Math.min(2.0, current / base));
}

let cleanup: (() => void) | null = null;
const setup = () => {
  const host = containerRef.value;
  const parent = host?.parentElement;
  if (!host || !parent) return;

  const prevParentPos = parent.style.position;
  if (!prevParentPos || prevParentPos === 'static') {
    parent.style.position = 'relative';
  }

  const renderer = markRaw(
    new THREE.WebGLRenderer({
      antialias: !isTouch.value,
      alpha: true,
      depth: false,
      stencil: false,
      powerPreference: isTouch.value ? 'low-power' : 'high-performance',
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    })
  );
  renderer.setClearColor(0x000000, 0);
  rendererRef.value = renderer;

  renderer.domElement.style.pointerEvents = 'none';
  if (props.mixBlendMode) {
    renderer.domElement.style.mixBlendMode = String(props.mixBlendMode);
  } else {
    renderer.domElement.style.removeProperty('mix-blend-mode');
  }

  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.background = 'transparent';

  host.appendChild(renderer.domElement);

  const scene = markRaw(new THREE.Scene());
  const camera = markRaw(new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));

  const geom = markRaw(new THREE.PlaneGeometry(2, 2));

  const maxTrail = Math.max(1, Math.floor(props.trailLength));
  trailBufRef.value = Array.from({ length: maxTrail }, () => new THREE.Vector2(0.5, 0.5));
  headRef.value = 0;

  const baseColor = new THREE.Color(props.color);

  const material = markRaw(
    new THREE.ShaderMaterial({
      defines: { MAX_TRAIL_LENGTH: maxTrail },
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(1, 1, 1) },
        iMouse: { value: new THREE.Vector2(0.5, 0.5) },
        iPrevMouse: { value: trailBufRef.value.map(v => v.clone()) },
        iOpacity: { value: 1.0 },
        iScale: { value: 1.0 },
        iBaseColor: { value: new THREE.Vector3(baseColor.r, baseColor.g, baseColor.b) },
        iBrightness: { value: props.brightness },
        iEdgeIntensity: { value: props.edgeIntensity }
      },
      vertexShader: baseVertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false
    })
  );
  materialRef.value = material;

  const mesh = new THREE.Mesh(geom, material);
  scene.add(mesh);

  const composer = markRaw(new EffectComposer(renderer));
  composerRef.value = composer;

  const renderPass = markRaw(new RenderPass(scene, camera));
  composer.addPass(renderPass);

  const bloomPass = markRaw(
    new UnrealBloomPass(new THREE.Vector2(1, 1), props.bloomStrength, props.bloomRadius, props.bloomThreshold)
  );
  bloomPassRef.value = bloomPass;
  composer.addPass(bloomPass);

  const filmPass = markRaw(new ShaderPass(FilmGrainShader.value as ConstructorParameters<typeof ShaderPass>[0]));
  filmPassRef.value = filmPass;
  composer.addPass(filmPass);

  composer.addPass(UnpremultiplyPass.value);

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const cssW = Math.max(1, Math.floor(rect.width));
    const cssH = Math.max(1, Math.floor(rect.height));

    const currentDPR = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      props.maxDevicePixelRatio
    );
    const need = cssW * cssH * currentDPR * currentDPR;
    const scale =
      need <= pixelBudget.value ? 1 : Math.max(0.5, Math.min(1, Math.sqrt(pixelBudget.value / Math.max(1, need))));
    const pixelRatio = currentDPR * scale;

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(cssW, cssH, false);

    composer.setPixelRatio?.(pixelRatio);
    composer.setSize(cssW, cssH);

    const wpx = Math.max(1, Math.floor(cssW * pixelRatio));
    const hpx = Math.max(1, Math.floor(cssH * pixelRatio));
    material.uniforms.iResolution.value.set(wpx, hpx, 1);
    material.uniforms.iScale.value = calculateScale(host);
    bloomPass.setSize(wpx, hpx);
  };

  resize();
  const ro = new ResizeObserver(resize);
  resizeObsRef.value = ro;
  ro.observe(parent);
  ro.observe(host);

  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const animate = () => {
    const now = performance.now();
    const t = (now - start) / 1000;

    const mat = materialRef.value!;
    const comp = composerRef.value!;

    if (pointerActiveRef.value) {
      velocityRef.value.set(
        currentMouseRef.value.x - mat.uniforms.iMouse.value.x,
        currentMouseRef.value.y - mat.uniforms.iMouse.value.y
      );
      mat.uniforms.iMouse.value.copy(currentMouseRef.value);
      fadeOpacityRef.value = 1.0;
    } else {
      velocityRef.value.multiplyScalar(props.inertia);
      if (velocityRef.value.lengthSq() > 1e-6) {
        mat.uniforms.iMouse.value.add(velocityRef.value);
      }
      const dt = now - lastMoveTimeRef.value;
      if (dt > fadeDelay.value) {
        const k = Math.min(1, (dt - fadeDelay.value) / fadeDuration.value);
        fadeOpacityRef.value = Math.max(0, 1 - k);
      }
    }

    const N = trailBufRef.value.length;
    headRef.value = (headRef.value + 1) % N;
    trailBufRef.value[headRef.value].copy(mat.uniforms.iMouse.value);
    const arr = mat.uniforms.iPrevMouse.value as THREE.Vector2[];
    for (let i = 0; i < N; i++) {
      const srcIdx = (headRef.value - i + N) % N;
      arr[i].copy(trailBufRef.value[srcIdx]);
    }

    mat.uniforms.iOpacity.value = fadeOpacityRef.value;
    mat.uniforms.iTime.value = t;

    if (filmPassRef.value?.uniforms?.iTime) {
      filmPassRef.value.uniforms.iTime.value = t;
    }

    comp.render();

    if (!pointerActiveRef.value && fadeOpacityRef.value <= 0.001) {
      runningRef.value = false;
      rafRef.value = null;
      return;
    }

    rafRef.value = requestAnimationFrame(animate);
  };

  const ensureLoop = () => {
    if (!runningRef.value) {
      runningRef.value = true;
      rafRef.value = requestAnimationFrame(animate);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = parent.getBoundingClientRect();
    const x = THREE.MathUtils.clamp((e.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
    const y = THREE.MathUtils.clamp(1 - (e.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
    currentMouseRef.value.set(x, y);
    pointerActiveRef.value = true;
    lastMoveTimeRef.value = performance.now();
    ensureLoop();
  };
  const onPointerEnter = () => {
    pointerActiveRef.value = true;
    ensureLoop();
  };
  const onPointerLeave = () => {
    pointerActiveRef.value = false;
    lastMoveTimeRef.value = performance.now();
    ensureLoop();
  };

  parent.addEventListener('pointermove', onPointerMove, { passive: true });
  parent.addEventListener('pointerenter', onPointerEnter, { passive: true });
  parent.addEventListener('pointerleave', onPointerLeave, { passive: true });

  ensureLoop();

  cleanup = () => {
    if (rafRef.value) cancelAnimationFrame(rafRef.value);
    runningRef.value = false;
    rafRef.value = null;

    parent.removeEventListener('pointermove', onPointerMove);
    parent.removeEventListener('pointerenter', onPointerEnter);
    parent.removeEventListener('pointerleave', onPointerLeave);
    resizeObsRef.value?.disconnect();

    scene.clear();
    geom.dispose();
    material.dispose();
    composer.dispose();
    renderer.dispose();

    if (renderer.domElement && renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
    if (!prevParentPos || prevParentPos === 'static') {
      parent.style.position = prevParentPos;
    }
  };
};

onMounted(() => {
  setup();
});

onBeforeUnmount(() => {
  cleanup?.();
});

watch(
  () => [
    props.trailLength,
    props.inertia,
    props.grainIntensity,
    props.bloomStrength,
    props.bloomRadius,
    props.bloomThreshold,
    pixelBudget.value,
    fadeDelay.value,
    fadeDuration.value,
    isTouch.value,
    props.color,
    props.brightness,
    props.mixBlendMode,
    props.edgeIntensity
  ],
  () => {
    cleanup?.();
    setup();
  },
  { deep: true }
);

watch(
  () => props.color,
  () => {
    if (materialRef.value) {
      const c = new THREE.Color(props.color);
      (materialRef.value.uniforms.iBaseColor.value as THREE.Vector3).set(c.r, c.g, c.b);
    }
  }
);

watch(
  () => props.brightness,
  () => {
    if (materialRef.value) {
      materialRef.value.uniforms.iBrightness.value = props.brightness;
    }
  }
);

watch(
  () => props.edgeIntensity,
  () => {
    if (materialRef.value) {
      materialRef.value.uniforms.iEdgeIntensity.value = props.edgeIntensity;
    }
  }
);

watch(
  () => props.grainIntensity,
  () => {
    if (filmPassRef.value?.uniforms?.intensity) {
      filmPassRef.value.uniforms.intensity.value = props.grainIntensity;
    }
  }
);

watch(
  () => props.mixBlendMode,
  () => {
    const el = rendererRef.value?.domElement;
    if (!el) return;
    if (props.mixBlendMode) {
      el.style.mixBlendMode = String(props.mixBlendMode);
    } else {
      el.style.removeProperty('mix-blend-mode');
    }
  }
);

const mergedStyle = computed(() => ({
  zIndex: props.zIndex,
  ...props.style
}));
</script>

<template>
  <div ref="containerRef" :class="['pointer-events-none absolute inset-0', className]" :style="mergedStyle" />
</template>
