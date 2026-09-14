<script setup lang="ts">
import claudeIcon from '@/assets/icons/claude.svg';
import cursorIcon from '@/assets/icons/cursor.svg';
import vscodeIcon from '@/assets/icons/vscode.svg';
import CodeBlock from '@/components/common/CodeBlock.vue';
import { SAMPLE_COMPONENTS_JSON_REGISTRIES_DOC } from '@/constants/cli';
import { computed, onMounted, ref } from 'vue';
import CopyPageButton from './CopyPageButton.vue';
import DocsButtonBar from './DocsButtonBar.vue';
import MethodSelector from './MethodSelector.vue';

const CLIENTS = [
  { key: 'claude', label: 'Claude Code', icon: claudeIcon },
  { key: 'cursor', label: 'Cursor', icon: cursorIcon },
  { key: 'vscode', label: 'VS Code', icon: vscodeIcon }
];

const EXAMPLE_PROMPTS = [
  'Show me all the available backgrounds from the Vue Bits registry',
  'Add the Dither background from Vue Bits to the page, make it purple',
  'Add a new section which fades in on scroll using FadeContent from Vue Bits'
];

const selectedClient = ref<'claude' | 'cursor' | 'vscode'>('claude');

const initCommand = computed(() => `npx shadcn@latest mcp init --client ${selectedClient.value}`);

onMounted(() => window.scrollTo(0, 0));
</script>

<template>
  <section class="mx-auto pb-24 max-w-168.75 docs-page">
    <div class="flex justify-between items-start gap-4">
      <h1 class="m-0 text-4xl md:text-[2.75rem] font-bold leading-[1.04] tracking-tight text-(--text-primary)">
        MCP Server
      </h1>
      <CopyPageButton />
    </div>

    <p class="max-w-[60ch] mt-4 mb-5 text-lg leading-relaxed text-(--text-secondary)">
      <a
        class="underline text-(--text-secondary)"
        href="https://modelcontextprotocol.io/"
        target="_blank"
        rel="noreferrer"
      >
        Model Context Protocol (MCP)
      </a>
      is an open standard that enables AI assistants to securely connect to external data sources and tools.
    </p>

    <p class="text-[15px] leading-relaxed mb-5 text-(--text-muted)">
      Vue Bits encourages the use of the shadcn MCP server to browse, search, and install components using natural
      language.
    </p>

    <h2 class="mt-14 mb-3 text-xl font-semibold text-(--text-primary)">Quick Start</h2>

    <p class="text-[15px] leading-relaxed mb-3 text-(--text-secondary)">
      Registries are configured in your project's
      <span class="font-semibold text-(--color-accent)">components.json</span>
      file, where you should first add the
      <span class="font-semibold text-(--color-accent)">@vue-bits</span>
      registry:
    </p>
    <CodeBlock :code="SAMPLE_COMPONENTS_JSON_REGISTRIES_DOC" language="json" />

    <p class="text-[15px] leading-relaxed my-5 text-(--text-muted)">
      Then, from the options below, select your client &amp; set up the shadcn MCP server.
    </p>

    <MethodSelector
      :methods="CLIENTS"
      :selected="selectedClient"
      aria-label="MCP client"
      @select="key => (selectedClient = key as 'claude' | 'cursor' | 'vscode')"
    />

    <p class="text-[15px] leading-relaxed my-5 text-(--text-secondary)">Run this in your project:</p>
    <CodeBlock :code="initCommand" language="bash" />

    <p v-if="selectedClient === 'claude'" class="text-[15px] leading-relaxed my-3 text-(--text-secondary)">
      Restart Claude Code and try prompts like:
    </p>
    <p v-else-if="selectedClient === 'cursor'" class="text-[15px] leading-relaxed my-3 text-(--text-secondary)">
      Then open Cursor Settings and enable the shadcn MCP server. Try prompts like:
    </p>
    <p v-else class="text-[15px] leading-relaxed my-3 text-(--text-secondary)">
      Then open
      <span class="font-semibold text-(--color-accent)">.vscode/mcp.json</span>
      and click
      <span class="font-semibold text-(--color-accent)">Start</span>
      next to the shadcn server. Try prompts like:
    </p>

    <ul class="space-y-2 mb-5 pl-5 list-disc">
      <li
        v-for="prompt in EXAMPLE_PROMPTS"
        :key="prompt"
        class="text-[15px] leading-relaxed text-(--text-muted) max-w-[55ch]"
      >
        {{ prompt }}
      </li>
    </ul>

    <p v-if="selectedClient === 'claude'" class="text-[15px] leading-relaxed mb-5 text-(--text-muted)">
      Tip: Use /mcp in Claude Code to debug the MCP server.
    </p>

    <h2 class="mt-14 mb-3 text-xl font-semibold text-(--text-primary)">Learn more</h2>

    <p class="text-[15px] leading-relaxed mb-4 text-(--text-muted)">
      To learn more about using the shadcn MCP server, including manual setup for different clients, please visit the
      official documentation:
    </p>

    <a
      class="underline text-[15px] text-(--text-secondary)"
      href="https://ui.shadcn.com/docs/mcp"
      target="_blank"
      rel="noreferrer"
    >
      ui.shadcn.com/docs/mcp
    </a>

    <DocsButtonBar
      :next="{ label: 'Browse Components', route: '/get-started/index' }"
      :previous="{ label: 'Installation', route: '/get-started/installation' }"
    />
  </section>
</template>
