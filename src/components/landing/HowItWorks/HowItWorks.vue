<script setup lang="ts">
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import HeroCopyCommand from '../Hero/HeroCopyCommand.vue';
import { vReveal } from '../reveal';
import './HowItWorks.css';

type Kind = 'str' | 'punc' | 'kw' | 'ink' | 'attr';

const COMMAND = 'npx jsrepo add https://vue-bits.dev/r/Aurora';

const OUTPUT = ['✔ Checking registry.', '✔ Created 1 file:', '  - src/components/Aurora.vue'];

const CODE: [string, Kind][][] = [
  [
    ['<', 'punc'],
    ['script', 'kw'],
    [' setup', 'attr'],
    [' lang', 'attr'],
    ['=', 'punc'],
    ['"ts"', 'str'],
    ['>', 'punc']
  ],
  [
    ['import', 'kw'],
    [' { onMounted, ref } ', 'ink'],
    ['from', 'kw'],
    [" 'vue'", 'str'],
    [';', 'punc']
  ],
  [],
  [
    ['const', 'kw'],
    [' props ', 'ink'],
    ['= ', 'punc'],
    ['withDefaults', 'ink'],
    ['(', 'punc'],
    ['defineProps', 'ink'],
    ['<', 'punc'],
    ['AuroraProps', 'ink'],
    ['>(), {', 'punc']
  ],
  [
    ['  colorStops', 'attr'],
    [': () => [', 'punc'],
    ["'#171D22'", 'str'],
    [', ', 'punc'],
    ["'#7cff67'", 'str'],
    [', ', 'punc'],
    ["'#171D22'", 'str'],
    ['],', 'punc']
  ],
  [
    ['  amplitude', 'attr'],
    [': ', 'punc'],
    ['1', 'ink'],
    [',', 'punc']
  ],
  [
    ['  blend', 'attr'],
    [': ', 'punc'],
    ['0.5', 'ink'],
    [',', 'punc']
  ],
  [
    ['  speed', 'attr'],
    [': ', 'punc'],
    ['0.6', 'ink'],
    [',', 'punc']
  ],
  [['});', 'punc']],
  [],
  [
    ['const', 'kw'],
    [' containerRef ', 'ink'],
    ['= ', 'punc'],
    ['ref', 'ink'],
    ['<HTMLDivElement | ', 'punc'],
    ['null', 'kw'],
    ['>(', 'punc'],
    ['null', 'kw'],
    [');', 'punc']
  ]
];

const EDITED_LINE = 7;
</script>

<template>
  <section class="ln-how-section">
    <div class="ln-how-inner">
      <div v-reveal="0" class="ln-how-copy-block">
        <h2 class="ln-how-title">One command, and the code is yours.</h2>
        <p class="ln-how-sub">
          The CLI copies the component's source into your Vite, Nuxt or Astro project. No wrapper library, no runtime
          dependency, nothing to lock you in.
        </p>
        <RouterLink to="/get-started/installation" class="ln-how-btn">
          Installation guide
          <HugeiconsIcon :icon="ArrowRight02Icon" :size="17" :stroke-width="1.8" />
        </RouterLink>
      </div>

      <div v-reveal="0.07" class="ln-how-visual">
        <div class="ln-how-window ln-how-terminal">
          <div class="ln-how-bar">
            Terminal
            <HeroCopyCommand :command="COMMAND" button-class="ln-how-copy" />
          </div>
          <div class="ln-how-well ln-how-term">
            <div class="ln-how-term-line">
              <span class="ln-how-t-punc">$</span>
              {{ COMMAND }}
            </div>
            <div v-for="line in OUTPUT" :key="line" class="ln-how-term-line ln-how-t-muted">{{ line }}</div>
          </div>
        </div>

        <div class="ln-how-window ln-how-editor" role="img" aria-label="Aurora.vue open in your editor as plain source">
          <div class="ln-how-bar">Aurora.vue</div>
          <pre class="ln-how-well ln-how-code"><code><span
            v-for="(line, index) in CODE"
            :key="index"
            :class="['ln-how-line', { 'is-edited': index === EDITED_LINE }]"
          ><template v-if="line.length"><span
            v-for="([text, kind], part) in line"
            :key="part"
            :class="`ln-how-t-${kind}`"
          >{{ text }}</span></template><template v-else> </template></span></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>
