<template>
  <span
    ref="rootRef"
    :class="`stroke-text ${trigger === 'hover' ? 'stroke-text--hover' : ''} ${className}`.trim()"
    :style="{ ...style, '--stroke-text-width': `${box ? box.width : 600}px` }"
    role="img"
    :aria-label="String(text ?? '')"
  >
    <svg
      class="stroke-text__svg"
      :viewBox="viewBox"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      :style="box ? undefined : { visibility: 'hidden' }"
    >
      <defs>
        <clipPath v-if="fillMode === 'wipe' && wipeStart" :id="wipeId" clipPathUnits="userSpaceOnUse">
          <rect
            ref="wipeRectRef"
            :x="wipeStart.x"
            :y="wipeStart.y"
            :width="wipeStart.width"
            :height="wipeStart.height"
          />
        </clipPath>

        <filter v-if="dashArray" :id="erodeId" filterUnits="userSpaceOnUse" v-bind="region">
          <feMorphology operator="erode" :radius="(Number(strokeWidth) || 1) / 2 + 0.75" />
        </filter>

        <mask v-if="dashArray" :id="revealId" maskUnits="userSpaceOnUse" v-bind="region">
          <text
            x="0"
            y="0"
            fill="none"
            stroke="#fff"
            :stroke-width="(Number(strokeWidth) || 1) + 2"
            stroke-linejoin="round"
            stroke-linecap="round"
            :style="fontStyle"
          >
            <tspan v-for="(char, index) in characters" :key="`m-${index}`" data-stroke-char>{{ char }}</tspan>
          </text>
          <text x="0" y="0" fill="#000" stroke="none" :filter="`url(#${erodeId})`" :style="fontStyle">
            <tspan v-for="(char, index) in characters" :key="`e-${index}`">{{ char }}</tspan>
          </text>
        </mask>

        <filter
          v-if="castShadow"
          :id="shadowId"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
          v-bind="region"
        >
          <feDropShadow
            ref="shadowRef"
            :dx="lift"
            :dy="lift"
            :stdDeviation="softness"
            :flood-color="shadowColor || strokeColor"
            :flood-opacity="SHADOW_OPACITY"
          />
        </filter>
      </defs>

      <text
        v-if="!dashArray"
        key="solid"
        ref="strokeTextRef"
        class="stroke-text__stroke"
        x="0"
        y="0"
        fill="none"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        stroke-linejoin="round"
        stroke-linecap="round"
        :style="fontStyle"
      >
        <tspan v-for="(char, index) in characters" :key="`s-${index}`" data-stroke-char>{{ char }}</tspan>
      </text>

      <g :filter="castShadow ? `url(#${shadowId})` : undefined">
        <text
          class="stroke-text__fill"
          x="0"
          y="0"
          :fill="fillColor"
          stroke="none"
          :style="fontStyle"
          :clip-path="fillMode === 'wipe' && wipeStart ? `url(#${wipeId})` : undefined"
        >
          <tspan v-for="(char, index) in characters" :key="`f-${index}`" data-fill-char>{{ char }}</tspan>
        </text>
      </g>

      <text
        v-if="dashArray"
        key="pattern"
        ref="strokeTextRef"
        class="stroke-text__stroke"
        x="0"
        y="0"
        fill="none"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        stroke-linejoin="round"
        stroke-linecap="round"
        :stroke-dasharray="dashArray"
        :mask="`url(#${revealId})`"
        :style="fontStyle"
      >
        <tspan v-for="(char, index) in characters" :key="`s-${index}`">{{ char }}</tspan>
      </text>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch, type CSSProperties } from 'vue';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type StrokeTextTrigger = 'mount' | 'hover' | 'scroll' | 'loop';
export type StrokeTextFillMode = 'wipe' | 'fade' | 'none';
export type StrokeTextWipeFrom = 'left' | 'right' | 'top' | 'bottom';
export type StrokeTextStyle = 'solid' | 'dashed' | 'dotted';

export interface StrokeTextProps {
  text?: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: StrokeTextTrigger;
  fillMode?: StrokeTextFillMode;
  wipeFrom?: StrokeTextWipeFrom;
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  letterSpacing?: number;
  reverse?: boolean;
  strokeStyle?: StrokeTextStyle;
  dashLength?: number;
  marching?: boolean;
  hoverRedraw?: boolean;
  shadow?: boolean;
  shadowColor?: string;
  className?: string;
  style?: CSSProperties;
}

interface StrokeTextBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DashPattern {
  array: string;
  period: number;
}

const SHADOW_OPACITY = 0.5;

const getWipeFrames = (box: StrokeTextBox, wipeFrom: StrokeTextWipeFrom) => {
  const end = { x: box.x, y: box.y, width: box.width, height: box.height };
  if (wipeFrom === 'right') return { start: { ...end, x: box.x + box.width, width: 0 }, end };
  if (wipeFrom === 'top') return { start: { ...end, height: 0 }, end };
  if (wipeFrom === 'bottom') return { start: { ...end, y: box.y + box.height, height: 0 }, end };
  return { start: { ...end, width: 0 }, end };
};

const getDashPattern = (strokeStyle: StrokeTextStyle, dashLength: number, strokeWidth: number): DashPattern | null => {
  const width = Math.max(Number(strokeWidth) || 0, 0.1);
  const length = Math.max(Number(dashLength) || 0, 1);
  if (strokeStyle === 'dotted') {
    const gap = Math.max(length, width * 1.8);
    return { array: `0 ${gap}`, period: gap };
  }
  if (strokeStyle === 'dashed') {
    const on = Math.max(length - width, 0.5);
    const off = length * 0.6 + width;
    return { array: `${on} ${off}`, period: on + off };
  }
  return null;
};

const props = withDefaults(defineProps<StrokeTextProps>(), {
  text: 'Draw Attention',
  strokeColor: '#7cff67',
  fillColor: 'currentColor',
  strokeWidth: 1.4,
  drawDuration: 1.6,
  fillDelay: 0.2,
  stagger: 0.05,
  ease: 'power2.out',
  trigger: 'mount',
  fillMode: 'wipe',
  wipeFrom: 'left',
  fontSize: 128,
  fontWeight: 800,
  fontFamily: 'inherit',
  letterSpacing: -4,
  reverse: false,
  strokeStyle: 'solid',
  dashLength: 10,
  marching: false,
  hoverRedraw: false,
  shadow: false,
  shadowColor: undefined,
  className: '',
  style: () => ({})
});

const rootRef = ref<HTMLSpanElement | null>(null);
const strokeTextRef = ref<SVGTextElement | null>(null);
const wipeRectRef = ref<SVGRectElement | null>(null);
const shadowRef = ref<SVGFEDropShadowElement | null>(null);

const box = shallowRef<StrokeTextBox | null>(null);

const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
const wipeId = `stroke-text-wipe-${baseId}`;
const revealId = `stroke-text-reveal-${baseId}`;
const erodeId = `stroke-text-erode-${baseId}`;
const shadowId = `stroke-text-shadow-${baseId}`;

const characters = computed(() => Array.from(String(props.text ?? '')));

const dash = computed(() => Math.max(props.fontSize * 7, 200));
const pattern = computed(() => getDashPattern(props.strokeStyle, props.dashLength, props.strokeWidth));
const dashArray = computed(() => (pattern.value ? pattern.value.array : null));
const dashPeriod = computed(() => (pattern.value ? pattern.value.period : 0));
const lift = computed(() => props.fontSize * 0.06);
const softness = computed(() => props.fontSize * 0.016);
const castShadow = computed(() => props.shadow && props.fillMode !== 'none');

const fontStyle = computed<CSSProperties>(() => ({
  fontFamily: props.fontFamily,
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  letterSpacing: `${props.letterSpacing}px`
}));

const viewBox = computed(() =>
  box.value
    ? `${box.value.x} ${box.value.y} ${box.value.width} ${box.value.height}`
    : `0 ${-props.fontSize} 600 ${props.fontSize * 1.3}`
);
const wipeStart = computed(() => (box.value ? getWipeFrames(box.value, props.wipeFrom).start : null));
const region = computed(() =>
  box.value
    ? {
        x: box.value.x - props.fontSize,
        y: box.value.y - props.fontSize,
        width: box.value.width + props.fontSize * 2,
        height: box.value.height + props.fontSize * 2
      }
    : {}
);

let measureCleanup: (() => void) | null = null;

const runMeasure = () => {
  measureCleanup?.();
  measureCleanup = null;
  const root = rootRef.value;
  if (!root || !strokeTextRef.value) return;

  let cancelled = false;

  const measure = () => {
    if (cancelled || !strokeTextRef.value) return;
    let bbox: DOMRect | undefined;
    try {
      bbox = strokeTextRef.value.getBBox();
    } catch {
      return;
    }
    if (!bbox || !bbox.width) return;

    const pad = Math.max(Number(props.strokeWidth) || 1, props.fontSize * 0.1);
    const next: StrokeTextBox = {
      x: bbox.x - pad,
      y: bbox.y - pad,
      width: bbox.width + pad * 2,
      height: bbox.height + pad * 2
    };

    const prev = box.value;
    if (
      prev &&
      Math.abs(prev.x - next.x) < 0.5 &&
      Math.abs(prev.width - next.width) < 0.5 &&
      Math.abs(prev.y - next.y) < 0.5 &&
      Math.abs(prev.height - next.height) < 0.5
    )
      return;
    box.value = next;
  };

  measure();
  document.fonts?.ready?.then(measure).catch(() => {});

  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
  observer?.observe(root);

  measureCleanup = () => {
    cancelled = true;
    observer?.disconnect();
  };
};

let animationCleanup: (() => void) | null = null;

const runAnimation = () => {
  animationCleanup?.();
  animationCleanup = null;
  const root = rootRef.value;
  const currentBox = box.value;
  if (typeof window === 'undefined' || !root || !currentBox) return;

  const strokes = gsap.utils.toArray<SVGTSpanElement>(root.querySelectorAll('[data-stroke-char]'));
  const fills = gsap.utils.toArray<SVGTSpanElement>(root.querySelectorAll('[data-fill-char]'));
  const wipe = wipeRectRef.value;
  const outline = strokeTextRef.value;
  const drop = shadowRef.value;
  if (!strokes.length) return;

  const {
    drawDuration,
    fillDelay,
    stagger,
    ease,
    trigger,
    fillMode,
    wipeFrom,
    reverse,
    marching,
    hoverRedraw,
    fontSize
  } = props;
  const dashValue = dash.value;
  const dashArrayValue = dashArray.value;
  const dashPeriodValue = dashPeriod.value;
  const liftValue = lift.value;

  const fillEnabled = fillMode !== 'none';
  const useWipe = fillEnabled && fillMode === 'wipe';
  const fillDuration = Math.max(0.4, drawDuration * 0.5);
  const staggerConfig: number | gsap.StaggerVars = reverse ? { each: stagger, from: 'end' as const } : stagger;
  const frames = getWipeFrames(currentBox, wipeFrom);
  const lifted = { dx: liftValue, dy: liftValue, 'flood-opacity': SHADOW_OPACITY };
  const grounded = { dx: 0, dy: 0, 'flood-opacity': 0 };
  const targets = [...strokes, ...fills, wipe, drop].filter(Boolean) as Element[];

  const setStart = () => {
    gsap.killTweensOf(targets);
    gsap.set(strokes, { strokeDasharray: dashValue, strokeDashoffset: dashValue, strokeOpacity: 1 });
    gsap.set(fills, { opacity: useWipe ? 1 : 0 });
    if (wipe) gsap.set(wipe, { attr: frames.start });
    if (drop) gsap.set(drop, { attr: grounded });
  };

  const setEnd = () => {
    gsap.killTweensOf(targets);
    gsap.set(strokes, { strokeDasharray: dashValue, strokeDashoffset: 0, strokeOpacity: 1 });
    gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });
    if (wipe) gsap.set(wipe, { attr: fillEnabled ? frames.end : frames.start });
    if (drop) gsap.set(drop, { attr: fillEnabled ? lifted : grounded });
  };

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    setEnd();
    animationCleanup = () => gsap.killTweensOf(targets);
    return;
  }

  const build = () => {
    setStart();
    const looping = trigger === 'loop';
    const tl = gsap.timeline({
      paused: true,
      repeat: looping ? -1 : 0,
      repeatDelay: looping ? 0.9 : 0,
      yoyo: looping,
      defaults: { overwrite: 'auto' }
    });

    tl.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig }, 0);

    if (useWipe && wipe) {
      tl.to(wipe, { attr: frames.end, duration: fillDuration, ease: 'power2.inOut' }, drawDuration + fillDelay);
    } else if (fillEnabled) {
      tl.to(
        fills,
        { opacity: 1, duration: fillDuration, ease: 'power2.out', stagger: staggerConfig },
        drawDuration + fillDelay
      );
    }

    if (drop && fillEnabled) {
      tl.to(
        drop,
        { attr: lifted, duration: fillDuration * 1.4, ease: 'power3.out' },
        drawDuration + fillDelay + fillDuration * 0.3
      );
    }

    return tl;
  };

  let timeline: gsap.core.Timeline | null = null;
  let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;
  let redraw: gsap.core.Timeline | null = null;
  const listeners: (() => void)[] = [];

  const listen = (handler: () => void) => {
    root.addEventListener('pointerenter', handler);
    listeners.push(handler);
  };

  if (trigger === 'hover') {
    setEnd();
    listen(() => {
      timeline?.kill();
      timeline = build();
      timeline.play(0);
    });
  } else {
    timeline = build();
    if (trigger === 'scroll') {
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          timeline?.play(0);
        }
      });
    } else {
      timeline.play(0);
    }

    if (hoverRedraw && trigger !== 'loop') {
      listen(() => {
        if (!timeline || timeline.progress() < 1 || redraw?.isActive()) return;
        redraw?.kill();
        redraw = gsap
          .timeline()
          .to(strokes, { strokeOpacity: 0, duration: 0.2, ease: 'power1.out' })
          .set(strokes, { strokeDashoffset: dashValue, strokeOpacity: 1 })
          .to(strokes, { strokeDashoffset: 0, duration: drawDuration * 0.8, ease, stagger: staggerConfig });
      });
    }
  }

  const march =
    dashArrayValue && marching && outline
      ? gsap.fromTo(
          outline,
          { strokeDashoffset: 0 },
          {
            strokeDashoffset: -dashPeriodValue,
            duration: dashPeriodValue / (fontSize * 0.22),
            ease: 'none',
            repeat: -1
          }
        )
      : null;

  animationCleanup = () => {
    listeners.forEach(handler => root.removeEventListener('pointerenter', handler));
    scrollTrigger?.kill();
    timeline?.kill();
    redraw?.kill();
    march?.kill();
    gsap.killTweensOf(targets);
  };
};

onMounted(runMeasure);

watch(
  [
    characters,
    () => props.fontFamily,
    () => props.fontSize,
    () => props.fontWeight,
    () => props.letterSpacing,
    () => props.strokeWidth
  ],
  runMeasure,
  { flush: 'post' }
);

watch(
  [
    box,
    dash,
    () => props.drawDuration,
    () => props.fillDelay,
    () => props.stagger,
    () => props.ease,
    () => props.trigger,
    () => props.fillMode,
    () => props.wipeFrom,
    () => props.reverse,
    dashArray,
    dashPeriod,
    () => props.marching,
    () => props.hoverRedraw,
    castShadow,
    lift,
    () => props.fontSize
  ],
  runAnimation,
  { flush: 'post' }
);

onBeforeUnmount(() => {
  measureCleanup?.();
  measureCleanup = null;
  animationCleanup?.();
  animationCleanup = null;
});
</script>

<style>
.stroke-text {
  display: block;
  width: 100%;
  line-height: 0;
}

.stroke-text--hover {
  cursor: pointer;
}

.stroke-text__svg {
  display: block;
  width: 100%;
  max-width: var(--stroke-text-width, 600px);
  height: auto;
  margin: 0 auto;
  overflow: visible;
}

.stroke-text__stroke,
.stroke-text__fill {
  user-select: none;
}
</style>
