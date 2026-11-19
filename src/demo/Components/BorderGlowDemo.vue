<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative" style="height: 500px; padding-top: 40px; padding-bottom: 40px">
          <BorderGlow
            v-bind="props"
            :background-color="renderedBackgroundColor"
            :glow-color="renderedGlowColor"
            :glow-intensity="renderedGlowIntensity"
            :fill-opacity="renderedFillOpacity"
            :colors="colors"
          >
            <div class="flex flex-col justify-center items-start" style="padding: 2em; min-height: 200px">
              <VscSparkleFilled style="width: 40px; height: 40px; margin-bottom: 12px" />
              <p style="font-weight: 600; font-size: 1.4rem; letter-spacing: -0.5px">Hover Near the Edges</p>
              <p style="color: var(--text-muted); font-size: 14px; max-width: 40ch; margin-top: 4px">
                Move your cursor close to the card border to see the colored glow effect follow your pointer direction.
              </p>
            </div>
          </BorderGlow>
        </div>

        <Customize>
          <PreviewSlider
            :min="0"
            :max="80"
            :step="1"
            title="Edge Sensitivity"
            :model-value="props.edgeSensitivity"
            @update:model-value="v => updateProp('edgeSensitivity', v)"
          />
          <PreviewSlider
            :min="0"
            :max="50"
            :step="1"
            title="Border Radius"
            :model-value="props.borderRadius"
            @update:model-value="v => updateProp('borderRadius', v)"
          />
          <PreviewSlider
            :min="10"
            :max="80"
            :step="1"
            title="Glow Radius"
            :model-value="props.glowRadius"
            @update:model-value="v => updateProp('glowRadius', v)"
          />
          <PreviewSlider
            :min="0.1"
            :max="3"
            :step="0.1"
            title="Glow Intensity"
            :model-value="props.glowIntensity"
            @update:model-value="v => updateProp('glowIntensity', v)"
          />
          <PreviewSlider
            :min="5"
            :max="45"
            :step="1"
            title="Cone Spread"
            :model-value="props.coneSpread"
            @update:model-value="v => updateProp('coneSpread', v)"
          />
          <PreviewSwitch
            title="Animated Intro"
            :model-value="props.animated"
            @update:model-value="v => updateProp('animated', v)"
          />
          <PreviewColorPickerCustom
            title="Background"
            :color="renderedBackgroundColor"
            @change="v => updateProp('backgroundColor', v)"
          />
          <p style="font-size: 14px; margin-top: 16px">Gradient Colors</p>
          <div class="flex flex-wrap gap-2" style="margin-top: 4px">
            <PreviewColorPickerCustom
              v-for="(c, i) in colors"
              :key="i"
              :title="`Color ${i + 1}`"
              :color="c"
              @change="v => updateColor(i, v)"
            />
          </div>
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="borderGlow" component-name="BorderGlow" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VscSparkleFilled } from 'vue-icons-plus/vsc';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorMode } from '@/composables/useTheme';
import { borderGlow } from '@/constants/code/Components/borderGlowCode';
import BorderGlow from '@/content/Components/BorderGlow/BorderGlow.vue';

const DEFAULT_PROPS = {
  edgeSensitivity: 30,
  glowColor: '40 80 80',
  backgroundColor: '#111111',
  borderRadius: 28,
  glowRadius: 40,
  glowIntensity: 1.0,
  coneSpread: 25,
  animated: false
};

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const { isLight } = useColorMode();
const colors = ref(['#7cff67', '#2dd4bf', '#38bdf8']);

const renderedBackgroundColor = computed(() =>
  isLight.value && props.value.backgroundColor === DEFAULT_PROPS.backgroundColor
    ? '#ffffff'
    : props.value.backgroundColor
);
const renderedGlowColor = computed(() =>
  isLight.value && props.value.glowColor === DEFAULT_PROPS.glowColor ? '138 70 40' : props.value.glowColor
);
const renderedGlowIntensity = computed(() =>
  isLight.value && props.value.glowIntensity === DEFAULT_PROPS.glowIntensity ? 1.25 : props.value.glowIntensity
);
const renderedFillOpacity = computed(() => (isLight.value ? 0.22 : 0.5));

const updateColor = (index: number, value: string) => {
  const next = [...colors.value];
  next[index] = value;
  colors.value = next;
};

const propData: PropRow[] = [
  { name: 'children', type: 'slot', default: '-', description: 'Content rendered inside the card.' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS classes for the outer wrapper.' },
  {
    name: 'edgeSensitivity',
    type: 'number',
    default: '30',
    description: 'How close the pointer must be to the edge for the glow to appear (0-100).'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: '"40 80 80"',
    description: 'HSL values for the glow color, as "H S L" (e.g. "40 80 80").'
  },
  { name: 'backgroundColor', type: 'string', default: '"#111111"', description: 'Background color of the card.' },
  { name: 'borderRadius', type: 'number', default: '28', description: 'Corner radius of the card in pixels.' },
  {
    name: 'glowRadius',
    type: 'number',
    default: '40',
    description: 'How far the outer glow extends beyond the card in pixels.'
  },
  { name: 'glowIntensity', type: 'number', default: '1.0', description: 'Multiplier for glow opacity (0.1-3.0).' },
  {
    name: 'coneSpread',
    type: 'number',
    default: '25',
    description: 'Width of the directional cone mask as a percentage (5-45).'
  },
  { name: 'animated', type: 'boolean', default: 'false', description: 'Play an intro sweep animation on mount.' },
  {
    name: 'colors',
    type: 'string[]',
    default: '[...]',
    description: 'Array of 3 hex colors for the mesh gradient border, distributed across positions.'
  }
];
</script>
