<script setup>
defineProps({
  /** line = text row, title = heading, card = stat/card body */
  shape: {
    type: String,
    default: 'line',
    validator: (v) => ['line', 'title', 'card'].includes(v),
  },
})
</script>

<template>
  <div class="skeleton" :class="`shape-${shape}`" aria-hidden="true" />
</template>

<style scoped>
.skeleton {
  width: 100%;
  background: linear-gradient(
    90deg,
    var(--color-neutral-soft) 25%,
    var(--color-surface-alt) 50%,
    var(--color-neutral-soft) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-input);
  animation: shimmer 1.4s linear infinite;
}
.shape-line {
  height: var(--space-4);
}
.shape-title {
  height: var(--space-6);
  width: 50%;
}
.shape-card {
  height: var(--space-10);
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
</style>
