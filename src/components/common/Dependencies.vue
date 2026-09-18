<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { copyText } from '@/utils/aiExport';

type Props = {
  dependencyList?: string[];
};

const props = withDefaults(defineProps<Props>(), {
  dependencyList: () => []
});

const dependencies = computed(() => [...new Set(props.dependencyList.map(d => d.trim()).filter(Boolean))]);
const command = computed(() => `npm install ${dependencies.value.join(' ')}`);

const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

async function copyCommand() {
  if (!(await copyText(command.value))) return;
  copied.value = true;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => (copied.value = false), 1800);
}
</script>

<template>
  <section v-if="dependencies.length > 0" class="dependencies-panel" aria-labelledby="dependencies-title">
    <div class="dependencies-summary">
      <h2 id="dependencies-title">Dependencies</h2>
      <p>{{ dependencies.length }} required {{ dependencies.length === 1 ? 'package' : 'packages' }}</p>
    </div>
    <div class="dependencies-command">
      <code :title="command">{{ command }}</code>
      <button
        type="button"
        @click="copyCommand"
        :aria-label="copied ? 'Install command copied' : 'Copy install command'"
      >
        <Check v-if="copied" :size="15" aria-hidden="true" />
        <Copy v-else :size="15" aria-hidden="true" />
        <span aria-live="polite">{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>
  </section>
</template>

<style>
.dependencies-panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(160px, 0.45fr) minmax(0, 1fr);
  gap: 4px;
  margin-top: 8px;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: var(--surface-ghost-track);
  box-shadow: var(--surface-ghost-highlight);
}

.dependencies-summary {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--inset-border);
  border-radius: calc(var(--radius-lg) - 5px);
  background: var(--bg-body);
}

.dependencies-summary h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.dependencies-summary p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.dependencies-command {
  display: flex;
  min-width: 0;
  min-height: 58px;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--inset-border);
  border-radius: calc(var(--radius-lg) - 5px);
  background: var(--bg-body);
}

.dependencies-command code {
  overflow: hidden;
  min-width: 0;
  flex: 1;
  color: var(--text-muted);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dependencies-command button {
  display: inline-flex;
  min-height: 38px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0 0.8rem;
  border: 0;
  border-radius: calc(var(--radius-lg) - 8px);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.dependencies-command button:hover {
  background: rgba(255, 255, 255, 0.09);
  color: var(--text-primary);
}

@media (max-width: 600px) {
  .dependencies-panel {
    grid-template-columns: 1fr;
  }

  .dependencies-summary {
    padding: 0.7rem 0.75rem 0.45rem;
  }

  .dependencies-command {
    min-height: 54px;
    padding-left: 0.75rem;
  }

  .dependencies-command button {
    width: 38px;
    padding: 0;
  }

  .dependencies-command button span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
}
</style>
