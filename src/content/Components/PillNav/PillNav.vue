<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';

type PillNavItem = {
  label: string;
  href?: string;
  ariaLabel?: string;
};

interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const props = withDefaults(defineProps<PillNavProps>(), {
  logoAlt: 'Logo',
  className: '',
  ease: 'power3.easeOut',
  baseColor: '#fff',
  pillColor: '#060010',
  hoveredPillTextColor: '#060010',
  initialLoadAnimation: true
});

const resolvedPillTextColor = computed(() => props.pillTextColor ?? props.baseColor);

const isMobileMenuOpen = ref(false);

const circleRefs = ref<Array<HTMLSpanElement | null>>([]);
const tlRefs = ref<Array<gsap.core.Timeline | null>>([]);
const activeTweenRefs = ref<Array<gsap.core.Tween | null>>([]);
const logoImgRef = ref<HTMLImageElement | null>(null);
const logoTweenRef = ref<gsap.core.Tween | null>(null);
const hamburgerRef = ref<HTMLButtonElement | null>(null);
const mobileMenuRef = ref<HTMLDivElement | null>(null);
const navItemsRef = ref<HTMLDivElement | null>(null);
const logoRef = ref<HTMLAnchorElement | null>(null);

watch(
  () => props.items,
  items => {
    circleRefs.value = new Array(items.length).fill(null);
    tlRefs.value = new Array(items.length).fill(null);
    activeTweenRefs.value = new Array(items.length).fill(null);
  },
  { immediate: true }
);

const layout = () => {
  circleRefs.value.forEach(circle => {
    if (!circle?.parentElement) return;

    const pill = circle.parentElement as HTMLElement;
    const rect = pill.getBoundingClientRect();
    const { width: w, height: h } = rect;
    const R = ((w * w) / 4 + h * h) / (2 * h);
    const D = Math.ceil(2 * R) + 2;
    const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
    const originY = D - delta;

    circle.style.width = `${D}px`;
    circle.style.height = `${D}px`;
    circle.style.bottom = `-${delta}px`;

    gsap.set(circle, {
      xPercent: -50,
      scale: 0,
      transformOrigin: `50% ${originY}px`
    });

    const label = pill.querySelector<HTMLElement>('.pill-label');
    const white = pill.querySelector<HTMLElement>('.pill-label-hover');

    if (label) gsap.set(label, { y: 0 });
    if (white) gsap.set(white, { y: h + 12, opacity: 0 });

    const index = circleRefs.value.indexOf(circle);
    if (index === -1) return;

    tlRefs.value[index]?.kill();
    const tl = gsap.timeline({ paused: true });

    tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: props.ease, overwrite: 'auto' }, 0);

    if (label) {
      tl.to(label, { y: -(h + 8), duration: 2, ease: props.ease, overwrite: 'auto' }, 0);
    }

    if (white) {
      gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
      tl.to(white, { y: 0, opacity: 1, duration: 2, ease: props.ease, overwrite: 'auto' }, 0);
    }

    tlRefs.value[index] = tl;
  });
};

const runInitialAnimation = () => {
  if (props.initialLoadAnimation) {
    const logo = logoRef.value;
    const navItems = navItemsRef.value;

    if (logo) {
      gsap.set(logo, { scale: 0 });
      gsap.to(logo, { scale: 1, duration: 0.6, ease: props.ease });
    }

    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: 'hidden' });
      gsap.to(navItems, { width: 'auto', duration: 0.6, ease: props.ease });
    }
  }
};

const onResize = () => layout();

onMounted(async () => {
  await nextTick();

  layout();

  window.addEventListener('resize', onResize);

  if (document.fonts?.ready) {
    document.fonts.ready.then(layout).catch(() => {});
  }

  const menu = mobileMenuRef.value;
  if (menu) {
    gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
  }

  runInitialAnimation();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

watch(
  () => [props.items, props.ease, props.initialLoadAnimation] as const,
  async () => {
    await nextTick();
    layout();
    runInitialAnimation();
  },
  { deep: true }
);

const handleEnter = (i: number) => {
  const tl = tlRefs.value[i];
  if (!tl) return;
  activeTweenRefs.value[i]?.kill();
  activeTweenRefs.value[i] = tl.tweenTo(tl.duration(), {
    duration: 0.3,
    ease: props.ease,
    overwrite: 'auto'
  });
};

const handleLeave = (i: number) => {
  const tl = tlRefs.value[i];
  if (!tl) return;
  activeTweenRefs.value[i]?.kill();
  activeTweenRefs.value[i] = tl.tweenTo(0, {
    duration: 0.2,
    ease: props.ease,
    overwrite: 'auto'
  });
};

const handleLogoEnter = () => {
  const img = logoImgRef.value;
  if (!img) return;
  logoTweenRef.value?.kill();
  gsap.set(img, { rotate: 0 });
  logoTweenRef.value = gsap.to(img, {
    rotate: 360,
    duration: 0.2,
    ease: props.ease,
    overwrite: 'auto'
  });
};

const toggleMobileMenu = () => {
  const newState = !isMobileMenuOpen.value;
  isMobileMenuOpen.value = newState;

  const hamburger = hamburgerRef.value;
  const menu = mobileMenuRef.value;

  if (hamburger) {
    const lines = hamburger.querySelectorAll('.hamburger-line');
    if (newState) {
      gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: props.ease });
      gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: props.ease });
    } else {
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: props.ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: props.ease });
    }
  }

  if (menu) {
    if (newState) {
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(
        menu,
        { opacity: 0, y: 10, scaleY: 1 },
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 0.3,
          ease: props.ease,
          transformOrigin: 'top center'
        }
      );
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: 10,
        scaleY: 1,
        duration: 0.2,
        ease: props.ease,
        transformOrigin: 'top center',
        onComplete: () => {
          gsap.set(menu, { visibility: 'hidden' });
        }
      });
    }
  }

  props.onMobileMenuClick?.();
};

const isExternalLink = (href: string) =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('#');

const isRouterLink = (href?: string) => href && !isExternalLink(href);

const cssVars = computed(() => ({
  '--base': props.baseColor,
  '--pill-bg': props.pillColor,
  '--hover-text': props.hoveredPillTextColor,
  '--pill-text': resolvedPillTextColor.value,
  '--nav-h': '42px',
  '--logo': '36px',
  '--pill-pad-x': '18px',
  '--pill-gap': '3px'
}));

const setCircleRef = (el: HTMLSpanElement | null, index: number) => {
  if (circleRefs.value.length > index) {
    circleRefs.value[index] = el;
  }
};
</script>

<template>
  <div class="top-[1em] left-0 md:left-auto z-[99] absolute w-full md:w-auto">
    <nav
      :class="['w-max flex items-center box-border md:w-max md:justify-start justify-between md:px-0 px-4', className]"
      aria-label="Primary"
      :style="cssVars"
    >
      <component
        :is="isRouterLink(items?.[0]?.href) ? 'RouterLink' : 'a'"
        :to="isRouterLink(items?.[0]?.href) ? items[0].href : undefined"
        :href="!isRouterLink(items?.[0]?.href) ? items?.[0]?.href || '#' : undefined"
        aria-label="Home"
        role="menuitem"
        :ref="
          (el: Element | ComponentPublicInstance | null) => {
            logoRef = el as HTMLAnchorElement;
          }
        "
        class="inline-flex justify-center items-center p-2 rounded-full overflow-hidden"
        :style="{
          width: 'var(--nav-h)',
          height: 'var(--nav-h)',
          background: 'var(--base, #000)'
        }"
        @mouseenter="handleLogoEnter"
      >
        <img
          :src="logo"
          :alt="logoAlt"
          :ref="
            el => {
              logoImgRef = el as HTMLImageElement;
            }
          "
          class="block w-full h-full object-cover"
        />
      </component>

      <div
        :ref="
          el => {
            navItemsRef = el as HTMLDivElement;
          }
        "
        class="hidden relative md:flex items-center rounded-full"
        :style="{
          height: 'var(--nav-h)',
          background: 'var(--base, #000)'
        }"
      >
        <ul
          role="menubar"
          class="flex items-stretch m-0 h-full list-none"
          :style="{ gap: 'var(--pill-gap)', padding: '3px' }"
        >
          <li v-for="(item, i) in items" :key="item.href || `item-${i}`" class="flex h-full" role="none">
            <component
              :is="isRouterLink(item.href) ? 'RouterLink' : 'a'"
              :to="isRouterLink(item.href) ? item.href : undefined"
              :href="!isRouterLink(item.href) ? item.href : undefined"
              role="menuitem"
              :aria-label="item.ariaLabel || item.label"
              class="inline-flex box-border relative justify-center items-center rounded-full h-full overflow-hidden font-semibold text-base no-underline uppercase leading-none tracking-[0.2px] whitespace-nowrap cursor-pointer"
              :class="{ 'is-active': activeHref === item.href }"
              :style="{
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)'
              }"
              @mouseenter="handleEnter(i)"
              @mouseleave="handleLeave(i)"
            >
              <span
                class="block bottom-0 left-1/2 absolute rounded-full pointer-events-none hover-circle"
                :style="{
                  background: 'var(--base, #000)',
                  willChange: 'transform'
                }"
                aria-hidden="true"
                :ref="el => setCircleRef(el as HTMLSpanElement, i)"
              />
              <span class="inline-block z-[2] relative leading-none label-stack">
                <span class="inline-block z-[2] relative leading-none pill-label" :style="{ willChange: 'transform' }">
                  {{ item.label }}
                </span>
                <span
                  class="inline-block top-0 left-0 z-[3] absolute pill-label-hover"
                  :style="{
                    color: 'var(--hover-text, #fff)',
                    willChange: 'transform, opacity'
                  }"
                  aria-hidden="true"
                >
                  {{ item.label }}
                </span>
              </span>
            </component>
          </li>
        </ul>
      </div>

      <button
        :ref="
          el => {
            hamburgerRef = el as HTMLButtonElement;
          }
        "
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
        :aria-expanded="isMobileMenuOpen"
        class="md:hidden flex flex-col justify-center items-center gap-1 p-0 border-0 rounded-full cursor-pointer"
        :style="{
          width: 'var(--nav-h)',
          height: 'var(--nav-h)',
          background: 'var(--base, #000)'
        }"
      >
        <span class="rounded w-4 h-0.5 origin-center hamburger-line" :style="{ background: 'var(--pill-bg, #fff)' }" />
        <span class="rounded w-4 h-0.5 origin-center hamburger-line" :style="{ background: 'var(--pill-bg, #fff)' }" />
      </button>
    </nav>

    <div
      :ref="
        el => {
          mobileMenuRef = el as HTMLDivElement;
        }
      "
      class="md:hidden top-[3em] right-4 left-4 z-[998] absolute shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[27px] origin-top"
      :style="{
        ...cssVars,
        background: 'var(--base, #f0f0f0)'
      }"
    >
      <ul class="flex flex-col m-0 list-none" :style="{ gap: '3px', padding: '3px' }">
        <li v-for="item in items" :key="item.href || `mobile-${item.label}`">
          <component
            :is="isRouterLink(item.href) ? 'RouterLink' : 'a'"
            :to="isRouterLink(item.href) ? item.href : undefined"
            :href="!isRouterLink(item.href) ? item.href : undefined"
            class="block px-4 py-3 rounded-[50px] font-medium text-base no-underline transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] mobile-menu-link"
            :class="{ 'is-active': activeHref === item.href }"
            :style="{ background: 'var(--pill-bg, #fff)', color: 'var(--pill-text, #fff)' }"
            @click="isMobileMenuOpen = false"
            @mouseenter="
              (e: MouseEvent) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--base)';
                el.style.color = 'var(--hover-text, #fff)';
              }
            "
            @mouseleave="
              (e: MouseEvent) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--pill-bg, #fff)';
                el.style.color = 'var(--pill-text, #fff)';
              }
            "
          >
            {{ item.label }}
          </component>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.is-active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: var(--base, #000);
  border-radius: 50px;
  z-index: 4;
}
</style>
