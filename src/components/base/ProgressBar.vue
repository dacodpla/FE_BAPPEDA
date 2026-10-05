<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  max: { type: Number, default: 100 },
  tone: {
    type: String,
    default: 'brand',
    validator: (v) => ['brand', 'success', 'warning', 'danger'].includes(v),
  },
  ariaLabel: { type: String, default: null },
})

const percent = computed(() => {
  if (!props.max) return 0
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})
</script>

<template>
  <div
    class="progress"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-label="ariaLabel || undefined"
  >
    <div class="fill" :class="`tone-${tone}`" :style="{ width: `${percent}%` }" />
  </div>
</template>

<style scoped>
.progress {
  width: 100%;
  height: 8px;
  background-color: var(--color-neutral-soft);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width var(--transition-base);
}
.tone-brand { background-color: var(--color-brand-navy); }
.tone-success { background-color: var(--color-success); }
.tone-warning { background-color: var(--color-warning); }
.tone-danger { background-color: var(--color-danger); }
</style>
