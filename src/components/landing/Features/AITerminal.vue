<script setup lang="ts">
import { useInView } from '@/composables/useInView';
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type Token = { cls: 'kw' | 'comp' | 'tag' | 'attr' | 'punc' | 'num' | 'str'; text: string };
type Convo = { q: string; lines: Token[]; jsx: Token[] };

const AI_CONVOS: Convo[] = [
  {
    q: 'add a glowing card',
    lines: [
      { cls: 'kw', text: 'import ' },
      { cls: 'comp', text: 'BorderGlow' },
      { cls: 'kw', text: ' from ' },
      { cls: 'str', text: '"./BorderGlow.vue"' }
    ],
    jsx: [
      { cls: 'tag', text: '<' },
      { cls: 'comp', text: 'BorderGlow' },
      { cls: 'attr', text: ' :glow-intensity' },
      { cls: 'punc', text: '=' },
      { cls: 'num', text: '"0.8"' },
      { cls: 'tag', text: ' />' }
    ]
  },
  {
    q: 'animate hero text',
    lines: [
      { cls: 'kw', text: 'import ' },
      { cls: 'comp', text: 'SplitText' },
      { cls: 'kw', text: ' from ' },
      { cls: 'str', text: '"./SplitText.vue"' }
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
      { cls: 'str', text: '"./Ballpit.vue"' }
    ],
    jsx: [
      { cls: 'tag', text: '<' },
      { cls: 'comp', text: 'Ballpit' },
      { cls: 'attr', text: ' :count' },
      { cls: 'punc', text: '=' },
      { cls: 'num', text: '"200"' },
      { cls: 'tag', text: ' />' }
    ]
  }
];

const root = ref<HTMLElement | null>(null);
const visible = useInView(root);
const idx = ref(0);
const typed = ref('');
const phase = ref<'prompt' | 'thinking' | 'code'>('prompt');
const codeLines = ref(0);
let timers: number[] = [];

const conv = computed(() => AI_CONVOS[idx.value]);

const clearTimers = () => {
  timers.forEach(id => window.clearTimeout(id));
  timers = [];
};

const schedule = (fn: () => void, ms: number) => {
  timers.push(window.setTimeout(fn, ms));
};

watch(
  [idx, visible],
  () => {
    clearTimers();
    if (!visible.value) return;
    const current = AI_CONVOS[idx.value];
    typed.value = '';
    phase.value = 'prompt';
    codeLines.value = 0;

    let delay = 300;
    for (let c = 0; c <= current.q.length; c++) {
      const slice = current.q.slice(0, c);
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
  },
  { immediate: true }
);

onBeforeUnmount(clearTimers);
</script>

<template>
  <div ref="root" class="ln-feat-aichat">
    <Transition name="ln-feat-aichat-swap" mode="out-in">
      <div :key="idx" class="ln-feat-aichat-inner">
        <div class="ln-feat-aichat-head">
          <div class="ln-feat-aichat-dots">
            <span />
            <span />
            <span />
          </div>
          <span class="ln-feat-aichat-title">Editor</span>
        </div>

        <div class="ln-feat-aichat-prompt-row">
          <span class="ln-feat-aichat-chevron">$</span>
          <span class="ln-feat-aichat-prompt">{{ typed }}</span>
          <span v-if="phase === 'prompt'" class="ln-feat-aichat-cursor" />
        </div>

        <div v-if="phase === 'thinking'" class="ln-feat-aichat-thinking">
          <span />
          <span />
          <span />
        </div>

        <div v-if="phase === 'code'" class="ln-feat-aichat-code-block">
          <div v-if="codeLines >= 1" class="ln-feat-aichat-code-line">
            <span class="ln-feat-aichat-ln">1</span>
            <span v-for="(t, j) in conv.lines" :key="j" :class="`ac-${t.cls}`">{{ t.text }}</span>
          </div>
          <div v-if="codeLines >= 2" class="ln-feat-aichat-code-line"><span class="ln-feat-aichat-ln">2</span></div>
          <div v-if="codeLines >= 3" class="ln-feat-aichat-code-line">
            <span class="ln-feat-aichat-ln">3</span>
            <span v-for="(t, j) in conv.jsx" :key="j" :class="`ac-${t.cls}`">{{ t.text }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.ln-feat-aichat-swap-enter-active,
.ln-feat-aichat-swap-leave-active {
  transition: opacity 0.3s ease;
}

.ln-feat-aichat-swap-enter-from,
.ln-feat-aichat-swap-leave-to {
  opacity: 0;
}

.ln-feat-aichat-code-line {
  animation: ln-feat-aichat-line 0.2s ease-out both;
}

@keyframes ln-feat-aichat-line {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
}
</style>
