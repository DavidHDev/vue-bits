import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

export const MIN_PREVIEW_WIDTH = 320;

export type PreviewFrame = { top: number; left: number; height: number; fullWidth: number };

const sameFrame = (a: PreviewFrame | null, b: PreviewFrame | null) =>
  a !== null &&
  b !== null &&
  a.top === b.top &&
  a.left === b.left &&
  a.height === b.height &&
  a.fullWidth === b.fullWidth;

const readFrame = (panel: HTMLElement) => {
  const demo = panel.querySelector<HTMLElement>('.demo-container');
  const parent = demo?.parentElement;
  if (!demo || !parent) return { demo: null, frame: null };
  const panelRect = panel.getBoundingClientRect();
  const demoRect = demo.getBoundingClientRect();
  if (panelRect.width === 0 || demoRect.width === 0) return { demo, frame: null };
  const parentRect = parent.getBoundingClientRect();
  const contentRight =
    parentRect.left + parent.clientLeft + parent.clientWidth - parseFloat(getComputedStyle(parent).paddingRight);
  return {
    demo,
    frame: {
      top: demoRect.top - panelRect.top - panel.clientTop,
      left: demoRect.left - panelRect.left - panel.clientLeft,
      height: demoRect.height,
      fullWidth: Math.max(MIN_PREVIEW_WIDTH, Math.floor(contentRight - demoRect.left))
    }
  };
};

export function usePreviewFrame(panelRef: Ref<HTMLElement | null>, enabled: Ref<boolean>) {
  const frame = ref<PreviewFrame | null>(null);
  let observer: ResizeObserver | null = null;

  const stop = () => {
    observer?.disconnect();
    observer = null;
  };

  watch(
    [panelRef, enabled],
    ([panel, isEnabled]) => {
      stop();
      if (!isEnabled || !panel) {
        frame.value = null;
        return;
      }
      let observed: HTMLElement | null = null;
      const measure = () => {
        const { demo, frame: next } = readFrame(panel);
        if (demo !== observed) {
          if (observed) observer?.unobserve(observed);
          if (demo) observer?.observe(demo);
          observed = demo;
        }
        if (!sameFrame(frame.value, next)) frame.value = next;
      };
      observer = new ResizeObserver(measure);
      observer.observe(panel);
      measure();
    },
    { immediate: true, flush: 'post' }
  );

  onBeforeUnmount(stop);

  return frame;
}
