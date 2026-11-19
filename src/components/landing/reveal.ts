import type { Directive } from 'vue';

type RevealElement = HTMLElement & { __lnReveal?: IntersectionObserver };

const EASE = 'cubic-bezier(0.21, 0.47, 0.32, 0.98)';

export const vReveal: Directive<RevealElement, number | undefined> = {
  mounted(el, binding) {
    const delay = binding.value ?? 0;
    if (typeof IntersectionObserver === 'undefined') return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        el.style.transition = `opacity 0.5s ${EASE} ${delay}s, transform 0.5s ${EASE} ${delay}s`;
        el.style.opacity = '1';
        el.style.transform = 'none';
        const done = () => {
          el.style.removeProperty('transition');
          el.style.removeProperty('transform');
          el.style.removeProperty('opacity');
          el.removeEventListener('transitionend', done);
        };
        el.addEventListener('transitionend', done);
      },
      { rootMargin: '-60px' }
    );
    observer.observe(el);
    el.__lnReveal = observer;
  },
  beforeUnmount(el) {
    el.__lnReveal?.disconnect();
  }
};
