<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative flex items-center justify-center overflow-hidden" style="height: 480px">
          <PixelTransition v-bind="settings" :pixel-color="pixelColor" aspect-ratio="125%" :style="{ width: '300px' }">
            <template #firstContent>
              <img :src="images[0]" alt="" draggable="false" class="pixel-transition-demo-photo" />
            </template>
            <template #secondContent>
              <img :src="images[1]" alt="" draggable="false" class="pixel-transition-demo-photo" />
            </template>
          </PixelTransition>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            :width="140"
            @update:model-value="applyPreset"
          />
          <PreviewColorPickerCustom
            title="Pixel Color"
            :color="pixelColor"
            @change="(value: string) => updateProp('pixelColor', value)"
          />
          <PreviewSlider
            title="Mosaic"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.mosaic"
            @update:model-value="value => updateProp('mosaic', value)"
          />
          <PreviewSlider
            title="Grid Size"
            :min="4"
            :max="40"
            :step="1"
            :model-value="props.gridSize"
            @update:model-value="value => updateProp('gridSize', value)"
          />
          <PreviewSelect
            title="Pixel Shape"
            :options="SHAPE_OPTIONS"
            :model-value="props.pixelShape"
            :width="140"
            @update:model-value="value => updateProp('pixelShape', value as PixelTransitionShape)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="8"
            :step="1"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSelect
            title="Pattern"
            :options="PATTERN_OPTIONS"
            :model-value="props.pattern"
            :width="140"
            @update:model-value="value => updateProp('pattern', value as PixelTransitionPattern)"
          />
          <PreviewSelect
            title="Pixel Animation"
            :options="ANIMATION_OPTIONS"
            :model-value="props.pixelAnimation"
            :width="140"
            @update:model-value="value => updateProp('pixelAnimation', value as PixelTransitionAnimation)"
          />
          <PreviewSlider
            title="Randomness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.randomness"
            @update:model-value="value => updateProp('randomness', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.1"
            :max="1.5"
            :step="0.05"
            value-unit="s"
            :model-value="props.animationStepDuration"
            @update:model-value="value => updateProp('animationStepDuration', value)"
          />
          <PreviewSlider
            title="Frame Rate"
            :min="0"
            :max="30"
            :step="1"
            :model-value="props.fps"
            @update:model-value="value => updateProp('fps', value)"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="props.trigger"
            :width="140"
            @update:model-value="value => updateProp('trigger', value as Trigger)"
          />
          <PreviewSwitch
            title="Once"
            :model-value="props.once"
            @update:model-value="value => updateProp('once', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="pixelTransition" component-name="PixelTransition" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
import { pixelTransition } from '@/constants/code/Animations/pixelTransitionCode';
import PixelTransition, {
  type PixelTransitionAnimation,
  type PixelTransitionPattern,
  type PixelTransitionShape
} from '@/content/Animations/PixelTransition/PixelTransition.vue';

type Trigger = 'hover' | 'click';

const DAY = '/assets/demo/day-portrait.webp';
const NIGHT = '/assets/demo/night-portrait.webp';

const DEFAULT_PROPS = {
  preset: 'classic',
  pixelColor: '',
  mosaic: 0,
  gridSize: 10,
  pixelShape: 'square' as PixelTransitionShape,
  gap: 0,
  pattern: 'random' as PixelTransitionPattern,
  pixelAnimation: 'pop' as PixelTransitionAnimation,
  randomness: 0.3,
  animationStepDuration: 0.4,
  fps: 0,
  trigger: 'hover' as Trigger,
  once: false
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  classic: {},
  dither: { pattern: 'dither', gridSize: 20, fps: 15 },
  ripple: { pattern: 'ripple', pixelAnimation: 'grow', pixelShape: 'circle', gridSize: 16, gap: 2, randomness: 0.2 },
  wipe: { pattern: 'wipe', pixelAnimation: 'grow', pixelShape: 'rounded', gridSize: 12, gap: 3, randomness: 0.3 },
  mosaic: { pixelColor: '#1c1d1c', mosaic: 0.5, gridSize: 24, pixelAnimation: 'fade', animationStepDuration: 0.5 }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'dither', label: 'Dither' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'wipe', label: 'Wipe' },
  { value: 'mosaic', label: 'Mosaic' }
];

const PATTERN_OPTIONS = [
  { value: 'random', label: 'Random' },
  { value: 'dither', label: 'Dither' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'wipe', label: 'Wipe' }
];

const ANIMATION_OPTIONS = [
  { value: 'pop', label: 'Pop' },
  { value: 'grow', label: 'Grow' },
  { value: 'fade', label: 'Fade' }
];

const SHAPE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' }
];

const TRIGGER_OPTIONS = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' }
];

const propData: PropRow[] = [
  { name: 'firstContent', type: 'slot', default: '-', description: 'Content shown by default.' },
  { name: 'secondContent', type: 'slot', default: '-', description: 'Content revealed by the transition.' },
  {
    name: 'gridSize',
    type: 'number',
    default: '10',
    description: 'Number of pixels across the card. Rows follow so every pixel stays square.'
  },
  {
    name: 'pixelColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the pixels. Any CSS color works.'
  },
  {
    name: 'mosaic',
    type: 'number',
    default: '0',
    description: 'Gives each pixel a slightly different tone of the pixel color, from 0 to 1.'
  },
  {
    name: 'animationStepDuration',
    type: 'number',
    default: '0.4',
    description: 'Seconds the pixels take to cover the card, and again to clear it.'
  },
  {
    name: 'pattern',
    type: "'random' | 'dither' | 'ripple' | 'wipe'",
    default: "'random'",
    description:
      'Order the pixels appear in. Ripple spreads from the pointer and wipe sweeps in from the edge it crossed.'
  },
  {
    name: 'randomness',
    type: 'number',
    default: '0.3',
    description: 'Breaks up the ripple and wipe fronts, from 0 to 1.'
  },
  {
    name: 'pixelAnimation',
    type: "'pop' | 'grow' | 'fade'",
    default: "'pop'",
    description: 'How each pixel appears and disappears.'
  },
  {
    name: 'pixelShape',
    type: "'square' | 'rounded' | 'circle'",
    default: "'square'",
    description: 'Shape of the pixels while the transition runs. They merge into a solid cover at the midpoint.'
  },
  { name: 'gap', type: 'number', default: '0', description: 'Space between pixels in pixels.' },
  {
    name: 'fps',
    type: 'number',
    default: '0',
    description: 'Caps how often the pixels redraw for a choppy retro feel. 0 redraws every frame.'
  },
  { name: 'trigger', type: "'hover' | 'click'", default: "'hover'", description: 'What starts the transition.' },
  {
    name: 'active',
    type: 'boolean',
    default: '-',
    description: 'Controls the state from outside. Pair it with onActiveChange.'
  },
  {
    name: 'once',
    type: 'boolean',
    default: 'false',
    description: 'Keeps the second content once it has been revealed.'
  },
  {
    name: 'onActiveChange',
    type: '(active: boolean) => void',
    default: '-',
    description: 'Called when hover, focus or a click asks for the other content.'
  },
  {
    name: 'aspectRatio',
    type: 'string',
    default: "'100%'",
    description:
      "Height of the card. Percentages work like padding-top ('125%'), anything else is a CSS ratio ('4 / 5')."
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the card.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the card.' }
];

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const ink = useColorModeValue('#111111', '#ffffff');
const images = useColorModeValue([DAY, NIGHT], [NIGHT, DAY]);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const pixelColor = computed(() => props.value.pixelColor || ink.value);
const computedProps = computed(() => ({ pixelColor: pixelColor.value }));

const applyPreset = (value: string | number) => {
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[String(value)], preset: String(value) });
};
</script>

<style scoped>
.pixel-transition-demo-photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
