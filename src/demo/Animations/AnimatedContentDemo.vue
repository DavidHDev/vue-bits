<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px]">
        <RefreshButton @click="forceRerender" />
        <AnimatedContent
          :direction="direction"
          :delay="delay"
          :distance="distance"
          :reverse="reverse"
          :duration="duration"
          :ease="ease"
          :initial-opacity="initialOpacity"
          :animate-opacity="animateOpacity"
          :scale="scale"
          :threshold="threshold"
          :key="key"
          @complete="() => console.log('✅ Animation Complete!')"
        >
          <div class="demo-content">
            <h4>Animated Content</h4>
            <p>It will animate in when it enters the viewport.</p>
          </div>
        </AnimatedContent>
      </div>

      <Customize>
        <PreviewSelect title="Animation Direction" v-model="direction" :options="directionOptions" />

        <PreviewSelect title="Easing Function" v-model="ease" :options="easeOptions" />

        <PreviewSlider title="Distance" v-model="distance" :min="50" :max="300" :step="10" />

        <PreviewSlider title="Duration" v-model="duration" :min="0.1" :max="3" :step="0.1" value-unit="s" />

        <PreviewSlider title="Delay" v-model="delay" :min="0" :max="2" :step="0.1" value-unit="s" />

        <PreviewSlider title="Initial Opacity" v-model="initialOpacity" :min="0" :max="1" :step="0.1" />

        <PreviewSlider title="Initial Scale" v-model="scale" :min="0.1" :max="2" :step="0.1" />

        <PreviewSlider title="Threshold" v-model="threshold" :min="0.1" :max="1" :step="0.1" />

        <PreviewSwitch title="Reverse Direction" v-model="reverse" />

        <PreviewSwitch title="Animate Opacity" v-model="animateOpacity" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="animatedContent" />
    </template>

    <template #cli>
      <CliInstallation :command="animatedContent.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import AnimatedContent from '../../content/Animations/AnimatedContent/AnimatedContent.vue';
import { animatedContent } from '@/constants/code/Animations/animatedContentCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key, forceRerender } = useForceRerender();

const direction = ref<'vertical' | 'horizontal'>('vertical');
const distance = ref(100);
const delay = ref(0);
const reverse = ref(false);
const duration = ref(0.8);
const ease = ref('power3.out');
const initialOpacity = ref(0);
const animateOpacity = ref(true);
const scale = ref(1);
const threshold = ref(0.1);

const directionOptions = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' }
];

const easeOptions = [
  { label: 'Power3 Out', value: 'power3.out' },
  { label: 'Bounce Out', value: 'bounce.out' },
  { label: 'Elastic Out', value: 'elastic.out(1, 0.3)' }
];

const propData = [
  {
    name: 'distance',
    type: 'number',
    default: '100',
    description: 'Distance (in pixels) the component moves during animation.'
  },
  {
    name: 'direction',
    type: '"vertical" | "horizontal"',
    default: '"vertical"',
    description: 'Animation direction. Can be "vertical" or "horizontal".'
  },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Whether the animation moves in the reverse direction.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.8',
    description: 'Duration of the animation in seconds.'
  },
  {
    name: 'ease',
    type: 'string | function',
    default: '"power3.out"',
    description: 'GSAP easing function for the animation.'
  },
  {
    name: 'initialOpacity',
    type: 'number',
    default: '0',
    description: 'Initial opacity before animation begins.'
  },
  {
    name: 'animateOpacity',
    type: 'boolean',
    default: 'true',
    description: 'Whether to animate opacity during transition.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Initial scale of the component.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Intersection threshold to trigger animation (0-1).'
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Delay before animation starts (in seconds).'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes for styling.'
  }
];

watch([direction, ease], () => {
  forceRerender();
});
</script>

<style scoped>
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
