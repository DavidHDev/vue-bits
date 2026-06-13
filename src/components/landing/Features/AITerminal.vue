<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

type Token = { cls: 'kw' | 'comp' | 'tag' | 'attr' | 'punc' | 'num' | 'str'; text: string };

type Convo = { q: string; lines: Token[]; jsx: Token[] };

const AI_CONVOS: Convo[] = [
  {
    q: 'add a glowing card',
    lines: [
      { cls: 'kw', text: 'import ' },
      { cls: 'comp', text: 'BorderGlow' },
      { cls: 'kw', text: ' from ' },
      { cls: 'str', text: '"./BorderGlow"' }
    ],
    jsx: [
      { cls: 'tag', text: '<' },
      { cls: 'comp', text: 'BorderGlow' },
      { cls: 'attr', text: ' glowIntensity' },
      { cls: 'punc', text: '=' },
      { cls: 'num', text: '{0.8}' },
      { cls: 'tag', text: ' />' }
    ]
  },
  {
    q: 'animate hero text',
    lines: [
      { cls: 'kw', text: 'import ' },
      { cls: 'comp', text: 'SplitText' },
      { cls: 'kw', text: ' from ' },
      { cls: 'str', text: '"./SplitText"' }
    ],
    jsx: [
      { cls: 'tag', text: '<' },
      { cls: 'comp', text: 'SplitText' },
      { cls: 'attr', text: ' animation' },
      { cls: 'punc', text: '=' },
      { cls: 'str', text: '"fadeUp"' },
      { cls: 'tag', text: ' />' }
    ]
  },
  {
    q: 'particle background',
    lines: [
      { cls: 'kw', text: 'import ' },
      { cls: 'comp', text: 'Ballpit' },
      { cls: 'kw', text: ' from ' },
      { cls: 'str', text: '"./Ballpit"' }
    ],
    jsx: [
      { cls: 'tag', text: '<' },
      { cls: 'comp', text: 'Ballpit' },
      { cls: 'attr', text: ' count' },
      { cls: 'punc', text: '=' },
      { cls: 'num', text: '{200}' },
      { cls: 'tag', text: ' />' }
    ]
  }
];

const idx = ref(0);
const typed = ref('');
const phase = ref<'prompt' | 'thinking' | 'code'>('prompt');
const codeLines = ref(0);

let timers: ReturnType<typeof setTimeout>[] = [];

const conv = computed(() => AI_CONVOS[idx.value]);

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function schedule(fn: () => void, ms: number) {
  const id = setTimeout(fn, ms);
  timers.push(id);
}

function runConvo(i: number) {
  const c = AI_CONVOS[i];
  typed.value = '';
  phase.value = 'prompt';
  codeLines.value = 0;

  let delay = 300;
  for (let k = 0; k <= c.q.length; k++) {
    const slice = c.q.slice(0, k);
    schedule(() => {
      typed.value = slice;
    }, delay);
    delay += 50;
  }

  schedule(() => {
    phase.value = 'thinking';
  }, delay);
  delay += 900;

  schedule(() => {
    phase.value = 'code';
    codeLines.value = 1;
  }, delay);
  delay += 280;
  schedule(() => {
    codeLines.value = 2;
  }, delay);
  delay += 280;
  schedule(() => {
    codeLines.value = 3;
  }, delay);
  delay += 2400;

  schedule(() => {
    idx.value = (idx.value + 1) % AI_CONVOS.length;
  }, delay);
}

onMounted(() => {
  runConvo(0);
});

onUnmounted(() => {
  clearTimers();
});

watch(idx, i => {
  if (i === 0) return;

  clearTimers();
  runConvo(i);
});
</script>

<template>
  <div class="ln-feat-aichat">
    <div :key="idx" class="ln-feat-aichat-inner">
      <div class="ln-feat-aichat-head">
        <div class="ln-feat-aichat-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span class="ln-feat-aichat-title">Editor</span>
      </div>

      <div class="ln-feat-aichat-prompt-row">
        <span class="ln-feat-aichat-chevron">$</span>

        <span class="ln-feat-aichat-prompt">
          {{ typed }}
        </span>

        <span v-if="phase === 'prompt'" class="ln-feat-aichat-cursor" />
      </div>

      <div v-if="phase === 'thinking'" class="ln-feat-aichat-thinking">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div v-if="phase === 'code'" class="ln-feat-aichat-code-block">
        <div v-if="codeLines >= 1" class="ln-feat-aichat-code-line">
          <span class="ln-feat-aichat-ln">1</span>

          <template v-for="(t, j) in conv.lines" :key="j">
            <span :class="`ac-${t.cls}`">
              {{ t.text }}
            </span>
          </template>
        </div>

        <div v-if="codeLines >= 2" class="ln-feat-aichat-code-line">
          <span class="ln-feat-aichat-ln">2</span>
        </div>

        <div v-if="codeLines >= 3" class="ln-feat-aichat-code-line">
          <span class="ln-feat-aichat-ln">3</span>

          <template v-for="(t, j) in conv.jsx" :key="j">
            <span :class="`ac-${t.cls}`">
              {{ t.text }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
