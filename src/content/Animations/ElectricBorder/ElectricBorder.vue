<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch, type CSSProperties } from 'vue';

type ElectricBorderProps = {
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
};

const props = withDefaults(defineProps<ElectricBorderProps>(), {
  color: '#28FF85',
  speed: 1,
  chaos: 1,
  thickness: 2
});

function hexToRgba(hex: string, alpha = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const rawId = `id-${crypto.randomUUID().replace(/[:]/g, '')}`;
const filterId = `turbulent-displace-${rawId}`;

const svgRef = useTemplateRef('svgRef');
const rootRef = useTemplateRef('rootRef');
const strokeRef = useTemplateRef('strokeRef');

const updateAnim = () => {
  const svg = svgRef.value;
  const host = rootRef.value;
  if (!svg || !host) return;

  if (strokeRef.value) {
    strokeRef.value.style.filter = `url(#${filterId})`;
  }

  const width = Math.max(1, Math.round(host.clientWidth || host.getBoundingClientRect().width || 0));
  const height = Math.max(1, Math.round(host.clientHeight || host.getBoundingClientRect().height || 0));

  const dyAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dy"]')) as SVGAnimateElement[];
  if (dyAnims.length >= 2) {
    dyAnims[0].setAttribute('values', `${height}; 0`);
    dyAnims[1].setAttribute('values', `0; -${height}`);
  }

  const dxAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dx"]')) as SVGAnimateElement[];
  if (dxAnims.length >= 2) {
    dxAnims[0].setAttribute('values', `${width}; 0`);
    dxAnims[1].setAttribute('values', `0; -${width}`);
  }

  const baseDur = 6;
  const dur = Math.max(0.001, baseDur / (props.speed || 1));
  [...dyAnims, ...dxAnims].forEach(a => a.setAttribute('dur', `${dur}s`));

  const disp = svg.querySelector('feDisplacementMap');
  if (disp) disp.setAttribute('scale', String(30 * (props.chaos || 1)));

  const filterEl = svg.querySelector<SVGFilterElement>(`#${CSS.escape(filterId)}`);
  if (filterEl) {
    filterEl.setAttribute('x', '-200%');
    filterEl.setAttribute('y', '-200%');
    filterEl.setAttribute('width', '500%');
    filterEl.setAttribute('height', '500%');
  }

  requestAnimationFrame(() => {
    [...dyAnims, ...dxAnims].forEach((a: SVGAnimateElement) => {
      if (typeof a.beginElement === 'function') {
        try {
          a.beginElement();
        } catch {}
      }
    });
  });
};

watch(
  () => [props.speed, props.chaos],
  () => {
    updateAnim();
  },
  { deep: true }
);

let ro: ResizeObserver | null = null;

onMounted(() => {
  if (!rootRef.value) return;
  ro = new ResizeObserver(() => updateAnim());
  ro.observe(rootRef.value);
  updateAnim();
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});

const inheritRadius = computed<CSSProperties>(() => {
  const radius = props.style?.borderRadius;

  if (radius === undefined) {
    return { borderRadius: 'inherit' };
  }

  if (typeof radius === 'number') {
    return { borderRadius: `${radius}px` };
  }

  return { borderRadius: radius };
});

const strokeStyle = computed<CSSProperties>(() => ({
  ...inheritRadius.value,
  borderWidth: `${props.thickness}px`,
  borderStyle: 'solid',
  borderColor: props.color
}));

const glow1Style = computed<CSSProperties>(() => ({
  ...inheritRadius.value,
  borderWidth: `${props.thickness}px`,
  borderStyle: 'solid',
  borderColor: hexToRgba(props.color, 0.6),
  filter: `blur(${0.5 + props.thickness * 0.25}px)`,
  opacity: 0.5
}));

const glow2Style = computed<CSSProperties>(() => ({
  ...inheritRadius.value,
  borderWidth: `${props.thickness}px`,
  borderStyle: 'solid',
  borderColor: props.color,
  filter: `blur(${2 + props.thickness * 0.5}px)`,
  opacity: 0.5
}));

const bgGlowStyle = computed<CSSProperties>(() => ({
  ...inheritRadius.value,
  transform: 'scale(1.08)',
  filter: 'blur(32px)',
  opacity: 0.3,
  zIndex: -1,
  background: `linear-gradient(-30deg, ${hexToRgba(props.color, 0.8)}, transparent, ${props.color})`
}));
</script>

<template>
  <div ref="rootRef" :class="['relative isolate', className]" :style="style">
    <svg
      ref="svgRef"
      class="fixed opacity-0 w-0 h-0 pointer-events-none"
      style="position: absolute; top: -9999px; left: -9999px"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter :id="filterId" color-interpolation-filters="sRGB" x="-200%" y="-200%" width="500%" height="500%">
          <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="8" result="noise1" seed="1" />
          <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
            <animate attributeName="dy" values="500; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="8" result="noise2" seed="3" />
          <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
            <animate attributeName="dy" values="0; -500" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="6" result="noise3" seed="5" />
          <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
            <animate attributeName="dx" values="500; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="6" result="noise4" seed="7" />
          <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
            <animate attributeName="dx" values="0; -500" dur="6s" repeatCount="indefinite" calcMode="linear" />
          </feOffset>

          <feComposite in="offsetNoise1" in2="offsetNoise2" operator="add" result="verticalNoise" />
          <feComposite in="offsetNoise3" in2="offsetNoise4" operator="add" result="horizontalNoise" />
          <feBlend in="verticalNoise" in2="horizontalNoise" mode="screen" result="combinedNoise" />

          <feDisplacementMap
            in="SourceGraphic"
            in2="combinedNoise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>
      </defs>
    </svg>

    <div class="absolute inset-0 pointer-events-none" :style="inheritRadius">
      <div ref="strokeRef" class="box-border absolute inset-0" :style="strokeStyle" />
      <div class="box-border absolute inset-0" :style="glow1Style" />
      <div class="box-border absolute inset-0" :style="glow2Style" />
      <div class="absolute inset-0" :style="bgGlowStyle" />
    </div>

    <div class="relative" :style="inheritRadius">
      <slot />
    </div>
  </div>
</template>
