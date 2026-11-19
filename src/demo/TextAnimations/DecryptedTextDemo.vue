<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'scrambleColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden sm:py-4 md:py-6" style="height: 400px">
          <RefreshButton @click="forceRerender" />

          <div class="flex" style="width: 80%; padding: 0 0.5em">
            <DecryptedText
              :key="rerenderKey"
              text="Hacking into the mainframe..."
              parent-class-name="decrypted-text"
              v-bind="settings"
              :scramble-color="props.scrambleColor"
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
          <PreviewColorPickerCustom
            title="Scramble Color"
            :color="props.scrambleColor || ink"
            @change="value => updateProp('scrambleColor', value)"
          />
          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => change('effect', value as Effect)"
          />
          <PreviewSelect
            title="Animate On"
            :options="ANIMATE_OPTIONS"
            :model-value="settings.animateOn"
            @update:model-value="value => change('animateOn', value as AnimateOn)"
          />
          <PreviewSelect
            title="Click Mode"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickMode"
            :is-disabled="settings.animateOn !== 'click'"
            @update:model-value="value => change('clickMode', value as ClickMode)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.revealDirection"
            :is-disabled="!settings.sequential"
            @update:model-value="value => change('revealDirection', value as RevealDirection)"
          />
          <PreviewSlider
            title="Speed"
            :min="20"
            :max="200"
            :step="5"
            value-unit="ms"
            :model-value="settings.speed"
            @update:model-value="value => change('speed', value)"
          />
          <PreviewSlider
            title="Iterations"
            :min="1"
            :max="40"
            :step="1"
            :is-disabled="settings.sequential && !(hoverable && settings.hoverRadius > 0)"
            :model-value="settings.maxIterations"
            @update:model-value="value => change('maxIterations', value)"
          />
          <PreviewSlider
            title="Hover Radius"
            :min="0"
            :max="240"
            :step="10"
            value-unit="px"
            :is-disabled="!hoverable"
            :model-value="settings.hoverRadius"
            @update:model-value="value => change('hoverRadius', value)"
          />
          <PreviewSwitch
            title="Loop"
            :model-value="settings.loop"
            @update:model-value="value => change('loop', value)"
          />
          <PreviewSlider
            title="Loop Delay"
            :min="400"
            :max="5000"
            :step="100"
            value-unit="ms"
            :is-disabled="!settings.loop"
            :model-value="settings.loopDelay"
            @update:model-value="value => change('loopDelay', value)"
          />
          <PreviewSwitch
            title="Sequential"
            :model-value="settings.sequential"
            @update:model-value="value => change('sequential', value)"
          />
          <PreviewSelect
            title="Characters"
            :options="CHARACTER_OPTIONS"
            :model-value="settings.characters"
            :is-disabled="settings.useOriginalCharsOnly"
            @update:model-value="value => change('characters', String(value))"
          />
          <PreviewSwitch
            title="Original Chars"
            :model-value="settings.useOriginalCharsOnly"
            @update:model-value="value => change('useOriginalCharsOnly', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v']" />
      </template>

      <template #code>
        <CodeExample :code-object="decryptedText" component-name="DecryptedText" />
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
import { decryptedText } from '@/constants/code/TextAnimations/decryptedTextCode';
import DecryptedText from '@/content/TextAnimations/DecryptedText/DecryptedText.vue';

type Effect = 'scramble' | 'flip' | 'fade';
type AnimateOn = 'view' | 'hover' | 'inViewHover' | 'click';
type ClickMode = 'once' | 'toggle';
type RevealDirection = 'start' | 'end' | 'center' | 'random';

type Look = {
  scrambleColor: string;
  effect: Effect;
  animateOn: AnimateOn;
  speed: number;
  maxIterations: number;
  sequential: boolean;
  revealDirection: RevealDirection;
  hoverRadius: number;
  loop: boolean;
  loopDelay: number;
  characters: string;
  useOriginalCharsOnly: boolean;
};

const CHARACTER_SETS = {
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  hex: '0123456789ABCDEF',
  binary: '01',
  blocks: '█▓▒░',
  symbols: '!<>-_/[]{}=+*^?#'
};

const LOOK: Look = {
  scrambleColor: '',
  effect: 'scramble',
  animateOn: 'inViewHover',
  speed: 60,
  maxIterations: 10,
  sequential: true,
  revealDirection: 'start',
  hoverRadius: 100,
  loop: false,
  loopDelay: 2000,
  characters: CHARACTER_SETS.letters,
  useOriginalCharsOnly: false
};

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  terminal: {
    ...LOOK,
    scrambleColor: '#2bb673',
    revealDirection: 'random',
    speed: 40,
    hoverRadius: 70,
    characters: CHARACTER_SETS.hex
  },
  flip: {
    ...LOOK,
    effect: 'flip',
    revealDirection: 'center',
    speed: 70,
    hoverRadius: 0
  },
  loop: {
    ...LOOK,
    effect: 'fade',
    animateOn: 'view',
    speed: 45,
    hoverRadius: 0,
    loop: true,
    loopDelay: 1800,
    characters: CHARACTER_SETS.symbols
  }
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  clickMode: 'once' as ClickMode
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'flip', label: 'Flip' },
  { value: 'loop', label: 'Loop' }
];

const EFFECT_OPTIONS = [
  { label: 'Scramble', value: 'scramble' },
  { label: 'Flip', value: 'flip' },
  { label: 'Fade', value: 'fade' }
];

const ANIMATE_OPTIONS = [
  { label: 'View', value: 'view' },
  { label: 'Hover', value: 'hover' },
  { label: 'View & Hover', value: 'inViewHover' },
  { label: 'Click', value: 'click' }
];

const CLICK_OPTIONS = [
  { label: 'Once', value: 'once' },
  { label: 'Toggle', value: 'toggle' }
];

const DIRECTION_OPTIONS = [
  { label: 'Start', value: 'start' },
  { label: 'End', value: 'end' },
  { label: 'Center', value: 'center' },
  { label: 'Random', value: 'random' }
];

const CHARACTER_OPTIONS = [
  { label: 'Letters', value: CHARACTER_SETS.letters },
  { label: 'Hex', value: CHARACTER_SETS.hex },
  { label: 'Binary', value: CHARACTER_SETS.binary },
  { label: 'Blocks', value: CHARACTER_SETS.blocks },
  { label: 'Symbols', value: CHARACTER_SETS.symbols }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '-',
    description: 'The text to decrypt.'
  },
  {
    name: 'effect',
    type: "'scramble' | 'flip' | 'fade'",
    default: "'scramble'",
    description:
      'How letters decode. Scramble swaps glyphs in place, flip rolls each glyph in vertically and lands the real letter with a soft bounce, fade keeps scrambled glyphs faint and brightens them as they resolve.'
  },
  {
    name: 'scrambleColor',
    type: 'string',
    default: "''",
    description:
      'Color of letters while they are scrambled. Each letter eases back to the text color as it decodes. Leave empty to keep the text color.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '50',
    description: 'Time between steps, in ms.'
  },
  {
    name: 'maxIterations',
    type: 'number',
    default: '10',
    description:
      'How many steps the letters scramble before settling when not sequential. Also sets how long letters keep scrambling after the cursor passes with hoverRadius.'
  },
  {
    name: 'sequential',
    type: 'boolean',
    default: 'false',
    description: 'Reveals one letter per step instead of all at once.'
  },
  {
    name: 'revealDirection',
    type: "'start' | 'end' | 'center' | 'random'",
    default: "'start'",
    description: 'Where the sequential reveal starts. Random uncovers the letters in a shuffled order.'
  },
  {
    name: 'useOriginalCharsOnly',
    type: 'boolean',
    default: 'false',
    description: 'Scrambles using only the letters already in the text.'
  },
  {
    name: 'characters',
    type: 'string',
    default: "'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'",
    description: 'The pool of characters used while scrambling.'
  },
  {
    name: 'animateOn',
    type: "'view' | 'hover' | 'inViewHover' | 'click'",
    default: "'hover'",
    description: 'What starts the decryption. View and click start scrambled, so the real text never flashes first.'
  },
  {
    name: 'clickMode',
    type: "'once' | 'toggle'",
    default: "'once'",
    description: "With click, decrypt once or toggle back and forth. Only applies when animateOn is 'click'."
  },
  {
    name: 'hoverRadius',
    type: 'number',
    default: '0',
    description:
      'With hover, only letters within this many px of the cursor scramble, fading out toward the edge, and they settle once it passes. 0 decrypts the whole text on hover.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'After decrypting, holds, scrambles the text again and repeats. Pauses while off screen.'
  },
  {
    name: 'loopDelay',
    type: 'number',
    default: '2000',
    description: 'How long the decrypted text holds before scrambling again when looping, in ms.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Class names for revealed letters.'
  },
  {
    name: 'parentClassName',
    type: 'string',
    default: "''",
    description: 'Class names for the wrapper around all letters.'
  },
  {
    name: 'encryptedClassName',
    type: 'string',
    default: "''",
    description: 'Class names for letters that are still scrambled.'
  }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const { rerenderKey, forceRerender } = useForceRerender();
const ink = useColorModeValue('#161816', '#ffffff');

const settings = computed(() => {
  const { preset: _preset, scrambleColor: _scrambleColor, ...rest } = props.value;
  return rest;
});

const hoverable = computed(() => settings.value.animateOn === 'hover' || settings.value.animateOn === 'inViewHover');

const change = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
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

const computedProps = computed(() => (props.value.scrambleColor ? { scrambleColor: props.value.scrambleColor } : {}));
</script>
