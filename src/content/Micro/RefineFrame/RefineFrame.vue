<script setup lang="ts">
import { Alert02Icon, Loading03Icon, RefreshIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, getCurrentInstance, onMounted, onUnmounted, onUpdated, ref, watch, type CSSProperties } from 'vue';

export type RefineFrameStatus = 'queued' | 'generating' | 'refining' | 'complete' | 'error';

interface RefineFrameProps {
  status?: RefineFrameStatus;
  aspectRatio?: string;
  width?: number;
  radius?: number;
  background?: string;
  color?: string;
  stageDuration?: number;
  sweep?: boolean;
  showStatus?: boolean;
  hideAfter?: number;
  labels?: Partial<Record<RefineFrameStatus, string>>;
  retryLabel?: string;
  className?: string;
}

type Stage = { blur: number; sat: number; scale: number; opacity: number };
interface Sim {
  p: number;
  raf: number;
  last: number;
  key: string;
  w: number;
  h: number;
  levels: HTMLCanvasElement[];
  glint: CanvasGradient | null;
  sent: boolean;
}

const STAGES: Record<RefineFrameStatus, Stage> = {
  queued: { blur: 4, sat: 0.6, scale: 1.04, opacity: 0.55 },
  generating: { blur: 1.5, sat: 0.8, scale: 1.02, opacity: 0.85 },
  refining: { blur: 0.5, sat: 0.95, scale: 1.005, opacity: 1 },
  complete: { blur: 0, sat: 1, scale: 1, opacity: 1 },
  error: { blur: 2, sat: 0.5, scale: 1, opacity: 0.28 }
};
const TARGET: Partial<Record<RefineFrameStatus, number>> = { queued: 0, generating: 0.5, refining: 0.875, complete: 1 };
const LEVELS = [48, 32, 20, 12, 8, 5, 3, 2, 1];
const EDGE = 28;
const STRIPS = 14;
const DEFAULT_LABELS: Record<RefineFrameStatus, string> = {
  queued: 'Queued',
  generating: 'Generating',
  refining: 'Refining',
  complete: 'Ready',
  error: 'Failed'
};
const ACTIVE = new Set<string>(['queued', 'generating', 'refining']);

const build = (s: Sim, canvas: HTMLCanvasElement, img: HTMLImageElement, dpr: number) => {
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(1, Math.round(rect.width * dpr));
  const H = Math.max(1, Math.round(rect.height * dpr));
  const key = `${img.currentSrc}|${W}x${H}`;
  if (s.key === key) return;
  s.key = key;
  s.w = W;
  s.h = H;
  canvas.width = W;
  canvas.height = H;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const cover = Math.max(W / iw, H / ih);
  const sw = W / cover;
  const sh = H / cover;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  const glint = canvas.getContext('2d')?.createLinearGradient(0, 0, W, 0) ?? null;
  if (glint) {
    for (const [at, a] of [
      [0, 0],
      [0.08, 0.1],
      [0.2, 0.7],
      [0.32, 1],
      [0.68, 1],
      [0.8, 0.7],
      [0.92, 0.1],
      [1, 0]
    ]) {
      glint.addColorStop(at, `rgba(255, 255, 255, ${a})`);
    }
  }
  s.glint = glint;
  s.levels = LEVELS.map(block => {
    const b = block === 1 ? 1 : Math.max(2, Math.round(block * dpr));
    const full = document.createElement('canvas');
    full.width = W;
    full.height = H;
    const fc = full.getContext('2d');
    if (!fc) return full;
    if (b === 1) {
      fc.imageSmoothingEnabled = true;
      fc.imageSmoothingQuality = 'high';
      fc.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
      return full;
    }
    const small = document.createElement('canvas');
    small.width = Math.max(1, Math.round(W / b));
    small.height = Math.max(1, Math.round(H / b));
    const sc = small.getContext('2d');
    if (sc) {
      sc.imageSmoothingEnabled = true;
      sc.imageSmoothingQuality = 'high';
      sc.drawImage(img, sx, sy, sw, sh, 0, 0, small.width, small.height);
    }
    fc.imageSmoothingEnabled = false;
    fc.drawImage(small, 0, 0, W, H);
    return full;
  });
};

const props = withDefaults(defineProps<RefineFrameProps>(), {
  status: 'generating',
  aspectRatio: '4 / 3',
  width: 320,
  radius: 16,
  background: '#27272a',
  color: '#f5f5f5',
  stageDuration: 400,
  sweep: true,
  showStatus: true,
  hideAfter: 1200,
  labels: undefined,
  retryLabel: 'Retry',
  className: ''
});

const emit = defineEmits<{ retry: [] }>();

// the retry pill only shows when the parent is listening for it
const instance = getCurrentInstance();
const hasRetry = () => !!instance?.vnode.props?.onRetry;

const stage = computed(() => STAGES[props.status] ?? STAGES.generating);
const active = computed(() => ACTIVE.has(props.status));
const text = computed(() => ({ ...DEFAULT_LABELS, ...props.labels }));

const printRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const sim: Sim = { p: 0, raf: 0, last: 0, key: '', w: 0, h: 0, levels: [], glint: null, sent: false };
let reduce = false;
const mosaic = ref(false);
const resolved = ref(false);

const chip = ref(props.showStatus);
let chipTimer: ReturnType<typeof setTimeout> | undefined;
const syncChip = () => {
  clearTimeout(chipTimer);
  if (!props.showStatus) {
    chip.value = false;
    return;
  }
  chip.value = true;
  if (props.status === 'complete' && props.hideAfter > 0) {
    chipTimer = setTimeout(() => (chip.value = false), props.hideAfter);
  }
};
watch(() => [props.status, props.showStatus, props.hideAfter], syncChip);

const tick = (now: number) => {
  const s = sim;
  const canvas = canvasRef.value;
  const img = printRef.value?.querySelector('img') as HTMLImageElement | null;
  if (!canvas || !img || !img.naturalWidth) {
    s.raf = 0;
    return;
  }
  const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0.016);
  s.last = now;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  build(s, canvas, img, dpr);
  const n = s.levels.length - 1;
  const target = TARGET[props.status] ?? s.p;
  const rate = reduce ? 1e9 : 1 / (n * (props.stageDuration / 1000));
  const step = rate * dt;
  if (target < s.p) s.p = target;
  else if (target - s.p <= step) s.p = target;
  else s.p += step;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const L = s.p * n;
    const i = Math.min(n, Math.floor(L + 1e-6));
    const frac = L - i;
    ctx.globalAlpha = 1;
    ctx.drawImage(s.levels[i], 0, 0);
    if (i < n && frac > 0) {
      const edge = EDGE * dpr;
      const front = frac * (s.h + edge) - edge / 2;
      const top = Math.max(0, Math.floor(front - edge / 2));
      if (top > 0) ctx.drawImage(s.levels[i + 1], 0, 0, s.w, top, 0, 0, s.w, top);
      const sh = edge / STRIPS;
      for (let k = 0; k < STRIPS; k += 1) {
        const y = front - edge / 2 + k * sh;
        if (y + sh <= 0 || y >= s.h) continue;
        const t = 1 - (k + 0.5) / STRIPS;
        ctx.globalAlpha = t * t * (3 - 2 * t);
        const y0 = Math.max(0, y);
        const h0 = Math.min(s.h, y + sh) - y0;
        if (h0 > 0) ctx.drawImage(s.levels[i + 1], 0, y0, s.w, h0, 0, y0, s.w, h0);
      }
      ctx.globalAlpha = 1;
      if (props.sweep && !reduce && s.glint && front > 0 && front < s.h) {
        ctx.fillStyle = s.glint;
        ctx.globalAlpha = 0.12;
        ctx.fillRect(0, front - 2 * dpr, s.w, 4 * dpr);
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, front - dpr, s.w, 2 * dpr);
        ctx.globalAlpha = 1;
      }
    }
  }
  const done = s.p >= 1;
  if (done !== s.sent) {
    s.sent = done;
    resolved.value = done;
  }
  const keep = (!reduce && ACTIVE.has(props.status)) || Math.abs(target - s.p) > 0.0005;
  s.raf = keep ? requestAnimationFrame(tick) : 0;
  if (!keep) s.last = 0;
};
const wake = () => {
  if (!sim.raf) sim.raf = requestAnimationFrame(tick);
};

let unbindImage: (() => void) | null = null;
const bindImage = () => {
  unbindImage?.();
  unbindImage = null;
  const img = printRef.value?.querySelector('img') as HTMLImageElement | null;
  if (!img) {
    mosaic.value = false;
    return;
  }
  let gone = false;
  const start = () => {
    if (gone) return;
    mosaic.value = true;
    wake();
  };
  if (img.complete && img.naturalWidth) start();
  else img.addEventListener('load', start, { once: true });
  unbindImage = () => {
    gone = true;
    img.removeEventListener('load', start);
  };
};

let mq: MediaQueryList | null = null;
const syncReduce = () => {
  reduce = !!mq?.matches;
};
onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncReduce();
  mq.addEventListener('change', syncReduce);
  syncChip();
  bindImage();
  wake();
});
// slotted media can be swapped by the parent, so look for the image again after each update
onUpdated(bindImage);
watch(() => props.status, bindImage, { flush: 'post' });
watch(() => [props.status, props.width, props.aspectRatio], wake, { flush: 'post' });
onUnmounted(() => {
  cancelAnimationFrame(sim.raf);
  clearTimeout(chipTimer);
  unbindImage?.();
  mq?.removeEventListener('change', syncReduce);
});

const rootStyle = computed(
  () =>
    ({
      '--rf-w': `${props.width}px`,
      '--rf-aspect': props.aspectRatio,
      '--rf-radius': `${props.radius}px`,
      '--rf-bg': props.background,
      '--rf-ink': props.color,
      '--rf-stage': `${props.stageDuration}ms`,
      '--rf-blur': `${mosaic.value ? 0 : stage.value.blur}px`,
      '--rf-sat': stage.value.sat,
      '--rf-scale': mosaic.value ? 1 : stage.value.scale,
      '--rf-opacity': stage.value.opacity
    }) as CSSProperties
);
</script>

<template>
  <div
    class="group isolate relative overflow-hidden font-medium text-[12px] leading-none [width:min(var(--rf-w),100%)] [aspect-ratio:var(--rf-aspect)] [border-radius:var(--rf-radius)] [background:var(--rf-bg)] [color:var(--rf-ink)] [font-family:inherit]"
    :class="className"
    role="img"
    :aria-label="text[status] ?? status"
    :aria-busy="active || undefined"
    :data-status="status"
    :data-active="active ? '' : undefined"
    :data-sweep="sweep && active ? '' : undefined"
    :data-mosaic="mosaic ? '' : undefined"
    :data-resolved="mosaic && resolved ? '' : undefined"
    :style="rootStyle"
  >
    <div
      class="absolute inset-0 group-data-[status=queued]:[animation:refine-frame-wait_2.4s_ease-in-out_infinite] motion-reduce:[animation:none]! [opacity:var(--rf-opacity)] [filter:blur(var(--rf-blur))_saturate(var(--rf-sat))] [transform:scale(var(--rf-scale))] [transition:opacity_var(--rf-stage)_cubic-bezier(0.23,1,0.32,1),filter_var(--rf-stage)_cubic-bezier(0.23,1,0.32,1),transform_var(--rf-stage)_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[transition:opacity_var(--rf-stage)_ease]"
      aria-hidden="true"
    >
      <div
        ref="printRef"
        class="[&>*]:block group-data-[mosaic]:opacity-0 group-data-[resolved]:opacity-100! w-full [&>*]:w-full h-full [&>*]:h-full [&>*]:object-cover [transition:opacity_var(--rf-stage)_ease]"
      >
        <slot />
      </div>
      <canvas
        ref="canvasRef"
        class="absolute inset-0 opacity-0 group-data-[mosaic]:opacity-100 group-data-[resolved]:opacity-0! w-full h-full pointer-events-none [transition:opacity_var(--rf-stage)_ease]"
      />
    </div>
    <div
      class="absolute inset-0 opacity-0 motion-reduce:group-data-[sweep]:opacity-0! group-data-[mosaic]:opacity-0! group-data-[sweep]:opacity-100 pointer-events-none group-data-[mosaic]:[animation:none]! group-data-[sweep]:[animation:refine-frame-sweep_2.2s_linear_infinite] motion-reduce:group-data-[sweep]:[animation:none] [background:linear-gradient(115deg,transparent_38%,color-mix(in_srgb,var(--rf-ink)_14%,transparent)_50%,transparent_62%)] [background-size:260%_100%] [transition:opacity_var(--rf-stage)_ease]"
      aria-hidden="true"
    />
    <div
      v-if="chip"
      class="inline-flex bottom-2.5 left-2.5 absolute items-center gap-1.5 opacity-100 starting:opacity-0 backdrop-blur-[8px] pr-2.5 pl-2 rounded-[13px] h-[26px] pointer-events-none [transform:translateY(0)] starting:[transform:translateY(4px)] motion-reduce:[transition:opacity_200ms_ease] [background:color-mix(in_srgb,var(--rf-bg)_72%,transparent)] [transition:opacity_200ms_ease,transform_200ms_cubic-bezier(0.23,1,0.32,1)]"
      aria-hidden="true"
    >
      <span
        class="inline-flex data-[kind=error]:text-[#ef4444] motion-reduce:data-[kind=spin]:[animation:none] [color:color-mix(in_srgb,var(--rf-ink)_80%,transparent)] data-[kind=spin]:[animation:refine-frame-spin_1.1s_linear_infinite]"
        :data-kind="active ? 'spin' : status"
      >
        <HugeiconsIcon v-if="status === 'complete'" :icon="Tick02Icon as IconArray" :size="13" :stroke-width="2.5" />
        <HugeiconsIcon v-else-if="status === 'error'" :icon="Alert02Icon as IconArray" :size="13" :stroke-width="2.2" />
        <HugeiconsIcon v-else :icon="Loading03Icon as IconArray" :size="13" :stroke-width="2.2" />
      </span>
      <span :key="status" class="[animation:refine-frame-label_200ms_ease_both]">
        {{ text[status] ?? status }}
      </span>
    </div>
    <button
      v-if="status === 'error' && hasRetry()"
      type="button"
      class="inline-flex top-1/2 left-1/2 absolute items-center gap-1.5 opacity-100 starting:opacity-0 pr-3.5 pl-3 border-0 rounded-2xl outline-none h-8 font-medium text-[13px] cursor-pointer [transform:translate(-50%,-50%)] starting:[transform:translate(-50%,-50%)_scale(0.96)] active:[transform:translate(-50%,-50%)_scale(0.96)] motion-reduce:active:[transform:translate(-50%,-50%)] motion-reduce:[transition:opacity_200ms_ease] [background:color-mix(in_srgb,var(--rf-ink)_14%,var(--rf-bg))] [color:var(--rf-ink)] [font-family:inherit] [-webkit-tap-highlight-color:transparent] [transition:opacity_200ms_ease,transform_160ms_cubic-bezier(0.23,1,0.32,1),background-color_150ms_ease] [@media(hover:hover)_and_(pointer:fine)]:hover:[background:color-mix(in_srgb,var(--rf-ink)_20%,var(--rf-bg))]"
      @click="emit('retry')"
    >
      <HugeiconsIcon :icon="RefreshIcon as IconArray" :size="14" :stroke-width="2.2" />
      <span>{{ retryLabel }}</span>
    </button>
    <span class="sr-only" role="status">{{ text[status] ?? status }}</span>
  </div>
</template>

<style>
@keyframes refine-frame-sweep {
  from {
    background-position: 130% 0;
  }
  to {
    background-position: -130% 0;
  }
}
@keyframes refine-frame-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes refine-frame-label {
  from {
    opacity: 0;
    filter: blur(2px);
  }
}
@keyframes refine-frame-wait {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.65;
  }
}
</style>
