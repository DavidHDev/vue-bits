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
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <Ballpit :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Balls! What's not to like about them?" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="6"
            :model-value="settings.colors"
            @update:model-value="(value: string[]) => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Material"
            :options="MATERIAL_OPTIONS"
            :model-value="settings.material"
            @update:model-value="(value: string | number) => updateProp('material', value as BallpitMaterial)"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickEffect"
            @update:model-value="(value: string | number) => updateProp('clickEffect', value as 'burst' | 'none')"
          />
          <PreviewColorPickerCustom
            title="Light Color"
            :color="settings.lightColor"
            @change="(value: string) => updateProp('lightColor', value)"
          />
          <PreviewSlider
            title="Count"
            :min="10"
            :max="1000"
            :step="10"
            :model-value="settings.count"
            @update:model-value="(value: number) => updateProp('count', value)"
          />
          <PreviewSlider
            title="Min Size"
            :min="0.1"
            :max="2"
            :step="0.05"
            :model-value="settings.minSize"
            @update:model-value="(value: number) => updateProp('minSize', value)"
          />
          <PreviewSlider
            title="Max Size"
            :min="0.1"
            :max="2"
            :step="0.05"
            :model-value="settings.maxSize"
            @update:model-value="(value: number) => updateProp('maxSize', value)"
          />
          <PreviewSlider
            title="Gravity"
            :min="0"
            :max="2"
            :step="0.01"
            :model-value="settings.gravity"
            @update:model-value="(value: number) => updateProp('gravity', value)"
          />
          <PreviewSlider
            title="Friction"
            :min="0.95"
            :max="1"
            :step="0.0005"
            :model-value="settings.friction"
            @update:model-value="(value: number) => updateProp('friction', value)"
          />
          <PreviewSlider
            title="Wall Bounce"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.wallBounce"
            @update:model-value="(value: number) => updateProp('wallBounce', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bounce"
            @update:model-value="(value: number) => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="6"
            :step="0.25"
            :model-value="settings.depth"
            @update:model-value="(value: number) => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Drift"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.drift"
            @update:model-value="(value: number) => updateProp('drift', value)"
          />
          <PreviewSlider
            title="Cursor Size"
            :min="0.2"
            :max="3"
            :step="0.1"
            :model-value="settings.cursorSize"
            :is-disabled="!settings.followCursor"
            @update:model-value="(value: number) => updateProp('cursorSize', value)"
          />
          <PreviewSlider
            title="Light Intensity"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.lightIntensity"
            @update:model-value="(value: number) => updateProp('lightIntensity', value)"
          />
          <PreviewSlider
            title="Exposure"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.exposure"
            @update:model-value="(value: number) => updateProp('exposure', value)"
          />
          <PreviewSlider
            title="Shadows"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.shadows"
            @update:model-value="(value: number) => updateProp('shadows', value)"
          />
          <PreviewSwitch
            title="Follow Cursor"
            :model-value="settings.followCursor"
            @update:model-value="(value: boolean) => updateProp('followCursor', value)"
          />
          <PreviewSwitch
            title="Grab"
            :model-value="settings.grab"
            @update:model-value="(value: boolean) => updateProp('grab', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="ballpit" component-name="Ballpit" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
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
import { useColorMode } from '@/composables/useTheme';
import { ballpit } from '@/constants/code/Backgrounds/ballpitCode';
import Ballpit from '@/content/Backgrounds/Ballpit/Ballpit.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Ballpit';

type BallpitMaterial = 'satin' | 'matte' | 'gloss' | 'frosted' | 'metal';

const MATERIAL_OPTIONS = [
  { value: 'satin', label: 'Satin' },
  { value: 'matte', label: 'Matte' },
  { value: 'gloss', label: 'Gloss' },
  { value: 'frosted', label: 'Frosted' },
  { value: 'metal', label: 'Metal' }
];

const CLICK_OPTIONS = [
  { value: 'burst', label: 'Burst' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  { name: 'count', type: 'number', default: '200', description: 'Number of balls in the pit.' },
  {
    name: 'colors',
    type: 'Array<string | number>',
    default: "['#ffffff']",
    description: 'Ball colors, handed out in turn. Hex strings or numbers such as 0x42b883.'
  },
  {
    name: 'material',
    type: "'satin' | 'matte' | 'gloss' | 'frosted' | 'metal'",
    default: "'satin'",
    description: 'Surface finish: soft satin, chalky matte, polished gloss, see-through frosted or brushed metal.'
  },
  {
    name: 'minSize',
    type: 'number',
    default: '0.5',
    description: 'Smallest ball radius. The view is about 18 units tall.'
  },
  { name: 'maxSize', type: 'number', default: '1', description: 'Largest ball radius.' },
  {
    name: 'gravity',
    type: 'number',
    default: '0.5',
    description: 'Pull toward the floor. 0 lets the balls float, around 0.5 piles them up.'
  },
  {
    name: 'friction',
    type: 'number',
    default: '0.9975',
    description: 'How much speed the balls keep each frame. 1 never slows them down.'
  },
  {
    name: 'wallBounce',
    type: 'number',
    default: '0.95',
    description: 'How much speed the balls keep when they hit the edges, from 0 to 1.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.85',
    description: 'How bouncy the balls are against each other, from 0 to 1.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '2',
    description: 'How deep the pit is, so balls can sit in front of and behind each other.'
  },
  {
    name: 'drift',
    type: 'number',
    default: '0',
    description: 'Gentle wandering that keeps floating balls moving on their own.'
  },
  {
    name: 'followCursor',
    type: 'boolean',
    default: 'true',
    description: 'A ball follows the cursor and shoves the others out of the way.'
  },
  { name: 'cursorSize', type: 'number', default: '1', description: 'Radius of the cursor ball.' },
  {
    name: 'grab',
    type: 'boolean',
    default: 'true',
    description: 'Press on a ball to pick it up, drag it around and throw it.'
  },
  {
    name: 'clickEffect',
    type: "'burst' | 'none'",
    default: "'burst'",
    description: 'Clicking an empty spot blasts the nearby balls away with a flash of light.'
  },
  {
    name: 'lightColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the light that follows the cursor and lights up the balls around it.'
  },
  { name: 'lightIntensity', type: 'number', default: '1', description: 'Brightness of the cursor light.' },
  { name: 'exposure', type: 'number', default: '1', description: 'Overall brightness of the balls.' },
  {
    name: 'shadows',
    type: 'number',
    default: '0.6',
    description: 'Strength of the soft shadows where balls touch each other and the floor.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Balls pour in from the top on mount, or burst out from the center when gravity is near zero.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { isLight } = useColorMode();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: isLight.value, defaults: defaultProps.value }), preset: value });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
