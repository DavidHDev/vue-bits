<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { FiEdit3, FiPackage, FiShield } from 'vue-icons-plus/fi';

import './Ownership.css';

type TokenKind = 'kw' | 'comp' | 'attr' | 'str' | 'num' | 'punc';
type Token = [string, TokenKind];

interface TreeRow {
  depth: number;
  name: string;
  kind: 'dir' | 'file';
  added?: boolean;
  active?: boolean;
}

const POINTS = [
  {
    icon: FiPackage,
    title: 'No wrapper library',
    desc: 'Components use ogl, GSAP and friends directly, no vue-bits dependency.'
  },
  {
    icon: FiEdit3,
    title: 'Edit anything',
    desc: 'It is your source now. Change the shader, the props, the styling, all of it.'
  },
  {
    icon: FiShield,
    title: 'No lock-in',
    desc: 'If this site vanished tomorrow, everything you already added keeps working.'
  }
];

const TREE: TreeRow[] = [
  { depth: 0, name: 'your-project', kind: 'dir' },
  { depth: 1, name: 'src', kind: 'dir' },
  { depth: 2, name: 'components', kind: 'dir' },
  { depth: 3, name: 'Aurora.vue', kind: 'file', added: true, active: true },
  { depth: 3, name: 'Aurora.css', kind: 'file', added: true },
  { depth: 2, name: 'App.vue', kind: 'file' },
  { depth: 1, name: 'package.json', kind: 'file' }
];

const CODE: Token[][] = [
  [
    ['import ', 'kw'],
    ['{ Renderer, Program, Mesh }', 'attr'],
    [' from ', 'kw'],
    ["'ogl'", 'str'],
    [';', 'punc']
  ],
  [
    ['import ', 'kw'],
    ['{ ref, onMounted }', 'attr'],
    [' from ', 'kw'],
    ["'vue'", 'str'],
    [';', 'punc']
  ],
  [],
  [
    ['const ', 'kw'],
    ['props', 'attr'],
    [' = ', 'punc'],
    ['defineProps', 'comp'],
    ['({', 'punc']
  ],
  [
    ['  colorStops', 'attr'],
    [': [', 'punc'],
    ["'#5227FF'", 'str'],
    [', ', 'punc'],
    ["'#7cff67'", 'str'],
    ['],', 'punc']
  ],
  [
    ['  speed', 'attr'],
    [': ', 'punc'],
    ['1', 'num'],
    [',', 'punc']
  ],
  [
    ['  blend', 'attr'],
    [': ', 'punc'],
    ['0.5', 'num'],
    [',', 'punc']
  ],
  [['});', 'punc']],
  [],
  [
    ['const ', 'kw'],
    ['ctn', 'attr'],
    [' = ', 'punc'],
    ['ref', 'comp'],
    ['(', 'punc'],
    ['null', 'kw'],
    [');', 'punc']
  ]
];

const sectionEl = ref<HTMLDivElement | null>(null);
const visible = ref(false);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!sectionEl.value) return;

  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.value = true;
          observer?.disconnect();
        }
      }
    },
    { threshold: 0.1, rootMargin: '-60px' }
  );

  observer.observe(sectionEl.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <section class="ln-own-section">
    <div class="ln-own-inner">
      <div ref="sectionEl" :class="['ln-own-grid', { 'is-visible': visible }]">
        <div class="ln-own-visual">
          <div
            class="ln-own-window"
            role="img"
            aria-label="An editor showing Aurora.vue added to your own project as plain, editable source that imports ogl directly"
          >
            <div class="ln-own-tabs">
              <span class="ln-own-tab is-active">Aurora.vue</span>
              <span class="ln-own-tab">Aurora.css</span>
            </div>

            <div class="ln-own-body">
              <div class="ln-own-tree">
                <div
                  v-for="row in TREE"
                  :key="row.name"
                  :class="['ln-own-tree-row', { 'is-added': row.added, 'is-active': row.active }]"
                  :style="{ paddingLeft: `${8 + row.depth * 11}px` }"
                >
                  <span class="ln-own-tree-name">{{ row.name }}{{ row.kind === 'dir' ? '/' : '' }}</span>
                </div>
              </div>

              <div class="ln-own-code">
                <div v-for="(line, i) in CODE" :key="i" class="ln-own-code-line">
                  <span class="ln-own-code-num" aria-hidden="true">{{ i + 1 }}</span>
                  <span class="ln-own-code-text">
                    <span v-for="(token, j) in line" :key="j" :class="`ln-own-t-${token[1]}`">{{ token[0] }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="ln-own-status">
              <span class="ln-own-status-item">uses ogl directly</span>
              <span class="ln-own-status-item">no vue-bits package</span>
            </div>
          </div>
        </div>

        <div class="ln-own-copy">
          <h2 class="ln-own-title">The code is yours</h2>
          <p class="ln-own-subtitle">
            Vue Bits isn't a package you depend on. Each component lands in your repo as source you own.
          </p>

          <ul class="ln-own-points">
            <li v-for="point in POINTS" :key="point.title" class="ln-own-point">
              <span class="ln-own-point-icon" aria-hidden="true">
                <component :is="point.icon" :size="13" />
              </span>
              <h3 class="ln-own-point-title">{{ point.title }}</h3>
              <p class="ln-own-point-desc">{{ point.desc }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
