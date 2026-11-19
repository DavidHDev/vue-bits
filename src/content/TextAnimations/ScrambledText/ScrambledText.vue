<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useSlots,
  watch,
  type CSSProperties,
  type VNode
} from 'vue';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

type ScrambleEffect = 'scramble' | 'lift' | 'blur' | 'magnify';

interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  scrambleColor?: string;
  effect?: ScrambleEffect;
  strength?: number;
  trail?: number;
  clickBurst?: boolean;
  intro?: boolean;
  fontFamily?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

interface CharPoint {
  x: number;
  y: number;
  energy: number;
  dx: number;
  dy: number;
  shown: boolean;
}

interface Wave {
  x: number;
  y: number;
  age: number;
  r: number;
  fade: number;
  reach: number;
  life: number;
  hit: Uint8Array;
}

const PHYSICAL: Record<string, boolean> = { lift: true, blur: true, magnify: true };

const falloff = (distance: number, radius: number): number => {
  if (distance >= radius) return 0;
  const f = 1 - (distance / radius) ** 2;
  return f * f;
};

const props = withDefaults(defineProps<ScrambledTextProps>(), {
  radius: 100,
  duration: 1.2,
  speed: 0.5,
  scrambleChars: '.:',
  scrambleColor: '',
  effect: 'scramble',
  strength: 1,
  trail: 0.6,
  clickBurst: true,
  intro: true,
  fontFamily: '',
  color: '',
  className: '',
  style: () => ({})
});

const slots = useSlots();
const rootRef = ref<HTMLDivElement | null>(null);
const textRef = ref<HTMLParagraphElement | null>(null);

const textOf = (nodes: VNode[] | undefined): string =>
  (nodes ?? [])
    .map(node => {
      if (typeof node.children === 'string') return node.children;
      if (Array.isArray(node.children)) return textOf(node.children as VNode[]);
      return '';
    })
    .join('');

const slotText = () => textOf(slots.default?.());

const rootStyle = computed<CSSProperties>(() => ({
  ...props.style,
  ...(props.color ? { color: props.color } : null),
  ...(props.fontFamily ? { fontFamily: props.fontFamily } : null)
}));

const fontsReady = ref(typeof document === 'undefined' || !document.fonts || document.fonts.status === 'loaded');

let resetEffect: () => void = () => {};
let teardown: (() => void) | null = null;
let setupEl: HTMLParagraphElement | null = null;
let alive = true;

const setup = () => {
  const root = rootRef.value;
  const textEl = textRef.value;
  if (!root || !textEl || !fontsReady.value) return;
  setupEl = textEl;

  const split = SplitText.create(textEl, { type: 'chars', smartWrap: true, aria: 'none' });
  const chars = split.chars as HTMLElement[];
  const originals = chars.map(char => char.textContent ?? '');
  const glyphs = chars.map((char, i) => {
    const sizer = document.createElement('span');
    const glyph = document.createElement('span');
    sizer.textContent = originals[i];
    sizer.style.visibility = 'hidden';
    glyph.textContent = originals[i];
    glyph.style.cssText = 'position:absolute;top:0;left:50%;transform:translateX(-50%);white-space:pre';
    char.replaceChildren(sizer, glyph);
    return glyph;
  });
  const points: CharPoint[] = chars.map(() => ({ x: 0, y: 0, energy: 0, dx: 0, dy: 0, shown: false }));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, inside: false };
  const waves: Wave[] = [];
  let measured = false;
  let fontPx = 16;
  let raf = 0;
  let last = 0;
  let moveFrame = 0;
  let decode: gsap.core.Timeline | null = null;
  let observer: IntersectionObserver | null = null;

  const scramble = (index: number, length: number, revealDelay = 0): gsap.TweenVars => {
    const { speed, scrambleChars, scrambleColor } = props;
    const glyph = glyphs[index];
    return {
      overwrite: true,
      duration: length,
      ease: 'none',
      scrambleText: { text: originals[index], chars: scrambleChars, speed, revealDelay },
      onUpdate: () => {
        glyph.style.color = scrambleColor && glyph.textContent !== originals[index] ? scrambleColor : '';
      }
    };
  };

  if (props.intro && !reduce) {
    const introLength = props.duration;
    const timeline = gsap.timeline({ paused: true });
    glyphs.forEach((glyph, index) => {
      const reveal = 0.15 + introLength * (0.75 * (index / glyphs.length) + 0.25 * Math.random());
      timeline.to(glyph, scramble(index, reveal + 0.1, reveal), 0);
    });
    timeline.time(0.001);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timeline.play();
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(root);
    decode = timeline;
    observer = io;
  }

  const offsetOf = (el: HTMLElement): [number, number] => {
    let x = 0;
    let y = 0;
    for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
      x += node.offsetLeft;
      y += node.offsetTop;
    }
    return [x, y];
  };

  const measure = () => {
    fontPx = parseFloat(window.getComputedStyle(textEl).fontSize) || 16;
    const [rootX, rootY] = offsetOf(root);
    chars.forEach((char, i) => {
      const [x, y] = offsetOf(char);
      points[i].x = x - rootX + char.offsetWidth / 2;
      points[i].y = y - rootY + char.offsetHeight / 2;
    });
    measured = true;
  };

  const toLocal = (e: PointerEvent): [number, number] => {
    const rect = root.getBoundingClientRect();
    const scaleX = root.offsetWidth ? rect.width / root.offsetWidth : 1;
    const scaleY = root.offsetHeight ? rect.height / root.offsetHeight : 1;
    return [(e.clientX - rect.left) / (scaleX || 1), (e.clientY - rect.top) / (scaleY || 1)];
  };

  const clear = (i: number) => {
    const char = chars[i];
    char.style.transform = '';
    char.style.filter = '';
    char.style.opacity = '';
    char.style.zIndex = '';
    points[i].shown = false;
  };

  const paint = (i: number, mode: string, amount: number) => {
    const p = points[i];
    const e = p.energy;
    if (e < 0.001) {
      if (p.shown) clear(i);
      return;
    }
    const char = chars[i];
    p.shown = true;
    if (mode === 'lift') {
      char.style.transform = `translate3d(0, ${(-e * fontPx * 0.75 * amount).toFixed(2)}px, 0)`;
    } else if (mode === 'blur') {
      char.style.filter = `blur(${(e * fontPx * 0.24 * amount).toFixed(2)}px)`;
      char.style.opacity = (1 - e * Math.min(0.7, 0.45 * amount)).toFixed(3);
      char.style.transform = `scale(${(1 + e * 0.15 * amount).toFixed(4)})`;
    } else {
      char.style.transform = `translate3d(${p.dx.toFixed(2)}px, ${p.dy.toFixed(2)}px, 0) scale(${(1 + e * 0.85 * amount).toFixed(4)})`;
      char.style.zIndex = `${Math.round(e * 10)}`;
    }
  };

  const tick = (now: number) => {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    if (!measured) measure();
    const s = props;
    const mode = PHYSICAL[s.effect] && !reduce ? s.effect : '';
    const amount = Math.max(0, s.strength);
    const reach = Math.max(1, s.radius);
    const width = Math.max(fontPx * 1.3, 16);
    const swell = mode === 'magnify' ? 0.55 : 1;
    const follow = 1 - Math.exp(-dt / 0.06);
    const attack = 1 - Math.exp(-dt / 0.08);
    const release = 1 - Math.exp(-dt / Math.max(0.04, s.trail / 3));
    pointer.sx += (pointer.x - pointer.sx) * follow;
    pointer.sy += (pointer.y - pointer.sy) * follow;

    for (const wave of waves) {
      wave.age += dt;
      const t = Math.min(1, wave.age / wave.life);
      wave.r = wave.reach * (1 - (1 - t) * (1 - t));
      wave.fade = t < 0.75 ? 1 : 1 - ((t - 0.75) / 0.25) ** 2;
    }

    let busy = waves.length > 0 || Math.abs(pointer.x - pointer.sx) + Math.abs(pointer.y - pointer.sy) > 0.2;
    for (let i = 0; i < chars.length; i += 1) {
      const p = points[i];
      let target = 0;
      let tx = 0;
      let ty = 0;
      if (mode && pointer.inside) {
        const ax = p.x - pointer.sx;
        const ay = p.y - pointer.sy;
        target = falloff(Math.hypot(ax, ay), reach);
        tx = ax * 0.5 * amount * target;
        ty = ay * 0.5 * amount * target;
      }
      for (const wave of waves) {
        const ax = p.x - wave.x;
        const ay = p.y - wave.y;
        const d = Math.hypot(ax, ay);
        const strengthAt = 1 - (0.6 * d) / wave.reach;
        if (!wave.hit[i] && d <= wave.r) {
          wave.hit[i] = 1;
          gsap.to(glyphs[i], scramble(i, Math.max(0.2, s.duration * (0.2 + 0.5 * strengthAt))));
        }
        if (mode) {
          const band = swell * strengthAt * wave.fade * Math.exp(-(((d - wave.r) / width) ** 2));
          if (band > target) {
            const push = (fontPx * 0.6 * amount * band) / (d || 1);
            target = band;
            tx = ax * push;
            ty = ay * push;
          }
        }
      }
      const k = target > p.energy ? attack : release;
      p.energy += (target - p.energy) * k;
      if (Math.abs(target - p.energy) > 0.0005) busy = true;
      if (mode === 'magnify') {
        p.dx += (tx - p.dx) * k;
        p.dy += (ty - p.dy) * k;
      }
      if (!mode) {
        if (p.shown) clear(i);
        continue;
      }
      paint(i, mode, amount);
    }

    for (let j = waves.length - 1; j >= 0; j -= 1) {
      if (waves[j].age >= waves[j].life) waves.splice(j, 1);
    }

    if (busy) raf = requestAnimationFrame(tick);
    else last = 0;
  };

  const wake = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const scrambleNearPointer = () => {
    moveFrame = 0;
    if (!measured) measure();
    const { radius, duration } = props;
    glyphs.forEach((glyph, index) => {
      const p = points[index];
      const dist = Math.hypot(pointer.x - p.x, pointer.y - p.y);
      if (dist < radius) gsap.to(glyph, scramble(index, duration * (1 - dist / radius)));
    });
  };

  const handleEnter = () => {
    measured = false;
  };

  const handleMove = (e: PointerEvent) => {
    const [x, y] = toLocal(e);
    pointer.x = x;
    pointer.y = y;
    if (!pointer.inside) {
      pointer.sx = x;
      pointer.sy = y;
      pointer.inside = true;
    }
    if (PHYSICAL[props.effect]) {
      if (!reduce) wake();
    } else if (!moveFrame) moveFrame = requestAnimationFrame(scrambleNearPointer);
  };

  const handleLeave = () => {
    pointer.inside = false;
    wake();
  };

  const handleDown = (e: PointerEvent) => {
    if (!props.clickBurst || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (!measured) measure();
    const [x, y] = toLocal(e);
    let reach = 0;
    for (const p of points) reach = Math.max(reach, Math.hypot(p.x - x, p.y - y));
    reach += fontPx;
    if (waves.length > 3) waves.shift();
    waves.push({ x, y, age: 0, r: 0, fade: 1, reach, life: 0.45 + reach / 1100, hit: new Uint8Array(chars.length) });
    wake();
  };

  resetEffect = () => {
    points.forEach(p => {
      p.energy = 0;
      p.dx = 0;
      p.dy = 0;
    });
    chars.forEach((_, i) => clear(i));
  };

  const resize = new ResizeObserver(() => {
    measured = false;
  });
  resize.observe(root);
  document.fonts?.ready
    .then(() => {
      measured = false;
    })
    .catch(() => {});

  root.addEventListener('pointerenter', handleEnter);
  root.addEventListener('pointermove', handleMove);
  root.addEventListener('pointerleave', handleLeave);
  root.addEventListener('pointerdown', handleDown);

  teardown = () => {
    root.removeEventListener('pointerenter', handleEnter);
    root.removeEventListener('pointermove', handleMove);
    root.removeEventListener('pointerleave', handleLeave);
    root.removeEventListener('pointerdown', handleDown);
    resize.disconnect();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(moveFrame);
    observer?.disconnect();
    decode?.kill();
    gsap.killTweensOf(glyphs);
    resetEffect = () => {};
    split.revert();
  };
};

const restart = () => {
  teardown?.();
  teardown = null;
  setupEl = null;
  setup();
};

onMounted(() => {
  if (!fontsReady.value) {
    document.fonts.ready
      .then(() => {
        if (alive) fontsReady.value = true;
      })
      .catch(() => {
        if (alive) fontsReady.value = true;
      });
  }
  setup();
});

onUpdated(() => {
  if (textRef.value && textRef.value !== setupEl) restart();
});

watch([() => props.intro, fontsReady], restart, { flush: 'post' });

watch(
  () => props.effect,
  () => resetEffect()
);

onBeforeUnmount(() => {
  alive = false;
  teardown?.();
  teardown = null;
});
</script>

<template>
  <div ref="rootRef" :class="`scrambled-text ${className}`" :style="rootStyle">
    <span class="scrambled-text-sr"><slot /></span>
    <p :key="slotText()" ref="textRef" aria-hidden="true"><slot /></p>
  </div>
</template>

<style>
.scrambled-text {
  margin: 7vw;
  max-width: 800px;
  font-family: monospace;
  font-size: clamp(14px, 4vw, 32px);
}

.scrambled-text-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
