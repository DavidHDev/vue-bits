import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export function useInView(target: Ref<HTMLElement | null>, rootMargin = '150px') {
  const visible = ref(false);
  let cleanup: (() => void) | null = null;

  onMounted(() => {
    const el = target.value;
    if (!el || typeof IntersectionObserver === 'undefined') {
      visible.value = true;
      return;
    }

    let inView = false;
    let tabVisible = document.visibilityState !== 'hidden';
    const sync = () => {
      visible.value = inView && tabVisible;
    };

    const observer = new IntersectionObserver(
      entries => {
        inView = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { rootMargin }
    );
    observer.observe(el);

    const onVisibilityChange = () => {
      tabVisible = document.visibilityState !== 'hidden';
      sync();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    cleanup = () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  onBeforeUnmount(() => cleanup?.());

  return visible;
}
