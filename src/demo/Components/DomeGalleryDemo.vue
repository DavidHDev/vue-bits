<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[600px]">
        <DomeGallery
          :key="rerenderKey"
          :fit="fit"
          :fit-basis="fitBasis"
          :min-radius="minRadius"
          :max-radius="maxRadius"
          :pad-factor="padFactor"
          :overlay-blur-color="overlayBlurColor"
          :max-vertical-rotation-deg="maxVerticalRotationDeg"
          :drag-sensitivity="dragSensitivity"
          :enlarge-transition-ms="enlargeTransitionMs"
          :segments="segments"
          :drag-dampening="dragDampening"
          :opened-image-width="openedImageWidth"
          :opened-image-height="openedImageHeight"
          :image-border-radius="imageBorderRadius"
          :opened-image-border-radius="openedImageBorderRadius"
          :grayscale="grayscale"
        />
      </div>

      <Customize>
        <PreviewSlider title="Fit" v-model="fit" :min="0.1" :max="1" :step="0.05" />

        <PreviewSelect title="Fit Basis" v-model="fitBasis" :options="fitBasisOptions" />

        <PreviewSlider title="Min Radius" v-model="minRadius" :min="200" :max="800" :step="50" />

        <PreviewSlider title="Pad Factor" v-model="padFactor" :min="0.1" :max="0.5" :step="0.05" />

        <PreviewColor title="Overlay Blur Color" v-model="overlayBlurColor" />

        <PreviewSlider title="Max Vertical Rotation" v-model="maxVerticalRotationDeg" :min="0" :max="15" :step="1" />

        <PreviewSlider title="Drag Sensitivity" v-model="dragSensitivity" :min="5" :max="50" :step="5" />

        <PreviewSlider title="Enlarge Transition (ms)" v-model="enlargeTransitionMs" :min="200" :max="800" :step="50" />

        <PreviewSlider title="Segments" v-model="segments" :min="20" :max="50" :step="5" />

        <PreviewSlider title="Drag Dampening" v-model="dragDampening" :min="0.5" :max="5" :step="0.5" />

        <PreviewText title="Opened Image Width" v-model="openedImageWidth" placeholder="e.g., 400px" />

        <PreviewText title="Opened Image Height" v-model="openedImageHeight" placeholder="e.g., 400px" />

        <PreviewText title="Image Border Radius" v-model="imageBorderRadius" placeholder="e.g., 30px" />

        <PreviewText title="Opened Image Border Radius" v-model="openedImageBorderRadius" placeholder="e.g., 30px" />

        <PreviewSwitch title="Grayscale" v-model="grayscale" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="[]" />
    </template>

    <template #code>
      <CodeExample :code-object="domeGallery" />
    </template>

    <template #cli>
      <CliInstallation :command="domeGallery.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewText from '../../components/common/PreviewText.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import DomeGallery from '../../content/Components/DomeGallery/DomeGallery.vue';
import { domeGallery } from '@/constants/code/Components/domeGalleryCode';
import { useForceRerender } from '@/composables/useForceRerender';

const fit = ref(0.8);
const fitBasis = ref<'auto' | 'min' | 'max' | 'width' | 'height'>('auto');
const minRadius = ref(600);
const maxRadius = ref(Infinity);
const padFactor = ref(0.25);
const overlayBlurColor = ref('#060010');
const maxVerticalRotationDeg = ref(0);
const dragSensitivity = ref(20);
const enlargeTransitionMs = ref(300);
const segments = ref(34);
const dragDampening = ref(2);
const openedImageWidth = ref('250px');
const openedImageHeight = ref('350px');
const imageBorderRadius = ref('30px');
const openedImageBorderRadius = ref('30px');
const grayscale = ref(true);

const { rerenderKey } = useForceRerender();

const fitBasisOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Minimum', value: 'min' },
  { label: 'Maximum', value: 'max' },
  { label: 'Width', value: 'width' },
  { label: 'Height', value: 'height' }
];

const propData = [
  {
    name: 'images',
    type: 'Array<string | { src: string; alt?: string }>',
    default: 'DEFAULT_IMAGES',
    description: 'Array of images to display. Can be URLs or objects with src and alt properties.'
  },
  {
    name: 'fit',
    type: 'number',
    default: '0.5',
    description: 'Size factor for dome radius relative to container dimensions.'
  },
  {
    name: 'fitBasis',
    type: '"auto" | "min" | "max" | "width" | "height"',
    default: '"auto"',
    description: 'Determines which container dimension to use as basis for dome sizing.'
  },
  {
    name: 'minRadius',
    type: 'number',
    default: '600',
    description: 'Minimum dome radius in pixels.'
  },
  {
    name: 'maxRadius',
    type: 'number',
    default: 'Infinity',
    description: 'Maximum dome radius in pixels.'
  },
  {
    name: 'padFactor',
    type: 'number',
    default: '0.25',
    description: 'Padding factor for viewer area around the dome.'
  },
  {
    name: 'overlayBlurColor',
    type: 'string',
    default: '"#060010"',
    description: 'Color used for blur overlay and edge fading effects.'
  },
  {
    name: 'maxVerticalRotationDeg',
    type: 'number',
    default: '5',
    description: 'Maximum vertical rotation angle in degrees for drag interactions.'
  },
  {
    name: 'dragSensitivity',
    type: 'number',
    default: '20',
    description: 'Sensitivity of drag interactions. Lower values require more movement.'
  },
  {
    name: 'enlargeTransitionMs',
    type: 'number',
    default: '300',
    description: 'Duration of image enlargement animation in milliseconds.'
  },
  {
    name: 'segments',
    type: 'number',
    default: '35',
    description: 'Number of grid segments for image placement on the dome.'
  },
  {
    name: 'dragDampening',
    type: 'number',
    default: '2',
    description: 'Inertia damping factor for momentum after drag release.'
  },
  {
    name: 'openedImageWidth',
    type: 'string',
    default: '"250px"',
    description: 'Width of enlarged image when opened.'
  },
  {
    name: 'openedImageHeight',
    type: 'string',
    default: '"350px"',
    description: 'Height of enlarged image when opened.'
  },
  {
    name: 'imageBorderRadius',
    type: 'string',
    default: '"30px"',
    description: 'Border radius for image tiles on the dome.'
  },
  {
    name: 'openedImageBorderRadius',
    type: 'string',
    default: '"30px"',
    description: 'Border radius for enlarged image when opened.'
  },
  {
    name: 'grayscale',
    type: 'boolean',
    default: 'true',
    description: 'Whether to apply grayscale filter to images.'
  }
];
</script>