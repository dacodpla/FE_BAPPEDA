<script setup>
import { computed } from 'vue'
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-vue-next'

const props = defineProps({
  tone: {
    type: String,
    default: 'danger',
    validator: (v) => ['danger', 'warning', 'success', 'info'].includes(v),
  },
})

const icon = computed(
  () =>
    ({ danger: AlertCircle, warning: AlertTriangle, success: CheckCircle, info: Info })[props.tone],
)
// Errors interrupt; the rest are polite status updates.
const role = computed(() => (props.tone === 'danger' ? 'alert' : 'status'))
</script>

<template>
  <div class="alert-banner" :class="`tone-${tone}`" :role="role">
    <component :is="icon" :size="18" class="icon" aria-hidden="true" />
    <div class="body"><slot /></div>
  </div>
</template>

<style scoped>
.alert-banner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid transparent;
  border-radius: var(--radius-input);
  font-size: var(--text-body);
}
.icon {
  flex-shrink: 0;
  margin-top: 1px;
}
.body {
  flex: 1;
  min-width: 0;
}
.tone-danger {
  background-color: var(--color-danger-soft);
  border-color: var(--color-danger);
  color: var(--color-on-danger-soft);
}
.tone-warning {
  background-color: var(--color-warning-soft);
  border-color: var(--color-warning);
  color: var(--color-on-warning-soft);
}
.tone-success {
  background-color: var(--color-success-soft);
  border-color: var(--color-success);
  color: var(--color-on-success-soft);
}
.tone-info {
  background-color: var(--color-info-soft);
  border-color: var(--color-info);
  color: var(--color-info);
}
</style>
