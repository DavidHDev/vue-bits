<template>
  <div class="w-full h-full sm-scope">
    <div
      :class="(className ? className + ' ' : '') + 'staggered-menu-wrapper relative w-full h-full z-40'"
      :style="accentColor ? { '--sm-accent': accentColor } : undefined"
      :data-position="position"
      :data-open="open || undefined"
    >
      <div
        ref="preLayersRef"
        class="top-0 right-0 bottom-0 z-[5] absolute pointer-events-none sm-prelayers"
        aria-hidden="true"
      >
        <div
          v-for="(color, index) in processedColors"
          :key="index"
          class="top-0 right-0 absolute w-full h-full translate-x-0 sm-prelayer"
          :style="{ background: color }"
        />
      </div>

      <header
        class="top-0 left-0 z-20 absolute flex justify-between items-center bg-transparent p-[2em] w-full pointer-events-none staggered-menu-header"
        aria-label="Main navigation header"
      >
        <div class="flex items-center pointer-events-auto select-none sm-logo" aria-label="Logo">
          <img
            :src="logoUrl || '/src/assets/logos/reactbits-gh-white.svg'"
            alt="Logo"
            class="block w-auto h-8 object-contain sm-logo-img"
            :draggable="false"
            width="110"
            height="24"
          />
        </div>

        <button
          ref="toggleBtnRef"
          class="inline-flex relative items-center gap-[0.3rem] bg-transparent border-0 overflow-visible font-medium text-[#e9e9ef] leading-none cursor-pointer pointer-events-auto sm-toggle"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          :aria-expanded="open"
          aria-controls="staggered-menu-panel"
          @click="toggleMenu"
          type="button"
        >
          <span
            ref="textWrapRef"
            class="inline-block relative w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)] h-[1em] overflow-hidden whitespace-nowrap sm-toggle-textWrap"
            aria-hidden="true"
          >
            <span ref="textInnerRef" class="flex flex-col leading-none sm-toggle-textInner">
              <span v-for="(line, index) in textLines" :key="index" class="block h-[1em] leading-none sm-toggle-line">
                {{ line }}
              </span>
            </span>
          </span>

          <span
            ref="iconRef"
            class="inline-flex relative justify-center items-center w-[14px] h-[14px] sm-icon shrink-0 [will-change:transform]"
            aria-hidden="true"
          >
            <span
              ref="plusHRef"
              class="top-1/2 left-1/2 absolute bg-current rounded-[2px] w-full h-[2px] -translate-x-1/2 -translate-y-1/2 sm-icon-line [will-change:transform]"
            />
            <span
              ref="plusVRef"
              class="top-1/2 left-1/2 absolute bg-current rounded-[2px] w-full h-[2px] -translate-x-1/2 -translate-y-1/2 sm-icon-line sm-icon-line-v [will-change:transform]"
            />
          </span>
        </button>
      </header>

      <aside
        id="staggered-menu-panel"
        ref="panelRef"
        class="top-0 right-0 z-10 absolute flex flex-col bg-white backdrop-blur-[12px] p-[6em_2em_2em_2em] h-full overflow-y-auto staggered-menu-panel"
        style="webkit-backdrop-filter: blur(12px)"
        :aria-hidden="!open"
      >
        <div class="flex flex-col flex-1 gap-5 sm-panel-inner">
          <ul
            class="flex flex-col gap-2 m-0 p-0 list-none sm-panel-list"
            role="list"
            :data-numbering="displayItemNumbering || undefined"
          >
            <li
              v-if="items && items.length"
              v-for="(item, idx) in items"
              :key="item.label + idx"
              class="relative overflow-hidden leading-none sm-panel-itemWrap"
            >
              <a
                class="inline-block relative pr-[1.4em] font-semibold text-[4rem] text-black no-underline uppercase leading-none tracking-[-2px] transition-[background,color] duration-150 ease-linear cursor-pointer sm-panel-item"
                :href="item.link"
                :aria-label="item.ariaLabel"
                :data-index="idx + 1"
              >
                <span class="inline-block will-change-transform sm-panel-itemLabel [transform-origin:50%_100%]">
                  {{ item.label }}
                </span>
              </a>
            </li>
            <li v-else class="relative overflow-hidden leading-none sm-panel-itemWrap" aria-hidden="true">
              <span
                class="inline-block relative pr-[1.4em] font-semibold text-[4rem] text-black no-underline uppercase leading-none tracking-[-2px] transition-[background,color] duration-150 ease-linear cursor-pointer sm-panel-item"
              >
                <span class="inline-block will-change-transform sm-panel-itemLabel [transform-origin:50%_100%]">
                  No items
                </span>
              </span>
            </li>
          </ul>

          <div
            v-if="displaySocials && socialItems && socialItems.length > 0"
            class="flex flex-col gap-3 mt-auto pt-8 sm-socials"
            aria-label="Social links"
          >
            <h3 class="m-0 font-medium text-base sm-socials-title [color:var(--sm-accent,#ff0000)]">Socials</h3>
            <ul class="flex flex-row flex-wrap items-center gap-4 m-0 p-0 list-none sm-socials-list" role="list">
              <li v-for="(social, i) in socialItems" :key="social.label + i" class="sm-socials-item">
                <a
                  :href="social.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block relative py-[2px] font-medium text-[#111] text-[1.2rem] no-underline transition-[color,opacity] duration-300 ease-linear sm-socials-link"
                >
                  {{ social.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}
export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}
export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

const props = withDefaults(defineProps<StaggeredMenuProps>(), {
  position: 'right',
  colors: () => ['#9EF2B2', '#27FF64'],
  items: () => [],
  socialItems: () => [],
  displaySocials: true,
  displayItemNumbering: true,
  logoUrl: '/src/assets/logos/vuebits-gh-white.svg',
  menuButtonColor: '#fff',
  openMenuButtonColor: '#fff',
  changeMenuColorOnOpen: true,
  accentColor: '#27FF64'
});

const open = ref(false);
const openRef = ref(false);

const panelRef = useTemplateRef('panelRef');
const preLayersRef = useTemplateRef('preLayersRef');
const preLayerElsRef = ref<HTMLElement[]>([]);

const plusHRef = useTemplateRef('plusHRef');
const plusVRef = useTemplateRef('plusVRef');
const iconRef = useTemplateRef('iconRef');

const textInnerRef = useTemplateRef('textInnerRef');
const textWrapRef = useTemplateRef('textWrapRef');
const textLines = ref<string[]>(['Menu', 'Close']);

const openTlRef = ref<gsap.core.Timeline | null>(null);
const closeTweenRef = ref<gsap.core.Tween | null>(null);
const spinTweenRef = ref<gsap.core.Timeline | null>(null);
const textCycleAnimRef = ref<gsap.core.Tween | null>(null);
const colorTweenRef = ref<gsap.core.Tween | null>(null);

const toggleBtnRef = useTemplateRef('toggleBtnRef');
const busyRef = ref(false);

const itemEntranceTweenRef = ref<gsap.core.Tween | null>(null);

const processedColors = computed(() => {
  const raw = props.colors && props.colors.length ? props.colors.slice(0, 4) : ['#20251F', '#353F37'];
  const arr = [...raw];
  if (arr.length >= 3) {
    const mid = Math.floor(arr.length / 2);
    arr.splice(mid, 1);
  }
  return arr;
});

let gsapContext: gsap.Context | null = null;

const initializeGSAP = () => {
  gsapContext = gsap.context(() => {
    const panel = panelRef.value;
    const preContainer = preLayersRef.value;
    const plusH = plusHRef.value;
    const plusV = plusVRef.value;
    const icon = iconRef.value;
    const textInner = textInnerRef.value;

    if (!panel || !plusH || !plusV || !icon || !textInner) return;

    let preLayers: HTMLElement[] = [];
    if (preContainer) {
      preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
    }
    preLayerElsRef.value = preLayers;

    const offscreen = props.position === 'left' ? -100 : 100;
    gsap.set([panel, ...preLayers], { xPercent: offscreen });

    gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
    gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
    gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

    gsap.set(textInner, { yPercent: 0 });

    if (toggleBtnRef.value) {
      gsap.set(toggleBtnRef.value, { color: props.menuButtonColor });
    }
  });
};

const buildOpenTimeline = (): gsap.core.Timeline | null => {
  const panel = panelRef.value;
  const layers = preLayerElsRef.value;
  if (!panel) return null;

  openTlRef.value?.kill();
  if (closeTweenRef.value) {
    closeTweenRef.value.kill();
    closeTweenRef.value = null;
  }
  itemEntranceTweenRef.value?.kill();

  const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
  const numberEls = Array.from(
    panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
  ) as HTMLElement[];
  const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
  const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

  const layerStates = layers.map((el: HTMLElement) => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
  const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

  if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
  if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as keyof Record<string, number>]: 0 });
  if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
  if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

  const tl = gsap.timeline({ paused: true });

  layerStates.forEach((ls: { el: HTMLElement; start: number }, i: number) => {
    tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
  });

  const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
  const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
  const panelDuration = 0.65;

  tl.fromTo(
    panel,
    { xPercent: panelStart },
    { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
    panelInsertTime
  );

  if (itemEls.length) {
    const itemsStartRatio = 0.15;
    const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

    tl.to(
      itemEls,
      { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
      itemsStart
    );

    if (numberEls.length) {
      tl.to(
        numberEls,
        {
          duration: 0.6,
          ease: 'power2.out',
          ['--sm-num-opacity' as keyof Record<string, number>]: 1,
          stagger: { each: 0.08, from: 'start' }
        },
        itemsStart + 0.1
      );
    }
  }

  if (socialTitle || socialLinks.length) {
    const socialsStart = panelInsertTime + panelDuration * 0.4;

    if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
    if (socialLinks.length) {
      tl.to(
        socialLinks,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => {
            gsap.set(socialLinks, { clearProps: 'opacity' });
          }
        },
        socialsStart + 0.04
      );
    }
  }

  openTlRef.value = tl;
  return tl;
};

const playOpen = () => {
  if (busyRef.value) return;
  busyRef.value = true;
  const tl = buildOpenTimeline();
  if (tl) {
    tl.eventCallback('onComplete', () => {
      busyRef.value = false;
    });
    tl.play(0);
  } else {
    busyRef.value = false;
  }
};

const playClose = () => {
  openTlRef.value?.kill();
  openTlRef.value = null;
  itemEntranceTweenRef.value?.kill();

  const panel = panelRef.value;
  const layers = preLayerElsRef.value;
  if (!panel) return;

  const all: HTMLElement[] = [...layers, panel];
  closeTweenRef.value?.kill();

  const offscreen = props.position === 'left' ? -100 : 100;

  closeTweenRef.value = gsap.to(all, {
    xPercent: offscreen,
    duration: 0.32,
    ease: 'power3.in',
    overwrite: 'auto',
    onComplete: () => {
      const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
      if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

      const numberEls = Array.from(
        panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
      ) as HTMLElement[];
      if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as keyof Record<string, number>]: 0 });

      const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
      const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
      if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
      if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

      busyRef.value = false;
    }
  });
};

const animateIcon = (opening: boolean) => {
  const icon = iconRef.value;
  const h = plusHRef.value;
  const v = plusVRef.value;
  if (!icon || !h || !v) return;

  spinTweenRef.value?.kill();

  if (opening) {
    gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
    spinTweenRef.value = gsap
      .timeline({ defaults: { ease: 'power4.out' } })
      .to(h, { rotate: 45, duration: 0.5 }, 0)
      .to(v, { rotate: -45, duration: 0.5 }, 0);
  } else {
    spinTweenRef.value = gsap
      .timeline({ defaults: { ease: 'power3.inOut' } })
      .to(h, { rotate: 0, duration: 0.35 }, 0)
      .to(v, { rotate: 90, duration: 0.35 }, 0)
      .to(icon, { rotate: 0, duration: 0.001 }, 0);
  }
};

const animateColor = (opening: boolean) => {
  const btn = toggleBtnRef.value;
  if (!btn) return;
  colorTweenRef.value?.kill();
  if (props.changeMenuColorOnOpen) {
    const targetColor = opening ? props.openMenuButtonColor : props.menuButtonColor;
    colorTweenRef.value = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
  } else {
    gsap.set(btn, { color: props.menuButtonColor });
  }
};

const animateText = (opening: boolean) => {
  const inner = textInnerRef.value;
  if (!inner) return;

  textCycleAnimRef.value?.kill();

  const valueLabel = opening ? 'Menu' : 'Close';
  const targetLabel = opening ? 'Close' : 'Menu';
  const cycles = 3;

  const seq: string[] = [valueLabel];
  let last = valueLabel;
  for (let i = 0; i < cycles; i++) {
    last = last === 'Menu' ? 'Close' : 'Menu';
    seq.push(last);
  }
  if (last !== targetLabel) seq.push(targetLabel);
  seq.push(targetLabel);

  textLines.value = seq;
  gsap.set(inner, { yPercent: 0 });

  const lineCount = seq.length;
  const finalShift = ((lineCount - 1) / lineCount) * 100;

  textCycleAnimRef.value = gsap.to(inner, {
    yPercent: -finalShift,
    duration: 0.5 + lineCount * 0.07,
    ease: 'power4.out'
  });
};

const toggleMenu = () => {
  const target = !openRef.value;
  openRef.value = target;
  open.value = target;

  if (target) {
    props.onMenuOpen?.();
    playOpen();
  } else {
    props.onMenuClose?.();
    playClose();
  }

  animateIcon(target);
  animateColor(target);
  animateText(target);
};

watch(
  () => [props.changeMenuColorOnOpen, props.menuButtonColor, props.openMenuButtonColor],
  () => {
    if (toggleBtnRef.value) {
      if (props.changeMenuColorOnOpen) {
        const targetColor = openRef.value ? props.openMenuButtonColor : props.menuButtonColor;
        gsap.set(toggleBtnRef.value, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.value, { color: props.menuButtonColor });
      }
    }
  }
);

watch(
  () => [props.menuButtonColor, props.position],
  () => {
    nextTick(() => {
      if (gsapContext) {
        gsapContext.revert();
      }
      initializeGSAP();
    });
  }
);

onMounted(() => {
  nextTick(() => {
    initializeGSAP();
  });
});

onBeforeUnmount(() => {
  openTlRef.value?.kill();
  closeTweenRef.value?.kill();
  spinTweenRef.value?.kill();
  textCycleAnimRef.value?.kill();
  colorTweenRef.value?.kill();
  itemEntranceTweenRef.value?.kill();

  if (gsapContext) {
    gsapContext.revert();
  }
});
</script>

<style scoped>
.sm-scope .staggered-menu-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 40;
}

.sm-scope .staggered-menu-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2em;
  background: transparent;
  pointer-events: none;
  z-index: 20;
}

.sm-scope .staggered-menu-header > * {
  pointer-events: auto;
}

.sm-scope .sm-logo {
  display: flex;
  align-items: center;
  user-select: none;
}

.sm-scope .sm-logo-img {
  display: block;
  height: 32px;
  width: auto;
  object-fit: contain;
}

.sm-scope .sm-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #e9e9ef;
  font-weight: 500;
  line-height: 1;
  overflow: visible;
}

.sm-scope .sm-toggle:focus-visible {
  outline: 2px solid #ffffffaa;
  outline-offset: 4px;
  border-radius: 4px;
}

.sm-scope .sm-line:last-of-type {
  margin-top: 6px;
}

.sm-scope .sm-toggle-textWrap {
  position: relative;
  margin-right: 0.5em;
  display: inline-block;
  height: 1em;
  overflow: hidden;
  white-space: nowrap;
  width: var(--sm-toggle-width, auto);
  min-width: var(--sm-toggle-width, auto);
}

.sm-scope .sm-toggle-textInner {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.sm-scope .sm-toggle-line {
  display: block;
  height: 1em;
  line-height: 1;
}

.sm-scope .sm-icon {
  position: relative;
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.sm-scope .sm-panel-itemWrap {
  position: relative;
  overflow: hidden;
  line-height: 1;
}

.sm-scope .sm-icon-line {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.sm-scope .sm-line {
  display: none !important;
}

.sm-scope .staggered-menu-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(260px, 38vw, 420px);
  height: 100%;
  background: white;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  padding: 6em 2em 2em 2em;
  overflow-y: auto;
  z-index: 10;
}

.sm-scope [data-position='left'] .staggered-menu-panel {
  right: auto;
  left: 0;
}

.sm-scope .sm-prelayers {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: clamp(260px, 38vw, 420px);
  pointer-events: none;
  z-index: 5;
}

.sm-scope [data-position='left'] .sm-prelayers {
  right: auto;
  left: 0;
}

.sm-scope .sm-prelayer {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  transform: translateX(0);
}

.sm-scope .sm-panel-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sm-scope .sm-socials {
  margin-top: auto;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sm-scope .sm-socials-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--sm-accent, #ff0000);
}

.sm-scope .sm-socials-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.sm-scope .sm-socials-list .sm-socials-link {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) {
  opacity: 0.35;
}

.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) {
  opacity: 0.35;
}

.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible {
  opacity: 1;
}

.sm-scope .sm-socials-link:focus-visible {
  outline: 2px solid var(--sm-accent, #ff0000);
  outline-offset: 3px;
}

.sm-scope .sm-socials-link {
  font-size: 1.2rem;
  font-weight: 500;
  color: #111;
  text-decoration: none;
  position: relative;
  padding: 2px 0;
  display: inline-block;
  transition:
    color 0.3s ease,
    opacity 0.3s ease;
}

.sm-scope .sm-socials-link:hover {
  color: var(--sm-accent, #ff0000);
}

.sm-scope .sm-panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
}

.sm-scope .sm-panel-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sm-scope .sm-panel-item {
  position: relative;
  color: #000;
  font-weight: 600;
  font-size: 4rem;
  cursor: pointer;
  line-height: 1;
  letter-spacing: -2px;
  text-transform: uppercase;
  transition:
    background 0.25s,
    color 0.25s;
  display: inline-block;
  text-decoration: none;
  padding-right: 1.4em;
}

.sm-scope .sm-panel-itemLabel {
  display: inline-block;
  will-change: transform;
  transform-origin: 50% 100%;
}

.sm-scope .sm-panel-item:hover {
  color: var(--sm-accent, #ff0000);
}

.sm-scope .sm-panel-list[data-numbering] {
  counter-reset: smItem;
}

.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
  counter-increment: smItem;
  content: counter(smItem, decimal-leading-zero);
  position: absolute;
  top: 0.1em;
  right: 3.2em;
  font-size: 18px;
  font-weight: 400;
  color: var(--sm-accent, #ff0000);
  letter-spacing: 0;
  pointer-events: none;
  user-select: none;
  opacity: var(--sm-num-opacity, 0);
}

@media (max-width: 1024px) {
  .sm-scope .staggered-menu-panel {
    width: 100%;
    left: 0;
    right: 0;
  }
  .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img {
    filter: invert(100%);
  }
}

@media (max-width: 640px) {
  .sm-scope .staggered-menu-panel {
    width: 100%;
    left: 0;
    right: 0;
  }
  .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img {
    filter: invert(100%);
  }
}
</style>
