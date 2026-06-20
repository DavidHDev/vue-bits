<template>
  <div class="contribute-container">
    <p class="contribute-heading">Help improve this component</p>
    <p class="contribute-subtext">Found a bug or have an idea? Let us know on GitHub.</p>
    <div class="contribute-links">
      <a :href="bugReportUrl" class="contribute-link" target="_blank" rel="noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M8 2l1.88 1.88" />
          <path d="M14.12 3.88 16 2" />
          <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
          <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
          <path d="M12 20v-9" />
          <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
          <path d="M6 13H2" />
          <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
          <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
          <path d="M22 13h-4" />
          <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
        </svg>
        Report an issue
      </a>
      <a :href="featureRequestUrl" class="contribute-link" target="_blank" rel="noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
          />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
        Request a feature
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const ISSUE_BASE = 'https://github.com/DavidHDev/vue-bits/issues/new';

const route = useRoute();

const title = computed(() => `${route.params.category}/${route.params.subcategory}`);

const bugReportUrl = computed(
  () => `${ISSUE_BASE}?template=1-bug-report.yml&title=${encodeURIComponent(`[BUG]: ${title.value}`)}&labels=bug`
);

const featureRequestUrl = computed(
  () =>
    `${ISSUE_BASE}?template=2-feature-request.yml&title=${encodeURIComponent(`[FEAT]: ${title.value}`)}&labels=enhancement`
);
</script>
