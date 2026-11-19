<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px">
          <p class="blob-cursor-demo-hint">Move and click</p>
          <BlobCursor v-bind="props" />
        </div>

        <Customize>
          <PreviewSelect
            title="Material"
            :options="MATERIAL_OPTIONS"
            :model-value="props.material"
            @update:model-value="value => updateProp('material', value as Material)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewSelect
            title="Blend"
            :options="BLEND_OPTIONS"
            :model-value="props.blend"
            @update:model-value="value => updateProp('blend', value as Blend)"
          />

          <PreviewSlider
            title="Size"
            :min="24"
            :max="240"
            :step="2"
            :display-value="(value: number) => `${value}px`"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Morph"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.morph"
            @update:model-value="value => updateProp('morph', value)"
          />
          <PreviewSlider
            title="Morph Speed"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.morphSpeed"
            @update:model-value="value => updateProp('morphSpeed', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0"
            :max="16"
            :step="1"
            :model-value="props.trail"
            @update:model-value="value => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Lag"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.lag"
            @update:model-value="value => updateProp('lag', value)"
          />
          <PreviewSlider
            title="Goo"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.goo"
            @update:model-value="value => updateProp('goo', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSlider
            title="Wobble"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.wobble"
            @update:model-value="value => updateProp('wobble', value)"
          />
          <PreviewSlider
            title="Drip"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.drip"
            @update:model-value="value => updateProp('drip', value)"
          />
          <PreviewSlider
            title="Shine"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.shine"
            @update:model-value="value => updateProp('shine', value)"
          />

          <PreviewSwitch
            title="Splash"
            :model-value="props.splash"
            @update:model-value="value => updateProp('splash', value)"
          />
          <PreviewSlider
            title="Splash Count"
            :min="1"
            :max="32"
            :step="1"
            :model-value="props.splashCount"
            @update:model-value="value => updateProp('splashCount', value)"
          />
          <PreviewSlider
            title="Splash Speed"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.splashSpeed"
            @update:model-value="value => updateProp('splashSpeed', value)"
          />
          <PreviewSlider
            title="Splash Size"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.splashSize"
            @update:model-value="value => updateProp('splashSize', value)"
          />
          <PreviewSlider
            title="Splash Gravity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.splashGravity"
            @update:model-value="value => updateProp('splashGravity', value)"
          />
          <PreviewSlider
            title="Regrow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.regrow"
            @update:model-value="value => updateProp('regrow', value)"
          />
          <PreviewSwitch
            title="Shadow"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSwitch
            title="Hide Cursor"
            :model-value="props.hideCursor"
            @update:model-value="value => updateProp('hideCursor', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['three']" />
      </template>

      <template #code>
        <CodeExample :code-object="blobCursor" component-name="BlobCursor" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
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
import { blobCursor } from '@/constants/code/Animations/blobCursorCode';
import BlobCursor from '@/content/Animations/BlobCursor/BlobCursor.vue';

type Material = 'chrome' | 'jelly' | 'pearl' | 'ink';
type Blend = 'normal' | 'difference' | 'exclusion' | 'multiply' | 'screen' | 'overlay';

const MATERIAL_OPTIONS = [
  { label: 'Chrome', value: 'chrome' },
  { label: 'Jelly', value: 'jelly' },
  { label: 'Pearl', value: 'pearl' },
  { label: 'Ink', value: 'ink' }
];

const BLEND_OPTIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Difference', value: 'difference' },
  { label: 'Exclusion', value: 'exclusion' },
  { label: 'Multiply', value: 'multiply' },
  { label: 'Screen', value: 'screen' },
  { label: 'Overlay', value: 'overlay' }
];

const DEFAULT_PROPS = {
  material: 'chrome' as Material,
  color: '#3B82F6',
  blend: 'normal' as Blend,
  size: 140,
  morph: 0,
  morphSpeed: 0.4,
  depth: 1,
  trail: 16,
  lag: 0.55,
  goo: 1,
  stretch: 0.6,
  wobble: 1,
  drip: 0,
  shine: 1,
  splash: true,
  splashCount: 6,
  splashSpeed: 0.5,
  splashSize: 0.5,
  splashGravity: 0,
  regrow: 0.5,
  shadow: false,
  hideCursor: true
};

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const propData: PropRow[] = [
  {
    name: 'material',
    type: "'chrome' | 'jelly' | 'pearl' | 'ink'",
    default: "'chrome'",
    description:
      'What the blob is made of. Chrome is liquid metal, jelly a glossy colored gel, pearl an iridescent shell and ink a flat goo.'
  },
  {
    name: 'color',
    type: 'string',
    default: "'#3B82F6'",
    description: 'Color of the blob. Tints the reflections on chrome and pearl, and fills jelly and ink.'
  },
  {
    name: 'blend',
    type: "'normal' | 'difference' | 'exclusion' | 'multiply' | 'screen' | 'overlay'",
    default: "'normal'",
    description:
      'How the blob mixes with the page under it. Difference with a white ink blob inverts whatever it covers.'
  },
  { name: 'size', type: 'number', default: '140', description: 'Diameter of the main blob in pixels.' },
  {
    name: 'morph',
    type: 'number',
    default: '0',
    description:
      'How far the blob drifts from a perfect sphere, from 0 for a round bead to 1 for a restless, shapeshifting puddle.'
  },
  {
    name: 'morphSpeed',
    type: 'number',
    default: '0.4',
    description: 'How fast the shape keeps changing, from 0 for a frozen shape to 1 for a boiling one.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '1',
    description: 'How tall the liquid stands, from 0 for a flat puddle to 1 for a full, round bead.'
  },
  {
    name: 'trail',
    type: 'number',
    default: '16',
    description:
      'How many links the liquid tail has, from 0 for no tail to 16 for a long tail that curves along your path.'
  },
  {
    name: 'lag',
    type: 'number',
    default: '0.55',
    description: 'How lazily the blob follows the pointer, from 0 for tight to 1 for slow and floaty.'
  },
  {
    name: 'goo',
    type: 'number',
    default: '1',
    description:
      'How thick and syrupy the liquid is where the tail and droplets meet the blob, from 0 for crisp to 1 for gooey.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '0.6',
    description: 'How far the blob pulls out into a teardrop as it moves, from 0 for short to 1 for a long comet.'
  },
  {
    name: 'wobble',
    type: 'number',
    default: '1',
    description: 'How bouncy and jelly-like it is when it stops, turns or gets clicked.'
  },
  {
    name: 'drip',
    type: 'number',
    default: '0',
    description:
      'How many droplets fling off the tail on fast moves. They stay on the page until they dry up or the blob soaks them back up.'
  },
  {
    name: 'shine',
    type: 'number',
    default: '1',
    description: 'Strength of the highlights and reflections.'
  },
  {
    name: 'splash',
    type: 'boolean',
    default: 'true',
    description: 'Clicking bursts droplets out of the blob. They fly off the page and the blob grows back.'
  },
  {
    name: 'splashCount',
    type: 'number',
    default: '6',
    description: 'How many droplets each click throws out, from 1 to 32.'
  },
  {
    name: 'splashSpeed',
    type: 'number',
    default: '0.5',
    description: 'How fast the droplets fly, from 0 for a gentle spill to 1 for a hard burst.'
  },
  {
    name: 'splashSize',
    type: 'number',
    default: '0.5',
    description: 'Size of the droplets relative to the blob. Bigger droplets take more of the blob with them.'
  },
  {
    name: 'splashGravity',
    type: 'number',
    default: '0',
    description: 'Pulls the droplets down as they fly, from 0 for straight lines to 1 for a heavy arc.'
  },
  {
    name: 'regrow',
    type: 'number',
    default: '0.5',
    description: 'How quickly the blob grows back to full size after a splash.'
  },
  {
    name: 'shadow',
    type: 'boolean',
    default: 'false',
    description: 'Casts a soft shadow under the blob so it sits on the page.'
  },
  {
    name: 'hideCursor',
    type: 'boolean',
    default: 'true',
    description: 'Hides the system cursor over the area so the blob becomes the cursor.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the root element.' }
];
</script>

<style scoped>
.blob-cursor-demo-hint {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-dimmed);
  user-select: none;
}
</style>
