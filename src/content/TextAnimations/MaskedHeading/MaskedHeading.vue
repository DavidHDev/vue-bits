<script setup lang="ts">
import { gsap } from 'gsap';
import {
  computed,
  h,
  onBeforeUnmount,
  onMounted,
  useId,
  watch,
  type CSSProperties,
  type ComponentPublicInstance
} from 'vue';

export type Reveal = 'rise' | 'scale' | 'blur' | 'wipe' | 'fade' | 'none';
export type Trigger = 'view' | 'mount' | 'hover';

export interface MaskedHeadingProps {
  text?: string;
  tag?: string;
  mediaType?: 'image' | 'video';
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  hoverZoom?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  tint?: string;
  spotlight?: boolean;
  spotlightRadius?: number;
  outline?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
  reveal?: Reveal;
  duration?: number;
  stagger?: number;
  trigger?: Trigger;
  align?: 'left' | 'center' | 'right';
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  className?: string;
  style?: CSSProperties;
}

interface GlyphBox {
  x: number;
  y: number;
  w: number;
  cx: number;
  cy: number;
  lc: number;
}

interface GlyphState {
  x: number;
  y: number;
  s: number;
}

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);

const SPOT_MASK = `radial-gradient(circle var(--mh-spot-r, 160px) at var(--mh-spot-x, 50%) var(--mh-spot-y, 50%), ${Array.from(
  { length: 9 },
  (_, i) => {
    const t = i / 8;
    const u = clamp((t - 0.1) / 0.9, 0, 1);
    return `rgba(0, 0, 0, ${(u * u * u * (u * (u * 6 - 15) + 10)).toFixed(3)}) ${(t * 100).toFixed(1)}%`;
  }
).join(', ')})`;

const props = withDefaults(defineProps<MaskedHeadingProps>(), {
  text: 'Designed in the details',
  tag: 'h2',
  mediaType: 'image',
  src: '',
  poster: '',
  fillScale: 1.25,
  parallax: 26,
  drift: 18,
  hoverZoom: 0,
  brightness: 1,
  saturation: 1,
  grayscale: false,
  tint: '',
  spotlight: false,
  spotlightRadius: 160,
  outline: false,
  outlineColor: '',
  outlineWidth: 1,
  reveal: 'rise',
  duration: 1.1,
  stagger: 0.09,
  trigger: 'view',
  align: 'center',
  weight: 700,
  tracking: -0.03,
  lineHeight: 1.06,
  textScale: 0.115,
  className: '',
  style: undefined
});

let rootEl: HTMLElement | null = null;
let measureEl: HTMLSpanElement | null = null;
let revealEl: HTMLSpanElement | null = null;
let clipEl: HTMLSpanElement | null = null;
let mediaEl: HTMLSpanElement | null = null;
const wordEls: (HTMLSpanElement | null)[] = [];
const baseEls: (HTMLElement | null)[] = [];
const glyphEls: (SVGTextElement | null)[] = [];
const lineEls: (SVGTextElement | null)[] = [];
let boxes: GlyphBox[] = [];
let states: GlyphState[] = [];
let tween: gsap.core.Animation | null = null;
const off = { x: 0, y: 0, tx: 0, ty: 0, zoom: 0, px: 0, py: 0, sx: 0, sy: 0, lit: false };
const paint = { transform: '', filter: '', spot: '' };
let wake: () => void = () => {};

type RefEl = Element | ComponentPublicInstance | null;
const setRoot = (el: RefEl) => {
  rootEl = el as HTMLElement | null;
};
const setMeasure = (el: RefEl) => {
  measureEl = el as HTMLSpanElement | null;
};
const setReveal = (el: RefEl) => {
  revealEl = el as HTMLSpanElement | null;
};
const setClip = (el: RefEl) => {
  clipEl = el as HTMLSpanElement | null;
};
const setMedia = (el: RefEl) => {
  mediaEl = el as HTMLSpanElement | null;
};
const setWord = (el: RefEl, i: number) => {
  wordEls[i] = el as HTMLSpanElement | null;
};
const setBase = (el: RefEl, i: number) => {
  baseEls[i] = el as HTMLElement | null;
};
const MeasureWord = (p: { word: string; index: number }) =>
  h('span', { class: 'masked-heading__word', ref: (el: RefEl) => setWord(el, p.index) }, [
    p.word,
    h('i', { class: 'masked-heading__baseline', ref: (el: RefEl) => setBase(el, p.index) })
  ]);
const setGlyph = (el: RefEl, i: number) => {
  glyphEls[i] = el as SVGTextElement | null;
};
const setLine = (el: RefEl, i: number) => {
  lineEls[i] = el as SVGTextElement | null;
};

const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
const words = computed(() => String(props.text).split(/\s+/).filter(Boolean));
const glyphs = computed(() => words.value.flatMap((word, w) => Array.from(word).map(char => ({ char, w }))));

const rootStyle = computed<CSSProperties>(() => ({
  textAlign: props.align,
  fontWeight: props.weight,
  letterSpacing: `${props.tracking}em`,
  lineHeight: props.lineHeight,
  ...(props.style ?? {})
}));

const clipStyle = computed(
  () =>
    ({
      clipPath: `url(#${clipId})`,
      '--mh-spot-r': `${Math.max(1, props.spotlightRadius)}px`
    }) as CSSProperties
);

const spotStyle = { maskImage: SPOT_MASK, WebkitMaskImage: SPOT_MASK } as CSSProperties;

const outlineStyle = computed(() => ({
  stroke: props.outlineColor || 'currentColor',
  strokeWidth: Math.max(0, props.outlineWidth)
}));

const place = () => {
  const root = rootEl;
  const media = mediaEl;
  if (!root || !media) return;
  const s = props;
  const scale = s.fillScale * (1 + Math.max(0, off.zoom));
  const maxX = Math.max(0, ((scale - 1) / 2) * root.clientWidth);
  const maxY = Math.max(0, ((scale - 1) / 2) * root.clientHeight);

  const transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
  const filter = `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? ' grayscale(1)' : ''}`;
  if (paint.transform !== transform) {
    paint.transform = transform;
    media.style.transform = transform;
  }
  if (paint.filter !== filter) {
    paint.filter = filter;
    media.style.filter = filter;
  }

  const clip = clipEl;
  if (clip && s.spotlight) {
    const spot = `${off.sx.toFixed(1)}px ${off.sy.toFixed(1)}px`;
    if (paint.spot !== spot) {
      paint.spot = spot;
      clip.style.setProperty('--mh-spot-x', `${off.sx.toFixed(1)}px`);
      clip.style.setProperty('--mh-spot-y', `${off.sy.toFixed(1)}px`);
    }
  }
};

const renderGlyphs = () => {
  for (let i = 0; i < glyphEls.length; i += 1) {
    const glyph = glyphEls[i];
    if (!glyph) continue;
    const box = boxes[i];
    const st = states[i];
    if (!box || !st || (st.x === 0 && st.y === 0 && st.s === 1)) {
      if (glyph.hasAttribute('transform')) glyph.removeAttribute('transform');
      continue;
    }
    const s = Math.max(st.s, 0.0001);
    const tx = box.cx * (1 - s) + st.x * (box.cx - box.lc);
    const ty = box.cy * (1 - s) + st.y;
    glyph.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})`);
  }
};

const sync = () => {
  const root = rootEl;
  const measure = measureEl;
  if (!root || !measure) return;

  root.style.fontSize = `${clamp(root.clientWidth * props.textScale, 20, 200).toFixed(1)}px`;

  const cs = window.getComputedStyle(measure);
  const fontPx = parseFloat(cs.fontSize) || 48;
  const rootRect = root.getBoundingClientRect();
  const ratio = root.offsetWidth ? rootRect.width / root.offsetWidth || 1 : 1;
  const range = document.createRange();
  const next: GlyphBox[] = [];
  let index = 0;

  for (let w = 0; w < wordEls.length; w += 1) {
    const box = wordEls[w];
    const base = baseEls[w];
    const node = box?.firstChild as Text | null | undefined;
    if (!box || !base || !node || node.nodeType !== 3) {
      index += Array.from(box?.textContent ?? '').length;
      continue;
    }
    const boxRect = box.getBoundingClientRect();
    const baseline = base.offsetTop;
    let offset = 0;
    for (const char of Array.from(node.data)) {
      range.setStart(node, offset);
      range.setEnd(node, offset + char.length);
      offset += char.length;
      const r = range.getBoundingClientRect();
      const x = box.offsetLeft + (r.left - boxRect.left) / ratio;
      const width = r.width / ratio;
      next[index] = { x, y: baseline, w: width, cx: x + width / 2, cy: baseline - fontPx * 0.36, lc: 0 };
      index += 1;
    }
  }
  const lines = new Map<number, { left: number; right: number }>();
  for (const box of next) {
    if (!box) continue;
    const line = lines.get(box.y) ?? { left: Infinity, right: -Infinity };
    line.left = Math.min(line.left, box.x);
    line.right = Math.max(line.right, box.x + box.w);
    lines.set(box.y, line);
  }
  for (const box of next) {
    if (!box) continue;
    const line = lines.get(box.y);
    if (line) box.lc = (line.left + line.right) / 2;
  }
  boxes = next;

  const write = (el: SVGTextElement) => {
    el.style.fontFamily = cs.fontFamily;
    el.style.fontSize = cs.fontSize;
    el.style.fontWeight = cs.fontWeight;
    el.style.fontStyle = cs.fontStyle;
    el.style.letterSpacing = cs.letterSpacing;
  };
  for (let i = 0; i < next.length; i += 1) {
    const box = next[i];
    for (const el of [glyphEls[i], lineEls[i]]) {
      if (!el || !box) continue;
      el.setAttribute('x', box.x.toFixed(2));
      el.setAttribute('y', `${box.y}`);
      write(el);
    }
  }
  renderGlyphs();
  place();
};

const setupReveal = () => {
  const root = rootEl;
  const layer = revealEl;
  if (!root || !layer) return undefined;
  const list = glyphs.value;
  const reveal = props.reveal;
  const trigger = props.trigger;
  const duration = props.duration;
  const stagger = props.stagger;
  const local: GlyphState[] = list.map(() => ({ x: 0, y: 0, s: 1 }));
  states = local;
  if (!local.length) return undefined;

  const em = () => parseFloat(window.getComputedStyle(root).fontSize) || 48;
  const wordDelay = (i: number) => list[i].w * stagger;
  const letterDelay = (i: number) => i * stagger * 0.35;

  const clearLayer = () => {
    gsap.set(layer, { opacity: 1, scale: 1 });
    layer.style.clipPath = '';
    layer.style.filter = '';
  };

  const settle = () => {
    local.forEach(st => {
      st.x = 0;
      st.y = 0;
      st.s = 1;
    });
    renderGlyphs();
    clearLayer();
  };

  const rest = () => {
    const size = em();
    if (reveal === 'rise') {
      local.forEach(st => {
        st.y = size * 1.15;
      });
    } else if (reveal === 'scale') {
      local.forEach(st => {
        st.y = size * 0.1;
        st.s = 0;
      });
    } else if (reveal === 'blur') {
      local.forEach(st => {
        st.x = 0.22;
      });
      gsap.set(layer, { opacity: 0 });
      layer.style.filter = `blur(${(size * 0.3).toFixed(2)}px)`;
    } else if (reveal === 'wipe') {
      layer.style.clipPath = 'inset(0% 100% 0% 0%)';
    } else if (reveal === 'fade') {
      gsap.set(layer, { opacity: 0, scale: 1.08 });
    }
    renderGlyphs();
  };

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reveal === 'none' || reduce) {
    settle();
    return undefined;
  }

  const play = () => {
    tween?.kill();
    const size = em();
    if (reveal === 'rise') {
      clearLayer();
      tween = gsap.fromTo(
        local,
        { x: 0, y: size * 1.15, s: 1 },
        { y: 0, duration, stagger: wordDelay, ease: 'power4.out', overwrite: 'auto', onUpdate: renderGlyphs }
      );
      renderGlyphs();
    } else if (reveal === 'scale') {
      clearLayer();
      tween = gsap.fromTo(
        local,
        { x: 0, y: size * 0.1, s: 0 },
        { y: 0, s: 1, duration, stagger: letterDelay, ease: 'expo.out', overwrite: 'auto', onUpdate: renderGlyphs }
      );
      renderGlyphs();
    } else if (reveal === 'blur') {
      const focus = { blur: size * 0.3, opacity: 0 };
      gsap.set(layer, { scale: 1, opacity: 0 });
      layer.style.clipPath = '';
      layer.style.filter = `blur(${focus.blur.toFixed(2)}px)`;
      const timeline = gsap.timeline({ onUpdate: renderGlyphs });
      timeline.fromTo(local, { x: 0.22, y: 0, s: 1 }, { x: 0, duration: duration * 1.2, ease: 'expo.out' }, 0);
      timeline.to(
        focus,
        {
          blur: 0,
          opacity: 1,
          duration: duration * 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            layer.style.filter = focus.blur > 0.05 ? `blur(${focus.blur.toFixed(2)}px)` : '';
            layer.style.opacity = focus.opacity.toFixed(3);
          }
        },
        0
      );
      tween = timeline;
      renderGlyphs();
    } else if (reveal === 'wipe') {
      settle();
      layer.style.clipPath = 'inset(0% 100% 0% 0%)';
      const state = { p: 100 };
      tween = gsap.to(state, {
        p: 0,
        duration,
        ease: 'power3.inOut',
        overwrite: 'auto',
        onUpdate: () => {
          layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;
        }
      });
    } else {
      settle();
      tween = gsap.fromTo(
        layer,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' }
      );
    }
  };

  if (trigger === 'hover') {
    settle();
    root.addEventListener('pointerenter', play);
    return () => {
      root.removeEventListener('pointerenter', play);
      tween?.kill();
    };
  }

  if (trigger === 'view') {
    settle();
    rest();
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }

  play();
  return () => tween?.kill();
};

const startLoop = () => {
  const root = rootEl;
  if (!root) return undefined;

  let alive = true;
  let needsSync = false;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let visible = true;
  let hovering = false;
  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  const frame = (now: number) => {
    raf = 0;
    if (needsSync) {
      needsSync = false;
      sync();
    }
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    const s = props;
    const still = !!motionQuery?.matches;

    if (still) {
      off.x = 0;
      off.y = 0;
      off.zoom = 0;
    } else {
      clock += dt;
      const dx = Math.sin(clock * 0.21) * s.drift;
      const dy = Math.cos(clock * 0.17) * s.drift * 0.6;
      const ease = 1 - Math.exp(-dt / 0.18);
      off.x += (off.tx + dx - off.x) * ease;
      off.y += (off.ty + dy - off.y) * ease;
      off.zoom += ((hovering ? s.hoverZoom : 0) - off.zoom) * (1 - Math.exp(-dt / 0.35));
    }

    if (s.spotlight) {
      const w = root.clientWidth;
      const h = root.clientHeight;
      let gx = w / 2;
      let gy = h / 2;
      if (hovering) {
        gx = off.px;
        gy = off.py;
      } else if (!still) {
        gx = w * (0.5 + 0.36 * Math.sin(clock * 0.37));
        gy = h * (0.5 + 0.22 * Math.sin(clock * 0.61 + 0.9));
      }
      if (!off.lit || still) {
        off.sx = gx;
        off.sy = gy;
        off.lit = true;
      } else {
        const follow = 1 - Math.exp(-dt / (hovering ? 0.12 : 0.6));
        off.sx += (gx - off.sx) * follow;
        off.sy += (gy - off.sy) * follow;
      }
    } else {
      off.lit = false;
    }

    place();
    if (visible && !still && alive) raf = requestAnimationFrame(frame);
  };

  const wakeLoop = () => {
    if (raf || !alive) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  wake = wakeLoop;

  const ro = new ResizeObserver(() => {
    needsSync = true;
    wakeLoop();
  });
  ro.observe(root);
  if (document.fonts?.ready) document.fonts.ready.then(() => alive && sync()).catch(() => {});

  const onMove = (e: PointerEvent) => {
    const s = props;
    const r = root.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
    const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;
    off.tx = clamp(nx, -1, 1) * -Math.max(0, s.parallax);
    off.ty = clamp(ny, -1, 1) * -Math.max(0, s.parallax);
    off.px = ((e.clientX - r.left) / (r.width || 1)) * root.clientWidth;
    off.py = ((e.clientY - r.top) / (r.height || 1)) * root.clientHeight;
    if (s.spotlight) wakeLoop();
  };

  const onEnter = (e: PointerEvent) => {
    hovering = e.pointerType !== 'touch';
    onMove(e);
    wakeLoop();
  };

  const onLeave = () => {
    hovering = false;
    off.tx = 0;
    off.ty = 0;
    wakeLoop();
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wakeLoop();
  });
  io.observe(root);

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerenter', onEnter);
  root.addEventListener('pointerleave', onLeave);
  wakeLoop();

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    raf = 0;
    wake = () => {};
    ro.disconnect();
    io.disconnect();
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerenter', onEnter);
    root.removeEventListener('pointerleave', onLeave);
  };
};

const pauseForReducedMotion = () => {
  const video = mediaEl?.querySelector('video');
  if (video && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) video.pause();
};

let stopReveal: (() => void) | undefined;
let stopLoop: (() => void) | undefined;
let isMounted = false;

onMounted(() => {
  isMounted = true;
  sync();
  stopReveal = setupReveal();
  stopLoop = startLoop();
  pauseForReducedMotion();
});

watch(
  () => [
    words.value,
    props.tag,
    props.align,
    props.weight,
    props.tracking,
    props.lineHeight,
    props.textScale,
    props.outline
  ],
  () => {
    if (isMounted) sync();
  },
  { flush: 'post' }
);

watch(
  () => [props.reveal, props.trigger, props.duration, props.stagger, glyphs.value],
  () => {
    if (!isMounted) return;
    stopReveal?.();
    stopReveal = setupReveal();
  },
  { flush: 'post' }
);

watch(
  () => [props.mediaType, props.src],
  () => {
    if (isMounted) pauseForReducedMotion();
  },
  { flush: 'post' }
);

watch(
  () => ({ ...props }),
  () => wake(),
  { flush: 'post' }
);

onBeforeUnmount(() => {
  isMounted = false;
  stopReveal?.();
  stopReveal = undefined;
  stopLoop?.();
  stopLoop = undefined;
});
</script>

<template>
  <component :is="tag" :ref="setRoot" :class="`masked-heading ${className}`.trim()" :style="rootStyle">
    <span :ref="setMeasure" class="masked-heading__measure">
      <MeasureWord v-for="(word, i) in words" :key="`${word}-${i}`" :word="word" :index="i" />
    </span>

    <svg class="masked-heading__defs" aria-hidden="true" focusable="false">
      <defs>
        <clipPath :id="clipId" clipPathUnits="userSpaceOnUse">
          <text v-for="(glyph, i) in glyphs" :key="i" :ref="el => setGlyph(el, i)">{{ glyph.char }}</text>
        </clipPath>
      </defs>
    </svg>

    <span :ref="setReveal" class="masked-heading__reveal">
      <span :ref="setClip" class="masked-heading__clip" :style="clipStyle">
        <span :ref="setMedia" class="masked-heading__media">
          <video
            v-if="mediaType === 'video'"
            class="masked-heading__source"
            :src="src || undefined"
            :poster="poster || undefined"
            autoplay
            muted
            loop
            playsinline
          />
          <img v-else class="masked-heading__source" :src="src || undefined" alt="" draggable="false" />
        </span>
        <span v-if="tint" class="masked-heading__tint" :style="{ background: tint }" />
        <template v-if="spotlight">
          <span class="masked-heading__spot masked-heading__spot--tone" :style="spotStyle" />
          <span class="masked-heading__spot masked-heading__spot--shade" :style="spotStyle" />
        </template>
      </span>
    </span>

    <svg v-if="outline" class="masked-heading__outline" aria-hidden="true" focusable="false" :style="outlineStyle">
      <text v-for="(glyph, i) in glyphs" :key="i" :ref="el => setLine(el, i)">{{ glyph.char }}</text>
    </svg>
  </component>
</template>

<style>
.masked-heading {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  text-wrap: balance;
  -webkit-font-smoothing: antialiased;
}

.masked-heading__measure {
  color: transparent;
}

.masked-heading__word {
  display: inline-block;
  white-space: pre;
}

.masked-heading__word:not(:last-child)::after {
  content: ' ';
}

.masked-heading__baseline {
  display: inline-block;
  width: 0;
  height: 0;
}

.masked-heading__defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.masked-heading__reveal {
  position: absolute;
  inset: 0;
  display: block;
  pointer-events: none;
}

.masked-heading__clip {
  position: absolute;
  inset: 0;
  display: block;
}

.masked-heading__media {
  position: absolute;
  inset: 0;
  display: block;
  background: color-mix(in srgb, currentColor 10%, transparent);
  will-change: transform, filter;
}

.masked-heading__tint {
  position: absolute;
  inset: 0;
  display: block;
  mix-blend-mode: color;
  pointer-events: none;
}

.masked-heading__spot {
  position: absolute;
  inset: 0;
  display: block;
  pointer-events: none;
}

.masked-heading__spot--tone {
  background: #808080;
  mix-blend-mode: saturation;
}

.masked-heading__spot--shade {
  background: #000;
  opacity: 0.55;
}

.masked-heading__outline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  fill: none;
  stroke-linejoin: round;
}

.masked-heading__source {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
