<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <DecayCard>
          <div class="text-[2rem]">
            Decay
            <br />
            Card
          </div>
        </DecayCard>
      </div>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="decayCard" />
    </template>

    <template #cli>
      <CliInstallation :command="decayCard.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import DecayCard from '../../content/Components/DecayCard/DecayCard.vue';
import { decayCard } from '@/constants/code/Components/decayCardCode';

const propData = [
  {
    name: 'children',
    type: 'Slot',
    default: '',
    description: 'The content to be rendered inside the card.'
  },
  {
    name: 'width',
    type: 'number',
    default: '300',
    description: 'The width of the card in pixels.'
  },
  {
    name: 'height',
    type: 'number',
    default: '400',
    description: 'The height of the card in pixels.'
  },
  {
    name: 'image',
    type: 'string',
    default: 'https://picsum.photos/300/400?grayscale',
    description: 'Allows setting the background image of the card.'
  }
];
</script>
