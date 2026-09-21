<script setup lang="ts">
import { copyText } from '@/utils/aiExport';
import { Check, Copy } from 'lucide-vue-next';
import { onBeforeUnmount, ref } from 'vue';

const props = defineProps<{ title: string; note?: string | null; copy?: string }>();

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function handleCopy() {
  if (!props.copy || !(await copyText(props.copy))) return;
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 2000);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <section class="code-section-frame">
    <header class="code-section-heading">
      <div class="code-section-title-group">
        <h2>{{ title }}</h2>
        <span v-if="note" class="code-section-note">{{ note }}</span>
      </div>
      <div class="code-section-actions">
        <slot name="actions" />
        <button
          v-if="copy"
          type="button"
          class="docs-copy-button"
          :title="copied ? 'Copied!' : 'Copy to clipboard'"
          :aria-label="copied ? 'Code copied to clipboard' : 'Copy code to clipboard'"
          @click="handleCopy"
        >
          <Check v-if="copied" :size="16" />
          <Copy v-else :size="16" />
        </button>
      </div>
    </header>
    <div class="code-section-body">
      <slot />
    </div>
  </section>
</template>

<style>
.code-section-frame {
  margin-top: 2rem;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: var(--surface-ghost-track);
  box-shadow: var(--surface-ghost-highlight);
}

.code-section-heading {
  display: flex;
  min-height: 46px;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0.55rem 0.45rem 0.75rem;
}

.code-section-title-group {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 0.55rem;
}

.code-section-title-group h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-transform: capitalize;
}

.code-section-note {
  overflow: hidden;
  color: var(--color-accent-muted);
  font-size: 0.6875rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.code-section-actions {
  display: flex;
  min-width: 0;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.docs-copy-button {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: var(--surface-ghost-track);
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    transform 0.12s ease;
}

.docs-copy-button:hover {
  background: var(--surface-ghost);
  color: var(--text-primary);
}

.docs-copy-button:active {
  transform: scale(0.95);
}

.code-section-body {
  overflow: hidden;
  border: 1px solid var(--inset-border);
  border-radius: calc(var(--radius-lg) - 5px);
  background: var(--bg-body);
}

.code-section-body .code-highlighter {
  margin: 0;
  border: 0;
  border-radius: 0;
}

@media (max-width: 640px) {
  .code-section-heading {
    gap: 0.5rem;
    padding: 0.45rem 0.45rem 0.45rem 0.65rem;
  }

  .code-section-title-group {
    flex: 1 1 auto;
  }
}
</style>
