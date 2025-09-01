<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container py-10">
        <SpotlightCard class-name="custom-spotlight-card">
          <div class="flex h-full flex-col items-start justify-center">
            <i class="pi pi-star-fill text-4xl mb-3 text-white"></i>

            <h3 class="text-2xl font-semibold tracking-tight mb-1 text-white">Boost Your Experience</h3>

            <p class="text-sm text-zinc-400">
              Get exclusive benefits, features & 24/7 support as a permanent club member.
            </p>
          </div>
        </SpotlightCard>
      </div>

      <h2 class="text-xl font-semibold text-white mb-4 mt-8">Custom Color</h2>

      <div class="demo-container py-10">
        <SpotlightCard class-name="custom-spotlight-card" spotlight-color="rgba(39, 255, 100, 0.326)">
          <div class="flex h-full flex-col items-start justify-center">
            <i class="pi pi-lock text-3xl mb-3 text-white"></i>

            <h3 class="text-2xl font-semibold tracking-tight mb-1 text-white">Enhanced Security</h3>

            <p class="text-sm text-zinc-400">
              Our state of the art software offers peace of mind through strict security measures.
            </p>
          </div>
        </SpotlightCard>
      </div>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="spotlightCard" />
    </template>

    <template #cli>
      <CliInstallation :command="spotlightCard.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import SpotlightCard from '../../content/Components/SpotlightCard/SpotlightCard.vue';
import { spotlightCard } from '@/constants/code/Components/spotlightCardCode';

const propData = [
  {
    name: 'spotlightColor',
    type: 'string',
    default: 'rgba(255, 255, 255, 0.25)',
    description: 'Controls the color of the radial gradient used for the spotlight effect.'
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Allows adding custom classes to the component.'
  }
];
</script>

<style>
.custom-spotlight-card {
  min-height: 200px;
  max-width: 400px;
}
</style>
