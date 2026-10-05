<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { statusMeta } from '@/constants/statuses'

const props = defineProps({
  status: { type: String, required: true },
})

const { t } = useI18n()
const meta = computed(() => statusMeta(props.status))
const label = computed(() => t(meta.value.labelKey))
</script>

<template>
  <span class="status-badge" :class="`tone-${meta.tone}`">
    <span class="dot" aria-hidden="true" />
    <span class="label">{{ label }}</span>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 2px var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-label);
  font-weight: var(--font-weight-semibold);
  line-height: 1.6;
  border: 1px solid transparent;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-pill);
  background-color: currentColor;
  opacity: 0.75;
}

.tone-neutral {
  background-color: var(--color-neutral-soft);
  color: var(--color-text-secondary);
}
.tone-warning {
  background-color: var(--color-warning-soft);
  color: var(--color-on-warning-soft);
}
.tone-success {
  background-color: var(--color-success-soft);
  color: var(--color-on-success-soft);
}
.tone-danger {
  background-color: var(--color-danger);
  color: var(--color-text-inverse);
}
.tone-danger-soft {
  background-color: var(--color-danger-soft);
  color: var(--color-on-danger-soft);
}
.tone-info {
  background-color: var(--color-info-soft);
  color: var(--color-info);
}
</style>
