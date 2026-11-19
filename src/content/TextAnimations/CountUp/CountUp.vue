<template>
  <span
    ref="rootRef"
    :class="className"
    :style="[{ fontVariantNumeric: 'tabular-nums' }, style]"
    @pointerenter="replayOnHover ? replay() : undefined"
  >
    <template v-if="model">
      <span
        :key="`roll-${play?.id || 0}`"
        aria-hidden="true"
        :style="{ display: 'inline-flex', whiteSpace: 'pre', userSelect: 'none' }"
      >
        <span v-if="prefix" :style="SLOT_STYLE">{{ prefix }}</span>
        <template v-for="(slot, index) in model.slots" :key="index">
          <span
            v-if="isMark(slot)"
            :ref="node => setSlot(index, node)"
            :style="{ ...SLOT_STYLE, overflow: 'hidden', ...collapsedFor(slot, model) }"
          >
            {{ slot.char }}
          </span>
          <span
            v-else
            :ref="node => setSlot(index, node)"
            :style="{ ...SLOT_STYLE, position: 'relative', overflow: 'hidden', ...collapsedFor(slot, model) }"
          >
            <span :style="{ display: 'flex', flexDirection: 'column', transform: `translateY(${-CELL}em)` }">
              <span v-for="offset in OFFSETS" :key="offset" :style="{ height: `${CELL}em` }">
                {{ mod10(slot.from + offset) }}
              </span>
            </span>
          </span>
        </template>
        <span v-if="model.label" :style="SLOT_STYLE">{{ model.label }}</span>
        <span v-if="suffix" :style="SLOT_STYLE">{{ suffix }}</span>
      </span>
      <span :style="SR_ONLY">{{ finalText }}</span>
      <svg aria-hidden="true" width="0" height="0" style="position: absolute">
        <defs>
          <filter
            v-for="column in model.columns"
            :key="column.index"
            :id="`${uid}-${column.index}`"
            x="-20%"
            y="-50%"
            width="140%"
            height="200%"
            color-interpolation-filters="sRGB"
          >
            <feGaussianBlur :ref="node => setFilter(column.index, node)" stdDeviation="0 0" />
          </filter>
        </defs>
      </svg>
    </template>
    <span v-else key="count" ref="textRef">{{ initialText }}</span>
  </span>
</template>

<script setup lang="ts">
import { animate, cubicBezier, useInView } from 'motion-v';
import {
  computed,
  onBeforeUnmount,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
  type CSSProperties,
  type ComponentPublicInstance
} from 'vue';

type Easing = 'easeOut' | 'linear' | 'expo' | 'spring';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  startWhen?: boolean;
  separator?: string;
  prefix?: string;
  suffix?: string;
  mode?: 'count' | 'roll';
  easing?: Easing;
  decimals?: number;
  format?: 'standard' | 'compact';
  trigger?: 'view' | 'load';
  replayOnHover?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

type Column = {
  slot: number;
  index: number;
  place: number;
  from: number;
  to: number;
  enter: boolean;
  leave: boolean;
  delta: number;
};

type Mark = { char: string; enter?: boolean; leave?: boolean; follow?: number };

type Slot = Column | Mark;

type Roll = { slots: Slot[]; columns: Column[]; label: string };

type Play = { id: number; from: number; to: number; spin: boolean; wait?: boolean };

const CELL = 1.2;
const STAGGER = 0.07;
const OFFSETS = [-1, 0, 1, 2];
const UNITS: [number, string][] = [
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K']
];
const SLOT_STYLE: CSSProperties = { display: 'inline-block', height: `${CELL}em`, lineHeight: `${CELL}em` };
const SR_ONLY: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const mod10 = (value: number) => ((value % 10) + 10) % 10;

const makeSpring = (overshoot: number) => {
  const log = Math.log(Math.min(0.5, Math.max(0.001, overshoot)));
  const zeta = -log / Math.sqrt(Math.PI * Math.PI + log * log);
  const damped = Math.PI / 0.52;
  const natural = damped / Math.sqrt(1 - zeta * zeta);
  const raw = (t: number) =>
    1 - Math.exp(-zeta * natural * t) * (Math.cos(damped * t) + ((zeta * natural) / damped) * Math.sin(damped * t));
  const residual = 1 - raw(1);
  return (t: number) => (t >= 1 ? 1 : raw(t) + residual * t * t * t);
};

const EASINGS: Record<Easing, (t: number) => number> = {
  linear: t => t,
  easeOut: cubicBezier(0.33, 1, 0.68, 1),
  expo: t => (t >= 1 ? 1 : (1 - Math.pow(2, -10 * t)) / (1 - Math.pow(2, -10))),
  spring: makeSpring(0.06)
};

const getDecimalPlaces = (num: number): number => {
  const str = num.toString();

  if (str.includes('.')) {
    const decimals = str.split('.')[1];

    if (parseInt(decimals) !== 0) {
      return decimals.length;
    }
  }

  return 0;
};

const unitFor = (value: number): [number, string] =>
  UNITS.find(([size]) => Math.abs(value) >= size * 0.9995) || [1, ''];

const scaleFor = (value: number, compact: boolean, decimals: number | undefined, places: number) => {
  if (!compact) return { size: 1, label: '', digits: places };
  const [size, label] = unitFor(value);
  const digits = decimals ?? (label ? (Math.abs(value) / size < 100 ? 1 : 0) : places);
  return { size, label, digits };
};

const splitNumber = (value: number, digits: number, size: number) => {
  const fixed = (Math.abs(value) / size).toFixed(digits);
  const [int, frac = ''] = fixed.split('.');
  return { negative: value < 0 && Number(fixed) !== 0, int, frac };
};

const group = (int: string, separator: string) => (separator ? int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : int);

const buildRoll = (
  a: number,
  b: number,
  spin: boolean,
  {
    compact,
    decimals,
    places,
    separator
  }: { compact: boolean; decimals: number | undefined; places: number; separator: string }
): Roll => {
  const { size, label, digits } = scaleFor(b, compact, decimals, places);
  const pa = splitNumber(a, digits, size);
  const pb = splitNumber(b, digits, size);
  const length = Math.max(pa.int.length, pb.int.length);
  const slots: Slot[] = [];
  const columns: Column[] = [];
  if (pa.negative || pb.negative) slots.push({ char: '-', enter: !pa.negative, leave: !pb.negative });
  const digitAt = (parts: { int: string; frac: string }, place: number) => {
    if (place < 0) return Number(parts.frac[-place - 1]);
    const index = parts.int.length - 1 - place;
    return index >= 0 ? Number(parts.int[index]) : null;
  };
  for (let place = length - 1; place >= -digits; place--) {
    if (place === -1) slots.push({ char: '.' });
    const start = digitAt(pa, place);
    const end = digitAt(pb, place);
    const column: Column = {
      slot: slots.length,
      index: columns.length,
      place,
      from: start ?? 0,
      to: end ?? 0,
      enter: start === null,
      leave: end === null,
      delta: 0
    };
    slots.push(column);
    columns.push(column);
    if (separator && place > 0 && place % 3 === 0) slots.push({ char: separator, follow: column.index });
  }
  const up = spin || b >= a;
  columns.forEach((column, index) => {
    const rank = columns.length - 1 - index;
    const base = up ? mod10(column.to - column.from) : -mod10(column.from - column.to);
    const turns = spin
      ? Math.max(1, 3 - rank)
      : Math.min(Math.floor(Math.abs(b - a) / (size * 10 ** (column.place + 1))), Math.max(0, 3 - rank));
    column.delta = base + (up ? 10 : -10) * turns;
  });
  return { slots, columns, label };
};

const isMark = (slot: Slot): slot is Mark => 'char' in slot;

const collapsedFor = (slot: Slot, roll: Roll): CSSProperties => {
  const hidden = isMark(slot)
    ? slot.enter || (slot.follow !== undefined && roll.columns[slot.follow].enter)
    : slot.enter;
  return hidden ? { width: 0, opacity: 0 } : {};
};

const props = withDefaults(defineProps<CountUpProps>(), {
  from: 0,
  direction: 'up',
  delay: 0,
  duration: 2,
  className: '',
  startWhen: true,
  separator: '',
  prefix: '',
  suffix: '',
  mode: 'count',
  easing: 'easeOut',
  decimals: undefined,
  format: 'standard',
  trigger: 'view',
  replayOnHover: false
});

const rootRef = useTemplateRef<HTMLSpanElement>('rootRef');
const textRef = useTemplateRef<HTMLSpanElement>('textRef');
const slotRefs: (HTMLSpanElement | null)[] = [];
const filterRefs: (SVGFEGaussianBlurElement | null)[] = [];
const uid = useId().replace(/[^\w-]/g, '');
const startValue = computed(() => (props.direction === 'down' ? props.to : props.from));
const endValue = computed(() => (props.direction === 'down' ? props.from : props.to));
let valueRef = startValue.value;
let started = false;
let running = false;
const play = shallowRef<Play | null>(null);
const isInView = useInView(rootRef, { once: true, margin: '0px' });
const active = computed(() => props.trigger === 'load' || isInView.value);
const compact = computed(() => props.format === 'compact');
const places = computed(() => props.decimals ?? Math.max(getDecimalPlaces(props.from), getDecimalPlaces(props.to)));

const setSlot = (index: number, node: Element | ComponentPublicInstance | null) => {
  slotRefs[index] = (node as HTMLSpanElement | null) ?? null;
};

const setFilter = (index: number, node: Element | ComponentPublicInstance | null) => {
  filterRefs[index] = (node as SVGFEGaussianBlurElement | null) ?? null;
};

const formatValue = computed(() => {
  const isCompact = compact.value;
  const decimals = props.decimals;
  const placeCount = places.value;
  const separator = props.separator;
  const prefix = props.prefix;
  const suffix = props.suffix;
  return (latest: number) => {
    const { size, label, digits } = scaleFor(latest, isCompact, decimals, placeCount);
    const parts = splitNumber(latest, digits, size);
    const body = `${parts.negative ? '-' : ''}${group(parts.int, separator)}${parts.frac ? `.${parts.frac}` : ''}`;
    return `${prefix}${body}${label}${suffix}`;
  };
});

const model = computed(() => {
  if (props.mode !== 'roll') return null;
  const a = play.value ? play.value.from : startValue.value;
  const b = play.value ? play.value.to : endValue.value;
  return buildRoll(a, b, !!play.value?.spin, {
    compact: compact.value,
    decimals: props.decimals,
    places: places.value,
    separator: props.separator
  });
});

const initialText = formatValue.value(startValue.value);

const finalText = computed(() => formatValue.value(play.value ? play.value.to : endValue.value));

watch(
  [() => props.mode, startValue, formatValue],
  () => {
    if (!started) valueRef = startValue.value;
    if (props.mode === 'count' && !running && textRef.value) {
      textRef.value.textContent = formatValue.value(valueRef);
    }
  },
  { immediate: true, flush: 'post' }
);

watch(
  [active, () => props.startWhen, endValue],
  () => {
    if (!active.value || !props.startWhen) return;
    started = true;
    play.value = {
      id: (play.value?.id || 0) + 1,
      from: valueRef,
      to: endValue.value,
      spin: false,
      wait: true
    };
  },
  { immediate: true, flush: 'post' }
);

let stopCurrent: (() => void) | null = null;

const run = (current: Play) => {
  const live = {
    model: model.value,
    mode: props.mode,
    easing: props.easing,
    duration: Math.max(0, props.duration),
    delay: props.delay
  };
  const ease = EASINGS[live.easing] || EASINGS.easeOut;
  const total = live.duration;
  const progress = (t: number) => (total > 0 ? clamp01(t / total) : 1);
  let render: (t: number) => void;

  if (live.mode === 'roll' && live.model && rootRef.value) {
    const { columns: layout, slots } = live.model;
    const fontSize = parseFloat(getComputedStyle(rootRef.value).fontSize) || 16;
    const cell = CELL * fontSize;
    const stagger = layout.length > 1 ? Math.min(STAGGER, (total * 0.4) / (layout.length - 1)) : 0;
    const span = Math.max(0.001, total - stagger * (layout.length - 1));
    const columns = layout.map(column => {
      const box = slotRefs[column.slot];
      const strip = box?.firstElementChild as HTMLSpanElement | null;
      return {
        ...column,
        box,
        strip,
        blur: filterRefs[column.index],
        cells: strip ? Array.from(strip.children, node => node.firstChild) : ([] as (ChildNode | null)[]),
        width: box ? box.scrollWidth : 0,
        ease:
          live.easing === 'spring'
            ? makeSpring(Math.min(0.12, Math.max(0.01, 0.35 / Math.max(1, Math.abs(column.delta)))))
            : ease,
        base: Math.floor(column.from),
        sigma: 0,
        presence: column.enter ? 0 : 1
      };
    });
    const marks = slots
      .map((slot, index) => ({ ...slot, node: slotRefs[index] }))
      .filter(
        (slot): slot is Mark & { node: HTMLSpanElement } =>
          'char' in slot && !!slot.node && (!!slot.enter || !!slot.leave || slot.follow !== undefined)
      )
      .map(slot => ({ ...slot, width: slot.node.scrollWidth }));

    const fade = (node: HTMLSpanElement | null | undefined, width: number, presence: number, settled: boolean) => {
      if (!node) return;
      node.style.width = settled ? '' : `${(presence * width).toFixed(2)}px`;
      node.style.opacity = settled ? '' : presence.toFixed(3);
    };

    render = (t: number) => {
      columns.forEach((column, index) => {
        if (!column.strip) return;
        const u = clamp01((t - index * stagger) / span);
        const pos = column.from + column.delta * column.ease(u);
        const base = Math.floor(pos);
        if (base !== column.base) {
          column.base = base;
          column.cells.forEach((node, offset) => {
            if (node) node.nodeValue = String(mod10(base + offset - 1));
          });
        }
        column.strip.style.transform = `translateY(${(-(1 + pos - base) * CELL).toFixed(4)}em)`;

        const u0 = Math.max(0, u - 0.004);
        const u1 = Math.min(1, u + 0.004);
        const speed =
          u1 > u0 ? (Math.abs(column.delta) * Math.abs(column.ease(u1) - column.ease(u0))) / (u1 - u0) / span : 0;
        const sigma = u > 0 && u < 1 ? Math.min(cell * 0.05, (speed * cell) / 600) : 0;
        if (Math.abs(sigma - column.sigma) > 0.05 || (sigma === 0 && column.sigma !== 0)) {
          column.sigma = sigma;
          if (sigma > 0.2 && column.blur) {
            column.blur.setAttribute('stdDeviation', `0 ${sigma.toFixed(2)}`);
            column.strip.style.filter = `url(#${uid}-${index})`;
          } else {
            column.strip.style.filter = '';
          }
        }

        if (column.enter || column.leave) {
          column.presence = column.enter ? smooth(0, 0.45, u) : 1 - smooth(0.55, 1, u);
          fade(column.box, column.width, column.presence, column.enter && u >= 1);
        }
      });

      const overall = progress(t);
      marks.forEach(mark => {
        if (mark.follow !== undefined) {
          const column = columns[mark.follow];
          if (column && (column.enter || column.leave))
            fade(mark.node, mark.width, column.presence, column.enter && column.presence >= 1);
        } else {
          const presence = mark.enter ? smooth(0, 0.3, overall) : 1 - smooth(0.7, 1, overall);
          fade(mark.node, mark.width, presence, !!mark.enter && overall >= 1);
        }
      });

      valueRef = current.from + (current.to - current.from) * ease(overall);
    };
  } else {
    render = (t: number) => {
      const value = current.from + (current.to - current.from) * ease(progress(t));
      valueRef = value;
      if (textRef.value) textRef.value.textContent = formatValue.value(value);
    };
  }

  running = true;
  if (typeof props.onStart === 'function') props.onStart();

  const finish = () => {
    render(Infinity);
    valueRef = current.to;
    running = false;
    if (typeof props.onEnd === 'function') props.onEnd();
  };

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return null;
  }

  const controls = animate(0, total, {
    duration: total,
    delay: current.wait ? live.delay : 0,
    ease: 'linear',
    onUpdate: render,
    onComplete: finish
  });

  return () => {
    controls.stop();
    running = false;
  };
};

watch(
  play,
  current => {
    stopCurrent?.();
    stopCurrent = null;
    if (!current) return;
    stopCurrent = run(current);
  },
  { flush: 'post' }
);

onBeforeUnmount(() => {
  stopCurrent?.();
  stopCurrent = null;
});

const replay = () => {
  if (!props.replayOnHover || running || !started) return;
  const previous = play.value;
  play.value =
    props.mode === 'roll'
      ? { id: (previous?.id || 0) + 1, from: valueRef, to: valueRef, spin: true }
      : { id: (previous?.id || 0) + 1, from: startValue.value, to: endValue.value, spin: false };
};
</script>
