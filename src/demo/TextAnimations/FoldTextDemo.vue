<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'textColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="min-height: 430px">
          <RefreshButton @click="forceRerender" />
          <div
            class="relative flex flex-col items-center justify-center text-center"
            style="min-height: 430px; padding-left: 32px; padding-right: 32px"
          >
            <FoldText :key="rerenderKey" v-bind="settings" :color="props.textColor || 'currentColor'" />
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Text Color"
            :color="props.textColor || ink"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewSelect
            title="Fold Style"
            :options="FOLD_STYLE_OPTIONS"
            :model-value="settings.foldStyle"
            @update:model-value="value => updateAndReplay('foldStyle', value as FoldStyle)"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateAndReplay('trigger', value as Trigger)"
          />
          <PreviewSelect
            title="Split By"
            :options="SPLIT_OPTIONS"
            :model-value="settings.splitBy"
            @update:model-value="value => updateAndReplay('splitBy', value as SplitBy)"
          />
          <PreviewSelect
            title="Hinge"
            :options="HINGE_OPTIONS"
            :model-value="settings.hinge"
            @update:model-value="value => updateAndReplay('hinge', value as Hinge)"
          />
          <PreviewSelect
            title="Stagger From"
            :options="STAGGER_FROM_OPTIONS"
            :model-value="settings.staggerFrom"
            @update:model-value="value => updateAndReplay('staggerFrom', value as StaggerFrom)"
          />
          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="settings.ease"
            @update:model-value="value => updateAndReplay('ease', String(value))"
          />
          <PreviewSlider
            title="Fold Angle"
            :min="30"
            :max="180"
            :step="1"
            value-unit="°"
            :is-disabled="settings.foldStyle === 'flip'"
            :model-value="settings.foldAngle"
            @update:model-value="value => updateAndReplay('foldAngle', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.3"
            :max="1.6"
            :step="0.05"
            value-unit="s"
            :model-value="settings.duration"
            @update:model-value="value => updateAndReplay('duration', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0.01"
            :max="0.2"
            :step="0.005"
            value-unit="s"
            :model-value="settings.stagger"
            @update:model-value="value => updateAndReplay('stagger', value)"
          />
          <PreviewSlider
            title="Loop Delay"
            :min="0"
            :max="4"
            :step="0.1"
            value-unit="s"
            :is-disabled="settings.trigger !== 'loop'"
            :model-value="settings.loopDelay"
            @update:model-value="value => updateAndReplay('loopDelay', value)"
          />
          <PreviewSwitch
            title="Hover Refold"
            :model-value="settings.hoverRefold"
            @update:model-value="value => updateAndReplay('hoverRefold', value)"
          />
          <PreviewSlider
            title="Refold Radius"
            :min="40"
            :max="320"
            :step="10"
            value-unit="px"
            :is-disabled="!settings.hoverRefold"
            :model-value="settings.refoldRadius"
            @update:model-value="value => updateAndReplay('refoldRadius', value)"
          />
          <PreviewSlider
            title="Refold Angle"
            :min="10"
            :max="120"
            :step="5"
            value-unit="°"
            :is-disabled="!settings.hoverRefold"
            :model-value="settings.refoldAngle"
            @update:model-value="value => updateAndReplay('refoldAngle', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="300"
            :max="1200"
            :step="25"
            value-unit="px"
            :model-value="settings.perspective"
            @update:model-value="value => updateAndReplay('perspective', value)"
          />
          <PreviewSlider
            title="Crease Shading"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.creaseShading"
            @update:model-value="value => updateAndReplay('creaseShading', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="44"
            :max="112"
            :step="2"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateAndReplay('fontSize', value)"
          />
          <PreviewSlider
            title="Font Weight"
            :min="300"
            :max="900"
            :step="50"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateAndReplay('fontWeight', value)"
          />
          <PreviewInput
            title="Text"
            placeholder="Enter heading text"
            :max-length="34"
            :model-value="settings.text"
            @update:model-value="value => updateAndReplay('text', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="foldText" component-name="FoldText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
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
import { foldText } from '@/constants/code/TextAnimations/foldTextCode';
import FoldText, {
  type FoldStyle,
  type Hinge,
  type SplitBy,
  type StaggerFrom,
  type Trigger
} from '@/content/TextAnimations/FoldText/FoldText.vue';

type Look = {
  foldStyle: FoldStyle;
  trigger: Trigger;
  splitBy: SplitBy;
  hinge: Hinge;
  staggerFrom: StaggerFrom;
  ease: string;
  foldAngle: number;
  duration: number;
  stagger: number;
  loopDelay: number;
  hoverRefold: boolean;
  refoldRadius: number;
  refoldAngle: number;
  perspective: number;
  creaseShading: number;
};

const LOOK: Look = {
  foldStyle: 'paper',
  trigger: 'mount',
  splitBy: 'char',
  hinge: 'top',
  staggerFrom: 'start',
  ease: 'power3.out',
  foldAngle: 92,
  duration: 0.65,
  stagger: 0.045,
  loopDelay: 1.4,
  hoverRefold: true,
  refoldRadius: 140,
  refoldAngle: 45,
  perspective: 700,
  creaseShading: 0.55
};

const PRESETS: Record<string, Look> = {
  paper: { ...LOOK },
  blinds: {
    ...LOOK,
    foldStyle: 'blinds',
    trigger: 'loop',
    staggerFrom: 'center',
    ease: 'expo.out',
    foldAngle: 90,
    duration: 1.1,
    stagger: 0.05,
    loopDelay: 1.6,
    refoldRadius: 150,
    refoldAngle: 60,
    perspective: 500,
    creaseShading: 0.8
  },
  flip: {
    ...LOOK,
    foldStyle: 'flip',
    hinge: 'left',
    ease: 'back.out(1.2)',
    duration: 1.15,
    stagger: 0.06,
    refoldRadius: 120,
    refoldAngle: 40,
    perspective: 900,
    creaseShading: 0.45
  },
  swing: {
    ...LOOK,
    trigger: 'loop',
    splitBy: 'word',
    hinge: 'right',
    staggerFrom: 'end',
    ease: 'circ.out',
    foldAngle: 112,
    duration: 0.95,
    stagger: 0.14,
    loopDelay: 0.9,
    hoverRefold: false,
    perspective: 420,
    creaseShading: 0.7
  }
};

const DEFAULT_PROPS = {
  preset: 'paper',
  text: 'Design unfolds',
  textColor: '',
  ...LOOK,
  fontSize: 80,
  fontWeight: 800
};

const PRESET_OPTIONS = [
  { value: 'paper', label: 'Paper' },
  { value: 'blinds', label: 'Blinds' },
  { value: 'flip', label: 'Flip' },
  { value: 'swing', label: 'Swing' }
];

const FOLD_STYLE_OPTIONS = [
  { value: 'paper', label: 'Paper' },
  { value: 'blinds', label: 'Blinds' },
  { value: 'flip', label: 'Flip' }
];

const SPLIT_OPTIONS = [
  { value: 'char', label: 'Character' },
  { value: 'word', label: 'Word' },
  { value: 'line', label: 'Line' }
];

const HINGE_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const STAGGER_FROM_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
  { value: 'edges', label: 'Edges' },
  { value: 'random', label: 'Random' }
];

const TRIGGER_OPTIONS = [
  { value: 'mount', label: 'Mount' },
  { value: 'hover', label: 'Hover' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'loop', label: 'Loop' }
];

const EASE_OPTIONS = [
  { value: 'power3.out', label: 'Power out' },
  { value: 'expo.out', label: 'Expo out' },
  { value: 'back.out(1.2)', label: 'Soft back' },
  { value: 'circ.out', label: 'Circular' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Design unfolds"',
    description: 'The text to split and fold into place. Line breaks are kept.'
  },
  {
    name: 'foldStyle',
    type: '"paper" | "blinds" | "flip"',
    default: '"paper"',
    description:
      'How each piece folds. Paper swings open from its hinge edge, blinds splits it into two slats that turn open one after the other, and flip turns it over like a card, lifting toward you mid-turn.'
  },
  {
    name: 'splitBy',
    type: '"char" | "word" | "line"',
    default: '"char"',
    description: 'Whether each character, word or line folds as its own panel.'
  },
  {
    name: 'hinge',
    type: '"top" | "bottom" | "left" | "right"',
    default: '"top"',
    description: 'The edge each panel folds around. For blinds and flip it picks the axis and the turning direction.'
  },
  {
    name: 'foldAngle',
    type: 'number',
    default: '92',
    description:
      'How far the panels start folded away, in degrees. Past 90 they flip over from behind. Flip always turns a full half turn.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.65',
    description: 'How long each panel takes to unfold, in seconds.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.045',
    description: 'Delay between panels, in seconds.'
  },
  {
    name: 'staggerFrom',
    type: '"start" | "center" | "end" | "edges" | "random"',
    default: '"start"',
    description: 'Where the cascade starts.'
  },
  {
    name: 'ease',
    type: 'string',
    default: '"power3.out"',
    description: 'GSAP ease used for the unfold.'
  },
  {
    name: 'perspective',
    type: 'number',
    default: '700',
    description: 'Camera distance for the fold, in px. Lower values look deeper.'
  },
  {
    name: 'creaseShading',
    type: 'number',
    default: '0.55',
    description: 'How dark the crease shading gets while a panel is folded, from 0 to 1.'
  },
  {
    name: 'trigger',
    type: '"mount" | "hover" | "scroll" | "loop"',
    default: '"mount"',
    description: 'When the text unfolds. Loop holds the text, folds it back up and plays again.'
  },
  {
    name: 'loopDelay',
    type: 'number',
    default: '1.4',
    description:
      "How long the unfolded text holds before folding back up, in seconds. Only applies when trigger is 'loop'."
  },
  {
    name: 'hoverRefold',
    type: 'boolean',
    default: 'false',
    description: 'Panels near the cursor fold partly away and ease back open once it passes.'
  },
  {
    name: 'refoldRadius',
    type: 'number',
    default: '140',
    description: 'How far from the cursor panels react with hoverRefold, in px. The fold fades out toward the edge.'
  },
  {
    name: 'refoldAngle',
    type: 'number',
    default: '45',
    description: 'How far a panel right under the cursor folds away with hoverRefold, in degrees.'
  },
  {
    name: 'fontSize',
    type: 'string | number',
    default: '80',
    description: 'Font size of the text. Numbers are in px.'
  },
  {
    name: 'fontWeight',
    type: 'string | number',
    default: '800',
    description: 'Font weight of the text.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Color of the text. Follows the surrounding text color by default.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Extra class names for the root element.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles for the root element.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, textColor: _textColor, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');

const updateAndReplay = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
  updateProp(name, value);
  forceRerender();
};

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

const computedProps = computed(() => (props.value.textColor ? { color: props.value.textColor } : {}));
</script>
