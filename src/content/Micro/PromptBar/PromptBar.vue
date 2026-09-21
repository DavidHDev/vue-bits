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
import { computed, onMounted, onUnmounted, ref, watch, type Component, type CSSProperties } from 'vue';

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

type AttachResult = string | string[] | void | Promise<string | string[] | void>;
type DictateResult = string | void | Promise<string | void>;

interface PromptBarProps {
  placeholder?: string;
  sources?: PromptBarSource[];
  commands?: PromptBarCommand[];
  models?: PromptBarModel[];
  defaultModel?: string;
  efforts?: string[];
  defaultEffort?: string;
  busy?: boolean;
  onAttach?: () => AttachResult;
  onDictate?: () => DictateResult;
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

const MUTED = '[color:color-mix(in_srgb,var(--pb-ink)_55%,transparent)]';
const TOOL_BTN =
  'inline-flex h-7 flex-none cursor-pointer touch-manipulation items-center gap-1 rounded-lg border-0 bg-transparent px-2 text-[12px] font-medium outline-none select-none [color:color-mix(in_srgb,var(--pb-ink)_70%,transparent)] [font:inherit] [-webkit-tap-highlight-color:transparent] [transition:background-color_150ms_ease,color_150ms_ease] data-[on]:[background:color-mix(in_srgb,var(--pb-ink)_8%,transparent)] data-[on]:[color:var(--pb-ink)] [@media(hover:hover)_and_(pointer:fine)]:hover:[background:color-mix(in_srgb,var(--pb-ink)_8%,transparent)] [@media(hover:hover)_and_(pointer:fine)]:hover:[color:var(--pb-ink)] data-[max]:[color:var(--pb-spark)]!';
const ICON_BTN =
  'inline-grid h-7 w-7 flex-none cursor-pointer touch-manipulation place-items-center rounded-lg border-0 bg-transparent p-0 outline-none select-none [color:color-mix(in_srgb,var(--pb-ink)_60%,transparent)] [font:inherit] [-webkit-tap-highlight-color:transparent] [transition:background-color_150ms_ease,color_150ms_ease,transform_160ms_cubic-bezier(0.23,1,0.32,1)] active:[transform:scale(0.94)] data-[on]:[background:color-mix(in_srgb,var(--pb-ink)_8%,transparent)] data-[on]:[color:var(--pb-ink)] motion-reduce:active:[transform:none] [@media(hover:hover)_and_(pointer:fine)]:hover:[background:color-mix(in_srgb,var(--pb-ink)_8%,transparent)] [@media(hover:hover)_and_(pointer:fine)]:hover:[color:var(--pb-ink)]';

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const pathAt = (a: number[], b: number[], t: number) => {
  let d = '';
  for (let i = 0; i < a.length; i += 2) {
    d += `${i ? 'L' : 'M'}${mix(a[i], b[i], t).toFixed(2)} ${mix(a[i + 1], b[i + 1], t).toFixed(2)}`;
  }
  return `${d}Z`;
};

const parseToken = (text: string): Token | null => {
  const m = /(^|\s)([@/])([\w-]*)$/.exec(text);
  if (!m) return null;
  return { kind: m[2] === '@' ? 'at' : 'slash', query: m[3].toLowerCase(), start: m.index + m[1].length };
};

const isIconData = (icon: IconArray | Component): icon is IconArray => Array.isArray(icon);

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
  background: '#27272a',
  color: '#f5f5f5',
  menuBackground: '#323236',
  sparkColor: '#9dffa4',
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
const sendSvg = ref<SVGSVGElement | null>(null);
const sendPath = ref<SVGPathElement | null>(null);
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
watch(open, o => {
  if (!o) lastOpen = null;
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

// the send glyph morphs arrow to square through a motion value written straight to the svg
const sendT = motionValue(props.busy ? 1 : 0);
let sendDir = props.busy ? 1 : -1;
let sendControls: AnimationPlaybackControls | null = null;
const sendStart = pathAt(ARROW_UP, SQUARE, sendT.get());
let offSend: (() => void) | undefined;

const syncSend = () => {
  const target = props.busy ? 1 : 0;
  sendDir = props.busy ? 1 : -1;
  if (sendT.get() === target) return;
  sendControls?.stop();
  sendControls = animate(
    sendT,
    target,
    reduce.value ? { duration: 0 } : { duration: props.morphDuration / 1000, ease: EASE_IN_OUT }
  );
};
watch([() => props.busy, () => props.morphDuration, reduce], syncSend);

let stopSpark: (() => void) | null = null;
const startSpark = () => {
  const canvas = sparkRef.value;
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  typing.strokes = 0;
  let raf = 0;
  let last = performance.now();
  let w = 0;
  let h = 0;
  let due = 0;
  let speed = 1;
  let pulse = 0;
  const parts: Spark[] = [];
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
    ctx.fillStyle = props.sparkColor;
    ctx.shadowColor = props.sparkColor;
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
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    ctx.clearRect(0, 0, w, h);
  };
};
const syncSpark = () => {
  stopSpark?.();
  stopSpark = null;
  if (!maxed.value || reduce.value) return;
  stopSpark = startSpark();
};
watch([maxed, reduce, () => props.sparkColor], syncSpark, { flush: 'post' });

onMounted(() => {
  offSend = sendT.on('change', v => {
    sendPath.value?.setAttribute('d', pathAt(ARROW_UP, SQUARE, v));
    const goo = reduce.value ? 0 : Math.sin(v * Math.PI);
    const sx = 1 - props.squash * goo;
    if (sendSvg.value) {
      sendSvg.value.style.transform = goo ? `rotate(${sendDir * props.tilt * goo}deg) scale(${sx}, ${1 / sx})` : '';
    }
  });
  fitInput();
  syncSpark();
});
onUnmounted(() => {
  dictation += 1;
  stopSpark?.();
  offSend?.();
  sendControls?.stop();
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
  try {
    el.setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
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
const effortStyle = computed(
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
  if ((row as PromptBarSource).attach) {
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
  emit('send', draft.value.trim(), {
    attachments: attachments.value,
    model: model.value,
    effort: level.value
  });
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

const toggleSources = () => {
  modelOpen.value = false;
  effortOpen.value = false;
  active.value = 0;
  plusOpen.value = !plusOpen.value;
  focusInput();
};
const toggleModels = () => {
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
const onSendClick = () => {
  if (props.busy) emit('stop');
  else send();
};
const onBoxDown = (e: PointerEvent) => {
  if (e.target === e.currentTarget || e.target === inputRef.value) closeMenus();
};
const down = (e: PointerEvent) => {
  if (e.button !== 0 || !armed.value) return;
  pressed.value = true;
};
const up = () => (pressed.value = false);

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
    class="group relative [color:var(--pb-ink)] [width:min(var(--pb-w),100%)] text-[14px] leading-[22px]"
    :class="className"
    :data-busy="busy ? '' : undefined"
    :data-max="maxed ? '' : undefined"
    :style="rootStyle"
  >
    <div
      v-if="open"
      class="data-[kind=effort]:right-auto data-[kind=model]:right-auto bottom-[calc(100%+8px)] z-[2] absolute inset-x-0 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.08)] p-1 data-[kind=effort]:px-3.5 data-[kind=effort]:pt-3 [background:var(--pb-menu)] data-[kind=effort]:pb-3.5 rounded-xl data-[kind=effort]:w-[248px] data-[kind=model]:w-[200px] origin-bottom data-[kind=effort]:origin-bottom-left data-[kind=model]:origin-bottom-left [animation:prompt-bar-pop_180ms_cubic-bezier(0.23,1,0.32,1)_both] motion-reduce:[animation:none]"
      :role="open === 'effort' ? 'dialog' : 'listbox'"
      :aria-label="menuLabel"
      :data-kind="open"
    >
      <template v-if="open === 'effort'">
        <div class="flex items-center gap-2 text-[13px] leading-[18px]">
          <span :class="MUTED">Effort</span>
          <span class="font-medium">{{ level }}</span>
          <span class="inline-flex ml-auto" :class="MUTED" title="Higher effort thinks longer before answering">
            <HugeiconsIcon :icon="HelpCircleIcon as IconArray" :size="14" :stroke-width="1.8" />
          </span>
        </div>
        <div class="flex justify-between mt-3 text-[12px] leading-4" :class="MUTED">
          <span>Faster</span>
          <span>Smarter</span>
        </div>
        <div
          class="relative mt-2 [background:color-mix(in_srgb,var(--pb-ink)_8%,transparent)] rounded-[11px] outline-none h-[22px] touch-none cursor-pointer select-none"
          role="slider"
          tabindex="0"
          aria-label="Effort"
          :aria-valuemin="0"
          :aria-valuemax="effortList.length - 1"
          :aria-valuenow="effortIndex"
          :aria-valuetext="level"
          :style="effortStyle"
          @pointerdown="onEffortDown"
          @pointermove="onEffortMove"
          @keydown="onEffortKey"
        >
          <span
            class="left-0 absolute inset-y-0 [background:color-mix(in_srgb,var(--pb-ink)_18%,transparent)] [width:var(--pb-effort-fill)] group-data-[max]:[background:color-mix(in_srgb,var(--pb-spark)_35%,transparent)] rounded-[11px] motion-reduce:[transition:background-color_300ms_ease] [transition:width_220ms_cubic-bezier(0.23,1,0.32,1),background-color_300ms_ease]"
          />
          <i
            v-for="(name, i) in effortList"
            :key="name"
            class="top-1/2 absolute -mt-0.5 -ml-0.5 [background:color-mix(in_srgb,var(--pb-ink)_30%,transparent)] rounded-full w-1 h-1"
            :style="{ left: stepAt(i) }"
          />
          <span
            class="-top-[3px] absolute shadow-[0_2px_6px_rgba(0,0,0,0.25)] -ml-[7px] [background:var(--pb-ink)] [left:var(--pb-effort-x)] group-data-[max]:[background:var(--pb-spark)] rounded-[7px] w-3.5 h-7 motion-reduce:[transition:background-color_300ms_ease] [transition:left_220ms_cubic-bezier(0.23,1,0.32,1),background-color_300ms_ease]"
          />
        </div>
      </template>
      <template v-else>
        <span
          ref="glowRef"
          class="absolute inset-x-1 opacity-0 [background:color-mix(in_srgb,var(--pb-ink)_8%,transparent)] rounded-lg pointer-events-none motion-reduce:[transition:opacity_150ms_ease] [transition:top_220ms_cubic-bezier(0.23,1,0.32,1),height_220ms_cubic-bezier(0.23,1,0.32,1),opacity_150ms_ease]"
          aria-hidden="true"
        />
        <button
          v-for="(row, i) in list"
          :key="row.key"
          :ref="el => (rowRefs[i] = el as HTMLButtonElement | null)"
          type="button"
          role="option"
          :aria-selected="i === cursor"
          class="z-[1] relative flex items-center gap-2.5 bg-transparent px-2 border-0 rounded-lg outline-none w-full h-9 text-inherit text-left cursor-pointer [font:inherit] [-webkit-tap-highlight-color:transparent]"
          @mousedown.prevent
          @pointerenter="active = i"
          @click="pick(row)"
        >
          <span
            v-if="open === 'at' && row.icon"
            class="inline-flex flex-none justify-center [color:color-mix(in_srgb,var(--pb-ink)_70%,transparent)] w-5"
          >
            <HugeiconsIcon v-if="isIconData(row.icon)" :icon="row.icon" :size="15" :stroke-width="1.8" />
            <component :is="row.icon" v-else />
          </span>
          <span class="flex-none font-medium text-[13px]">{{ row.name }}</span>
          <span v-if="row.description" class="flex-auto min-w-0 text-[12px] truncate" :class="MUTED">
            {{ row.description }}
          </span>
          <template v-if="open === 'model'">
            <span class="flex-none ml-auto text-[11px]" :class="MUTED">{{ row.tag }}</span>
            <span
              class="inline-flex flex-none justify-center opacity-0 data-[on]:opacity-100 w-4"
              :data-on="row.key === model?.key ? '' : undefined"
            >
              <HugeiconsIcon :icon="Tick02Icon as IconArray" :size="13" :stroke-width="2.5" />
            </span>
          </template>
        </button>
        <div v-if="list.length === 0" class="flex items-center px-2 h-9 text-[12px]" :class="MUTED">
          No matches for “{{ query }}”
        </div>
      </template>
    </div>

    <div
      class="before:-z-10 isolate before:absolute relative before:inset-0 flex flex-col gap-2 data-[max]:before:opacity-100 before:opacity-0 p-3 [background:var(--pb-bg)] [border-radius:var(--pb-radius)] before:[background:radial-gradient(140%_120%_at_0%_100%,color-mix(in_srgb,var(--pb-spark)_26%,transparent),transparent_62%)] before:rounded-[inherit] before:content-[''] cursor-text before:pointer-events-none before:[transition:opacity_500ms_ease]"
      role="presentation"
      :data-max="maxed ? '' : undefined"
      @pointerdown="onBoxDown"
      @click="focusInput"
    >
      <canvas
        ref="sparkRef"
        class="-z-10 absolute inset-0 rounded-[inherit] w-full h-full pointer-events-none"
        aria-hidden="true"
      />
      <div v-if="attachments.length > 0" class="flex flex-wrap gap-1.5">
        <span
          v-for="(file, i) in attachments"
          :key="`${file}-${i}`"
          class="inline-flex items-center gap-1.5 pr-1 [background:color-mix(in_srgb,var(--pb-ink)_8%,transparent)] pl-2 rounded-lg h-[26px] text-[12px] motion-reduce:[animation:none] [animation:prompt-bar-pop_200ms_cubic-bezier(0.23,1,0.32,1)_both]"
        >
          <HugeiconsIcon :icon="File02Icon as IconArray" :size="12" :stroke-width="2" />
          <span class="max-w-[144px] truncate">{{ file }}</span>
          <button
            type="button"
            class="inline-grid place-items-center bg-transparent opacity-60 hover:opacity-100 p-0 hover:[background:color-mix(in_srgb,var(--pb-ink)_10%,transparent)] border-0 rounded-[5px] outline-none w-[18px] h-[18px] text-inherit cursor-pointer [transition:opacity_120ms_ease,background-color_120ms_ease]"
            :aria-label="`Remove ${file}`"
            @click="attachments = attachments.filter((_, j) => j !== i)"
          >
            <HugeiconsIcon :icon="Cancel01Icon as IconArray" :size="10" :stroke-width="2.5" />
          </button>
        </span>
      </div>

      <textarea
        ref="inputRef"
        class="block bg-transparent p-0 placeholder:[color:color-mix(in_srgb,var(--pb-ink)_45%,transparent)] border-0 outline-none w-full text-[14px] text-inherit [@media(pointer:coarse)]:text-[16px] leading-[22px] resize-none [font:inherit] [overflow-wrap:anywhere]"
        rows="1"
        :value="draft"
        :placeholder="listening ? 'Listening…' : placeholder"
        aria-label="Prompt"
        @input="onInput"
        @focus="closeMenus"
        @keydown="onKeyDown"
      />

      <div class="flex items-center gap-1">
        <button
          type="button"
          :class="ICON_BTN"
          aria-label="Add files and sources"
          :aria-expanded="plusOpen"
          :data-on="plusOpen ? '' : undefined"
          @mousedown.prevent
          @click="toggleSources"
        >
          <HugeiconsIcon :icon="PlusSignIcon as IconArray" :size="16" :stroke-width="2" />
        </button>
        <button
          v-if="modelList.length > 0"
          type="button"
          :class="TOOL_BTN"
          aria-label="Choose model"
          :aria-expanded="modelOpen"
          :data-on="modelOpen ? '' : undefined"
          @mousedown.prevent
          @click="toggleModels"
        >
          <span>{{ model.name }}</span>
          <HugeiconsIcon :icon="ArrowDown01Icon as IconArray" :size="12" :stroke-width="2.4" />
        </button>
        <button
          v-if="effortList.length > 0"
          type="button"
          :class="TOOL_BTN"
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
        <span class="flex-auto" />
        <button
          v-if="hasDictate"
          type="button"
          :class="ICON_BTN"
          :aria-label="listening ? 'Stop dictation' : 'Dictate'"
          :aria-pressed="listening"
          :data-on="listening ? '' : undefined"
          @mousedown.prevent
          @click="toggleListen"
        >
          <span
            v-if="listening"
            class="[&>i]:block flex items-center gap-[2.5px] [&>i]:bg-current [&>i]:rounded-full [&>i]:w-[2.5px] h-3.5 [&>i]:h-full [&>i]:origin-center [&>i]:[animation:prompt-bar-eq_900ms_ease-in-out_infinite] [&>i:nth-child(2)]:[animation-delay:150ms] [&>i:nth-child(3)]:[animation-delay:300ms]"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
          </span>
          <HugeiconsIcon v-else :icon="Mic01Icon as IconArray" :size="15" :stroke-width="2" />
        </button>
        <button
          type="button"
          class="inline-grid relative flex-none place-items-center p-0 [background:color-mix(in_srgb,var(--pb-ink)_12%,var(--pb-bg))] [color:color-mix(in_srgb,var(--pb-ink)_55%,var(--pb-bg))] data-[armed]:[background:var(--pb-ink)] data-[armed]:[color:var(--pb-bg)] data-[pressed]:[transform:scale(var(--pb-press))] border-0 rounded-lg outline-none w-7 h-7 touch-manipulation cursor-pointer disabled:cursor-default select-none motion-reduce:data-[pressed]:[transform:none] [font:inherit] [-webkit-tap-highlight-color:transparent] [transition:background-color_200ms_ease,color_200ms_ease,transform_160ms_cubic-bezier(0.23,1,0.32,1)]"
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
            ref="sendSvg"
            class="block w-4 h-4 origin-center"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          >
            <path ref="sendPath" :d="sendStart" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes prompt-bar-pop {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
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
</style>
