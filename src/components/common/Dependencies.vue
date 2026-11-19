<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next';
import { computed, onBeforeUnmount, ref } from 'vue';
import { useInstallation } from '@/composables/useInstallation';
import { generateDependencyCommands, getTypeDependencies, normalizeDependencies } from '@/utils/dependencies';

const props = withDefaults(defineProps<{ dependencyList?: string[] }>(), {
  dependencyList: () => []
});

const { packageManager } = useInstallation();
const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

const dependencies = computed(() => normalizeDependencies(props.dependencyList));
const command = computed(() => {
  const commands = generateDependencyCommands(dependencies.value);
  return commands?.[packageManager.value] || commands?.npm || '';
});
const packageCount = computed(() => dependencies.value.length + getTypeDependencies(dependencies.value).length);

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command.value);
    copied.value = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied.value = false), 1800);
  } catch {
    copied.value = false;
  }
}

onBeforeUnmount(() => clearTimeout(resetTimer));
</script>

<template>
  <section v-if="dependencies.length > 0" class="dependencies-panel" aria-labelledby="dependencies-title">
    <div class="dependencies-summary">
      <h2 id="dependencies-title">Dependencies</h2>
      <p>{{ packageCount }} required {{ packageCount === 1 ? 'package' : 'packages' }}</p>
    </div>
    <div class="dependencies-command">
      <code :title="command">{{ command }}</code>
      <button
        type="button"
        :aria-label="copied ? 'Install command copied' : 'Copy install command'"
        @click="copyCommand"
      >
        <Check v-if="copied" :size="15" aria-hidden="true" />
        <Copy v-else :size="15" aria-hidden="true" />
        <span aria-live="polite">{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>
  </section>
</template>
