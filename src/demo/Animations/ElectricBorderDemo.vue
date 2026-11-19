<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset', 'color']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container eb-demo relative overflow-hidden" :style="inkVars">
          <ElectricBorder
            v-if="scene === 'composer'"
            :key="sceneKey"
            v-bind="border"
            :active="border.active && generating"
            :border-radius="radius"
            :style="{ width: '100%', maxWidth: '520px' }"
          >
            <div class="eb-panel" :style="{ padding: '14px', borderRadius: `${radius}px` }">
              <p class="eb-composer-text">
                Write a launch post for our new electric borders. Keep it short and upbeat.
              </p>
              <div class="eb-composer-bar">
                <button type="button" class="eb-tool" aria-label="Attach a file">
                  <HugeiconsIcon :icon="Attachment02Icon" :size="16" :color="ink.text" :stroke-width="1.8" />
                </button>
                <div class="eb-pill">
                  Fast
                  <HugeiconsIcon :icon="ArrowDown01Icon" :size="14" :color="ink.muted" :stroke-width="1.8" />
                </div>
                <div class="eb-spacer" />
                <button type="button" class="eb-tool" aria-label="Dictate">
                  <HugeiconsIcon :icon="Mic02Icon" :size="16" :color="ink.text" :stroke-width="1.8" />
                </button>
                <button
                  type="button"
                  class="eb-tool eb-tool--solid"
                  :aria-label="generating ? 'Stop generating' : 'Send'"
                  @click="generating = !generating"
                >
                  <HugeiconsIcon
                    :icon="generating ? StopIcon : ArrowUp02Icon"
                    :size="16"
                    :color="ink.solidText"
                    :stroke-width="1.8"
                  />
                </button>
              </div>
            </div>
          </ElectricBorder>

          <div v-else-if="scene === 'pricing'" :key="sceneKey" class="eb-pricing">
            <div
              v-for="plan in PLANS"
              :key="plan.name"
              :class="['eb-plan-slot', plan.featured ? '' : 'eb-plan-slot--side']"
            >
              <component
                :is="plan.featured ? ElectricBorder : 'div'"
                v-bind="plan.featured ? border : {}"
                :border-radius="plan.featured ? radius : undefined"
                :style="{ height: '100%' }"
              >
                <div class="eb-panel eb-plan" :style="{ borderRadius: `${radius}px` }">
                  <div class="eb-plan-head">
                    <div class="eb-tile" :style="tileStyle(32)">
                      <HugeiconsIcon :icon="plan.icon" :size="16" :color="ink.text" :stroke-width="1.6" />
                    </div>
                    <p class="eb-plan-name">{{ plan.name }}</p>
                    <p v-if="plan.featured" class="eb-plan-badge" :style="{ color: border.color }">Popular</p>
                  </div>
                  <div class="eb-plan-price-row">
                    <p class="eb-plan-price">{{ plan.price }}</p>
                    <p class="eb-plan-per">/month</p>
                  </div>
                  <p class="eb-plan-note">{{ plan.note }}</p>
                  <ul class="eb-plan-features">
                    <li v-for="feature in plan.features" :key="feature">
                      <HugeiconsIcon :icon="Tick02Icon" :size="15" :color="ink.faint" :stroke-width="2" />
                      {{ feature }}
                    </li>
                  </ul>
                  <button type="button" :class="['eb-plan-cta', plan.featured ? 'eb-plan-cta--solid' : '']">
                    {{ plan.cta }}
                  </button>
                </div>
              </component>
            </div>
          </div>

          <ElectricBorder
            v-else-if="scene === 'upload'"
            :key="sceneKey"
            v-bind="border"
            :active="border.active && hovered"
            :border-radius="radius"
            :style="{ width: '100%', maxWidth: '440px' }"
          >
            <div
              class="eb-panel"
              :style="{ padding: '14px', borderRadius: `${radius}px` }"
              @pointerenter="hovered = true"
              @pointerleave="hovered = false"
            >
              <div class="eb-drop" :style="{ borderRadius: `${Math.max(4, radius - 10)}px` }">
                <div class="eb-tile" :style="tileStyle(40)">
                  <HugeiconsIcon :icon="CloudUploadIcon" :size="20" :color="ink.text" :stroke-width="1.6" />
                </div>
                <p class="eb-drop-title">Drop files to upload</p>
                <p class="eb-drop-note">PNG, JPG or PDF, up to 10 MB</p>
              </div>
              <div class="eb-files">
                <div v-for="file in FILES" :key="file.name" class="eb-file">
                  <div class="eb-tile" :style="tileStyle(32)">
                    <HugeiconsIcon :icon="file.icon" :size="16" :color="ink.text" :stroke-width="1.6" />
                  </div>
                  <div class="eb-file-body">
                    <div class="eb-file-head">
                      <p class="eb-file-name">{{ file.name }}</p>
                      <p class="eb-file-size">
                        {{ file.progress >= 1 ? file.size : `${Math.round(file.progress * 100)}%` }}
                      </p>
                    </div>
                    <div class="eb-file-track">
                      <div class="eb-file-fill" :style="{ width: `${file.progress * 100}%` }" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ElectricBorder>

          <ElectricBorder
            v-else
            :key="sceneKey"
            v-bind="border"
            :border-radius="radius"
            :style="{ width: '100%', maxWidth: '280px' }"
          >
            <div class="eb-panel eb-basic" :style="{ borderRadius: `${radius}px` }">
              <div class="eb-tile" :style="tileStyle(38)">
                <HugeiconsIcon :icon="FlashIcon" :size="19" :color="ink.text" :stroke-width="1.6" />
              </div>
              <div>
                <p class="eb-basic-title">Electric Border</p>
                <p class="eb-basic-desc">Wrap anything in a living current.</p>
              </div>
            </div>
          </ElectricBorder>

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
          <PreviewColorPickerCustom
            title="Color"
            :color="shown"
            @change="(value: string) => updateProp('color', value)"
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
            title="Chaos"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.chaos"
            @update:model-value="value => updateProp('chaos', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.5"
            :max="4"
            :step="0.1"
            value-unit="px"
            :model-value="props.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Strands"
            :min="1"
            :max="6"
            :step="1"
            :model-value="props.strands"
            @update:model-value="value => updateProp('strands', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="props.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Arcs"
            :min="0"
            :max="3"
            :step="0.1"
            :model-value="props.arcs"
            @update:model-value="value => updateProp('arcs', value)"
          />
          <PreviewSlider
            title="Flicker"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.flicker"
            @update:model-value="value => updateProp('flicker', value)"
          />
          <PreviewSlider
            title="Border Radius"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.borderRadius"
            @update:model-value="value => updateProp('borderRadius', value)"
          />
          <PreviewSlider
            title="Offset"
            :min="-6"
            :max="12"
            :step="1"
            value-unit="px"
            :model-value="props.offset"
            @update:model-value="value => updateProp('offset', value)"
          />
          <PreviewSlider
            title="Cursor Radius"
            :min="30"
            :max="200"
            :step="5"
            value-unit="px"
            :model-value="props.cursorRadius"
            @update:model-value="value => updateProp('cursorRadius', value)"
          />
          <PreviewSwitch
            title="Active"
            :model-value="props.active"
            @update:model-value="value => updateProp('active', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="props.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="
              value => {
                updateProp('intro', value);
                forceRerender();
              }
            "
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="electricBorder" component-name="ElectricBorder" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  ArrowDown01Icon,
  ArrowUp02Icon,
  Attachment02Icon,
  CloudUploadIcon,
  FlashIcon,
  Image01Icon,
  Mic02Icon,
  Pdf01Icon,
  Rocket01Icon,
  SparklesIcon,
  StopIcon,
  Tick02Icon,
  UserGroupIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
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
import { electricBorder } from '@/constants/code/Animations/electricBorderCode';
import ElectricBorder from '@/content/Animations/ElectricBorder/ElectricBorder.vue';

type Ink = {
  text: string;
  muted: string;
  faint: string;
  panel: string;
  panelRim: string;
  tile: string;
  rim: string;
  well: string;
  wellRim: string;
  track: string;
  solid: string;
  solidText: string;
};

const INK: Record<'dark' | 'light', Ink> = {
  dark: {
    text: '#f4f5f4',
    muted: 'rgba(244, 245, 244, 0.6)',
    faint: 'rgba(244, 245, 244, 0.34)',
    panel: 'linear-gradient(180deg, #1a1d1a 0%, #141614 100%)',
    panelRim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    tile: 'linear-gradient(180deg, #353a35 0%, #252925 100%)',
    rim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    well: 'rgba(255, 255, 255, 0.025)',
    wellRim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
    track: 'rgba(255, 255, 255, 0.08)',
    solid: '#f4f5f4',
    solidText: '#111111'
  },
  light: {
    text: '#161816',
    muted: 'rgba(22, 24, 22, 0.6)',
    faint: 'rgba(22, 24, 22, 0.36)',
    panel: 'linear-gradient(180deg, #ffffff 0%, #fafbfa 100%)',
    panelRim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08), 0 8px 24px -12px rgba(22, 24, 22, 0.18)',
    tile: 'linear-gradient(180deg, #ffffff 0%, #f3f5f3 100%)',
    rim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    well: 'rgba(22, 24, 22, 0.025)',
    wellRim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.06)',
    track: 'rgba(22, 24, 22, 0.08)',
    solid: '#161816',
    solidText: '#ffffff'
  }
};

const LOOK = {
  color: '#7df9ff',
  speed: 1,
  chaos: 0.5,
  spread: 0.6,
  thickness: 1.5,
  strands: 3,
  glow: 0.6,
  intensity: 0.8,
  arcs: 1,
  flicker: 0.5
};

const DEFAULT_PROPS = {
  demo: 'composer',
  preset: 'voltage',
  ...LOOK,
  borderRadius: 24,
  offset: 0,
  cursorRadius: 90,
  active: true,
  interactive: true,
  intro: true
};

type Look = typeof LOOK;

const PRESETS: Record<string, Partial<Look>> = {
  voltage: {},
  plasma: { color: '#7cff67' },
  ember: { color: '#fb923c', chaos: 0.7, flicker: 0.7 },
  emerald: { color: '#34d399', strands: 4, spread: 0.8 },
  storm: { color: '#93c5fd', strands: 5, chaos: 0.9, spread: 1.1, arcs: 2.5, flicker: 0.8, glow: 0.8 },
  silver: { color: '#e4e4e7', strands: 2, chaos: 0.25, spread: 0.3, arcs: 0, flicker: 0.15, glow: 0.4 }
};

const LIGHT_SWAP: Record<string, string> = {
  '#7df9ff': '#0891b2',
  '#7cff67': '#1f9d45',
  '#fb923c': '#ea580c',
  '#34d399': '#059669',
  '#93c5fd': '#2563eb',
  '#e4e4e7': '#52525b'
};

const DARK_SWAP: Record<string, string> = Object.fromEntries(
  Object.entries(LIGHT_SWAP).map(([dark, light]) => [light, dark])
);

const DEMO_OPTIONS = [
  { value: 'composer', label: 'Composer' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'upload', label: 'Upload' },
  { value: 'basic', label: 'Basic' }
];

const PRESET_OPTIONS = [
  { value: 'voltage', label: 'Voltage' },
  { value: 'plasma', label: 'Plasma' },
  { value: 'ember', label: 'Ember' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'storm', label: 'Storm' },
  { value: 'silver', label: 'Silver' }
];

const PLANS: {
  name: string;
  price: string;
  note: string;
  features: string[];
  cta: string;
  icon: IconArray;
  featured?: boolean;
}[] = [
  {
    name: 'Starter',
    price: '$0',
    note: 'For side projects',
    features: ['3 projects', 'Community support', 'Basic analytics'],
    cta: 'Get started',
    icon: SparklesIcon as IconArray
  },
  {
    name: 'Pro',
    price: '$24',
    note: 'For growing teams',
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
    cta: 'Upgrade to Pro',
    icon: Rocket01Icon as IconArray,
    featured: true
  },
  {
    name: 'Team',
    price: '$59',
    note: 'For organizations',
    features: ['Shared workspaces', 'SSO and audit logs', 'Dedicated manager'],
    cta: 'Contact sales',
    icon: UserGroupIcon as IconArray
  }
];

const FILES = [
  { icon: Pdf01Icon as IconArray, name: 'Brand guidelines.pdf', size: '4.2 MB', progress: 1 },
  { icon: Image01Icon as IconArray, name: 'Hero shot.png', size: '2.8 MB', progress: 0.64 }
];

const propData: PropRow[] = [
  { name: 'default slot', type: 'slot', default: '-', description: 'Content wrapped by the electric border.' },
  {
    name: 'color',
    type: 'string',
    default: "'#7df9ff'",
    description: 'Color of the current. The strands burn whiter at their core.'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: '-',
    description: 'Color of the glow around the strands. Defaults to color.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'How fast the current crackles and moves.' },
  { name: 'chaos', type: 'number', default: '0.5', description: 'How jagged the strands are, from 0 to 2.' },
  {
    name: 'spread',
    type: 'number',
    default: '0.6',
    description: 'How far the strands wander from the edge, from 0 to 2.'
  },
  { name: 'thickness', type: 'number', default: '1.5', description: 'Thickness of the strands, in px.' },
  {
    name: 'strands',
    type: 'number',
    default: '3',
    description: 'Number of strands running along the edge, from 1 to 6.'
  },
  { name: 'glow', type: 'number', default: '0.6', description: 'Strength of the glow around the border.' },
  { name: 'intensity', type: 'number', default: '0.8', description: 'Overall brightness of the current.' },
  {
    name: 'arcs',
    type: 'number',
    default: '1',
    description: 'How often sparks leap off the border. 0 turns them off.'
  },
  { name: 'flicker', type: 'number', default: '0.5', description: 'How much the current flickers, from 0 to 1.' },
  {
    name: 'borderRadius',
    type: 'number',
    default: '24',
    description: 'Corner radius of the border, in px. Match it to your content.'
  },
  {
    name: 'offset',
    type: 'number',
    default: '0',
    description: 'Moves the border outward from the edge of the content, in px. Negative values move it inward.'
  },
  {
    name: 'active',
    type: 'boolean',
    default: 'true',
    description: 'Powers the border on or off. Turning it on sends the current racing around the edge again.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The current races around the edge from the top when the border mounts.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'The current surges near the cursor and clicks send a jolt around the edge.'
  },
  {
    name: 'cursorRadius',
    type: 'number',
    default: '90',
    description: 'Size of the area around the cursor where the current surges, in px.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Glowing light for dark pages, or crisp ink with a white core for light ones.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the wrapper.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the wrapper.' }
];

const swapColor = (value: string, swap: Record<string, string>) => {
  const key = `#${String(value).replace(/^#/, '').toLowerCase()}`;
  return swap[key] ?? key;
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const ink = computed(() => INK[theme.value]);
const shown = computed(() => swapColor(props.value.color, theme.value === 'light' ? LIGHT_SWAP : DARK_SWAP));
const scene = computed(() =>
  ['composer', 'pricing', 'upload', 'basic'].includes(props.value.demo) ? props.value.demo : 'composer'
);
const sceneKey = computed(() => `${scene.value}-${rerenderKey.value}`);
const radius = computed(() => props.value.borderRadius);

const border = computed(() => {
  const { demo: _demo, preset: _preset, color: _color, borderRadius: _borderRadius, ...settings } = props.value;
  return { ...settings, color: shown.value, theme: theme.value };
});

const computedProps = computed(() => ({
  color: shown.value,
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const inkVars = computed(() => ({
  '--eb-text': ink.value.text,
  '--eb-muted': ink.value.muted,
  '--eb-panel': ink.value.panel,
  '--eb-panel-rim': ink.value.panelRim,
  '--eb-tile': ink.value.tile,
  '--eb-rim': ink.value.rim,
  '--eb-well': ink.value.well,
  '--eb-well-rim': ink.value.wellRim,
  '--eb-track': ink.value.track,
  '--eb-solid': ink.value.solid,
  '--eb-solid-text': ink.value.solidText
}));

const tileStyle = (size: number) => ({ width: `${size}px`, height: `${size}px` });

const generating = ref(true);
const hovered = ref(false);

watch(sceneKey, () => {
  generating.value = true;
  hovered.value = false;
});

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof Look]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};
</script>

<style scoped>
.demo-container.eb-demo {
  height: 520px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  container-type: inline-size;
  container-name: electric;
}

@media (min-width: 768px) {
  .demo-container.eb-demo {
    height: 560px;
  }
}

:where(.eb-demo) p {
  margin: 0;
}

.eb-panel {
  width: 100%;
  background: var(--eb-panel);
  box-shadow: var(--eb-panel-rim);
}

.eb-tile {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--eb-tile);
  box-shadow: var(--eb-rim);
}

.eb-composer-text {
  padding: 4px 6px 0;
  min-height: 80px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--eb-text);
}

.eb-composer-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.eb-spacer {
  flex: 1;
}

.eb-tool {
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  cursor: pointer;
  background: var(--eb-tile);
  box-shadow: var(--eb-rim);
  transition:
    transform 160ms ease,
    filter 160ms ease;
}

.eb-tool:hover {
  filter: brightness(1.08);
}

.eb-tool:active {
  transform: scale(0.94);
}

.eb-tool--solid {
  background: var(--eb-solid);
  color: var(--eb-solid-text);
  box-shadow: none;
}

.eb-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--eb-text);
  background: var(--eb-tile);
  box-shadow: var(--eb-rim);
}

.eb-pricing {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 300px;
}

.eb-plan-slot {
  height: 370px;
}

.eb-plan-slot--side {
  display: none;
}

@container electric (min-width: 660px) {
  .eb-pricing {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-width: 740px;
  }

  .eb-plan-slot--side {
    display: block;
  }
}

.eb-plan {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 22px;
  text-align: left;
}

.eb-plan-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.eb-plan-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--eb-text);
}

.eb-plan-badge {
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
}

.eb-plan-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 22px;
}

.eb-plan-price {
  font-size: 34px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--eb-text);
}

.eb-plan-per {
  font-size: 13px;
  color: var(--eb-muted);
}

.eb-plan-note {
  margin-top: 8px;
  font-size: 13px;
  color: var(--eb-muted);
}

.eb-plan-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.eb-plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--eb-text);
}

.eb-plan-cta {
  margin-top: auto;
  width: 100%;
  height: 38px;
  border: 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: var(--eb-tile);
  color: var(--eb-text);
  box-shadow: var(--eb-rim);
  transition: filter 200ms ease;
}

.eb-plan-cta:hover {
  filter: brightness(1.08);
}

.eb-plan-cta--solid {
  background: var(--eb-solid);
  color: var(--eb-solid-text);
  box-shadow: none;
}

.eb-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 172px;
  background: var(--eb-well);
  box-shadow: var(--eb-well-rim);
}

.eb-drop-title {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--eb-text);
}

.eb-drop-note {
  font-size: 12px;
  color: var(--eb-muted);
}

.eb-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.eb-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  background: var(--eb-well);
  box-shadow: var(--eb-well-rim);
}

.eb-file-body {
  flex: 1;
  min-width: 0;
}

.eb-file-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.eb-file-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--eb-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.eb-file-size {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--eb-muted);
}

.eb-file-track {
  margin-top: 8px;
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--eb-track);
}

.eb-file-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--eb-text);
  opacity: 0.8;
}

.eb-basic {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 340px;
  padding: 24px;
}

.eb-basic-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--eb-text);
}

.eb-basic-desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--eb-muted);
}
</style>
