<template>
  <section class="flex ml-10 flex-col jutify-center">
    <h3 class="flex text-4xl text-violet-400 mb-4 font-bold">MCP Server</h3>
    <p class="docs-paragraph">
      <a style="text-decoration: underline" href="https://modelcontextprotocol.io/" target="_blank">
        Model Context Protocol (MCP)
      </a>
      is an open standard that enables AI assistants to securely connect to external data sources and tools.
    </p>
    <p class="flex mt-4 text-gray-300">
      Vue Bits encourages the use of the shadcn MCP server to browse, search, and install components using natural
      language.
    </p>
    <h3 class="flex mt-2 text-4xl text-violet-400 mt-4 mb-4 font-bold">Quick Start</h3>
    <p class="flex mt-2 text-gray-300">
      Registries are configured in your project&apos;s
      <span class="docs-highlight">components.json</span>
      file, where you should first add the
      <span class="docs-highlight">@vue-bits</span>
      registry:
    </p>
    <div
      class="relative mt-6 w-full max-w-[540px] rounded-2xl border border-violet-600/10 p-3 pr-14 text-sm text-slate-200 shadow-[0_0_0_1px_rgba(139,92,246,0.1)]"
    >
      <CodeBlock :showLineNumbers="true">
        {{ registrySnippet }}
        <button
          type="button"
          class="absolute left-120 top-2 rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-[11px] font-semibold text-violet-100 transition hover:border-violet-300/50 hover:bg-violet-500/20"
          @click="copyRegistrySnippet"
        >
          {{ isRegistryCopied ? '已复制' : '复制' }}
        </button>
      </CodeBlock>
    </div>
    <p class="flex mt-2 text-gray-300">
      Then, from the options below, select your client & set up the shadcn MCP server.
    </p>
    <div class="mt-10 flex flex-wrap gap-4">
      <button
        type="button"
        :class="[
          'group flex h-38 w-50 flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition-all',
          selectedMethod === 'claude'
            ? 'border-violet-400/70 bg-violet-500/15 shadow-[0_0_0_1px_rgba(139,92,246,0.35)]'
            : 'border-white/10 bg-violet-500/5 hover:border-violet-300/40 hover:bg-violet-500/10'
        ]"
        @click="selectedMethod = 'claude'"
      >
        <img :src="claude" alt="Claude Code Logo" class="h-10 w-10 rounded-lg" />
        <span
          :class="[
            'text-sm font-semibold tracking-tight text-center',
            selectedMethod === 'claude' ? 'text-white' : 'text-slate-300 group-hover:text-white'
          ]"
        >
          Claude Code
        </span>
      </button>
      <button
        type="button"
        :class="[
          'group flex h-38 w-50 flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition-all',
          selectedMethod === 'cursor'
            ? 'border-violet-400/70 bg-violet-500/15 shadow-[0_0_0_1px_rgba(139,92,246,0.35)]'
            : 'border-white/10 bg-violet-500/5 hover:border-violet-300/40 hover:bg-violet-500/10'
        ]"
        @click="selectedMethod = 'cursor'"
      >
        <img :src="cursor" alt="Cursor Logo" class="h-10 w-10 rounded-lg" />
        <span
          :class="[
            'text-sm font-semibold tracking-tight text-center',
            selectedMethod === 'cursor' ? 'text-white' : 'text-slate-300 group-hover:text-white'
          ]"
        >
          Cursor
        </span>
      </button>
      <button
        type="button"
        :class="[
          'group flex h-38 w-50 flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition-all',
          selectedMethod === 'vscode'
            ? 'border-violet-400/70 bg-violet-500/15 shadow-[0_0_0_1px_rgba(139,92,246,0.35)]'
            : 'border-white/10 bg-violet-500/5 hover:border-violet-300/40 hover:bg-violet-500/10'
        ]"
        @click="selectedMethod = 'vscode'"
      >
        <img :src="vscode" alt="VS Code Logo" class="h-10 w-10 rounded-lg" />
        <span
          :class="[
            'text-sm font-semibold tracking-tight text-center',
            selectedMethod === 'vscode' ? 'text-white' : 'text-slate-300 group-hover:text-white'
          ]"
        >
          VS Code
        </span>
      </button>
    </div>

    <template v-if="selectedMethod === 'claude'">
      <p class="mt-6 font-bold">Run this in your project:</p>
      <div
        class="relative mt-6 w-full max-w-[540px] rounded-2xl border border-violet-600/10 bg-slate-900/70 p-3 pr-14 text-sm text-slate-200 shadow-[0_0_0_1px_rgba(139,92,246,0.1)]"
      >
        <CodeBlock :showLineNumbers="true">
          {{ claudeCommand }}
        </CodeBlock>
        <button
          type="button"
          class="absolute right-3 top-2 rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-[11px] font-semibold text-violet-100 transition hover:border-violet-300/50 hover:bg-violet-500/20"
          @click="copyCommand(claudeCommand, 'claude')"
        >
          {{ copyState.claude ? '已复制' : '复制' }}
        </button>
      </div>
      <p class="mt-6 font-bold">Restart Claude Code and try prompts like:</p>
      <ul class="mt-6 list-disc pl-5 text-gray-500 text-xl">
        <li class="">Show me all the available backgrounds from the Vue Bits registry</li>
        <li class="">Add the Dither background from Vue Bits to the page, make it purple</li>
        <li class="">Add a new section which fades in on scroll using FadeContent from Vue Bits</li>
      </ul>
      <p class="mt-6 text-gray-500 text-xl">Tip: Use /mcp in Claude Code to debug the MCP server.</p>
    </template>

    <template v-if="selectedMethod === 'cursor'">
      <p class="mt-6 font-bold">Run this in your project:</p>
      <div
        class="relative mt-6 w-full max-w-[540px] rounded-2xl border border-violet-600/10 bg-slate-900/70 p-3 pr-14 text-sm text-slate-200 shadow-[0_0_0_1px_rgba(139,92,246,0.1)]"
      >
        <CodeBlock :showLineNumbers="true">
          {{ cursorCommand }}
        </CodeBlock>
        <button
          type="button"
          class="absolute right-3 top-2 rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-[11px] font-semibold text-violet-100 transition hover:border-violet-300/50 hover:bg-violet-500/20"
          @click="copyCommand(cursorCommand, 'cursor')"
        >
          {{ copyState.cursor ? '已复制' : '复制' }}
        </button>
      </div>
      <p class="mt-6 font-bold">Then open Cursor Settings and enable the shadcn MCP server. Try prompts like:</p>
      <ul class="mt-6 list-disc pl-5 text-gray-500 text-xl">
        <li class="">Show me all the available backgrounds from the Vue Bits registry</li>
        <li class="">Add the Dither background from Vue Bits to the page, make it purple</li>
        <li class="">Add a new section which fades in on scroll using FadeContent from Vue Bits</li>
      </ul>
    </template>

    <template v-if="selectedMethod === 'vscode'">
      <p class="mt-6 font-bold">Run this in your project:</p>
      <div
        class="relative mt-6 w-full max-w-[540px] rounded-2xl border border-violet-600/10 bg-slate-900/70 p-3 pr-14 text-sm text-slate-200 shadow-[0_0_0_1px_rgba(139,92,246,0.1)]"
      >
        <CodeBlock :showLineNumbers="true">
          {{ vscodeCommand }}
        </CodeBlock>
        <button
          type="button"
          class="absolute right-3 top-2 rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-[11px] font-semibold text-violet-100 transition hover:border-violet-300/50 hover:bg-violet-500/20"
          @click="copyCommand(vscodeCommand, 'vscode')"
        >
          {{ copyState.vscode ? '已复制' : '复制' }}
        </button>
      </div>
      <p class="mt-6 font-bold">
        Then open
        <span class="docs-highlight">.vscode/mcp.json</span>
        <span class="docs-highlight">Start</span>
        next to the shadcn server. Try prompts like:
      </p>
      <ul class="mt-6 list-disc pl-5 text-gray-500 text-xl">
        <li class="">Show me all the available backgrounds from the Vue Bits registry</li>
        <li class="">Add the Dither background from Vue Bits to this page, make it purple</li>
        <li class="">Add a new section which fades in on scroll using FadeContent from Vue Bits</li>
      </ul>
    </template>

    <h3 class="mt-6 font-bold text-4xl text-violet-400">Learn more</h3>

    <p class="mt-2 text-gray-500" style="margin-bottom: 8px">
      To learn more about using the shadcn MCP server, including manual setup for different clients, please visit the
      official documentation:
    </p>

    <a class="docs-paragraph" style="text-decoration: underline" href="https://ui.shadcn.com/docs/mcp" target="_blank">
      ui.shadcn.com/docs/mcp
    </a>

    <DocsButtonBar
      :next="{ label: 'Browse Components', route: '/get-started/index' }"
      :previous="{ label: 'Installation', route: '/get-started/installation' }"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const claude = '/assets/Claude.png';
const vscode = '/assets/vscode.png';
const cursor = '/assets/cursor.png';
const selectedMethod = ref('claude');
const registrySnippet = `{ "registries": { "@vue-bits": "https://vuebits.dev/r/{name}.json" } }`;
const claudeCommand = 'npx shadcn@latest mcp init --client claude';
const cursorCommand = 'npx shadcn@latest mcp init --client cursor';
const vscodeCommand = 'npx shadcn@latest mcp init --client vscode';
const isRegistryCopied = ref(false);
const copyState = ref({
  registry: false,
  claude: false,
  cursor: false,
  vscode: false
});
const copyRegistrySnippet = async () => {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return;
    await navigator.clipboard.writeText(registrySnippet);
    isRegistryCopied.value = true;
    window.setTimeout(() => {
      isRegistryCopied.value = false;
    }, 1200);
  } catch {
    isRegistryCopied.value = false;
  }
};
const copyCommand = async (command: string, key: 'claude' | 'cursor' | 'vscode') => {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return;
    await navigator.clipboard.writeText(command);
    copyState.value[key] = true;
    window.setTimeout(() => {
      copyState.value[key] = false;
    }, 1200);
  } catch {
    copyState.value[key] = false;
  }
};
</script>
