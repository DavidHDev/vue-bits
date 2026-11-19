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
        <div class="demo-container relative overflow-hidden" style="min-height: 400px; max-height: 400px">
          <div class="rotating-text-demo">
            <p ref="pRef" class="rotating-text-ptag">
              <span ref="creativeRef" class="pt-0.5 sm:pt-1 md:pt-2">Creative{{ ' ' }}</span>
              <RotatingText
                :key="rerenderKey"
                :texts="WORDS"
                :split-level-class-name="masked ? 'rotating-text-split' : undefined"
                animate-presence-initial
                v-bind="settings"
                :highlight-color="blockColor"
              />
            </p>
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
            title="Highlight Color"
            :color="blockColor"
            @change="value => updateProp('highlightColor', value)"
          />
          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => updateAndReplay('effect', value as Effect)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            :is-disabled="settings.effect === 'drop'"
            @update:model-value="value => updateAndReplay('direction', value as Direction)"
          />
          <PreviewSlider
            title="Rotation Interval"
            :min="500"
            :max="5000"
            :step="100"
            value-unit="ms"
            :model-value="settings.rotationInterval"
            @update:model-value="value => updateProp('rotationInterval', value)"
          />
          <PreviewSlider
            title="Stagger Duration"
            :min="0"
            :max="0.1"
            :step="0.005"
            value-unit="s"
            :model-value="settings.staggerDuration"
            @update:model-value="value => updateProp('staggerDuration', value)"
          />
          <PreviewSelect
            title="Stagger From"
            :options="STAGGER_FROM_OPTIONS"
            :model-value="settings.staggerFrom"
            @update:model-value="value => updateProp('staggerFrom', value as StaggerFrom)"
          />
          <PreviewSelect
            title="Split By"
            :options="SPLIT_BY_OPTIONS"
            :model-value="settings.splitBy"
            @update:model-value="value => updateAndReplay('splitBy', String(value))"
          />
          <PreviewSlider
            title="Blur"
            :min="0"
            :max="16"
            :step="1"
            value-unit="px"
            :model-value="settings.blur"
            @update:model-value="value => updateProp('blur', value)"
          />
          <PreviewSwitch
            title="Auto"
            :model-value="settings.auto"
            @update:model-value="value => updateProp('auto', value)"
          />
          <PreviewSwitch
            title="Loop"
            :model-value="settings.loop"
            @update:model-value="value => updateProp('loop', value)"
          />
          <PreviewSwitch
            title="Pause On Hover"
            :model-value="settings.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />
          <PreviewSwitch
            title="Highlight"
            :model-value="settings.highlight"
            @update:model-value="value => updateAndReplay('highlight', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v']" />
      </template>

      <template #code>
        <CodeExample :code-object="rotatingText" component-name="RotatingText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import { animate, motionValue } from 'motion-v';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { rotatingText } from '@/constants/code/TextAnimations/rotatingTextCode';
import RotatingText from '@/content/TextAnimations/RotatingText/RotatingText.vue';

type Effect = 'slide' | 'flip' | 'blur' | 'scale' | 'drop';
type Direction = 'up' | 'down';
type StaggerFrom = 'first' | 'last' | 'center' | 'random';

const WORDS = ['thinking', 'coding', 'components!'];

const LOOK = {
  highlightColor: '',
  effect: 'slide' as Effect,
  direction: 'up' as Direction,
  rotationInterval: 2000,
  staggerDuration: 0.025,
  staggerFrom: 'last' as StaggerFrom,
  splitBy: 'characters',
  blur: 0,
  highlight: true
};

type Look = typeof LOOK;

const PRESETS: Record<string, Look> = {
  slide: { ...LOOK },
  flip: {
    ...LOOK,
    effect: 'flip',
    rotationInterval: 2200,
    staggerDuration: 0.035,
    staggerFrom: 'first',
    highlight: false
  },
  blur: {
    ...LOOK,
    effect: 'blur',
    direction: 'down',
    rotationInterval: 2400,
    staggerDuration: 0.03,
    staggerFrom: 'center',
    blur: 12,
    highlight: false
  },
  drop: {
    ...LOOK,
    highlightColor: '#facc15',
    effect: 'drop',
    staggerDuration: 0.04,
    staggerFrom: 'first'
  }
};

const DEFAULT_PROPS = {
  preset: 'slide',
  ...LOOK,
  auto: true,
  loop: true,
  pauseOnHover: false
};

const PRESET_OPTIONS = [
  { value: 'slide', label: 'Slide' },
  { value: 'flip', label: 'Flip' },
  { value: 'blur', label: 'Blur' },
  { value: 'drop', label: 'Drop' }
];

const EFFECT_OPTIONS = [
  { value: 'slide', label: 'Slide' },
  { value: 'flip', label: 'Flip' },
  { value: 'blur', label: 'Blur' },
  { value: 'scale', label: 'Scale' },
  { value: 'drop', label: 'Drop' }
];

const DIRECTION_OPTIONS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' }
];

const STAGGER_FROM_OPTIONS = [
  { value: 'first', label: 'First' },
  { value: 'last', label: 'Last' },
  { value: 'center', label: 'Center' },
  { value: 'random', label: 'Random' }
];

const SPLIT_BY_OPTIONS = [
  { value: 'characters', label: 'Characters' },
  { value: 'words', label: 'Words' },
  { value: 'lines', label: 'Lines' }
];

const propData: PropRow[] = [
  {
    name: 'texts',
    type: 'string[]',
    default: '[]',
    description: 'The texts to rotate through.'
  },
  {
    name: 'effect',
    type: "'slide' | 'flip' | 'blur' | 'scale' | 'drop'",
    default: '"slide"',
    description:
      'How letters swap. Flip rolls them over like a drum, blur dissolves them, scale zooms through and drop lets them fall in with a small bounce.'
  },
  {
    name: 'direction',
    type: "'up' | 'down'",
    default: '"up"',
    description: 'Which way letters travel. Drop always falls from above.'
  },
  {
    name: 'highlight',
    type: 'boolean',
    default: 'false',
    description:
      'Puts the rotating text on a colored block that smoothly resizes to fit each new text, with a text color picked for contrast.'
  },
  {
    name: 'highlightColor',
    type: 'string',
    default: '"#7cff67"',
    description: 'Color of the highlight block. Hex or rgb colors also set a readable text color automatically.'
  },
  {
    name: 'rotationInterval',
    type: 'number',
    default: '2000',
    description: 'Time each text stays on screen, in milliseconds.'
  },
  {
    name: 'blur',
    type: 'number',
    default: '0',
    description: 'Blurs letters as they come and go, in px. The blur effect uses 10 when this is 0.'
  },
  {
    name: 'staggerDuration',
    type: 'number',
    default: '0',
    description: 'Delay between letters, in seconds.'
  },
  {
    name: 'staggerFrom',
    type: "'first' | 'last' | 'center' | 'random' | number",
    default: '"first"',
    description: 'Which letter moves first. A number starts from that letter, random shuffles the order.'
  },
  {
    name: 'splitBy',
    type: "'characters' | 'words' | 'lines' | string",
    default: '"characters"',
    description: 'How each text is split into moving pieces. Any other string is used as the separator.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Goes back to the first text after the last one.'
  },
  {
    name: 'auto',
    type: 'boolean',
    default: 'true',
    description: 'Rotates on its own. Turn off to drive it with the ref methods.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Holds the current text while the pointer is over it.'
  },
  {
    name: 'initial',
    type: 'object',
    default: '-',
    description: 'Overrides the state each letter enters from. Leave unset to use the effect.'
  },
  {
    name: 'animate',
    type: 'object',
    default: '-',
    description: 'Overrides the state each letter settles into.'
  },
  {
    name: 'exit',
    type: 'object',
    default: '-',
    description: 'Overrides the state each letter leaves to.'
  },
  {
    name: 'transition',
    type: 'object',
    default: '-',
    description: 'Overrides the Motion transition used for every letter. Each effect brings its own by default.'
  },
  {
    name: 'animatePresenceMode',
    type: "'wait' | 'sync'",
    default: '"wait"',
    description: "'wait' lets the old text leave before the new one enters, 'sync' runs both at once."
  },
  {
    name: 'animatePresenceInitial',
    type: 'boolean',
    default: 'false',
    description: 'Animates the first text in on mount.'
  },
  {
    name: 'onNext',
    type: '(index: number) => void',
    default: 'undefined',
    description: 'Called with the new index whenever the text changes.'
  },
  {
    name: 'mainClassName',
    type: 'string',
    default: "''",
    description: 'Extra class names for the outer element.'
  },
  {
    name: 'splitLevelClassName',
    type: 'string',
    default: "''",
    description: 'Extra class names for each group of letters. Add overflow hidden here for a masked slide.'
  },
  {
    name: 'elementLevelClassName',
    type: 'string',
    default: "''",
    description: 'Extra class names for each moving letter.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, highlightColor: _highlightColor, ...rest } = props.value;
  return rest;
});

const primary = useColorModeValue('#1f9d45', '#7cff67');
const blockColor = computed(() => props.value.highlightColor || primary.value);
const masked = computed(() => settings.value.effect === 'slide' || settings.value.effect === 'drop');

const updateAndReplay = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
  updateProp(name, value);
  forceRerender();
};

const applyPreset = (value: string) => {
  const defaults = defaultProps.value as Record<string, unknown>;
  const base = Object.fromEntries(Object.keys(LOOK).map(name => [name, defaults[name]]));
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

const computedProps = computed(() => ({ highlightColor: blockColor.value }));
const pRef = useTemplateRef<HTMLParagraphElement>('pRef');
const creativeRef = useTemplateRef<HTMLSpanElement>('creativeRef');
let stopLayout: (() => void) | null = null;

onMounted(() => {
  const p = pRef.value;
  const creative = creativeRef.value;
  if (!p || !creative) return;
  const rect = (el: HTMLElement) => el.getBoundingClientRect();
  const layouts = [
    {
      el: p as HTMLElement,
      parent: () => p.parentElement ?? p,
      transition: { duration: 0.45, ease: [0.4, 0, 0.1, 1] }
    },
    { el: creative as HTMLElement, parent: () => p, transition: { type: 'spring', damping: 30, stiffness: 400 } }
  ].map(node => {
    const x = motionValue(0);
    const y = motionValue(0);
    const write = () => {
      node.el.style.transform = x.get() || y.get() ? `translateX(${x.get()}px) translateY(${y.get()}px)` : '';
    };
    x.on('change', write);
    y.on('change', write);
    const origin = () => {
      const a = rect(node.el);
      const b = rect(node.parent());
      return { x: a.left - b.left - x.get(), y: a.top - b.top - y.get() };
    };
    return { ...node, x, y, origin, last: { x: 0, y: 0 } };
  });
  for (const node of layouts) node.last = node.origin();
  const measure = () => {
    const origins = layouts.map(node => node.origin());
    layouts.forEach((node, i) => {
      const now = origins[i];
      const dx = node.last.x + node.x.get() - now.x;
      const dy = node.last.y + node.y.get() - now.y;
      node.last = now;
      if (settings.value.highlight) return;
      if (Math.abs(dx) >= 0.5) {
        node.x.set(dx);
        animate(node.x, 0, node.transition as never);
      }
      if (Math.abs(dy) >= 0.5) {
        node.y.set(dy);
        animate(node.y, 0, node.transition as never);
      }
    });
  };
  const observer = new ResizeObserver(measure);
  observer.observe(p);
  stopLayout = () => {
    observer.disconnect();
    for (const node of layouts) {
      node.x.stop();
      node.y.stop();
      node.el.style.transform = '';
    }
  };
});

onBeforeUnmount(() => {
  stopLayout?.();
  stopLayout = null;
});
</script>

<style>
@layer components {
  .rotating-text-demo {
    width: 100%;
    height: 100%;
    font-size: 1.5rem;
    line-height: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: 300;
    overflow: hidden;
    padding: 3rem;
    color: #fff;
  }

  .rotating-text-split {
    overflow: hidden;
    padding-bottom: 0.125rem;
  }

  .rotating-text-ptag {
    font-weight: 900;
    display: flex;
    align-items: center;
    gap: 0.2em;
  }

  @media (min-width: 640px) {
    .rotating-text-demo {
      font-size: 1.875rem;
      line-height: 2.25rem;
      padding: 5rem;
    }

    .rotating-text-split {
      padding-bottom: 0.25rem;
    }
  }

  @media (min-width: 768px) {
    .rotating-text-demo {
      font-size: 3rem;
      line-height: 1;
      padding: 6rem;
    }
  }
}
</style>
