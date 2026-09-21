<script lang="ts">
import { animate, motionValue, useReducedMotion, useSpring, useVelocity } from 'motion-v';
import {
  computed,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  Teleport,
  Transition,
  useId,
  watch,
  type CSSProperties,
  type InjectionKey
} from 'vue';

export type WarmTooltipSide = 'top' | 'bottom' | 'left' | 'right';
export type WarmTooltipSize = 'sm' | 'md' | 'lg';
export type WarmTooltipPhase = 'closed' | 'open' | 'closing';
export type WarmTooltipMode = 'cold' | 'warm' | 'instant';

export interface WarmTooltipPayload {
  id: string;
  trigger: HTMLElement;
  content: string;
  shortcut?: string;
  side: WarmTooltipSide;
  gap: number;
  arrow: boolean;
  surfaceColor: string;
  inkColor: string;
  radius: number;
  font: number;
  px: number;
  py: number;
  popDuration: number;
  popScale: number;
  popBlur: number;
  warmWindow: number;
}

export interface WarmTooltipGroupApi {
  id: string;
  delay: number;
  warmWindow: number;
  activeId: string | null;
  isWarm: () => boolean;
  show: (payload: WarmTooltipPayload, mode: WarmTooltipMode) => void;
  hide: (tooltipId: string, instant?: boolean) => void;
  reset: () => void;
}

export const WARM_TOOLTIP_GROUP: InjectionKey<WarmTooltipGroupApi> = Symbol('warm-tooltip-group');

export const WarmTooltipGroup = defineComponent({
  name: 'WarmTooltipGroup',
  props: {
    delay: { type: Number, default: 400 },
    warmWindow: { type: Number, default: 300 },
    travel: { type: Number, default: 320 },
    lean: { type: Number, default: 0 }
  },
  emits: ['warmChange'],
  setup(props, { slots, emit, expose }) {
    type Timer = ReturnType<typeof setTimeout> | undefined;
    type Swap = { dir: number; across: boolean };

    interface GroupState {
      state: WarmTooltipPhase;
      current: WarmTooltipPayload | null;
      mode: WarmTooltipMode | 'move';
      instant: boolean;
      warmUntil: number;
      warm: boolean;
      swap: Swap;
      closeTimer: Timer;
      leaveTimer: Timer;
      warmTimer: Timer;
    }

    const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
    const EASE_CSS = 'cubic-bezier(0.23, 1, 0.32, 1)';
    const LEAN_SPRING = { stiffness: 260, damping: 22, mass: 0.4 };
    const FULL_LEAN_SPEED = 1200;
    const SIGN: Record<WarmTooltipSide, number> = { top: 1, bottom: -1, left: -1, right: 1 };
    const ORIGIN: Record<WarmTooltipSide, string> = {
      top: 'center bottom',
      bottom: 'center top',
      left: 'right center',
      right: 'left center'
    };
    const MARGIN = 8;
    const SWAP = 0.14;
    const SWAP_SHIFT = 10;
    const RISE = 4;
    const GRACE = 80;

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const horizontal = (side: WarmTooltipSide) => side === 'top' || side === 'bottom';

    const anchorOf = (rect: DOMRect, side: WarmTooltipSide, gap: number): [number, number] => {
      if (side === 'top') return [rect.left + rect.width / 2, rect.top - gap];
      if (side === 'bottom') return [rect.left + rect.width / 2, rect.bottom + gap];
      if (side === 'left') return [rect.left - gap, rect.top + rect.height / 2];
      return [rect.right + gap, rect.top + rect.height / 2];
    };
    const layoutOf = (x: number, y: number, width: number, height: number, side: WarmTooltipSide) => {
      if (horizontal(side)) {
        const X = clamp(x - width / 2, MARGIN, Math.max(MARGIN, window.innerWidth - MARGIN - width));
        return { X, Y: side === 'top' ? y - height : y };
      }
      const Y = clamp(y - height / 2, MARGIN, Math.max(MARGIN, window.innerHeight - MARGIN - height));
      return { X: side === 'left' ? x - width : x, Y };
    };

    const reduce = useReducedMotion();
    const id = useId();
    const current = shallowRef<WarmTooltipPayload | null>(null);
    const state = ref<WarmTooltipPhase>('closed');
    const side = ref<WarmTooltipSide>('top');
    const st: GroupState = {
      state: 'closed',
      current: null,
      mode: 'cold',
      instant: false,
      warmUntil: -Infinity,
      warm: false,
      swap: { dir: 0, across: false },
      closeTimer: undefined,
      leaveTimer: undefined,
      warmTimer: undefined
    };
    let textEl: HTMLElement | null = null;
    const outerRef = ref<HTMLSpanElement | null>(null);
    const popRef = ref<HTMLSpanElement | null>(null);
    const arrowRef = ref<HTMLSpanElement | null>(null);
    const setText = (el: unknown) => {
      if (el) textEl = el as HTMLElement;
    };

    const ax = motionValue(0);
    const ay = motionValue(0);
    const w = motionValue(0);
    const ht = motionValue(0);
    const presence = motionValue(0);
    const vx = useVelocity(ax);
    const vy = useVelocity(ay);
    const leanUnit = useSpring(0, LEAN_SPRING);

    // place, pop and lean are written by hand so gliding never waits on a Vue render
    const paintPlace = () => {
      const outer = outerRef.value;
      if (!outer) return;
      const sd = st.current ? st.current.side : 'top';
      const width = w.get();
      const height = ht.get();
      const x = ax.get();
      const y = ay.get();
      const { X, Y } = layoutOf(x, y, width, height, sd);
      outer.style.transform = `translate(${X}px, ${Y}px)`;
      outer.style.width = `${width}px`;
      outer.style.height = `${height}px`;
      const arrow = arrowRef.value;
      if (arrow) {
        if (horizontal(sd)) {
          arrow.style.left = `${clamp(x - X, 10, width - 10)}px`;
          arrow.style.top = '';
        } else {
          arrow.style.top = `${clamp(y - Y, 10, height - 10)}px`;
          arrow.style.left = '';
        }
      }
    };
    const paintPop = () => {
      const pop = popRef.value;
      if (!pop) return;
      const c = st.current;
      const sd = c ? c.side : 'top';
      const p = presence.get();
      pop.style.opacity = String(p);
      if (reduce.value || !c) {
        pop.style.transform = 'none';
        pop.style.filter = 'none';
        return;
      }
      const scale = c.popScale + (1 - c.popScale) * p;
      const rise = (1 - p) * RISE * SIGN[sd] * (sd === 'left' ? -1 : 1);
      const rotate = leanUnit.get() * props.lean * SIGN[sd];
      const tx = horizontal(sd) ? 0 : rise;
      const ty = horizontal(sd) ? rise : 0;
      pop.style.transform = `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotate}deg)`;
      pop.style.filter = `blur(${c.popBlur * (1 - p)}px)`;
    };
    const updateLean = () => {
      const c = st.current;
      const speed = c && !horizontal(c.side) ? vy.get() : vx.get();
      leanUnit.set(clamp(-speed / FULL_LEAN_SPEED, -1, 1));
    };
    const offs: (() => void)[] = [];
    onMounted(() => {
      offs.push(
        ax.on('change', paintPlace),
        ay.on('change', paintPlace),
        w.on('change', paintPlace),
        ht.on('change', paintPlace),
        presence.on('change', paintPop),
        leanUnit.on('change', paintPop),
        vx.on('change', updateLean),
        vy.on('change', updateLean)
      );
    });

    const isWarm = () => st.state !== 'closed' || now() < st.warmUntil;
    const notify = () => {
      const next = isWarm();
      if (next === st.warm) return;
      st.warm = next;
      emit('warmChange', next);
    };
    const finishClose = () => {
      st.state = 'closed';
      st.current = null;
      state.value = 'closed';
      current.value = null;
      notify();
    };
    const show = (payload: WarmTooltipPayload, mode: WarmTooltipMode) => {
      clearTimeout(st.closeTimer);
      clearTimeout(st.leaveTimer);
      const prev = st.current;
      const fresh = st.state === 'closed';
      if (prev && prev.id !== payload.id) {
        const [px, py] = anchorOf(prev.trigger.getBoundingClientRect(), prev.side, prev.gap);
        const [nx, ny] = anchorOf(payload.trigger.getBoundingClientRect(), payload.side, payload.gap);
        const across = !horizontal(payload.side);
        st.swap = { dir: Math.sign(across ? ny - py : nx - px) || 1, across };
      } else {
        st.swap = { dir: 0, across: !horizontal(payload.side) };
      }
      st.mode = fresh ? mode : mode === 'instant' ? 'instant' : 'move';
      st.instant = mode === 'instant';
      st.current = payload;
      st.state = 'open';
      side.value = payload.side;
      current.value = payload;
      state.value = 'open';
      notify();
    };
    const beginClose = (instant: boolean) => {
      const c = st.current;
      if (!c || st.state !== 'open') return;
      st.state = 'closing';
      state.value = 'closing';
      st.warmUntil = now() + c.warmWindow;
      clearTimeout(st.warmTimer);
      st.warmTimer = setTimeout(notify, c.warmWindow + 1);
      if (instant) {
        presence.jump(0);
        finishClose();
        return;
      }
      const closeMs = Math.round(c.popDuration * 0.8);
      animate(presence, 0, { duration: closeMs / 1000, ease: EASE_OUT });
      st.closeTimer = setTimeout(finishClose, closeMs);
    };
    const hide = (tooltipId: string, instant?: boolean) => {
      const c = st.current;
      if (!c || c.id !== tooltipId || st.state !== 'open') return;
      clearTimeout(st.leaveTimer);
      if (instant || st.instant) {
        beginClose(true);
        return;
      }
      st.leaveTimer = setTimeout(() => beginClose(false), GRACE);
    };
    const reset = () => {
      if (st.current) hide(st.current.id, true);
      st.warmUntil = -Infinity;
      clearTimeout(st.warmTimer);
      notify();
    };

    provide(WARM_TOOLTIP_GROUP, {
      id,
      get delay() {
        return props.delay;
      },
      get warmWindow() {
        return props.warmWindow;
      },
      get activeId() {
        return current.value ? current.value.id : null;
      },
      isWarm,
      show,
      hide,
      reset
    });
    expose({ reset });

    watch(
      [current, state],
      () => {
        const c = st.current;
        const text = textEl;
        if (c && text && state.value === 'open') {
          const [tx, ty] = anchorOf(c.trigger.getBoundingClientRect(), c.side, c.gap);
          const tw = text.offsetWidth + c.px * 2;
          const th = text.offsetHeight + c.py * 2;
          if (st.mode === 'move' && !reduce.value && props.travel > 0) {
            const spring = { type: 'spring' as const, duration: props.travel / 1000, bounce: 0.1 };
            animate(ax, tx, spring);
            animate(ay, ty, spring);
            animate(w, tw, spring);
            animate(ht, th, spring);
            animate(presence, 1, { duration: 0.12, ease: EASE_OUT });
          } else {
            ax.jump(tx);
            ay.jump(ty);
            w.jump(tw);
            ht.jump(th);
            if (st.mode === 'cold') {
              presence.jump(0);
              animate(presence, 1, { duration: c.popDuration / 1000, ease: EASE_OUT });
            } else {
              presence.jump(1);
            }
          }
        }
        paintPlace();
        paintPop();
      },
      { flush: 'post' }
    );

    watch(state, (s, _o, onCleanup) => {
      if (s === 'closed') return;
      let raf = 0;
      const follow = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const c = st.current;
          if (!c) return;
          const [tx, ty] = anchorOf(c.trigger.getBoundingClientRect(), c.side, c.gap);
          ax.jump(tx);
          ay.jump(ty);
        });
      };
      const onHidden = () => {
        if (document.visibilityState === 'hidden' && st.current) hide(st.current.id, true);
      };
      window.addEventListener('scroll', follow, { capture: true, passive: true });
      window.addEventListener('resize', follow);
      document.addEventListener('visibilitychange', onHidden);
      onCleanup(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener('scroll', follow, { capture: true });
        window.removeEventListener('resize', follow);
        document.removeEventListener('visibilitychange', onHidden);
      });
    });

    onBeforeUnmount(() => {
      clearTimeout(st.closeTimer);
      clearTimeout(st.leaveTimer);
      clearTimeout(st.warmTimer);
      offs.forEach(off => off());
      [ax, ay, w, ht, presence, leanUnit].forEach(v => v.stop());
    });

    // the label layers cross-slide when the label glides to another trigger
    const layer = (dir: number, across: boolean, shown: boolean) => {
      const shift = shown ? 0 : SWAP_SHIFT * dir;
      return {
        opacity: shown ? 1 : 0,
        transform: `translate(${across ? 0 : shift}px, ${across ? shift : 0}px)`,
        filter: shown ? 'blur(0px)' : 'blur(3px)'
      };
    };
    const onEnter = (el: Element, done: () => void) => {
      const { dir, across } = st.swap;
      if (reduce.value || dir === 0) {
        done();
        return;
      }
      const a = el.animate([layer(dir, across, false), layer(dir, across, true)], {
        duration: SWAP * 1000,
        easing: EASE_CSS
      });
      a.onfinish = () => {
        a.cancel();
        done();
      };
    };
    const onLeave = (el: Element, done: () => void) => {
      const { dir, across } = st.swap;
      if (reduce.value) {
        done();
        return;
      }
      const out = layer(-dir, across, false);
      el.animate([layer(dir, across, true), out], {
        duration: SWAP * 1000,
        easing: EASE_CSS,
        fill: 'forwards'
      }).onfinish = done;
    };

    const ORIGIN_OF = ORIGIN;
    return () => {
      const c = current.value;
      const tooltip =
        state.value !== 'closed' && c
          ? h(
              'span',
              {
                id,
                ref: outerRef,
                role: 'tooltip',
                class: 'pointer-events-none fixed top-0 left-0 z-[9999] block [font-family:inherit]',
                'data-side': side.value,
                style: {
                  '--wt-surface': c.surfaceColor,
                  '--wt-ink': c.inkColor,
                  '--wt-radius': `${c.radius}px`,
                  '--wt-font': `${c.font}px`,
                  '--wt-origin': ORIGIN_OF[side.value]
                }
              },
              h(
                'span',
                {
                  ref: popRef,
                  class:
                    'absolute inset-0 rounded-[var(--wt-radius)] [background:var(--wt-surface)] [color:var(--wt-ink)] [box-shadow:0_1px_2px_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(0,0,0,0.45)] [transform-origin:var(--wt-origin)] contrast-more:[box-shadow:inset_0_0_0_1px_color-mix(in_srgb,var(--wt-ink)_40%,transparent)]'
                },
                [
                  h(Transition, { css: false, onEnter, onLeave }, () =>
                    h('span', { key: c.id, class: 'absolute inset-0 flex items-center justify-center' }, [
                      h(
                        'span',
                        {
                          ref: setText,
                          class:
                            'inline-flex items-center gap-[7px] whitespace-nowrap font-medium leading-[1.2] tracking-[-0.01em] [font-size:var(--wt-font)]'
                        },
                        [
                          c.content,
                          c.shortcut
                            ? h(
                                'kbd',
                                {
                                  class:
                                    'inline-flex h-[1.55em] items-center rounded-[0.4em] px-[0.45em] text-[0.86em] font-medium tracking-[0.02em] tabular-nums [font-family:inherit] [background:color-mix(in_srgb,var(--wt-ink)_9%,transparent)] [box-shadow:inset_0_-1px_0_color-mix(in_srgb,var(--wt-ink)_12%,transparent)] [color:color-mix(in_srgb,var(--wt-ink)_72%,transparent)]'
                                },
                                c.shortcut
                              )
                            : null
                        ]
                      )
                    ])
                  ),
                  c.arrow
                    ? h('span', {
                        ref: arrowRef,
                        class:
                          'absolute -m-1 h-2 w-2 rounded-[2px] [background:var(--wt-surface)] [transform:rotate(45deg)] data-[side=top]:bottom-[1px] data-[side=bottom]:top-[1px] data-[side=left]:right-[1px] data-[side=right]:left-[1px]',
                        'data-side': side.value,
                        'aria-hidden': 'true'
                      })
                    : null
                ]
              )
            )
          : null;
      return [slots.default?.(), h(Teleport, { to: 'body' }, tooltip ? [tooltip] : [])];
    };
  }
});
</script>

<script setup lang="ts">
interface WarmTooltipProps {
  content: string;
  shortcut?: string;
  side?: WarmTooltipSide;
  delay?: number;
  warmWindow?: number;
  surfaceColor?: string;
  inkColor?: string;
  size?: WarmTooltipSize;
  radius?: number;
  gap?: number;
  arrow?: boolean;
  popDuration?: number;
  popScale?: number;
  popBlur?: number;
  showFuse?: boolean;
  longPress?: number;
  disabled?: boolean;
  className?: string;
}

type Timer = ReturnType<typeof setTimeout> | undefined;

const SIZES: Record<WarmTooltipSize, { font: number; px: number; py: number }> = {
  sm: { font: 11.5, px: 8, py: 5 },
  md: { font: 12.5, px: 10, py: 6 },
  lg: { font: 13.5, px: 12, py: 7 }
};
const HOLD_SLOP = 10;

const props = withDefaults(defineProps<WarmTooltipProps>(), {
  shortcut: undefined,
  side: 'top',
  delay: undefined,
  warmWindow: undefined,
  surfaceColor: '#f5f5f5',
  inkColor: '#18181b',
  size: 'md',
  radius: 8,
  gap: 8,
  arrow: true,
  popDuration: 160,
  popScale: 0.94,
  popBlur: 4,
  showFuse: false,
  longPress: 500,
  disabled: false,
  className: ''
});

defineSlots<{ default(props: { describedby?: string }): unknown }>();

// without a group around it, the tooltip wraps itself in a private one (see the template)
const group = inject(WARM_TOOLTIP_GROUP, null);
const id = useId();
const triggerRef = ref<HTMLSpanElement | null>(null);
const fuse = ref<'idle' | 'arming'>('idle');
const pressing = ref(false);
let openTimer: Timer;
let pressTimer: Timer;
let press0: { x: number; y: number; id: number } | null = null;
let suppressClick = false;

const preset = computed(() => SIZES[props.size] || SIZES.md);
const coldDelay = computed(() => props.delay ?? group?.delay ?? 400);
const active = computed(() => !!group && group.activeId === id);

const payload = (): WarmTooltipPayload => ({
  id,
  trigger: triggerRef.value as HTMLSpanElement,
  content: props.content,
  shortcut: props.shortcut,
  side: props.side,
  gap: props.gap,
  arrow: props.arrow,
  surfaceColor: props.surfaceColor,
  inkColor: props.inkColor,
  radius: props.radius,
  font: preset.value.font,
  px: preset.value.px,
  py: preset.value.py,
  popDuration: props.popDuration,
  popScale: props.popScale,
  popBlur: props.popBlur,
  warmWindow: props.warmWindow ?? group?.warmWindow ?? 300
});

const hide = (instant?: boolean) => {
  clearTimeout(openTimer);
  fuse.value = 'idle';
  group?.hide(id, instant);
};
const arm = () => {
  if (!group) return;
  if (group.isWarm()) {
    group.show(payload(), 'warm');
    return;
  }
  fuse.value = 'arming';
  openTimer = setTimeout(() => {
    fuse.value = 'idle';
    group.show(payload(), 'cold');
  }, coldDelay.value);
};
const cancelPress = () => {
  clearTimeout(pressTimer);
  if (!press0) return;
  press0 = null;
  pressing.value = false;
  fuse.value = 'idle';
};

watch(
  () => props.disabled,
  d => {
    if (d) {
      cancelPress();
      hide(true);
    }
  }
);
watch(active, (on, _o, onCleanup) => {
  if (!on) return;
  const onOutside = (e: PointerEvent) => {
    if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) hide(false);
  };
  document.addEventListener('pointerdown', onOutside, true);
  onCleanup(() => document.removeEventListener('pointerdown', onOutside, true));
});
onBeforeUnmount(() => {
  clearTimeout(openTimer);
  clearTimeout(pressTimer);
});

const onPointerEnter = (e: PointerEvent) => {
  if (!props.disabled && e.pointerType !== 'touch' && e.buttons === 0) arm();
};
const onPointerLeave = (e: PointerEvent) => {
  if (!props.disabled && e.pointerType !== 'touch') hide(false);
};
const onPointerDown = (e: PointerEvent) => {
  if (props.disabled || !group) return;
  if (e.pointerType === 'mouse') {
    hide(false);
    return;
  }
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  press0 = { x: e.clientX, y: e.clientY, id: e.pointerId };
  pressing.value = true;
  fuse.value = 'arming';
  pressTimer = setTimeout(() => {
    suppressClick = true;
    press0 = null;
    pressing.value = false;
    fuse.value = 'idle';
    group.show(payload(), 'cold');
  }, props.longPress);
};
const onPointerMove = (e: PointerEvent) => {
  const p = press0;
  if (!props.disabled && p && p.id === e.pointerId && Math.hypot(e.clientX - p.x, e.clientY - p.y) > HOLD_SLOP) {
    cancelPress();
  }
};
const onPointerEnd = () => {
  if (!props.disabled) cancelPress();
};
const onContextMenu = (e: MouseEvent) => {
  if (!props.disabled && press0) e.preventDefault();
};
const onClickCapture = (e: MouseEvent) => {
  if (props.disabled || !suppressClick) return;
  suppressClick = false;
  e.preventDefault();
  e.stopPropagation();
};
const onFocusIn = (e: FocusEvent) => {
  if (props.disabled || !group) return;
  if ((e.target as HTMLElement).matches?.(':focus-visible')) group.show(payload(), 'instant');
};
const onFocusOut = () => {
  if (!props.disabled) hide(true);
};
const onKeyDown = (e: KeyboardEvent) => {
  if (!props.disabled && e.key === 'Escape') hide(true);
};

const rootStyle = computed(
  () =>
    ({
      '--wt-surface': props.surfaceColor,
      '--wt-fuse-ms': `${pressing.value ? props.longPress : coldDelay.value}ms`,
      '--wt-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)'
    }) as CSSProperties
);
</script>

<template>
  <WarmTooltipGroup v-if="!group" :delay="delay" :warm-window="warmWindow">
    <WarmTooltip v-bind="$props">
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </WarmTooltip>
  </WarmTooltipGroup>
  <span
    v-else
    ref="triggerRef"
    class="inline-flex relative align-middle [-webkit-touch-callout:none] touch-manipulation data-[pressing]:select-none [-webkit-tap-highlight-color:transparent]"
    :class="className"
    :data-pressing="pressing ? '' : undefined"
    :style="rootStyle"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @contextmenu="onContextMenu"
    @click.capture="onClickCapture"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown="onKeyDown"
  >
    <slot :describedby="active ? group.id : undefined" />
    <span
      v-if="showFuse"
      class="data-[side=top]:-top-1 data-[side=right]:-right-1 data-[side=bottom]:-bottom-1 data-[side=left]:-left-1 absolute inset-x-1 data-[side=left]:inset-x-auto data-[side=left]:inset-y-1 data-[side=right]:inset-x-auto data-[side=right]:inset-y-1 opacity-0 data-[fuse=arming]:opacity-100 rounded-[1px] data-[side=left]:w-[2px] data-[side=right]:w-[2px] h-[2px] data-[side=left]:h-auto data-[side=right]:h-auto origin-left data-[side=left]:origin-top data-[side=right]:origin-top [transition:transform_125ms_var(--wt-ease-out),opacity_125ms_var(--wt-ease-out)] data-[fuse=arming]:[transition:transform_var(--wt-fuse-ms)_linear,opacity_80ms_var(--wt-ease-out)] pointer-events-none [transform:scaleX(0)] [background:var(--wt-surface)] data-[side=left]:[transform:scaleY(0)] data-[side=right]:[transform:scaleY(0)] data-[fuse=arming]:[transform:scaleX(1)] data-[side=left]:data-[fuse=arming]:[transform:scaleY(1)] data-[side=right]:data-[fuse=arming]:[transform:scaleY(1)]"
      :data-side="side"
      :data-fuse="fuse"
      aria-hidden="true"
    />
  </span>
</template>
