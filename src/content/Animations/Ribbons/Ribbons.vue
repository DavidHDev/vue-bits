<template>
  <div ref="ribbonsContainer" class="relative w-full h-full overflow-hidden" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, useTemplateRef } from 'vue';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';

interface RibbonsProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
  backgroundColor?: number[];
}

const props = withDefaults(defineProps<RibbonsProps>(), {
  colors: () => ['#ff9346', '#7cff67', '#ffee51', '#27FF64'],
  baseSpring: 0.03,
  baseFriction: 0.9,
  baseThickness: 30,
  offsetFactor: 0.05,
  maxAge: 500,
  pointCount: 50,
  speedMultiplier: 0.6,
  enableFade: false,
  enableShaderEffect: false,
  effectAmplitude: 2,
  backgroundColor: () => [0, 0, 0, 0]
});

const ribbonsContainer = useTemplateRef<HTMLDivElement>('ribbonsContainer');

let renderer: Renderer;
let scene: Transform;
let lines: {
  spring: number;
  friction: number;
  mouseVelocity: Vec3;
  mouseOffset: Vec3;
  points: Vec3[];
  polyline: Polyline;
}[] = [];
let frameId: number;
let lastTime = performance.now();
const mouse = new Vec3();
let resizeObserver: ResizeObserver | null = null;

const vertex = `
  precision highp float;
  
  attribute vec3 position;
  attribute vec3 next;
  attribute vec3 prev;
  attribute vec2 uv;
  attribute float side;
  
  uniform vec2 uResolution;
  uniform float uDPR;
  uniform float uThickness;
  uniform float uTime;
  uniform float uEnableShaderEffect;
  uniform float uEffectAmplitude;
  
  varying vec2 vUV;
  
  vec4 getPosition() {
      vec4 current = vec4(position, 1.0);
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 nextScreen = next.xy * aspect;
      vec2 prevScreen = prev.xy * aspect;
      vec2 tangent = normalize(nextScreen - prevScreen);
      vec2 normal = vec2(-tangent.y, tangent.x);
      normal /= aspect;
      normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
      float dist = length(nextScreen - prevScreen);
      normal *= smoothstep(0.0, 0.02, dist);
      float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
      float pixelWidth = current.w * pixelWidthRatio;
      normal *= pixelWidth * uThickness;
      current.xy -= normal * side;
      if(uEnableShaderEffect > 0.5) {
        current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
      }
      return current;
  }
  
  void main() {
      vUV = uv;
      gl_Position = getPosition();
  }
`;

const fragment = `
  precision highp float;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uEnableFade;
  varying vec2 vUV;
  void main() {
      float fadeFactor = 1.0;
      if(uEnableFade > 0.5) {
          fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
      }
      gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
  }
`;

const updateMouse = (e: MouseEvent | TouchEvent) => {
  const container = ribbonsContainer.value;
  if (!container) return;

  let x: number, y: number;
  const rect = container.getBoundingClientRect();

  if ('changedTouches' in e && e.changedTouches.length) {
    x = e.changedTouches[0].clientX - rect.left;
    y = e.changedTouches[0].clientY - rect.top;
  } else if (e instanceof MouseEvent) {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  } else {
    x = 0;
    y = 0;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;
  mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);
};

const resize = () => {
  const container = ribbonsContainer.value;
  if (!container || !renderer) return;

  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  lines.forEach(line => line.polyline.resize());
};

const createLines = () => {
  const center = (props.colors.length - 1) / 2;
  lines = [];

  props.colors.forEach((color, index) => {
    const spring = props.baseSpring + (Math.random() - 0.5) * 0.05;
    const friction = props.baseFriction + (Math.random() - 0.5) * 0.05;
    const thickness = props.baseThickness + (Math.random() - 0.5) * 3;
    const mouseOffset = new Vec3(
      (index - center) * props.offsetFactor + (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.1,
      0
    );

    const line = {
      spring,
      friction,
      mouseVelocity: new Vec3(),
      mouseOffset,
      points: [] as Vec3[],
      polyline: {} as Polyline
    };

    const count = props.pointCount;
    const points: Vec3[] = [];
    for (let i = 0; i < count; i++) {
      points.push(new Vec3());
    }
    line.points = points;

    line.polyline = new Polyline(renderer.gl, {
      points,
      vertex,
      fragment,
      uniforms: {
        uColor: { value: new Color(color) },
        uThickness: { value: thickness },
        uOpacity: { value: 1.0 },
        uTime: { value: 0.0 },
        uEnableShaderEffect: { value: props.enableShaderEffect ? 1.0 : 0.0 },
        uEffectAmplitude: { value: props.effectAmplitude },
        uEnableFade: { value: props.enableFade ? 1.0 : 0.0 }
      }
    });
    line.polyline.mesh.setParent(scene);
    lines.push(line);
  });
};

const update = () => {
  frameId = requestAnimationFrame(update);
  const currentTime = performance.now();
  const dt = currentTime - lastTime;
  lastTime = currentTime;

  const tmp = new Vec3();
  lines.forEach(line => {
    tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
    line.mouseVelocity.add(tmp).multiply(line.friction);
    line.points[0].add(line.mouseVelocity);

    for (let i = 1; i < line.points.length; i++) {
      if (isFinite(props.maxAge) && props.maxAge > 0) {
        const segmentDelay = props.maxAge / (line.points.length - 1);
        const alpha = Math.min(1, (dt * props.speedMultiplier) / segmentDelay);
        line.points[i].lerp(line.points[i - 1], alpha);
      } else {
        line.points[i].lerp(line.points[i - 1], 0.9);
      }
    }
    if (line.polyline.mesh.program.uniforms.uTime) {
      line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
    }
    line.polyline.updateGeometry();
  });

  renderer.render({ scene });
};

const initRibbons = () => {
  const container = ribbonsContainer.value;
  if (!container) return;

  renderer = new Renderer({ dpr: window.devicePixelRatio || 2, alpha: true });
  const gl = renderer.gl;

  if (Array.isArray(props.backgroundColor) && props.backgroundColor.length === 4) {
    gl.clearColor(
      props.backgroundColor[0],
      props.backgroundColor[1],
      props.backgroundColor[2],
      props.backgroundColor[3]
    );
  } else {
    gl.clearColor(0, 0, 0, 0);
  }

  gl.canvas.style.position = 'absolute';
  gl.canvas.style.top = '0';
  gl.canvas.style.left = '0';
  gl.canvas.style.width = '100%';
  gl.canvas.style.height = '100%';
  container.appendChild(gl.canvas);

  scene = new Transform();

  createLines();

  container.addEventListener('mousemove', updateMouse);
  container.addEventListener('touchstart', updateMouse);
  container.addEventListener('touchmove', updateMouse);

  resize();

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener('resize', resize);
  }

  update();
};

const cleanup = () => {
  if (frameId) {
    cancelAnimationFrame(frameId);
  }

  if (resizeObserver) {
    resizeObserver.disconnect();
  } else {
    window.removeEventListener('resize', resize);
  }

  const container = ribbonsContainer.value;
  if (container) {
    container.removeEventListener('mousemove', updateMouse);
    container.removeEventListener('touchstart', updateMouse);
    container.removeEventListener('touchmove', updateMouse);

    if (renderer && renderer.gl.canvas && renderer.gl.canvas.parentNode === container) {
      container.removeChild(renderer.gl.canvas);
    }
  }
};

const recreateLines = () => {
  lines.forEach(line => {
    if (line.polyline.mesh && line.polyline.mesh.parent) {
      line.polyline.mesh.setParent(null);
    }
  });

  createLines();
};

watch(
  () => [props.colors, props.pointCount],
  () => {
    if (renderer && scene) {
      recreateLines();
    }
  },
  { deep: true }
);

watch(
  () => [props.baseThickness, props.enableFade, props.enableShaderEffect, props.effectAmplitude, props.backgroundColor],
  () => {
    if (renderer && lines.length > 0) {
      lines.forEach(line => {
        if (line.polyline.mesh.program.uniforms.uEnableFade) {
          line.polyline.mesh.program.uniforms.uEnableFade.value = props.enableFade ? 1.0 : 0.0;
        }
        if (line.polyline.mesh.program.uniforms.uEnableShaderEffect) {
          line.polyline.mesh.program.uniforms.uEnableShaderEffect.value = props.enableShaderEffect ? 1.0 : 0.0;
        }
        if (line.polyline.mesh.program.uniforms.uEffectAmplitude) {
          line.polyline.mesh.program.uniforms.uEffectAmplitude.value = props.effectAmplitude;
        }
      });

      const gl = renderer.gl;
      if (Array.isArray(props.backgroundColor) && props.backgroundColor.length === 4) {
        gl.clearColor(
          props.backgroundColor[0],
          props.backgroundColor[1],
          props.backgroundColor[2],
          props.backgroundColor[3]
        );
      } else {
        gl.clearColor(0, 0, 0, 0);
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  initRibbons();
});

onUnmounted(() => {
  cleanup();
});
</script>
