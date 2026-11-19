import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export function useNearOnce(target: Ref<HTMLElement | null>, rootMargin = '600px 0px') {
  const near = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const node = target.value;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      near.value = true;
      return;
    }
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.value = true;
        observer?.disconnect();
      },
      { rootMargin }
    );
    observer.observe(node);
  });

  onBeforeUnmount(() => observer?.disconnect());

  return near;
}
