<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'showCallback', 'ease', 'color', 'accentColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="min-height: 400px">
          <RefreshButton @click="forceRerender" />
          <SplitText
            :key="rerenderKey"
            v-bind="settings"
            :ease="props.ease || undefined"
            :color="props.color || undefined"
            :accent-color="props.accentColor || undefined"
            class-name="split-text-demo"
            :on-letter-animation-complete="props.showCallback ? showToast : undefined"
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
            title="Color"
            :color="props.color || ink"
            @change="value => updateAndReplay('color', value)"
          />

          <PreviewColorPickerCustom
            title="Accent"
            :color="props.accentColor || ink"
            @change="value => updateAndReplay('accentColor', value)"
          />

          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => updateAndReplay('effect', value as Effect)"
          />

          <PreviewSelect
            title="Split Type"
            :options="SPLIT_OPTIONS"
            :model-value="settings.splitType"
            @update:model-value="value => updateAndReplay('splitType', value as SplitType)"
          />

          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateAndReplay('trigger', value as Trigger)"
          />

          <PreviewSelect
            title="Hover Effect"
            :options="HOVER_OPTIONS"
            :model-value="settings.hoverEffect"
            @update:model-value="value => updateAndReplay('hoverEffect', value as HoverEffect)"
          />

          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="props.ease"
            @update:model-value="value => updateAndReplay('ease', String(value))"
          />

          <PreviewSelect
            title="Stagger From"
            :options="STAGGER_FROM_OPTIONS"
            :model-value="settings.staggerFrom"
            @update:model-value="value => updateAndReplay('staggerFrom', value as StaggerFrom)"
          />

          <PreviewSlider
            title="Stagger Delay"
            :min="10"
            :max="500"
            :step="5"
            value-unit="ms"
            :model-value="settings.delay"
            @update:model-value="value => updateAndReplay('delay', value)"
          />

          <PreviewSlider
            title="Duration"
            :min="0.1"
            :max="3"
            :step="0.05"
            value-unit="s"
            :model-value="settings.duration"
            @update:model-value="value => updateAndReplay('duration', value)"
          />

          <PreviewSlider
            title="Loop Delay"
            :min="0"
            :max="5"
            :step="0.1"
            value-unit="s"
            :is-disabled="!settings.loop"
            :model-value="settings.loopDelay"
            @update:model-value="value => updateAndReplay('loopDelay', value)"
          />

          <PreviewSwitch
            title="Loop"
            :model-value="settings.loop"
            @update:model-value="value => updateAndReplay('loop', value)"
          />

          <PreviewSwitch
            title="Mask"
            :model-value="settings.mask"
            @update:model-value="value => updateAndReplay('mask', value)"
          />

          <PreviewSwitch
            title="Show Completion Toast"
            :model-value="props.showCallback"
            @update:model-value="value => updateAndReplay('showCallback', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="splitText" component-name="SplitText" />
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
import { splitText } from '@/constants/code/TextAnimations/splitTextCode';
import SplitText from '@/content/TextAnimations/SplitText/SplitText.vue';

type Effect = 'rise' | 'fade' | 'blur' | 'flip' | 'pop' | 'skew' | 'wave';
type SplitType = 'chars' | 'words' | 'lines' | 'words, chars';
type Trigger = 'view' | 'load' | 'hover' | 'click';
type HoverEffect = 'none' | 'lift' | 'wave';
type StaggerFrom = 'start' | 'center' | 'end' | 'edges' | 'random';

type Look = {
  effect: Effect;
  splitType: SplitType;
  ease: string;
  delay: number;
  duration: number;
  staggerFrom: StaggerFrom;
  trigger: Trigger;
  hoverEffect: HoverEffect;
  loop: boolean;
  loopDelay: number;
  mask: boolean;
  color: string;
  accentColor: string;
};

const LOOK: Look = {
  effect: 'rise',
  splitType: 'chars',
  ease: '',
  delay: 50,
  duration: 1.25,
  staggerFrom: 'start',
  trigger: 'view',
  hoverEffect: 'lift',
  loop: false,
  loopDelay: 1.5,
  mask: false,
  color: '',
  accentColor: ''
};

const PRESETS: Record<string, Look> = {
  rise: { ...LOOK },
  flip: {
    ...LOOK,
    effect: 'flip',
    delay: 45,
    duration: 1.1,
    trigger: 'hover',
    hoverEffect: 'none',
    accentColor: '#ff5a36'
  },
  blur: {
    ...LOOK,
    effect: 'blur',
    splitType: 'words',
    delay: 160,
    duration: 1.6,
    staggerFrom: 'center',
    hoverEffect: 'none',
    loop: true,
    loopDelay: 1.4
  },
  wave: { ...LOOK, effect: 'wave', delay: 45, duration: 1.4, trigger: 'click', hoverEffect: 'wave' }
};

const DEFAULT_PROPS = {
  preset: 'rise',
  text: 'Hello, you!',
  ...LOOK,
  showCallback: true
};

const PRESET_OPTIONS = [
  { value: 'rise', label: 'Rise' },
  { value: 'flip', label: 'Flip' },
  { value: 'blur', label: 'Blur' },
  { value: 'wave', label: 'Wave' }
];

const EFFECT_OPTIONS = [
  { value: 'rise', label: 'Rise' },
  { value: 'fade', label: 'Fade' },
  { value: 'blur', label: 'Blur' },
  { value: 'flip', label: 'Flip' },
  { value: 'pop', label: 'Pop' },
  { value: 'skew', label: 'Skew' },
  { value: 'wave', label: 'Wave' }
];

const SPLIT_OPTIONS = [
  { value: 'chars', label: 'Chars' },
  { value: 'words', label: 'Words' },
  { value: 'lines', label: 'Lines' }
];

const TRIGGER_OPTIONS = [
  { value: 'view', label: 'In view' },
  { value: 'load', label: 'Load' },
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' }
];

const HOVER_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'lift', label: 'Lift' },
  { value: 'wave', label: 'Wave' }
];

const EASE_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: 'power3.out', label: 'Power out' },
  { value: 'expo.out', label: 'Expo out' },
  { value: 'back.out(2)', label: 'Back out' },
  { value: 'bounce.out', label: 'Bounce' },
  { value: 'elastic.out(1, 0.3)', label: 'Elastic' }
];

const STAGGER_FROM_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
  { value: 'edges', label: 'Edges' },
  { value: 'random', label: 'Random' }
];

const propData: PropRow[] = [
  {
    name: 'tag',
    type: 'string',
    default: '"p"',
    description: 'HTML tag to render: "h1", "h2", "h3", "h4", "h5", "h6", "p" or "span".'
  },
  { name: 'text', type: 'string', default: '""', description: 'The text content to animate.' },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional class names to style the component.'
  },
  {
    name: 'effect',
    type: '"rise" | "fade" | "blur" | "flip" | "pop" | "skew" | "wave"',
    default: '"rise"',
    description:
      'Reveal style. Rise slides pieces up, fade dissolves them in, blur pulls them into focus, flip swings them up in 3D, pop scales them in with a soft overshoot, skew slides them in leaning and wave lets a crest travel across. Ignored when from or to is set.'
  },
  {
    name: 'trigger',
    type: '"view" | "load" | "hover" | "click"',
    default: '"view"',
    description:
      'When the reveal plays. View waits until the text scrolls into view, load plays right away, hover and click play it in view and replay it on every hover or click.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Animates the pieces out and back in again, over and over.'
  },
  {
    name: 'loopDelay',
    type: 'number',
    default: '1.5',
    description: 'Pause in seconds between the end of a reveal and the next loop.'
  },
  {
    name: 'hoverEffect',
    type: '"none" | "lift" | "wave"',
    default: '"none"',
    description:
      'Interaction after the reveal. Lift raises the pieces near the cursor with a soft falloff, wave sends a ripple through the text from where the cursor enters.'
  },
  {
    name: 'color',
    type: 'string',
    default: 'undefined',
    description: 'Text color. Follows the surrounding text color when not set.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: 'undefined',
    description: 'Color each piece passes through while it reveals before settling on the text color.'
  },
  {
    name: 'delay',
    type: 'number',
    default: '50',
    description: 'Delay between animations for each letter (in ms).'
  },
  {
    name: 'duration',
    type: 'number',
    default: '1.25',
    description: 'Duration of each letter animation (in seconds).'
  },
  {
    name: 'ease',
    type: 'string | function',
    default: 'undefined',
    description: 'GSAP easing for the reveal. Each effect brings its own ease when not set.'
  },
  {
    name: 'splitType',
    type: 'string',
    default: '"chars"',
    description: 'Split type: "chars", "words", "lines", or "words, chars".'
  },
  {
    name: 'staggerFrom',
    type: '"start" | "center" | "end" | "edges" | "random"',
    default: '"start"',
    description: 'Where the stagger starts, so pieces can ripple out from the middle, the ends or in random order.'
  },
  {
    name: 'mask',
    type: 'boolean',
    default: 'false',
    description: 'Clips each piece to its own box so it slides out from behind an edge instead of floating in.'
  },
  {
    name: 'from',
    type: 'object',
    default: 'undefined',
    description:
      'Custom starting GSAP properties for each piece, replacing the effect. Defaults to { opacity: 0, y: 40 }.'
  },
  {
    name: 'to',
    type: 'object',
    default: 'undefined',
    description: 'Custom target GSAP properties for each piece, replacing the effect. Defaults to { opacity: 1, y: 0 }.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Intersection threshold to trigger the animation (0-1).'
  },
  { name: 'rootMargin', type: 'string', default: '"-100px"', description: 'Root margin for the ScrollTrigger.' },
  {
    name: 'textAlign',
    type: 'string',
    default: '"center"',
    description: "Text alignment: 'left', 'center', 'right', etc."
  },
  {
    name: 'onLetterAnimationComplete',
    type: 'function',
    default: 'undefined',
    description: 'Callback function when the first reveal completes.'
  }
];

const toast = useToast();
const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const ink = useColorModeValue('#161816', '#ffffff');

const settings = computed(() => {
  const {
    preset: _preset,
    showCallback: _showCallback,
    ease: _ease,
    color: _color,
    accentColor: _accentColor,
    ...rest
  } = props.value;
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
  ...(props.value.ease ? { ease: props.value.ease } : {}),
  ...(props.value.color ? { color: props.value.color } : {}),
  ...(props.value.accentColor ? { accentColor: props.value.accentColor } : {})
}));
</script>
