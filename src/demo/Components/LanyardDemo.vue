<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetAll"
    :has-changes="hasAnyChanges"
    :demo-only-props="['plainStrap']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <p class="lanyard-demo-hint">Try dragging</p>
          <div class="absolute inset-0">
            <Lanyard
              :key="rerenderKey"
              v-bind="lanyardProps"
              :front-image="frontImage"
              :back-image="backImage"
              :strap-image="strapImage"
            />
          </div>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <div v-for="field in UPLOAD_FIELDS" :key="field.slot" class="scrubber">
            <button type="button" class="scrubber-track scrubber-track--select" @click="openPicker(field.slot)">
              <span class="scrubber-label">{{ field.title }}</span>
              <span class="scrubber-select-right">
                <span
                  class="scrubber-value"
                  style="max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >
                  {{ uploads[field.slot] ? uploads[field.slot]!.name : 'Upload' }}
                </span>
              </span>
            </button>
            <input
              :ref="el => setInput(field.slot, el as HTMLInputElement | null)"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
              hidden
              @change="event => handleChange(field.slot, event)"
            />
          </div>
          <PreviewSelect
            title="Image Fit"
            :options="FIT_OPTIONS"
            :model-value="props.imageFit"
            @update:model-value="value => updateOption('imageFit', value)"
          />
          <PreviewSelect
            title="Orientation"
            :options="ORIENTATION_OPTIONS"
            :model-value="props.orientation"
            @update:model-value="value => updateOption('orientation', value)"
          />

          <PreviewSelect
            title="Finish"
            :options="FINISH_OPTIONS"
            :model-value="props.finish"
            @update:model-value="value => updateOption('finish', value)"
          />
          <PreviewSelect
            title="Metal"
            :options="METAL_OPTIONS"
            :model-value="props.metal"
            @update:model-value="value => updateOption('metal', value)"
          />
          <PreviewColorPickerCustom
            title="Card Color"
            :color="props.cardColor"
            @change="(value: string) => updateProp('cardColor', value)"
          />
          <PreviewSwitch
            title="Plain Band"
            :model-value="props.plainStrap"
            @update:model-value="value => updateProp('plainStrap', value)"
          />
          <PreviewColorPickerCustom
            title="Band Color"
            :color="props.strapColor"
            @change="(value: string) => updateProp('strapColor', value)"
          />
          <PreviewSlider
            title="Corner Radius"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.cornerRadius"
            @update:model-value="value => updateProp('cornerRadius', value)"
          />

          <PreviewSelect
            title="Anchor"
            :options="ANCHOR_OPTIONS"
            :model-value="props.anchor"
            @update:model-value="value => updateOption('anchor', value)"
          />
          <PreviewSlider
            title="Size"
            :min="0.2"
            :max="0.8"
            :step="0.01"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Band Length"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.strapLength"
            @update:model-value="value => updateProp('strapLength', value)"
          />
          <PreviewSlider
            title="Band Width"
            :min="0.4"
            :max="2"
            :step="0.05"
            :model-value="props.strapWidth"
            @update:model-value="value => updateProp('strapWidth', value)"
          />

          <PreviewSlider
            title="Gravity"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.gravity"
            @update:model-value="value => updateProp('gravity', value)"
          />
          <PreviewSlider
            title="Damping"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.damping"
            @update:model-value="value => updateProp('damping', value)"
          />
          <PreviewSlider
            title="Elasticity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.elasticity"
            @update:model-value="value => updateProp('elasticity', value)"
          />
          <PreviewSlider
            title="Breeze"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.breeze"
            @update:model-value="value => updateProp('breeze', value)"
          />

          <PreviewSwitch
            title="Interactive"
            :model-value="props.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['three']" />
      </template>

      <template #code>
        <CodeExample :code-object="lanyard" component-name="Lanyard" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
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
import { lanyard } from '@/constants/code/Components/lanyardCode';
import Lanyard from '@/content/Components/Lanyard/Lanyard.vue';
import cardFront from '@/assets/lanyard/card-front.webp';
import cardBack from '@/assets/lanyard/card-back.webp';
import band from '@/assets/lanyard/lanyard.png';

type Slot = 'front' | 'back' | 'strap';
type Upload = { url: string; name: string };

const UPLOAD_FIELDS: { slot: Slot; title: string }[] = [
  { slot: 'front', title: 'Front Image' },
  { slot: 'back', title: 'Back Image' },
  { slot: 'strap', title: 'Band Image' }
];

const ORIENTATION_OPTIONS = [
  { label: 'Portrait', value: 'portrait' },
  { label: 'Landscape', value: 'landscape' }
];

const FIT_OPTIONS = [
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' }
];

const FINISH_OPTIONS = [
  { label: 'Glossy', value: 'glossy' },
  { label: 'Matte', value: 'matte' },
  { label: 'Holographic', value: 'holographic' },
  { label: 'Metallic', value: 'metallic' }
];

const METAL_OPTIONS = [
  { label: 'Graphite', value: 'graphite' },
  { label: 'Silver', value: 'silver' },
  { label: 'Gold', value: 'gold' }
];

const ANCHOR_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' }
];

const DEFAULT_PROPS = {
  imageFit: 'cover' as 'cover' | 'contain',
  cardColor: '#ffffff',
  orientation: 'portrait' as 'portrait' | 'landscape',
  finish: 'glossy' as 'glossy' | 'matte' | 'holographic' | 'metallic',
  cornerRadius: 0.3,
  size: 0.6,
  anchor: 'center' as 'left' | 'center' | 'right',
  strapLength: 0.5,
  strapColor: '#111111',
  strapWidth: 0.65,
  plainStrap: false,
  metal: 'silver' as 'graphite' | 'silver' | 'gold',
  gravity: 1,
  damping: 0.5,
  elasticity: 0.5,
  breeze: 0.5,
  interactive: true,
  intro: true
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const updateOption = <K extends keyof typeof DEFAULT_PROPS>(key: K, value: unknown) =>
  updateProp(key, value as (typeof DEFAULT_PROPS)[K]);

const lanyardProps = computed(() => {
  const { plainStrap: _plainStrap, ...rest } = props.value;
  return rest;
});

const uploads = ref<Record<Slot, Upload | null>>({ front: null, back: null, strap: null });
const inputs: Partial<Record<Slot, HTMLInputElement | null>> = {};

const setInput = (slot: Slot, el: HTMLInputElement | null) => {
  inputs[slot] = el;
};

const openPicker = (slot: Slot) => inputs[slot]?.click();

const revokeAll = () => {
  Object.values(uploads.value).forEach(upload => upload && URL.revokeObjectURL(upload.url));
};

const pick = (slot: Slot, file: File) => {
  const previous = uploads.value[slot];
  if (previous) URL.revokeObjectURL(previous.url);
  const url = URL.createObjectURL(file);
  uploads.value = { ...uploads.value, [slot]: { url, name: file.name } };
};

const handleChange = (slot: Slot, event: Event) => {
  const target = event.target as HTMLInputElement;
  const picked = target.files?.[0];
  target.value = '';
  if (picked) pick(slot, picked);
};

const resetAll = () => {
  resetProps();
  revokeAll();
  uploads.value = { front: null, back: null, strap: null };
};

onBeforeUnmount(revokeAll);

const hasAnyChanges = computed(() => hasChanges.value || Object.values(uploads.value).some(Boolean));

const frontImage = computed(() => uploads.value.front?.url ?? cardFront);
const backImage = computed(() => uploads.value.back?.url ?? (uploads.value.front ? uploads.value.front.url : cardBack));
const strapImage = computed(() => (props.value.plainStrap ? undefined : (uploads.value.strap?.url ?? band)));

const propData: PropRow[] = [
  {
    name: 'frontImage',
    type: 'string',
    default: 'undefined',
    description: 'Image URL printed on the front of the card. Any size or aspect works.'
  },
  {
    name: 'backImage',
    type: 'string',
    default: 'undefined',
    description: 'Image URL printed on the back. Falls back to frontImage, then to a blank card.'
  },
  {
    name: 'imageFit',
    type: "'cover' | 'contain'",
    default: "'cover'",
    description: 'How the images fit the card. Cover fills and crops, contain fits inside on the card color.'
  },
  {
    name: 'cardColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the card itself, shown when there is no image and around contained images.'
  },
  {
    name: 'orientation',
    type: "'portrait' | 'landscape'",
    default: "'portrait'",
    description: 'Whether the card hangs tall or wide.'
  },
  {
    name: 'finish',
    type: "'glossy' | 'matte' | 'holographic' | 'metallic'",
    default: "'glossy'",
    description:
      'Surface of the card. Holographic adds a sparkling foil whose colors shift as the card turns, metallic a brushed sheen.'
  },
  {
    name: 'cornerRadius',
    type: 'number',
    default: '0.3',
    description: 'Roundness of the card corners, from 0 for square to 1 for very round.'
  },
  {
    name: 'size',
    type: 'number',
    default: '0.6',
    description: 'Height of the card as a fraction of the container height.'
  },
  {
    name: 'anchor',
    type: "'left' | 'center' | 'right'",
    default: "'center'",
    description: 'Where the band hangs from along the top edge of the container.'
  },
  {
    name: 'strapLength',
    type: 'number',
    default: '0.5',
    description: 'How far below the top edge the card hangs, from 0 for a short band to 1 for a long one.'
  },
  {
    name: 'strapImage',
    type: 'string',
    default: 'undefined',
    description:
      'Image URL printed along the band. A wide image repeats along its length, with its height spanning the band width.'
  },
  {
    name: 'strapColor',
    type: 'string',
    default: "'#111111'",
    description: 'Color of the band when there is no strap image.'
  },
  {
    name: 'strapWidth',
    type: 'number',
    default: '0.65',
    description: 'Width of the band relative to its default, from 0.4 to 2.'
  },
  {
    name: 'metal',
    type: "'graphite' | 'silver' | 'gold'",
    default: "'silver'",
    description: 'Finish of the clamp and the ring that holds the card.'
  },
  {
    name: 'gravity',
    type: 'number',
    default: '1',
    description: 'How strongly the card falls. Lower values float and swing slowly, 0 turns gravity off.'
  },
  {
    name: 'damping',
    type: 'number',
    default: '0.5',
    description: 'How quickly the swinging dies down, from 0 for a long sway to 1 for a quick settle.'
  },
  {
    name: 'elasticity',
    type: 'number',
    default: '0.5',
    description: 'How hard the band snaps the card back after it is stretched and released.'
  },
  {
    name: 'breeze',
    type: 'number',
    default: '0.5',
    description: 'A gentle, ever-changing wind that keeps the card moving when nobody touches it.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Lets visitors drag, stretch and throw the card, and click it to flip it over.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'On mount the card drops in from the side and swings into place.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root element.' }
];
</script>

<style scoped>
.lanyard-demo-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 14px;
  color: var(--text-dimmed);
  pointer-events: none;
  user-select: none;
}
</style>
