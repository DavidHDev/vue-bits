<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container relative min-h-[500px] overflow-hidden">
        <div class="flex h-full max-w-[600px] flex-col items-center justify-center">
          <h2
            class="absolute top-4 mt-6 whitespace-nowrap text-center font-black text-2xl text-white md:top-4 md:text-5xl"
          >
            Your trip to Thailand.
          </h2>
          <RollingGallery
            :autoplay="autoplay"
            :pause-on-hover="pauseOnHover"
            :images="customImages.length > 0 ? customImages : undefined"
          />
        </div>
      </div>

      <Customize>
        <PreviewSwitch title="Autoplay" v-model="autoplay" />

        <PreviewSwitch title="Pause on Hover" v-model="pauseOnHover" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="rollingGallery" />
    </template>

    <template #cli>
      <CliInstallation :command="rollingGallery.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import RollingGallery from '@/content/Components/RollingGallery/RollingGallery.vue';
import { rollingGallery } from '@/constants/code/Components/rollingGalleryCode';

const autoplay = ref(true);
const pauseOnHover = ref(true);
const customImages = ref<string[]>([]);

const propData = [
  {
    name: 'autoplay',
    type: 'boolean',
    default: 'false',
    description: 'Controls the autoplay toggle of the carousel. When turned on, it rotates and loops infinitely.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Allows the carousel to be paused on hover when autoplay is turned on.'
  },
  {
    name: 'images',
    type: 'string[]',
    default: '[]',
    description: 'Array of image URLs to display in the gallery.'
  }
];
</script>
