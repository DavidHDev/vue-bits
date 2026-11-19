<template>
  <section class="docs-section">
    <div class="docs-page-header">
      <h1 class="docs-title">MCP Server</h1>
      <CopyPageButton />
    </div>

    <p class="docs-lead">
      Let your AI assistant browse, search and install Vue Bits components for you, straight from a prompt.
    </p>

    <p class="docs-paragraph dim" v-html="INTRO_HTML" />

    <h2 class="docs-section-title">Setup</h2>

    <ol class="docs-steps">
      <DocsStep :index="1" title="Add the Vue Bits registry">
        <p class="docs-step-text" v-html="REGISTRY_TEXT" />
        <DocsCodeBlock :code="SAMPLE_COMPONENTS_JSON_REGISTRIES_DOC" language="json" show-line-numbers />
      </DocsStep>

      <DocsStep :index="2" title="Connect your AI client">
        <p class="docs-step-text">Set up the shadcn MCP server for your client:</p>
        <CommandList :items="CLIENTS">
          <template #icon="{ item }">
            <TbBrandOpenai v-if="item.key === 'codex'" :size="15" aria-hidden="true" />
            <img v-else :src="ICONS[item.key]" alt="" class="docs-cmd-logo" />
          </template>
          <template #note="{ item }">
            <span v-html="NOTES[item.key]" />
          </template>
        </CommandList>
      </DocsStep>

      <DocsStep :index="3" title="Ask for components">
        <p class="docs-step-text">Describe what you want in plain language. Try one of these:</p>
        <ul class="docs-cmds">
          <li v-for="prompt in EXAMPLE_PROMPTS" :key="prompt" class="docs-prompt">
            <span class="docs-prompt-text">{{ prompt }}</span>
            <DocsCopyButton :text="prompt" label="Copy prompt" />
          </li>
        </ul>
      </DocsStep>
    </ol>

    <h2 class="docs-section-title">Learn more</h2>

    <a class="docs-link-tile" href="https://ui.shadcn.com/docs/mcp" target="_blank" rel="noreferrer">
      <span class="docs-link-tile-text">
        <span class="docs-link-tile-title">shadcn MCP documentation</span>
        <span class="docs-link-tile-desc">Manual setup for other clients, and more ways to use the server.</span>
      </span>
      <LuArrowUpRight size="1em" aria-hidden="true" />
    </a>

    <DocsButtonBar
      :next="{ label: 'Browse Components', route: '/get-started/index' }"
      :previous="{ label: 'Installation', route: '/get-started/installation' }"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { LuArrowUpRight } from 'vue-icons-plus/lu';
import { TbBrandOpenai } from 'vue-icons-plus/tb';
import antigravityIcon from '@/assets/icons/antigravity.svg';
import claudeIcon from '@/assets/icons/claude.svg';
import cursorIcon from '@/assets/icons/cursor.svg';
import vscodeIcon from '@/assets/icons/vscode.svg';
import { SAMPLE_COMPONENTS_JSON_REGISTRIES_DOC } from '@/constants/cli';
import CommandList from './CommandList.vue';
import CopyPageButton from './CopyPageButton.vue';
import DocsButtonBar from './DocsButtonBar.vue';
import DocsCodeBlock from './DocsCodeBlock.vue';
import DocsCopyButton from './DocsCopyButton.vue';
import DocsStep from './DocsStep.vue';

const ICONS: Record<string, string> = {
  antigravity: antigravityIcon,
  claude: claudeIcon,
  cursor: cursorIcon,
  vscode: vscodeIcon
};

const CLIENTS = [
  {
    key: 'antigravity',
    label: 'Antigravity',
    command: `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}`
  },
  { key: 'claude', label: 'Claude Code', command: 'npx shadcn@latest mcp init --client claude' },
  {
    key: 'codex',
    label: 'Codex',
    command: `[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]`
  },
  { key: 'cursor', label: 'Cursor', command: 'npx shadcn@latest mcp init --client cursor' },
  { key: 'vscode', label: 'VS Code', command: 'npx shadcn@latest mcp init --client vscode' }
];

const INTRO_HTML =
  'It works through the shadcn MCP server. <a class="docs-inline-link" href="https://modelcontextprotocol.io/" target="_blank" rel="noreferrer">Model Context Protocol</a> is an open standard that lets AI assistants connect to tools and data.';

const REGISTRY_TEXT = "In your project's <code>components.json</code>, add <code>@vue-bits</code> to the registries:";

const NOTES: Record<string, string> = {
  antigravity:
    'Add this to <code>~/.gemini/config/mcp_config.json</code> or project <code>.agents/mcp_config.json</code>. Works across Antigravity CLI (<code>agy</code>), Antigravity IDE, and Antigravity 2.0.',
  claude: "Then restart Claude Code. If the server doesn't show up, run <code>/mcp</code> to debug it.",
  codex: "The CLI can't set up Codex for you. Add this to <code>~/.codex/config.toml</code>, then restart Codex.",
  cursor: 'Then open Cursor Settings and enable the shadcn MCP server.',
  vscode: 'Then open <code>.vscode/mcp.json</code> and click Start next to the shadcn server.'
};

const EXAMPLE_PROMPTS = [
  'Show me all the available backgrounds from the Vue Bits registry',
  'Add the Dither background from Vue Bits to the page, make it green',
  'Add a new section which fades in on scroll using FadeContent from Vue Bits'
];

onMounted(() => window.scrollTo(0, 0));
</script>
