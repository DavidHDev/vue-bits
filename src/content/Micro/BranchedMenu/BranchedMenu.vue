<script setup lang="ts">
import {
  CursorPointer01Icon,
  Download04Icon,
  Layers01Icon,
  Notification03Icon,
  PaintBoardIcon,
  Rocket01Icon,
  Settings02Icon,
  TextFontIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, onMounted, onUnmounted, ref, watch, type Component, type CSSProperties } from 'vue';

export interface BranchedMenuChild {
  value: string;
  label: string;
  icon?: IconArray | Component;
}

export interface BranchedMenuItem {
  label: string;
  value?: string;
  children?: BranchedMenuChild[];
}

interface BranchedMenuProps {
  items?: BranchedMenuItem[];
  defaultOpen?: number | number[];
  defaultActive?: string;
  color?: string;
  accentColor?: string;
  lineColor?: string;
  width?: number;
  rowHeight?: number;
  indent?: number;
  trunk?: number;
  radius?: number;
  lineWidth?: number;
  fontSize?: number;
  drawDuration?: number;
  foldDuration?: number;
  className?: string;
}

const DEFAULT_ITEMS: BranchedMenuItem[] = [
  {
    label: 'Getting started',
    children: [
      { value: 'install', label: 'Installation', icon: Download04Icon as IconArray },
      { value: 'quick', label: 'Quick start', icon: Rocket01Icon as IconArray },
      { value: 'config', label: 'Configuration', icon: Settings02Icon as IconArray },
      { value: 'theming', label: 'Theming', icon: PaintBoardIcon as IconArray }
    ]
  },
  {
    label: 'Components',
    children: [
      { value: 'buttons', label: 'Buttons', icon: CursorPointer01Icon as IconArray },
      { value: 'typography', label: 'Typography', icon: TextFontIcon as IconArray },
      { value: 'overlays', label: 'Overlays', icon: Layers01Icon as IconArray },
      { value: 'toasts', label: 'Toasts', icon: Notification03Icon as IconArray }
    ]
  }
];
const PAD = 6;
const MARK = 16;

const toSet = (open: number | number[]) => new Set(Array.isArray(open) ? open : open >= 0 ? [open] : []);

const props = withDefaults(defineProps<BranchedMenuProps>(), {
  items: undefined,
  defaultOpen: 0,
  defaultActive: '',
  color: '#f5f5f5',
  accentColor: '#f5f5f5',
  lineColor: '#3f3f46',
  width: 240,
  rowHeight: 36,
  indent: 40,
  trunk: 14,
  radius: 10,
  lineWidth: 1.5,
  fontSize: 14,
  drawDuration: 400,
  foldDuration: 300,
  className: ''
});

const emit = defineEmits<{
  select: [value: string, item: BranchedMenuChild | BranchedMenuItem];
  toggle: [index: number, open: boolean];
}>();

const menuItems = computed(() => props.items ?? DEFAULT_ITEMS);
const open = ref<Set<number>>(toSet(props.defaultOpen));
const active = ref(
  props.defaultActive ||
    (menuItems.value.find((it, i) => it.children && toSet(props.defaultOpen).has(i))?.children?.[0]?.value ?? '')
);

const navRef = ref<HTMLElement | null>(null);
const markerRef = ref<HTMLSpanElement | null>(null);
const heads: (HTMLButtonElement | null)[] = [];
let resizeObserver: ResizeObserver | null = null;

const activeSection = computed(() =>
  menuItems.value.findIndex(it => it.children?.some(kid => kid.value === active.value))
);
const markerShown = computed(() => activeSection.value >= 0 && open.value.has(activeSection.value));

const place = (glide: boolean) => {
  const m = markerRef.value;
  const el = heads[activeSection.value];
  if (!m) return;
  const on = markerShown.value && el;
  if (!glide) m.style.transition = 'none';
  if (on) m.style.top = `${el.offsetTop + (el.offsetHeight - MARK) / 2}px`;
  m.toggleAttribute('data-on', Boolean(on));
  if (!glide) {
    void m.offsetHeight;
    m.style.transition = '';
  }
};

const bindMarker = () => {
  resizeObserver?.disconnect();
  place(true);
  let first = true;
  resizeObserver = new ResizeObserver(() => {
    if (first) {
      first = false;
      return;
    }
    place(false);
  });
  if (navRef.value) resizeObserver.observe(navRef.value);
};

onMounted(bindMarker);
onUnmounted(() => resizeObserver?.disconnect());
watch(() => [activeSection.value, markerShown.value, menuItems.value, props.fontSize, props.rowHeight], bindMarker, {
  flush: 'post'
});

const select = (value: string, item: BranchedMenuChild | BranchedMenuItem) => {
  active.value = value;
  emit('select', value, item);
};
const toggle = (i: number) => {
  const next = new Set(open.value);
  const isOpen = !next.has(i);
  if (isOpen) next.add(i);
  else next.delete(i);
  open.value = next;
  emit('toggle', i, isOpen);
};

const r = computed(() => Math.min(props.radius, props.rowHeight / 2 - 2));
const endX = computed(() => props.indent - 8);
const rowY = (k: number) => PAD + k * props.rowHeight + props.rowHeight / 2;
const branch = (k: number) =>
  `M ${props.trunk} ${rowY(k) - r.value} A ${r.value} ${r.value} 0 0 0 ${props.trunk + r.value} ${rowY(k)} H ${endX.value}`;
const reach = (k: number) =>
  `M ${props.trunk} 0 V ${rowY(k) - r.value} A ${r.value} ${r.value} 0 0 0 ${props.trunk + r.value} ${rowY(k)} H ${endX.value}`;
const length = (k: number) => rowY(k) - r.value + (Math.PI * r.value) / 2 + (endX.value - props.trunk - r.value);
const trunkPath = (count: number) => `M ${props.trunk} 0 V ${rowY(count - 1) - r.value}`;

const isIconData = (icon: IconArray | Component): icon is IconArray => Array.isArray(icon);

const navStyle = computed(
  () =>
    ({
      '--bm-w': `${props.width}px`,
      '--bm-ink': props.color,
      '--bm-accent': props.accentColor,
      '--bm-line': props.lineColor,
      '--bm-font': `${props.fontSize}px`,
      '--bm-row': `${props.rowHeight}px`,
      '--bm-indent': `${props.indent}px`,
      '--bm-line-w': props.lineWidth,
      '--bm-draw': `${props.drawDuration}ms`,
      '--bm-muted': `color-mix(in srgb, ${props.color} 55%, transparent)`,
      '--bm-fold': `${props.foldDuration}ms`
    }) as CSSProperties
);
</script>

<template>
  <nav
    ref="navRef"
    class="before:top-2 before:bottom-0 before:left-0 before:absolute relative flex flex-col pl-3.5 before:rounded-[1px] w-fit before:w-0.5 max-w-[min(var(--bm-w),100%)] before:content-[''] leading-[1.2] [color:var(--bm-ink)] [font-family:inherit] [font-size:var(--bm-font)] before:[background:linear-gradient(to_bottom,var(--bm-line)_0%,var(--bm-line)_55%,transparent_100%)]"
    :class="className"
    :style="navStyle"
  >
    <span
      ref="markerRef"
      class="-top-px left-0 z-[1] absolute opacity-0 data-[on]:opacity-100 rounded-[1px] w-0.5 h-4 [background:var(--bm-accent)] [transition:top_220ms_cubic-bezier(0.23,1,0.32,1),opacity_150ms_ease] motion-reduce:[transition:opacity_150ms_ease]"
      aria-hidden="true"
    />
    <div
      v-for="(item, i) in menuItems"
      :key="item.value ?? item.label"
      class="group/section flex flex-col"
      :data-open="item.children && open.has(i) ? '' : undefined"
    >
      <button
        :ref="el => (heads[i] = el as HTMLButtonElement | null)"
        type="button"
        class="block bg-transparent m-0 py-[9px] border-0 outline-none font-medium text-left cursor-pointer [color:var(--bm-muted)] [font-family:inherit] [font-size:calc(var(--bm-font)+1px)] [-webkit-tap-highlight-color:transparent] [transition:color_200ms_ease] group-data-[open]/section:[color:var(--bm-ink)] data-[active]:[color:var(--bm-ink)] hover:[color:var(--bm-ink)]"
        :aria-expanded="item.children ? open.has(i) : undefined"
        :aria-current="!item.children && (item.value ?? item.label) === active ? 'true' : undefined"
        :data-active="!item.children && (item.value ?? item.label) === active ? '' : undefined"
        @click="item.children ? toggle(i) : select(item.value ?? item.label, item)"
      >
        {{ item.label }}
      </button>
      <div
        v-if="item.children"
        class="grid motion-reduce:transition-none [grid-template-rows:0fr] group-data-[open]/section:[grid-template-rows:1fr] [transition:grid-template-rows_var(--bm-fold)_cubic-bezier(0.23,1,0.32,1)]"
      >
        <div class="min-h-0 overflow-hidden">
          <div
            class="box-border relative py-1.5"
            :style="{ height: `${PAD * 2 + item.children.length * rowHeight}px` }"
          >
            <svg
              class="top-0 left-0 absolute opacity-0 group-data-[open]/section:opacity-100 overflow-visible pointer-events-none [transition:opacity_200ms_ease] group-data-[open]/section:[transition:opacity_250ms_ease_100ms]"
              :width="indent"
              :height="PAD * 2 + item.children.length * rowHeight"
              aria-hidden="true"
            >
              <path
                class="fill-none [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--bm-line-w)] [stroke:var(--bm-line)]"
                :d="trunkPath(item.children.length)"
              />
              <path
                v-for="(kid, k) in item.children"
                :key="`line-${kid.value}`"
                class="fill-none [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--bm-line-w)] [stroke:var(--bm-line)]"
                :d="branch(k)"
              />
              <path
                v-for="(kid, k) in item.children"
                :key="`reach-${kid.value}`"
                class="fill-none motion-reduce:transition-none [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--bm-line-w)] [stroke:var(--bm-accent)] [transition:stroke-dashoffset_var(--bm-draw)_cubic-bezier(0.23,1,0.32,1)]"
                :d="reach(k)"
                :style="{
                  strokeDasharray: length(k),
                  strokeDashoffset: kid.value === active ? 0 : length(k)
                }"
              />
            </svg>
            <button
              v-for="kid in item.children"
              :key="kid.value"
              type="button"
              class="box-border flex items-center gap-2 bg-transparent m-0 py-0 pr-0 border-0 outline-none w-full data-[active]:font-medium text-left cursor-pointer [height:var(--bm-row)] [padding-left:var(--bm-indent)] [color:var(--bm-muted)] [font-family:inherit] [-webkit-tap-highlight-color:transparent] [transition:color_200ms_ease] hover:[color:var(--bm-ink)] data-[active]:[color:var(--bm-accent)]"
              :aria-current="kid.value === active ? 'true' : undefined"
              :data-active="kid.value === active ? '' : undefined"
              :tabindex="open.has(i) ? 0 : -1"
              @click="select(kid.value, kid)"
            >
              <span v-if="kid.icon" class="inline-flex flex-none" aria-hidden="true">
                <HugeiconsIcon v-if="isIconData(kid.icon)" :icon="kid.icon" :size="16" :stroke-width="1.8" />
                <component :is="kid.icon" v-else />
              </span>
              <span class="whitespace-nowrap">{{ kid.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
