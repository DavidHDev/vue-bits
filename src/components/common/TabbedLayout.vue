<template>
  <div class="tabbed-layout">
    <Tabs value="0">
      <TabList>
        <Tab value="0">
          <div class="tab-header">
            <i class="pi pi-eye"></i>

            <span>Preview</span>
          </div>
        </Tab>

        <Tab value="1">
          <div class="tab-header">
            <i class="pi pi-code"></i>

            <span>Code</span>
          </div>
        </Tab>

        <Tab value="2">
          <div class="tab-header">
            <i class="pi pi-box"></i>

            <span>CLI</span>
          </div>
        </Tab>

        <Tab value="3">
          <div class="tab-header">
            <i class="pi pi-heart"></i>

            <span>Contribute</span>
          </div>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <slot name="preview" />
        </TabPanel>

        <TabPanel value="1">
          <slot name="code" />
        </TabPanel>

        <TabPanel value="2">
          <slot name="cli" />
        </TabPanel>

        <TabPanel value="3">
          <ContributionSection />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import ContributionSection from './ContributionSection.vue';
</script>

<style scoped>
:deep(.p-tablist),
:deep(.p-tablist-tab-list) {
  display: flex;
  gap: 0.5rem;
  padding-bottom: .1em;
  align-items: flex-start;
  flex-wrap: wrap;
  border: none !important;
  background: transparent !important;
}

:deep(.p-tablist) {
  justify-content: flex-start;
}

:deep(.p-tablist .p-tab:nth-child(1)),
:deep(.p-tablist .p-tab:nth-child(2)),
:deep(.p-tablist .p-tab:nth-child(3)) {
  margin-right: 0;
}

:deep(.p-tablist .p-tab:nth-child(4)) {
  margin-left: auto;
}

:deep(.p-tab) {
  border: none !important;
  background: transparent !important;
  padding: 0;
}

:deep(.p-tab:not(.p-disabled):focus) {
  box-shadow: none !important;
}

:deep(.p-tab:hover) {
  background: transparent !important;
  border-bottom: none !important;
}

:deep(.p-tablist-active-bar),
:deep(.p-tab-indicator),
:deep(.p-tab::before),
:deep(.p-tab::after),
:deep(.p-tab[aria-selected='true']::before),
:deep(.p-tab[aria-selected='true']::after),
:deep(.p-tablist::after),
:deep(.p-tablist-tab-list::before),
:deep(.p-tablist-tab-list::after),
:deep(.p-tab .p-tab-header-action::before),
:deep(.p-tab .p-tab-header-action::after) {
  display: none !important;
}

:deep(.p-tab[aria-selected='true']) {
  background: transparent !important;
  border-bottom: none !important;
}

:deep(.p-tab[aria-selected='true'] .tab-header) {
  background: #222;
  color: #27ff64;
}

:deep(.p-tabpanels) {
  padding: 0;
  background: transparent;
}

:deep(.p-tabpanel) {
  background: transparent;
  border: none;
  padding: 0;
}

@media (max-width: 768px) {
  :deep(.p-tablist) {
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
  }

  :deep(.p-tablist .p-tab:nth-child(4)) {
    margin-left: 0;
  }
}
</style>
