<script setup lang="ts">
import { ArrowRight02Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { useAdaptiveQuality } from '@/composables/useAdaptiveQuality';
import { useColorMode } from '@/composables/useTheme';
import { TOTAL_COMPONENTS } from '@/constants/Categories';
import { LOOK, PRESET_OPTIONS, presetProps } from './gradientLook';
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, shallowRef, watch, watchEffect } from 'vue';
import DotFrame from './DotFrame.vue';
import GhostReveal, { type PointerHolder } from './GhostReveal.vue';
import HeroChip from './HeroChip.vue';
import HeroCopyCommand from './HeroCopyCommand.vue';
import HeroTerminal from './HeroTerminal.vue';
import HeroWindow from './HeroWindow.vue';
import ScrubColor from './ScrubColor.vue';
import ScrubNumber, { type ScrubField } from './ScrubNumber.vue';
import { DOT, dotTint, tween, type Values } from './heroUtils';
import './HeroFrame.css';

const GradientWaves = defineAsyncComponent(() => import('@/content/Backgrounds/GradientWaves/GradientWaves.vue'));
const DotGrid = defineAsyncComponent(() => import('@/content/Backgrounds/DotGrid/DotGrid.vue'));

type Option = { value: string; label: string };
type ColorField = { name: string; type: 'color'; label: string };
type Field = ColorField | (ScrubField & { type?: undefined });
type Segment =
  | { t: 'text'; text: string; c?: string }
  | { t: 'color'; field: ColorField }
  | { t: 'number'; field: ScrubField };

const ORDER = ['ocean', 'dune', 'dusk', 'silk', 'aurora'];
const OPTIONS = ORDER.map(value => (PRESET_OPTIONS as Option[]).find(option => option.value === value)).filter(
  (option): option is Option => Boolean(option)
);
const FIRST = 'dusk';
const STAGE = { tilt: 40 };
const INSTALL = 'npx jsrepo add https://vue-bits.dev/r/GradientWaves';
const OUTPUT = ['✔ Checking registry.', '✔ Created 1 file.'];
const FIELDS: Field[] = [
  { name: 'waveColor', type: 'color', label: 'Wave color' },
  { name: 'amplitude', min: 0, max: 5, step: 0.05, label: 'Amplitude' },
  { name: 'swell', min: 0, max: 40, step: 0.5, label: 'Swell' },
  { name: 'lightAngle', min: -180, max: 180, step: 1, label: 'Light angle' },
  { name: 'speed', min: 0, max: 1.5, step: 0.01, label: 'Speed' }
];
const HINTS = ['amplitude', 'swell'];
const SWATCHES = {
  dark: ['#fb923c', '#fca5a5', '#7cff67', '#38bdf8', '#34d399', '#fde68a', '#e5e5e5'],
  light: ['#fb923c', '#f87171', '#1f9d45', '#38bdf8', '#34d399', '#facc15', '#a3a3a3']
};
const CYCLE_MS = 6000;
const IDLE_MS = 2600;
const DOCS_PATH = '/backgrounds/gradient-waves';

const kebab = (name: string) => name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

const CODE: Segment[][] = [
  [
    { t: 'text', text: '<', c: 'lh-punc' },
    { t: 'text', text: 'script', c: 'lh-kw' },
    { t: 'text', text: ' ' },
    { t: 'text', text: 'setup', c: 'lh-attr' },
    { t: 'text', text: '>', c: 'lh-punc' }
  ],
  [
    { t: 'text', text: 'import', c: 'lh-kw' },
    { t: 'text', text: ' GradientWaves ' },
    { t: 'text', text: 'from', c: 'lh-kw' },
    { t: 'text', text: ' ' },
    { t: 'text', text: "'./GradientWaves.vue'", c: 'lh-str' },
    { t: 'text', text: ';' }
  ],
  [
    { t: 'text', text: '</', c: 'lh-punc' },
    { t: 'text', text: 'script', c: 'lh-kw' },
    { t: 'text', text: '>', c: 'lh-punc' }
  ],
  [{ t: 'text', text: ' ' }],
  [
    { t: 'text', text: '<', c: 'lh-punc' },
    { t: 'text', text: 'template', c: 'lh-kw' },
    { t: 'text', text: '>', c: 'lh-punc' }
  ],
  [{ t: 'text', text: '  <GradientWaves' }],
  ...FIELDS.map((field): Segment[] =>
    field.type === 'color'
      ? [
          { t: 'text', text: '    ' },
          { t: 'text', text: kebab(field.name), c: 'lh-attr' },
          { t: 'text', text: '=', c: 'lh-punc' },
          { t: 'color', field }
        ]
      : [
          { t: 'text', text: '    ' },
          { t: 'text', text: `:${kebab(field.name)}`, c: 'lh-attr' },
          { t: 'text', text: '="', c: 'lh-punc' },
          { t: 'number', field },
          { t: 'text', text: '"', c: 'lh-punc' }
        ]
  ),
  [{ t: 'text', text: '  />' }],
  [
    { t: 'text', text: '</', c: 'lh-punc' },
    { t: 'text', text: 'template', c: 'lh-kw' },
    { t: 'text', text: '>', c: 'lh-punc' }
  ]
];

const lookFor = (preset: string, light: boolean): Values => ({
  ...(presetProps(preset, { light, defaults: LOOK }) as Values),
  ...STAGE
});

const buildDocsUrl = (current: Values, defaults: Values) => {
  const params = new URLSearchParams();
  Object.keys(current).forEach(key => {
    if (JSON.stringify(current[key]) === JSON.stringify(defaults[key])) return;
    const value = current[key];
    if (typeof value === 'string' && value.startsWith('#')) params.set(key, value.replace(/^#/, ''));
    else params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `${DOCS_PATH}?${query}` : DOCS_PATH;
};

const { isLight } = useColorMode();
const light = computed(() => isLight.value);

const preset = ref<string | null>(FIRST);
const values = shallowRef<Values>(lookFor(FIRST, light.value));
const visible = ref(true);
const hover = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const step = useAdaptiveQuality(visible);
const idle = ref(true);
const auto = ref(true);
const hold = ref(false);
const stageRef = ref<HTMLElement | null>(null);
const pointer: PointerHolder = { current: null };
let stop: (() => void) | null = null;
let idleFlag = true;

watch(light, isLightMode => {
  stop?.();
  values.value = lookFor(preset.value || FIRST, isLightMode);
});

const choose = (value: string) => {
  preset.value = value;
  stop?.();
  stop = tween(
    values.value,
    lookFor(value, light.value),
    next => {
      values.value = next;
    },
    900
  );
};

const pick = (value: string) => {
  auto.value = false;
  choose(value);
};

const set = (name: string, value: unknown) => {
  stop?.();
  auto.value = false;
  preset.value = null;
  values.value = { ...values.value, [name]: value };
};

watchEffect(onCleanup => {
  if (!auto.value || hold.value || !visible.value || !preset.value) return;
  const timer = window.setTimeout(() => {
    const index = OPTIONS.findIndex(option => option.value === preset.value);
    choose(OPTIONS[(index + 1) % OPTIONS.length].value);
  }, CYCLE_MS);
  onCleanup(() => window.clearTimeout(timer));
});

let idleTimer = 0;
const onIdleMove = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return;
  pointer.current = { x: event.clientX, y: event.clientY };
  if (idleFlag) {
    idleFlag = false;
    idle.value = false;
  }
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    idleFlag = true;
    idle.value = true;
  }, IDLE_MS);
};

const parallax = { x: 0, y: 0, tx: 0, ty: 0, frame: 0 };
const parallaxTick = () => {
  const stage = stageRef.value;
  if (!stage) {
    parallax.frame = 0;
    return;
  }
  parallax.x += (parallax.tx - parallax.x) * 0.07;
  parallax.y += (parallax.ty - parallax.y) * 0.07;
  stage.style.setProperty('--lh-px', parallax.x.toFixed(4));
  stage.style.setProperty('--lh-py', parallax.y.toFixed(4));
  const moving = Math.abs(parallax.tx - parallax.x) + Math.abs(parallax.ty - parallax.y) > 0.0004;
  parallax.frame = moving ? requestAnimationFrame(parallaxTick) : 0;
};
const onParallaxMove = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return;
  parallax.tx = event.clientX / window.innerWidth - 0.5;
  parallax.ty = event.clientY / window.innerHeight - 0.5;
  if (!parallax.frame) parallax.frame = requestAnimationFrame(parallaxTick);
};

let stageObserver: IntersectionObserver | null = null;
const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

onMounted(() => {
  window.addEventListener('pointermove', onIdleMove, { passive: true });
  if (!reducedMotion) window.addEventListener('pointermove', onParallaxMove, { passive: true });
  const stage = stageRef.value;
  if (stage && typeof IntersectionObserver !== 'undefined') {
    stageObserver = new IntersectionObserver(
      ([entry]) => {
        visible.value = entry.isIntersecting;
      },
      { rootMargin: '80px' }
    );
    stageObserver.observe(stage);
  }
});

onBeforeUnmount(() => {
  stop?.();
  window.clearTimeout(idleTimer);
  window.removeEventListener('pointermove', onIdleMove);
  window.removeEventListener('pointermove', onParallaxMove);
  cancelAnimationFrame(parallax.frame);
  stageObserver?.disconnect();
});

const presets = computed(() =>
  OPTIONS.map(option => {
    const look = lookFor(option.value, light.value);
    return {
      ...option,
      colors: [look.horizonColor, look.waveColor, look.crestColor] as string[],
      hint: HINTS.map(name => `${name} ${look[name]}`).join(' · ')
    };
  })
);

const activeIndex = computed(() => OPTIONS.findIndex(option => option.value === preset.value));

const docsUrl = computed(() =>
  buildDocsUrl(
    Object.fromEntries(FIELDS.map(field => [field.name, values.value[field.name]]).concat([['tilt', STAGE.tilt]])),
    LOOK as Values
  )
);

const tint = computed(() => dotTint(values.value.waveColor, light.value));
const dotDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
const swatches = computed(() => SWATCHES[light.value ? 'light' : 'dark']);
</script>

<template>
  <section class="ln-hero lh" :style="{ '--lh-accent': String(values.waveColor) }">
    <div v-if="hover && !step.lite" class="lh-dots" aria-hidden="true">
      <DotGrid
        :dpr="dotDpr"
        :dot-size="DOT.size"
        :gap="DOT.gap"
        :base-color="light ? '#f5f5f5' : '#111111'"
        :active-color="tint"
        :proximity="DOT.radius"
        :strength="1.15"
        :bounce="0.7"
        :tension="0.35"
        :swell="1.4"
        :stretch="0.5"
        :glow="0.15"
        :opacity="0.55"
        :shock-radius="380"
        :shock-strength="4"
        :intro="false"
        :mouse-interaction="!idle"
      />
    </div>
    <DotFrame :color="tint" :live="!idle" />
    <GhostReveal v-if="!step.lite" :active="idle && visible" :start="pointer" :color="tint" />
    <div class="lh-inner">
      <header class="lh-top">
        <HeroChip />
        <h1 class="lh-title">
          Animated Vue components for
          <br />
          websites people remember.
        </h1>
        <p class="lh-lede">
          <span>{{ TOTAL_COMPONENTS }} animated components and backgrounds for Vue.</span>
          <span>Tune them yourself, or hand them to your agent.</span>
        </p>
        <div class="lh-actions">
          <RouterLink to="/get-started/index" class="lh-btn lh-btn--primary">
            Browse components
            <HugeiconsIcon :icon="ArrowRight02Icon" :size="17" :stroke-width="1.8" />
          </RouterLink>
          <a
            href="https://github.com/DavidHDev/vue-bits"
            target="_blank"
            rel="noopener noreferrer"
            class="lh-btn lh-btn--ghost"
          >
            Star on GitHub
          </a>
        </div>
      </header>

      <div ref="stageRef" class="lh-stage">
        <div class="lh-art" aria-hidden="true">
          <div class="lh-art-layer">
            <GradientWaves v-bind="values" :dpr="step.dpr" :quality="step.quality" :intro="true" :paused="!visible" />
          </div>
        </div>

        <HeroWindow title="Terminal" class="lh-terminal">
          <template #action>
            <HeroCopyCommand :command="INSTALL" button-class="lh-window-action" />
          </template>
          <HeroTerminal :command="INSTALL" :output="OUTPUT" />
        </HeroWindow>

        <HeroWindow title="Hero.vue" class="lh-code">
          <pre class="lh-pre"><code><span
            v-for="(line, li) in CODE"
            :key="li"
            class="lh-line"
          ><template
            v-for="(seg, si) in line"
            :key="si"
          ><ScrubColor
            v-if="seg.t === 'color'"
            :value="String(values[seg.field.name])"
            :label="seg.field.label"
            :swatches="swatches"
            @change="value => set(seg.field.name, value)"
          /><ScrubNumber
            v-else-if="seg.t === 'number'"
            :value="Number(values[seg.field.name])"
            :field="seg.field"
            @change="value => set(seg.field.name, value)"
          /><span
            v-else-if="seg.c"
            :class="seg.c"
          >{{ seg.text }}</span><template
            v-else
          >{{ seg.text }}</template></template></span></code></pre>
        </HeroWindow>

        <HeroWindow title="Presets" class="lh-presets" @pointerenter="hold = true" @pointerleave="hold = false">
          <div class="lh-preset-list" role="radiogroup" aria-label="Presets">
            <span
              class="lh-preset-thumb"
              aria-hidden="true"
              :data-hidden="activeIndex < 0 ? '' : undefined"
              :style="{ '--i': Math.max(0, activeIndex) }"
            />
            <button
              v-for="option in presets"
              :key="option.value"
              type="button"
              role="radio"
              :aria-checked="preset === option.value"
              class="lh-preset"
              @click="pick(option.value)"
            >
              <span class="lh-preset-swatches" aria-hidden="true">
                <i v-for="(color, index) in option.colors" :key="`${color}-${index}`" :style="{ background: color }" />
              </span>
              <span class="lh-preset-name">{{ option.label }}</span>
              <span class="lh-preset-hint">{{ option.hint }}</span>
            </button>
          </div>
          <template #status>
            <RouterLink :to="docsUrl" class="lh-studio">
              Open in the docs
              <HugeiconsIcon :icon="ArrowUpRight01Icon" :size="14" :stroke-width="1.8" />
            </RouterLink>
          </template>
        </HeroWindow>
      </div>
    </div>
  </section>
</template>
