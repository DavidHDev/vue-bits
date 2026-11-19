import { ref, type Ref } from 'vue';

const INTENT_THRESHOLD_PX = 6;

export function useScrubGesture({
  trackRef,
  computeValue,
  onChange,
  isDisabled
}: {
  trackRef: Ref<HTMLElement | null>;
  computeValue: (clientX: number) => number;
  onChange: (value: number) => void;
  isDisabled: () => boolean;
}) {
  const isDragging = ref(false);
  let dragging = false;
  let pending: { id: number; x: number; y: number } | null = null;

  const begin = (e: PointerEvent) => {
    dragging = true;
    isDragging.value = true;
    trackRef.value?.setPointerCapture(e.pointerId);
    onChange(computeValue(e.clientX));
  };

  const end = () => {
    dragging = false;
    pending = null;
    isDragging.value = false;
  };

  const onPointerDown = (e: PointerEvent) => {
    if (isDisabled()) return;
    if (e.pointerType === 'touch') {
      pending = { id: e.pointerId, x: e.clientX, y: e.clientY };
      return;
    }
    e.preventDefault();
    begin(e);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (pending) {
      if (e.pointerId !== pending.id) return;
      const dx = e.clientX - pending.x;
      const dy = e.clientY - pending.y;
      if (Math.abs(dx) < INTENT_THRESHOLD_PX && Math.abs(dy) < INTENT_THRESHOLD_PX) return;
      pending = null;
      if (Math.abs(dy) >= Math.abs(dx)) return;
      begin(e);
      return;
    }
    if (!dragging) return;
    onChange(computeValue(e.clientX));
  };

  const onPointerUp = (e: PointerEvent) => {
    if (pending?.id === e.pointerId) onChange(computeValue(e.clientX));
    end();
  };

  const onPointerCancel = () => end();

  return { isDragging, onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
