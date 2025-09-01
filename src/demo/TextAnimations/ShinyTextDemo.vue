<template>
  <TabbedLayout>
    <template #preview>
      <h2 class="demo-title-extra">Basic</h2>

      <div class="demo-container h-[200px]">
        <ShinyText text="Just some shiny text!" :disabled="false" :speed="3" class-name="shiny-text-demo" />
      </div>

      <h2 class="demo-title-extra">Button Text</h2>

      <div class="demo-container h-[200px]">
        <div class="shiny-button">
          <ShinyText text="Shiny Button" :disabled="false" :speed="3" class-name="shiny-text-demo" />
        </div>
      </div>

      <h2 class="demo-title-extra">Configurable Speed</h2>

      <div class="demo-container h-[200px]">
        <ShinyText
          :text="speed < 2.5 ? '🐎 This is fast!' : '🐌 This is slow!'"
          :disabled="false"
          :speed="speed"
          class-name="shiny-text-demo"
        />
      </div>

      <Customize>
        <PreviewSlider title="Animation Duration" v-model="speed" :min="1" :max="5" :step="0.1" value-unit="s" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="shinyText" />
    </template>

    <template #cli>
      <CliInstallation :command="shinyText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import ShinyText from '../../content/TextAnimations/ShinyText/ShinyText.vue';
import { shinyText } from '@/constants/code/TextAnimations/shinyTextCode';

const speed = ref(3);

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '-',
    description: 'The text to be displayed with the shiny effect.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the shiny effect when set to true.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '5',
    description: 'Specifies the duration of the animation in seconds.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Adds custom classes to the root element.'
  }
];
</script>

<style scoped>
.shiny-button {
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.shiny-button:hover {
  transform: translateY(-2px);
}

.shiny-text-demo {
  font-weight: 600;
}
</style>
