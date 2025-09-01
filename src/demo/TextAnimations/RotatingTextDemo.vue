<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[400px] demo-container">
        <div
          class="flex flex-row justify-center items-center p-12 sm:p-20 md:p-24 w-full h-full overflow-hidden font-light text-[1.5rem] text-white sm:text-[1.875rem] md:text-[3rem] dark:text-muted leading-8 sm:leading-9 md:leading-none"
        >
          <LayoutGroup>
            <motion.p :is="'p'" class="flex items-center gap-[0.2em] font-black" layout>
              <motion.span
                :is="'span'"
                class="pt-0.5 sm:pt-1 md:pt-2"
                layout
                :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
              >
                Creative{{ ' ' }}
              </motion.span>
              <RotatingText
                :texts="words"
                mainClassName="px-2 py-0.5 bg-[#27FF64] text-[#222] overflow-hidden flex justify-center rounded-lg sm:py-1 md:py-2 md:px-3"
                staggerFrom="last"
                :initial="{ y: '100%' }"
                :animate="{ y: 0 }"
                :exit="{ y: '-120%' }"
                :staggerDuration="0.025"
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
                :rotationInterval="2000"
              />
            </motion.p>
          </LayoutGroup>
        </div>
      </div>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="rotatingText" />
    </template>

    <template #cli>
      <CliInstallation :command="rotatingText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { LayoutGroup, motion } from 'motion-v';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { rotatingText } from '../../constants/code/TextAnimations/rotatingTextCode';
import RotatingText from '../../content/TextAnimations/RotatingText/RotatingText.vue';

const words = ref(['thinking', 'coding', 'components!']);

const propData = [
  {
    name: 'texts',
    type: 'string[]',
    default: '[]',
    description: 'An array of text strings to be rotated.'
  },
  {
    name: 'rotationInterval',
    type: 'number',
    default: '2000',
    description: 'The interval (in milliseconds) between text rotations.'
  },
  {
    name: 'initial',
    type: 'object',
    default: '{ y: "100%", opacity: 0 }',
    description: 'Initial animation state for each element.'
  },
  {
    name: 'animate',
    type: 'object',
    default: '{ y: 0, opacity: 1 }',
    description: 'Animation state when elements enter.'
  },
  {
    name: 'exit',
    type: 'object',
    default: '{ y: "-120%", opacity: 0 }',
    description: 'Exit animation state for elements.'
  },
  {
    name: 'animatePresenceMode',
    type: 'string',
    default: '"wait"',
    description: "Mode for AnimatePresence; for example, 'wait' to finish exit animations before entering."
  },
  {
    name: 'animatePresenceInitial',
    type: 'boolean',
    default: 'false',
    description: 'Determines whether the AnimatePresence component should run its initial animation.'
  },
  {
    name: 'staggerDuration',
    type: 'number',
    default: '0',
    description: "Delay between each character's animation."
  },
  {
    name: 'staggerFrom',
    type: 'string',
    default: '"first"',
    description: 'Specifies the order from which the stagger starts.'
  },
  {
    name: 'transition',
    type: 'object',
    default: '',
    description: 'Transition settings for the animations.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Determines if the rotation should loop back to the first text after the last one.'
  },
  {
    name: 'auto',
    type: 'boolean',
    default: 'true',
    description: 'If true, the text rotation starts automatically.'
  },
  {
    name: 'splitBy',
    type: 'string',
    default: '"characters"',
    description: 'Determines how the text is split into animatable elements (e.g., by characters, words, or lines).'
  },
  {
    name: 'onNext',
    type: 'function',
    default: 'undefined',
    description: 'Callback function invoked when the text rotates to the next item.'
  },
  {
    name: 'mainClassName',
    type: 'string',
    default: "''",
    description: 'Additional class names for the main container element.'
  },
  {
    name: 'splitLevelClassName',
    type: 'string',
    default: "''",
    description: 'Additional class names for the container wrapping each split group (e.g., a word).'
  },
  {
    name: 'elementLevelClassName',
    type: 'string',
    default: "''",
    description: 'Additional class names for each individual animated element.'
  }
];
</script>
