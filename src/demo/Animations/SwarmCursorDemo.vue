<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container swarm-demo-stage relative overflow-hidden" style="padding: 0">
          <SwarmCursor
            :key="rerenderKey"
            v-bind="settings"
            :color="tone"
            :accent-color="accent"
            :light-mode="theme === 'light'"
          >
            <div v-if="props.demo === 'hero'" class="swarm-demo-hero">
              <div class="swarm-demo-nav">
                <div class="swarm-demo-brand">
                  <div class="swarm-demo-tile" :style="tileStyle(30)">
                    <HugeiconsIcon :icon="Orbit01Icon" :size="15" :color="ink.text" :stroke-width="1.6" />
                  </div>
                  <p class="swarm-demo-brand-name" :style="{ color: ink.text }">Flock</p>
                </div>
                <div class="swarm-demo-links">
                  <button v-for="item in NAV" :key="item" type="button" class="swarm-demo-link" :style="linkStyle">
                    {{ item }}
                  </button>
                </div>
                <div class="swarm-demo-signin">
                  <button type="button" class="swarm-demo-button is-small" :style="buttonStyle(false)">Sign in</button>
                </div>
              </div>
              <div class="swarm-demo-hero-body">
                <p class="swarm-demo-title" :style="{ color: ink.text, textShadow: ink.halo }">
                  Teams move faster in formation
                </p>
                <p class="swarm-demo-subtitle" :style="{ color: ink.muted, textShadow: ink.halo }">
                  Plan, build and ship on one shared rhythm, with every update in plain sight.
                </p>
                <div class="swarm-demo-actions">
                  <button type="button" class="swarm-demo-button" :style="buttonStyle(true)">Start for free</button>
                  <button type="button" class="swarm-demo-button" :style="buttonStyle(false)">Book a demo</button>
                </div>
              </div>
            </div>

            <div v-else-if="props.demo === 'features'" class="swarm-demo-features">
              <div class="swarm-demo-features-head" :style="{ textShadow: ink.halo }">
                <p class="swarm-demo-features-title" :style="{ color: ink.text }">Everything moves together</p>
                <p class="swarm-demo-features-text" :style="{ color: ink.muted }">
                  One workspace for the whole flight path.
                </p>
              </div>
              <div class="swarm-demo-grid">
                <div
                  v-for="item in FEATURES"
                  :key="item.title"
                  data-swarm-target=""
                  tabindex="0"
                  class="swarm-demo-card"
                  :style="{ background: ink.card, boxShadow: ink.rim, '--swarm-hover': ink.hover }"
                >
                  <div class="swarm-demo-tile" :style="tileStyle(32)">
                    <HugeiconsIcon :icon="item.icon" :size="16" :color="ink.text" :stroke-width="1.6" />
                  </div>
                  <div>
                    <p class="swarm-demo-card-title" :style="{ color: ink.text }">{{ item.title }}</p>
                    <p class="swarm-demo-card-text" :style="{ color: ink.muted }">{{ item.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </SwarmCursor>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="value => updateProp('demo', String(value))"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="props.shape"
            @update:model-value="value => updateProp('shape', value as Shape)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="tone"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="accent"
            @change="(value: string) => updateProp('accentColor', value)"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="props.clickEffect"
            @update:model-value="value => updateProp('clickEffect', value as ClickEffect)"
          />
          <PreviewSlider
            title="Count"
            :min="40"
            :max="2000"
            :step="10"
            :model-value="props.count"
            @update:model-value="value => updateProp('count', value)"
          />
          <PreviewSlider
            title="Size"
            :min="1"
            :max="8"
            :step="0.1"
            value-unit="px"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="40"
            :max="200"
            :step="5"
            value-unit="px"
            :model-value="props.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Swirl"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.swirl"
            @update:model-value="value => updateProp('swirl', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Tail"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.tail"
            @update:model-value="value => updateProp('tail', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.trail"
            @update:model-value="value => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Wander"
            :min="0"
            :max="2"
            :step="0.01"
            :model-value="props.wander"
            @update:model-value="value => updateProp('wander', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSelect
            title="Idle"
            :options="IDLE_OPTIONS"
            :model-value="props.idle"
            @update:model-value="value => updateProp('idle', value as Idle)"
          />
          <PreviewSwitch
            title="Hide Cursor"
            :model-value="props.hideCursor"
            @update:model-value="value => updateProp('hideCursor', value)"
          />
          <PreviewSwitch title="Intro" :model-value="props.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Enabled"
            :model-value="props.enabled"
            @update:model-value="value => updateProp('enabled', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="swarmCursor" component-name="SwarmCursor" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { CursorPointer01Icon, FlowConnectionIcon, Orbit01Icon, Route01Icon } from '@hugeicons/core-free-icons';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { swarmCursor } from '@/constants/code/Animations/swarmCursorCode';
import SwarmCursor from '@/content/Animations/SwarmCursor/SwarmCursor.vue';

type Shape = 'dot' | 'streak' | 'square';
type Idle = 'roam' | 'gather' | 'hide';
type ClickEffect = 'burst' | 'pulse' | 'none';

const INK = {
  dark: {
    text: '#f4f5f4',
    muted: 'rgba(244, 245, 244, 0.62)',
    tile: 'linear-gradient(180deg, #363a36 0%, #242724 100%)',
    rim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    card: 'linear-gradient(180deg, rgba(38, 42, 38, 0.92) 0%, rgba(27, 30, 27, 0.92) 100%)',
    solid: '#f4f5f4',
    solidText: '#111111',
    hover: 'brightness(1.12)',
    halo: '0 1px 2px rgba(17, 17, 17, 0.9), 0 0 12px rgba(17, 17, 17, 0.85)'
  },
  light: {
    text: '#161816',
    muted: 'rgba(22, 24, 22, 0.62)',
    tile: 'linear-gradient(180deg, #ffffff 0%, #f5f7f5 100%)',
    rim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    card: 'linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(245, 247, 245, 0.94) 100%)',
    solid: '#161816',
    solidText: '#ffffff',
    hover: 'brightness(0.97)',
    halo: '0 0 2px rgba(255, 255, 255, 0.95), 0 0 12px rgba(255, 255, 255, 0.9)'
  }
};

const NAV = ['Product', 'Customers', 'Pricing', 'Docs'];

const FEATURES = [
  { icon: CursorPointer01Icon, title: 'Live presence', text: 'See who is working where, as it happens.' },
  { icon: Route01Icon, title: 'Shared roadmaps', text: 'Plans, releases and reviews on one line.' },
  { icon: FlowConnectionIcon, title: 'Quiet handoffs', text: 'Pass work along without losing context.' }
];

const LOOK = {
  shape: 'dot' as Shape,
  color: '#ffffff',
  accentColor: '#ffffff',
  count: 800,
  size: 2.6,
  spread: 90,
  speed: 1,
  swirl: 0.6,
  tail: 0.5,
  trail: 0.6,
  wander: 0.5,
  depth: 0.7,
  clickEffect: 'burst' as ClickEffect
};

const DEFAULT_PROPS = {
  demo: 'hero',
  preset: 'liquid',
  ...LOOK,
  idle: 'roam' as Idle,
  hideCursor: false,
  intro: true,
  enabled: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  liquid: {},
  ink: { count: 1400, size: 1.8, swirl: 0.85, wander: 0.7, depth: 0.5 },
  vortex: { count: 1000, size: 2.2, speed: 1.6, swirl: 1, wander: 1.1, accentColor: '#7dd3fc' },
  comet: { shape: 'streak', accentColor: '#7dd3fc', count: 600, size: 2.2, tail: 0.9, trail: 1.4, swirl: 0.4 },
  fireflies: {
    color: '#fde68a',
    accentColor: '#fde68a',
    count: 160,
    size: 4,
    spread: 120,
    speed: 0.5,
    swirl: 0.3,
    wander: 1.2,
    depth: 0.5,
    clickEffect: 'pulse'
  },
  pixels: { shape: 'square', count: 500, size: 3.4, swirl: 0.5, depth: 0.3 }
};

const LIGHT_SWAP: Record<string, string> = {
  '#ffffff': '#18181b',
  '#fde68a': '#d97706',
  '#7dd3fc': '#0284c7'
};

const DARK_SWAP: Record<string, string> = Object.fromEntries(
  Object.entries(LIGHT_SWAP).map(([dark, light]) => [light, dark])
);

const DEMO_OPTIONS = [
  { value: 'hero', label: 'Hero' },
  { value: 'features', label: 'Features' },
  { value: 'basic', label: 'Basic' }
];

const PRESET_OPTIONS = [
  { value: 'liquid', label: 'Liquid' },
  { value: 'ink', label: 'Ink' },
  { value: 'vortex', label: 'Vortex' },
  { value: 'comet', label: 'Comet' },
  { value: 'fireflies', label: 'Fireflies' },
  { value: 'pixels', label: 'Pixels' }
];

const SHAPE_OPTIONS = [
  { value: 'dot', label: 'Dot' },
  { value: 'streak', label: 'Streak' },
  { value: 'square', label: 'Square' }
];

const IDLE_OPTIONS = [
  { value: 'roam', label: 'Roam' },
  { value: 'gather', label: 'Gather' },
  { value: 'hide', label: 'Hide' }
];

const CLICK_OPTIONS = [
  { value: 'burst', label: 'Burst' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'Content the swarm flows behind, such as a hero with buttons.'
  },
  { name: 'count', type: 'number', default: '800', description: 'Number of particles in the swarm, up to 2000.' },
  { name: 'size', type: 'number', default: '2.6', description: 'Size of each particle, in px.' },
  { name: 'shape', type: "'dot' | 'streak' | 'square'", default: "'dot'", description: 'Shape of each particle.' },
  {
    name: 'color',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the particles. Defaults to near black in light mode.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: 'color',
    description: 'Color particles take on when they rush and when you click.'
  },
  { name: 'spread', type: 'number', default: '90', description: 'Radius of the swarm around the cursor, in px.' },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'How lively the swarm churns and turns while the cursor rests.'
  },
  {
    name: 'swirl',
    type: 'number',
    default: '0.6',
    description: 'How much the swarm curls into eddies and how long they keep turning, from 0 (calm) to 1 (stormy).'
  },
  {
    name: 'tail',
    type: 'number',
    default: '0.5',
    description: 'How far the swarm streams behind a fast cursor, from 0 (tight) to 1 (a long trailing tail).'
  },
  { name: 'trail', type: 'number', default: '0.6', description: 'Motion blur on fast particles.' },
  {
    name: 'wander',
    type: 'number',
    default: '0.5',
    description: 'How restlessly the swarm folds and drifts on its own.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '0.7',
    description: 'How much near particles grow and blur and far ones shrink and fade, from 0 (flat) to 1 (deep).'
  },
  {
    name: 'targets',
    type: 'string',
    default: "'a, button, [data-swarm-target]'",
    description: 'Elements inside the swarm that it pours around while hovered. Pass an empty string to turn this off.'
  },
  {
    name: 'idle',
    type: "'roam' | 'gather' | 'hide'",
    default: "'roam'",
    description: 'What the swarm does while the cursor is away: drift around the area, wait in the middle, or fade out.'
  },
  {
    name: 'clickEffect',
    type: "'burst' | 'pulse' | 'none'",
    default: "'burst'",
    description:
      'What a click does. Burst splashes the swarm outward in a curl, pulse sends a wave of light through it.'
  },
  {
    name: 'hideCursor',
    type: 'boolean',
    default: 'false',
    description:
      'Hides the system cursor over the component and marks the pointer with a dot, so the swarm becomes the cursor.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Swirls the swarm in from across the area on mount.'
  },
  { name: 'enabled', type: 'boolean', default: 'true', description: 'Shows and animates the swarm.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Uses near black particles by default and keeps them crisp, for light backgrounds.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const ink = computed(() => INK[theme.value]);
const swap = computed(() => (theme.value === 'light' ? LIGHT_SWAP : DARK_SWAP));
const tone = computed(() => swap.value[props.value.color.toLowerCase()] ?? props.value.color);
const accent = computed(() => swap.value[props.value.accentColor.toLowerCase()] ?? props.value.accentColor);

const settings = computed(() => {
  const { demo: _demo, preset: _preset, color: _color, accentColor: _accentColor, ...rest } = props.value;
  return rest;
});

const computedProps = computed(() => ({
  color: tone.value,
  accentColor: accent.value,
  ...(theme.value === 'light' ? { lightMode: true } : {})
}));

const tileStyle = (size: number) => ({
  width: `${size}px`,
  height: `${size}px`,
  background: ink.value.tile,
  boxShadow: ink.value.rim
});

const buttonStyle = (solid: boolean) => ({
  '--swarm-hover': ink.value.hover,
  ...(solid
    ? { background: ink.value.solid, color: ink.value.solidText }
    : { background: ink.value.tile, color: ink.value.text, boxShadow: ink.value.rim })
});

const linkStyle = computed(() => ({ '--swarm-muted': ink.value.muted, '--swarm-text': ink.value.text }));

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>

<style scoped>
.swarm-demo-stage {
  height: 520px;
  container-type: inline-size;
  container-name: swarm;
}

@media (min-width: 768px) {
  .swarm-demo-stage {
    height: 560px;
  }
}

.swarm-demo-stage p {
  margin: 0;
}

.swarm-demo-hero {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.swarm-demo-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 60px 0 16px;
}

.swarm-demo-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.swarm-demo-brand-name {
  font-size: 15px;
  font-weight: 600;
}

.swarm-demo-tile {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 10px;
}

.swarm-demo-links {
  display: none;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.swarm-demo-link {
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: var(--swarm-muted);
  transition: color 200ms ease;
}

.swarm-demo-link:hover {
  color: var(--swarm-text);
}

.swarm-demo-signin {
  margin-left: auto;
}

.swarm-demo-button {
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: filter 200ms ease;
}

.swarm-demo-button.is-small {
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 13px;
}

.swarm-demo-button:hover {
  filter: var(--swarm-hover);
}

.swarm-demo-hero-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px 32px;
}

.swarm-demo-title {
  max-width: 520px;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.swarm-demo-subtitle {
  max-width: 400px;
  font-size: 14px;
  line-height: 1.6;
  text-wrap: balance;
}

.swarm-demo-stage .swarm-demo-subtitle {
  margin-top: 14px;
}

.swarm-demo-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
}

.swarm-demo-features {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 0 16px;
}

.swarm-demo-features-head {
  text-align: center;
}

.swarm-demo-features-title {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.swarm-demo-stage .swarm-demo-features-text {
  margin-top: 8px;
  font-size: 14px;
}

.swarm-demo-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 720px;
}

.swarm-demo-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 16px;
  text-align: left;
  cursor: default;
  transition: filter 200ms ease;
}

.swarm-demo-card:hover {
  filter: var(--swarm-hover);
}

.swarm-demo-card-title {
  font-size: 15px;
  font-weight: 600;
}

.swarm-demo-stage .swarm-demo-card-text {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.5;
}

@container swarm (min-width: 640px) {
  .swarm-demo-nav {
    padding-left: 22px;
  }

  .swarm-demo-links {
    display: flex;
  }

  .swarm-demo-signin {
    margin-left: 8px;
  }

  .swarm-demo-title {
    font-size: 44px;
  }

  .swarm-demo-subtitle {
    font-size: 16px;
  }

  .swarm-demo-features-title {
    font-size: 28px;
  }

  .swarm-demo-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .swarm-demo-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 18px;
  }
}
</style>
