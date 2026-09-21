<script setup lang="ts">
import { ArrowLeft01Icon, Mic01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue';

export type VoicePillShape = 'pill' | 'rounded';
export type VoicePillMode = 'auto' | 'hold' | 'toggle';
export type VoicePillSource = 'simulated' | 'mic';
export type VoicePillStopReason =
  | 'release'
  | 'tap'
  | 'key'
  | 'escape'
  | 'blur'
  | 'disabled'
  | 'mic-denied'
  | 'cancel'
  | 'unmount';

interface VoicePillProps {
  accentColor?: string;
  iconColor?: string;
  background?: string;
  size?: number;
  shape?: VoicePillShape;
  reach?: number;
  showTime?: boolean;
  waveform?: boolean;
  slideToCancel?: boolean;
  cancelDistance?: number;
  attack?: number;
  release?: number;
  sensitivity?: number;
  floor?: number;
  openDuration?: number;
  pressScale?: number;
  mode?: VoicePillMode;
  holdAfter?: number;
  reactive?: VoicePillSource;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

interface AudioBits {
  ctx: AudioContext;
  stream?: MediaStream | null;
  src?: MediaStreamAudioSourceNode | null;
  analyser?: AnalyserNode | null;
  buf?: Uint8Array<ArrayBuffer> | null;
}

interface State {
  listening: boolean;
  pointerId: number | null;
  ownPress: boolean;
  downX: number;
  sliding: boolean;
  hist: number[];
  tick: number;
  acc: number;
  downAt: number;
  startedAt: number;
  raf: number;
  last: number;
  env: number;
  t0: number;
  audio: AudioBits | null;
}

const LOOP = 4.8;
const SYLLABLES = [
  [0.1, 0.16, 0.9],
  [0.3, 0.12, 0.7],
  [0.5, 0.2, 1],
  [0.95, 0.14, 0.8],
  [1.15, 0.1, 0.6],
  [1.3, 0.22, 0.95],
  [1.9, 0.16, 0.85],
  [2.12, 0.12, 0.7],
  [2.3, 0.18, 0.9],
  [2.55, 0.1, 0.5],
  [3.05, 0.24, 1],
  [3.4, 0.12, 0.75],
  [3.6, 0.16, 0.9]
];
const MIC_BINS = [
  [1, 4],
  [4, 11],
  [11, 33]
];
const MIC_GAIN = 2.2;
const DT_MAX = 0.05;
const SLIDE_MIN = 4;
const WAVE_EVERY = 4;
const WAVE_MAX = 80;

const simulatedLevel = (t: number) => {
  const u = t % LOOP;
  let a = 0.06;
  for (const [s, d, p] of SYLLABLES) {
    const x = (u - s) / d;
    if (x >= 0 && x <= 1) a = Math.max(a, p * 0.5 * (1 - Math.cos(2 * Math.PI * x)));
  }
  return a * (0.7 + 0.3 * Math.abs(Math.sin(2 * Math.PI * 7.1 * u)));
};
const micLevel = (analyser: AnalyserNode, buf: Uint8Array<ArrayBuffer>) => {
  analyser.getByteFrequencyData(buf);
  let total = 0;
  for (const [lo, hi] of MIC_BINS) {
    let s = 0;
    for (let i = lo; i < hi; i += 1) s += buf[i];
    total += s / ((hi - lo) * 255);
  }
  return (total / MIC_BINS.length) * MIC_GAIN;
};
const drawWave = (s: State, canvas: HTMLCanvasElement, level: number, color: string, floor: number) => {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(1, Math.round(rect.width * dpr));
  const H = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  s.acc = Math.max(s.acc, level);
  s.tick = (s.tick + 1) % WAVE_EVERY;
  if (s.tick === 0) {
    s.hist.push(s.acc);
    s.acc = 0;
    if (s.hist.length > WAVE_MAX) s.hist.shift();
  }
  const bw = 2 * dpr;
  const step = 3 * dpr;
  const shift = (s.tick / WAVE_EVERY) * step;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = color;
  for (let i = 0; i < s.hist.length; i += 1) {
    const v = s.hist[s.hist.length - 1 - i];
    const x = W - (i + 1) * step - shift;
    if (x + bw < 0) break;
    const h = Math.max(bw, (floor + (1 - floor) * v) * H);
    const t = Math.min(1, Math.max(0, (x + bw / 2) / (W * 0.55)));
    const fade = t * t * (3 - 2 * t);
    ctx.globalAlpha = (0.35 + 0.65 * v) * fade;
    ctx.beginPath();
    ctx.roundRect(x, (H - h) / 2, bw, h, bw / 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};
const clock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const openMic = async (s: State) => {
  const Ctx =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx || !navigator.mediaDevices?.getUserMedia) throw new Error('unsupported');
  s.audio ??= { ctx: new Ctx() };
  const a = s.audio;
  if (a.ctx.state === 'suspended') a.ctx.resume();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  if (!s.listening) {
    stream.getTracks().forEach(t => t.stop());
    return;
  }
  a.stream = stream;
  a.src = a.ctx.createMediaStreamSource(stream);
  a.analyser = a.ctx.createAnalyser();
  a.analyser.fftSize = 256;
  a.analyser.smoothingTimeConstant = 0;
  a.src.connect(a.analyser);
  a.buf = new Uint8Array(a.analyser.frequencyBinCount);
};
const closeMic = (s: State) => {
  const a = s.audio;
  if (!a?.stream) return;
  a.stream.getTracks().forEach(t => t.stop());
  a.src?.disconnect();
  a.stream = null;
  a.src = null;
  a.analyser = null;
  a.buf = null;
};

const props = withDefaults(defineProps<VoicePillProps>(), {
  accentColor: '#f5f5f5',
  iconColor: '#a1a1aa',
  background: '#27272a',
  size: 28,
  shape: 'pill',
  reach: 8,
  showTime: true,
  waveform: true,
  slideToCancel: true,
  cancelDistance: 64,
  attack: 40,
  release: 240,
  sensitivity: 1,
  floor: 0.1,
  openDuration: 200,
  pressScale: 0.95,
  mode: 'auto',
  holdAfter: 300,
  reactive: 'simulated',
  disabled: false,
  ariaLabel: 'Dictate',
  className: ''
});

const emit = defineEmits<{
  start: [info: { source: VoicePillSource }];
  stop: [info: { reason: VoicePillStopReason; duration: number }];
}>();

const listening = ref(false);
const pressed = ref(false);
const input = ref('pointer');
const timeRef = ref<HTMLSpanElement | null>(null);
const rootRef = ref<HTMLButtonElement | null>(null);
const waveRef = ref<HTMLCanvasElement | null>(null);
const s: State = {
  listening: false,
  pointerId: null,
  ownPress: false,
  downX: 0,
  sliding: false,
  hist: [],
  tick: 0,
  acc: 0,
  downAt: 0,
  startedAt: 0,
  raf: 0,
  last: 0,
  env: 0,
  t0: 0,
  audio: null
};

// the clock, envelope and waveform run on a raf loop and are written by hand, never through a Vue render
const frame = (now: number) => {
  const dt = Math.min((now - s.last) / 1000, DT_MAX);
  s.last = now;
  let target = 0;
  if (s.listening) {
    if (s.audio?.analyser) target = micLevel(s.audio.analyser, s.audio.buf as Uint8Array<ArrayBuffer>);
    else if (props.reactive !== 'mic') target = simulatedLevel((now - s.t0) / 1000);
  }
  target = Math.min(1, target * props.sensitivity);
  const tau = Math.max(1, target > s.env ? props.attack : props.release) / 1000;
  s.env += (target - s.env) * (1 - Math.exp(-dt / tau));
  if (s.listening && props.showTime && timeRef.value) {
    const text = clock(now - s.startedAt);
    if (timeRef.value.textContent !== text) timeRef.value.textContent = text;
  }
  if (s.listening && props.waveform && waveRef.value) {
    drawWave(s, waveRef.value, s.env, props.accentColor, props.floor);
  }
  s.raf = s.listening ? requestAnimationFrame(frame) : 0;
};

const end = (reason: VoicePillStopReason) => {
  if (!s.listening) return;
  s.listening = false;
  closeMic(s);
  listening.value = false;
  input.value = reason === 'key' || reason === 'escape' ? 'key' : 'pointer';
  emit('stop', { reason, duration: Math.round(performance.now() - s.startedAt) });
};
const begin = (kind: 'pointer' | 'key') => {
  if (s.listening || props.disabled) return;
  s.listening = true;
  s.hist = [];
  s.tick = 0;
  s.acc = 0;
  s.env = 0;
  s.startedAt = performance.now();
  s.t0 = s.startedAt;
  s.last = s.startedAt;
  if (timeRef.value) timeRef.value.textContent = '0:00';
  listening.value = true;
  input.value = kind;
  if (!s.raf) s.raf = requestAnimationFrame(frame);
  emit('start', { source: props.reactive });
  if (props.reactive === 'mic') openMic(s).catch(() => end('mic-denied'));
};

const settleSlide = () => {
  const root = rootRef.value;
  s.sliding = false;
  if (!root) return;
  delete root.dataset.sliding;
  root.style.setProperty('--vp-slide', '0px');
  root.style.setProperty('--vp-cancel', '0');
};
const onPointerMove = (e: PointerEvent) => {
  const root = rootRef.value;
  if (!root || s.pointerId !== e.pointerId || !props.slideToCancel || !s.listening || !s.ownPress) return;
  const dx = e.clientX - s.downX;
  if (!s.sliding && dx > -SLIDE_MIN) return;
  s.sliding = true;
  root.dataset.sliding = '';
  const pull = Math.min(props.cancelDistance + 24, Math.max(0, -dx));
  root.style.setProperty('--vp-slide', `${-pull}px`);
  const progress = Math.min(1, pull / props.cancelDistance);
  root.style.setProperty('--vp-cancel', progress.toFixed(3));
  if (progress >= 1) {
    settleSlide();
    end('cancel');
  }
};
const onPointerDown = (e: PointerEvent) => {
  if (props.disabled || e.button !== 0 || !e.isPrimary || s.pointerId !== null) return;
  s.pointerId = e.pointerId;
  s.downX = e.clientX;
  s.downAt = performance.now();
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  pressed.value = true;
  s.ownPress = !s.listening;
  if (!s.listening) begin('pointer');
};
const onPointerUp = (e: PointerEvent) => {
  if (e.pointerId !== s.pointerId) return;
  s.pointerId = null;
  pressed.value = false;
  if (s.sliding) settleSlide();
  const el = e.currentTarget as HTMLElement;
  try {
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  if (!s.listening) return;
  const held = performance.now() - s.downAt;
  const isHold = props.mode === 'hold' || (props.mode === 'auto' && held >= props.holdAfter);
  if (s.ownPress) {
    if (isHold) end('release');
  } else {
    end(held < props.holdAfter ? 'tap' : 'release');
  }
};
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    end('escape');
    return;
  }
  if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
    e.preventDefault();
    if (s.listening) end('key');
    else begin('key');
  }
};
const onClick = (e: MouseEvent) => {
  if (e.detail === 0 && s.pointerId === null && !(e as PointerEvent).pointerType) {
    if (s.listening) end('key');
    else begin('key');
  }
};

watch(pressed, (on, _o, onCleanup) => {
  if (!on) return;
  const stop = () => end('blur');
  const onVis = () => {
    if (document.hidden) stop();
  };
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', onVis);
  onCleanup(() => {
    window.removeEventListener('blur', stop);
    document.removeEventListener('visibilitychange', onVis);
  });
});
watch(
  () => props.disabled,
  d => {
    if (d) end('disabled');
  }
);
onBeforeUnmount(() => {
  end('unmount');
  cancelAnimationFrame(s.raf);
  s.audio?.ctx.close();
});

const micIcon = Mic01Icon as unknown as IconArray;
const backIcon = ArrowLeft01Icon as unknown as IconArray;

const radius = computed(() => (props.shape === 'rounded' ? Math.round(props.size * 0.29) : props.size / 2));
const hit = computed(() => Math.max(0, Math.min(10, (44 - props.size) / 2)));
const timeSize = computed(() => Math.max(10, Math.round(props.size * 0.36)));
const clockW = computed(() => (props.showTime ? Math.round(timeSize.value * 2.5) + 4 : 0));
const waveW = computed(() => (props.waveform ? Math.round(props.size * 1.9) : 0));
const extra = computed(() => clockW.value + waveW.value);

const rootStyle = computed(
  () =>
    ({
      '--vp-accent': props.accentColor,
      '--vp-icon': props.iconColor,
      '--vp-bg': props.background,
      '--vp-size': `${props.size}px`,
      '--vp-radius': `${radius.value}px`,
      '--vp-reach': `${props.reach}px`,
      '--vp-extra': `${extra.value}px`,
      '--vp-clock-w': `${clockW.value}px`,
      '--vp-wave-w': `${waveW.value}px`,
      '--vp-stop': `${Math.round(props.size * 0.32)}px`,
      '--vp-icon-size': `${Math.round(props.size * 0.54)}px`,
      '--vp-time-size': `${timeSize.value}px`,
      '--vp-open': `${props.openDuration}ms`,
      '--vp-press': props.pressScale,
      '--vp-hit': `${hit.value}px`
    }) as CSSProperties
);
</script>

<template>
  <button
    ref="rootRef"
    type="button"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-pressed="listening"
    class="group inline-grid data-[state=listening]:z-[1] isolate before:absolute relative place-items-center bg-transparent disabled:opacity-55 m-0 p-0 border-0 outline-none before:content-[''] [-webkit-touch-callout:none] touch-none cursor-pointer disabled:cursor-default disabled:pointer-events-none select-none [width:var(--vp-size)] [height:var(--vp-size)] [border-radius:var(--vp-radius)] [color:var(--vp-icon)] [font-family:inherit] [-webkit-tap-highlight-color:transparent] [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1),color_150ms_ease] before:[inset:calc(-1*var(--vp-hit))] data-[state=listening]:[color:var(--vp-accent)] data-[pressed]:[transform:scale(var(--vp-press))] motion-reduce:[transform:none]! motion-reduce:[transition:color_150ms_ease]"
    :class="className"
    :data-state="listening ? 'listening' : 'idle'"
    :data-pressed="pressed ? '' : undefined"
    :data-input="input"
    :data-time="showTime ? '' : undefined"
    :style="rootStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @lostpointercapture="onPointerUp"
    @keydown="onKeyDown"
    @click="onClick"
    @contextmenu.prevent
  >
    <span
      class="absolute pointer-events-none [inset:0_0_0_calc(-1*(var(--vp-reach)+var(--vp-extra)))] [border-radius:var(--vp-radius)] [background:var(--vp-bg)] [clip-path:inset(0_0_0_calc(var(--vp-reach)+var(--vp-extra))_round_var(--vp-radius))] [transition:clip-path_var(--vp-open)_cubic-bezier(0.23,1,0.32,1),background-color_150ms_ease] [@media(hover:hover)_and_(pointer:fine)]:group-enabled:group-data-[state=idle]:group-hover:[background:color-mix(in_srgb,var(--vp-icon)_10%,var(--vp-bg))] group-data-[state=listening]:[clip-path:inset(0_0_round_var(--vp-radius))] group-data-[input=key]:[transition-duration:0ms] motion-reduce:[transition:background-color_150ms_ease]"
      aria-hidden="true"
    />
    <canvas
      v-if="waveform"
      ref="waveRef"
      class="top-[18%] absolute opacity-0 h-[64%] pointer-events-none [right:calc(100%+var(--vp-clock-w))] [width:var(--vp-wave-w)] [filter:blur(2px)] [transform:translateX(var(--vp-slide,0px))] [transition:opacity_200ms_ease,filter_200ms_ease,transform_240ms_cubic-bezier(0.23,1,0.32,1)] group-data-[state=listening]:[opacity:calc(1-var(--vp-cancel,0))] group-data-[state=listening]:[filter:blur(0)] group-data-[sliding]:[transition-property:opacity,filter] motion-reduce:[filter:none]! motion-reduce:[transition-property:opacity]"
      aria-hidden="true"
    />
    <span
      v-if="slideToCancel"
      class="inline-flex right-full absolute inset-y-0 justify-center items-center gap-[3px] font-medium leading-none pointer-events-none [width:var(--vp-extra)] [color:var(--vp-accent)] [font-size:var(--vp-time-size)] [opacity:var(--vp-cancel,0)]"
      aria-hidden="true"
    >
      <HugeiconsIcon :icon="backIcon" :size="12" :stroke-width="2.2" />
      <span>Cancel</span>
    </span>
    <span
      v-if="showTime"
      ref="timeRef"
      class="right-full box-border absolute inset-y-0 place-items-center grid opacity-0 font-medium tabular-nums leading-none pointer-events-none [width:var(--vp-clock-w)] [color:var(--vp-accent)] [font-size:var(--vp-time-size)] [filter:blur(2px)] [transform:translateX(var(--vp-slide,0px))] [transition:opacity_200ms_ease,filter_200ms_ease,transform_240ms_cubic-bezier(0.23,1,0.32,1)] group-data-[state=listening]:[opacity:calc(1-var(--vp-cancel,0))] group-data-[state=listening]:[filter:blur(0)] group-data-[sliding]:[transition-property:opacity,filter] group-data-[input=key]:[transition-duration:0ms] motion-reduce:[filter:none]! motion-reduce:[transition-property:opacity]"
      aria-hidden="true"
    >
      0:00
    </span>
    <span
      class="relative place-items-center grid [width:var(--vp-size)] [height:var(--vp-size)] [transform:translateX(var(--vp-slide,0px))] [transition:transform_240ms_cubic-bezier(0.23,1,0.32,1)] group-data-[sliding]:[transition-property:opacity,filter] motion-reduce:[filter:none]! motion-reduce:[transition-property:opacity]"
    >
      <span
        class="inline-flex group-data-[state=listening]:opacity-0 [grid-area:1/1] [transition:opacity_200ms_ease,filter_200ms_ease,transform_200ms_cubic-bezier(0.23,1,0.32,1)] group-data-[state=listening]:[filter:blur(2px)] group-data-[state=listening]:[transform:scale(0.7)] group-data-[input=key]:[transition-duration:0ms] motion-reduce:[filter:none]! motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
      >
        <HugeiconsIcon :icon="micIcon" :size="Math.round(size * 0.54)" :stroke-width="2" />
      </span>
      <span
        class="bg-current opacity-0 group-data-[state=listening]:opacity-100 [grid-area:1/1] [width:var(--vp-stop)] [height:var(--vp-stop)] [border-radius:22%] [filter:blur(2px)] [transform:scale(0.6)] [transition:opacity_200ms_ease,filter_200ms_ease,transform_200ms_cubic-bezier(0.23,1,0.32,1)] group-data-[state=listening]:[filter:blur(0)] group-data-[state=listening]:[transform:scale(1)] group-data-[input=key]:[transition-duration:0ms] motion-reduce:[filter:none]! motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
        aria-hidden="true"
      />
    </span>
  </button>
</template>
