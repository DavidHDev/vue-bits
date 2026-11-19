<template>
  <CliInstallation :deps="dependencies" />

  <CodeSection v-if="dynamicUsage" title="Usage" :note="hasChanges ? 'With your settings' : null">
    <template #actions>
      <CodeCopyButton :code-string="dynamicUsage" />
    </template>
    <CodeHighlighter snippet-id="usage" language="vue" :code-string="dynamicUsage" :show-copy-button="false" />
  </CodeSection>

  <CodeSection v-if="codeObject.code" title="Code">
    <template #actions>
      <CodeCopyButton :code-string="codeObject.code" />
    </template>
    <CodeHighlighter snippet-id="code" language="vue" :code-string="codeObject.code" :show-copy-button="false" />
  </CodeSection>

  <CodeSection v-for="section in extraSections" :key="section.name" :title="section.title">
    <template #actions>
      <CodeCopyButton :code-string="section.snippet" />
    </template>
    <CodeHighlighter
      :snippet-id="section.name"
      :language="section.language"
      :code-string="section.snippet"
      :show-copy-button="false"
    />
  </CodeSection>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { dependenciesForSlug } from '@/constants/componentDependencies';
import type { CodeObject } from '@/types/code';
import { injectPropsIntoVueUsage } from '@/utils/codeGeneration';
import { useComponentPropsContext } from '@/components/context/componentProps';
import CliInstallation from './CliInstallation.vue';
import CodeCopyButton from './CodeCopyButton.vue';
import CodeHighlighter from './CodeHighlighter.vue';
import CodeSection from './CodeSection.vue';

const SKIP_KEYS = new Set(['cli', 'installation', 'dependencies', 'usage', 'code']);
const TITLES: Record<string, string> = { utility: 'Utility source', css: 'CSS', presets: 'Presets' };
const LANGUAGES: Record<string, string> = { utility: 'ts', css: 'css', presets: 'ts', installation: 'bash' };

const props = defineProps<{ codeObject: CodeObject; componentName?: string }>();

const route = useRoute();
const context = useComponentPropsContext();
const hasChanges = computed(() => context.hasChanges.value);

const dependencies = computed(() => {
  if (props.codeObject.dependencies !== undefined) return props.codeObject.dependencies;
  return dependenciesForSlug(route.params.subcategory as string).join(' ');
});

const dynamicUsage = computed(() => {
  const usage = props.codeObject.usage;
  const values = context.props.value;
  if (!usage || !props.componentName || !values || Object.keys(values).length === 0) return usage;
  return injectPropsIntoVueUsage(
    usage,
    { ...values, ...context.computedProps.value },
    {},
    props.componentName,
    context.demoOnlyProps.value
  );
});

const extraSections = computed(() =>
  Object.entries(props.codeObject)
    .filter(([name, snippet]) => !SKIP_KEYS.has(name) && typeof snippet === 'string' && snippet)
    .map(([name, snippet]) => ({
      name,
      snippet: snippet as string,
      title: TITLES[name] ?? name,
      language: LANGUAGES[name] ?? 'vue'
    }))
);
</script>
