<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px]">
        <RefreshButton @refresh="forceRerender" />

        <FadeContent
          :key="rerenderKey"
          :blur="blur"
          :duration="duration"
          :delay="delay"
          :threshold="threshold"
          :initial-opacity="initialOpacity"
          :ease="ease"
          :disappear-after="disappearAfter"
          :disappear-duration="disappearDuration"
          :disappear-ease="disappearEase"
          class="fade-content-demo-content"
          @complete="() => console.log('✅ Fade Complete!')"
          @disappearance-complete="() => console.log('👋 Disappearance Complete!')"
        >
          <div class="demo-content">
            <h4>Fade Content</h4>

            <p>It will fade in when it enters the viewport.</p>
          </div>
        </FadeContent>
      </div>

      <Customize>
        <PreviewSwitch title="Enable Blur Effect" v-model="blur" />

        <PreviewSlider title="Duration" v-model="duration" :min="0.1" :max="3" :step="0.1" value-unit="s" />

        <PreviewSlider title="Delay" v-model="delay" :min="0" :max="2" :step="0.1" value-unit="s" />

        <PreviewSlider title="Threshold" v-model="threshold" :min="0.1" :max="1" :step="0.1" />

        <PreviewSlider title="Initial Opacity" v-model="initialOpacity" :min="0" :max="1" :step="0.1" />

        <PreviewSelect title="Easing Function" v-model="ease" :options="easeOptions" />

        <PreviewSlider title="Disappear After" v-model="disappearAfter" :min="0" :max="5" :step="0.5" value-unit="s" />

        <PreviewSlider title="Disappear Duration" v-model="disappearDuration" :min="0.1" :max="2" :step="0.1" value-unit="s" />

        <PreviewSelect title="Disappear Ease" v-model="disappearEase" :options="disappearEaseOptions" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="fadeContent" />
    </template>

    <template #cli>
      <CliInstallation :command="fadeContent.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import FadeContent from '../../content/Animations/FadeContent/FadeContent.vue';
import { fadeContent } from '@/constants/code/Animations/fadeContentCode';
import { useForceRerender } from '@/composables/useForceRerender';

const blur = ref(true);
const duration = ref(1);
const delay = ref(0.2);
const threshold = ref(0.1);
const initialOpacity = ref(0);
const ease = ref('power2.out');
const disappearAfter = ref(0);
const disappearDuration = ref(0.5);
const disappearEase = ref('power2.in');
const { rerenderKey, forceRerender } = useForceRerender();

const easeOptions = [
  { label: 'Power2 Out', value: 'power2.out' },
  { label: 'Power3 Out', value: 'power3.out' },
  { label: 'Ease Out', value: 'ease.out' }
];

const disappearEaseOptions = [
  { label: 'Power2 In', value: 'power2.in' },
  { label: 'Power3 In', value: 'power3.in' },
  { label: 'Ease In', value: 'ease.in' }
];

const propData = [
  { name: 'blur', type: 'boolean', default: 'false', description: 'Enable blur effect during fade animation.' },
  { name: 'duration', type: 'number', default: '1', description: 'Animation duration in seconds.' },
  { name: 'ease', type: 'string | function', default: '"power2.out"', description: 'GSAP easing function for the animation.' },
  { name: 'delay', type: 'number', default: '0', description: 'Delay before animation starts in seconds.' },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Intersection threshold to trigger animation (0-1).'
  },
  { name: 'initialOpacity', type: 'number', default: '0', description: 'Initial opacity before animation (0-1).' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS classes for styling.' },
  {
    name: 'container',
    type: 'string | HTMLElement | null',
    default: 'null',
    description: 'Custom scroll container element or selector.'
  },
  {
    name: 'disappearAfter',
    type: 'number',
    default: '0',
    description: 'Delay before disappear animation starts (in seconds). Set to 0 to disable.'
  },
  {
    name: 'disappearDuration',
    type: 'number',
    default: '0.5',
    description: 'Duration of the disappear animation in seconds.'
  },
  {
    name: 'disappearEase',
    type: 'string | function',
    default: '"power2.in"',
    description: 'GSAP easing function for the disappear animation.'
  }
];

watch([blur, ease, disappearEase], () => {
  forceRerender();
});
</script>

<style scoped>
.fade-content-demo-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.demo-content {
  text-align: center;
  padding: 2rem;
  border: 1px solid #ffffff1c;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  max-width: 400px;
}

.demo-content h4 {
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.demo-content p {
  color: #a1a1aa;
  text-align: center;
  max-width: 25ch;
  line-height: 1.6;
}
</style>
