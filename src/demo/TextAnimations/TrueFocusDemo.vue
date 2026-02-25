<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px]">
        <div :key="key" class="flex flex-col justify-center items-center m-8 pl-6 w-full">
          <TrueFocus :key="`${key}-${syncMode}-1`" v-bind="config" />
          <br />
          <TrueFocus :key="`${key}-${syncMode}-2`" v-bind="config" />
        </div>
      </div>

      <Customize>
        <PreviewColor title="Corners Color" v-model="borderColor" />

        <PreviewSwitch title="Hover Mode" v-model="manualMode" />

        <PreviewSwitch title="Apply Sync Group" v-model="syncMode" />

        <PreviewSlider title="Blur Amount" v-model="blurAmount" :min="0" :max="15" :step="0.5" value-unit="px" />

        <PreviewSlider
          title="Animation Duration"
          v-model="animationDuration"
          :min="0.1"
          :max="3"
          :step="0.1"
          value-unit="s"
          :disabled="!manualMode"
        />

        <PreviewSlider
          title="Pause Between Animations"
          v-model="pauseBetweenAnimations"
          :min="0"
          :max="5"
          :step="0.5"
          value-unit="s"
          :disabled="manualMode"
        />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="trueFocus" />
    </template>

    <template #cli>
      <CliInstallation :command="trueFocus.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import TrueFocus from '../../content/TextAnimations/TrueFocus/TrueFocus.vue';
import { trueFocus } from '../../constants/code/TextAnimations/trueFocusCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key } = useForceRerender();

const manualMode = ref(false);
const blurAmount = ref(5);
const animationDuration = ref(0.5);
const pauseBetweenAnimations = ref(1);
const borderColor = ref('#27FF64');
const syncMode = ref(false);
const defaultBlur = ref(true);

const config = computed(() => ({
  sentence: 'True Focus',
  manualMode: manualMode.value,
  blurAmount: blurAmount.value,
  borderColor: borderColor.value,
  animationDuration: animationDuration.value,
  pauseBetweenAnimations: pauseBetweenAnimations.value,
  syncGroup: syncMode.value ? 'sync-group-demo' : undefined,
  defaultBlur: defaultBlur.value
}));

const propData = [
  {
    name: 'sentence',
    type: 'string',
    default: "'True Focus'",
    description: 'The text to display with the focus animation.'
  },
  {
    name: 'manualMode',
    type: 'boolean',
    default: 'false',
    description: 'Disables automatic animation when set to true.'
  },
  {
    name: 'blurAmount',
    type: 'number',
    default: '5',
    description: 'The amount of blur applied to non-active words.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: "'green'",
    description: 'The color of the focus borders.'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: "'rgba(0, 255, 0, 0.6)'",
    description: 'The color of the glowing effect on the borders.'
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '0.5',
    description: 'The duration of the animation for each word.'
  },
  {
    name: 'pauseBetweenAnimations',
    type: 'number',
    default: '1',
    description: 'Time to pause between focusing on each word (in auto mode).'
  },
  {
    name: 'index',
    type: 'Array<number>',
    default: 'undefined',
    description:
      'Maps each word to a shared index value, used to coordinate focus position across multiple instances in the same syncGroup.'
  },
  {
    name: 'syncGroup',
    type: 'string',
    default: 'undefined',
    description:
      'A group identifier. All instances sharing the same syncGroup will stay in sync, hovering or animating one will reflect on all others.'
  }
];
</script>
