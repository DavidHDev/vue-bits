<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <div class="hover-text">Hover Me.</div>
        <Ribbons
          :base-thickness="baseThickness"
          :colors="colors"
          :speed-multiplier="speedMultiplier"
          :max-age="maxAge"
          :enable-fade="enableFade"
          :enable-shader-effect="enableWaves"
        />
      </div>

      <Customize>
        <div class="count-controls">
          <span class="count-label">Count</span>
          <button @click="removeColor" :disabled="colors.length <= 1" class="count-button">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span class="count-value">{{ colors.length }}</span>
          <button @click="addColor" :disabled="colors.length >= 10" class="count-button">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <PreviewSlider title="Thickness" v-model="baseThickness" :min="1" :max="60" :step="1" />

        <PreviewSlider title="Speed" v-model="speedMultiplier" :min="0.3" :max="0.7" :step="0.01" />

        <PreviewSlider title="Max Age" v-model="maxAge" :min="300" :max="1000" :step="100" />

        <PreviewSwitch title="Enable Fade" v-model="enableFade" />

        <PreviewSwitch title="Enable Waves" v-model="enableWaves" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="ribbons" />
    </template>

    <template #cli>
      <CliInstallation :command="ribbons.cli" />
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
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import Ribbons from '../../content/Animations/Ribbons/Ribbons.vue';
import { ribbons } from '@/constants/code/Animations/ribbonsCode';

const baseThickness = ref(30);
const colors = ref(['#27FF64']);
const speedMultiplier = ref(0.5);
const maxAge = ref(500);
const enableFade = ref(false);
const enableWaves = ref(false);

const addColor = () => {
  if (colors.value.length < 10) {
    const newColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;
    colors.value.push(newColor);
  }
};

const removeColor = () => {
  if (colors.value.length > 1) {
    colors.value.pop();
  }
};

const propData = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#5227FF']",
    description: 'An array of color strings to be used for the ribbons.'
  },
  {
    name: 'baseSpring',
    type: 'number',
    default: '0.03',
    description: 'Base spring factor for the physics controlling ribbon motion.'
  },
  {
    name: 'baseFriction',
    type: 'number',
    default: '0.9',
    description: 'Base friction factor that dampens the ribbon motion.'
  },
  {
    name: 'baseThickness',
    type: 'number',
    default: '30',
    description: 'The base thickness of the ribbons.'
  },
  {
    name: 'offsetFactor',
    type: 'number',
    default: '0.02',
    description: 'A factor to horizontally offset the starting positions of the ribbons.'
  },
  {
    name: 'maxAge',
    type: 'number',
    default: '500',
    description: 'Delay in milliseconds controlling how long the ribbon trails extend.'
  },
  {
    name: 'pointCount',
    type: 'number',
    default: '50',
    description: 'The number of points that make up each ribbon.'
  },
  {
    name: 'speedMultiplier',
    type: 'number',
    default: '0.5',
    description: 'Multiplier that adjusts how fast trailing points interpolate towards the head.'
  },
  {
    name: 'enableFade',
    type: 'boolean',
    default: 'true',
    description: 'If true, a fade effect is applied along the length of the ribbon.'
  },
  {
    name: 'enableShaderEffect',
    type: 'boolean',
    default: 'true',
    description: 'If true, an additional sine-wave shader effect is applied to the ribbons.'
  },
  {
    name: 'effectAmplitude',
    type: 'number',
    default: '2',
    description: 'The amplitude of the shader displacement effect.'
  },
  {
    name: 'backgroundColor',
    type: 'number[]',
    default: '[0, 0, 0, 0]',
    description: 'An RGBA array specifying the clear color for the renderer.'
  }
];
</script>

<style scoped>
.hover-text {
  position: absolute;
  font-size: clamp(2rem, 6vw, 6rem);
  font-weight: 900;
  color: #222;
  z-index: 1;
  pointer-events: none;
}

.count-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.count-label {
  font-size: 0.875rem;
}

.count-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #1b1b1b;
  border: 1px solid #333;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.count-button:hover:not(:disabled) {
  background: #222;
}

.count-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.count-value {
  font-size: 0.875rem;
  min-width: 1.5rem;
  text-align: center;
}
</style>
