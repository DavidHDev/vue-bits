<script setup lang="ts">
import {
  ArrowDown01Icon,
  Attachment01Icon,
  Calendar03Icon,
  Cancel01Icon,
  ChartLineData01Icon,
  File02Icon,
  Globe02Icon,
  HelpCircleIcon,
  Mail01Icon,
  Mic01Icon,
  PlusSignIcon,
  SparklesIcon,
  Tick02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { animate, motionValue, useReducedMotion, type AnimationPlaybackControls } from 'motion-v';
import { computed, onBeforeUnmount, onMounted, ref, watch, type Component, type CSSProperties } from 'vue';

export interface PromptBarSource {
  key: string;
  name: string;
  description?: string;
  icon?: IconArray | Component;
  attach?: boolean;
}

export interface PromptBarCommand {
  key: string;
  name: string;
  description?: string;
}

export interface PromptBarModel {
  key: string;
  name: string;
  tag?: string;
}

export interface PromptBarSendDetail {
  attachments: string[];
  model?: PromptBarModel;
  effort?: string;
}

interface PromptBarProps {
  placeholder?: string;
  sources?: PromptBarSource[];
  commands?: PromptBarCommand[];
  models?: PromptBarModel[];
  defaultModel?: string;
  efforts?: string[];
  defaultEffort?: string;
  busy?: boolean;
  onAttach?: () => string | string[] | void | Promise<string | string[] | void>;
  onDictate?: () => string | void | Promise<string | void>;
  background?: string;
  color?: string;
  menuBackground?: string;
  sparkColor?: string;
  sparkBoost?: number;
  width?: number;
  radius?: number;
  maxRows?: number;
  morphDuration?: number;
  squash?: number;
  tilt?: number;
  pressScale?: number;
  className?: string;
}

type Row = {
  key: string;
  name: string;
  description?: string;
  tag?: string;
  icon?: IconArray | Component;
  attach?: boolean;
};
type Token = { kind: 'at' | 'slash'; query: string; start: number };
type Spark = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  life: number;
  span: number;
};

const ARROW_UP = [12, 4.5, 18.5, 11, 14.25, 11, 14.25, 19.5, 9.75, 19.5, 9.75, 11, 5.5, 11];
const SQUARE = [12, 6, 18, 6, 18, 12, 18, 18, 6, 18, 6, 12, 6, 6];
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
const LINE = 22;
const EDGE = 11;

const DEFAULT_SOURCES: PromptBarSource[] = [
  {
    key: 'files',
    name: 'Photos & files',
    description: 'Upload from this device',
    icon: Attachment01Icon as IconArray,
    attach: true
  },
  { key: 'web', name: 'Web search', description: 'Live results', icon: Globe02Icon as IconArray },
  { key: 'sales', name: 'Sales data', description: 'Revenue and churn', icon: ChartLineData01Icon as IconArray },
  { key: 'docs', name: 'Documents', description: 'Specs, notes, briefs', icon: File02Icon as IconArray },
  { key: 'mail', name: 'Mail', description: 'Read and draft mail', icon: Mail01Icon as IconArray },
  { key: 'calendar', name: 'Calendar', description: 'Events and availability', icon: Calendar03Icon as IconArray }
];
const DEFAULT_COMMANDS: PromptBarCommand[] = [
  { key: 'summarize', name: '/summarize', description: 'Digest the thread so far' },
  { key: 'compare', name: '/compare', description: 'Two options side by side' },
  { key: 'draft', name: '/draft', description: 'Write a first version' },
  { key: 'explain', name: '/explain', description: 'A plain-language walkthrough' },
  { key: 'tasks', name: '/tasks', description: 'Turn this into a to-do list' }
];
const DEFAULT_MODELS: PromptBarModel[] = [
  { key: 'nova-3', name: 'Nova 3', tag: 'Flagship' },
  { key: 'nova-mini', name: 'Nova Mini', tag: 'Fast' },
  { key: 'nova-2', name: 'Nova 2', tag: 'Legacy' }
];
const DEFAULT_EFFORTS = ['Low', 'Medium', 'High', 'Extra', 'Max'];

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const pathAt = (a: number[], b: number[], t: number) => {
  let d = '';
  for (let i = 0; i < a.length; i += 2) {
    d += `${i ? 'L' : 'M'}${mix(a[i], b[i], t).toFixed(2)} ${mix(a[i + 1], b[i + 1], t).toFixed(2)}`;
  }
  return `${d}Z`;
};

const parseToken = (draft: string): Token | null => {
  const m = /(^|\s)([@/])([\w-]*)$/.exec(draft);
  if (!m) return null;
  return { kind: m[2] === '@' ? 'at' : 'slash', query: m[3].toLowerCase(), start: m.index + m[1].length };
};

const isIconData = (icon: IconArray | Component): icon is IconArray => Array.isArray(icon);

const capture = (el: HTMLElement, id: number) => {
  try {
    el.setPointerCapture(id);
    return true;
  } catch {
    return false;
  }
};

const props = withDefaults(defineProps<PromptBarProps>(), {
  placeholder: 'Ask anything',
  sources: undefined,
  commands: undefined,
  models: undefined,
  defaultModel: '',
  efforts: undefined,
  defaultEffort: '',
  busy: false,
  onAttach: undefined,
  onDictate: undefined,
  background: '#272a27',
  color: '#f5f5f5',
  menuBackground: '#313531',
  sparkColor: '#a0ffbc',
  sparkBoost: 1,
  width: 400,
  radius: 16,
  maxRows: 5,
  morphDuration: 240,
  squash: 0.12,
  tilt: 8,
  pressScale: 0.96,
  className: ''
});

const emit = defineEmits<{
  send: [text: string, detail: PromptBarSendDetail];
  stop: [];
  effortChange: [effort: string];
}>();

const sourceList = computed(() => props.sources ?? DEFAULT_SOURCES);
const commandList = computed(() => props.commands ?? DEFAULT_COMMANDS);
const modelList = computed(() => props.models ?? DEFAULT_MODELS);
const effortList = computed(() => props.efforts ?? DEFAULT_EFFORTS);

const reduce = useReducedMotion();
const rootRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);
const glowRef = ref<HTMLSpanElement | null>(null);
const sparkRef = ref<HTMLCanvasElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);
const typing = { energy: 0, strokes: 0 };
const rowRefs: (HTMLButtonElement | null)[] = [];
let lastOpen: string | null = null;
let dictation = 0;

const draft = ref('');
const attachments = ref<string[]>([]);
const modelKey = ref(props.defaultModel);
const plusOpen = ref(false);
const modelOpen = ref(false);
const effortOpen = ref(false);
const effortIndex = ref(
  (() => {
    const i = effortList.value.indexOf(props.defaultEffort);
    return i >= 0 ? i : Math.max(0, Math.floor((effortList.value.length - 1) / 2));
  })()
);
const dismissed = ref(false);
const active = ref(0);
const listening = ref(false);
const pressed = ref(false);

const model = computed(() => modelList.value.find(m => m.key === modelKey.value) ?? modelList.value[0]);
const token = computed(() => (dismissed.value ? null : parseToken(draft.value)));
const open = computed(() =>
  plusOpen.value ? 'at' : (token.value?.kind ?? (modelOpen.value ? 'model' : effortOpen.value ? 'effort' : null))
);
const query = computed(() => (plusOpen.value ? '' : (token.value?.query ?? '')));
const list = computed<Row[]>(() => {
  if (open.value === 'at') return sourceList.value.filter(s => s.name.toLowerCase().includes(query.value));
  if (open.value === 'slash')
    return commandList.value.filter(c => c.name.replace(/^\//, '').toLowerCase().startsWith(query.value));
  if (open.value === 'model') return modelList.value;
  return [];
});
const cursor = computed(() => Math.min(active.value, Math.max(0, list.value.length - 1)));
const canSend = computed(() => draft.value.trim().length > 0 || attachments.value.length > 0);
const armed = computed(() => props.busy || canSend.value);
const level = computed(() => effortList.value[effortIndex.value] ?? '');
const maxed = computed(() => effortList.value.length > 1 && effortIndex.value === effortList.value.length - 1);
const hasDictate = computed(() => typeof props.onDictate === 'function');
const menuLabel = computed(() =>
  open.value === 'at' ? 'Sources' : open.value === 'slash' ? 'Commands' : open.value === 'model' ? 'Models' : 'Effort'
);

const focusInput = () => inputRef.value?.focus({ preventScroll: true });
const closeMenus = () => {
  plusOpen.value = false;
  modelOpen.value = false;
  effortOpen.value = false;
};

watch(
  [open, cursor, list],
  () => {
    const glow = glowRef.value;
    if (!glow || !open.value) return;
    const row = rowRefs[cursor.value];
    if (!row) {
      glow.style.opacity = '0';
      return;
    }
    const fresh = lastOpen !== open.value;
    lastOpen = open.value;
    if (fresh) glow.style.transition = 'none';
    glow.style.top = `${row.offsetTop}px`;
    glow.style.height = `${row.offsetHeight}px`;
    glow.style.opacity = '1';
    if (fresh) {
      void glow.offsetHeight;
      glow.style.transition = '';
    }
  },
  { flush: 'post' }
);
watch(open, value => {
  if (!value) lastOpen = null;
});

watch([plusOpen, modelOpen, effortOpen], (_next, _prev, onCleanup) => {
  if (!plusOpen.value && !modelOpen.value && !effortOpen.value) return;
  const onDown = (e: PointerEvent) => {
    if (!rootRef.value?.contains(e.target as Node)) closeMenus();
  };
  document.addEventListener('pointerdown', onDown);
  onCleanup(() => document.removeEventListener('pointerdown', onDown));
});

const fitInput = () => {
  const el = inputRef.value;
  if (!el) return;
  el.style.height = '0px';
  const max = LINE * props.maxRows;
  el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
};
watch([draft, () => props.maxRows], fitInput, { flush: 'post' });

const t = motionValue(props.busy ? 1 : 0);
let dir = props.busy ? 1 : -1;
let glyphControls: AnimationPlaybackControls | null = null;
const glyphStart = pathAt(ARROW_UP, SQUARE, t.get());
let offGlyph: (() => void) | undefined;

const syncGlyph = () => {
  glyphControls?.stop();
  glyphControls = null;
  const target = props.busy ? 1 : 0;
  dir = props.busy ? 1 : -1;
  if (t.get() === target) return;
  glyphControls = animate(
    t,
    target,
    reduce.value ? { duration: 0 } : { duration: props.morphDuration / 1000, ease: EASE_IN_OUT }
  );
};
watch([() => props.busy, () => props.morphDuration, reduce], syncGlyph);

let stopSparks: (() => void) | null = null;
const startSparks = () => {
  const canvas = sparkRef.value;
  if (!maxed.value || reduce.value || !canvas) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const sparkColor = props.sparkColor;
  typing.strokes = 0;
  let raf = 0;
  let last = performance.now();
  let w = 0;
  let h = 0;
  let due = 0;
  let speed = 1;
  let pulse = 0;
  const parts: Spark[] = [];
  let resizePending = false;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const spawn = (burst: boolean) => {
    parts.push({
      x: Math.random() * w,
      y: burst ? h * (0.2 + Math.random() * 0.8) : h + 3,
      r: 0.9 + Math.random() * 1.1,
      vy: -(7 + Math.random() * 9),
      sway: (Math.random() - 0.5) * 10,
      phase: Math.random() * Math.PI * 2,
      life: burst ? Math.random() * 1.2 : 0,
      span: 2.4 + Math.random() * 2.4
    });
  };
  const tick = (now: number) => {
    if (resizePending) {
      resizePending = false;
      resize();
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const gain = props.sparkBoost;
    typing.energy *= Math.exp(-dt / 0.8);
    pulse *= Math.exp(-dt / 0.16);
    if (typing.strokes > 0) {
      typing.strokes = 0;
      if (gain > 0) pulse = 1;
    }
    const energy = typing.energy * gain;
    speed += (1 + energy * 6 - speed) * (1 - Math.exp(-dt / 0.15));
    due += dt;
    while (due > 0.14) {
      due -= 0.14;
      if (parts.length < 30) spawn(false);
    }
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = sparkColor;
    ctx.shadowColor = sparkColor;
    ctx.shadowBlur = 6 + energy * 10 + pulse * 6;
    for (let i = parts.length - 1; i >= 0; i -= 1) {
      const p = parts[i];
      p.life += dt;
      if (p.life > p.span) {
        parts.splice(i, 1);
        continue;
      }
      const k = p.life / p.span;
      const twinkle = 0.7 + 0.3 * Math.sin((now / 160) * (1 + energy) + p.phase);
      p.y += p.vy * dt * speed;
      if (p.y < -4) {
        p.y = h + 3;
        p.x = Math.random() * w;
      }
      const edge = Math.min(1, Math.max(0, p.y / 14), Math.max(0, (h - p.y) / 14));
      ctx.globalAlpha = Math.min(1, Math.sin(k * Math.PI) * (0.9 + energy * 0.25) * twinkle) * edge;
      ctx.beginPath();
      ctx.arc(
        p.x + Math.sin((now / 900) * (1 + energy * 0.8) + p.phase) * p.sway,
        p.y,
        p.r * twinkle * (1 + energy * 0.35),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };
  resize();
  for (let i = 0; i < 26; i += 1) spawn(true);
  const ro = new ResizeObserver(() => {
    resizePending = true;
  });
  ro.observe(canvas);
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    ctx.clearRect(0, 0, w, h);
  };
};
const syncSparks = () => {
  stopSparks?.();
  stopSparks = startSparks();
};
watch([maxed, reduce, () => props.sparkColor], syncSparks, { flush: 'post' });

onMounted(() => {
  offGlyph = t.on('change', v => {
    pathRef.value?.setAttribute('d', pathAt(ARROW_UP, SQUARE, v));
    const goo = reduce.value ? 0 : Math.sin(v * Math.PI);
    const sx = 1 - props.squash * goo;
    if (svgRef.value) {
      svgRef.value.style.transform = goo ? `rotate(${dir * props.tilt * goo}deg) scale(${sx}, ${1 / sx})` : '';
    }
  });
  fitInput();
  syncSparks();
});

onBeforeUnmount(() => {
  dictation += 1;
  stopSparks?.();
  stopSparks = null;
  offGlyph?.();
  glyphControls?.stop();
});

const setEffort = (i: number) => {
  const next = Math.max(0, Math.min(effortList.value.length - 1, i));
  if (next === effortIndex.value) return;
  effortIndex.value = next;
  emit('effortChange', effortList.value[next]);
};
const effortFromPointer = (e: PointerEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const k = (e.clientX - rect.left - EDGE) / Math.max(1, rect.width - 2 * EDGE);
  setEffort(Math.round(k * (effortList.value.length - 1)));
};
const onEffortDown = (e: PointerEvent) => {
  if (e.button !== 0) return;
  const el = e.currentTarget as HTMLElement;
  capture(el, e.pointerId);
  el.focus({ preventScroll: true });
  effortFromPointer(e);
};
const onEffortMove = (e: PointerEvent) => {
  if (e.buttons & 1) effortFromPointer(e);
};
const onEffortKey = (e: KeyboardEvent) => {
  const step =
    e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
  if (step) {
    e.preventDefault();
    setEffort(effortIndex.value + step);
  } else if (e.key === 'Home') {
    e.preventDefault();
    setEffort(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    setEffort(effortList.value.length - 1);
  } else if (e.key === 'Escape') {
    effortOpen.value = false;
    focusInput();
  }
};
const stepAt = (i: number) =>
  `calc(${EDGE}px + (100% - ${EDGE * 2}px) * ${i / Math.max(1, effortList.value.length - 1)})`;
const fillAt = (i: number) => (i === effortList.value.length - 1 ? '100%' : `calc(${stepAt(i)} + 7px)`);
const trackStyle = computed(
  () =>
    ({
      '--pb-effort-x': stepAt(effortIndex.value),
      '--pb-effort-fill': fillAt(effortIndex.value)
    }) as CSSProperties
);

const pick = (row: Row) => {
  if (open.value === 'model') {
    modelKey.value = row.key;
    modelOpen.value = false;
    focusInput();
    return;
  }
  const head = token.value ? draft.value.slice(0, token.value.start) : draft.value;
  if (row.attach) {
    draft.value = head;
    Promise.resolve(props.onAttach?.()).then(files => {
      if (!files) return;
      attachments.value = [...attachments.value, ...(Array.isArray(files) ? files : [files])];
    });
  } else if (open.value === 'at') {
    draft.value = `${head}@${row.name} `;
  } else {
    draft.value = `${head}${row.name} `;
  }
  plusOpen.value = false;
  dismissed.value = false;
  focusInput();
};

const send = () => {
  if (!canSend.value || props.busy) return;
  emit('send', draft.value.trim(), { attachments: attachments.value, model: model.value, effort: level.value });
  draft.value = '';
  attachments.value = [];
  dismissed.value = false;
  closeMenus();
  focusInput();
};

const toggleListen = () => {
  if (listening.value) {
    dictation += 1;
    listening.value = false;
    return;
  }
  const seq = ++dictation;
  listening.value = true;
  Promise.resolve(props.onDictate?.()).then(
    text => {
      if (seq !== dictation) return;
      listening.value = false;
      if (text) draft.value = draft.value.trim() ? `${draft.value.trimEnd()} ${text}` : text;
      focusInput();
    },
    () => {
      if (seq === dictation) listening.value = false;
    }
  );
};

const onInput = (e: Event) => {
  draft.value = (e.target as HTMLTextAreaElement).value;
  typing.energy = Math.min(1.6, typing.energy + 0.22);
  typing.strokes = Math.min(4, typing.strokes + 1);
  dismissed.value = false;
  closeMenus();
  active.value = 0;
};

const onKeyDown = (e: KeyboardEvent) => {
  if (open.value && list.value.length) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active.value = (cursor.value + (e.key === 'ArrowDown' ? 1 : list.value.length - 1)) % list.value.length;
      return;
    }
    if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'Tab') {
      e.preventDefault();
      pick(list.value[cursor.value]);
      return;
    }
  }
  if (e.key === 'Escape') {
    if (open.value) {
      e.preventDefault();
      dismissed.value = true;
      closeMenus();
    }
    return;
  }
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    send();
  }
};

const togglePlus = () => {
  modelOpen.value = false;
  effortOpen.value = false;
  active.value = 0;
  plusOpen.value = !plusOpen.value;
  focusInput();
};
const toggleModel = () => {
  plusOpen.value = false;
  effortOpen.value = false;
  active.value = Math.max(0, modelList.value.indexOf(model.value));
  modelOpen.value = !modelOpen.value;
  focusInput();
};
const toggleEffort = () => {
  plusOpen.value = false;
  modelOpen.value = false;
  effortOpen.value = !effortOpen.value;
  focusInput();
};
const onFieldDown = (e: PointerEvent) => {
  if (e.target === e.currentTarget || e.target === inputRef.value) closeMenus();
};
const down = (e: PointerEvent) => {
  if (e.button !== 0 || !armed.value) return;
  pressed.value = true;
};
const up = () => {
  pressed.value = false;
};
const onSendClick = () => {
  if (props.busy) emit('stop');
  else send();
};

const rootStyle = computed(
  () =>
    ({
      '--pb-bg': props.background,
      '--pb-ink': props.color,
      '--pb-menu': props.menuBackground,
      '--pb-w': `${props.width}px`,
      '--pb-radius': `${props.radius}px`,
      '--pb-spark': props.sparkColor,
      '--pb-press': props.pressScale
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="rootRef"
    :class="['prompt-bar', className]"
    :data-busy="busy ? '' : undefined"
    :data-max="maxed ? '' : undefined"
    :style="rootStyle"
  >
    <div
      v-if="open"
      class="prompt-bar__menu"
      :role="open === 'effort' ? 'dialog' : 'listbox'"
      :aria-label="menuLabel"
      :data-kind="open"
    >
      <template v-if="open === 'effort'">
        <div class="prompt-bar__effort-head">
          <span class="prompt-bar__effort-title">Effort</span>
          <span class="prompt-bar__effort-level">{{ level }}</span>
          <span class="prompt-bar__effort-help" title="Higher effort thinks longer before answering">
            <HugeiconsIcon :icon="HelpCircleIcon as IconArray" :size="14" :stroke-width="1.8" />
          </span>
        </div>
        <div class="prompt-bar__effort-ends">
          <span>Faster</span>
          <span>Smarter</span>
        </div>
        <div
          class="prompt-bar__effort-track"
          role="slider"
          tabindex="0"
          aria-label="Effort"
          :aria-valuemin="0"
          :aria-valuemax="effortList.length - 1"
          :aria-valuenow="effortIndex"
          :aria-valuetext="level"
          :style="trackStyle"
          @pointerdown="onEffortDown"
          @pointermove="onEffortMove"
          @keydown="onEffortKey"
        >
          <span class="prompt-bar__effort-fill" />
          <i
            v-for="(label, i) in effortList"
            :key="label"
            class="prompt-bar__effort-dot"
            :style="{ left: stepAt(i) }"
          />
          <span class="prompt-bar__effort-thumb" />
        </div>
      </template>
      <template v-else>
        <span ref="glowRef" class="prompt-bar__glow" aria-hidden="true" />
        <button
          v-for="(row, i) in list"
          :key="row.key"
          :ref="el => (rowRefs[i] = el as HTMLButtonElement | null)"
          type="button"
          role="option"
          :aria-selected="i === cursor"
          class="prompt-bar__row"
          @mousedown.prevent
          @pointerenter="active = i"
          @click="pick(row)"
        >
          <span v-if="open === 'at'" class="prompt-bar__row-icon">
            <template v-if="row.icon">
              <HugeiconsIcon v-if="isIconData(row.icon)" :icon="row.icon" :size="15" :stroke-width="1.8" />
              <component :is="row.icon" v-else />
            </template>
          </span>
          <span class="prompt-bar__row-name">{{ row.name }}</span>
          <span v-if="row.description" class="prompt-bar__row-desc">{{ row.description }}</span>
          <template v-if="open === 'model'">
            <span class="prompt-bar__row-tag">{{ row.tag }}</span>
            <span class="prompt-bar__row-check" :data-on="row.key === model?.key ? '' : undefined">
              <HugeiconsIcon :icon="Tick02Icon as IconArray" :size="13" :stroke-width="2.5" />
            </span>
          </template>
        </button>
        <div v-if="list.length === 0" class="prompt-bar__empty">No matches for “{{ query }}”</div>
      </template>
    </div>

    <div
      class="prompt-bar__field"
      role="presentation"
      :data-max="maxed ? '' : undefined"
      @pointerdown="onFieldDown"
      @click="focusInput"
    >
      <canvas ref="sparkRef" class="prompt-bar__sparks" aria-hidden="true" />
      <div v-if="attachments.length > 0" class="prompt-bar__chips">
        <span v-for="(file, i) in attachments" :key="`${file}-${i}`" class="prompt-bar__chip">
          <HugeiconsIcon :icon="File02Icon as IconArray" :size="12" :stroke-width="2" />
          <span class="prompt-bar__chip-name">{{ file }}</span>
          <button
            type="button"
            class="prompt-bar__chip-x"
            :aria-label="`Remove ${file}`"
            @click="attachments = attachments.filter((_, j) => j !== i)"
          >
            <HugeiconsIcon :icon="Cancel01Icon as IconArray" :size="10" :stroke-width="2.5" />
          </button>
        </span>
      </div>

      <textarea
        ref="inputRef"
        class="prompt-bar__input"
        rows="1"
        :value="draft"
        :placeholder="listening ? 'Listening…' : placeholder"
        aria-label="Prompt"
        @input="onInput"
        @focus="closeMenus"
        @keydown="onKeyDown"
      />

      <div class="prompt-bar__bar">
        <button
          type="button"
          class="prompt-bar__tool"
          aria-label="Add files and sources"
          :aria-expanded="plusOpen"
          :data-on="plusOpen ? '' : undefined"
          @mousedown.prevent
          @click="togglePlus"
        >
          <HugeiconsIcon :icon="PlusSignIcon as IconArray" :size="16" :stroke-width="2" />
        </button>
        <button
          v-if="modelList.length > 0"
          type="button"
          class="prompt-bar__pick"
          aria-label="Choose model"
          :aria-expanded="modelOpen"
          :data-on="modelOpen ? '' : undefined"
          @mousedown.prevent
          @click="toggleModel"
        >
          <span>{{ model.name }}</span>
          <HugeiconsIcon :icon="ArrowDown01Icon as IconArray" :size="12" :stroke-width="2.4" />
        </button>
        <button
          v-if="effortList.length > 0"
          type="button"
          class="prompt-bar__pick"
          aria-label="Choose effort"
          :aria-expanded="effortOpen"
          :data-on="effortOpen ? '' : undefined"
          :data-max="maxed ? '' : undefined"
          @mousedown.prevent
          @click="toggleEffort"
        >
          <HugeiconsIcon :icon="SparklesIcon as IconArray" :size="13" :stroke-width="2" />
          <span>{{ level }}</span>
        </button>
        <span class="prompt-bar__spacer" />
        <button
          v-if="hasDictate"
          type="button"
          class="prompt-bar__tool"
          :aria-label="listening ? 'Stop dictation' : 'Dictate'"
          :aria-pressed="listening"
          :data-on="listening ? '' : undefined"
          @mousedown.prevent
          @click="toggleListen"
        >
          <span v-if="listening" class="prompt-bar__eq" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <HugeiconsIcon v-else :icon="Mic01Icon as IconArray" :size="15" :stroke-width="2" />
        </button>
        <button
          type="button"
          class="prompt-bar__send"
          :disabled="!armed"
          :aria-label="busy ? 'Stop' : 'Send'"
          :data-armed="armed ? '' : undefined"
          :data-pressed="pressed ? '' : undefined"
          @mousedown.prevent
          @pointerdown="down"
          @pointerup="up"
          @pointercancel="up"
          @pointerleave="up"
          @click="onSendClick"
        >
          <svg
            ref="svgRef"
            class="prompt-bar__glyph"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          >
            <path ref="pathRef" :d="glyphStart" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.prompt-bar {
  --pb-bg: #272a27;
  --pb-ink: #f5f5f5;
  --pb-menu: #313531;
  --pb-w: 400px;
  --pb-radius: 16px;
  --pb-press: 0.96;
  --pb-spark: #a0ffbc;
  --pb-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --pb-muted: color-mix(in srgb, var(--pb-ink) 55%, transparent);
  --pb-hover: color-mix(in srgb, var(--pb-ink) 8%, transparent);

  position: relative;
  width: min(var(--pb-w), 100%);
  color: var(--pb-ink);
  font-family: inherit;
  font-size: 14px;
  line-height: 22px;
}

.prompt-bar__menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  left: 0;
  z-index: 2;
  padding: 4px;
  border-radius: 12px;
  background: var(--pb-menu);
  box-shadow:
    0 10px 30px -10px rgba(0, 0, 0, 0.35),
    0 1px 2px rgba(0, 0, 0, 0.08);
  transform-origin: bottom center;
  animation: prompt-bar-pop 180ms var(--pb-ease-out) both;
}

.prompt-bar__menu[data-kind='model'] {
  right: auto;
  width: 200px;
  transform-origin: bottom left;
}

@keyframes prompt-bar-pop {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
}

.prompt-bar__glow {
  position: absolute;
  right: 4px;
  left: 4px;
  border-radius: 8px;
  background: var(--pb-hover);
  opacity: 0;
  pointer-events: none;
  transition:
    top 220ms var(--pb-ease-out),
    height 220ms var(--pb-ease-out),
    opacity 150ms ease;
}

.prompt-bar__row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.prompt-bar__row-icon {
  display: inline-flex;
  flex: none;
  justify-content: center;
  width: 20px;
  color: color-mix(in srgb, var(--pb-ink) 70%, transparent);
}

.prompt-bar__row-name {
  flex: none;
  font-size: 13px;
  font-weight: 500;
}

.prompt-bar__row-desc {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--pb-muted);
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.prompt-bar__row-tag {
  flex: none;
  margin-left: auto;
  color: var(--pb-muted);
  font-size: 11px;
}

.prompt-bar__row-check {
  display: inline-flex;
  flex: none;
  justify-content: center;
  width: 16px;
  opacity: 0;
}

.prompt-bar__row-check[data-on] {
  opacity: 1;
}

.prompt-bar__empty {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 8px;
  color: var(--pb-muted);
  font-size: 12px;
}

.prompt-bar__field {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: var(--pb-radius);
  background: var(--pb-bg);
  cursor: text;
}

.prompt-bar__field::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: radial-gradient(
    140% 120% at 0% 100%,
    color-mix(in srgb, var(--pb-spark) 26%, transparent),
    transparent 62%
  );
  opacity: 0;
  pointer-events: none;
  transition: opacity 500ms ease;
}

.prompt-bar__field[data-max]::before {
  opacity: 1;
}

.prompt-bar__sparks {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
}

.prompt-bar__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.prompt-bar__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 4px 0 8px;
  border-radius: 8px;
  background: var(--pb-hover);
  font-size: 12px;
  animation: prompt-bar-pop 200ms var(--pb-ease-out) both;
}

.prompt-bar__chip-name {
  max-width: 144px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.prompt-bar__chip-x {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  outline: none;
  transition:
    opacity 120ms ease,
    background-color 120ms ease;
}

.prompt-bar__chip-x:hover {
  background: color-mix(in srgb, var(--pb-ink) 10%, transparent);
  opacity: 1;
}

.prompt-bar__input {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  resize: none;
  outline: none;
  overflow-wrap: anywhere;
}

.prompt-bar__input::placeholder {
  color: color-mix(in srgb, var(--pb-ink) 45%, transparent);
}

@media (pointer: coarse) {
  .prompt-bar__input {
    font-size: 16px;
  }
}

.prompt-bar__bar {
  display: flex;
  align-items: center;
  gap: 4px;
}

.prompt-bar__spacer {
  flex: 1 1 auto;
}

.prompt-bar__tool,
.prompt-bar__pick,
.prompt-bar__send {
  flex: none;
  border: 0;
  font: inherit;
  cursor: pointer;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.prompt-bar__tool {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 8px;
  background: transparent;
  color: color-mix(in srgb, var(--pb-ink) 60%, transparent);
  transition:
    background-color 150ms ease,
    color 150ms ease,
    transform 160ms var(--pb-ease-out);
}

.prompt-bar__tool:active {
  transform: scale(0.94);
}

.prompt-bar__pick {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  background: transparent;
  color: color-mix(in srgb, var(--pb-ink) 70%, transparent);
  font-size: 12px;
  font-weight: 500;
  transition:
    background-color 150ms ease,
    color 150ms ease;
}

.prompt-bar__tool[data-on],
.prompt-bar__pick[data-on] {
  background: var(--pb-hover);
  color: var(--pb-ink);
}

@media (hover: hover) and (pointer: fine) {
  .prompt-bar__tool:hover,
  .prompt-bar__pick:hover {
    background: var(--pb-hover);
    color: var(--pb-ink);
  }
}

.prompt-bar__pick[data-max] {
  color: var(--pb-spark);
}

.prompt-bar__menu[data-kind='effort'] {
  right: auto;
  width: 248px;
  padding: 12px 14px 14px;
  transform-origin: bottom left;
}

.prompt-bar__effort-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  line-height: 18px;
}

.prompt-bar__effort-title {
  color: var(--pb-muted);
}

.prompt-bar__effort-level {
  font-weight: 500;
}

.prompt-bar__effort-help {
  display: inline-flex;
  margin-left: auto;
  color: var(--pb-muted);
}

.prompt-bar__effort-ends {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: var(--pb-muted);
  font-size: 12px;
  line-height: 16px;
}

.prompt-bar__effort-track {
  position: relative;
  height: 22px;
  margin-top: 8px;
  border-radius: 11px;
  background: var(--pb-hover);
  cursor: pointer;
  outline: none;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.prompt-bar__effort-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--pb-effort-fill);
  border-radius: 11px;
  background: color-mix(in srgb, var(--pb-ink) 18%, transparent);
  transition:
    width 220ms var(--pb-ease-out),
    background-color 300ms ease;
}

.prompt-bar__effort-dot {
  position: absolute;
  top: 50%;
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--pb-ink) 30%, transparent);
}

.prompt-bar__effort-thumb {
  position: absolute;
  top: -3px;
  left: var(--pb-effort-x);
  width: 14px;
  height: 28px;
  margin-left: -7px;
  border-radius: 7px;
  background: var(--pb-ink);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition:
    left 220ms var(--pb-ease-out),
    background-color 300ms ease;
}

.prompt-bar[data-max] .prompt-bar__effort-fill {
  background: color-mix(in srgb, var(--pb-spark) 35%, transparent);
}

.prompt-bar[data-max] .prompt-bar__effort-thumb {
  background: var(--pb-spark);
}

.prompt-bar__eq {
  display: flex;
  align-items: center;
  gap: 2.5px;
  height: 14px;
}

.prompt-bar__eq i {
  display: block;
  width: 2.5px;
  height: 100%;
  border-radius: 999px;
  background: currentColor;
  transform-origin: center;
  animation: prompt-bar-eq 900ms ease-in-out infinite;
}

.prompt-bar__eq i:nth-child(2) {
  animation-delay: 150ms;
}

.prompt-bar__eq i:nth-child(3) {
  animation-delay: 300ms;
}

@keyframes prompt-bar-eq {
  0%,
  100% {
    transform: scaleY(0.35);
  }

  50% {
    transform: scaleY(1);
  }
}

.prompt-bar__send {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 8px;
  background: color-mix(in srgb, var(--pb-ink) 12%, var(--pb-bg));
  color: color-mix(in srgb, var(--pb-ink) 55%, var(--pb-bg));
  transition:
    background-color 200ms ease,
    color 200ms ease,
    transform 160ms var(--pb-ease-out);
}

.prompt-bar__send:disabled {
  cursor: default;
}

.prompt-bar__send[data-armed] {
  background: var(--pb-ink);
  color: var(--pb-bg);
}

.prompt-bar__send[data-pressed] {
  transform: scale(var(--pb-press));
}

.prompt-bar__glyph {
  display: block;
  width: 16px;
  height: 16px;
  transform-origin: 50% 50%;
}

@media (prefers-reduced-motion: reduce) {
  .prompt-bar__menu,
  .prompt-bar__chip {
    animation: none;
  }

  .prompt-bar__glow {
    transition: opacity 150ms ease;
  }

  .prompt-bar__effort-fill,
  .prompt-bar__effort-thumb {
    transition: background-color 300ms ease;
  }

  .prompt-bar__tool:active,
  .prompt-bar__send[data-pressed] {
    transform: none;
  }
}
</style>
