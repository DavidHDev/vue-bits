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
          :easing="easing"
          class="fade-content-demo-content"
        >
          <div class="demo-content">
            <h4>Fade Content</h4>

            <p>It will fade in when it enters the viewport.</p>
          </div>
        </FadeContent>
      </div>

      <Customize>
        <PreviewSwitch title="Enable Blur Effect" v-model="blur" />

        <PreviewSlider title="Duration (ms)" v-model="duration" :min="100" :max="3000" :step="100" />

        <PreviewSlider title="Delay (ms)" v-model="delay" :min="0" :max="1000" :step="50" />

        <PreviewSlider title="Threshold" v-model="threshold" :min="0.1" :max="1" :step="0.1" />

        <PreviewSlider title="Initial Opacity" v-model="initialOpacity" :min="0" :max="1" :step="0.1" />
      </Customize>

      <PropTable :data="propData" />
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
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import FadeContent from '../../content/Animations/FadeContent/FadeContent.vue';
import { fadeContent } from '@/constants/code/Animations/fadeContentCode';
import { useForceRerender } from '@/composables/useForceRerender';

const blur = ref(true);
const duration = ref(1000);
const delay = ref(200);
const threshold = ref(0.1);
const initialOpacity = ref(0);
const easing = ref('ease-out');
const { rerenderKey, forceRerender } = useForceRerender();

const propData = [
  { name: 'blur', type: 'boolean', default: 'false', description: 'Enable blur effect during fade animation.' },
  { name: 'duration', type: 'number', default: '1000', description: 'Animation duration in milliseconds.' },
  { name: 'easing', type: 'string', default: '"ease-out"', description: 'CSS easing function for the animation.' },
  { name: 'delay', type: 'number', default: '0', description: 'Delay before animation starts in milliseconds.' },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Intersection threshold to trigger animation (0-1).'
  },
  { name: 'initialOpacity', type: 'number', default: '0', description: 'Initial opacity before animation (0-1).' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS classes for styling.' }
];

watch(blur, () => {
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
