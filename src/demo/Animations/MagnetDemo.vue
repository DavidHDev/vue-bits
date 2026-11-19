<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset', 'stiffness', 'damping']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative flex items-center justify-center overflow-hidden"
          :style="{ height: '460px', padding: 0, '--mg-hover': ink.hover }"
        >
          <div
            v-if="props.demo === 'dock'"
            class="mg-demo-dock"
            :style="{ background: ink.panel, boxShadow: ink.panelShadow }"
          >
            <Magnet
              v-for="(icon, index) in DOCK_ICONS"
              :key="index"
              v-bind="magnetProps"
              :exclusive="false"
              :max-offset="14"
            >
              <button
                type="button"
                aria-label="Dock item"
                class="mg-demo-dock-item mg-demo-hoverable"
                :style="{ background: ink.tile, boxShadow: ink.tileShadow, color: ink.text }"
              >
                <HugeiconsIcon :icon="icon" :size="21" :stroke-width="1.6" />
              </button>
            </Magnet>
            <div class="mg-demo-dock-rim" :style="{ boxShadow: ink.panelRim }" />
          </div>

          <Magnet v-else-if="props.demo === 'card'" v-bind="magnetProps" :max-offset="36">
            <div class="mg-demo-card" :style="{ background: ink.tile, boxShadow: ink.cardShadow }">
              <div class="mg-demo-card-cover" :style="{ backgroundImage: `url(${ink.cover})` }" />
              <div class="mg-demo-card-row">
                <div>
                  <p class="mg-demo-card-title" :style="{ color: ink.text }">Afterglow</p>
                  <p class="mg-demo-card-text" :style="{ color: ink.muted }">Golden hour sessions</p>
                </div>
                <button
                  type="button"
                  aria-label="Play"
                  class="mg-demo-card-play"
                  :style="{ background: ink.primary, color: ink.primaryInk, boxShadow: ink.primaryShadow }"
                >
                  <HugeiconsIcon :icon="PlayIcon" :size="17" :stroke-width="2" />
                </button>
              </div>
              <div class="mg-demo-card-track" :style="{ background: ink.track }">
                <div class="mg-demo-card-progress" :style="{ background: ink.text }" />
              </div>
            </div>
          </Magnet>

          <Magnet v-else-if="props.demo === 'basic'" v-bind="magnetProps">
            <button
              type="button"
              class="mg-demo-button mg-demo-hoverable"
              :style="{ background: ink.ghost, color: ink.text, boxShadow: ink.ghostShadow }"
            >
              Hover me
            </button>
          </Magnet>

          <div v-else class="mg-demo-buttons">
            <Magnet v-bind="magnetProps" :max-offset="10">
              <button
                type="button"
                class="mg-demo-button mg-demo-hoverable"
                :style="{ background: ink.primary, color: ink.primaryInk, boxShadow: ink.primaryShadow }"
              >
                Get started
                <HugeiconsIcon :icon="ArrowRight01Icon" :size="16" :stroke-width="2" style="margin-right: -4px" />
              </button>
            </Magnet>
            <Magnet v-bind="magnetProps" :max-offset="10">
              <button
                type="button"
                class="mg-demo-button mg-demo-hoverable"
                :style="{ background: ink.ghost, color: ink.text, boxShadow: ink.ghostShadow }"
              >
                <HugeiconsIcon :icon="GithubIcon" :size="16" :stroke-width="1.8" />
                Star on GitHub
              </button>
            </Magnet>
          </div>
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
            @update:model-value="applyPreset"
          />
          <PreviewSelect
            title="Axis"
            :options="AXIS_OPTIONS"
            :model-value="props.axis"
            @update:model-value="value => updateProp('axis', value as MagnetAxis)"
          />
          <PreviewSlider
            title="Padding"
            :min="0"
            :max="300"
            :step="10"
            value-unit="px"
            :model-value="props.padding"
            @update:model-value="value => updateProp('padding', value)"
          />
          <PreviewSlider
            title="Strength"
            :min="1"
            :max="10"
            :step="0.1"
            :model-value="props.magnetStrength"
            @update:model-value="value => updateProp('magnetStrength', value)"
          />
          <PreviewSlider
            title="Stiffness"
            :min="20"
            :max="600"
            :step="10"
            :model-value="props.stiffness"
            @update:model-value="value => updateProp('stiffness', value)"
          />
          <PreviewSlider
            title="Damping"
            :min="2"
            :max="40"
            :step="1"
            :model-value="props.damping"
            @update:model-value="value => updateProp('damping', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="30"
            :step="1"
            value-unit="°"
            :model-value="props.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="1"
            :max="1.2"
            :step="0.01"
            :model-value="props.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSwitch
            title="Disabled"
            :model-value="props.disabled"
            @update:model-value="value => updateProp('disabled', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="magnet" component-name="Magnet" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ArrowRight01Icon as ArrowRight01IconRaw,
  GithubIcon as GithubIconRaw,
  Home01Icon,
  Message01Icon,
  Notification03Icon,
  PlayIcon as PlayIconRaw,
  Search01Icon,
  Settings02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { magnet } from '@/constants/code/Animations/magnetCode';
import Magnet, { type MagnetAxis } from '@/content/Animations/Magnet/Magnet.vue';

const ArrowRight01Icon = ArrowRight01IconRaw as IconArray;
const GithubIcon = GithubIconRaw as IconArray;
const PlayIcon = PlayIconRaw as IconArray;

const INK = {
  dark: {
    text: '#f4f4f5',
    muted: 'rgba(244, 244, 245, 0.56)',
    hover: 'brightness(1.12)',
    primary: 'linear-gradient(to bottom, #ffffff, #ebedeb)',
    primaryInk: '#111111',
    primaryShadow:
      'inset 0 1px 0 #ffffff, inset 0 -1px 0 rgba(17, 17, 17, 0.1), 0 1px 2px rgba(0, 0, 0, 0.3), 0 10px 24px -10px rgba(0, 0, 0, 0.6)',
    ghost: 'rgba(255, 255, 255, 0.08)',
    ghostShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
    panel: 'rgba(34, 37, 34, 0.66)',
    panelShadow: '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    panelRim: 'inset 0 1px 0 rgba(255, 255, 255, 0.07), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
    tile: 'linear-gradient(180deg, #363a36 0%, #252825 100%)',
    tileShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.07), 0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    cardShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.06), 0 30px 60px -30px rgba(0, 0, 0, 0.85), 0 10px 24px -14px rgba(0, 0, 0, 0.55)',
    track: 'rgba(255, 255, 255, 0.12)',
    cover: '/assets/demo/night-sky.webp'
  },
  light: {
    text: '#161816',
    muted: 'rgba(22, 24, 22, 0.56)',
    hover: 'brightness(0.97)',
    primary: 'linear-gradient(to bottom, #282b28, #151715)',
    primaryInk: '#ffffff',
    primaryShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 1px 2px rgba(22, 24, 22, 0.25), 0 10px 24px -12px rgba(22, 24, 22, 0.5)',
    ghost: 'rgba(255, 255, 255, 0.72)',
    ghostShadow: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08), 0 1px 2px rgba(22, 24, 22, 0.05)',
    panel: 'rgba(240, 242, 240, 0.8)',
    panelShadow: '0 22px 44px -22px rgba(22, 24, 22, 0.3), 0 6px 16px -10px rgba(22, 24, 22, 0.16)',
    panelRim: 'inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 0 0 1px rgba(22, 24, 22, 0.07)',
    tile: 'linear-gradient(180deg, #ffffff 0%, #f5f7f5 100%)',
    tileShadow: 'inset 0 1px 0 #ffffff, inset 0 0 0 1px rgba(22, 24, 22, 0.08), 0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    cardShadow:
      'inset 0 1px 0 #ffffff, inset 0 0 0 1px rgba(22, 24, 22, 0.07), 0 30px 60px -32px rgba(22, 24, 22, 0.35), 0 10px 24px -16px rgba(22, 24, 22, 0.2)',
    track: 'rgba(22, 24, 22, 0.1)',
    cover: '/assets/demo/day-sky.webp'
  }
};

const DOCK_ICONS = [Home01Icon, Search01Icon, Notification03Icon, Message01Icon, Settings02Icon] as IconArray[];

const FEEL = {
  padding: 100,
  magnetStrength: 2,
  stiffness: 170,
  damping: 16,
  tilt: 6,
  scale: 1,
  axis: 'both' as MagnetAxis
};

const DEFAULT_PROPS = {
  demo: 'buttons',
  preset: 'default',
  ...FEEL,
  disabled: false
};

type Feel = typeof FEEL;

const PRESETS: Record<string, Feel> = {
  default: { ...FEEL },
  subtle: { ...FEEL, padding: 60, magnetStrength: 5, stiffness: 150, damping: 20, tilt: 3 },
  snappy: { ...FEEL, padding: 90, stiffness: 420, damping: 28 },
  elastic: { ...FEEL, padding: 110, magnetStrength: 1.6, stiffness: 240, damping: 8 },
  floaty: { ...FEEL, padding: 140, magnetStrength: 2.4, stiffness: 50, damping: 9 },
  sticky: { ...FEEL, padding: 180, magnetStrength: 1.2, stiffness: 200, damping: 18 },
  lift: { ...FEEL, magnetStrength: 3, tilt: 14, scale: 1.06 }
};

const PRESET_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'snappy', label: 'Snappy' },
  { value: 'elastic', label: 'Elastic' },
  { value: 'floaty', label: 'Floaty' },
  { value: 'sticky', label: 'Sticky' },
  { value: 'lift', label: 'Lift' }
];

const DEMO_OPTIONS = [
  { value: 'buttons', label: 'Buttons' },
  { value: 'dock', label: 'Dock' },
  { value: 'card', label: 'Card' },
  { value: 'basic', label: 'Basic' }
];

const AXIS_OPTIONS = [
  { value: 'both', label: 'Both' },
  { value: 'x', label: 'Horizontal' },
  { value: 'y', label: 'Vertical' }
];

const propData: PropRow[] = [
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'The content that moves toward the cursor.'
  },
  {
    name: 'padding',
    type: 'number',
    default: '100',
    description: 'Distance in pixels around the element where the cursor starts to pull it.'
  },
  {
    name: 'magnetStrength',
    type: 'number',
    default: '2',
    description:
      'How far the element follows the cursor. The offset is divided by this value, so 1 follows the cursor and higher values move less.'
  },
  {
    name: 'exclusive',
    type: 'boolean',
    default: 'true',
    description:
      'When several magnets are in range, only the nearest exclusive one is pulled. Turn it off to let a group, like dock icons, lean toward the cursor together.'
  },
  {
    name: 'axis',
    type: "'both' | 'x' | 'y'",
    default: "'both'",
    description: 'Limits the movement to one axis.'
  },
  {
    name: 'maxOffset',
    type: 'number',
    default: '-',
    description: 'Caps how far the element can move from its resting place, in pixels.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Maximum 3D tilt toward the cursor, in degrees.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Scale of the element while the cursor pulls it.'
  },
  {
    name: 'spring',
    type: '{ stiffness?: number; damping?: number; mass?: number }',
    default: '{ stiffness: 170, damping: 16, mass: 1 }',
    description:
      'Spring that drives the movement. Higher stiffness reacts faster, lower damping lets it overshoot and wobble back.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Turns the effect off and lets the element spring back to rest.'
  },
  {
    name: '@active-change',
    type: '(active: boolean) => void',
    default: '-',
    description:
      'Emitted when the cursor enters or leaves the magnetic area. The wrapper also gets a data-magnet-active attribute.'
  },
  {
    name: 'wrapperClassName',
    type: 'string',
    default: "''",
    description: 'Class name for the outer wrapper, which stays in place.'
  },
  {
    name: 'innerClassName',
    type: 'string',
    default: "''",
    description: 'Class name for the inner element that moves.'
  },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the outer wrapper.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const ink = useColorModeValue(INK.light, INK.dark);

const spring = computed(() => ({ stiffness: props.value.stiffness, damping: props.value.damping }));
const computedProps = computed(() => ({ spring: spring.value }));

const magnetProps = computed(() => {
  const { demo: _demo, preset: _preset, stiffness: _stiffness, damping: _damping, ...rest } = props.value;
  return { ...rest, spring: spring.value };
});

const applyPreset = (value: string | number) => {
  const key = String(value);
  const base = Object.fromEntries(
    Object.keys(FEEL).map(name => [name, defaultProps.value[name as keyof Feel]])
  ) as Partial<Feel>;
  updateProps({ ...base, ...PRESETS[key], preset: key });
};
</script>

<style scoped>
.mg-demo-buttons {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.mg-demo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
}

.mg-demo-hoverable {
  transition: filter 200ms ease;
}

.mg-demo-hoverable:hover {
  filter: var(--mg-hover);
}

.mg-demo-dock {
  position: relative;
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 22px;
  backdrop-filter: blur(20px) saturate(1.6);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
}

.mg-demo-dock-item {
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 14px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.mg-demo-dock-rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.mg-demo-card {
  width: 288px;
  padding: 14px;
  border-radius: 22px;
}

.mg-demo-card-cover {
  height: 168px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
}

.mg-demo-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding: 0 4px;
}

.mg-demo-card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.mg-demo-card-text {
  margin: 0;
  font-size: 13px;
}

.mg-demo-card-play {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.mg-demo-card-track {
  margin: 14px 4px 4px;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
}

.mg-demo-card-progress {
  height: 100%;
  width: 38%;
  border-radius: 2px;
}
</style>
