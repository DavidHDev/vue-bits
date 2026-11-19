<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'textColor', 'pressureColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 430px; margin-bottom: 1.5rem">
          <RefreshButton @click="forceRerender" />
          <div style="width: 100%; height: 100%; min-height: 0">
            <TextPressure
              :key="rerenderKey"
              v-bind="settings"
              :text-color="props.textColor || 'currentColor'"
              :pressure-color="props.pressureColor"
              :min-font-size="36"
            />
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />

          <PreviewInput
            title="Text"
            placeholder="Your text here..."
            :max-length="10"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />

          <PreviewColorPickerCustom
            title="Text Color"
            :color="props.textColor || ink"
            @change="value => updateProp('textColor', value)"
          />

          <PreviewColorPickerCustom
            title="Pressure Color"
            :color="props.pressureColor || ink"
            @change="value => updateProp('pressureColor', value)"
          />

          <PreviewColorPickerCustom
            title="Stroke Color"
            :color="settings.strokeColor"
            @change="value => updateProp('strokeColor', value)"
          />

          <PreviewSelect
            title="Idle"
            :options="IDLE_OPTIONS"
            :model-value="settings.idle"
            @update:model-value="value => updateProp('idle', value as IdleMode)"
          />

          <PreviewSlider
            title="Idle Speed"
            :min="0.2"
            :max="3"
            :step="0.1"
            value-unit="x"
            :is-disabled="settings.idle === 'none'"
            :model-value="settings.idleSpeed"
            @update:model-value="value => updateProp('idleSpeed', value)"
          />

          <PreviewSlider
            title="Radius"
            :min="0.1"
            :max="1.5"
            :step="0.05"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />

          <PreviewSlider
            title="Smoothing"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.smoothing"
            @update:model-value="value => updateProp('smoothing', value)"
          />

          <PreviewSwitch
            title="Click Ripple"
            :model-value="settings.clickRipple"
            @update:model-value="value => updateProp('clickRipple', value)"
          />

          <PreviewSlider
            title="Stroke Width"
            :min="1"
            :max="10"
            :step="1"
            value-unit="px"
            :is-disabled="!settings.stroke"
            :model-value="settings.strokeWidth"
            @update:model-value="value => updateProp('strokeWidth', value)"
          />

          <PreviewSwitch
            title="Flex"
            :model-value="settings.flex"
            @update:model-value="value => updateProp('flex', value)"
          />
          <PreviewSwitch
            title="Width"
            :model-value="settings.width"
            @update:model-value="value => updateProp('width', value)"
          />
          <PreviewSwitch
            title="Weight"
            :model-value="settings.weight"
            @update:model-value="value => updateProp('weight', value)"
          />
          <PreviewSwitch
            title="Italic"
            :model-value="settings.italic"
            @update:model-value="value => updateProp('italic', value)"
          />
          <PreviewSwitch
            title="Alpha"
            :model-value="settings.alpha"
            @update:model-value="value => updateProp('alpha', value)"
          />
          <PreviewSwitch
            title="Stroke"
            :model-value="settings.stroke"
            @update:model-value="value => updateProp('stroke', value)"
          />
          <PreviewSwitch
            title="Scale"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="textPressure" component-name="TextPressure" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
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
import { textPressure } from '@/constants/code/TextAnimations/textPressureCode';
import TextPressure from '@/content/TextAnimations/TextPressure/TextPressure.vue';

type IdleMode = 'none' | 'wave' | 'pulse';

type Look = {
  flex: boolean;
  width: boolean;
  weight: boolean;
  italic: boolean;
  alpha: boolean;
  stroke: boolean;
  scale: boolean;
  radius: number;
  smoothing: number;
  idle: IdleMode;
  idleSpeed: number;
  clickRipple: boolean;
  strokeWidth: number;
  pressureColor: string;
  strokeColor: string;
};

const ACCENT = '#ff5a1f';

const LOOK: Look = {
  flex: true,
  width: true,
  weight: true,
  italic: true,
  alpha: false,
  stroke: false,
  scale: false,
  radius: 0.5,
  smoothing: 0.5,
  idle: 'wave',
  idleSpeed: 1,
  clickRipple: true,
  strokeWidth: 3,
  pressureColor: '',
  strokeColor: ACCENT
};

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  heat: { ...LOOK, flex: false, italic: false, idle: 'pulse', pressureColor: ACCENT, radius: 0.4, smoothing: 0.3 },
  tall: { ...LOOK, scale: true, italic: false, idleSpeed: 1.4, radius: 0.3, smoothing: 0.65 },
  ghost: { ...LOOK, alpha: true, width: false, radius: 0.4, smoothing: 0.85, idleSpeed: 0.7 }
};

const DEFAULT_PROPS = {
  preset: 'classic',
  text: 'Hello!',
  ...LOOK,
  textColor: ''
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'heat', label: 'Heat' },
  { value: 'tall', label: 'Tall' },
  { value: 'ghost', label: 'Ghost' }
];

const IDLE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'wave', label: 'Wave' },
  { value: 'pulse', label: 'Pulse' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Compressa"',
    description: 'Text content that will be displayed and animated.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: 'Roboto Flex',
    description: 'Name of the variable font family.'
  },
  {
    name: 'fontUrl',
    type: 'string',
    default: 'URL to Roboto Flex on Google Fonts',
    description: 'Stylesheet URL that loads the variable font. The font needs width, weight and italic axes.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: "'currentColor'",
    description: 'Fill color of the text. Follows the surrounding text color by default.'
  },
  {
    name: 'pressureColor',
    type: 'string',
    default: "''",
    description: 'Letters blend toward this color as they swell under pressure. Leave empty to keep one color.'
  },
  {
    name: 'strokeColor',
    type: 'string',
    default: '#FF0000',
    description: 'Color of the outline when stroke is on.'
  },
  {
    name: 'idle',
    type: "'none' | 'wave' | 'pulse'",
    default: "'none'",
    description:
      'What the letters do while the pointer is away. A wave rolls a swell across the word, a pulse makes it breathe in and out.'
  },
  {
    name: 'idleSpeed',
    type: 'number',
    default: '1',
    description: 'Speed of the idle wave or pulse. 2 plays it twice as fast.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '0.5',
    description:
      "How far the cursor's pull reaches, as a fraction of the text width. Also sets the length of the idle wave."
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0.5',
    description: 'How softly the letters follow the cursor, from 0 for instant to 1 for a slow, floaty glide.'
  },
  {
    name: 'clickRipple',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a wave of pressure rippling outward through the letters.'
  },
  {
    name: 'flex',
    type: 'boolean',
    default: 'true',
    description: 'Spreads the letters across the full width.'
  },
  {
    name: 'scale',
    type: 'boolean',
    default: 'false',
    description: 'Stretches the text vertically to fill the height of its container.'
  },
  {
    name: 'alpha',
    type: 'boolean',
    default: 'false',
    description: 'Fades letters out the further they are from the cursor.'
  },
  {
    name: 'stroke',
    type: 'boolean',
    default: 'false',
    description: 'Draws an outline behind each letter.'
  },
  {
    name: 'width',
    type: 'boolean',
    default: 'true',
    description: 'Varies the width axis of the font with pressure.'
  },
  {
    name: 'weight',
    type: 'boolean',
    default: 'true',
    description: 'Varies the weight axis of the font with pressure.'
  },
  {
    name: 'italic',
    type: 'boolean',
    default: 'true',
    description: 'Varies the italic axis of the font with pressure.'
  },
  {
    name: 'strokeWidth',
    type: 'number',
    default: '3',
    description: 'Width of the outline when stroke is on, in px. About half of it shows around the letters.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional class for styling the <h1> wrapper.'
  },
  {
    name: 'minFontSize',
    type: 'number',
    default: '24',
    description: 'Sets a minimum font-size to avoid overly tiny text on smaller screens.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, textColor: _textColor, pressureColor: _pressureColor, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({
  ...(props.value.textColor ? { textColor: props.value.textColor } : {}),
  ...(props.value.pressureColor ? { pressureColor: props.value.pressureColor } : {})
}));
</script>
