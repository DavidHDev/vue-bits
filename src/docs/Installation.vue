<script setup lang="ts">
import CodeBlock from '@/components/common/CodeBlock.vue';
import { jsrepoAddSnippet, PKG_MANAGERS, registryUrl, shadcnAddSnippet, type PackageManager } from '@/constants/cli';
import { Check, Copy, TerminalSquare } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import CopyPageButton from './CopyPageButton.vue';
import DocsButtonBar from './DocsButtonBar.vue';
import MethodSelector from './MethodSelector.vue';

const EXAMPLE_SLUG = 'split-text';

const usageExample = [
  '<' + 'script setup>',
  "import SplitText from './SplitText.vue';",
  '</' + 'script>',
  '',
  '<template>',
  '  <SplitText text="Hello, you!" :delay="100" :duration="0.6" />',
  '</template>'
].join('\n');

const installMode = ref<'manual' | 'cli'>('manual');
const cliTool = ref<'shadcn' | 'jsrepo'>('shadcn');
const pkg = ref<PackageManager>('npm');
const copied = ref(false);

const command = computed(() =>
  cliTool.value === 'shadcn' ? shadcnAddSnippet(EXAMPLE_SLUG, pkg.value) : jsrepoAddSnippet(EXAMPLE_SLUG, pkg.value)
);

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    // clipboard write failed silently
  }
}

onMounted(() => window.scrollTo(0, 0));
</script>

<template>
  <section class="mx-auto pb-24 max-w-168.75 docs-page">
    <div class="flex justify-between items-start gap-4">
      <h1 class="m-0 text-4xl md:text-[2.75rem] font-bold leading-[1.04] tracking-tight text-(--text-primary)">
        Installation
      </h1>
      <CopyPageButton />
    </div>

    <p class="max-w-[60ch] mt-4 mb-5 text-lg leading-relaxed text-(--text-secondary)">
      Add Vue Bits components two ways - copy the source by hand, or pull them in with a CLI.
    </p>

    <h2 class="mt-14 mb-3 text-xl font-semibold text-(--text-primary)">Pick the method</h2>
    <MethodSelector
      :methods="[
        { key: 'manual', label: 'Manual', icon: Copy },
        { key: 'cli', label: 'CLI', icon: TerminalSquare }
      ]"
      :selected="installMode"
      aria-label="Installation method"
      @select="key => (installMode = key as 'manual' | 'cli')"
    />

    <h2 class="mt-14 mb-3 text-xl font-semibold text-(--text-primary)">Steps</h2>

    <template v-if="installMode === 'manual'">
      <p class="text-[15px] leading-relaxed mb-5 text-(--text-muted)">
        Copy a component's source straight into your project.
      </p>

      <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">1. Pick a component</h3>
      <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
        Browse the library, open a component you like, and switch to its
        <span class="font-semibold text-(--color-accent)">Code</span>
        tab.
      </p>

      <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">2. Copy the code</h3>
      <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
        Every component ships as a single
        <span class="font-semibold text-(--color-accent)">.vue</span>
        file written in TypeScript and styled with Tailwind - copy it into a new file in your project.
      </p>

      <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">
        3. Install dependencies &amp; use it
      </h3>
      <p class="text-[15px] leading-relaxed mb-3 text-(--text-secondary)">
        If a component relies on external libraries, its Code tab lists them. Install what it needs:
      </p>
      <CodeBlock code="npm install gsap" language="bash" />
      <p class="text-[15px] leading-relaxed my-3 text-(--text-secondary)">
        Then import and render it like any other component:
      </p>
      <CodeBlock :code="usageExample" language="html" />
    </template>

    <template v-else>
      <p class="text-[15px] leading-relaxed mb-5 text-(--text-muted)">
        Pull a component into your project with a single command.
      </p>

      <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">1. Choose a CLI</h3>
      <p class="text-[15px] leading-relaxed mb-3 text-(--text-secondary)">
        Vue Bits works with two registries - both fetch the same source, so pick whichever you already use.
      </p>
      <MethodSelector
        :methods="[
          { key: 'shadcn', label: 'shadcn' },
          { key: 'jsrepo', label: 'jsrepo' }
        ]"
        :selected="cliTool"
        aria-label="CLI tool"
        @select="key => (cliTool = key as 'shadcn' | 'jsrepo')"
      />

      <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">2. Pick a package manager</h3>
      <MethodSelector
        :methods="PKG_MANAGERS.map(m => ({ key: m, label: m }))"
        :selected="pkg"
        aria-label="Package manager"
        @select="key => (pkg = key as PackageManager)"
      />

      <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">3. Run the command</h3>
      <p class="text-[15px] leading-relaxed mb-3 text-(--text-secondary)">
        This example installs
        <span class="font-semibold text-(--color-accent)">SplitText</span>
        - swap in any component name:
      </p>

      <div class="relative rounded-xl border border-(--border-secondary) overflow-hidden">
        <code
          class="block w-full box-border py-4 pl-5 pr-14 font-mono text-sm text-(--text-primary) whitespace-pre overflow-x-auto"
        >
          {{ command }}
        </code>
        <button
          type="button"
          class="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-(--border-secondary) cursor-pointer transition-colors duration-200"
          :class="
            copied
              ? 'bg-(--color-primary) text-black'
              : 'bg-(--bg-body) text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-primary)'
          "
          aria-label="Copy install command"
          @click="copyCommand"
        >
          <Check v-if="copied" :size="15" />
          <Copy v-else :size="15" />
        </button>
      </div>

      <p class="text-[15px] leading-relaxed mt-4 text-(--text-muted)">
        Pulls the component from
        <a class="text-(--color-accent)" :href="registryUrl(EXAMPLE_SLUG)" target="_blank" rel="noreferrer">
          {{ registryUrl(EXAMPLE_SLUG) }}
        </a>
        and copies it into your project.
      </p>
    </template>

    <h2 class="mt-14 mb-3 text-xl font-semibold text-(--text-primary)">That's all!</h2>

    <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
      From here on, it's all about how you integrate the component into your project. The code is yours to play around
      with - modify styling, functionality, anything goes!
    </p>

    <DocsButtonBar
      :next="{ label: 'MCP Server', route: '/get-started/mcp' }"
      :previous="{ label: 'Introduction', route: '/get-started/introduction' }"
    />
  </section>
</template>
