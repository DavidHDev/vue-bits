<template>
  <section class="docs-section changelog">
    <div class="docs-page-header">
      <h1 class="docs-title">Changelog</h1>
      <CopyPageButton />
    </div>

    <p class="docs-lead">{{ CHANGELOG_DESCRIPTION }}</p>

    <p v-if="months.length === 0" class="docs-paragraph">Nothing new yet. Check back soon.</p>

    <section v-for="month in visibleMonths" :key="month.month" class="changelog-month" :aria-label="month.label">
      <h2 class="changelog-month-title">{{ month.label }}</h2>
      <ol class="changelog-days">
        <li v-for="day in month.days" :key="day.date" class="changelog-day">
          <time class="changelog-date" :datetime="day.date">{{ dayLabel(day.date) }}</time>
          <ul class="changelog-entries">
            <li v-for="entry in day.entries" :key="entry.id" class="changelog-entry">
              <div class="changelog-entry-head">
                <RouterLink class="changelog-name" :to="entry.path">{{ entry.name }}</RouterLink>
                <span class="changelog-meta">
                  <span class="changelog-kind" :class="`is-${entry.type}`">{{ KIND_LABELS[entry.type] }}</span>
                  <span aria-hidden="true">{{ ' · ' }}</span>
                  {{ entry.type === 'launch' ? `${entry.components?.length ?? 0} components` : entry.category }}
                </span>
              </div>
              <p class="changelog-note">{{ entry.note }}</p>
              <p v-if="entry.type === 'launch'" class="changelog-includes">
                <template v-for="(component, index) in entry.components" :key="component.path">
                  <template v-if="index > 0">{{ ', ' }}</template>
                  <RouterLink :to="component.path">{{ component.name }}</RouterLink>
                </template>
              </p>
            </li>
          </ul>
        </li>
      </ol>
    </section>

    <button
      v-if="!showAll && months.length > INITIAL_MONTHS"
      type="button"
      class="changelog-older"
      @click="showAll = true"
    >
      Show earlier months
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { CHANGELOG_DESCRIPTION, getChangelogEntries, type ChangelogEntry, type ChangelogType } from '@/utils/changelog';
import CopyPageButton from './CopyPageButton.vue';

type Day = { date: string; entries: ChangelogEntry[] };
type Month = { month: string; label: string; days: Day[] };

const INITIAL_MONTHS = 6;
const KIND_LABELS: Record<ChangelogType, string> = { launch: 'New category', added: 'New', updated: 'Update' };

const toDate = (date: string) => new Date(`${date}T00:00:00Z`);
const monthLabel = (date: string) =>
  toDate(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const dayLabel = (date: string) =>
  toDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

const groupByMonth = (entries: ChangelogEntry[]) => {
  const months: Month[] = [];
  entries.forEach(entry => {
    const month = entry.date.slice(0, 7);
    let group = months[months.length - 1];
    if (!group || group.month !== month) {
      group = { month, label: monthLabel(entry.date), days: [] };
      months.push(group);
    }
    let day = group.days[group.days.length - 1];
    if (!day || day.date !== entry.date) {
      day = { date: entry.date, entries: [] };
      group.days.push(day);
    }
    day.entries.push(entry);
  });
  return months;
};

const showAll = ref(false);
const months = groupByMonth(getChangelogEntries());
const visibleMonths = computed(() => (showAll.value ? months : months.slice(0, INITIAL_MONTHS)));

onMounted(() => window.scrollTo(0, 0));
</script>
