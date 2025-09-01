<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <TiltedCard
          image-src="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
          alt-text="Kendrick Lamar - GNX Album Cover"
          caption-text="Kendrick Lamar - GNX"
          container-height="300px"
          container-width="300px"
          image-height="300px"
          image-width="300px"
          :rotate-amplitude="rotateAmplitude"
          :scale-on-hover="scaleOnHover"
          :show-mobile-warning="false"
          :show-tooltip="showTooltip"
          :display-overlay-content="displayOverlayContent"
          :overlay-content="displayOverlayContent"
        >
          <template #overlay>
            <p class="tilted-card-demo-text">Kendrick Lamar - GNX</p>
          </template>
        </TiltedCard>
      </div>

      <Customize>
        <PreviewSlider title="Rotate Amplitude" v-model="rotateAmplitude" :min="0" :max="30" :step="1" />

        <PreviewSlider title="Scale on Hover" v-model="scaleOnHover" :min="1" :max="1.5" :step="0.05" />

        <PreviewSwitch title="Show Tooltip" v-model="showTooltip" />

        <PreviewSwitch title="Show Overlay Content" v-model="displayOverlayContent" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="tiltedCard" />
    </template>

    <template #cli>
      <CliInstallation :command="tiltedCard.cli" />
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
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import TiltedCard from '../../content/Components/TiltedCard/TiltedCard.vue';
import { tiltedCard } from '@/constants/code/Components/tiltedCardCode';

const rotateAmplitude = ref(12);
const scaleOnHover = ref(1.05);
const showTooltip = ref(true);
const displayOverlayContent = ref(true);

const propData = [
  {
    name: 'imageSrc',
    type: 'string',
    default: 'N/A',
    description: 'The source URL of the image.'
  },
  {
    name: 'altText',
    type: 'string',
    default: 'Tilted card image',
    description: 'Alternative text for the image.'
  },
  {
    name: 'captionText',
    type: 'string',
    default: '',
    description: 'Text for the tooltip caption.'
  },
  {
    name: 'containerHeight',
    type: 'string',
    default: '300px',
    description: 'Height of the overall card container.'
  },
  {
    name: 'containerWidth',
    type: 'string',
    default: '100%',
    description: 'Width of the overall card container.'
  },
  {
    name: 'imageHeight',
    type: 'string',
    default: '300px',
    description: 'Height of the inner image.'
  },
  {
    name: 'imageWidth',
    type: 'string',
    default: '300px',
    description: 'Width of the inner image.'
  },
  {
    name: 'scaleOnHover',
    type: 'number',
    default: '1.1',
    description: 'Scaling factor applied on hover.'
  },
  {
    name: 'rotateAmplitude',
    type: 'number',
    default: '14',
    description: 'Controls how much the card tilts with mouse movement.'
  },
  {
    name: 'showMobileWarning',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show a small alert about mobile usage.'
  },
  {
    name: 'showTooltip',
    type: 'boolean',
    default: 'true',
    description: 'Toggles the visibility of the tooltip (figcaption).'
  },
  {
    name: 'displayOverlayContent',
    type: 'boolean',
    default: 'false',
    description: 'Whether to display any overlayContent on top of the image.'
  },
  {
    name: 'overlayContent',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show overlay content (use overlay slot for content).'
  }
];
</script>

<style scoped>
.tilted-card-demo-text {
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}
</style>
