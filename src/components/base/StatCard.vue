<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: null },
  icon: { type: [Object, Function], default: null },
  trend: {
    type: String,
    default: null,
    validator: (v) => v == null || ['up', 'down', 'flat'].includes(v),
  },
})
</script>

<template>
  <div class="stat-card">
    <div class="stat-head">
      <span class="stat-label">{{ label }}</span>
      <component :is="icon" v-if="icon" :size="18" class="stat-icon" aria-hidden="true" />
    </div>
    <div class="stat-value text-numeric">{{ value }}</div>
    <div v-if="hint" class="stat-hint" :class="trend ? `trend-${trend}` : ''">{{ hint }}</div>
  </div>
</template>

<style scoped>
.stat-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: var(--space-5);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.stat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-secondary);
}
.stat-label {
  font-size: var(--text-label);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.stat-icon {
  color: var(--color-brand-navy);
}
.stat-value {
  font-size: var(--text-stat-value);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: var(--line-height-tight);
}
.stat-hint {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.trend-up { color: var(--color-success); }
.trend-down { color: var(--color-danger); }
.trend-flat { color: var(--color-text-muted); }
</style>
