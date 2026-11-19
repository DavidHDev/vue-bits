<template>
  <span ref="rootRef" :class="[className, 'variable-proximity']" :style="rootStyle" @click="onClick?.()">
    <template v-for="(word, wordIndex) in wordList" :key="wordIndex">
      <br v-if="breakSet.has(wordIndex)" />
      <span data-word="" style="display: inline-block; white-space: nowrap">
        <span
          v-for="item in word"
          :key="item.index"
          :ref="el => setLetter(el as HTMLSpanElement | null, item.index)"
          :style="letterStyle"
          aria-hidden="true"
        >
          {{ item.char }}
        </span>
        <span v-if="wordIndex < wordList.length - 1" style="display: inline-block">&nbsp;</span>
      </span>
    </template>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

export type Falloff = 'linear' | 'exponential' | 'gaussian';

interface VariableProximityProps {
  label?: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: HTMLElement | null;
  radius?: number;
  falloff?: Falloff;
  smoothing?: number;
  fromColor?: string;
  toColor?: string;
  scale?: number;
  lift?: number;
  idleWave?: boolean;
  fontSize?: number | string;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<VariableProximityProps>(), {
  label: '',
  fromFontVariationSettings: "'wght' 400, 'opsz' 9",
  toFontVariationSettings: "'wght' 1000, 'opsz' 40",
  containerRef: null,
  radius: 50,
  falloff: 'linear',
  smoothing: 0.2,
  fromColor: undefined,
  toColor: undefined,
  scale: 1,
  lift: 0,
  idleWave: false,
  fontSize: undefined,
  className: '',
  onClick: undefined,
  style: undefined
});

const GAUSSIAN_EDGE = Math.exp(-2);
const WAVE_PERIOD = 3.2;
const WAVE_PEAK = 0.7;

const parseSettings = (settings: string) =>
  new Map(
    settings
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const [name, value] = part.split(/\s+/);
        return [name.replace(/['"]/g, ''), parseFloat(value)] as [string, number];
      })
  );

const strengthAt = (distance: number, radius: number, falloff: Falloff) => {
  if (distance >= radius) return 0;
  const norm = 1 - distance / radius;
  switch (falloff) {
    case 'exponential':
      return norm * norm;
    case 'gaussian':
      return (Math.exp(-2 * (distance / radius) ** 2) - GAUSSIAN_EDGE) / (1 - GAUSSIAN_EDGE);
    case 'linear':
    default:
      return norm;
  }
};

const rootRef = ref<HTMLSpanElement | null>(null);
const letterRefs: (HTMLSpanElement | null)[] = [];
const state = {
  pointer: { x: 0, y: 0, active: false },
  levels: [] as number[],
  targets: [] as number[]
};
const lineStarts = ref<string | null>(null);

const setLetter = (el: HTMLSpanElement | null, index: number) => {
  letterRefs[index] = el;
};

const axes = computed(() => {
  const fromSettings = parseSettings(props.fromFontVariationSettings);
  const toSettings = parseSettings(props.toFontVariationSettings);
  return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
    axis,
    fromValue,
    toValue: toSettings.get(axis) ?? fromValue
  }));
});

const wordList = computed(() => {
  let letterIndex = 0;
  return props.label.split(' ').map(word => word.split('').map(char => ({ char, index: letterIndex++ })));
});

const breakSet = computed(() => new Set(lineStarts.value ? lineStarts.value.split(',').map(Number) : []));

const rootStyle = computed<CSSProperties>(() => ({
  display: 'inline',
  ...(props.fontSize !== undefined
    ? { fontSize: typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize }
    : {}),
  ...(lineStarts.value !== null ? { whiteSpace: 'nowrap' } : {}),
  ...props.style
}));

const letterStyle = computed<CSSProperties>(() => ({
  display: 'inline-block',
  fontVariationSettings: props.fromFontVariationSettings,
  color: props.fromColor || undefined,
  transformOrigin: '50% 80%'
}));

const startLayout = () => {
  const root = rootRef.value;
  if (!root) return () => {};
  const fromFontVariationSettings = props.fromFontVariationSettings;
  let frame = 0;
  let live = true;
  let lastWidth = -1;

  const measure = () => {
    frame = 0;
    if (!live) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>('[data-word]'));
    const breaks = Array.from(root.querySelectorAll<HTMLElement>('br'));
    const letters = letterRefs.filter((letter): letter is HTMLSpanElement => Boolean(letter));
    const saved = letters.map(letter => letter.style.fontVariationSettings);
    const wrap = root.style.whiteSpace;
    root.style.whiteSpace = 'normal';
    breaks.forEach(node => (node.style.display = 'none'));
    letters.forEach(letter => (letter.style.fontVariationSettings = fromFontVariationSettings));
    const starts: number[] = [];
    let lastTop: number | null = null;
    words.forEach((word, index) => {
      const top = word.getBoundingClientRect().top;
      if (lastTop !== null && top > lastTop + 2) starts.push(index);
      lastTop = top;
    });
    letters.forEach((letter, index) => (letter.style.fontVariationSettings = saved[index]));
    breaks.forEach(node => (node.style.display = ''));
    root.style.whiteSpace = wrap;
    const key = starts.join(',');
    if (lineStarts.value !== key) lineStarts.value = key;
  };

  const queue = (entries?: ResizeObserverEntry[]) => {
    const width = entries?.[0]?.contentRect.width;
    if (width !== undefined) {
      if (Math.abs(width - lastWidth) < 1) return;
      lastWidth = width;
    }
    if (!frame) frame = requestAnimationFrame(measure);
  };

  measure();
  const parent = root.parentElement;
  const observer = parent && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(queue) : null;
  if (parent) observer?.observe(parent);
  document.fonts?.ready.then(() => queue());

  return () => {
    live = false;
    cancelAnimationFrame(frame);
    observer?.disconnect();
  };
};

const startProximity = () => {
  const { pointer, levels, targets } = state;
  const currentAxes = axes.value;
  const { fromFontVariationSettings, radius, falloff, smoothing, fromColor, toColor, scale, lift, idleWave } = props;
  const written: string[] = [];
  const painted: string[] = [];
  const moved: string[] = [];
  const anchors: { x: number; y: number }[] = [];
  const tinted = Boolean(fromColor || toColor);
  const restColor = fromColor || 'currentColor';
  const nearColor = toColor || 'currentColor';
  const growth = (Number(scale) || 1) - 1;
  const rise = Number(lift) || 0;
  const transformed = growth !== 0 || rise !== 0;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const waving = idleWave && !reduced;
  let frame = 0;
  let lastTime = 0;
  let dirty = true;
  let layoutDirty = true;
  let nearAny = false;
  let lastNear = -Infinity;
  let waveMix = 0;
  let span = 1;
  let visible = true;

  letterRefs.forEach(letter => {
    if (!letter) return;
    if (!tinted) letter.style.color = '';
    if (!transformed) letter.style.transform = '';
  });

  const settingsAt = (level: number) =>
    currentAxes
      .map(({ axis, fromValue, toValue }) => `'${axis}' ${fromValue + (toValue - fromValue) * level}`)
      .join(', ');

  const measureAnchors = () => {
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    letterRefs.forEach((letter, index) => {
      if (!letter) return;
      const rect = letter.getBoundingClientRect();
      anchors[index] = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      left = Math.min(left, rect.left);
      top = Math.min(top, rect.top);
      right = Math.max(right, rect.right);
    });
    anchors.forEach(anchor => {
      anchor.x -= left;
      anchor.y -= top;
    });
    span = Math.max(220, (right - left) * 0.85);
  };

  const measure = () => {
    targets.length = letterRefs.length;
    targets.fill(0);
    nearAny = false;
    if (!pointer.active) return;

    const area = props.containerRef?.getBoundingClientRect();
    if (area) {
      const dx = Math.max(area.left - pointer.x, 0, pointer.x - area.right);
      const dy = Math.max(area.top - pointer.y, 0, pointer.y - area.bottom);
      if (dx * dx + dy * dy >= radius * radius) return;
    }

    letterRefs.forEach((letter, index) => {
      if (!letter) return;
      const rect = letter.getBoundingClientRect();
      const distance = Math.hypot(pointer.x - (rect.left + rect.width / 2), pointer.y - (rect.top + rect.height / 2));
      targets[index] = strengthAt(distance, radius, falloff);
      if (targets[index] > 0) nearAny = true;
    });
  };

  const waveAt = (index: number, time: number) => {
    const anchor = anchors[index];
    if (!anchor) return 0;
    const phase = ((anchor.x + anchor.y * 0.6) / span - time / WAVE_PERIOD) * Math.PI * 2;
    return WAVE_PEAK * ((1 + Math.cos(phase)) / 2) ** 2.2;
  };

  const tick = (now: number) => {
    frame = 0;
    const delta = lastTime ? Math.min(now - lastTime, 64) : 16;
    lastTime = now;

    if (dirty) {
      measure();
      dirty = false;
    }
    if (waving && layoutDirty) {
      measureAnchors();
      layoutDirty = false;
    }

    if (nearAny) lastNear = now;
    const idle = waving && visible && !nearAny && now - lastNear > 500;
    const goal = idle ? 1 : 0;
    waveMix += (goal - waveMix) * (1 - Math.exp(-delta / 600));
    if (Math.abs(goal - waveMix) < 0.002) waveMix = goal;

    const ease = smoothing > 0 ? 1 - Math.exp(-delta / (smoothing * 400)) : 1;
    const time = now / 1000;
    let settling = false;

    letterRefs.forEach((letter, index) => {
      if (!letter) return;
      let target = targets[index] ?? 0;
      if (waveMix > 0) target = Math.max(target, waveMix * waveAt(index, time));
      const current = levels[index] ?? 0;
      let next = current + (target - current) * ease;
      if (Math.abs(target - next) < 0.002) {
        next = target;
      } else {
        settling = true;
      }
      levels[index] = next;

      const settings = next === 0 ? fromFontVariationSettings : settingsAt(next);
      if (written[index] !== settings) {
        written[index] = settings;
        letter.style.fontVariationSettings = settings;
      }

      if (tinted) {
        const paint =
          next === 0
            ? fromColor || ''
            : `color-mix(in oklab, ${restColor} ${((1 - next) * 100).toFixed(1)}%, ${nearColor})`;
        if (painted[index] !== paint) {
          painted[index] = paint;
          letter.style.color = paint;
        }
      }

      if (transformed) {
        const shift =
          next === 0 ? '' : `translateY(${(-rise * next).toFixed(3)}em) scale(${(1 + growth * next).toFixed(3)})`;
        if (moved[index] !== shift) {
          moved[index] = shift;
          letter.style.transform = shift;
        }
      }
    });

    if (settling || waveMix > 0 || (waving && visible && !nearAny)) {
      frame = requestAnimationFrame(tick);
    } else {
      lastTime = 0;
    }
  };

  const schedule = () => {
    dirty = true;
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const relayout = () => {
    layoutDirty = true;
    schedule();
  };

  const handleMove = (x: number, y: number) => {
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
    schedule();
  };

  const handleMouseMove = (event: MouseEvent) => handleMove(event.clientX, event.clientY);
  const handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (touch) handleMove(touch.clientX, touch.clientY);
  };
  const handleLeave = () => {
    pointer.active = false;
    schedule();
  };

  const root = document.documentElement;
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  window.addEventListener('touchend', handleLeave);
  window.addEventListener('touchcancel', handleLeave);
  window.addEventListener('scroll', schedule, { capture: true, passive: true });
  window.addEventListener('resize', relayout);
  root.addEventListener('mouseleave', handleLeave);

  let observer: IntersectionObserver | null = null;
  if (waving && rootRef.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      schedule();
    });
    observer.observe(rootRef.value);
  }
  if (waving) document.fonts?.ready.then(relayout);

  schedule();

  return () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleLeave);
    window.removeEventListener('touchcancel', handleLeave);
    window.removeEventListener('scroll', schedule, { capture: true });
    window.removeEventListener('resize', relayout);
    root.removeEventListener('mouseleave', handleLeave);
  };
};

let stopLayout: (() => void) | null = null;
let stopProximity: (() => void) | null = null;

const runLayout = () => {
  stopLayout?.();
  stopLayout = startLayout();
};

const runProximity = () => {
  stopProximity?.();
  stopProximity = startProximity();
};

onMounted(() => {
  runLayout();
  runProximity();
});

watch([() => props.label, () => props.fromFontVariationSettings, () => props.fontSize], runLayout, {
  flush: 'post'
});

watch(
  [
    axes,
    () => props.fromFontVariationSettings,
    () => props.containerRef,
    () => props.radius,
    () => props.falloff,
    () => props.smoothing,
    () => props.fromColor,
    () => props.toColor,
    () => props.scale,
    () => props.lift,
    () => props.idleWave,
    () => props.fontSize,
    () => props.label,
    lineStarts
  ],
  runProximity,
  { flush: 'post' }
);

onBeforeUnmount(() => {
  stopLayout?.();
  stopProximity?.();
  stopLayout = null;
  stopProximity = null;
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap');

.variable-proximity {
  font-family: 'Roboto Flex', sans-serif;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
