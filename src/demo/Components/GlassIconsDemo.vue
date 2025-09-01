<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <GlassIcons :items="items" class="my-glass-icons" />
      </div>

      <Customize>
        <PreviewSwitch title="Colorful" v-model="colorful" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="glassIcons" />
    </template>

    <template #cli>
      <CliInstallation :command="glassIcons.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import GlassIcons from '../../content/Components/GlassIcons/GlassIcons.vue';
import { glassIcons } from '@/constants/code/Components/glassIconsCode';

const colorful = ref(false);

const items = computed(() => [
  { icon: 'pi pi-file', color: colorful.value ? 'blue' : '#444', label: 'Files' },
  { icon: 'pi pi-book', color: colorful.value ? 'purple' : '#444', label: 'Books' },
  { icon: 'pi pi-heart', color: colorful.value ? 'red' : '#444', label: 'Health' },
  { icon: 'pi pi-cloud', color: colorful.value ? 'indigo' : '#444', label: 'Weather' },
  { icon: 'pi pi-pencil', color: colorful.value ? 'orange' : '#444', label: 'Notes' },
  { icon: 'pi pi-chart-bar', color: colorful.value ? 'green' : '#444', label: 'Stats' }
]);

const propData = [
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
