<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden cursor-pointer demo-container">
        <Hyperspeed :effect-options="currentPreset" />
        <BackgroundContent pillText="New Background" headline="Cick & hold to see the real magic of hyperspeed!" />
      </div>

      <Customize>
        <PreviewSelect title="Animation Preset" :options="options" v-model="activePreset" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['three', 'postprocessing']" />
    </template>

    <template #code>
      <CodeExample :code-object="hyperspeed" />
    </template>

    <template #cli>
      <CliInstallation :command="hyperspeed.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { hyperspeed } from '@/constants/code/Backgrounds/hyperspeedCode';
import { computed, ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import Hyperspeed from '../../content/Backgrounds/Hyperspeed/Hyperspeed.vue';
import { hyperspeedPresets } from '../../content/Backgrounds/Hyperspeed/HyperspeedPresets';

const activePreset = ref<string>('one');

const currentPreset = computed(() => {
  return hyperspeedPresets[activePreset.value as keyof typeof hyperspeedPresets];
});

const propData = [
  {
    name: 'effectOptions',
    type: 'object',
    default: 'See the "code" tab for default values and presets.',
    description:
      'The highly customizable configuration object for the effect, controls things like colors, distortion, line properties, etc.'
  }
];

const options = [
  { value: 'one', label: 'Cyberpunk' },
  { value: 'two', label: 'Akira' },
  { value: 'three', label: 'Golden' },
  { value: 'four', label: 'Split' },
  { value: 'five', label: 'Highway' },
  { value: 'six', label: 'Deep' }
];
</script>
