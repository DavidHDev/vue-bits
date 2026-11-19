import { computed, onBeforeUnmount, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';

export type QualityStep = { dpr: number; quality: 'medium' | 'low'; lite: boolean };

export const QUALITY_STEPS: QualityStep[] = [
  { dpr: 1.5, quality: 'medium', lite: false },
  { dpr: 1.25, quality: 'medium', lite: false },
  { dpr: 1, quality: 'medium', lite: false },
  { dpr: 0.75, quality: 'low', lite: false },
  { dpr: 0.6, quality: 'low', lite: true }
];

const STORAGE_KEY = 'vb-landing-quality';
const WINDOW = 60;
const SLOW_FRAME_MS = 24;
const WARMUP_MS = 1500;
const STABLE_WINDOWS = 3;
const LAST = QUALITY_STEPS.length - 1;

const startLevel = () => {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = Number(sessionStorage.getItem(STORAGE_KEY));
    if (stored > 0) return Math.min(LAST, stored);
  } catch {
    return 0;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 8;
  const memory = nav.deviceMemory || 8;
  if (cores <= 2 || memory <= 2) return LAST;
  if (window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches) return LAST;
  return 0;
};

export function useAdaptiveQuality(active: MaybeRefOrGetter<boolean>) {
  const level = ref(startLevel());
  let frame = 0;

  watch(
    level,
    value => {
      try {
        sessionStorage.setItem(STORAGE_KEY, String(value));
      } catch {
        return;
      }
    },
    { immediate: true }
  );

  watch(
    level,
    value => {
      if (QUALITY_STEPS[value].lite) document.documentElement.setAttribute('data-lite', '');
    },
    { immediate: true }
  );

  watch(
    () => toValue(active),
    isActive => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!isActive || level.value >= LAST) return;
      let last = 0;
      let good = 0;
      let samples: number[] = [];
      const began = performance.now();
      const tick = (now: number) => {
        if (document.hidden) {
          last = 0;
          samples = [];
        } else {
          if (last && now - began > WARMUP_MS) samples.push(now - last);
          last = now;
        }
        if (samples.length >= WINDOW) {
          const median = samples.slice().sort((a, b) => a - b)[WINDOW >> 1];
          samples = [];
          if (median > SLOW_FRAME_MS) {
            good = 0;
            const next = Math.min(level.value + 1, LAST);
            level.value = next;
            if (next >= LAST) return;
          } else if (++good >= STABLE_WINDOWS) {
            return;
          }
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    },
    { immediate: true }
  );

  onBeforeUnmount(() => cancelAnimationFrame(frame));

  return computed(() => QUALITY_STEPS[level.value]);
}
