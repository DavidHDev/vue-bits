<template>
  <div class="gradient-text-demo">
    <TabbedLayout>
      <template #preview>
        <div class="relative h-[400px] text-5xl demo-container">
          <GradientText
            :colors="colors"
            :animation-speed="animationSpeed"
            :direction="direction"
            :pause-on-hover="pauseOnHover"
            :yoyo="yoyo"
            :show-border="showBorder"
          >
            Gradient Magic
          </GradientText>
        </div>

        <Customize>
          <PreviewSlider
            title="Animation Speed"
            v-model="animationSpeed"
            :min="1"
            :max="20"
            :step="0.5"
            value-unit="s"
          />
          <PreviewSelect title="Direction" v-model="direction" :options="directionOptions" />
          <PreviewSwitch title="Yoyo Mode" v-model="yoyo" />
          <PreviewSwitch title="Pause on Hover" v-model="pauseOnHover" />
          <PreviewSwitch title="Show Border" v-model="showBorder" />

          <div class="flex flex-col gap-0">
            <label class="block mb-2 font-medium text-sm">Colors</label>

            <div class="flex flex-wrap gap-2 px-1 pt-1">
              <div v-for="(color, index) in colors" :key="index" class="relative w-8 h-8">
                <div
                  class="relative border-[#222] border-2 rounded-md w-8 h-8 overflow-hidden"
                  :style="{ backgroundColor: color }"
                >
                  <input
                    type="color"
                    :value="color"
                    @input="updateColor(index, ($event.target as HTMLInputElement).value)"
                    class="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer"
                  />
                </div>

                <button
                  v-if="colors.length > 2"
                  @click="removeColor(index)"
                  class="-top-1.5 -right-1.5 absolute flex justify-center items-center bg-[#170D27] border border-[#222] rounded-full w-4 h-4 cursor-pointer"
                >
                  <i class="text-[#8BC79A] text-[8px]! pi pi-times" />
                </button>
              </div>

              <button
                v-if="colors.length < 8"
                @click="addColor"
                class="flex justify-center items-center border-[#392e4e] border-2 hover:border-[#27FF64] border-dashed rounded-md w-8 h-8 transition-colors cursor-pointer"
              >
                <i class="text-[#8BC79A] text-sm pi pi-plus" />
              </button>
            </div>

            <div
              class="mt-3 border border-[#333333] rounded-md w-[300px] h-3"
              :style="{
                background: `linear-gradient(to right, ${gradientPreview})`
              }"
            />
          </div>
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gradientText" />
      </template>

      <template #cli>
        <CliInstallation :command="gradientText.cli" />
      </template>
    </TabbedLayout>
  </div>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { gradientText } from '@/constants/code/TextAnimations/gradientTextCode';
import GradientText from '@/content/TextAnimations/GradientText/GradientText.vue';
import { computed, ref } from 'vue';

const colors = ref(['#27FF64', '#27FF64', '#A0FFBC']);
const animationSpeed = ref(8);
const direction = ref<'horizontal' | 'vertical' | 'diagonal'>('horizontal');
const pauseOnHover = ref(false);
const yoyo = ref(true);
const showBorder = ref(false);

const directionOptions = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'diagonal', label: 'Diagonal' }
];

const gradientPreview = computed(() => [...colors.value, colors.value[0]].join(', '));

const updateColor = (index: number, newColor: string) => {
  const newColors = [...colors.value];
  newColors[index] = newColor;
  colors.value = newColors;
};

const addColor = () => {
  if (colors.value.length < 8) {
    colors.value.push('#ffffff');
  }
};

const removeColor = (index: number) => {
  if (colors.value.length > 2) {
    colors.value.splice(index, 1);
  }
};

const propData = [
  {
    name: 'slot',
    type: 'string',
    default: '-',
    description: 'The content to be displayed inside the gradient text.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Adds custom classes to the root element for additional styling.'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: `["#5227FF", "#FF9FFC", "#B19EEF"]`,
    description: 'Array of colors for the gradient effect.'
  },
  {
    name: 'animationSpeed',
    type: 'number',
    default: '8',
    description: 'Duration of one animation cycle in seconds.'
  },
  {
    name: 'direction',
    type: `'horizontal' | 'vertical' | 'diagonal'`,
    default: `'horizontal'`,
    description: 'Direction of the gradient animation.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Pauses the animation when hovering over the text.'
  },
  {
    name: 'yoyo',
    type: 'boolean',
    default: 'true',
    description: 'Reverses animation direction at the end instead of looping.'
  },
  {
    name: 'showBorder',
    type: 'boolean',
    default: 'false',
    description: 'Displays a gradient border around the text.'
  }
];
</script>
