<script setup lang="ts">
export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

defineProps<{ data: PropRow[] }>();
</script>

<template>
  <div class="prop-table-section">
    <div class="prop-table-frame">
      <div class="prop-table-heading">
        <h2>Props</h2>
        <span>{{ data.length }} {{ data.length === 1 ? 'property' : 'properties' }}</span>
      </div>

      <div class="prop-table-wrap">
        <div class="prop-table-surface">
          <table class="prop-table">
            <caption>Component properties</caption>
            <colgroup>
              <col class="prop-column-name" />
              <col class="prop-column-type" />
              <col class="prop-column-default" />
              <col class="prop-column-description" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">Type</th>
                <th scope="col">Default</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prop, index) in data" :key="index">
                <td>
                  <code class="prop-name">{{ prop.name }}</code>
                </td>
                <td class="prop-type">{{ prop.type }}</td>
                <td>
                  <code class="prop-default">{{ prop.default?.length ? prop.default : '—' }}</code>
                </td>
                <td class="prop-desc">{{ prop.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="prop-cards">
        <div class="prop-cards-surface">
          <div v-for="(prop, index) in data" :key="index" class="prop-card">
            <div class="prop-card-header">
              <code class="prop-name">{{ prop.name }}</code>
              <span class="prop-card-type">{{ prop.type }}</span>
            </div>
            <p class="prop-card-desc">{{ prop.description }}</p>
            <div class="prop-card-default">
              <span class="prop-card-label">Default</span>
              <code class="prop-default">{{ prop.default?.length ? prop.default : '—' }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
