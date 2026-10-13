<script setup>
// Sticky action bar for multi-step forms. On mobile it sits above the bottom nav.
</script>

<template>
  <div class="form-actions">
    <div class="start"><slot name="start" /></div>
    <div class="end"><slot name="end" /></div>
  </div>
</template>

<style scoped>
.form-actions {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.start,
.end {
  display: flex;
  gap: var(--space-3);
}
@media (max-width: 767px) {
  .form-actions {
    bottom: var(--bottom-nav-height);
    margin: 0 calc(var(--space-4) * -1);
    border-radius: 0;
    border-left: 0;
    border-right: 0;
  }
}
</style>
