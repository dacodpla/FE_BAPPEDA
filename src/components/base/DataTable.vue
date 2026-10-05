<script setup>
import { useI18n } from 'vue-i18n'
import { useBreakpoint } from '@/composables/useBreakpoint'

/**
 * columns: [{ key, label, align?: 'left'|'right'|'center', width?: string,
 *             mobile?: 'title'|'subtitle'|'meta'|'hidden' }]
 * rows: array of records; each record's key is column.key
 * Row slot: <template #cell-key="{ row, value }">
 */
defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: null },
  rowKey: { type: [String, Function], default: 'id' },
})

const { t } = useI18n()
const { isMobile } = useBreakpoint()

function keyOf(row, i, rowKey) {
  if (typeof rowKey === 'function') return rowKey(row)
  return row?.[rowKey] ?? i
}
</script>

<template>
  <div class="data-table-wrapper">
    <!-- Desktop / tablet table -->
    <table v-if="!isMobile" class="data-table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[`align-${col.align || 'left'}`]"
            :style="col.width ? { width: col.width } : null"
            scope="col"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="state-cell">{{ t('table.loading') }}</td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="columns.length" class="state-cell">
            {{ emptyText || t('table.empty') }}
          </td>
        </tr>
        <tr v-for="(row, i) in rows" v-else :key="keyOf(row, i, rowKey)">
          <td
            v-for="col in columns"
            :key="col.key"
            :class="[
              `align-${col.align || 'left'}`,
              col.align === 'right' ? 'text-numeric' : '',
            ]"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile: stacked cards -->
    <div v-else class="mobile-list">
      <div v-if="loading" class="mobile-state">{{ t('table.loading') }}</div>
      <div v-else-if="!rows.length" class="mobile-state">
        {{ emptyText || t('table.empty') }}
      </div>
      <article
        v-for="(row, i) in rows"
        v-else
        :key="keyOf(row, i, rowKey)"
        class="mobile-card"
      >
        <div
          v-for="col in columns.filter((c) => c.mobile !== 'hidden')"
          :key="col.key"
          class="mobile-row"
          :class="`mobile-${col.mobile || 'meta'}`"
        >
          <span v-if="(col.mobile || 'meta') === 'meta'" class="mobile-label">
            {{ col.label }}
          </span>
          <span class="mobile-value" :class="col.align === 'right' ? 'text-numeric' : ''">
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </span>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  overflow: hidden;
}
.data-table th,
.data-table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  vertical-align: middle;
  font-size: var(--text-body);
}
.data-table th {
  background-color: var(--color-surface-alt);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--text-label);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border-bottom: 1px solid var(--color-border);
}
.data-table tbody tr + tr td {
  border-top: 1px solid var(--color-border);
}
.text-numeric { font-variant-numeric: tabular-nums; }
.align-right { text-align: right; }
.align-center { text-align: center; }

.state-cell {
  text-align: center;
  padding: var(--space-6) var(--space-4);
  color: var(--color-text-muted);
}

.mobile-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.mobile-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.mobile-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
}
.mobile-title .mobile-value {
  font-size: var(--text-card-title);
  font-weight: var(--font-weight-semibold);
}
.mobile-subtitle .mobile-value {
  color: var(--color-text-secondary);
}
.mobile-label {
  font-size: var(--text-label);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.mobile-state {
  text-align: center;
  padding: var(--space-6) var(--space-4);
  color: var(--color-text-muted);
}
</style>
