<template>
  <h1 class="sub-category">Glass Icons</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="glassIcons.usage"
    :source="glassIconsSource"
    component-name="GlassIcons"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <GlassIcons :items="items" class="my-glass-icons" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Colorful" v-model="colorful" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="glass-icons" :usage="glassIcons.usage!" :source="glassIconsSource" />
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
import { glassIcons } from '@/constants/code/Components/glassIconsCode';
import GlassIcons from '@/content/Components/GlassIcons/GlassIcons.vue';
import glassIconsSource from '@/content/Components/GlassIcons/GlassIcons.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  colorful: false
};

const colorful = ref(DEFAULTS.colorful);

const hasChanges = computed(() => colorful.value !== DEFAULTS.colorful);

function reset() {
  colorful.value = DEFAULTS.colorful;
  forceRerender();
}

const items = computed(() => [
  { icon: 'pi pi-file', color: colorful.value ? 'blue' : '#444', label: 'Files' },
  { icon: 'pi pi-book', color: colorful.value ? 'purple' : '#444', label: 'Books' },
  { icon: 'pi pi-heart', color: colorful.value ? 'red' : '#444', label: 'Health' },
  { icon: 'pi pi-cloud', color: colorful.value ? 'indigo' : '#444', label: 'Weather' },
  { icon: 'pi pi-pencil', color: colorful.value ? 'orange' : '#444', label: 'Notes' },
  { icon: 'pi pi-chart-bar', color: colorful.value ? 'green' : '#444', label: 'Stats' }
]);

const props: PropRow[] = [
  {
    name: 'items',
    type: 'GlassIconsItem[]',
    default: '[]',
    description:
      'Array of items to render. Each item should include: an icon (string), a color (string), a label (string), and an optional customClass (string).'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Optional additional CSS class(es) to be added to the container.'
  }
];
</script>
