<script setup lang="ts">
import { gsap } from 'gsap';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type CSSProperties,
  type VNode
} from 'vue';

type MenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export type BubbleMenuProps = {
  logo: string | VNode;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
};

const DEFAULT_ITEMS: MenuItem[] = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Documentation',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

const props = withDefaults(defineProps<BubbleMenuProps>(), {
  menuAriaLabel: 'Toggle menu',
  menuBg: '#fff',
  menuContentColor: '#111',
  useFixedPosition: false,
  animationEase: 'back.out(1.5)',
  animationDuration: 0.5,
  staggerDelay: 0.12
});

const isMenuOpen = ref(false);
const showOverlay = ref(false);

const overlayRef = useTemplateRef('overlayRef');
const bubblesRef = ref<HTMLAnchorElement[]>([]);
const labelRefs = ref<HTMLSpanElement[]>([]);

const setBubbleRef = (el: HTMLAnchorElement | null, idx: number) => {
  if (el) {
    bubblesRef.value[idx] = el;
  }
};

const setLabelsRef = (el: HTMLSpanElement | null, idx: number) => {
  if (el) {
    labelRefs.value[idx] = el;
  }
};

const menuItems = computed(() => (props.items?.length ? props.items : DEFAULT_ITEMS));

const containerClassName = computed(() =>
  [
    'bubble-menu',
    props.useFixedPosition ? 'fixed' : 'absolute',
    'left-0 right-0 top-8',
    'flex items-center justify-between',
    'gap-4 px-8',
    'pointer-events-none',
    'z-[1001]',
    props.className
  ]
    .filter(Boolean)
    .join(' ')
);

const handleToggle = () => {
  const nextState = !isMenuOpen.value;
  if (nextState) showOverlay.value = true;
  isMenuOpen.value = nextState;
  props.onMenuClick?.(nextState);
};

watch(
  () => [isMenuOpen.value, showOverlay.value, props.animationEase, props.animationDuration, props.staggerDelay],
  async () => {
    await nextTick();

    const overlay = overlayRef.value;
    const bubbles = bubblesRef.value.filter(Boolean);
    const labels = labelRefs.value.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen.value) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * props.staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: props.animationDuration,
          ease: props.animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: props.animationDuration,
              ease: 'power3.out'
            },
            '-=' + props.animationDuration * 0.9
          );
        }
      });
    } else if (showOverlay.value) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          showOverlay.value = false;
        }
      });
    }
  },
  { deep: true }
);

let cleanupResizeListener: () => void;
const handleResize = () => {
  if (isMenuOpen.value) {
    const bubbles = bubblesRef.value.filter(Boolean);
    const isDesktop = window.innerWidth >= 900;
    bubbles.forEach((bubble, i) => {
      const item = menuItems.value[i];
      if (bubble && item) {
        const rotation = isDesktop ? (item.rotation ?? 0) : 0;
        gsap.set(bubble, { rotation });
      }
    });
  }

  window.addEventListener('resize', handleResize);
  cleanupResizeListener = () => window.removeEventListener('resize', handleResize);
};

onMounted(() => {
  handleResize();
});

onBeforeUnmount(() => {
  cleanupResizeListener?.();
});

watch(
  () => [isMenuOpen.value, menuItems.value],
  () => {
    cleanupResizeListener?.();
    handleResize();
  },
  { deep: true }
);
</script>

<template>
  <nav :class="containerClassName" :style="style" aria-label="Main navigation">
    <div
      :class="[
        'bubble logo-bubble',
        'inline-flex items-center justify-center',
        'rounded-full',
        'bg-white',
        'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
        'pointer-events-auto',
        'h-12 md:h-14',
        'px-4 md:px-8',
        'gap-2',
        'will-change-transform'
      ]"
      aria-label="Logo"
      :style="{
        background: menuBg,
        minHeight: '48px',
        borderRadius: '9999px'
      }"
    >
      <span
        :class="['logo-content', 'inline-flex items-center justify-center', 'w-[120px] h-full']"
        :style="{ '--logo-max-height': '60%', '--logo-max-width': '100%' }"
      >
        <img
          v-if="typeof logo === 'string'"
          :src="logo as string"
          alt="Logo"
          class="block max-w-full max-h-[60%] object-contain bubble-logo"
        />
        <template v-else>
          <component :is="logo" />
        </template>
      </span>
    </div>

    <button
      type="button"
      :class="[
        'bubble toggle-bubble menu-btn',
        isMenuOpen ? 'open' : '',
        'inline-flex flex-col items-center justify-center',
        'rounded-full',
        'bg-white',
        'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
        'pointer-events-auto',
        'w-12 h-12 md:w-14 md:h-14',
        'border-0 cursor-pointer p-0',
        'will-change-transform'
      ]"
      @click="handleToggle"
      :aria-label="menuAriaLabel"
      :aria-pressed="isMenuOpen"
      :style="{ background: menuBg }"
    >
      <span
        class="block mx-auto rounded-[2px] menu-line"
        :style="{
          width: '26px',
          height: '2px',
          background: menuContentColor,
          transform: isMenuOpen ? 'translateY(4px) rotate(45deg)' : 'none'
        }"
      />
      <span
        class="block mx-auto rounded-[2px] menu-line short"
        :style="{
          marginTop: '6px',
          width: '26px',
          height: '2px',
          background: menuContentColor,
          transform: isMenuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none'
        }"
      />
    </button>
  </nav>

  <div
    v-if="showOverlay"
    ref="overlayRef"
    :class="[
      'bubble-menu-items',
      useFixedPosition ? 'fixed' : 'absolute',
      'inset-0',
      'flex items-center justify-center',
      'pointer-events-none',
      'z-[1000]'
    ]"
    :aria-hidden="!isMenuOpen"
  >
    <ul
      :class="[
        'pill-list',
        'list-none m-0 px-6',
        'w-full max-w-[1600px] mx-auto',
        'flex flex-wrap',
        'gap-x-0 gap-y-1',
        'pointer-events-auto'
      ]"
      role="menu"
      aria-label="Menu links"
    >
      <li
        v-for="(item, idx) in menuItems"
        :key="idx"
        role="none"
        :class="['pill-col', 'flex justify-center items-stretch', '[flex:0_0_calc(100%/3)]', 'box-border']"
      >
        <a
          role="menuitem"
          :href="item.href"
          :aria-label="item.ariaLabel || item.label"
          :class="[
            'pill-link',
            'w-full',
            'rounded-[999px]',
            'no-underline',
            'bg-white',
            'text-inherit',
            'shadow-[0_4px_14px_rgba(0,0,0,0.10)]',
            'flex items-center justify-center',
            'relative',
            'transition-[background,color] duration-300 ease-in-out',
            'box-border',
            'whitespace-nowrap overflow-hidden'
          ]"
          :style="{
            '--item-rot': `${item.rotation ?? 0}deg`,
            '--pill-bg': menuBg,
            '--pill-color': menuContentColor,
            '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
            '--hover-color': item.hoverStyles?.textColor || menuContentColor,
            background: 'var(--pill-bg)',
            color: 'var(--pill-color)',
            minHeight: 'var(--pill-min-h, 160px)',
            padding: 'clamp(1.5rem, 3vw, 8rem) 0',
            fontSize: 'clamp(1.5rem, 4vw, 4rem)',
            fontWeight: 400,
            lineHeight: 0,
            willChange: 'transform',
            height: '10px'
          }"
          :ref="el => setBubbleRef(el as HTMLAnchorElement | null, idx)"
        >
          <span
            class="inline-block pill-label"
            :style="{
              willChange: 'transform, opacity',
              height: '1.2em',
              lineHeight: 1.2
            }"
            :ref="el => setLabelsRef(el as HTMLSpanElement | null, idx)"
          >
            {{ item.label }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.bubble-menu .menu-line {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  transform-origin: center;
}
.bubble-menu-items .pill-list .pill-col:nth-child(4):nth-last-child(2) {
  margin-left: calc(100% / 6);
}
.bubble-menu-items .pill-list .pill-col:nth-child(4):last-child {
  margin-left: calc(100% / 3);
}
@media (min-width: 900px) {
  .bubble-menu-items .pill-link {
    transform: rotate(var(--item-rot));
  }
  .bubble-menu-items .pill-link:hover {
    transform: rotate(var(--item-rot)) scale(1.06);
    background: var(--hover-bg) !important;
    color: var(--hover-color) !important;
  }
  .bubble-menu-items .pill-link:active {
    transform: rotate(var(--item-rot)) scale(0.94);
  }
}
@media (max-width: 899px) {
  .bubble-menu-items {
    padding-top: 120px;
    align-items: flex-start;
  }
  .bubble-menu-items .pill-list {
    row-gap: 16px;
  }
  .bubble-menu-items .pill-list .pill-col {
    flex: 0 0 100% !important;
    margin-left: 0 !important;
    overflow: visible;
  }
  .bubble-menu-items .pill-link {
    font-size: clamp(1.2rem, 3vw, 4rem);
    padding: clamp(1rem, 2vw, 2rem) 0;
    min-height: 80px !important;
  }
  .bubble-menu-items .pill-link:hover {
    transform: scale(1.06);
    background: var(--hover-bg);
    color: var(--hover-color);
  }
  .bubble-menu-items .pill-link:active {
    transform: scale(0.94);
  }
}
</style>
