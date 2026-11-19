<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'textColor', 'startColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="min-height: 400px">
          <RefreshButton @click="forceRerender" />
          <BlurText
            :key="rerenderKey"
            v-bind="settings"
            :color="props.textColor || undefined"
            :from-color="props.startColor || undefined"
            :on-animation-complete="settings.loop ? undefined : showToast"
            class-name="blur-text-demo"
          />
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

          <PreviewColorPickerCustom
            title="From Color"
            :color="props.startColor || props.textColor || ink"
            @change="value => updateProp('startColor', value)"
          />

          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => updateAndReplay('effect', value as BlurTextEffect)"
          />

          <PreviewSelect
            title="Animate By"
            :options="ANIMATE_BY_OPTIONS"
            :model-value="settings.animateBy"
            @update:model-value="value => updateAndReplay('animateBy', value as AnimateBy)"
          />

          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateAndReplay('direction', value as Direction)"
          />

          <PreviewSelect
            title="Stagger From"
            :options="STAGGER_FROM_OPTIONS"
            :model-value="settings.staggerFrom"
            @update:model-value="value => updateAndReplay('staggerFrom', value as BlurTextStaggerFrom)"
          />

          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateAndReplay('trigger', value as BlurTextTrigger)"
          />

          <PreviewSlider
            title="Delay"
            :min="20"
            :max="500"
            :step="10"
            value-unit="ms"
            :model-value="settings.delay"
            @update:model-value="value => updateAndReplay('delay', value)"
          />

          <PreviewSlider
            title="Step Duration"
            :min="0.1"
            :max="1"
            :step="0.05"
            value-unit="s"
            :model-value="settings.stepDuration"
            @update:model-value="value => updateAndReplay('stepDuration', value)"
          />

          <PreviewSwitch
            title="Loop"
            :model-value="settings.loop"
            @update:model-value="value => updateAndReplay('loop', value)"
          />

          <PreviewSlider
            title="Loop Delay"
            :min="0.2"
            :max="5"
            :step="0.1"
            value-unit="s"
            :is-disabled="!settings.loop"
            :model-value="settings.loopDelay"
            @update:model-value="value => updateProp('loopDelay', value)"
          />

          <PreviewSlider
            title="Blur"
            :min="0"
            :max="30"
            :step="1"
            value-unit="px"
            :model-value="settings.blur"
            @update:model-value="value => updateAndReplay('blur', value)"
          />

          <PreviewSlider
            title="Distance"
            :min="0"
            :max="120"
            :step="5"
            value-unit="px"
            :model-value="settings.distance"
            @update:model-value="value => updateAndReplay('distance', value)"
          />

          <PreviewSwitch
            title="Focus On Hover"
            :model-value="settings.focusOnHover"
            @update:model-value="value => updateProp('focusOnHover', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v']" />
      </template>

      <template #code>
        <CodeExample :code-object="blurText" component-name="BlurText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
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
import { blurText } from '@/constants/code/TextAnimations/blurTextCode';
import BlurText, {
  type BlurTextEffect,
  type BlurTextStaggerFrom,
  type BlurTextTrigger
} from '@/content/TextAnimations/BlurText/BlurText.vue';

type AnimateBy = 'words' | 'letters';
type Direction = 'top' | 'bottom' | 'left' | 'right';

type Look = {
  textColor: string;
  startColor: string;
  effect: BlurTextEffect;
  animateBy: AnimateBy;
  direction: Direction;
  staggerFrom: BlurTextStaggerFrom;
  trigger: BlurTextTrigger;
  delay: number;
  stepDuration: number;
  loop: boolean;
  loopDelay: number;
  blur: number;
  distance: number;
  focusOnHover: boolean;
};

const LOOK: Look = {
  textColor: '',
  startColor: '',
  effect: 'blur',
  animateBy: 'words',
  direction: 'top',
  staggerFrom: 'start',
  trigger: 'view',
  delay: 200,
  stepDuration: 0.35,
  loop: false,
  loopDelay: 2,
  blur: 10,
  distance: 50,
  focusOnHover: false
};

const PRESETS: Record<string, Look> = {
  soft: { ...LOOK },
  focus: {
    ...LOOK,
    effect: 'focus',
    animateBy: 'letters',
    staggerFrom: 'center',
    delay: 35,
    stepDuration: 0.5,
    loop: true,
    loopDelay: 1.6,
    blur: 14,
    distance: 0
  },
  tilt: {
    ...LOOK,
    startColor: '#ff5a36',
    effect: 'tilt',
    animateBy: 'letters',
    direction: 'bottom',
    delay: 40,
    stepDuration: 0.45,
    blur: 8,
    distance: 40
  },
  drift: {
    ...LOOK,
    effect: 'drift',
    direction: 'left',
    staggerFrom: 'random',
    delay: 110,
    stepDuration: 0.5,
    blur: 12,
    distance: 70,
    focusOnHover: true
  }
};

const DEFAULT_PROPS = {
  preset: 'soft',
  text: "Isn't this so cool?!",
  ...LOOK
};

const PRESET_OPTIONS = [
  { value: 'soft', label: 'Soft' },
  { value: 'focus', label: 'Focus' },
  { value: 'tilt', label: 'Tilt' },
  { value: 'drift', label: 'Drift' }
];

const EFFECT_OPTIONS = [
  { value: 'blur', label: 'Blur' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'tilt', label: 'Tilt' },
  { value: 'focus', label: 'Focus' },
  { value: 'drift', label: 'Drift' }
];

const ANIMATE_BY_OPTIONS = [
  { value: 'words', label: 'Words' },
  { value: 'letters', label: 'Letters' }
];

const DIRECTION_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const STAGGER_FROM_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
  { value: 'random', label: 'Random' }
];

const TRIGGER_OPTIONS = [
  { value: 'view', label: 'View' },
  { value: 'load', label: 'Load' },
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '""',
    description: 'The text content to animate.'
  },
  {
    name: 'effect',
    type: '"blur" | "zoom" | "tilt" | "focus" | "drift"',
    default: '"blur"',
    description:
      'How each piece comes in. Blur slides in from a side, zoom shrinks down from large, tilt swings in on a slight 3D angle, focus sharpens in place like a camera focus pull and drift glides in sideways with a lean that relaxes.'
  },
  {
    name: 'animateBy',
    type: '"words" | "letters"',
    default: '"words"',
    description: 'Whether each word or each letter comes into focus on its own.'
  },
  {
    name: 'direction',
    type: '"top" | "bottom" | "left" | "right"',
    default: '"top"',
    description:
      'Side the words or letters move in from. Drift always glides sideways, from the right only when set to right.'
  },
  {
    name: 'staggerFrom',
    type: '"start" | "center" | "end" | "random"',
    default: '"start"',
    description: 'Where the stagger starts: the first piece, the middle, the last piece or a shuffled order.'
  },
  {
    name: 'trigger',
    type: '"view" | "load" | "hover" | "click"',
    default: '"view"',
    description:
      'When the text comes in. View waits until it scrolls into view and load starts right away. Hover and click show the text and replay it each time it is hovered or clicked.'
  },
  {
    name: 'delay',
    type: 'number',
    default: '200',
    description: 'Delay between animations for each word/letter (in ms).'
  },
  {
    name: 'stepDuration',
    type: 'number',
    default: '0.35',
    description: 'The time taken for each step of the animation (in seconds).'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Keeps replaying: the text holds, blurs back out and comes in again.'
  },
  {
    name: 'loopDelay',
    type: 'number',
    default: '2',
    description: 'How long the text stays sharp before it blurs out again when looping, in seconds.'
  },
  {
    name: 'blur',
    type: 'number',
    default: '10',
    description: 'How blurred each word or letter starts, in px.'
  },
  {
    name: 'distance',
    type: 'number',
    default: '50',
    description:
      'How far each word or letter travels into place, in px. 0 keeps them still so they only come into focus.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Color of the text. Follows the surrounding text color by default.'
  },
  {
    name: 'fromColor',
    type: 'string',
    default: '-',
    description:
      'Color each word or letter starts in before it settles on the text color. Leave it out to keep one color.'
  },
  {
    name: 'focusOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Hovering a word keeps it sharp while the other words soften and dim.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Intersection threshold for triggering the animation.'
  },
  {
    name: 'rootMargin',
    type: 'string',
    default: '"0px"',
    description: 'Root margin for the intersection observer.'
  },
  {
    name: 'animationFrom',
    type: 'object',
    default: 'undefined',
    description: 'Custom starting keyframe. Replaces the effect, blur, distance and direction settings.'
  },
  {
    name: 'animationTo',
    type: 'object[]',
    default: 'undefined',
    description: 'Custom keyframes to animate through after animationFrom.'
  },
  {
    name: 'easing',
    type: 'Easing | Easing[]',
    default: '-',
    description: 'Motion easing applied to every step. Each effect uses its own tuned curves when this is left out.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Extra class names for the paragraph.'
  },
  {
    name: 'onAnimationComplete',
    type: 'function',
    default: 'undefined',
    description: 'Called each time the text finishes coming in.'
  }
];

const toast = useToast();
const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const ink = useColorModeValue('#161816', '#ffffff');

const settings = computed(() => {
  const { preset: _preset, textColor: _textColor, startColor: _startColor, ...rest } = props.value;
  return rest;
});

const showToast = () => {
  toast.add({ severity: 'secondary', summary: '✅ Animation Finished!', life: 3000 });
};

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

const computedProps = computed(() => ({
  ...(props.value.textColor ? { color: props.value.textColor } : {}),
  ...(props.value.startColor ? { fromColor: props.value.startColor } : {})
}));
</script>
