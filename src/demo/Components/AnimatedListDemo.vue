<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <AnimatedList
          :key="rerenderKey"
          :show-gradients="showGradients"
          :enable-arrow-navigation="enableArrowNavigation"
          :display-scrollbar="displayScrollbar"
          @itemSelected="(item, index) => console.log('Selected:', item, 'at index:', index)"
        />
      </div>

      <Customize>
        <PreviewSwitch title="Fade Items" v-model="showGradients" />
        <PreviewSwitch title="Keyboard Navigation" v-model="enableArrowNavigation" />
        <PreviewSwitch title="Show Scrollbar" v-model="displayScrollbar" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="animatedList" />
    </template>

    <template #cli>
      <CliInstallation :command="animatedList.cli" />
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
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import AnimatedList from '../../content/Components/AnimatedList/AnimatedList.vue';
import { animatedList } from '../../constants/code/Components/animatedListCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey } = useForceRerender();
const showGradients = ref(true);
const enableArrowNavigation = ref(true);
const displayScrollbar = ref(true);

const propData = [
  {
    name: 'items',
    type: 'string[]',
    default: '["Item 1", "Item 2", ...]',
    description: 'Array of items to display in the list'
  },
  {
    name: 'showGradients',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show fade gradients at top and bottom'
  },
  {
    name: 'enableArrowNavigation',
    type: 'boolean',
    default: 'true',
    description: 'Enable keyboard navigation with arrow keys'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes for the container'
  },
  {
    name: 'itemClassName',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes for each item'
  },
  {
    name: 'displayScrollbar',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display the scrollbar'
  },
  {
    name: 'initialSelectedIndex',
    type: 'number',
    default: '-1',
    description: 'Initial selected item index'
  },
  {
    name: '@itemSelected',
    type: 'event',
    default: '-',
    description: 'Emitted when an item is selected. Receives (item: string, index: number)'
  }
];
</script>
