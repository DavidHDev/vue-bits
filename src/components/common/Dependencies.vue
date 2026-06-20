<script setup lang="ts">
type Props = {
  dependencyList?: string[];
};

withDefaults(defineProps<Props>(), {
  dependencyList: () => []
});
</script>

<template>
  <div v-if="dependencyList.length > 0" class="dependencies-section">
    <h2 class="demo-title-extra">Dependencies</h2>
    <div class="demo-details">
      <span v-for="dependency in dependencyList" :key="dependency">{{ dependency }}</span>
    </div>
  </div>
</template>

<style>
.dependencies-section {
  margin-top: 3rem;
}

.demo-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.demo-details span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 25px;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(94, 255, 76, 0.16);
  background: rgba(145, 255, 76, 0.06);
  color: var(--color-accent-muted);
  font-size: 14px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-weight: 500;
}
</style>
