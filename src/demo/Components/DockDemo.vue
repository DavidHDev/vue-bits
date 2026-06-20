<template>
  <h1 class="sub-category">Dock</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="dock.usage"
    :source="dockSource"
    component-name="Dock"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] demo-container">
        <Dock
          :key="rerenderKey"
          :items="items"
          :panel-height="panelHeight"
          :base-item-size="baseItemSize"
          :magnification="magnification"
        />

        <div
          class="absolute inset-0 flex justify-center items-center font-[900] text-[#222] text-[4rem] pointer-events-none select-none"
        >
          Try It!
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Background Height" :min="30" :max="200" :step="10" v-model="panelHeight" />
        <PreviewSlider title="Item Size" :min="20" :max="60" :step="10" v-model="baseItemSize" />
        <PreviewSlider title="Magnification" :min="50" :max="100" :step="10" v-model="magnification" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="dock" :usage="dock.usage!" :source="dockSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { dock } from '@/constants/code/Components/dockCode';
import Dock, { type DockItemData } from '@/content/Components/Dock/Dock.vue';
import dockSource from '@/content/Components/Dock/Dock.vue?raw';
import { useToast } from 'primevue/usetoast';
import { computed, h, ref } from 'vue';

const toast = useToast();
const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  panelHeight: 68,
  baseItemSize: 50,
  magnification: 70
};

const panelHeight = ref(DEFAULTS.panelHeight);
const baseItemSize = ref(DEFAULTS.baseItemSize);
const magnification = ref(DEFAULTS.magnification);

const HomeIcon = () => h('i', { class: 'pi pi-home', style: { fontSize: '18px', color: 'white' } });
const ArchiveIcon = () => h('i', { class: 'pi pi-inbox', style: { fontSize: '18px', color: 'white' } });
const ProfileIcon = () => h('i', { class: 'pi pi-user', style: { fontSize: '18px', color: 'white' } });
const SettingsIcon = () => h('i', { class: 'pi pi-cog', style: { fontSize: '18px', color: 'white' } });

const showAlert = (message: string) => {
  toast.add({
    severity: 'secondary',
    summary: `${message} button was clicked`,
    life: 3000
  });
};

const items: DockItemData[] = [
  { icon: HomeIcon, label: 'Home', onClick: () => showAlert('Home') },
  { icon: ArchiveIcon, label: 'Archive', onClick: () => showAlert('Archive') },
  { icon: ProfileIcon, label: 'Profile', onClick: () => showAlert('Profile') },
  { icon: SettingsIcon, label: 'Settings', onClick: () => showAlert('Settings') }
];

const hasChanges = computed(
  () =>
    panelHeight.value !== DEFAULTS.panelHeight ||
    baseItemSize.value !== DEFAULTS.baseItemSize ||
    magnification.value !== DEFAULTS.magnification
);

function reset() {
  panelHeight.value = DEFAULTS.panelHeight;
  baseItemSize.value = DEFAULTS.baseItemSize;
  magnification.value = DEFAULTS.magnification;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'DockItemData[]',
    default: '[]',
    description:
      'Array of dock items. Each item should include an icon, label, onClick handler, and an optional className.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes for the dock panel.'
  },
  {
    name: 'distance',
    type: 'number',
    default: '200',
    description: 'Pixel distance used to calculate the magnification effect based on mouse proximity.'
  },
  {
    name: 'panelHeight',
    type: 'number',
    default: '68',
    description: 'Height (in pixels) of the dock panel.'
  },
  {
    name: 'baseItemSize',
    type: 'number',
    default: '50',
    description: 'The base size (in pixels) for each dock item.'
  },
  {
    name: 'dockHeight',
    type: 'number',
    default: '256',
    description: 'Maximum height (in pixels) of the dock container.'
  },
  {
    name: 'magnification',
    type: 'number',
    default: '70',
    description: 'The magnified size (in pixels) applied to a dock item when hovered.'
  },
  {
    name: 'spring',
    type: 'SpringOptions',
    default: '{ mass: 0.1, stiffness: 150, damping: 12 }',
    description: 'Configuration options for the spring animation.'
  }
];
</script>
