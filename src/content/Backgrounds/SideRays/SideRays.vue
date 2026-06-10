<template>
  <div ref="containerRef" :class="['relative w-full h-full overflow-hidden pointer-events-none z-[3]', className]" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef, computed, nextTick } from 'vue';
import { Renderer, Program, Triangle, Mesh } from 'ogl';

export type SideRaysOrigin = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface SideRaysProps {
  speed?: number;
  rayColor1?: string;
  rayColor2?: string;
  intensity?: number;
  spread?: number;
  origin?: SideRaysOrigin;
  tilt?: number;
  saturation?: number;
  blend?: number;
  falloff?: number;
  opacity?: number;
  className?: string;
}

interface WebGLUniforms {
  iTime: { value: number };
  iResolution: { value: [number, number] };
  iSpeed: { value: number };
  iRayColor1: { value: [number, number, number] };
  iRayColor2: { value: [number, number, number] };
  iIntensity: { value: number };
  iSpread: { value: number };
  iFlipX: { value: number };
  iFlipY: { value: number };
  iTilt: { value: number };
  iSaturation: { value: number };
  iBlend: { value: number };
  iFalloff: { value: number };
  iOpacity: { value: number };
}

const props = withDefaults(defineProps<SideRaysProps>(), {
  speed: 2.5,
  rayColor1: '#27FF64',
  rayColor2: '#A8FFB6',
  intensity: 2,
  spread: 2,
  origin: 'top-right',
  tilt: 0,
  saturation: 1.5,
  blend: 0.75,
  falloff: 2.0,
  opacity: 1.0,
  className: ''
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

const uniformsRef = ref<WebGLUniforms | null>(null);
const rendererRef = ref<Renderer | null>(null);
const animationIdRef = ref<number | null>(null);
const meshRef = ref<Mesh | null>(null);
const cleanupFunctionRef = ref<(() => void) | null>(null);
const isVisible = ref<boolean>(false);
const observerRef = ref<IntersectionObserver | null>(null);

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const originToFlip = (origin: SideRaysOrigin): [number, number] => {
  switch (origin) {
    case 'top-left':
      return [1, 0];
    case 'bottom-right':
      return [0, 1];
    case 'bottom-left':
      return [1, 1];
    default:
      return [0, 0];
  }
};

const rgb1 = computed<[number, number, number]>(() => hexToRgb(props.rayColor1));
const rgb2 = computed<[number, number, number]>(() => hexToRgb(props.rayColor2));
const flipValues = computed<[number, number]>(() => originToFlip(props.origin));
const devicePixelRatio = computed<number>(() => Math.min(window.devicePixelRatio || 1, 2));

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

const initializeWebGL = async (): Promise<void> => {
  if (!containerRef.value) return;

  await nextTick();

  if (!containerRef.value) return;

  try {
    const renderer = new Renderer({
      dpr: devicePixelRatio.value,
      alpha: true
    });
    rendererRef.value = renderer;

    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    while (containerRef.value.firstChild) {
      containerRef.value.removeChild(containerRef.value.firstChild);
    }
    containerRef.value.appendChild(gl.canvas);

    const [flipX, flipY] = flipValues.value;
    const uniforms: WebGLUniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      iSpeed: { value: props.speed },
      iRayColor1: { value: rgb1.value },
      iRayColor2: { value: rgb2.value },
      iIntensity: { value: props.intensity },
      iSpread: { value: props.spread },
      iFlipX: { value: flipX },
      iFlipY: { value: flipY },
      iTilt: { value: props.tilt },
      iSaturation: { value: props.saturation },
      iBlend: { value: props.blend },
      iFalloff: { value: props.falloff },
      iOpacity: { value: props.opacity }
    };
    uniformsRef.value = uniforms;

    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex: vertexShader, fragment: fragmentShader, uniforms });
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.value = mesh;

    const updateSize = (): void => {
      if (!containerRef.value || !renderer) return;
      renderer.dpr = devicePixelRatio.value;
      const { clientWidth: w, clientHeight: h } = containerRef.value;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
    };

    const loop = (t: number): void => {
      if (!rendererRef.value || !uniformsRef.value || !meshRef.value || !isVisible.value) return;
      uniforms.iTime.value = t * 0.001;
      try {
        renderer.render({ scene: mesh });
        animationIdRef.value = requestAnimationFrame(loop);
      } catch (error) {
        console.warn('WebGL rendering error:', error);
        return;
      }
    };

    window.addEventListener('resize', updateSize, { passive: true });
    updateSize();
    animationIdRef.value = requestAnimationFrame(loop);

    cleanupFunctionRef.value = (): void => {
      if (animationIdRef.value) {
        cancelAnimationFrame(animationIdRef.value);
        animationIdRef.value = null;
      }
      window.removeEventListener('resize', updateSize);
      if (renderer) {
        try {
          const loseCtx = renderer.gl.getExtension('WEBGL_lose_context');
          if (loseCtx) loseCtx.loseContext();
          const canvas = renderer.gl.canvas;
          if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        } catch (error) {
          console.warn('Error during WebGL cleanup:', error);
        }
      }
      rendererRef.value = null;
      uniformsRef.value = null;
      meshRef.value = null;
    };
  } catch (error) {
    console.error('Failed to initialize WebGL:', error);
  }
};

onMounted((): void => {
  if (!containerRef.value) return;

  observerRef.value = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      const entry = entries[0];
      isVisible.value = entry.isIntersecting;
    },
    { threshold: 0.1, rootMargin: '50px' }
  );

  observerRef.value.observe(containerRef.value);
});

watch(isVisible, (newVisible: boolean): void => {
  if (newVisible && containerRef.value) {
    if (cleanupFunctionRef.value) {
      cleanupFunctionRef.value();
      cleanupFunctionRef.value = null;
    }
    initializeWebGL();
  } else if (!newVisible && cleanupFunctionRef.value) {
    if (animationIdRef.value) {
      cancelAnimationFrame(animationIdRef.value);
      animationIdRef.value = null;
    }
  }
});

watch(
  [
    () => props.speed,
    () => props.rayColor1,
    () => props.rayColor2,
    () => props.intensity,
    () => props.spread,
    () => props.origin,
    () => props.tilt,
    () => props.saturation,
    () => props.blend,
    () => props.falloff,
    () => props.opacity
  ],
  (): void => {
    if (!uniformsRef.value) return;
    const u = uniformsRef.value;
    u.iSpeed.value = props.speed;
    u.iRayColor1.value = rgb1.value;
    u.iRayColor2.value = rgb2.value;
    u.iIntensity.value = props.intensity;
    u.iSpread.value = props.spread;
    const [flipX, flipY] = flipValues.value;
    u.iFlipX.value = flipX;
    u.iFlipY.value = flipY;
    u.iTilt.value = props.tilt;
    u.iSaturation.value = props.saturation;
    u.iBlend.value = props.blend;
    u.iFalloff.value = props.falloff;
    u.iOpacity.value = props.opacity;
  },
  { flush: 'post' }
);

onUnmounted((): void => {
  if (observerRef.value) {
    observerRef.value.disconnect();
    observerRef.value = null;
  }
  if (cleanupFunctionRef.value) {
    cleanupFunctionRef.value();
    cleanupFunctionRef.value = null;
  }
});
</script>
