<template>
  <h1 class="sub-category">Animated List</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="animatedList.usage"
    :source="animatedListSource"
    component-name="AnimatedList"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <AnimatedList
          :key="rerenderKey"
          :show-gradients="showGradients"
          :enable-arrow-navigation="enableArrowNavigation"
          :display-scrollbar="displayScrollbar"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Fade Items" v-model="showGradients" />
        <PreviewSwitch title="Keyboard Navigation" v-model="enableArrowNavigation" />
        <PreviewSwitch title="Show Scrollbar" v-model="displayScrollbar" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="animated-list" :usage="animatedList.usage!" :source="animatedListSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { animatedList } from '@/constants/code/Components/animatedListCode';
import AnimatedList from '@/content/Components/AnimatedList/AnimatedList.vue';
import animatedListSource from '@/content/Components/AnimatedList/AnimatedList.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  showGradients: true,
  enableArrowNavigation: true,
  displayScrollbar: true
};

const showGradients = ref(DEFAULTS.showGradients);
const enableArrowNavigation = ref(DEFAULTS.enableArrowNavigation);
const displayScrollbar = ref(DEFAULTS.displayScrollbar);

const hasChanges = computed(
  () =>
    showGradients.value !== DEFAULTS.showGradients ||
    enableArrowNavigation.value !== DEFAULTS.enableArrowNavigation ||
    displayScrollbar.value !== DEFAULTS.displayScrollbar
);

function reset() {
  showGradients.value = DEFAULTS.showGradients;
  enableArrowNavigation.value = DEFAULTS.enableArrowNavigation;
  displayScrollbar.value = DEFAULTS.displayScrollbar;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'string[]',
    default: "['Item 1', 'Item 2', ...]",
    description: 'An array of items to display in the scrollable list.'
  },
  {
    name: 'onItemSelect',
    type: 'function',
    default: 'undefined',
    description: 'Callback function triggered when an item is selected. Receives the selected item and its index.'
  },
  {
    name: 'showGradients',
    type: 'boolean',
    default: 'true',
    description: 'Toggle to display the top and bottom gradient overlays.'
  },
  {
    name: 'enableArrowNavigation',
    type: 'boolean',
    default: 'true',
    description: 'Toggle to enable keyboard navigation via arrow and tab keys.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS class names for the main container.'
  },
  {
    name: 'itemClassName',
    type: 'string',
    default: "''",
    description: 'Additional CSS class names for each list item.'
  },
  {
    name: 'displayScrollbar',
    type: 'boolean',
    default: 'true',
    description: 'Toggle to display or hide the custom scrollbar.'
  },
  {
    name: 'initialSelectedIndex',
    type: 'number',
    default: '-1',
    description: 'Initial index of the selected item. Set to -1 for no selection.'
  }
];
</script>
