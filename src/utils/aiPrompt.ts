import type { PropRow } from '@/components/common/PropTable.vue';

export type PromptCodeObject = {
  usage?: string;
  code?: string;
  utility?: string;
  dependencies?: string;
};

export const stripSourceHeader = (source = '') => source.replace(/^['"][^'"]+['"];\s*/gm, '').trim();

export function buildPrompt(componentName: string, codeObject: PromptCodeObject, propData: PropRow[] = []) {
  const usage = codeObject.usage || '';
  const deps = codeObject.dependencies || '';
  const source = stripSourceHeader(codeObject.code || '');

  let prompt = `## Integrate the <${componentName} /> component from Vue Bits

You are helping integrate an open-source Vue component into an existing application.

### Component: ${componentName}
### Variant: Vue + TypeScript
${deps ? `### Dependencies: ${deps}` : ''}

---

### Usage Example
\`\`\`vue
${usage}
\`\`\`
`;

  if (propData.length > 0) {
    prompt += `
### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
${propData.map(p => `| ${p.name} | ${p.type} | ${p.default || '—'} | ${p.description} |`).join('\n')}
`;
  }

  prompt += `
### Full Component Source
\`\`\`vue
${source}
\`\`\`
`;

  if (codeObject.utility) {
    prompt += `
### Utility Source
\`\`\`ts
${codeObject.utility}
\`\`\`
`;
  }

  prompt += `
### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import and render the component using the usage example above as a starting point.
4. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from Vue Bits
The full library index, including everything vue-bits.dev offers, is at https://vue-bits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.
`;

  return prompt;
}
