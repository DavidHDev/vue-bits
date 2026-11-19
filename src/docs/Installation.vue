<template>
  <section class="docs-section">
    <div class="docs-page-header">
      <h1 class="docs-title">Installation</h1>
      <CopyPageButton />
    </div>

    <p class="docs-lead">
      Every component installs as source code you own. Pull it in with one CLI command, or copy the file by hand.
    </p>

    <h2 class="docs-section-title">With the CLI</h2>

    <ol class="docs-steps">
      <DocsStep :index="1" title="Run the add command">
        <p class="docs-step-text">Use whichever CLI you already have. Both install the same source.</p>
        <CommandList :items="commands" />
        <p class="docs-step-note" v-html="SWAP_NOTE" />
      </DocsStep>

      <DocsStep :index="2" title="Import and use it">
        <p class="docs-step-text">Render it like any other component:</p>
        <DocsCodeBlock :code="USAGE" language="vue" show-line-numbers />
      </DocsStep>
    </ol>

    <h2 class="docs-section-title">By hand</h2>

    <ol class="docs-steps">
      <DocsStep :index="1" title="Open a component's Code tab">
        <p class="docs-step-text">It shows the full source of the component, ready to copy.</p>
      </DocsStep>

      <DocsStep :index="2" title="Copy the file into your project">
        <p class="docs-step-text" v-html="PASTE_TEXT" />
      </DocsStep>

      <DocsStep :index="3" title="Install its dependencies">
        <p class="docs-step-text">The Code tab lists what each component needs. Split Text uses GSAP:</p>
        <DocsCodeBlock code="npm install gsap" language="bash" />
      </DocsStep>

      <DocsStep :index="4" title="Import and use it">
        <p class="docs-step-text">Import and render it the same way as the CLI example above.</p>
      </DocsStep>
    </ol>

    <h2 class="docs-section-title">That's all</h2>

    <p class="docs-paragraph">The code is yours now, so change the styles, props or behavior however you like.</p>

    <DocsButtonBar
      :next="{ label: 'MCP Server', route: '/get-started/mcp' }"
      :previous="{ label: 'Introduction', route: '/get-started/introduction' }"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { jsrepoAddSnippet, shadcnAddSnippet } from '@/constants/cli';
import CommandList from './CommandList.vue';
import CopyPageButton from './CopyPageButton.vue';
import DocsButtonBar from './DocsButtonBar.vue';
import DocsCodeBlock from './DocsCodeBlock.vue';
import DocsStep from './DocsStep.vue';

const USAGE = [
  '<template>',
  '  <SplitText',
  '    text="Hello, you!"',
  '    :delay="100"',
  '    :duration="0.6"',
  '  />',
  '</template>',
  '',
  '<' + 'script setup lang="ts">',
  "import SplitText from './SplitText.vue';",
  '</' + 'script>'
].join('\n');

const SWAP_NOTE =
  'Swap <code>SplitText</code> for any component. On pnpm, yarn or bun, replace <code>npx</code> with <code>pnpm dlx</code>, <code>yarn dlx</code> or <code>bunx --bun</code>.';

const PASTE_TEXT = 'Paste the component into a new file, for example <code>SplitText.vue</code>.';

const commands = [
  { key: 'shadcn', label: 'shadcn', command: shadcnAddSnippet('split-text', 'npm') },
  { key: 'jsrepo', label: 'jsrepo', command: jsrepoAddSnippet('split-text', 'npm') }
];

onMounted(() => window.scrollTo(0, 0));
</script>
