<!-- Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch, useTemplateRef } from 'vue';

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
}

const props = withDefaults(defineProps<TextPressureProps>(), {
  text: 'Compressa',
  fontFamily: 'Compressa VF',
  fontUrl: 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
  width: true,
  weight: true,
  italic: true,
  alpha: false,
  flex: true,
  stroke: false,
  scale: false,
  textColor: '#FFFFFF',
  strokeColor: '#FF0000',
  strokeWidth: 2,
  className: '',
  minFontSize: 24
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const titleRef = useTemplateRef<HTMLHeadingElement>('titleRef');
const spansRef = ref<(HTMLSpanElement | null)[]>([]);

const mouseRef = ref({ x: 0, y: 0 });
const cursorRef = ref({ x: 0, y: 0 });

const fontSize = ref(props.minFontSize);
const scaleY = ref(1);
const lineHeight = ref(1);

const chars = computed(() => props.text.split(''));

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const handleMouseMove = (e: MouseEvent) => {
  cursorRef.value.x = e.clientX;
  cursorRef.value.y = e.clientY;
};

const handleTouchMove = (e: TouchEvent) => {
  const t = e.touches[0];
  cursorRef.value.x = t.clientX;
  cursorRef.value.y = t.clientY;
};

const setSize = () => {
  if (!containerRef.value || !titleRef.value) return;

  const { width: containerW, height: containerH } = containerRef.value.getBoundingClientRect();

  let newFontSize = containerW / (chars.value.length / 2);
  newFontSize = Math.max(newFontSize, props.minFontSize);

  fontSize.value = newFontSize;
  scaleY.value = 1;
  lineHeight.value = 1;

  nextTick(() => {
    if (!titleRef.value) return;
    const textRect = titleRef.value.getBoundingClientRect();

    if (props.scale && textRect.height > 0) {
      const yRatio = containerH / textRect.height;
      scaleY.value = yRatio;
      lineHeight.value = yRatio;
    }
  });
};

let rafId: number;

const animate = () => {
  mouseRef.value.x += (cursorRef.value.x - mouseRef.value.x) / 15;
  mouseRef.value.y += (cursorRef.value.y - mouseRef.value.y) / 15;

  if (titleRef.value) {
    const titleRect = titleRef.value.getBoundingClientRect();
    const maxDist = titleRect.width / 2;

    spansRef.value.forEach(span => {
      if (!span) return;

      const rect = span.getBoundingClientRect();
      const charCenter = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      };

      const d = dist(mouseRef.value, charCenter);

      const getAttr = (distance: number, minVal: number, maxVal: number) => {
        const val = maxVal - Math.abs((maxVal * distance) / maxDist);
        return Math.max(minVal, val + minVal);
      };

      const wdth = props.width ? Math.floor(getAttr(d, 5, 200)) : 100;
      const wght = props.weight ? Math.floor(getAttr(d, 100, 900)) : 400;
      const italVal = props.italic ? getAttr(d, 0, 1).toFixed(2) : '0';
      const alphaVal = props.alpha ? getAttr(d, 0, 1).toFixed(2) : '1';

      span.style.opacity = alphaVal;
      span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
    });
  }

  rafId = requestAnimationFrame(animate);
};

onMounted(() => {
  const styleElement = document.createElement('style');
  styleElement.textContent = dynamicStyles.value;
  document.head.appendChild(styleElement);
  styleElement.setAttribute('data-text-pressure', 'true');

  setSize();

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('resize', setSize);

  if (containerRef.value) {
    const { left, top, width, height } = containerRef.value.getBoundingClientRect();
    mouseRef.value.x = left + width / 2;
    mouseRef.value.y = top + height / 2;
    cursorRef.value.x = mouseRef.value.x;
    cursorRef.value.y = mouseRef.value.y;
  }

  animate();
});

onUnmounted(() => {
  const styleElements = document.querySelectorAll('style[data-text-pressure="true"]');
  styleElements.forEach(el => el.remove());

  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('resize', setSize);
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});

watch([() => props.scale, () => props.text], () => {
  setSize();
});

watch([() => props.width, () => props.weight, () => props.italic, () => props.alpha], () => {});

const titleStyle = computed(() => ({
  fontFamily: props.fontFamily,
  fontSize: fontSize.value + 'px',
  lineHeight: lineHeight.value,
  transform: `scale(1, ${scaleY.value})`,
  transformOrigin: 'center top',
  margin: 0,
  fontWeight: 100,
  color: props.stroke ? undefined : props.textColor
}));

const dynamicStyles = computed(
  () => `
  @font-face {
    font-family: '${props.fontFamily}';
    src: url('${props.fontUrl}');
    font-style: normal;
  }
  .stroke span {
    position: relative;
    color: ${props.textColor};
  }
  .stroke span::after {
    content: attr(data-char);
    position: absolute;
    left: 0;
    top: 0;
    color: transparent;
    z-index: -1;
    -webkit-text-stroke-width: ${props.strokeWidth}px;
    -webkit-text-stroke-color: ${props.strokeColor};
  }
`
);

onMounted(() => {
  const styleElement = document.createElement('style');
  styleElement.textContent = dynamicStyles.value;
  document.head.appendChild(styleElement);

  styleElement.setAttribute('data-text-pressure', 'true');
});

onUnmounted(() => {
  const styleElements = document.querySelectorAll('style[data-text-pressure="true"]');
  styleElements.forEach(el => el.remove());
});
</script>

<template>
  <div ref="containerRef" class="relative w-full h-full overflow-hidden bg-transparent">
    <h1
      ref="titleRef"
      :class="`text-pressure-title ${className} ${flex ? 'flex justify-between' : ''} ${stroke ? 'stroke' : ''} uppercase text-center`"
      :style="titleStyle"
    >
      <span
        v-for="(char, i) in chars"
        :key="i"
        :ref="el => (spansRef[i] = el as HTMLSpanElement)"
        :data-char="char"
        class="inline-block"
      >
        {{ char }}
      </span>
    </h1>
  </div>
</template>
