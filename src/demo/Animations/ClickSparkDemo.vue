<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset', 'sparkColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          ref="stageRef"
          class="demo-container relative overflow-hidden"
          style="height: 420px; padding: 0; cursor: crosshair"
        >
          <ClickSpark :key="rerenderKey" ref="sparkRef" :spark-color="colors" v-bind="settings">
            <div class="click-spark-demo-stage">
              <div v-if="props.demo === 'buttons'" class="click-spark-demo-actions">
                <div v-for="action in actions" :key="action.label" class="click-spark-demo-action">
                  <button
                    :ref="action.label === 'Like' ? setLikeRef : undefined"
                    type="button"
                    class="click-spark-demo-button"
                    :aria-label="action.label"
                    :aria-pressed="action.active"
                    :style="{
                      background: ink.tile,
                      boxShadow: ink.rim,
                      color: action.active ? action.tone : ink.text,
                      '--click-spark-hover': ink.hover,
                      '--click-spark-press': ink.press
                    }"
                    @click="action.toggle"
                  >
                    <span
                      class="click-spark-demo-icon"
                      :style="{ transform: action.active ? 'scale(1.12)' : 'scale(1)' }"
                    >
                      <HugeiconsIcon
                        :icon="action.icon"
                        :size="18"
                        :stroke-width="1.8"
                        :fill="action.active ? 'currentColor' : 'none'"
                      />
                    </span>
                  </button>
                  <span
                    v-if="action.count !== undefined"
                    class="click-spark-demo-count"
                    :style="{ color: action.active ? ink.text : ink.muted }"
                  >
                    {{ action.count }}
                  </span>
                </div>
              </div>
            </div>
          </ClickSpark>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="6"
            :model-value="colors"
            @update:model-value="value => updateProp('sparkColor', value)"
          />
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
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', value as ClickSparkShape)"
          />
          <PreviewSelect
            title="Easing"
            :options="EASING_OPTIONS"
            :model-value="settings.easing"
            @update:model-value="value => updateProp('easing', value as ClickSparkEasing)"
          />
          <PreviewSelect
            title="Layer"
            :options="LAYER_OPTIONS"
            :model-value="settings.layer"
            @update:model-value="value => updateProp('layer', value as 'front' | 'back')"
          />
          <PreviewSlider
            title="Count"
            :min="1"
            :max="32"
            :step="1"
            :model-value="settings.sparkCount"
            @update:model-value="value => updateProp('sparkCount', value)"
          />
          <PreviewSlider
            title="Size"
            :min="4"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="settings.sparkSize"
            @update:model-value="value => updateProp('sparkSize', value)"
          />
          <PreviewSlider
            title="Width"
            :min="1"
            :max="6"
            :step="0.5"
            value-unit="px"
            :model-value="settings.sparkWidth"
            @update:model-value="value => updateProp('sparkWidth', value)"
          />
          <PreviewSlider
            title="Distance"
            :min="8"
            :max="120"
            :step="1"
            value-unit="px"
            :model-value="settings.sparkRadius"
            @update:model-value="value => updateProp('sparkRadius', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="200"
            :max="1600"
            :step="50"
            value-unit="ms"
            :model-value="settings.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Randomness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.randomness"
            @update:model-value="value => updateProp('randomness', value)"
          />
          <PreviewSlider
            title="Gravity"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.gravity"
            @update:model-value="value => updateProp('gravity', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="20"
            :max="360"
            :step="5"
            value-unit="°"
            :model-value="settings.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Direction"
            :min="-180"
            :max="180"
            :step="5"
            value-unit="°"
            :is-disabled="settings.spread >= 360"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSwitch
            title="Ring"
            :model-value="settings.ring"
            @update:model-value="value => updateProp('ring', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="clickSpark" component-name="ClickSpark" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch, type ComponentPublicInstance } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Bookmark02Icon, Comment01Icon, FavouriteIcon, RepostIcon } from '@hugeicons/core-free-icons';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
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
import { clickSpark } from '@/constants/code/Animations/clickSparkCode';
import ClickSpark, {
  type ClickSparkEasing,
  type ClickSparkHandle,
  type ClickSparkShape
} from '@/content/Animations/ClickSpark/ClickSpark.vue';
import { LOOK, PRESET_OPTIONS, presetProps } from './presets/ClickSpark';

const INK = {
  dark: {
    text: '#f4f5f4',
    muted: 'rgba(244, 245, 244, 0.62)',
    tile: 'linear-gradient(180deg, #363a36 0%, #242724 100%)',
    rim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    hover: 'brightness(1.12)',
    press: 'brightness(0.85)'
  },
  light: {
    text: '#161816',
    muted: 'rgba(22, 24, 22, 0.62)',
    tile: 'linear-gradient(180deg, #ffffff 0%, #f6f8f6 100%)',
    rim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    hover: 'brightness(0.97)',
    press: 'brightness(0.92)'
  }
};

const DEFAULT_PROPS = {
  demo: 'buttons',
  preset: 'classic',
  ...LOOK,
  layer: 'back' as 'front' | 'back'
};

const LIGHT_SWAP: Record<string, string> = {
  '#ffffff': '#18181b',
  '#fde68a': '#d97706',
  '#fbbf24': '#f59e0b',
  '#7dd3fc': '#0284c7'
};

const DARK_SWAP: Record<string, string> = Object.fromEntries(
  Object.entries(LIGHT_SWAP).map(([dark, light]) => [light, dark])
);

const DEMO_OPTIONS = [
  { value: 'buttons', label: 'Buttons' },
  { value: 'basic', label: 'Basic' }
];

const LAYER_OPTIONS = [
  { value: 'back', label: 'Behind' },
  { value: 'front', label: 'In Front' }
];

const SHAPE_OPTIONS = [
  { value: 'line', label: 'Line' },
  { value: 'streak', label: 'Streak' },
  { value: 'dot', label: 'Dot' },
  { value: 'star', label: 'Star' }
];

const EASING_OPTIONS = [
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'linear', label: 'Linear' },
  { value: 'spring', label: 'Spring' }
];

const propData: PropRow[] = [
  {
    name: 'sparkColor',
    type: 'string | string[]',
    default: "'#fff'",
    description: 'Color of the sparks. Pass a list to mix colors through each burst.'
  },
  {
    name: 'shape',
    type: "'line' | 'streak' | 'dot' | 'star'",
    default: "'line'",
    description: 'Look of each spark: a short dash, a comet with a fading tail, a round dot, or a twinkling star.'
  },
  { name: 'sparkCount', type: 'number', default: '8', description: 'Number of sparks in each burst.' },
  { name: 'sparkSize', type: 'number', default: '14', description: 'Length of each spark, in px.' },
  { name: 'sparkWidth', type: 'number', default: '2', description: 'Thickness of each spark, in px.' },
  {
    name: 'sparkRadius',
    type: 'number',
    default: '30',
    description: 'How far the sparks travel from the click, in px.'
  },
  { name: 'duration', type: 'number', default: '500', description: 'Length of a burst, in ms.' },
  {
    name: 'easing',
    type: "'ease-out' | 'ease-in-out' | 'ease-in' | 'linear' | 'spring'",
    default: "'ease-out'",
    description: 'How the sparks slow down as they fly out. Spring overshoots a little and settles back.'
  },
  {
    name: 'randomness',
    type: 'number',
    default: '0.2',
    description: 'Varies the angle, length and speed of each spark, from 0 to 1. 0 gives a perfect star.'
  },
  { name: 'gravity', type: 'number', default: '0', description: 'Pulls the sparks down as they fly, from 0 to 2.' },
  {
    name: 'spread',
    type: 'number',
    default: '360',
    description: 'Angle the sparks fan across, in degrees. 360 is a full circle.'
  },
  {
    name: 'direction',
    type: 'number',
    default: '0',
    description: 'Where a partial spread points, in degrees. 0 is up and 90 is right.'
  },
  { name: 'glow', type: 'number', default: '0', description: 'Soft light around each spark, from 0 to 1.' },
  { name: 'ring', type: 'boolean', default: 'false', description: 'Adds a thin ring that expands from the click.' },
  {
    name: 'layer',
    type: "'front' | 'back'",
    default: "'front'",
    description: 'Draws the sparks over your content, or behind it so they burst out around buttons and cards.'
  },
  {
    name: 'extraScale',
    type: 'number',
    default: '1',
    description: 'Multiplies how far the sparks travel.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Stops new bursts.' },
  {
    name: 'ref',
    type: '{ spark: (x?: number, y?: number) => void }',
    default: '-',
    description: 'Call spark() to fire a burst from code. x and y are in px from the top left; it centers without them.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the wrapper.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the wrapper.' },
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'Content to wrap. Clicks anywhere inside it send sparks, which can spill past its edges.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue('light', 'dark');
const ink = computed(() => INK[theme.value as 'light' | 'dark']);

const sparkRef = useTemplateRef<ClickSparkHandle>('sparkRef');
const stageRef = useTemplateRef<HTMLDivElement>('stageRef');
const likeRef = ref<HTMLElement | null>(null);
const setLikeRef = (el: Element | ComponentPublicInstance | null) => {
  likeRef.value = el instanceof HTMLElement ? el : null;
};

const liked = ref(false);
const reposted = ref(false);
const saved = ref(false);

const settings = computed(() => {
  const { demo: _demo, preset: _preset, sparkColor: _sparkColor, ...rest } = props.value;
  return rest;
});

const colors = computed(() => {
  const sparkColor = props.value.sparkColor;
  const palette = Array.isArray(sparkColor) && sparkColor.length ? sparkColor : LOOK.sparkColor;
  const swap = theme.value === 'light' ? LIGHT_SWAP : DARK_SWAP;
  return palette.map(color => swap[color.toLowerCase()] ?? color);
});

const computedProps = computed(() => ({
  sparkColor: colors.value.length === 1 ? colors.value[0] : colors.value
}));

const actions = computed(() => [
  { label: 'Reply', icon: Comment01Icon, count: 12, active: undefined, tone: '', toggle: undefined },
  {
    label: 'Repost',
    icon: RepostIcon,
    count: reposted.value ? 5 : 4,
    active: reposted.value,
    tone: '#22c55e',
    toggle: () => (reposted.value = !reposted.value)
  },
  {
    label: 'Like',
    icon: FavouriteIcon,
    count: liked.value ? 129 : 128,
    active: liked.value,
    tone: '#f43f5e',
    toggle: () => (liked.value = !liked.value)
  },
  {
    label: 'Save',
    icon: Bookmark02Icon,
    count: undefined,
    active: saved.value,
    tone: ink.value.text,
    toggle: () => (saved.value = !saved.value)
  }
]);

const applyPreset = (input: string | number) => {
  const value = String(input);
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};

let timers: number[] = [];

const clearTimers = () => {
  timers.forEach(window.clearTimeout);
  timers = [];
};

watch(
  [() => props.value.demo, rerenderKey],
  ([demo]) => {
    clearTimers();
    liked.value = false;
    reposted.value = false;
    saved.value = false;
    const fire = (fx: number, fy: number, delay: number) =>
      timers.push(
        window.setTimeout(() => {
          const stage = stageRef.value;
          if (!stage) return;
          sparkRef.value?.spark(stage.clientWidth * fx, stage.clientHeight * fy);
        }, delay)
      );
    if (demo === 'basic') {
      fire(0.34, 0.42, 450);
      fire(0.64, 0.6, 750);
      fire(0.5, 0.3, 1050);
    } else {
      timers.push(
        window.setTimeout(() => {
          const stage = stageRef.value;
          const like = likeRef.value;
          if (!stage || !like) return;
          const a = stage.getBoundingClientRect();
          const b = like.getBoundingClientRect();
          liked.value = true;
          sparkRef.value?.spark(b.left - a.left + b.width / 2, b.top - a.top + b.height / 2);
        }, 600)
      );
    }
  },
  { immediate: true }
);

onBeforeUnmount(clearTimers);
</script>

<style scoped>
.click-spark-demo-stage {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 16px;
}

.click-spark-demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.click-spark-demo-action {
  display: flex;
  align-items: center;
  gap: 8px;
}

.click-spark-demo-button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  transition: filter 200ms ease;
}

.click-spark-demo-button:hover {
  filter: var(--click-spark-hover);
}

.click-spark-demo-button:active {
  filter: var(--click-spark-press);
}

.click-spark-demo-icon {
  display: inline-grid;
  transition: transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.click-spark-demo-count {
  min-width: 24px;
  font-size: 13px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

@media (min-width: 768px) {
  .click-spark-demo-stage {
    padding: 24px;
  }

  .click-spark-demo-actions {
    gap: 22px;
  }
}
</style>
