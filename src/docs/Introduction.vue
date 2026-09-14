<script setup lang="ts">
import { ArrowRight, Search, SlidersHorizontal, TerminalSquare } from 'lucide-vue-next';
import { onMounted } from 'vue';
import CopyPageButton from './CopyPageButton.vue';
import DocsButtonBar from './DocsButtonBar.vue';

const QUICK_START_STEPS = [
  {
    icon: Search,
    title: 'Choose a component',
    description: 'Browse by category or search for the interaction you need.'
  },
  {
    icon: SlidersHorizontal,
    title: 'Make it yours',
    description: 'Tune the preview and copy the settings into your usage code.'
  },
  {
    icon: TerminalSquare,
    title: 'Add it to your project',
    description: 'Copy the source straight in, or install it with the CLI.'
  }
];

onMounted(() => window.scrollTo(0, 0));
</script>

<template>
  <section class="mx-auto pb-24 max-w-168.75 docs-page">
    <div class="flex justify-between items-start gap-4">
      <h1 class="m-0 text-4xl md:text-[2.75rem] font-bold leading-[1.04] tracking-tight text-(--text-primary)">
        Introduction
      </h1>
      <CopyPageButton />
    </div>

    <p class="max-w-[60ch] mt-4 mb-5 text-lg leading-relaxed text-(--text-secondary)">
      Pick a component, tune it in the preview, then copy or install the exact variant for your stack.
    </p>

    <div class="my-7 overflow-hidden rounded-2xl border border-(--border-primary) bg-(--bg-elevated)">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-px bg-(--border-primary)">
        <div
          v-for="(step, index) in QUICK_START_STEPS"
          :key="step.title"
          class="bg-(--bg-elevated) p-5 flex flex-col gap-2"
        >
          <div class="flex items-center gap-2 justify-between text-(--color-accent)">
            <span class="font-mono text-xs text-(--text-muted)">0{{ index + 1 }}</span>
            <component :is="step.icon" :size="17" aria-hidden="true" />
          </div>
          <h2 class="m-0 text-[15px] font-semibold text-(--text-primary)">{{ step.title }}</h2>
          <p class="m-0 text-sm leading-relaxed text-(--text-muted)">{{ step.description }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-3 p-4">
        <RouterLink
          to="/get-started/index"
          class="inline-flex items-center gap-2 px-4 h-10 rounded-sm text-sm font-semibold text-black! bg-(--color-primary) no-underline transition-transform duration-200 hover:-translate-y-px"
        >
          Browse components
          <ArrowRight :size="14" aria-hidden="true" />
        </RouterLink>
        <RouterLink
          to="/get-started/installation"
          class="inline-flex items-center px-4 h-10 rounded-sm text-sm font-medium text-(--text-muted) no-underline transition-colors duration-200 hover:text-(--text-primary)"
        >
          Installation guide
        </RouterLink>
      </div>
    </div>

    <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
      Vue Bits is an open-source collection of expressive UI components for adding motion and personality without
      adopting an entire design system.
    </p>

    <h2 class="mt-14 mb-3 text-xl font-semibold text-(--text-primary)">Mission</h2>

    <p class="text-[15px] leading-relaxed mb-5 text-(--text-muted)">
      The goal of Vue Bits is simple - provide flexible, visually stunning and most importantly, free components that
      take Vue projects to the next level.
    </p>
    <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
      To make that happen, the project is committed to the following principles:
    </p>

    <ul class="space-y-2 mb-7 pl-5 list-disc">
      <li class="text-[15px] leading-relaxed text-(--text-secondary) max-w-[55ch]">
        <span class="font-semibold text-(--color-accent)">Free For All:</span>
        You own the code, and it's free to use in your projects
      </li>
      <li class="text-[15px] leading-relaxed text-(--text-secondary) max-w-[55ch]">
        <span class="font-semibold text-(--color-accent)">Prop-First Approach:</span>
        Easy customization through thoughtfully exposed props
      </li>
      <li class="text-[15px] leading-relaxed text-(--text-secondary) max-w-[55ch]">
        <span class="font-semibold text-(--color-accent)">Fully Modular:</span>
        Install strictly what you need, Vue Bits is not a dependency
      </li>
      <li class="text-[15px] leading-relaxed text-(--text-secondary) max-w-[55ch]">
        <span class="font-semibold text-(--color-accent)">Single, Consistent Stack:</span>
        Every component ships as Vue 3 + TypeScript, styled with Tailwind, so it drops straight into a modern Vue app
      </li>
    </ul>

    <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">Free For All</h3>
    <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
      Every component you choose to bring into your project is yours to modify or extend, because you get full
      visibility of the code, not just an import.
    </p>

    <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">Prop-First Approach</h3>
    <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
      Every component is designed to be flexible and customizable, with props that let you adjust the look and feel
      without always having to dive into the code.
    </p>

    <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">Fully Modular</h3>
    <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
      Vue Bits is not your classic NPM library, you install only the components you need by either copying the code or
      using the CLI, without pulling in a whole library.
    </p>

    <h3 class="mt-8 mb-2 text-[1.0625rem] font-semibold text-(--text-secondary)">Single, Consistent Stack</h3>
    <p class="text-[15px] leading-relaxed mb-5 text-(--text-secondary)">
      Every component is written in TypeScript and styled with Tailwind CSS, so there's exactly one version to reach for
      - no picking between JS/TS or CSS/Tailwind variants.
    </p>

    <h2 class="mt-14 mb-3 text-xl font-semibold text-(--text-primary)">Performance</h2>

    <p class="text-[15px] leading-relaxed mb-5 text-(--text-muted)">
      While we do everything possible to optimize components and offer the best experience, here are some tips to keep
      in mind when using Vue Bits:
    </p>

    <ul class="space-y-2 mb-7 pl-5 list-disc">
      <li class="text-[15px] leading-relaxed text-(--text-secondary) max-w-[55ch]">
        <span class="font-semibold text-(--color-accent)">Less Is More:</span>
        Using more than 2-3 components on a page is not advised, it can overload your page with animations, potentially
        impacting performance or UX
      </li>
      <li class="text-[15px] leading-relaxed text-(--text-secondary) max-w-[55ch]">
        <span class="font-semibold text-(--color-accent)">Mobile Optimization:</span>
        Consider disabling certain effects on mobile and replacing them with static placeholders instead
      </li>
      <li class="text-[15px] leading-relaxed text-(--text-secondary) max-w-[55ch]">
        <span class="font-semibold text-(--color-accent)">Test Thoroughly:</span>
        Your device may be high-end, but be considerate of your users - always test on multiple devices before going
        live
      </li>
    </ul>

    <DocsButtonBar :next="{ label: 'Installation', route: '/get-started/installation' }" />
  </section>
</template>
