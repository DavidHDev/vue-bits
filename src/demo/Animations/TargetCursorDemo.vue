<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div ref="stageRef" class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <div class="flex flex-col items-center gap-[20px]">
            <div
              class="cursor-target w-[260px] h-[170px] md:w-[320px] md:h-[200px] rounded-[20px] overflow-hidden"
              data-cursor-label="View"
              style="background: var(--bg-elevated)"
            >
              <img
                :src="photo"
                alt=""
                :draggable="false"
                style="width: 100%; height: 100%; object-fit: cover; display: block"
              />
            </div>
            <div class="flex items-center gap-[12px]">
              <button
                type="button"
                class="cursor-target flex items-center gap-[8px] h-[48px] px-[22px] rounded-[12px] text-[15px] font-semibold"
                data-cursor-label="Play"
                style="background: var(--text-primary); color: var(--bg-body)"
              >
                <HugeiconsIcon :icon="PlayIcon" :size="18" :stroke-width="2" />
                Play
              </button>
              <button type="button" :class="roundClass" :style="roundStyle" data-cursor-label="Like">
                <HugeiconsIcon :icon="FavouriteIcon" :size="20" :stroke-width="1.8" />
              </button>
              <button type="button" :class="roundClass" :style="roundStyle" data-cursor-label="Share">
                <HugeiconsIcon :icon="Share08Icon" :size="20" :stroke-width="1.8" />
              </button>
            </div>
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewColorPickerCustom
            title="Cursor Color"
            :color="settings.cursorColor"
            @change="(value: string) => updateProp('cursorColor', value)"
          />
          <PreviewColorPickerCustom
            title="Color On Target"
            :color="settings.cursorColorOnTarget"
            @change="(value: string) => updateProp('cursorColorOnTarget', value)"
          />
          <PreviewSelect
            title="Blend Mode"
            :options="BLEND_OPTIONS"
            :model-value="settings.blendMode"
            @update:model-value="value => updateProp('blendMode', value as BlendMode)"
          />
          <PreviewSlider
            title="Spin Duration"
            :min="0"
            :max="5"
            :step="0.1"
            value-unit="s"
            :model-value="settings.spinDuration"
            @update:model-value="value => updateProp('spinDuration', value)"
          />
          <PreviewSlider
            title="Hover Duration"
            :min="0.05"
            :max="1"
            :step="0.05"
            value-unit="s"
            :model-value="settings.hoverDuration"
            @update:model-value="value => updateProp('hoverDuration', value)"
          />
          <PreviewSlider
            title="Size"
            :min="16"
            :max="80"
            :step="1"
            value-unit="px"
            :model-value="settings.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Corner Size"
            :min="4"
            :max="30"
            :step="1"
            value-unit="px"
            :model-value="settings.cornerSize"
            @update:model-value="value => updateProp('cornerSize', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="1"
            :max="6"
            :step="0.5"
            value-unit="px"
            :model-value="settings.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Padding"
            :min="0"
            :max="24"
            :step="1"
            value-unit="px"
            :model-value="settings.padding"
            @update:model-value="value => updateProp('padding', value)"
          />
          <PreviewSlider
            title="Dot Size"
            :min="0"
            :max="12"
            :step="1"
            value-unit="px"
            :model-value="settings.dotSize"
            @update:model-value="value => updateProp('dotSize', value)"
          />
          <PreviewSwitch
            title="Match Radius"
            :model-value="settings.matchRadius"
            @update:model-value="value => updateProp('matchRadius', value)"
          />
          <PreviewSwitch
            title="Parallax"
            :model-value="settings.parallaxOn"
            @update:model-value="value => updateProp('parallaxOn', value)"
          />
          <PreviewSwitch
            title="Show Label"
            :model-value="settings.showLabel"
            @update:model-value="value => updateProp('showLabel', value)"
          />
          <PreviewSwitch
            title="Click Effect"
            :model-value="settings.clickEffect"
            @update:model-value="value => updateProp('clickEffect', value)"
          />
          <PreviewSwitch
            title="Hide Default Cursor"
            :model-value="settings.hideDefaultCursor"
            @update:model-value="value => updateProp('hideDefaultCursor', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="targetCursor" component-name="TargetCursor" />
      </template>
    </TabsLayout>

    <TargetCursor v-bind="settings" :container="stageRef" />
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { FavouriteIcon, PlayIcon, Share08Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { targetCursor } from '@/constants/code/Animations/targetCursorCode';
import TargetCursor from '@/content/Animations/TargetCursor/TargetCursor.vue';

type BlendMode = 'difference' | 'exclusion' | 'normal';

const LOOK = {
  spinDuration: 2,
  hoverDuration: 0.2,
  size: 36,
  cornerSize: 12,
  thickness: 3,
  padding: 6,
  dotSize: 4
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  cursorColor: '#ffffff',
  cursorColorOnTarget: '#ffffff',
  blendMode: 'difference' as BlendMode,
  parallaxOn: true,
  matchRadius: true,
  showLabel: true,
  clickEffect: true,
  hideDefaultCursor: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  classic: { ...LOOK },
  calm: { ...LOOK, spinDuration: 0, thickness: 1.5, cornerSize: 10, padding: 8, size: 30, hoverDuration: 0.35 },
  bold: { ...LOOK, spinDuration: 3, thickness: 4, cornerSize: 18, padding: 10, size: 46, dotSize: 6 },
  tight: { ...LOOK, spinDuration: 1.2, thickness: 2, cornerSize: 8, padding: 2, size: 24, hoverDuration: 0.12 }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'calm', label: 'Calm' },
  { value: 'bold', label: 'Bold' },
  { value: 'tight', label: 'Tight' }
];

const BLEND_OPTIONS = [
  { value: 'difference', label: 'Difference' },
  { value: 'exclusion', label: 'Exclusion' },
  { value: 'normal', label: 'Normal' }
];

const propData: PropRow[] = [
  {
    name: 'targetSelector',
    type: 'string',
    default: "'.cursor-target'",
    description: 'CSS selector for the elements the brackets lock onto.'
  },
  { name: 'cursorColor', type: 'string', default: "'#ffffff'", description: 'Color of the brackets and dot.' },
  {
    name: 'cursorColorOnTarget',
    type: 'string',
    default: '-',
    description: 'Color the cursor blends to while locked onto a target.'
  },
  {
    name: 'spinDuration',
    type: 'number',
    default: '2',
    description: 'Seconds per turn while the cursor roams. 0 stops the spin.'
  },
  {
    name: 'hoverDuration',
    type: 'number',
    default: '0.2',
    description: 'How long the brackets take to snap onto a target, in seconds.'
  },
  {
    name: 'parallaxOn',
    type: 'boolean',
    default: 'true',
    description: 'Lets the locked brackets lean slightly toward the cursor.'
  },
  {
    name: 'hideDefaultCursor',
    type: 'boolean',
    default: 'true',
    description: 'Hides the system cursor while this cursor is shown.'
  },
  { name: 'size', type: 'number', default: '36', description: 'Size of the reticle while roaming, in px.' },
  { name: 'cornerSize', type: 'number', default: '12', description: 'Length of each bracket arm, in px.' },
  { name: 'thickness', type: 'number', default: '3', description: 'Stroke width of the brackets, in px.' },
  {
    name: 'padding',
    type: 'number',
    default: '6',
    description: 'Gap between a locked target and the brackets, in px.'
  },
  {
    name: 'matchRadius',
    type: 'boolean',
    default: 'true',
    description: "Rounds the brackets to follow the target's corner radius."
  },
  { name: 'dotSize', type: 'number', default: '4', description: 'Size of the center dot, in px. 0 hides it.' },
  {
    name: 'blendMode',
    type: 'string',
    default: "'difference'",
    description: 'CSS blend mode of the cursor. Difference keeps it visible on any background.'
  },
  {
    name: 'showLabel',
    type: 'boolean',
    default: 'true',
    description: 'Shows the data-cursor-label text of a locked target above the brackets.'
  },
  {
    name: 'clickEffect',
    type: 'boolean',
    default: 'true',
    description: 'Squeezes the brackets and dot while the mouse button is held.'
  },
  {
    name: 'container',
    type: 'Ref<HTMLElement> | HTMLElement',
    default: '-',
    description: 'Limits the cursor to one element. By default it works across the whole page.'
  }
];

const stageRef = ref<HTMLElement | null>(null);
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});
const theme = useColorModeValue('light', 'dark');
const photo = computed(() => `/assets/demo/${theme.value === 'light' ? 'day' : 'night'}-sky.webp`);

const roundClass = 'cursor-target w-[48px] h-[48px] rounded-full grid place-items-center';
const roundStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)'
};

const applyPreset = (value: string | number) => {
  const key = String(value);
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({
    ...base,
    ...PRESETS[key],
    cursorColor: settings.value.cursorColor,
    cursorColorOnTarget: settings.value.cursorColorOnTarget,
    blendMode: settings.value.blendMode,
    preset: key
  });
};
</script>
