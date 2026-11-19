import { onBeforeUnmount, onMounted, ref } from 'vue';

const DESKTOP_POINTER_QUERY = '(min-width: 968px) and (hover: hover) and (pointer: fine)';

type NetworkInformation = EventTarget & { saveData?: boolean; effectiveType?: string };

const getConnection = () =>
  (navigator as Navigator & { connection?: NetworkInformation }).connection as NetworkInformation | undefined;

const getPreference = () => {
  if (typeof window === 'undefined') return false;
  const precisePointer = window.matchMedia(DESKTOP_POINTER_QUERY).matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = getConnection();
  const constrained = Boolean(connection?.saveData) || ['slow-2g', '2g'].includes(connection?.effectiveType ?? '');
  return precisePointer && !reducedMotion && !constrained;
};

export function usePreviewMediaAllowed() {
  const allowed = ref(getPreference());
  let pointerQuery: MediaQueryList | null = null;
  let motionQuery: MediaQueryList | null = null;
  const update = () => {
    allowed.value = getPreference();
  };

  onMounted(() => {
    pointerQuery = window.matchMedia(DESKTOP_POINTER_QUERY);
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    pointerQuery.addEventListener('change', update);
    motionQuery.addEventListener('change', update);
    getConnection()?.addEventListener?.('change', update);
    update();
  });

  onBeforeUnmount(() => {
    pointerQuery?.removeEventListener('change', update);
    motionQuery?.removeEventListener('change', update);
    getConnection()?.removeEventListener?.('change', update);
  });

  return allowed;
}
