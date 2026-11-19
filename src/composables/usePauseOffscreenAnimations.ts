import { onBeforeUnmount, toValue, watch, type MaybeRefOrGetter } from 'vue';

export function usePauseOffscreenAnimations(
  enabled: MaybeRefOrGetter<boolean> = true,
  selector = '.landing-wrapper section, .landing-wrapper footer'
) {
  let cleanup: (() => void) | null = null;

  const stop = () => {
    cleanup?.();
    cleanup = null;
  };

  watch(
    () => toValue(enabled),
    on => {
      stop();
      if (!on || typeof IntersectionObserver === 'undefined') return;

      const elements = Array.from(document.querySelectorAll(selector));
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            entry.target.classList.toggle('ln-anim-paused', !entry.isIntersecting);
          }
        },
        { rootMargin: '100px' }
      );
      elements.forEach(el => observer.observe(el));

      cleanup = () => {
        observer.disconnect();
        elements.forEach(el => el.classList.remove('ln-anim-paused'));
      };
    },
    { flush: 'post' }
  );

  onBeforeUnmount(stop);
}
